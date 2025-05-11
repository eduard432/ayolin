import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// GET: Generate a new chat link:
// /api/chatbots/:chatbotId/link
const paramsSchema = z.object({
	chatBotId: z.string(),
})

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const chatBotObjectId = new ObjectId(chatBotId)

		const db = await getDatabase()

		const chatCollection = db.collection<ChatDb>('chat')
		const chatBotCollection = db.collection<ChatBotDb>('chatbot')

		const chatResult = await chatCollection.insertOne({
			chatBotId: chatBotObjectId,
			messages: [],
		})

		const response = NextResponse
		if (chatResult) {
			const chatBotResult = await chatBotCollection.updateOne(
				{ _id: chatBotObjectId },
				{ $push: { chats: chatResult.insertedId } }
			)

			if (chatBotResult.modifiedCount > 0) {
				const url = request.nextUrl.clone()
				url.pathname = `/chat/${chatResult.insertedId.toString()}`
				return response.redirect(url)
			} else {
				return response.json(
					{
						message: 'Error adding Chat!!',
					},
					{
						status: 500,
					}
				)
			}
		} else {
			return response.json(
				{
					message: 'Unavilable to add chat',
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
