# SmartMeal — Phụ lục trạng thái xem trước

Sinh từ các bảng trạng thái trong mã nguồn; không chạy JavaScript để tạo danh mục. Các trạng thái này sử dụng dữ liệu mẫu, một số cố ý tái hiện lỗi cũ. **Không dùng trạng thái “trước sửa” làm thiết kế chuẩn.**

Build ứng dụng bằng `python app/wireframe/build-update.py`, rồi phục vụ thư mục repository bằng máy chủ HTTP nội bộ. Liên kết dưới đây mở đúng bản preview trong cùng repository. Các URL có thể reset fixture; đây không phải dữ liệu tài khoản thật.

[Báo cáo chính](SMARTMEAL_UX_UI_HANDOFF.html)

## Home, tài khoản và rà soát mới

Nguồn: `app/wireframe/audit-ui.js` · `auditStates`.

| Trạng thái | Mở xem trước | Ghi chú |
| --- | --- | --- |
| `audit-home` | [Hồ sơ · Chưa đăng nhập](../../app/wireframe/smartmeal-update-preview.html?screen=audit-home&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-member` | [Hồ sơ · Đã hoàn tất (mẫu)](../../app/wireframe/smartmeal-update-preview.html?screen=audit-member&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-incomplete` | [Hồ sơ · Chưa hoàn tất](../../app/wireframe/smartmeal-update-preview.html?screen=audit-incomplete&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-persona` | [Hồ sơ AI · Khung mô tả trống](../../app/wireframe/smartmeal-update-preview.html?screen=audit-persona&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-edit-record` | [Ghi lại · Sửa bản ghi](../../app/wireframe/smartmeal-update-preview.html?screen=audit-edit-record&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-offline` | [Ghi lại · Lỗi lưu giữ nháp](../../app/wireframe/smartmeal-update-preview.html?screen=audit-offline&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-a8` | [A8 · Hai tuần đủ dữ liệu](../../app/wireframe/smartmeal-update-preview.html?screen=audit-a8&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-a8-missing` | [A8 · Thiếu một đặc điểm](../../app/wireframe/smartmeal-update-preview.html?screen=audit-a8-missing&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-goal` | [Hồ sơ · Hỏi mục tiêu sau 7 ngày](../../app/wireframe/smartmeal-update-preview.html?screen=audit-goal&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-streak` | [Hồ sơ · Mở ứng dụng trong ngày](../../app/wireframe/smartmeal-update-preview.html?screen=audit-streak&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-saved-update` | [Sổ tay · Cập nhật công thức](../../app/wireframe/smartmeal-update-preview.html?screen=audit-saved-update&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-no-combo` | [AI · Có món đơn, chưa có combo](../../app/wireframe/smartmeal-update-preview.html?screen=audit-no-combo&panel=1) | Dữ liệu/kịch bản mẫu |
| `audit-ambiguous` | [AI · Nguyên liệu chưa rõ](../../app/wireframe/smartmeal-update-preview.html?screen=audit-ambiguous&panel=1) | Dữ liệu/kịch bản mẫu |

## Nhật ký và AI cập nhật

Nguồn: `app/wireframe/chat-diary-update.js` · `updateStates`.

| Trạng thái | Mở xem trước | Ghi chú |
| --- | --- | --- |
| `update-diary` | [Nhật ký · Ba món / một đợt](../../app/wireframe/smartmeal-update-preview.html?screen=update-diary&panel=1) | Dữ liệu/kịch bản mẫu |
| `update-welcome` | [AI · Chào — chưa đăng nhập](../../app/wireframe/smartmeal-update-preview.html?screen=update-welcome&panel=1) | Dữ liệu/kịch bản mẫu |
| `update-auth` | [AI · Chào — đã đăng nhập (mẫu)](../../app/wireframe/smartmeal-update-preview.html?screen=update-auth&panel=1) | Dữ liệu/kịch bản mẫu |
| `update-results` | [AI · Nhiều kết quả (mẫu)](../../app/wireframe/smartmeal-update-preview.html?screen=update-results&panel=1) | Dữ liệu/kịch bản mẫu |
| `update-empty` | [AI · Không có kết quả hợp lệ](../../app/wireframe/smartmeal-update-preview.html?screen=update-empty&panel=1) | Dữ liệu/kịch bản mẫu |
| `update-before` | [Trước sửa · Nhật ký (tái hiện)](../../app/wireframe/smartmeal-update-preview.html?screen=update-before&panel=1) | Tái hiện trước sửa, không phải bản chuẩn |
| `update-after` | [Sau sửa · Xóa món giữa](../../app/wireframe/smartmeal-update-preview.html?screen=update-after&panel=1) | Dữ liệu/kịch bản mẫu |
| `update-last` | [Sau sửa · Xóa món cuối](../../app/wireframe/smartmeal-update-preview.html?screen=update-last&panel=1) | Dữ liệu/kịch bản mẫu |

## Sổ tay, chi tiết và Hồ sơ AI

Nguồn: `app/wireframe/saved-persona.js` · `savedStates`.

| Trạng thái | Mở xem trước | Ghi chú |
| --- | --- | --- |
| `saved` | [Sổ tay · Món đơn](../../app/wireframe/smartmeal-update-preview.html?screen=saved&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-combo` | [Sổ tay · Combo](../../app/wireframe/smartmeal-update-preview.html?screen=saved-combo&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-search` | [Sổ tay · Tìm kiếm](../../app/wireframe/smartmeal-update-preview.html?screen=saved-search&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-filter` | [Sổ tay · Lọc nguyên liệu](../../app/wireframe/smartmeal-update-preview.html?screen=saved-filter&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-empty` | [Sổ tay · Trống](../../app/wireframe/smartmeal-update-preview.html?screen=saved-empty&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-none` | [Sổ tay · Không có kết quả](../../app/wireframe/smartmeal-update-preview.html?screen=saved-none&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-swipe` | [Sổ tay · Vuốt món đơn](../../app/wireframe/smartmeal-update-preview.html?screen=saved-swipe&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-combo-swipe` | [Sổ tay · Vuốt combo](../../app/wireframe/smartmeal-update-preview.html?screen=saved-combo-swipe&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-detail` | [Chi tiết món dùng chung](../../app/wireframe/smartmeal-update-preview.html?screen=saved-detail&panel=1) | Dữ liệu/kịch bản mẫu |
| `saved-combo-detail` | [Chi tiết combo dùng chung](../../app/wireframe/smartmeal-update-preview.html?screen=saved-combo-detail&panel=1) | Dữ liệu/kịch bản mẫu |
| `persona` | [Hồ sơ AI · Ban đầu](../../app/wireframe/smartmeal-update-preview.html?screen=persona&panel=1) | Dữ liệu/kịch bản mẫu |
| `persona-preview` | [Hồ sơ AI · Xem thử chưa lưu](../../app/wireframe/smartmeal-update-preview.html?screen=persona-preview&panel=1) | Dữ liệu/kịch bản mẫu |
| `persona-success` | [Hồ sơ AI · Đã lưu](../../app/wireframe/smartmeal-update-preview.html?screen=persona-success&panel=1) | Dữ liệu/kịch bản mẫu |
| `persona-unsaved` | [Hồ sơ AI · Rời khi chưa lưu](../../app/wireframe/smartmeal-update-preview.html?screen=persona-unsaved&panel=1) | Dữ liệu/kịch bản mẫu |
| `diary-before` | [Nhật ký · Modal trước sửa](../../app/wireframe/smartmeal-update-preview.html?screen=diary-before&panel=1) | Tái hiện trước sửa, không phải bản chuẩn |
| `diary-after` | [Nhật ký · Modal sau sửa](../../app/wireframe/smartmeal-update-preview.html?screen=diary-after&panel=1) | Dữ liệu/kịch bản mẫu |
| `diary-bottom` | [Nhật ký · Modal cuối danh sách dài](../../app/wireframe/smartmeal-update-preview.html?screen=diary-bottom&panel=1) | Dữ liệu/kịch bản mẫu |
| `diary-short` | [Nhật ký · Modal danh sách ngắn](../../app/wireframe/smartmeal-update-preview.html?screen=diary-short&panel=1) | Dữ liệu/kịch bản mẫu |

## Ghi lại

Nguồn: `app/wireframe/record-view.js` · `recordReviewStates`.

| Trạng thái | Mở xem trước | Ghi chú |
| --- | --- | --- |
| `record` | [Ghi lại · Màn bắt đầu](../../app/wireframe/smartmeal-update-preview.html?screen=record&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-empty` | [Biểu mẫu trống](../../app/wireframe/smartmeal-update-preview.html?screen=record-empty&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-partial` | [Biểu mẫu đang nhập](../../app/wireframe/smartmeal-update-preview.html?screen=record-partial&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-error` | [Lỗi thời lượng](../../app/wireframe/smartmeal-update-preview.html?screen=record-error&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-valid` | [Biểu mẫu sẵn sàng lưu](../../app/wireframe/smartmeal-update-preview.html?screen=record-valid&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-saved` | [Phân tích sau lưu](../../app/wireframe/smartmeal-update-preview.html?screen=record-saved&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-missing` | [Phân tích thiếu dữ liệu](../../app/wireframe/smartmeal-update-preview.html?screen=record-missing&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-history` | [Lịch sử](../../app/wireframe/smartmeal-update-preview.html?screen=record-history&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-nohistory` | [Lịch sử trống](../../app/wireframe/smartmeal-update-preview.html?screen=record-nohistory&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-swipe` | [Vuốt để xóa](../../app/wireframe/smartmeal-update-preview.html?screen=record-swipe&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-delete` | [Xác nhận xóa](../../app/wireframe/smartmeal-update-preview.html?screen=record-delete&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-reopened` | [Phân tích từ lịch sử](../../app/wireframe/smartmeal-update-preview.html?screen=record-reopened&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-seven` | [Bảy ngày · Chưa đủ dữ liệu](../../app/wireframe/smartmeal-update-preview.html?screen=record-seven&panel=1) | Dữ liệu/kịch bản mẫu |
| `record-eligible` | [Bảy ngày · Đủ số lượng, chờ bằng chứng](../../app/wireframe/smartmeal-update-preview.html?screen=record-eligible&panel=1) | Dữ liệu/kịch bản mẫu |

## Trạng thái mở qua thao tác

Các luồng Đăng nhập/Đăng ký/khôi phục tài khoản, chọn ngày ăn, xác nhận điều kiện, giọng nói, chi tiết thành phần combo và tháp toàn màn hình mở qua nút trong ứng dụng. Bảng trên là danh mục URL nguồn có sẵn, không phải danh sách đầy đủ mọi biến thể tương tác. Hướng dẫn từng thao tác nằm trong báo cáo chính.
