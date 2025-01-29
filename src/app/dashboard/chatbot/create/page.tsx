import { redirect } from 'next/navigation'
import Form from './Form'
import { auth } from '@/auth'

export default async function CreatePage() {
	const session = await auth()

	if (!session?.user || !session.user.id) return redirect('/')

	return <Form userId={session.user.id} />
}
