import { useRef, useState } from 'react';
import styles from "./ChatInputBar.module.scss";
import Textarea from '../TextArea/TextArea';
import send from "../../assets/up-arrow.png"
import stop from "../../assets/stop.png"


const ChatInputBar = ({
    handleSend,
    handleFileUpload,
    isGenerating,
    handleStop
}: {
    handleSend: (inputValue: string) => void;
    handleFileUpload?: (file: File) => void;
    isGenerating?: boolean;
    handleStop?: () => void;
}) => {

    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sendMessage = () => {
        if (selectedFile && handleFileUpload) {
            handleFileUpload(selectedFile);
            setSelectedFile(null);
        } else if (inputValue.trim()) {
            handleSend(inputValue);
            setInputValue("");
        }
    };

    const handlePlusClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
        e.target.value = '';
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
    };

    return (
        <div className={styles.chatInputWrapper}>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <button className={styles.iconButton} onClick={handlePlusClick}
                title="Attach a file">+</button>
            <div className={styles.inputWrapper}>
                {selectedFile && (
                    <div className={styles.filePreview}>
                        <div className={styles.fileDetails}>
                            <div className={styles.fileName}>{selectedFile.name}</div>
                            <div className={styles.fileType}>File</div>
                        </div>
                        <button className={styles.fileRemove} onClick={removeSelectedFile}>×</button>
                    </div>
                )}
                <Textarea
                    placeholder="Ask Question"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    disabled={isGenerating}
                />
            </div>
            {isGenerating ? (
                <button
                    className={`${styles.iconButton} ${styles.stop}`}
                    onClick={handleStop}
                    title="Stop generating"
                >
                    <img src={stop} alt="Send Message" className={styles.stopIcon} />

                </button>
            ) : (
                <button
                    className={`${styles.iconButton} ${styles.send} ${!inputValue ? styles.active : ""}`}
                    onClick={sendMessage}
                    title="Send"
                >
                    <img src={send} alt="Send Message" />
                </button>
            )}

        </div>
    );
};

export default ChatInputBar;
