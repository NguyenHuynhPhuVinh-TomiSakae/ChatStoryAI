import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import pool from "@/lib/db"

export async function PUT(
  request: Request,
  context: { params: { dialogueId: string } }
) {
  const { dialogueId } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const { new_order } = await request.json()

    // Cập nhật order_number của dialogue
    await pool.execute(
      'UPDATE chapter_dialogues SET order_number = ? WHERE dialogue_id = ?',
      [new_order, dialogueId]
    )

    return NextResponse.json({ message: "Di chuyển dialogue thành công" })
  } catch (error) {
    console.error("Lỗi khi di chuyển dialogue:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 