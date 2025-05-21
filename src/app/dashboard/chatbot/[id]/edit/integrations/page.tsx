'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { MoreVertical, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ToolDialog from './ToolDialog'
import { useChatBot } from '../../ChatBotContext'
import { integrations } from '@/lib/integrations'
import { ChatBotRecord } from '@/types/ChatBot'
import { IntegrationType } from '@/types/Integration'

type ToolCardProps = {
	tool: string
	using?: boolean
	handleAddTool: (toolId: string) => void
	handleDeleteFunction: (func: string) => void
	handleEditFunction: () => void
}

const ToolCard = ({
	tool,
	using = false,
	handleAddTool,
	handleDeleteFunction,
	handleEditFunction,
}: ToolCardProps) => {

	return (
		<Card key={tool} className="flex flex-col justify-between">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex items-center space-x-2">
						<CardTitle className="text-xl">{integrations[tool].name}</CardTitle>
					</div>
					{using && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{/* <DropdownMenuItem onClick={handleEditFunction}>Edit</DropdownMenuItem> */}
								<DropdownMenuItem>
									<Link href={`/chatbot/${tool}/analytics`}>View Analytics</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleDeleteFunction(tool)}
									className="text-red-600 cursor-pointer">
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				<CardDescription className="flex flex-col justify-between">
					<p className="min-h-7">{integrations[tool].description}</p>
					{!using && (
						<Button
							onClick={() => handleAddTool(tool)}
							className="my-2 w-full"
							variant="outline"
							size="sm">
							Add Tool
						</Button>
					)}
				</CardDescription>
			</CardHeader>
		</Card>
	)
}

export default function ToolsPage() {
	const { chatBot, setChatBot } = useChatBot()
	const [activeIntegrationTypes, setActiveIntegrationTypes] = useState(new Set<string>())
	const [currentTool, setCurrentTool] = useState('')
	const [isUpdating, setIsUpdating] = useState(false)

	useEffect(() => {
		setActiveIntegrationTypes(
			new Set(chatBot.integrations.map((integration) => integration.type))
		)
	}, [chatBot])

	const handleDeleteIntegration = async (func: string) => {
		if (!chatBot) return
		const body = JSON.stringify({
				type: func,
			})

			console.log({body})
		const result = await fetch(`/api/v2/chatbots/${chatBot?._id}/integrations`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				integrations: chatBot.integrations.filter((integration) => integration.type !== func),
			}
			setChatBot(newData)
		}
	}

	const handleAddIntegration = async (settings: { [key: string]: string }) => {
		const result = await fetch(`/api/v2/chatbots/${chatBot?._id}/integrations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				type: currentTool,
				settings,
			}),
		})
		if (result.ok) {
			const resp: {integrationId: string} = await result.json()
			setChatBot((prevChatBot) => ({
				...prevChatBot,
				integrations: [
					...prevChatBot.integrations,
					{
						_id: resp.integrationId,
						chatBotId: prevChatBot._id,
						settings,
						type: currentTool as IntegrationType,
						users: [],
					}
				]
			}))
			setCurrentTool('')
		}
	}

	const handleEditPlugin = async (settings: { [key: string]: string }) => {
		const copyPlugins = [...chatBot.tools]
		const pluginIndex = copyPlugins.findIndex((tool) => tool.id === currentTool)

		if (pluginIndex !== -1) {
			copyPlugins[pluginIndex] = { id: currentTool, settings: settings }
		}

		const result = await fetch(`/api/plugin`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot._id,
				updatedPlugins: copyPlugins,
				plugin: currentTool,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				tools: copyPlugins,
			}

			setChatBot(newData)
			setCurrentTool('')
		}
	}

	return (
		<div className="max-w-7xl flex flex-col gap-4">
			<section className="flex w-full max-w-2xl items-center space-x-2">
				<div className="w-full relative">
					<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
					<Input type="text" placeholder="Search for Tools" className="pl-8" />
				</div>
			</section>
			<section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<ToolDialog
					saveTool={handleAddIntegration}
					setTool={setCurrentTool}
					tool={currentTool}
					isUpdating={isUpdating}
					updateTool={handleEditPlugin}
					initialSettings={
						chatBot.tools.find((tool) => tool.id === currentTool)?.settings
					}
				/>
				{[
					...activeIntegrationTypes,
					...Object.keys(integrations).filter(
						(integration) => !activeIntegrationTypes.has(integration)
					),
				].map((toolId) => (
					<ToolCard
						handleEditFunction={() => {
							setIsUpdating(true)
							setCurrentTool(toolId)
						}}
						handleDeleteFunction={handleDeleteIntegration}
						handleAddTool={() => setCurrentTool(toolId)}
						key={toolId}
						tool={toolId}
						using={activeIntegrationTypes.has(toolId)}
					/>
				))}
			</section>
		</div>
	)
}
