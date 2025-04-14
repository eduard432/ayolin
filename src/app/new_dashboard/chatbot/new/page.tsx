import { auth } from '@/auth'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import FormContainer from './FormContainer'

const NewChatBotPage = async () => {
	const session = await auth()

	if (!session?.user || !session.user.id) return redirect('/')

	return (
		<main>
			<Header
				title={{
					content: 'Chat Bots',
					url: '/new_dashboard/chatbot',
				}}
				subTitle="New chatbot"
			/>
			<h3 className="text-4xl p-4 font-semibold">Create a new chat bot</h3>
			<section className="p-4 pt-0 ">
				<FormContainer userId={session.user.id} />
			</section>
		</main>
	)
}

export default NewChatBotPage
