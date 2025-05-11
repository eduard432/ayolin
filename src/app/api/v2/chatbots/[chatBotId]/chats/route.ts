import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

		const chatResult = chatCollection.aggregate([
			{
				$match: {
					chatBotId: chatBotObjectId,
				},
			},
		])

		const chats = await chatResult.toArray()
		return NextResponse.json({
			chats,
		})
	} catch (error) {
		return handleApiError(error)
	}
}
