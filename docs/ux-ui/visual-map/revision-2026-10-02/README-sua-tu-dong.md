# Sửa tự động — Cập nhật UX/UI SmartMeal AI (02.10.2026)

## Đã làm gì
Đồng bộ phong cách thiết kế của các Group **05, 06, 07, 10** và màn **I04** (thuộc Group 09)
theo đúng ngôn ngữ thiết kế đã hoàn thiện ở **01, 02, 03, 09**.

Toàn bộ 23 màn hình được gom trong **một nhóm layer tên `Sửa tự động`** trong file:
`docs/ux-ui/visual-map/revision-2026-10-02/Sua-tu-dong.psd`

## Bảo vệ file gốc
- File gốc `SmartMeal-UX-UI-Flow-Map.psd` **không bị sửa/xóa/ghi đè**.
- SHA-256 sau khi làm việc: `C23417DFA52D7B6B5322C88D7B6B5322C88D75B5B8743C7C8208F7921DF62554AD833511CE1C` (khớp fingerprint gốc).
- Mọi thay đổi đều dựng trên bản sao/ảnh mới, không đụng lớp gốc.

## Cấu trúc nhóm "Sửa tự động"
| Nhóm | Màn | Nội dung |
|------|-----|----------|
| 05 · Nhật ký / xóa từng món | D01–D04 | Lịch ngày, vòng tổng đợt, thẻ món, modal xóa, trạng thái 0 đợt |
| 06 · Ghi lại / nhập và lưu | R02–R07 | Biểu mẫu rỗng/một phần/lỗi/hợp lệ + màn phân tích |
| 07 · Ghi lại / lịch sử & sửa | R08–R13 | Lịch sử, vuốt xóa, modal xác nhận, sửa giữ ID, rỗng |
| 10 · AI / mở lại & Hồ sơ AI | I06, I07, P01–P04 | Mở lại hội thoại, hồ sơ nhân vật HIN, xem thử/lưu |
| 09 · AI / nhiều kết quả | I04 | Welcome, tin nhắn, bằng chứng G/I/B, thẻ món & combo, lưu đã ăn, thanh nhập |

## Nguyên tắc thiết kế đã áp dụng
- Bảng màu brand: lime `#BBE11A`, vàng `#E8F957`, trời `#C1E5FB`, xanh dương `#4891E7`, chì `#39452D`.
- Bo góc lớn (22–34px), thẻ trắng có đổ bóng mềm, phân cấp thông tin rõ.
- Màn AI: gradient trời→lime, avatar HIN (phong cách cún con), thẻ chào, bong bóng chat, thanh nhập đáy.
- Mọi nội dung hiển thị đầy đủ trong khung — **không** dùng "cuộn xuống" để ẩn bớt.
- Ảnh món chưa có bản chính thức thì chừa ô ghi chú `[Ảnh món]` / `[Ảnh cả bữa]` để bổ sung sau.

## File kèm theo
- `Sua-tu-dong.psd` — file PSD lớp, nhóm `Sửa tự động`.
- `v2-overview.png`, `v2-group-*.png` — ảnh xem trước.
- `v2-<ID>.png` — ảnh từng màn.
- `build-v2.cjs` — script dựng lại (Node + ag-psd).

## Mở vào bản đồ flow gốc
Trong Photoshop: mở `Sua-tu-dong.psd`, copy nhóm `Sửa tự động`, dán sang bản đồ flow gốc,
đặt bên phải các dải 01–10. File gốc giữ nguyên; nên lưu bản hợp nhất dưới tên mới.
