import Together from "together-ai";

// Hàm để lấy API key từ API route
export async function getTogetherApiKey(): Promise<string> {
  try {
    const response = await fetch('/api/together/key');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Không thể lấy API key');
    }
    
    const data = await response.json();
    return data.apiKey;
  } catch (error) {
    console.error("Lỗi khi lấy Together API key:", error);
    throw error;
  }
}

// Khởi tạo Together client với API key
export async function getTogetherClient(): Promise<Together> {
  const apiKey = await getTogetherApiKey();
  return new Together({ apiKey });
}

interface GenerateImageParams {
  prompt: string;
  negativePrompt: string;
  width?: number;
  height?: number;
  steps?: number;
}

interface TogetherResponse {
  data: Array<{
    b64_json: string;
  }>;
}

export async function generateImage({
  prompt,
  negativePrompt,
  width = 768,
  height = 1024,
  steps = 4,
}: GenerateImageParams): Promise<string> {
  try {
    const together = await getTogetherClient();
    
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      negative_prompt: negativePrompt,
      width,
      height,
      steps: Math.min(steps, 4),
      n: 1,
      response_format: "base64"
    }) as unknown as TogetherResponse;

    const base64Data = response.data[0].b64_json;
    if (!base64Data) {
      throw new Error("Không nhận được dữ liệu ảnh");
    }
    
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    return cleanBase64;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
} 