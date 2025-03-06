import { getDatabase } from '@/lib/db'
import { BookDb } from '@/types/Books'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const bookObjectId = new ObjectId(id)

    const db = await getDatabase()
    const bookCollection = db.collection<BookDb>('book_chunks')

    

}
