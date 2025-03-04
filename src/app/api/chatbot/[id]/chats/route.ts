import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

type BodyData = {
	botId: string
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const botObjectId = new ObjectId(id)

	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')

	const chatResult = chatCollection.aggregate([
		{
			$match: {
				chatBotId: botObjectId,
			},
		},
	])

	const chats = await chatResult.toArray()
	return NextResponse.json({
		chats,
	})
}
