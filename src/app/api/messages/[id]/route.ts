import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id: chatId } = await params
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
}
