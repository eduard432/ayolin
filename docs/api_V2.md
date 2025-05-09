# Lista de Rutas:

## Auth
- /api/auth/[...nextauth] (GET, POST)

## Chatbots y sus recursos asociados
- /api/chatbots (POST: crear chatbot)
- /api/chatbots/:chatbotId (PUT, DELETE: actualizar o eliminar)
- /api/chatbots/:chatbotId/chats (GET: obtener todos los chats del chatbot)
- /api/chatbots/:chatbotId/link (GET: generar link para nuevo chat)

## Chats y mensajes
- /api/chats/:chatId (GET: obtener chat con mensajes, POST: agregar mensaje)
- /api/chats/:chatId/messages (DELETE: eliminar todos los mensajes del chat)

## Libros y búsqueda de contenido
- /api/books (POST: crear job de procesamiento)
- /api/books/:bookId/search (GET: búsqueda semántica dentro del libro)

## Cloudinary
- /api/cloudinary/credentials (POST: obtener credenciales)

## WIP
- /api/conversations (WIP)
