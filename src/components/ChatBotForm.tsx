'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ChatBotRecord } from '@/types/ChatBot'
import MDEditor from '@uiw/react-md-editor'
import React, { Dispatch, SetStateAction } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type InputData = {
	name: string
	initialPrompt: string
}

type ChatBotFormProps = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
} & Omit<React.ComponentProps<'form'>, 'children'>

const ChatBotForm = ({ chatBot, setChatBot, className, ...props }: ChatBotFormProps) => {
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
		<form
			{...props}
			onSubmit={handleSubmit(onSubmit)}
			className={cn('max-w-2xl grid gap-4', className)}>
			<div className="grid gap-2">
				<Label htmlFor="name">Name:</Label>
				<Input
					{...register('name', {
						required: {
							message: 'Este campo es requerido',
							value: true,
						},
					})}
					name="name"
					type="text"
				/>
				<p className="text-sm text-red-700 min-h-5">{errors.name?.message}</p>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="model">Model:</Label>
				<Select disabled defaultValue="gpt-3.5-turbo">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select:" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
						<SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
						<SelectItem value="gpt-4">gpt-4</SelectItem>
						<SelectItem value="gpt-4o">gpt-4o</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="initialPrompt">Initial Prompt:</Label>
				<Textarea
					{...register('initialPrompt', {
						required: {
							message: 'Este campo es requerido',
							value: true,
						},
					})}
					rows={10}
					name="initialPrompt"
				/>
				<p className="text-sm text-red-700 min-h-5">{errors.initialPrompt?.message}</p>
			</div>
			<div className="flex gap-2 justify-end">
				<Button onClick={() => reset()} disabled={hasChanges} variant="secondary">
					Descartar
				</Button>
				<Button type="submit" disabled={hasChanges}>
					Guardar
				</Button>
			</div>
		</form>
	)
}

export default ChatBotForm
