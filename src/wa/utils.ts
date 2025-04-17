type SendMessageProps = {
	business_phone_number_id: string
	to: string
	text: string
	message_id?: string
}

const sendMessage = async ({
	business_phone_number_id,
	to,
	text,
	message_id,
}: SendMessageProps) => {
	const headers = {
		Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
		'Content-Type': 'application/json',
	}
	try {
		const res = await fetch(
			`https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
			{
				method: 'POST',
				headers,
				body: JSON.stringify({
					messaging_product: 'whatsapp',
					to,
					text: { body: 'Echo: ' + text },
					context: {
						message_id,
					},
				}),
			}
		)
		if (!res.ok) {
			const text = await res.text()
			console.error(`Request failed: ${res.status} - ${text}`)
		}
	} catch (error) {
		console.log(error)
	}
}
