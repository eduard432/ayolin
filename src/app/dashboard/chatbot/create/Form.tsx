'use client'

import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import ForwardButton from '@/components/client/ForwardButton'
import { MODELS } from '@/lib/MODELS'

type InputData = {
	name: string
	initialPrompt: string
	model: string
}

export default function Form({ userId }: { userId: string }) {
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputData>({
		defaultValues: {
			initialPrompt: '',
			name: '',
		},
		mode: 'onBlur',
	})

	const onSubmit: SubmitHandler<InputData> = async (inputData) => {
		const response = await fetch(`/api/chatbot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...inputData, userId }),
		})
		if (response.ok) {
			router.push('/dashboard')
		}
	}

	return (
		<main className="p-4 px-12 bg-neutral-50 text-neutral-950 h-screen">
			<ForwardButton />
			<h2 className="text-2xl font-semibold">Crear bot</h2>
			<section className="w-1/2 mx-auto">
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 my-4">
					<div className="flex gap-2 items-center">
						<label htmlFor="name">Nombre:</label>
						<input
							{...register('name', {
								required: {
									message: 'Este campo es requerido',
									value: true,
								},
							})}
							className="px-2 py-1 outline-none rounded border border-gray-300"
							name="name"
							type="text"
						/>
						{errors.name && <p className="text-red-700">{errors.name.message}</p>}
					</div>
					<div className="flex gap-2 items-center">
						<label htmlFor="model">Modelo:</label>
						<select
							{...register('model', {
								required: {
									message: 'Este campo es requerido',
									value: true,
								},
							})}
							className="px-2 py-1 border rounded border-gray-300"
							name="model">
							{Object.keys(MODELS).map((model) => (
								<option>{model}</option>
							))}
						</select>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="initialPrompt">Mensaje Inicial:</label>
						<textarea
							{...register('initialPrompt', {
								required: {
									message: 'Este campo es requerido',
									value: true,
								},
							})}
							className="outline-none border border-gray-300 rounded px-2 py-1"
							rows={2}
							name="initialPrompt"></textarea>
					</div>
					<div className="flex space-x-2">
						<button
							type="button"
							className="rounded px-3 py-2 border border-gray-300 disabled:opacity-60"
							onClick={() => router.push('/dashboard')}>
							Cancelar
						</button>
						<button
							type="submit"
							className="rounded px-3 py-2 bg-black text-white disabled:opacity-60">
							Guardar
						</button>
					</div>
				</form>
			</section>
		</main>
	)
}
