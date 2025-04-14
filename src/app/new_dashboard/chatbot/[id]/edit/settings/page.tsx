'use client'

import { SubmitHandler } from 'react-hook-form'
import { useChatBot } from '../../ChatBotContext'
import ChatBotForm, { ChatBotInputData } from '@/components/ChatBotForm'

export default function SettingsPage() {
	const { chatBot, setChatBot } = useChatBot()

	const onSubmit: SubmitHandler<ChatBotInputData> = async (inputData) => {
		const {model, ...restData} = inputData
		const result = await fetch(`/api/chatbot/${chatBot._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(restData),
		})
		if (result.ok && chatBot) {
			const { initialPrompt, name } = restData
			const newData = { ...chatBot, initialPrompt, name }
			setChatBot(newData)
		}
	}

	return (
		<ChatBotForm handleSubmit={onSubmit} chatBot={chatBot}  />
	)
}
