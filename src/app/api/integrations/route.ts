import { getDatabase } from '@/lib/db'
import { ChatBotDb } from '@/types/ChatBot'
import { IntegrationDb, IntegrationType } from '@/types/Integration'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
	const {
		botId,
		integrationId,
		updatedUsers,
	}: {
		botId: string
		updatedUsers: string[]
		integrationId: string
	} = await request.json()

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const integrationCollection = db.collection<IntegrationDb>('integrations')
	const chatBotId = new ObjectId(botId)

	const chatResult = await chatBotCollection.updateOne(
		{ _id: chatBotId },
		{ $set: { 'integrations.users': updatedUsers } }
	)

	const integrationResult = await integrationCollection.updateOne(
		{
			_id: new ObjectId(integrationId),
		},
		{ $set: { users: updatedUsers } }
	)

	const res = NextResponse

	if (chatResult.modifiedCount > 0 && integrationResult.modifiedCount > 0) {
		return res.json({
			msg: 'Integration Updated',
		})
	} else {
		return res.json(
			{
				msg: 'Error updating integration',
			},
			{
				status: 500,
			}
		)
	}
}

export async function POST(request: NextRequest) {
	const { botId, type, users } = await request.json()

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatBotId = new ObjectId(botId)

	const integrationId = new ObjectId()

	const integrationCollection = db.collection<IntegrationDb>('integrations')
	const integration = {
		type,
		users,
		chatBotId,
		_id: integrationId,
		settings: {}
	}
	const integrationResult = await integrationCollection.insertOne(integration)

	const res = NextResponse

	if (integrationResult) {
		const query = {
			_id: chatBotId,
			integrations: {
				$not: {
					$elemMatch: { type },
				},
			},
		}

		const update = {
			$push: {
				integrations: integration,
			},
		}

		const chatBotResult = await chatBotCollection.updateOne(query, update)
		if (chatBotResult.modifiedCount > 0) {
			return res.json({
				msg: 'Integration Added',
				id: integrationId,
			})
		} else {
			return res.json(
				{
					msg: 'Error adding integration',
				},
				{
					status: 500,
				}
			)
		}
	} else {
		return res.json(
			{
				message: 'Unavilable to add integration',
			},
			{
				status: 500,
			}
		)
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { botId, integration }: { botId: string; integration: IntegrationType } =
			await request.json()

		const db = await getDatabase()
		const chatBotCollection = db.collection<ChatBotDb>('chatbot')
		const chatBotId = new ObjectId(botId)

		const query = {
			_id: chatBotId,
			integrations: {
				$elemMatch: { type: integration },
			},
		}

		const update = {
			$pull: {
				integrations: {
					type: integration,
				},
			},
		}

		const resultChatBot = await chatBotCollection.updateOne(query, update)
		const integrationCollection = db.collection<IntegrationDb>('integrations')
		const resultIntegration = await integrationCollection.deleteOne({
			chatBotId: chatBotId,
			type: integration,
		})

		const res = NextResponse
		if (resultChatBot.modifiedCount > 0 && resultIntegration.deletedCount > 0) {
			return res.json({
				msg: 'Integration Removed',
			})
		} else {
			return res.json(
				{
					msg: 'Error removing integration',
				},
				{
					status: 500,
				}
			)
		}
	} catch (error) {
		console.log(error)
	}
}
