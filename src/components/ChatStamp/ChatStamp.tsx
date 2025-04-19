import React from 'react'
import styles from "./ChatStamp.module.scss"
import { ChatStampProps, Roles } from '../../types';
import ApplicationDetails from "../../Data/Data.json";
import { ChatMember } from "../../types/index"

const chatMember: ChatMember = ApplicationDetails.ChatMember;

const ChatStamp: React.FC<ChatStampProps> = ({ chat }) => {
    return (
        <div>
            <h4 className={styles.label}>{chat.role === Roles.User ? chatMember.ChatUser : chatMember.ChatAssistant}</h4>
        </div>
    )
}

export default ChatStamp