import React, { useRef, useEffect, useState } from "react";
import styles from "./TextArea.module.scss";
type TextareaProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void; placeholder?: string; disabled?: boolean; minHeight?: number; maxHeight?: number;
};

const Textarea: React.FC<TextareaProps> = ({ value, onChange, onKeyDown, placeholder, disabled, minHeight = 32, maxHeight = 130, }) => {

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [height, setHeight] = useState(minHeight);

    const resizeTextarea = () => {
        const textarea = textareaRef.current; if (textarea) {
            textarea.style.height = "auto";
            const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
            textarea.style.height = `${newHeight}px`;
            textarea.style.overflow = newHeight < maxHeight ? "hidden" : "auto";
            setHeight(newHeight);
        }
    };

    useEffect(() => { resizeTextarea(); }, [value]);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { onChange(e); resizeTextarea(); };

    return (
        <textarea rows={1}
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`${styles.form_control} ${styles.text_input}`}
            style={{ height, overflow: height < maxHeight ? "hidden" : "auto" }} />);
};

export default Textarea;