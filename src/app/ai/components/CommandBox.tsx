/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface CommandBoxProps {
  command: string
  status: 'loading' | 'success' | 'error'
  params?: Record<string, any>
}

export function CommandBox({ command, status, params }: CommandBoxProps) {
  const getCommandTitle = () => {
    switch (command) {
      case '/create-story':
        return {
          loading: 'Đang tạo truyện mới...',
          success: 'Đã tạo truyện thành công!',
          error: 'Có lỗi xảy ra khi tạo truyện!'
        }[status]
      case '/create-character':
        return {
          loading: 'Đang tạo nhân vật mới...',
          success: 'Đã tạo nhân vật thành công!',
          error: 'Có lỗi xảy ra khi tạo nhân vật!'
        }[status]
      default:
        return 'Đang xử lý...'
    }
  }

  const getParamLabel = (key: string) => {
    const labels: Record<string, string> = {
      title: 'Tiêu đề',
      description: 'Mô tả',
      mainCategoryId: 'Thể loại chính',
      tagIds: 'Tags',
      name: 'Tên',
      role: 'Vai trò',
      gender: 'Giới tính',
      birthday: 'Ngày sinh',
      height: 'Chiều cao',
      weight: 'Cân nặng',
      personality: 'Tính cách',
      appearance: 'Ngoại hình',
      background: 'Quá khứ'
    }
    return labels[key] || key
  }

  return (
    <div className="bg-secondary/50 rounded-lg p-4 my-2 space-y-2">
      <div className="flex items-center gap-2">
        {status === 'loading' && (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium">{getCommandTitle()}</span>
      </div>
      
      {params && (
        <div className={`text-sm space-y-1 ${
          status === 'success' ? 'text-green-600' :
          status === 'error' ? 'text-red-600' :
          'text-muted-foreground'
        }`}>
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium">{getParamLabel(key)}:</span>
              <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 