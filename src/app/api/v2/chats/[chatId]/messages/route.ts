import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
	chatId: z.string(),
})

export async function DELETE(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<{ id: string }> }
) {
	try {
		const params = await paramsPromise
		const { chatId } = validateWithSource(paramsSchema, params, 'params')
		const chatObjectId = new ObjectId(chatId)

		const db = await getDatabase()

		const chatCollection = db.collection<ChatDb>('chat')

		const chatResult = await chatCollection.updateOne(
			{ _id: chatObjectId },
			{
				$set: { messages: [] },
			}
		)

		const response = NextResponse
		if (chatResult.modifiedCount > 0) {
			return response.json({
				message: 'Messages deleted',
			})
		} else {
			return response.json(
				{
					message: 'Chat not found',
				},
				{
					status: 404,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}
