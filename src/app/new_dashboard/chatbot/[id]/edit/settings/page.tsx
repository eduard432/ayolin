'use client'

import { useChatBot } from '../../ChatBotContext'
import ChatBotForm from '@/components/ChatBotForm'

export default function SettingsPage() {
	const { chatBot, setChatBot } = useChatBot()

	return (
		<ChatBotForm chatBot={chatBot} setChatBot={setChatBot}  />
	)
}
