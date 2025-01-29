import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import pickBy from 'lodash.pickby'

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const objectId = new ObjectId(id)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const {
		name,
		model,
		initialPrompt,
	}: { name: string; model: string; initialPrompt: string } = await request.json()
	const updateValues = pickBy({ name, model, initialPrompt })
	const result = await chatBotCollection.updateOne(
		{ _id: objectId },
		{ $set: updateValues }
	)

	const res = NextResponse

	if (result.modifiedCount > 0) {
		return res.json({
			msg: 'Chatbot updated!!!',
		})
	} else {
		return res.json(
			{
				msg: 'Error trying to update chatbot!!',
			},
			{
				status: 500,
			}
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const objectId = new ObjectId(id)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatCollection = db.collection<ChatDb>('chat')

	const chatBotResult = await chatBotCollection.deleteOne({ _id: objectId })
	await chatCollection.deleteMany({ chatBotId: objectId })

	const res = NextResponse

	if (chatBotResult.deletedCount > 0) {
		return res.json({
			msg: 'Chatbot removed!!!',
		})
	} else {
		return res.json(
			{
				msg: 'Error trying to remove chatbot!!',
			},
			{
				status: 500,
			}
		)
	}
}
