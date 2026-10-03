# Triển khai SmartMeal mobile — 03/10/2026

## Quyết định của người dùng trong tác vụ

- Nguồn: PRD v1.1, PSD hiện có, Chibi (1)/(2).
- Roster: HIN (cún), LIN (trầm), Đi Đi (mèo), Anh (năng động), Hạt Cơm thường. Bỏ pixel rice riêng khỏi hồ sơ AI. Cho phép thiết lập nội dung nhân vật.
- Đã duyệt kiến trúc Expo + Supabase Auth/PostgreSQL/private Storage + hàm máy chủ OpenAI. Không tự tạo tài khoản/mua gói.
- Xác nhận lại bottom sheet AI trượt dưới, cao 2/3; quyết định này thay dòng “centered” của PRD 12.2 trong triển khai, **không sửa PRD**.

## Quy tắc mới đã tách thành domain

- Múi giờ Asia/Ho_Chi_Minh; phân loại theo `generatedAt` bất biến: sáng [02:30,10:00), trưa [10:00,15:30), tối còn lại. Snack độc lập. Ngày ăn có thể khác ngày sinh món.
- Mỗi lần xác nhận có operation ID; cùng ID không tạo lại. Cùng nhóm bữa chứa nhiều món. Xóa theo eaten-dish ID; chỉ xóa đợt khi hết món.
- Chọn combo và thành phần trùng nhau bị chặn tạm, không tự quyết quy tắc dedupe OPEN.
- Tiêu hóa: duration >0 bắt buộc, optional giữ thiếu; sửa cùng ID; số đếm từ bản ghi; thiếu không phải 0.
- A8: hai cửa sổ 7 ngày, mỗi bên ≥7 bản ghi, ≥3 ngày, khoảng cách giữa ngày có ghi ≤4; ≥5 giá trị mỗi field. Descriptive eligibility riêng.
- G/B: Pareto groups giữ ties/conflicts, không tự thêm trọng số hoặc dùng I để phá hòa chưa chốt. Dự phòng T+10; unknown G hiển thị thiếu dữ liệu.

## Mức triển khai dịch vụ

Supabase migrations và Edge Functions là mã chuẩn bị triển khai, không phải bằng chứng đã chạy trên cloud. RLS read theo auth.uid; ghi qua RPC; firstUse/streak do server sở hữu. Revision conflict trả lỗi, không silently overwrite. SMTP, secrets, dữ liệu có license, lựa chọn model và ngân sách chưa được cấp.

Recipe/image pipeline chỉ lựa chọn catalog đã duyệt; không tự tạo nutrient claims. Cấp ID và hình ổn định theo tài khoản; trả kết quả sau khi có cả recipe/image. Nhật ký tiêu hóa chỉ được thêm vào prompt tạo món khi useJournal=true; conversation chung không nhận dữ liệu đó. Không log nội dung sức khỏe vào repo.

## Chưa hoàn tất

Xem README mobile và báo cáo visual audit. Không gọi đây là app production hoàn chỉnh hoặc bản PSD khớp 100%. Checklist visual và runtime phải tiếp tục trước khi phát hành.
