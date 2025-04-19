export type ApplicationDetailsType = {
    applicationName: string
    aiTitle: string
}

export type ChatMember = {
    ChatUser: string
    ChatAssistant: string
}

export enum Roles {
    User,
    Bot
}

export type ChatHistory = {
    role: Roles, message: string, timestamp: string
}

export type ChatHeaderProps = {
    chatHistory: ChatHistory[];
}

export type ChatStampProps = {
    chat: ChatHistory;
};
