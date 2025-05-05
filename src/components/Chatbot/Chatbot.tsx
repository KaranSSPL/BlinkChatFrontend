import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInputBar from "../InputBar/ChatInputBar";
import styles from "./Chatbot.module.scss";
import ChatHeader from "../ChatHeader/ChatHeader";
import { ChatHistory, Roles } from "../../types";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileUpload = (file: File) => {
    console.log("File selected:", file);
  };

  const sessionId = uuidv4();
  sessionStorage.setItem("sessionId", sessionId);

  const handleSendText = async (message: string, isRegenerate: boolean = false) => {
    try {
      if (!isRegenerate) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            role: Roles.User,
            message,
            timestamp: new Date().toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }

      setIsGenerating(true);
      setLoading(true);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          role: Roles.Bot,
          message: "",
          timestamp: new Date().toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(`http://localhost:5273/api/agent`, {
        method: "POST",
        body: JSON.stringify({
          question: message,
          sessionId: sessionId,
          regenerate: false,
          reset: false,
        }),
        headers: { "content-type": "application/json" },
        signal: controller.signal,
      });

      if (response.status === 400) {
        console.error("Bad Request: Likely a validation error.");
        setLoading(false);
        return;
      }

      if (response.status === 500) {
        console.error("Server Error: Something went wrong on the backend.");
        setLoading(false);
        return;
      }

      if (response.status !== 200 || !response.body) {
        console.error(`Unexpected status: ${response.status}`);
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

        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];

          const lastIndex = updatedHistory.map((x) => x.role).lastIndexOf(Roles.Bot);

          if (lastIndex !== -1) {
            updatedHistory[lastIndex] = {
              ...updatedHistory[lastIndex],
              message: accumulatedMessage,
              timestamp: new Date().toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }

          return updatedHistory;
        });
      }
    } catch (error) {
      if ((error as any).name !== "AbortError") {
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
      <ChatHeader
        chatHistory={chatHistory}
        loading={loading}
        setChatHistory={setChatHistory}
        abortControllerRef={abortControllerRef}
        handleSendText={handleSendText}
      />
      <ChatInputBar
        handleSend={handleSendText}
        handleFileUpload={handleFileUpload}
        isGenerating={isGenerating}
        handleStop={() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsGenerating(false);
          }
        }}
      />
    </div>
  );
};

export default Chatbot;
