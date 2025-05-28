import { getDatabase } from '@/lib/db'
import { ChatBotDb, ToolSetting } from '@/types/ChatBot'
import { IntegrationRecord, IntegrationType } from '@/types/Integration'
import { ObjectId } from 'mongodb'

export const addWebhook = async (integrationId: string, type: IntegrationType) => {
	const WEBHOOK_SERVER_URL = process.env.WEBHOOK_SERVER_URL
	if (!WEBHOOK_SERVER_URL) throw Error('Missing env: WEBHOOK_SERVER_URL')
	switch (type) {
		case 'tg':
			const response = await fetch(
				`${WEBHOOK_SERVER_URL}/webhook/${integrationId}/launch`,
				{
					method: 'POST',
				}
			)
			const data = await response.json()
			if (data.acknowledge) return true
			else return false

		default:
			throw new Error('Integration type not defined')
	}
}

export const removeWebhook = async (integrationId: string, type: IntegrationType) => {
	const WEBHOOK_SERVER_URL = process.env.WEBHOOK_SERVER_URL
	if (!WEBHOOK_SERVER_URL) throw Error('Missing env: WEBHOOK_SERVER_URL')
	switch (type) {
		case 'tg':
			const response = await fetch(
				`${WEBHOOK_SERVER_URL}/webhook/${integrationId}/launch`,
				{
					method: 'DELETE',
				}
			)
			const data = await response.json()
			if (data.acknowledge) return true
			else return false

		default:
			throw new Error('Integration type not defined')
	}
}

export const addIntegration = async (
	chatBotId: string,
	integrationType: string,
	settings: Record<string, string>
) => {
	const chatBotObjectId = new ObjectId(chatBotId)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const integrationsCollection = db.collection('integrations')

	const integrationObjectId = new ObjectId()

	const integration = {
		_id: integrationObjectId,
		chatBotId: chatBotObjectId,
		type: integrationType as IntegrationType,
		users: [],
		settings,
	}

	const integrationResult = await integrationsCollection.insertOne(integration)

	if (!integrationResult.acknowledged) {
		throw new Error('Failed to create integration')
	}

	const updateChatBotResult = await chatBotCollection.updateOne(
		{
			_id: chatBotObjectId,
		},
		{
			$push: {
				integrations: integration,
			},
		}
	)

	// TODO: validate if webhook was created.
	await addWebhook(integrationObjectId.toString(), integrationType as IntegrationType)

	return updateChatBotResult ? integrationResult.insertedId : false
}

export const updateIntegration = async (chatBotId: string, plugin: ToolSetting) => {
	// Not necesary
}

export const deleteIntegration = async (
	chatBotId: string,
	integrationType: IntegrationType
) => {
	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const integrationCollection = db.collection<IntegrationRecord>('integrations')
	const chatBotObjectId = new ObjectId(chatBotId)

	const query = {
		_id: chatBotObjectId,
		integrations: {
			$elemMatch: { type: integrationType },
		},
	}

	const updateChatBotResult = await chatBotCollection.updateOne(query, {
		$pull: {
			integrations: {
				type: integrationType,
			},
		},
	})

	if (!updateChatBotResult.acknowledged) return false

	const integrationResult = await integrationCollection.findOne({
		type: integrationType,
		chatBotId,
	})

	if (!integrationResult) return false

	const deleteIntegrationResult = await integrationCollection.deleteOne({
		_id: integrationResult._id,
	})

	await removeWebhook(integrationResult._id, integrationType as IntegrationType)

	return deleteIntegrationResult.acknowledged
}
