export type ApplicationDetailsType = {
    applicationName: string
    aiTitle: string
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
