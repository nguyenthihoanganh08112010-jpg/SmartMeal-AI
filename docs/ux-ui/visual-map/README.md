# Bản đồ giao diện SmartMeal AI — Photoshop

File chính: **SmartMeal-UX-UI-Flow-Map.psd**. Một canvas 4200 × 15820 px, 10 dải luồng, 52 vị trí ảnh giao diện. Đây là tài liệu trực quan từ wireframe đã chốt, không sửa giao diện ứng dụng hay PRD.

## Mở và chỉnh

1. Trong Photoshop dùng **File → Open**, chọn file PSD để mở như một tài liệu có lớp. Kéo file vào vùng trống Photoshop cũng có thể mở tài liệu; kéo vào một tài liệu đang mở có thể đặt cả bản đồ thành Smart Object, không hiện ngay các nhóm lớp bên trong.
2. Mở bảng Layers. Các nhóm 01–10 tương ứng từng dải luồng; mỗi màn hình có nhóm mang mã A/H/S/C/D/R/I/P.
3. Dùng Move để di chuyển nhóm màn hình hoặc lớp mũi tên. Chọn lớp chữ chú thích và Type để sửa nội dung. Giữ Arial để hiển thị tiếng Việt nhất quán.
4. Ảnh UI là ảnh chụp bitmap tách riêng, không phải từng nút/chữ có lớp. Muốn đổi nội dung UI, sửa wireframe gốc rồi thay lớp ảnh tương ứng; không phóng bitmap quá lớn nếu cần giữ độ nét.
5. Đường nối là lớp ảnh trong suốt riêng, có thể di chuyển/biến đổi, không phải đường vector có điểm neo. Nhãn hành động là chữ riêng.
6. Lưu một bản sao PSD trước khi chỉnh. Không Flatten nếu muốn giữ khả năng chỉnh lớp.

## Cách đọc

- Dải 01: tài khoản và các trạng thái Home.
- Dải 02: Home, tháp, streak, mục tiêu và điểm vào Ghi lại.
- Dải 03–04: Sổ tay, chi tiết dùng chung, tìm/lọc/xóa/rỗng.
- Dải 05: Nhật ký, xác nhận trên cùng, kết quả xóa giữa/cuối.
- Dải 06–08: biểu mẫu Ghi lại, phân tích bản ghi, lịch sử, sửa/xóa và phân tích nhật ký.
- Dải 09–10: AI, xác nhận tạo bữa, kết quả, mở lại và Hồ sơ AI.
- Nét liền: chuyển theo thao tác ghi tên. Nét đứt: nhánh, quay lại hoặc biến thể có ghi rõ. Các ảnh đặt cạnh nhau không tự hàm ý một chuyển màn.
- Ảnh là các trạng thái mẫu độc lập, ngày giờ/nội dung mẫu có thể khác nhau giữa ảnh. Không coi là một phiên dữ liệu thật.
- Các mã màn hình trong bản đồ là mã cục bộ của tài liệu này. Báo cáo UX/UI chi tiết ở thư mục cha là nguồn diễn giải kỹ thuật bổ sung.

## Kiểm chứng và giới hạn

- PSD đã được ghi và đọc lại bằng ag-psd; số lớp, lớp chữ và nhóm nằm trong verification.json.
- Đã kiểm tra trực quan các bản xem trước; ảnh sau xóa món giữa/cuối được chụp sau thao tác xác nhận thật trên prototype cục bộ.
- **NOT VERIFIED:** mở/sửa/lưu trực tiếp trong Adobe Photoshop, vì chưa thực hiện bằng Photoshop. Một số phiên bản có thể yêu cầu cập nhật lớp chữ; bản bitmap xem trước của chữ được lưu cùng metadata chữ.
- PSD là bản đồ tĩnh, không chạy nút/hiệu ứng. Prototype HTML gốc mới là bản tương tác.
- Không tuyên bố tất cả trạng thái sâu/cuộn của từng màn hình đã có ảnh riêng: mỗi ảnh là một viewport. Các quy tắc giọng nói, quyền nhật ký, ghi nhận đã ăn và dữ liệu có mô tả đầy đủ hơn trong báo cáo bàn giao.
- Nhãn nháp/chưa duyệt vốn có trong ảnh được giữ nguyên để không giả sửa ảnh nguồn. Việc chốt wireframe không đồng nghĩa duyệt các nhân vật/tài sản vẫn đang chờ.

## Tái xuất

Chạy build-psd.cjs bằng Node; biến SM_PSD_DEPS trỏ tới thư mục node_modules có ag-psd 31.0.2 và @napi-rs/canvas 1.0.9. Nguồn ảnh nằm trong screens/. manifest.json ghi mã, vị trí và SHA-256 từng ảnh dùng. Không cần sửa app để tái xuất.
