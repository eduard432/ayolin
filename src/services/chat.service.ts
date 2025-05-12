import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { Message } from 'ai'
import { ObjectId, WithId } from 'mongodb'

export async function getChatInfo(chatId: string) {
	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const chatObjectId = new ObjectId(chatId)
	const chatResult = await chatCollection.findOne({ _id: chatObjectId })

	if (chatResult) {
		const chatBotResult = await chatBotCollection.findOne({ _id: chatResult.chatBotId })
		if (chatBotResult) {
			const messages: Message[] = chatResult.messages

			const result: {
				chatBot: WithId<ChatBotDb>
				messages: Message[]
			} = {
				chatBot: chatBotResult,
				messages,
			}
			return result
		}
	} else {
		return undefined
	}
}

export const deleteAllMessages = async (chatId: string) => {
	const chatObjectId = new ObjectId(chatId)
	const db = await getDatabase()

	const chatCollection = db.collection<ChatDb>('chat')
	const chatResult = await chatCollection.updateOne(
		{ _id: chatObjectId },
		{
			$set: { messages: [] },
		}
	)
	if (chatResult.modifiedCount > 0) {
		return true
	} else {
		return false
	}
}


export const addChat = async (chatBotId: string) => {
	const chatBotObjectId = new ObjectId(chatBotId)

	const db = await getDatabase()
	
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const chatResult = await chatCollection.insertOne({
		chatBotId: chatBotObjectId,
		messages: []
	})

	if (chatResult.acknowledged) {
		const chatBotResult = await chatBotCollection.updateOne(
			{ _id: chatBotObjectId },
			{ $push: { chats: chatResult.insertedId } }
		)

		if (chatBotResult.modifiedCount > 0) {
			return chatResult.insertedId.toString()
		} else {
			throw new Error('Error adding Chat.')
		}
	}
}

export const getChats = async (chatBotId: string) => {
	const chatBotObjectId = new ObjectId(chatBotId)

	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')

	const chatResult = chatCollection.aggregate([
		{
			$match: {
				chatBotId: chatBotObjectId,
			},
		},
	])

	const chats = await chatResult.toArray()
	return chats
}