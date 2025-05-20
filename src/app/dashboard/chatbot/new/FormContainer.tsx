'use client'

import React from 'react'
import ChatBotForm, { ChatBotInputData } from '@/components/ChatBotForm'
import { SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'


const FormContainer = ({userId}: {userId: string}) => {

    const router = useRouter()

	const onSubmit: SubmitHandler<ChatBotInputData> = async (inputData) => {
        const data = {...inputData, userId}
		const result = await fetch('/api/chatbot', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (result.ok) {
			router.push('/dashboard/chatbot')
		}
	}

	return <ChatBotForm handleSubmit={onSubmit} />
}

export default FormContainer
