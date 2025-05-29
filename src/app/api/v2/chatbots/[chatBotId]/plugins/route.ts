import { aiPlugins } from '@/ai/plugins'
import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { addPlugin, deletePlugin, updatePlugin } from '@/services/plugin.service'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// GET: Get all available plugins:
// /api/v2/chatbots/:chatbotId/plugins
export async function GET() {
	return NextResponse.json({
		aiPlugins,
	})
}

// POST: Add a plugin to a chatbot:
// /api/v2/chatbots/:chatbotId/plugins
const paramsSchema = z.object({
	chatBotId: z.string(),
})

const bodySchema = z.object({
	plugin: z.string(),
	settings: z.record(z.string()),
})

export async function POST(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const params = await paramsPromise
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const body = await request.json()
		const { plugin, settings } = validateWithSource(bodySchema, body, 'body')

		const result = await addPlugin(chatBotId, plugin, settings)

		const res = NextResponse
		if (result) {
			return res.json({
				msg: 'Plugin Added',
			})
		} else {
			return res.json(
				{
					msg: 'Chat bot not found or plugin already exists',
				},
				{
					status: 404,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}

// PUT: Update a plugin for a chatbot:
// /api/v2/chatbots/:chatbotId/plugins

const updateBodySchema = z.object({
	plugin: z.object({
		id: z.string(),
		settings: z.record(z.string()),
	}),
})

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const body = await request.json()
		const { plugin } = validateWithSource(updateBodySchema, body, 'body')

		const result = await updatePlugin(chatBotId, plugin)

		const res = NextResponse
		if (result) {
			return res.json({
				msg: 'Plugin Updated',
			})
		} else {
			return res.json(
				{
					msg: 'Chatbot or plugin not found',
				},
				{
					status: 404,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}

// DELETE: Delete a plugin from a chatbot:
// /api/v2/chatbots/:chatbotId/plugins

const deleteBodySchema = z.object({
	pluginId: z.string(),
})

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ pluginId: string }> }
) {
	try {
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const body = await request.json()
		const { pluginId } = validateWithSource(deleteBodySchema, body, 'body')
		const result = await deletePlugin(chatBotId, pluginId)
		const res = NextResponse

		if (result) {
			return res.json({
				msg: 'Plugin Deleted',
			})
		} else {
			return res.json(
				{
					msg: 'Chatbot or plugin not found',
				},
				{
					status: 404,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}
