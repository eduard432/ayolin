'use client'
import Header from '@/components/Header'
import ChatBotForm from '@/components/ChatBotForm'
import { useSession } from 'next-auth/react'
import { useCreateChatbot } from '@/services/chatbot.client'

const NewChatBotPage = () => {

	const { data: session, status } = useSession()
	const { mutate } = useCreateChatbot()


	return (
		<main>
			<Header
				title={{
					content: 'Chat Bots',
					url: '/dashboard/chatbot',
				}}
				subTitle="New chatbot"
			/>
			<h3 className="text-4xl p-4 font-semibold">Create a new chat bot</h3>
			<section className="p-4 pt-0 ">
				<ChatBotForm handleSubmit={(data) => mutate({data, userId: session?.user?.id || ''})} />
			</section>
		</main>
	)
}

export default NewChatBotPage
