import { redirect } from 'next/navigation'
import Form from './Form'
import { auth } from '@/auth'

type InputData = {
	name: string
	initialPrompt: string
	model: string
}

export default async function CreatePage() {
	const session = await auth()

	if (!session?.user || !session.user.id) return redirect('/')

	return <Form userId={session.user.id} />
}
