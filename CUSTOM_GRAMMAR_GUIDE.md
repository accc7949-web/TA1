# Custom Grammar Feature - Hướng Dẫn Sử Dụng

## Giới Thiệu
Tính năng **Ngữ Pháp Tùy Chỉnh** cho phép bạn tạo các đơn vị ngữ pháp riêng của mình với các bài học, và có thể tạo bài học bằng tay hoặc dùng AI.

## Cách Truy Cập
1. Đăng nhập vào tài khoản
2. Tại trang chủ, click vào "Ôn Tập Ngữ Pháp"
3. Bạn sẽ thấy nút "✨ Ngữ Pháp Tùy Chỉnh" ở đầu danh sách categories

## Các Tính Năng

### 1. Tạo Đơn Vị Mới (Unit)
- Click nút "+ Tạo Đơn Vị Mới"
- Nhập tên đơn vị (vd: "Present Tense", "Conditional Sentences")
- Nhập mô tả ngắn gọn
- Click "Tạo"

### 2. Tạo Bài Học (Lesson)
Có 2 cách:

#### A. Tạo Bằng Tay (📝 Manual)
- Click nút "+ Bài Học" dưới unit
- Chọn "📝 Tạo Bằng Tay"
- Nhập:
  - **Tiêu Đề**: Tên bài học
  - **Mô Tả Ngắn**: Một dòng mô tả
  - **Nội Dung**: Giải thích chi tiết (hỗ trợ Markdown)
  - **Ví Dụ**: Tối đa 5 ví dụ
  - **Độ Khó**: Chọn Cơ Bản / Trung Bình / Nâng Cao
- Click "Tạo Bài Học"

#### B. Tạo Bằng AI (✨ AI-Generated)
- Click nút "+ Bài Học" dưới unit
- Chọn "✨ Tạo Bằng AI"
- Nhập:
  - **Chủ Đề**: Mô tả chủ đề (vd: "First Conditional Usage")
  - **Độ Khó**: Chọn mức độ
- Click "Tạo Bằng AI"
- AI sẽ tự động tạo tiêu đề, mô tả, nội dung chi tiết và 5 ví dụ

### 3. Xem Bài Học
- Click vào bài học trong danh sách (📝 hoặc ✨ icon)
- Xem nội dung với các ví dụ được format đẹp
- Click "Quay Lại" để trở về danh sách units

### 4. Quản Lý Units
- **Xóa Unit**: Click nút "Xóa" đỏ (xoá toàn bộ unit và tất cả lessons của nó)
- **Số lượng Lessons**: Hiển thị số bài học trong unit

## Cấu Trúc Dữ Liệu (Firebase)

Dữ liệu được lưu trong Firestore:
```
users/{uid}/customGrammarUnits/{unitId}
├── name: string
├── description: string
├── lessons: CustomGrammarLesson[]
│   ├── id: string
│   ├── title: string
│   ├── description: string
│   ├── content: string (Markdown)
│   ├── examples: string[]
│   ├── difficulty: "beginner" | "intermediate" | "advanced"
│   ├── createdAt: number
│   ├── updatedAt: number
│   └── isAIGenerated: boolean
├── createdAt: number
└── updatedAt: number
```

## Markdown Support

Nội dung hỗ trợ Markdown:
- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `code` ``
- Headings: `# H1`, `## H2`, `### H3`

## Giới Hạn Hiện Tại
- Tối đa 5 ví dụ mỗi bài học
- Lưu theo từng tài khoản (không chia sẻ giữa các user)
- Không có chế độ sửa bài học hiện tại (có thể sửa trong tương lai)

## Tích Hợp Với AI
- Sử dụng Google Gemini API để tạo bài học
- Tự động parse JSON response từ AI
- Tự động detect và format content theo Markdown

## Lỗi Thường Gặp
1. **"Lỗi khi tạo bài học AI"**: Kiểm tra quota Google Gemini API hoặc mô tả chủ đề quá ngắn
2. **"Unit not found"**: Có thể unit đã bị xoá, hãy refresh trang
3. **Không thấy nút Custom Grammar**: Hãy đăng nhập trước
