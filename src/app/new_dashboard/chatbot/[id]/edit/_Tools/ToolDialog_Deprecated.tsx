'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

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
	{
		name: 'AI Scheduler',
		description:
			'Optimizes and automates scheduling tasks based on user preferences and availability.',
		id: 9,
	},
	{
		name: 'AI Scheduler',
		description:
			'Optimizes and automates scheduling tasks based on user preferences and availability.',
		id: 10,
	},
]

type StageProps = {
	setStage: React.Dispatch<React.SetStateAction<number>>
	selectedTool: number
	setSelectedTool: React.Dispatch<React.SetStateAction<number>>
}

const SelectStage = ({ setStage, setSelectedTool, selectedTool }: StageProps) => {
	return (
		<div className="flex p-4 pt-0 gap-4">
			<div className="w-4/12 border-r pr-2">
				<Input
					className="h-6 mb-2 focus:outline-none placeholder:text-zinc-400 px-2 text-sm"
					placeholder="Search Tool..."
				/>
				<ScrollArea className="overflow-y-auto w-full h-56">
					{toolsExample.map((tool) => (
						<>
							<p
								onClick={() => setSelectedTool(tool.id)}
								className={cn(
									'px-2 rounded-md hover:bg-zinc-100 text-sm cursor-pointer select-none my-1',
									selectedTool === tool.id && 'bg-zinc-100'
								)}
								key={tool.id}>
								{tool.name}
							</p>
							{/* <Separator className="my-1" /> */}
						</>
					))}
				</ScrollArea>
			</div>
			<div className="w-8/12 grow px-4 flex flex-col justify-between">
				<div>
					<h2 className="text-2xl font-semibold">
						{toolsExample[selectedTool - 1].name}
					</h2>
					<p>{toolsExample[selectedTool - 1].description}</p>
				</div>
				<div className="flex justify-end">
					<Button onClick={() => setStage(2)}>Add Tool</Button>
				</div>
			</div>
		</div>
	)
}

const ConfigStage = ({ setStage, selectedTool, setSelectedTool }: StageProps) => {
	return (
		<div className="p-4 pt-0 flex flex-col justify-start">
			<h2 className="text-2xl font-semibold">{toolsExample[selectedTool - 1].name}</h2>
			<p>{toolsExample[selectedTool - 1].description}</p>
		</div>
	)
}

const ToolDialog = () => {
	const [stage, setStage] = useState(1)
	const [selectedTool, setSelectedTool] = useState(1)

	return (
		<Dialog onOpenChange={(isOpen) => !isOpen && setStage(1)}>
			<DialogTrigger asChild>
				<Button>Add Tool</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl p-0 h-3/6">
				<DialogHeader className="px-4 pt-4 h-4">
					<DialogTitle>{stage === 1 ? "Agregar Herramienta" : "Configurar Herramienta"}</DialogTitle>
					{/* <DialogDescription>
								This action cannot be undone. This will permanently delete your account
								and remove your data from our servers.
							</DialogDescription> */}
				</DialogHeader>

				{stage === 1 && (
					<SelectStage
						selectedTool={selectedTool}
						setSelectedTool={setSelectedTool}
						setStage={setStage}
					/>
				)}
				{stage === 2 && (
					<ConfigStage
						selectedTool={selectedTool}
						setSelectedTool={setSelectedTool}
						setStage={setStage}
					/>
				)}
				{/* {stage === 3 && <StageThree />} */}
			</DialogContent>
		</Dialog>
	)
}

export default ToolDialog
