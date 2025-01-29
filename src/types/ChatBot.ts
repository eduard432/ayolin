import { ObjectId } from 'mongodb'
import { Chat, ChatDb, ChatRecord } from './Chat'

export interface ChatBotRecord extends ChatBot {
    defaultChatId: string
    userId: string,
    _id: string
    chats: ChatRecord[]

}

export interface ChatBotDb extends ChatBot {
    defaultChatId: ObjectId
    userId: ObjectId,
    chats: ChatDb[]
}

export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    tools: string[]
    usedTokens: number,
}