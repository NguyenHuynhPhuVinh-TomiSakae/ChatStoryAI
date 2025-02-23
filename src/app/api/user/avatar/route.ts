/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { GoogleDriveService } from "@/services/google-drive.service";
import { AuthService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id as string);
    
    // Convert File thành Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload file mới lên Google Drive với userId
    const uploadResultPromise = GoogleDriveService.uploadFile(buffer, file.type, userId);

    // Lấy thông tin user cũ để xóa ảnh cũ nếu có
    const userPromise = AuthService.getUser(userId);

    const [uploadResult, user] = await Promise.all([uploadResultPromise, userPromise]);

    if (!uploadResult.fileId || !uploadResult.directLink) {
      throw new Error("Upload failed: Missing file ID or direct link");
    }

    // Xóa file cũ trên Google Drive nếu có
    if (user.drive_file_id) {
      await GoogleDriveService.deleteFile(user.drive_file_id);
    }

    // Cập nhật URL mới trong database
    const result = await AuthService.updateAvatar(userId, uploadResult.directLink, uploadResult.fileId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in avatar upload:', error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi xử lý file" },
      { status: 500 }
    );
  }
} 