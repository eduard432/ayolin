'use client'

import { aiPlugins } from '@/ai/plugins'
import { ChatBotRecord } from '@/types/ChatBot'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type PluginFormComponentParams = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
	setIsOpenDialog: Dispatch<SetStateAction<boolean>>
	isOpenDialog: boolean
}

const plugins = Object.keys(aiPlugins).map((id) => ({
	id,
	name: aiPlugins[id].name,
	settings: aiPlugins[id].settings,
}))

const AddPluginForm = ({
	chatBot,
	setChatBot,
	isOpenDialog,
	setIsOpenDialog,
}: PluginFormComponentParams) => {
	const [selectecPlugin, setSelectedPlugin] = useState<string>(plugins[0].id)
	const [selectedSetting, setSelectedSetting] = useState<{ [key: string]: string }>(
		plugins[0].settings
	)
	const [isDisabled, setIsDisabled] = useState(true)

	useEffect(() => {
		setSelectedSetting(aiPlugins[selectecPlugin].settings)
	}, [selectecPlugin])

	useEffect(() => {
		if (!Object.values(selectedSetting).includes('')) setIsDisabled(false)
		else setIsDisabled(true)
	}, [selectedSetting])

	const handleAddFunction = async () => {
		if (chatBot.tools.find((tool) => tool.id === selectecPlugin)) return
		const result = await fetch(`/api/plugin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot._id,
				plugin: selectecPlugin,
        settings: selectedSetting
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				tools: [
					...chatBot.tools,
					{
						id: selectecPlugin,
						settings: selectedSetting,
					},
				],
			}
			setChatBot(newData)
			setSelectedPlugin(plugins[0].id)
			setSelectedSetting(plugins[0].settings)
      setIsOpenDialog(false)
		}
	}

	return (
		<Dialog
			className="text-neutral-950"
			open={isOpenDialog}
			onClose={() => setIsOpenDialog(false)}>
			<DialogBackdrop className="fixed inset-0 bg-neutral-950/30" />
			<div className="fixed inset-0 w-full flex items-center justify-center">
				<DialogPanel className="min-h-96 max-w-xl w-full space-y-4 border bg-white p-10 rounded-md">
					<DialogTitle className="font-bold text-xl ">Agregar Función</DialogTitle>
					<select
						value={selectecPlugin}
						onChange={(event) => setSelectedPlugin(event.target.value)}
						className="px-2 py-1 border rounded border-neutral-300 min-w-40 capitalize w-full"
						name="connectionType">
						{plugins.map((plugin) => (
							<option className="rounded" key={plugin.id} value={plugin.id}>
								{plugin.name}
							</option>
						))}
					</select>
					<button
            onClick={() => handleAddFunction()}
						disabled={isDisabled}
						className="disabled:bg-opacity-60 bg-neutral-950 text-neutral-50 rounded w-full py-1">
						Agregar
					</button>
					{Object.keys(aiPlugins[selectecPlugin].settings).length > 0 && (
						<div>
							<h4 className="text-xl font-semibold">Configuración:</h4>
							<form className="px-4 my-2">
								{Object.keys(aiPlugins[selectecPlugin].settings).map((setting) => (
									<fieldset key={setting} >
										<label
											className="uppercase font-mono w-2/12 inline-block"
											htmlFor={setting}>
											{setting}:
										</label>
										<input
											autoComplete="off"
											value={selectedSetting?.[setting] || ''}
											onChange={(event) =>
												setSelectedSetting((restSettings) => ({
													...restSettings,
													[setting]: event.target.value,
												}))
											}
											className="px-2 py-1 border rounded w-10/12 border-neutral-300 focus:outline-none"
											name={setting}
											type="text"
										/>
									</fieldset>
								))}
							</form>
						</div>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	)
}

export default AddPluginForm
