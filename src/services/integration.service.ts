import { getDatabase } from '@/lib/db'
import { ChatBotDb, ToolSetting } from '@/types/ChatBot'
import { Integration, IntegrationDb, IntegrationRecord, IntegrationType } from '@/types/Integration'
import { ObjectId } from 'mongodb'

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

	return updateChatBotResult ? integrationResult.insertedId : false
}

export const updateIntegration = async (chatBotId: string, plugin: ToolSetting) => {
	// Not necesary
}

export const deleteIntegration = async (chatBotId: string, integrationType: IntegrationType) => {
	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
    const integrationCollection = db.collection<IntegrationRecord>('integrations')
	const chatBotObjectId = new ObjectId(chatBotId)

	const query = {
		_id: chatBotObjectId,
		integrations: {
			$elemMatch: { type:  integrationType },
		},
	}

	const updateChatBotResult = await chatBotCollection.updateOne(query, {
		$pull: {
			integrations: {
				type: integrationType,
			},
		},
	})

    if(!updateChatBotResult.acknowledged) return false

    const deleteIntegrationResult = await integrationCollection.deleteOne({
        type: integrationType,
        chatBotId
    })

	return deleteIntegrationResult.acknowledged
}
