import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { ChatBotDb, ToolSetting } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
	chatBotId: z.string(),
	pluginId: z.string(),
})

const bodySchema = z.object({
	plugin: z.object({
		id: z.string(),
		settings: z.record(z.string()),
	}),
})

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ chatBotId: string; pluginId: string }> }
) {
	const {
		botId,
		updatedPlugins,
		plugin,
	}: {
		botId: string
		updatedPlugins: ToolSetting[]
		plugin: string
	} = await request.json()

	const { chatBotId, pluginId } = validateWithSource(paramsSchema, params, 'params')
	const body = await request.json()
	const { updatedPlugins } = validateWithSource(bodySchema, body, 'body')

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatBotId = new ObjectId(botId)

	const query = {
		_id: chatBotId,
		tools: {
			$elemMatch: { id: plugin },
		},
	}

	const update = {
		$set: {
			tools: updatedPlugins,
		},
	}

	const result = await chatBotCollection.updateOne(query, update)

	const res = NextResponse
	if (result.modifiedCount > 0) {
		return res.json({
			msg: 'Plugin Updated',
		})
	} else {
		return res.json(
			{
				msg: 'Error updating Plugin',
			},
			{
				status: 500,
			}
		)
	}
}
