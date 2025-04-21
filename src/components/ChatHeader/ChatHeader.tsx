import React, { useEffect, useRef, useState } from "react"
import { ChatHeaderProps, Roles } from "../../types"
import styles from "./ChatHeader.module.scss"
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import ChatStamp from "../ChatStamp/ChatStamp";

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatHistory }) => {
    
    const [timeStamp, setTimeStamp] = useState<boolean>(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatHistory])

    return (
        <div className={styles.chatBox}>
            {chatHistory.map((chat, index) => (
                <div
                    key={index}
                    className={`${styles.chat_row} ${chat.role === Roles.User ? styles.user : styles.bot}`}>
                    <ChatStamp chat={chat} />
                    <div className={styles.text} onMouseEnter={() => setTimeStamp(true)}
                        onMouseLeave={() => setTimeStamp(false)}
                        ref={index === chatHistory.length - 1 ? chatEndRef : null}>
                        <ReactMarkdown skipHtml={false} rehypePlugins={[[rehypeRaw], [rehypeExternalLinks, { target: '_blank' }], [rehypeKatex]]} remarkPlugins={[remarkGfm]}>
                            {chat.message}
                        </ReactMarkdown>
                        {
                            timeStamp &&
                            <div className={styles.timeStamp}>{chat.timestamp}</div>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChatHeader