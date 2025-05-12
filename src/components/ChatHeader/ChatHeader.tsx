import React, { useEffect, useRef, useState } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ChatHeaderProps, Roles } from "../../types"
import styles from "./ChatHeader.module.scss"
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import ChatStamp from "../ChatStamp/ChatStamp";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import DotLoader from "../DotLoader/DotLoader";
import Button from "../Button/Button";
import Refresh from "../../assets/refresh.png"
import Dustbin from "../../assets/dustbin.png"

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatHistory, loading, setChatHistory, abortControllerRef, handleSendText }) => {

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatHistory])

    const renderers = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        borderRadius: "10px",
                        padding: "16px",
                        fontSize: "14px",
                        background: "#282c34",
                    }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };


    const handleRegenerate = () => {
        const updatedHistory = [...chatHistory];
        const lastUserIndex = [...updatedHistory].reverse().findIndex(chat => chat.role === Roles.User);
        const absoluteUserIndex = lastUserIndex !== -1 ? updatedHistory.length - 1 - lastUserIndex : -1;

        if (absoluteUserIndex !== -1) {

            const trimmedHistory = updatedHistory.slice(0, absoluteUserIndex + 2)
                .filter((chat, i) => i === absoluteUserIndex + 1 ? chat.role !== Roles.Bot : true);

            setChatHistory(trimmedHistory);
            handleSendText('', true,false);

        }
    };

    return (
        <div className={styles.chatBox}>
            {chatHistory.map((chat, index) => (
                <div className={styles.mainChat}>
                    <div
                        key={index}
                        className={`${styles.chat_row} ${chat.role === Roles.User ? styles.user : styles.bot}`}>
                        <ChatStamp chat={chat} />
                        <div className={styles.text}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            ref={index === chatHistory.length - 1 ? chatEndRef : null}>
                            {chat.message ? (
                                <ReactMarkdown
                                    components={renderers}
                                    skipHtml={false}
                                    rehypePlugins={[[rehypeRaw], [rehypeExternalLinks, { target: '_blank' }], [rehypeKatex]]}
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {chat.message}
                                </ReactMarkdown>
                            ) : (
                                loading && index === chatHistory.length - 1 && chat.role === Roles.Bot && <DotLoader />
                            )}
                            {
                                hoveredIndex === index &&
                                <div className={styles.timeStamp}>{chat.timestamp}</div>
                            }
                        </div>
                    </div>
                    {chat.role === Roles.Bot && index === chatHistory.length - 1 && (
                        <div className={styles.chatButton}>
                            <Button
                                onClick={handleRegenerate}
                                variant="regenerate"
                            >
                                <img src={Refresh} alt="Regenerate Message" />
                            </Button>
                        </div>
                    )}
                </div>
            ))}
            {
                chatHistory.length > 0 && (
                    <div className={styles.buttonRow}>
                        <Button
                            onClick={() => {
                                handleSendText('',false,true);
                                setChatHistory([]);
                            }}
                            variant="clear"
                        >
                            <span>
                                Clear Chat
                            </span>
                            <img src={Dustbin} alt="Clear Chat" />
                        </Button>
                    </div>
                )
            }

        </div>
    )
}

export default ChatHeader