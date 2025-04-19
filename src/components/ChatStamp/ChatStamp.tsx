import React from 'react'
import styles from "./ChatStamp.module.scss"
import { ChatStampProps, Roles } from '../../types';

const ChatStamp: React.FC<ChatStampProps> = ({ chat }) => {
    return (
       <div>
            <h4 className={styles.label}>{chat.role === Roles.User ? 'You' : 'Bot'}</h4>
            <div className={styles.timeStamp}>{chat.timestamp}</div>
        </div>

    )
}

export default ChatStamp