'use client'

import { aiPlugins } from '@/ai/plugins'
import { ChatBotRecord } from '@/types/ChatBot'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

type PluginFormComponentParams = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
	setIsOpenDialog: Dispatch<SetStateAction<boolean>>
	isOpenDialog: boolean
	pluginId: string
	settings: { [key: string]: string }
}

const EditPluginForm = ({
	chatBot,
	setChatBot,
	isOpenDialog,
	setIsOpenDialog,
	pluginId,
	settings,
}: PluginFormComponentParams) => {
	const [editingSetting, setEdittingSetting] = useState(settings)
	const [isDisabled, setIsDisabled] = useState(true)

	// Check for changes
	useEffect(() => {
        const prevSettingsValue = JSON.stringify(settings)
		const actualValue = JSON.stringify(editingSetting)
		setIsDisabled(actualValue === prevSettingsValue)
	}, [editingSetting])

	const handleEditPlugin = async () => {
		const copyPlugins = [...chatBot.tools]
		const pluginIndex = copyPlugins.findIndex((tool) => tool.id === pluginId)

		if (pluginIndex !== -1) {
			copyPlugins[pluginIndex] = { id: pluginId, settings: editingSetting }
		}

		const result = await fetch(`/api/plugin`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot._id,
				updatedPlugins: copyPlugins,
                plugin: pluginId
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				tools: copyPlugins,
			}

			setChatBot(newData)
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
					<DialogTitle className="font-bold text-xl ">Editar Función: </DialogTitle>
					<h3 className="font-mono">{aiPlugins[pluginId].name}</h3>
					<button
						onClick={() => handleEditPlugin()}
						disabled={isDisabled}
						className="disabled:bg-opacity-60 bg-neutral-950 text-neutral-50 rounded w-full py-1">
						Editar
					</button>
					<div>
						<h4 className="text-xl font-semibold">Configuración:</h4>
						<form className="px-4 my-2">
							{Object.keys(editingSetting).map((setting) => (
								<fieldset key={setting} >
									<label
										className="uppercase font-mono w-2/12 inline-block"
										htmlFor={setting}>
										{setting}:
									</label>
									<input
                                        autoComplete="off"
										value={editingSetting?.[setting] || ''}
										onChange={(event) =>
											setEdittingSetting((restSettings) => ({
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
				</DialogPanel>
			</div>
		</Dialog>
	)
}

export default EditPluginForm
