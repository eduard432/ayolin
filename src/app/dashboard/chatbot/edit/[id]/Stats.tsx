import { ChatBotRecord } from '@/types/ChatBot'

const Stat = ({ value, name }: { value: number; name: string }) => {
	return (
		<div className="w-1/3 border border-gray-300 rounded p-4">
			<p className="text-gray-500">{name}:</p>
			<h5 className="text-5xl font-mono flex items-start">
				{value
					.toLocaleString('es-MX', {
						notation: 'compact',
						maximumFractionDigits: 2,
					})
					.replaceAll(/\s/g, '')}
			</h5>
		</div>
	)
}

const Stats = ({ chatBot }: { chatBot: ChatBotRecord }) => {

	console.log({chats: chatBot.chats})

	return (
		<section className="my-4 flex gap-4">
			<Stat value={chatBot.chats.length} name="Chats" />
			<Stat value={chatBot.totalMessages} name="Mensajes" />
			<Stat  value={chatBot.usedTokens.input} name="Input Tokens" />
			<Stat  value={chatBot.usedTokens.output} name="Output Tokens" />
		</section>
	)
}

export default Stats
