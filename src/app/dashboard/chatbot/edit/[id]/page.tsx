import ForwardButton from '@/components/client/ForwardButton'
import { getChatBot } from '@/app/services/chatbotService'
import { notFound } from 'next/navigation'
import Form from './Form'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const chatBot = await getChatBot(id)

	if (!chatBot) return notFound()

	return (
		<main className="p-4 px-12 bg-neutral-50 text-neutral-950 min-h-screen">
			<ForwardButton />
			<h2 className="text-2xl font-semibold">Editar a: "{chatBot.name}"</h2>
			<Form chatBot={chatBot} />
		</main>
	)
}
