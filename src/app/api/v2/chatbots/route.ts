import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// POST: Create a new chatbot:
// /api/chatbots
const bodyDataSchema = z
	.object({
		model: z.string(),
		name: z.string(),
		initialPrompt: z.string(),
		userId: z.string(),
	})
	.strict()

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const data = validateWithSource(bodyDataSchema, body, 'body')

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
		await chatCollection.insertOne({
			_id: chatId,
			chatBotId: chatBotResult.insertedId,
			messages: [],
		})

		const response = NextResponse

		if (chatBotResult) {
			return response.json(
				{
					msg: 'ChatBot created',
				},
				{
					status: 201,
				}
			)
		} else {
			return response.json(
				{
					msg: 'Error creating chatbot',
				},
				{
					status: 500,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}
