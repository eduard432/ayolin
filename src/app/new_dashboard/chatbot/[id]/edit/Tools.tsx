import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageSquare, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const toolsExample: { name: string; description: string; id: number }[] = [
	{
		name: 'Code Assistant',
		description:
			'An AI-powered tool that helps developers write, debug, and optimize code efficiently.',
		id: 1,
	},
	{
		name: 'Data Analyzer',
		description:
			'Processes large datasets and provides insights using machine learning techniques.',
		id: 2,
	},
	{
		name: 'Chatbot Generator',
		description:
			'Creates intelligent chatbots capable of natural language understanding and response generation.',
		id: 3,
	},
	{
		name: 'Image Enhancer',
		description:
			'Improves image quality using AI-driven algorithms for noise reduction and upscaling.',
		id: 4,
	},
	{
		name: 'Speech Synthesizer',
		description: 'Converts text to speech with natural and expressive voices.',
		id: 5,
	},
	{
		name: 'Automated Translator',
		description:
			'Provides real-time translations between multiple languages with high accuracy.',
		id: 6,
	},
	{
		name: 'Content Generator',
		description:
			'Generates high-quality written content for blogs, articles, and social media.',
		id: 7,
	},
	{
		name: 'AI Scheduler',
		description:
			'Optimizes and automates scheduling tasks based on user preferences and availability.',
		id: 8,
	},
]

const ToolCard = ({
	tool,
}: {
	tool: { name: string; id: number; description: string }
}) => {
	return (
		<Card key={tool.id} className="flex flex-col">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex items-center space-x-2">
						<CardTitle className="text-xl">{tool.name}</CardTitle>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Link href={`/chatbot/${tool.id}/edit`}>Edit</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={`/chatbot/${tool.id}/analytics`}>View Analytics</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<CardDescription>
					<p className="overflow-hidden h-4">{tool.description}</p>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow">
				{/* <div className="flex justify-between">
                <div className="flex gap-2">
                    <p className="text-gray-500 flex items-center">
                        <MessageSquare className="h-4" />
                        <span>{chatbot.totalMessages}</span>
                    </p>
                    <p className="text-gray-500 flex items-center">
                        <MessagesSquare className="h-4" />
                        <span>{chatbot.chats.length}</span>
                    </p>
                </div>
                <p className="text-sm font-semibold">Model: {chatbot.model}</p>
            </div> */}
			</CardContent>
		</Card>
	)
}

export const Tools = () => {
	return (
		<div className="max-w-7xl grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			{toolsExample.map((tool) => (
				<ToolCard tool={tool} />
			))}
		</div>
	)
}
