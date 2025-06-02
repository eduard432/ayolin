import { ChatBotRecord } from '@/types/ChatBot'
import { useQuery } from '@tanstack/react-query'

export type GetChatbotsData = {
	chatbots: ChatBotRecord[]
}

export const getChatBots = async (userId: string) => {
	console.log('getChatBots called with userId:', userId)
	const res = await fetch(`/api/v2/users/${userId}/chatbots`)
	const data: GetChatbotsData = await res.json()

	return data.chatbots
}

export const useChatBots = (userId: string) => {
	return useQuery({
		queryKey: ['chatbots', userId],
		queryFn: () => getChatBots(userId),
		enabled: !!userId,
		refetchOnWindowFocus: false,
	})
}
