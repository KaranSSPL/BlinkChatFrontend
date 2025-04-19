import { useRef, useState } from 'react'
import ChatInputBar from '../InputBar/ChatInputBar';
import styles from "./Chatbot.module.scss"
import ChatHeader from '../ChatHeader/ChatHeader';
import { ChatHistory, Roles } from '../../types';

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleFileUpload = (file: File) => {
        console.log("File selected:", file);
    };

    const handleSendText = async (message: string) => {
        try {
            setChatHistory(prevHistory => [...prevHistory, { role: Roles.User, message, timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setIsGenerating(true)

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(`http://localhost:5273/api/AI/get-response`, {
                method: 'POST',
                body: JSON.stringify({ question: message }),
                headers: { "content-type": "application/json" },
                signal: controller.signal
            });

            if (!response.body) {
                throw new Error("ReadableStream not supported or empty");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let accumulatedMessage = "";

            setChatHistory(prevHistory => [...prevHistory, { role: Roles.Bot, message: "", timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }) }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulatedMessage += decoder.decode(value, { stream: true });

                setChatHistory(prevHistory => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[updatedHistory.length - 1] = { role: Roles.Bot, message: accumulatedMessage, timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }) };
                    return updatedHistory;
                });
            }
        } catch (error) {
            if ((error as any).name === 'AbortError') {
                console.log('Fetch aborted by user');
            } else {
                console.error('Error during message streaming:', error);
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className={styles.ChatContainer}>
            <ChatHeader chatHistory={chatHistory} />
            <ChatInputBar handleSend={handleSendText} handleFileUpload={handleFileUpload} isGenerating={isGenerating}
                handleStop={() => {
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                        setIsGenerating(false);
                    }
                }} />
        </div>
    )
}

export default Chatbot;