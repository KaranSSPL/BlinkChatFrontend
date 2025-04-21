import { useRef, useState } from 'react'
import ChatInputBar from '../InputBar/ChatInputBar';
import styles from "./Chatbot.module.scss"
import ChatHeader from '../ChatHeader/ChatHeader';
import { ChatHistory, Roles } from '../../types';

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleFileUpload = (file: File) => {
        console.log("File selected:", file);
    };

    const handleSendText = async (message: string) => {
        try {
            setChatHistory(prevHistory => [...prevHistory, { role: Roles.User, message, timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' }) }]);

            setIsGenerating(true)
            setLoading(true)

            setChatHistory(prevHistory => [
                ...prevHistory,
                {
                    role: Roles.Bot,
                    message: "",
                    timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(`http://localhost:5273/api/AI/chat`, {
                method: 'POST',
                body: JSON.stringify({ query: message }),
                headers: { "content-type": "application/json" },
                signal: controller.signal
            });

            if (!response.ok || !response.body) {
                setLoading(false);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let accumulatedMessage = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                accumulatedMessage += decoder.decode(value, { stream: true });

                setChatHistory(prevHistory => {
                    const updatedHistory = [...prevHistory];
                    updatedHistory[updatedHistory.length - 1] = {
                        role: Roles.Bot,
                        message: accumulatedMessage,
                        timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    return updatedHistory;
                });
            }
        } catch (error) {
            if ((error as any).name !== 'AbortError') {
                setLoading(false);
            }
        } finally {
            setIsGenerating(false);
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className={styles.ChatContainer}>
            <ChatHeader chatHistory={chatHistory} loading={loading} />
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