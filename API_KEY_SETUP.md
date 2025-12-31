# Hướng Dẫn Cấu Hình API Key

## Vấn Đề
API key hiện tại đã bị Google chặn do bị leak. Bạn cần tạo API key mới.

## Cách Tạo API Key Mới

1. Truy cập: https://aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google của bạn
3. Click "Create API Key"
4. Chọn project hoặc tạo project mới
5. Copy API key vừa tạo

## Cách Thêm API Key Vào Project

1. Tạo file `.env` trong thư mục gốc của project (cùng cấp với `package.json`)
2. Thêm dòng sau vào file `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Thay `your_api_key_here` bằng API key bạn vừa copy
4. **QUAN TRỌNG**: Đảm bảo file `.env` đã được thêm vào `.gitignore` để không commit API key lên Git

## Lưu Ý Bảo Mật

- ⚠️ **KHÔNG BAO GIỜ** commit file `.env` lên Git
- ⚠️ **KHÔNG BAO GIỜ** chia sẻ API key của bạn
- ⚠️ Nếu API key bị leak, Google sẽ tự động chặn và bạn cần tạo key mới

## Sau Khi Thêm API Key

1. Khởi động lại development server:
   ```bash
   npm run dev
   ```
2. Tính năng AI sẽ hoạt động bình thường

## Kiểm Tra API Key Có Hoạt Động

Sau khi thêm API key, thử tạo một học phần từ vựng bằng AI. Nếu thành công, API key đã hoạt động đúng.

