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

		const result = await chatCollection.aggregate([
			{ $match: { chatBotId } },
			{ $project: { numMessages: { $size: '$messages' } } },
			{ $group: { _id: null, totalMessages: { $sum: '$numMessages' } } }
		  ]).next();


	const messageCount = result && result.totalMessages
	return NextResponse.json({
		chatCount,
		messageCount,
	})
}
