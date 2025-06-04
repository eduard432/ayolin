import { ChatBotRecord } from '@/types/ChatBot'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export type GetChatbotsData = {
	chatbots: ChatBotRecord[]
}

export const getChatbots = async (userId: string) => {
	console.log('getChatBots called with userId:', userId)
	const res = await fetch(`/api/v2/users/${userId}/chatbots`)
	const data: GetChatbotsData = await res.json()

	return data.chatbots
}

export const useChatBots = (userId: string) => {
	return useQuery({
		queryKey: ['chatbots', userId],
		queryFn: () => getChatbots(userId),
		enabled: !!userId,
		refetchOnWindowFocus: false,
	})
}

export const deleteChatbot = async (chatBotId: string) => {
	const response = await fetch(`/api/v2/chatbots/${chatBotId}`, {
		method: 'DELETE',
	})

	if (!response.ok) throw new Error('Failed to delete chatbot')

	return true
}

export const useDeleteChatbot = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteChatbot,
		onSuccess: () => {
			// Invalidar quiery para refetch chatbots
			queryClient.invalidateQueries({ queryKey: ['chatbots'] })
		},
		onMutate: async (id) => {
			// Optimistic Update:
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

type ChatBotInputData = {
	name: string
	initialPrompt: string
	model: string
}

type UpdateChatBotData = {
	data: ChatBotInputData
	chatBotId: string
}

export const updateChatbot = async ({ chatBotId, data }: UpdateChatBotData) => {
	const response = await fetch(`/api/v2/chatbots/${chatBotId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) throw new Error('Failed to delete chatbot')

	return true
}

export const useUpdateChatbot = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateChatbot,
		onSuccess: () => {
			// Invaldiate query to refetch chatbots
			queryClient.invalidateQueries({ queryKey: ['chatbots'] })
		},
	})
}

type CreateChatBotData = {
	data: ChatBotInputData
	userId: string
}

export const createChatbot = async ({ data, userId }: CreateChatBotData) => {
	if(!userId) throw new Error('User ID is required to create a chatbot')
	const response = await fetch('/api/v2/chatbots', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...data, userId }),
	})

	if (!response.ok) throw new Error('Failed to create chatbot')

	return true
}

export const useCreateChatbot = () => {
	const router = useRouter()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createChatbot,
		onSuccess: () => {
			// Redirect to chatbots list after successful creation
			router.push('/dashboard/chatbot')

			// Invalidate query to refetch chatbots
			queryClient.invalidateQueries({ queryKey: ['chatbots'] })
		},
	})
}