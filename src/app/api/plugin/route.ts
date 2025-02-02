import { aiPlugins } from '@/ai/plugins'
import { getDatabase } from '@/lib/db'
import { ChatBotDb, ToolSetting } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json({
		aiPlugins,
	})
}

export async function PUT(request: NextRequest) {
	const {
		botId,
		updatedPlugins,
		plugin
	}: {
		botId: string
		updatedPlugins: ToolSetting[]
		plugin: string
	} = await request.json()

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
			tools: updatedPlugins
		}
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

export async function POST(request: NextRequest) {
	const {
		botId,
		plugin,
		settings,
	}: {
		botId: string
		plugin: string
		settings: {
			[key: string]: string
		}
	} = await request.json()

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatBotId = new ObjectId(botId)

	const query = {
		_id: chatBotId,
		tools: {
			$not: {
				$elemMatch: { id: plugin },
			},
		},
	}

	const update = {
		$push: {
			tools: {
				id: plugin,
				settings,
			},
		},
	}

	const result = await chatBotCollection.updateOne(query, update)

	const res = NextResponse
	if (result.modifiedCount > 0) {
		return res.json({
			msg: 'Plugin Added',
		})
	} else {
		return res.json(
			{
				msg: 'Error Adding Plugin',
			},
			{
				status: 500,
			}
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ botId: string; plugin: string }> }
) {
	const { botId, plugin }: { botId: string; plugin: string } = await request.json()

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
		$pull: {
			tools: {
				id: plugin,
			},
		},
	}

	const result = await chatBotCollection.updateOne(query, update)

	const res = NextResponse
	if (result.modifiedCount > 0) {
		return res.json({
			msg: 'Plugin Removed',
		})
	} else {
		return res.json(
			{
				msg: 'Error removing plugin',
			},
			{
				status: 500,
			}
		)
	}
}
