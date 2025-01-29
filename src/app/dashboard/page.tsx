import SignOut from '@/components/signout-button'
import Link from 'next/link'
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { FaPencil, FaRegMessage, FaRegSquarePlus, FaRegTrashCan } from 'react-icons/fa6'
import ChatBots from './ChatBots'
import { getChatbots } from '../services/chatbotService'

const DashBoardPage = async () => {
	const session = await auth()

	if (!session?.user || !session.user.id) return redirect('/')
	const chatBots = await getChatbots(session.user.id)

	return (
		<main className="p-4 px-12 bg-neutral-50 text-neutral-950 h-screen">
			<section className="my-4">
				<Link
					className="flex w-fit items-center justify-between gap-x-1 bg-black text-white rounded-md px-4 py-2"
					href="/dashboard/chatbot/create">
					<FaRegSquarePlus /> Create ChatBot
				</Link>
			</section>
			<ChatBots
				chatBots={chatBots}
			/>
		</main>
	)
}

export default DashBoardPage
