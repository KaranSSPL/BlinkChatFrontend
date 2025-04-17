import { useRef, useState } from 'react';
import './ChatInputBar.css';

const ChatInputBar = ({ handleSend }: { handleSend: (inputValue: string) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const inputElement = useRef<HTMLInputElement>(null)

    const sendMessage = () => {
        if (!inputValue.trim()) return;
        handleSend(inputValue);
        setInputValue("");
    };

    return (
        <div className="chat-input-wrapper">

            <input
                className="chat-input"
                type="text"
                ref={inputElement}
                placeholder="Describe"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        sendMessage();
                    }
                }}
            />
            <button className={`icon-button send ${inputValue ? 'active' : ""}`} onClick={() => { handleSend(inputValue); setInputValue("") }}>↑</button>
        </div>
    );
};

export default ChatInputBar;
