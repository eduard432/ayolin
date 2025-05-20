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
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export type ChatBotInputData = {
	name: string
	initialPrompt: string
	model: string
}

type ChatBotFormProps = {
	chatBot?: ChatBotRecord
	handleSubmit: SubmitHandler<ChatBotInputData>
	redirect?: string
} & Omit<React.ComponentProps<'form'>, 'children'>

const ChatBotForm = ({
	chatBot,
	className,
	handleSubmit: handleSubmitForm,
	redirect,
	...props
}: ChatBotFormProps) => {
	const router = useRouter()

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<ChatBotInputData>({
		values: chatBot,
		mode: 'onBlur',
	})



	const currentValues = watch()

	return (
		<form
			{...props}
			onSubmit={handleSubmit(handleSubmitForm)}
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
				<Controller
					control={control}
					name="model"
					rules={{
						required: {
							message: 'Este campo es requerido',
							value: true,
						},
					}}
					render={({ field }) => (
						<Select
							value={field.value}
							onValueChange={field.onChange}
							disabled={!!chatBot}
							>
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
					)}
				/>
				<p className="text-sm text-red-700 min-h-5">{errors.model?.message}</p>
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
			{chatBot ? (
				<div className="flex gap-2 justify-end">
					<Button
						onClick={() => reset()}
						disabled={
							JSON.stringify(chatBot) == JSON.stringify(currentValues)
						}
						variant="secondary">
						Descartar
					</Button>
					<Button
						type="submit"
						disabled={
							JSON.stringify(chatBot) == JSON.stringify(currentValues)
						}>
						Guardar
					</Button>
				</div>
			) : (
				<div className="flex gap-2 justify-end">
					<Button
						onClick={() => router.push(redirect || '/dashboard/chatbot')}
						variant="secondary">
						Descartar
					</Button>
					<Button type="submit">Guardar</Button>
				</div>
			)}
		</form>
	)
}

export default ChatBotForm
