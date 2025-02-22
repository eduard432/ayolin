import { ChatBotRecord } from '@/types/ChatBot'
import React, { Dispatch, SetStateAction } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor'

type InputData = {
	name: string
	initialPrompt: string
}

type SettingsComponentParams = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
}

const Settings = ({ chatBot, setChatBot }: SettingsComponentParams) => {
	const {
		getValues,
		setValue,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<InputData>({
		defaultValues: {
			initialPrompt: '',
			name: '',
		},
		values: {
			name: chatBot?.name || '',
			initialPrompt: chatBot?.initialPrompt || '',
		},
		mode: 'onBlur',
	})

	const currentValues = watch()

	const hasChanges =
		JSON.stringify({ name: chatBot.name, initialPrompt: chatBot?.initialPrompt }) ==
		JSON.stringify(currentValues)

	const onSubmit: SubmitHandler<InputData> = async (inputData) => {
		const result = await fetch(`/api/chatbot/${chatBot._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(inputData),
		})
		if (result.ok && chatBot) {
			const { initialPrompt, name } = inputData
			const newData = { ...chatBot, initialPrompt, name }
			setChatBot(newData)
		}
	}

	return (
		<section>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 my-4">
				<h4 className="text-xl font-semibold">Datos:</h4>
				<div className="flex gap-2 items-center">
					<label htmlFor="name">Nombre:</label>
					<input
						{...register('name', {
							required: {
								message: 'Este campo es requerido',
								value: true,
							},
						})}
						className="px-2 py-1 outline-none rounded border border-gray-300"
						name="name"
						type="text"
					/>
					{errors.name && <p className="text-red-700">{errors.name.message}</p>}
				</div>
				<div className="flex gap-2 items-center">
					<label htmlFor="model">Modelo:</label>
					<select
						disabled
						value={chatBot.model}
						className="px-2 py-1 border rounded border-gray-300"
						name="model">
						<option>gpt-3.5-turbo</option>
						<option>gpt-4-turbo</option>
						<option>gpt-4</option>
						<option>gpt-4o</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="initialPrompt">Mensaje Inicial:</label>
					<MDEditor
						value={getValues().initialPrompt}
						onChange={(value) => setValue('initialPrompt', value || '')}
						className="outline-none border border-gray-300 rounded px-2 py-1"
					/>
					{/* <textarea
									{...register('initialPrompt', { required: true })}
									className="outline-none border border-gray-300 rounded px-2 py-1"
									rows={2}
									name="initialPrompt"></textarea> */}
				</div>

				<div className="flex space-x-2">
					<button
						disabled={hasChanges}
						type="button"
						className="rounded px-2 py-1 border border-gray-300 disabled:opacity-60 text-sm"
						onClick={() => reset()}>
						Descartar
					</button>
					<button
						disabled={hasChanges}
						type="submit"
						className="rounded px-2 py-1 bg-black text-white disabled:opacity-60 text-sm">
						Guardar
					</button>
				</div>
			</form>
		</section>
	)
}

export default Settings
