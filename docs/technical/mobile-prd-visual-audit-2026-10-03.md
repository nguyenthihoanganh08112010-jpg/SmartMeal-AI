# Đối chiếu APP – PSD – PRD v1.1

Ngày kiểm tra: 03/10/2026. Đây là báo cáo kiểm tra, không sửa PRD.

## Kết luận tại thời điểm kiểm tra

**Chưa đạt độ trung thực giao diện 100%. APP đang được triển khai.** Không có cơ sở công bố phần trăm khớp khi chưa đo từng màn hình cùng kích thước và chưa hoàn thiện tài sản còn thiếu.

Nguồn: `SmartMeal_AI_PRD_v1.1_OFFICIAL.md` người dùng gửi, mục 33.1 và các mục chức năng; PSD gốc hiện tại 5400 × 22020, SHA256 `8a8aa473fc89fcda98c1fa48cdf67ec6b65dcfe74787d40385fc73711abc464f`. PSD đã thay đổi so với dấu vân tay được đọc đầu tác vụ; lần kiểm tra này đọc lại tệp mới nhất, không ghi vào PSD.

Mã ứng dụng: `app/mobile/`. Không nhầm ứng dụng mới với bản wireframe HTML cũ trong `app/wireframe/`.

## Các cập nhật chính thức riêng của v1.1

| Quy tắc mới | Hiện trạng APP khi kiểm tra |
|---|---|
| Bỏ Bạn Thỏ trên Home | Đã bỏ; không dùng Thỏ trong phần kiến thức. |
| Home chỉ dùng Bạn Dài và Bạn Gạo | Một phần: khung Bạn Dài đã có; chưa tích hợp đủ artwork Home. Hạt Cơm thường đã có trong Hồ sơ AI theo chỉ đạo mới. |
| Bạn Dài kế thừa vị trí và tương tác của Thỏ | Một phần: có chuyển trạng thái/nảy/trở về/hiện nội dung; đang dùng khung chờ, chưa có hai ảnh trạng thái chính thức. |
| Giữ tháp dinh dưỡng, mở toàn màn hình | Có đường đi toàn màn hình và quay lại; nội dung ảnh vẫn là placeholder, chưa phải tác phẩm trong PSD. |
| Cụm chính chỉ BMI, Streak, đi tiêu theo tuần | Đã thực hiện cấu trúc; hình thức chưa sát PSD. Không còn ô lịch sử mục tiêu trong lưới 2×2. |
| Đi tiêu từ ngày sang cửa sổ 7 ngày | Đã tính số bản ghi theo cửa sổ 7 ngày Home; ngày thiếu không tạo bản ghi 0. |
| Lịch sử mục tiêu thành nút thông báo có điều kiện → panel | Một phần: đã bỏ ô thường trực, có nút khi có lịch sử; chưa đủ điều kiện thông báo/đánh dấu đã xem và panel đúng mẫu. |
| Bộ lọc Cá → Hải sản | Đã thực hiện, đã nhìn thấy trên APP chạy. |
| Thiết kế UX/UI bên ngoài PRD là nguồn visual khi handoff | Chưa đạt: nhiều thành phần APP mới vẫn dùng khung chung, chưa tái hiện PSD. |

## Thay đổi khác trong bản PRD hợp nhất và chỉ đạo mới

| Hạng mục | Trạng thái |
|---|---|
| Giờ tạo món theo Asia/Ho_Chi_Minh: sáng 02:30–<10:00, trưa 10:00–<15:30, tối phần còn lại | Đã viết và kiểm thử biên; khác mốc cũ 00:00/15:00. Ăn nhẹ giữ nhóm riêng. |
| Một lần xác nhận cùng nhóm = một đợt, xóa từng món, món cuối mới giảm đợt | Đã viết và kiểm thử đơn vị. Cần kiểm thử đầy đủ qua UI và máy chủ. |
| Thời lượng bắt buộc >0, các lựa chọn khác không tự điền | Có; đã thử nút Lưu khi bỏ trống và thấy lỗi. |
| Bảy màu mới và “Cảm giác chưa hết” | Có trong form; minh họa chưa đầy đủ. |
| A8 so hai cửa sổ độc lập, đủ số bản ghi/ngày/giá trị từng trường | Đã kiểm thử phần tính điều kiện, không dùng Nhật ký bữa ăn. |
| R14/R15 biểu đồ thời gian, hình dạng, thời lượng, màu sắc | Một phần: có dữ liệu/thống kê nhưng chưa đúng dạng biểu đồ và trang trí PSD. |
| G/I/B đồng hạng/xung đột, Dự phòng T+10 | Có kiểm thử logic nhóm; dữ liệu G và ma trận mục tiêu production còn thiếu, không bịa điểm. |
| HIN, LIN, Đi Đi, Anh, Hạt Cơm thường | Đã dùng roster và ảnh cắt từ bảng người dùng gửi; không dùng Hạt Cơm pixel trong roster. Nội dung nhân vật do người dùng cho phép quyết định. |
| Supabase + OpenAI + Expo | Người dùng duyệt trong tác vụ này. Có mã kết nối; chưa tạo dự án, chưa cấp khóa, chưa gọi API thật. |

## Sai khác visual đã xác định

| Khu vực | Sai khác với PSD |
|---|---|
| Home | Nền, đường phân mảng xanh/lime, cấu trúc header, tỷ lệ các thẻ, minh họa và lịch streak chưa giống. |
| Sổ tay | Thứ tự tìm kiếm/chuyển chế độ khác; thiếu chi tiết mảng xanh; thẻ chưa vuông/trắng đúng mẫu; ảnh chưa đặt lệch trên-phải; Combo chưa bố trí chữ trái/ảnh phải đúng tỷ lệ. |
| Chi tiết món/combo | Dùng chung route nhưng poster, màu, thứ bậc và bố cục chưa giống PSD. |
| Nhật ký | Có quy tắc dữ liệu nhưng summary/date selector/danh sách chưa tái hiện đầy đủ mẫu. |
| Ghi lại | Form còn nút chữ thay minh họa; landing/history thiếu artwork chính thức; chưa thể gọi là khớp. |
| Phân tích | Chưa có pie chart hình dạng và màu; biểu đồ thời gian chưa đủ trục/đường nét tham chiếu. |
| AI | Header thiếu avatar/subtitle đúng cấu trúc; chưa có gradient và mascot chồng thẻ; số/thứ tự/màu hàng gợi ý khác; khung nhập chưa đúng. |
| Hồ sơ AI | Roster đúng; portrait/carousel/background còn cần chỉnh đồng bộ vị trí và kích thước, kiểm thử preview vs saved. |
| Tài khoản | Form chức năng mới, chưa bám bố cục xanh của PSD. |

## Điểm không được sao chép mù quáng

- PSD vẫn có chữ mẫu tiếng Trung trong tin nhắn; UI ứng dụng phải là tiếng Việt.
- Hình kiến thức trong PSD có số calo và nội dung sức khỏe; không tự coi đó là nguồn dinh dưỡng production đã kiểm chứng.
- PSD vẽ xác nhận kiểu trượt dưới; PRD 12.2 vẫn ghi “centered”. Cần giải quyết mâu thuẫn nguồn này trước khi gọi là đúng cả hai nguồn.
- Màu streak theo PRD là #39452D và #CFE6AF; một số thẻ PSD dùng treatment khác. Ưu tiên quy tắc màu explicit, không tự tuyên bố khớp hình 100%.

## Bằng chứng và kiểm thử thực tế

- PASS: 32/32 kiểm thử domain qua Node ngày 03/10/2026; gồm phân bữa, idempotency, xóa món, kiểm tra thời lượng, A8, thiếu dữ liệu, streak và G/B.
- PASS: TypeScript ứng dụng (không bao gồm runtime Deno của Supabase) sau tách cấu hình.
- PASS: đóng gói web đã chạy ở bước trước; phải đóng gói lại sau các chỉnh tiếp theo.
- PASS: thao tác UI ô đi tiêu Home → Ghi lại → Bắt đầu → form; Lưu thiếu thời lượng hiện lỗi.
- PASS: UI Sổ tay hiển thị Hải sản; Hồ sơ AI hiển thị đúng năm tên.
- FAIL: visual fidelity 100% với PSD.
- NOT VERIFIED: Android/iOS trên thiết bị; email/tài khoản thực; RLS với Supabase đã triển khai; API AI/ảnh; đồng bộ đa thiết bị; toàn bộ regression UI.

Ảnh đối chiếu nằm trong `evidence/mobile/audit-2026-10-03/`; ảnh APP có nhãn dữ liệu mẫu. Không dùng 32 bài kiểm thử dữ liệu để chứng minh độ khớp visual hoặc toàn bộ ứng dụng đã hoàn tất.

## Cập nhật sau kiểm tra trong cùng tác vụ

- Người dùng xác nhận “PDF” là PSD đã gửi, và **chọn bảng xác nhận trượt từ dưới, cao 2/3**. Mâu thuẫn với chữ “centered” đã được giải quyết bằng chỉ đạo trực tiếp mới, không sửa tệp PRD.
- Đã thay khung Sổ tay ban đầu bằng thẻ vuông trắng, hai cột tính theo chiều rộng thực, gap 18, ảnh trên/phải; Combo chữ trái/ảnh phải. Đã xem thực tế ở 390 px. Đây chưa phải kiểm định pixel toàn bộ Sổ tay.
- Đã thêm gradient AI, avatar/name/subtitle, card trắng, ảnh chồng trên thẻ, ba hàng gợi ý theo thứ tự cam/xanh/lâu nâu và hàng tài khoản riêng. Ảnh còn crop có nền, chưa trùng artwork tách nền trong PSD.
- Đã đặt sheet sát dưới với height 67%, nền xanh, thanh kéo; quyền sử dụng nhật ký bật từ input thể hiện bật trong sheet, đóng bằng × trả về OFF. Gesture kéo xuống chưa xác minh thành công qua công cụ; không ghi PASS.
- Đã thử xem LIN trong Hồ sơ AI: dấu ✓ vẫn ở HIN trước khi Lưu. Bổ sung đồng bộ cuộn khi chọn chỉ báo persona; animation native vẫn cần test trên thiết bị.
- Kiểm thử SQL bổ sung bằng PostgreSQL PGlite cục bộ đã chạy: migration, quyền đọc tách tài khoản, chặn ghi trực tiếp, revision conflict và trường firstUse/streak server-owned. **Không phải kiểm thử Supabase cloud.**
- Bộ kiểm thử tổng hợp có 33 bài (32 domain + 1 database). Kết quả cuối lưu ở evidence, không thay thế kiểm tra visual/thiết bị.

Kết luận vẫn giữ nguyên: **chưa khớp PSD 100%, PRD mới đã áp dụng một phần, chưa được gọi là APP hoàn tất**.
