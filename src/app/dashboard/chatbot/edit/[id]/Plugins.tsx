'use client'

import { ChatBotRecord, ToolSetting } from '@/types/ChatBot'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaRegSquarePlus, FaRegTrashCan } from 'react-icons/fa6'

type PluginsComponentParams = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
}

const Plugins = ({ chatBot, setChatBot }: PluginsComponentParams) => {
	const [funcs, setFuncs] = useState<string[]>([])
	const [selectedFunc, setSelectedFunc] = useState<string>('')

	const handleGetFunctions = async () => {
		const response = await fetch(`/api/plugin`)
		if (response.ok) {
			const data: { plugins: string[] } = await response.json()
			setFuncs(data.plugins)
		}
	}

	const handleDeleteFunction = async (func: string) => {
		if (!chatBot) return
		const result = await fetch(`/api/plugin`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot?._id,
				plugin: func,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				tools: chatBot.tools.filter((tool) => tool.id !== func),
			}
			setChatBot(newData)
		}
	}

	useEffect(() => {
		handleGetFunctions()
	}, [])

	const handleAddFunction = async () => {
		if (!chatBot) return
		if (selectedFunc == '') return
		if (chatBot.tools.find((tool => tool.id === selectedFunc))) return
		const result = await fetch(`/api/plugin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot._id,
				plugin: selectedFunc,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				tools: [...chatBot.tools, {
					id: selectedFunc,
					settings: {}
				}],
			}
			setChatBot(newData)
			setSelectedFunc('')
		}
	}

	return (
		<section>
			<h4 className="text-xl font-semibold my-2">Funciones:</h4>
			<div className="my-4 flex">
				<select
					value={selectedFunc}
					onChange={(event) => setSelectedFunc(event.target.value)}
					className="px-2 py-1 border rounded border-gray-300 min-w-40 capitalize"
					name="connectionType">
					<option value=""></option>
					{funcs
						.filter((func) => !chatBot.tools.find((tool => tool.id === func)))
						.map((func) => (
							<option className="capitalize" key={func} value={func}>
								{func.replaceAll('_', ' ')}
							</option>
						))}
				</select>
				<button
					onClick={() => handleAddFunction()}
					className="bg-black text-white px-3 py-1 text-sm rounded mx-2 flex items-center gap-1">
					<FaRegSquarePlus /> Agregar funcion
				</button>
			</div>
			<div className="divide-y border-y  border-gray-300 px-6">
				{chatBot.tools.map((tool: ToolSetting) => (
					<span
						key={tool.id}
						className="flex items-center gap-2 justify-between py-2 group min-h-12">
						<p className="w-1/3 capitalize">{tool.id.replaceAll('_', ' ')}</p>
						<div className="w-1/3 flex justify-end">
							<button
								onClick={() => handleDeleteFunction(tool.id)}
								className="bg-gray-700 text-white rounded-md p-2 hidden group-hover:block">
								<FaRegTrashCan />
							</button>
						</div>
					</span>
				))}
			</div>
		</section>
	)
}

export default Plugins
