import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotId = new ObjectId(id)

	const chatCount = await chatCollection.countDocuments({ chatBotId })

	// Aggregate operation to count the number of messages
	const result = await chatCollection
		.aggregate([
			{ $match: { chatBotId } },
			{ $unwind: '$messages' },
			{ $count: 'messages' },
		])
		.next()

	const messageCount = result ? result.messages : 0
	return NextResponse.json({
		chatCount,
		messageCount,
	})
}
