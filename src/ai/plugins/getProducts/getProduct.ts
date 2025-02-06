import { tool } from 'ai'
import { z } from 'zod'
import { Item } from './types'

const getItemsApi = async (query: string, url: string): Promise<Item[]> => {
	const resp = await fetch(
		`${url}/products?${new URLSearchParams({
			query,
		})}`
	)
	const data: { products: Item[] } = await resp.json()
	return data.products
}

const getProduct = async (query: string, settings: typeof getProductSettings) => {
	const items = await getItemsApi(query, settings.url)
	const products: { price: number; name: string }[] = []

	let productStr = ''

	for (let i = 0; i < items.length; i++) {
		const product = items[i]
		products.push({ price: product.rate, name: product.description })
		productStr += `${product.description} - $${product.rate}\n`
	}

	return productStr
}

export const getProductSettings = {
	url: ''
}

export function generateGetProductTool(settings:typeof getProductSettings) {
	return tool({
		description: 'Obten producto y su precio en base a una query',
		parameters: z.object({
			query: z
				.string()
				.describe('El nombre del producto o descripcion proporcionada por el usuario'),
		}),
		execute: ({ query }) => getProduct(query, settings),
		type: 'function',
	})
}
