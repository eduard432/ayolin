'use client'

import { ChatBotRecord, ToolSetting } from '@/types/ChatBot'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaRegSquarePlus, FaRegTrashCan, FaPencil } from 'react-icons/fa6'
import AddPluginForm from './AddPluginForm'
import { aiPlugins } from '@/ai/plugins'
import EditPluginForm from './EditPluginForm'

type PluginsComponentParams = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
}

const Plugins = ({ chatBot, setChatBot }: PluginsComponentParams) => {
	const [isOpenDialog, setIsOpenDialog] = useState(false)
	const [editPlugin, setEditPlugin] = useState('')
	const [editPluginSettings, setEditPluginSettings] = useState({})
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const handleSetEditPlugin = (
		pluginId: string,
		pluginSettings: { [key: string]: string }
	) => {
		setEditPlugin(pluginId)
		setEditPluginSettings(pluginSettings)
		setIsEditDialogOpen(true)
	}

	useEffect(() => {
		if (!isEditDialogOpen && editPlugin) {
			setEditPlugin('')
		}
	}, [isEditDialogOpen])

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

	return (
		<section>
			<h4 className="text-xl font-semibold my-2">Funciones:</h4>
			<div className="my-4">
				{editPlugin && (
					<EditPluginForm
						chatBot={chatBot}
						setChatBot={setChatBot}
						isOpenDialog={isEditDialogOpen}
						setIsOpenDialog={setIsEditDialogOpen}
						pluginId={editPlugin}
						settings={editPluginSettings}
					/>
				)}
				<AddPluginForm
					chatBot={chatBot}
					setChatBot={setChatBot}
					isOpenDialog={isOpenDialog}
					setIsOpenDialog={setIsOpenDialog}
				/>
				<button
					onClick={() => setIsOpenDialog(true)}
					className="bg-black text-white px-3 py-1 text-sm rounded mx-2 flex items-center gap-1">
					<FaRegSquarePlus /> Agregar funcion
				</button>
			</div>
			<div className="divide-y border-y  border-gray-300 px-6">
				{chatBot.tools.map((tool: ToolSetting) => (
					<span
						key={tool.id}
						className="flex items-center gap-2 justify-between py-2 group min-h-12">
						<p className="w-1/3 capitalize">{aiPlugins[tool.id].name}</p>
						<div className="w-1/3 flex justify-end gap-x-1">
							{Object.keys(tool.settings).length > 0 && (
								<button
									onClick={() => handleSetEditPlugin(tool.id, tool.settings)}
									className="bg-gray-900 text-white rounded-md p-2 hidden group-hover:block">
									<FaPencil />
								</button>
							)}
							<button
								onClick={() => handleDeleteFunction(tool.id)}
								className="bg-red-700 text-white rounded-md p-2 hidden group-hover:block">
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
