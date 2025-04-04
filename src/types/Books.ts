import { Embedding } from "ai"
import { ObjectId } from "mongodb"

export interface BookChunkRecord extends BookChunk {
    bookId: string
}

export interface BookChunkDb extends BookChunk {
    bookId: ObjectId
}

export interface BookChunk {
    content: string
    embedding: Embedding
    page: number
    chunk: number
    sBookId: string
}

export interface BookRecord extends Book {
    bookChunks: string[]
}

export interface BookDb extends Book {
    bookChunks: ObjectId[]
}

export interface Book {
    name: string
    pages: number
    chunks: number
    status: 'pending' | 'ready'
}