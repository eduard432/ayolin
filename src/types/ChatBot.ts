import { ObjectId } from 'mongodb'

export interface ChatBotRecord extends ChatBot {
    defaultChatId: string
    userId: string,
    _id: string
    chats: string[]

}

export interface ChatBotDb extends ChatBot {
    defaultChatId: ObjectId
    userId: ObjectId,
    chats: ObjectId[]
}

export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    tools: string[]
    usedTokens: {
        input: number,
        output: number
    },
    totalMessages: number
}