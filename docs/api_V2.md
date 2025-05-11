# Lista de Rutas:

## Auth
- /api/v2/auth/[...nextauth] (GET, POST)

## Chatbots y sus recursos asociados
- /api/v2/chatbots (POST: crear chatbot)
- /api/v2/chatbots/:chatbotId (PUT, DELETE: actualizar o eliminar)
- /api/v2/chatbots/:chatbotId/chats (GET: obtener todos los chats del chatbot)
- /api/v2/chatbots/:chatbotId/link (GET: generar link para nuevo chat)

## Chats y mensajes
- /api/v2/chats/:chatId (GET: obtener chat con mensajes, POST: agregar mensaje)
- /api/v2/chats/:chatId/messages (DELETE: eliminar todos los mensajes del chat)

## Libros y búsqueda de contenido
- /api/v2/books (POST: crear job de procesamiento)
- /api/v2/books/:bookId/search (GET: búsqueda semántica dentro del libro)

## Cloudinary
- /api/v2/cloudinary/credentials (POST: obtener credenciales)

## WIP
- /api/v2/conversations (WIP)
