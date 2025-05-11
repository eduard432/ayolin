import { getDatabase } from '@/lib/db'
import { ChatBot, ChatBotDb, ChatBotRecord } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'

export async function getChatbots(id: string): Promise<ChatBotRecord[]> {
	const db = await getDatabase()
	const collection = db.collection<ChatBotDb>('chatbot')

	const userId = new ObjectId(id)

	const result = await collection.find({ userId }).toArray()

    const chatBots: ChatBotRecord[] = JSON.parse(JSON.stringify(result))

	return chatBots
}


export async function getChatBot(id: string): Promise<ChatBotRecord | undefined> {
	const db = await getDatabase()
	const collection = db.collection<ChatBotDb>('chatbot')

	const chatBotId = new ObjectId(id)
	const result = await collection.findOne({_id: chatBotId})
	if(result) {
		const chatBot: ChatBotRecord = JSON.parse(JSON.stringify(result))
		return chatBot
	} else {
		return undefined
	}
}