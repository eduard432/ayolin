import { ChatBotRecord } from '@/types/ChatBot'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export async function deleteChatBot(chatBotId: string) {
	const response = await fetch(`/api/v2/chatbots/${chatBotId}`, {
		method: 'DELETE',
	})

	if (!response.ok) throw new Error('Failed to delete chatbot')

	return true
}

export function useDeleteChatbot() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteChatBot,
		onSuccess: () => {
			// Invalidar quiery para refetch chatbots
			queryClient.invalidateQueries({ queryKey: ['chatbots'] })
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ['chatbots'] })

			const previousChatbots = queryClient.getQueryData(['chatbots'])

			queryClient.setQueryData(['chatbots'], (old: ChatBotRecord[]) =>
				old?.filter((chatbot) => chatbot._id !== id)
			)

			return previousChatbots
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(['chatbots'], context)
		},
	})
}
