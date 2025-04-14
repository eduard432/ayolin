'use client'

import { SubmitHandler } from 'react-hook-form'
import { useChatBot } from '../../ChatBotContext'
import ChatBotForm, { ChatBotInputData } from '@/components/ChatBotForm'

export default function SettingsPage() {
	const { chatBot, setChatBot } = useChatBot()

	const onSubmit: SubmitHandler<ChatBotInputData> = async (inputData) => {
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
		<ChatBotForm handleSubmit={onSubmit} chatBot={chatBot}  />
	)
}
