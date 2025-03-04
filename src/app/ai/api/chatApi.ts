export interface ChatHistory {
  chat_id: number
  title: string
  updated_at: string
}

export const fetchChatHistory = async () => {
  const res = await fetch('/api/ai/chat-history')
  const data = await res.json()
  return data.history
}

export const fetchChatMessages = async (chatId: number) => {
  const res = await fetch(`/api/ai/chat-history/${chatId}`)
  const data = await res.json()
  return data.messages
}

export const deleteChat = async (chatId: number) => {
  await fetch(`/api/ai/chat-history/${chatId}`, {
    method: 'DELETE'
  })
}

export const saveMessage = async (
  chatId: number | null,
  role: "user" | "assistant",
  content: string,
  images?: { buffer: number[], mimeType: string }[]
) => {
  const res = await fetch('/api/ai/chat-history/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      role,
      content,
      ...(images && { images })
    })
  })
  return await res.json()
}

export const createStory = async (params: {
  title: string;
  description: string;
  mainCategoryId: string | number;
  tagIds: number[];
}) => {
  const formData = new FormData()
  formData.append('title', params.title)
  formData.append('description', params.description)
  formData.append('mainCategoryId', params.mainCategoryId.toString())
  formData.append('tagIds', JSON.stringify(params.tagIds))

  const response = await fetch('/api/stories/create', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Không thể tạo truyện')
  }

  return await response.json()
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Tag {
  id: number;
  name: string;
  description: string;
}

interface CategoriesResponse {
  mainCategories: Category[];
  tags: Tag[];
}

export const fetchCategories = async (): Promise<CategoriesResponse> => {
  const res = await fetch('/api/categories')
  const data = await res.json()
  return data
}