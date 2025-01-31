import { MODELS } from '@/lib/MODELS'
import { ChatBotRecord } from '@/types/ChatBot'

const Stat = ({ value, name }: { value: number; name: string }) => {
	return (
		<article className="w-1/4 border border-gray-300 rounded p-4">
			<p className="text-gray-500">{name}:</p>
			<h5 className="text-5xl font-mono flex items-start">
				{value
					.toLocaleString('es-MX', {
						notation: 'compact',
						maximumFractionDigits: 2,
					})
					.replaceAll(/\s/g, '')}
			</h5>
		</article>
	)
}

const Stats = ({ chatBot }: { chatBot: ChatBotRecord }) => {
	const { chats, usedTokens, model, totalMessages } = chatBot

	return (
		<>
			<section className="my-4 flex gap-4">
				<Stat value={chats.length} name="Chats" />
				<Stat value={totalMessages} name="Mensajes" />
				<Stat value={usedTokens.input} name="Input Tokens" />
				<Stat value={usedTokens.output} name="Output Tokens" />
			</section>
			<section className="my-4">
				<h4 className="text-xl font-semibold my-2">Costos Estmiados: ({model})</h4>
				<div className="flex gap-4">
					<article className="w-1/2 border border-gray-300 rounded p-4">
						<p className="text-neutral-500">Input:</p>
						<p className="font-mono">
							<span className="bg-neutral-300 px-2 rounded">
								${MODELS[model][0]} USD / 1M tkns
							</span>{' '}
							=&gt;{' '}
							<span className="bg-neutral-300 px-2 rounded">
								{(MODELS[model][0] / 1000000).toLocaleString('es-Mx', {
									notation: 'compact',
								})}
							</span>{' '}
							* <span className="bg-sky-200 px-2 rounded">{usedTokens.input} tkn</span>{' '}={' '}
							<span className="bg-neutral-800 text-neutral-50 px-2 rounded">
								$
								{((MODELS[model][0] / 1000000) * usedTokens.input).toLocaleString(
									'es-Mx',
									{
										notation: 'compact',
									}
								)}{' '}
								USD{' '}
							</span>
						</p>
					</article>
					<article className="w-1/2 border border-gray-300 rounded p-4">
						<p className="text-neutral-500">Output:</p>
						<p className="font-mono">
							<span className="bg-neutral-300 px-2 rounded">
								${MODELS[model][1]} USD / 1M tkns
							</span>{' '}
							=&gt;{' '}
							<span className="bg-neutral-300 px-2 rounded">
								{(MODELS[model][1] / 1000000).toLocaleString('es-Mx', {
									notation: 'compact',
								})}
							</span>{' '}
							* <span className="bg-sky-200 px-2 rounded">{usedTokens.output} tkn</span>{' '}={' '}
							<span className="bg-neutral-800 text-neutral-50 px-2 rounded">
								$
								{((MODELS[model][1] / 1000000) * usedTokens.output).toLocaleString(
									'es-Mx',
									{
										notation: 'compact',
									}
								)}{' '}
								USD{' '}
							</span>
						</p>
					</article>
				</div>
			</section>
		</>
	)
}

export default Stats
