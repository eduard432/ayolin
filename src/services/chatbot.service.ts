import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBot, ChatBotDb, ChatBotRecord } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

export async function getChatbots(userId: string): Promise<ChatBotRecord[]> {
	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const objectUserId = new ObjectId(userId)

	const result = await chatBotCollection.find({ userId: objectUserId }).toArray()

	const chatBots: ChatBotRecord[] = JSON.parse(JSON.stringify(result))

	return chatBots
}

export async function getChatBot(chatBotId: string): Promise<ChatBotRecord | undefined> {
	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const chatBotObjectId = new ObjectId(chatBotId)
	const result = await chatBotCollection.findOne({ _id: chatBotObjectId })
	if (result) {
		const chatBot: ChatBotRecord = JSON.parse(JSON.stringify(result))
		return chatBot
	} else {
		return undefined
	}
}

export const createChatbotBodySchema = z
	.object({
		model: z.string(),
		name: z.string(),
		initialPrompt: z.string(),
		userId: z.string(),
	})
	.strict()

export const createChatBot = async (data: z.infer<typeof createChatbotBodySchema>) => {
	const chatId = new ObjectId()
	const userObjectId = new ObjectId(data.userId)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatCollection = db.collection<ChatDb>('chat')

	const chatBot: ChatBotDb = {
		...data,
		defaultChatId: chatId,
		chats: [chatId],
		tools: [],
		usedTokens: {
			input: 0,
			output: 0,
		},
		totalMessages: 0,
		userId: userObjectId,
		integrations: [],
	}
	const chatBotResult = await chatBotCollection.insertOne(chatBot)
	const chatResult = await chatCollection.insertOne({
		_id: chatId,
		chatBotId: chatBotResult.insertedId,
		messages: [],
	})

	if (chatBotResult.acknowledged && chatResult.acknowledged) {
		return chatBotResult.insertedId
	} else {
		return undefined
	}
}

export const updateChatbotBodySchema = z
	.object({
		name: z.string(),
		model: z.string(),
		initialPrompt: z.string(),
	})
	.strict()

export const updateChatBot = async (
	chatBotId: string,
	data: z.infer<typeof updateChatbotBodySchema>
) => {
	const objectChatBotId = new ObjectId(chatBotId)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const result = await chatBotCollection.updateOne(
		{ _id: objectChatBotId },
		{ $set: data }
	)

	return result.acknowledged
}

export const deleteChatBot = async (chatBotId: string) => {
	const chatBotObjectId = new ObjectId(chatBotId)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatCollection = db.collection<ChatDb>('chat')

	const chatResult = await chatCollection.deleteMany({ chatBotId: chatBotObjectId })
	const chatBotResult = await chatBotCollection.deleteOne({ _id: chatBotObjectId })

	return chatBotResult.acknowledged && chatResult.acknowledged
}
