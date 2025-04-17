import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeExternalLinks from 'rehype-external-links';

import ChatInputBar from './components/InputBar/ChatInputBar';
import './App.css'

function App() {

  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', message: string }[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSendText = async (message: string) => {
    try {
      setChatHistory(prevHistory => [...prevHistory, { role: 'user', message }]);

      const response = await fetch(`http://localhost:5273/api/AI/get-response`, {
        method: 'POST',
        body: JSON.stringify({ question: message }),
        headers: { "content-type": "application/json" }
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported or empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedMessage = "";

      setChatHistory(prevHistory => [...prevHistory, { role: 'bot', message: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedMessage += decoder.decode(value, { stream: true });

        setChatHistory(prevHistory => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1] = { role: 'bot', message: accumulatedMessage };
          return updatedHistory;
        });
      }
    } catch (error) {
      console.error('Error during message streaming:', error);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="card">
          <h1 className="title">Blink Chat</h1>
          <div className='story'>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`chat-row ${chat.role === 'user' ? 'user' : ''}`}
              >
                <h4 className='label'>{chat.role === 'user' ? 'You' : 'Bot'}</h4>
                <div className='text'>
                  <ReactMarkdown rehypePlugins={[[rehypeRaw], [rehypeExternalLinks, { target: '_blank' }], [rehypeKatex]]}>
                    {chat.message}
                  </ReactMarkdown>

                </div>
              </div>
            ))}
          </div>
          <ChatInputBar handleSend={handleSendText} />
        </div>
      </div>
    </>
  )
}

export default App
