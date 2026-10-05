# SmartMeal — Fresh Intelligent Wellness

Ứng dụng Expo/React Native dùng chung cho Android, iOS và web. Bản 05/10/2026 triển khai **giao diện mới theo văn bản BUILD SMARTMEAL AI**, không dùng PSD cũ làm mục tiêu thiết kế. Đây **chưa phải bản production hoàn tất**. Xem `docs/technical/fresh-wellness-2026-10-05.md` ở gốc repository.

## Chạy thử

Node 24+, pnpm 11. Từ thư mục này:

```sh
pnpm install --frozen-lockfile
pnpm web
pnpm typecheck
pnpm test
pnpm export
```

Chọn **Trải nghiệm bằng dữ liệu mẫu** nếu chưa có Supabase. Đây là chế độ tách biệt với tài khoản thật; dữ liệu mẫu được lưu cục bộ. Không dùng dữ liệu mẫu làm khuyến nghị dinh dưỡng thực tế. Kết quả bấm Tạo trong chế độ mẫu là fixture tương tác, không phải AI sinh món thật.

## Kết nối dịch vụ đã được người dùng duyệt

1. Người sở hữu tạo Supabase project. Không có project nào được tự tạo hoặc mua trong tác vụ này.
2. Áp dụng ba tệp trong `supabase/migrations/` theo thứ tự tên trên môi trường thử nghiệm trước. Cơ sở dữ liệu sử dụng RLS; API client không được ghi trực tiếp bảng. Hàm lưu kiểm tra phiên bản để tránh ghi đè từ thiết bị khác. Migration mới kiểm tra combo tối đa 6 món và trường số hợp lệ.
3. Bật xác minh email. Cấu hình email xác minh/khôi phục có mã OTP và nhà cung cấp SMTP phù hợp. Không tắt xác minh chỉ để thử nghiệm dễ hơn.
4. Tạo `.env.local` (không commit):

```text
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

5. Triển khai hàm `conversation`, `generate-meal`, `transcribe`. Secrets **chỉ ở máy chủ**: `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`, `OPENAI_TRANSCRIBE_MODEL`, `APP_WEB_ORIGIN`, `DAILY_CONVERSATION_LIMIT`, `DAILY_GENERATION_LIMIT`, `DAILY_TRANSCRIPTION_LIMIT`. Hạn mức mặc định 0: chưa cấu hình sẽ không gọi dịch vụ tốn phí. Chưa chốt model/hạn mức chi tiêu thực tế, không tự mua gói.
6. Kho `meal-images` là private. Ảnh lưu theo user ID/item ID, dùng URL có hạn khi đọc; không sinh lại mỗi lần mở chi tiết. Tải lại account sẽ cấp URL ảnh mới.
7. Nhập **bộ công thức được kiểm chứng và có quyền sử dụng** vào `smartmeal_catalog`. Không có dữ liệu production được bịa hoặc tự nạp. Thiếu catalog, luồng AI báo chưa đủ nguồn thay vì tạo kết quả giả. Không gán G/stars khi thiếu evidence.

Tài liệu: [Supabase Expo](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native), [Storage RLS](https://supabase.com/docs/guides/storage/security/access-control), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [OpenAI image generation](https://developers.openai.com/api/docs/guides/image-generation).

## Tổ chức mã

- `App.tsx`: điều hướng và các flow hiện tại; đang tiếp tục tách màn hình thành module.
- `src/domain.ts`: quy tắc ngày, phân bữa, đợt ăn, tiêu hóa, A8 và nhóm G/B.
- `src/service.ts`: Supabase Auth/RPC/functions; phiên native dùng SecureStore, phiên web giữ trong bộ nhớ.
- `src/Fresh.tsx`, `src/FreshNotebook.tsx`, `src/FreshWelcome.tsx`, `src/ui.tsx`: hệ thống giao diện mới. Các tệp Notebook/Welcome cũ không còn được App import.
- `src/RecipeDetail.tsx`, `src/RecommendationCard.tsx`, `src/DigestiveTrends.tsx`: chi tiết dùng chung, kết quả AI và phân tích dữ liệu.
- `src/content.ts`: adapter nội dung kiểm chứng; không dùng placeholder làm kiến thức dinh dưỡng.
- `src/personas.ts`: HIN, LIN, Đi Đi, Anh Anh, Hạt Cơm **thường**. Chỉ đổi cách trò chuyện; không đổi tiêu chuẩn chọn món.
- `assets/personas/provenance.json`: nguồn và tọa độ cắt hình người dùng cung cấp.
- `tests/`: kiểm thử dữ liệu và SQL/RLS bằng PostgreSQL PGlite cục bộ.

## Giới hạn còn lại

- Chưa triển khai Supabase thật; email, RLS trên cloud, OpenAI, ảnh và phiên âm thật chưa được xác minh.
- Chưa build/cài Android/iOS trên thiết bị; web build không chứng minh native build thành công.
- Kiểm tra giao diện trực tiếp bị chặn bởi quyền trình duyệt đã lưu. Chưa công bố đạt yêu cầu thị giác hoặc thao tác native.
- Minh họa Home và nội dung giáo dục/diễn giải còn placeholder. Không có carousel hướng dẫn cũ. Không coi ảnh mẫu là nguồn dinh dưỡng.
- Goal matrix, recipe licensing, trường hợp hai combo trùng nhau, chính sách trẻ vị thành niên và thời hạn xóa dữ liệu vẫn OPEN. Không phát hành production trước khi xử lý các mục này.
- Có cache đọc tách theo tài khoản, không có hàng đợi ghi offline. Mất mạng khi lưu giữ bản nhập; URL ảnh hết hạn cần làm mới trực tuyến. Cache native nằm trong storage riêng của ứng dụng; chưa có lớp mã hóa dữ liệu cache riêng ngoài bảo vệ của hệ điều hành. Phiên xác thực native dùng SecureStore.
- Hình ảnh minh họa cần quy trình kiểm tra hình đúng món; phiên bản hiện tại chưa có quy trình duyệt/khôi phục lỗi ảnh hoàn chỉnh.
- TTS có mã tạm dừng/tiếp tục theo từ và chọn giọng thiết bị, nhưng chưa thử trên điện thoại. Home có nhắc xem lại mục tiêu sau 7 ngày; chưa có push notification từ xa.
- Yêu cầu xóa tài khoản có UI và hàm gửi yêu cầu; chưa có worker xác nhận đã xóa/pháp lý/SLA. Không thông báo “đã xóa” khi mới gửi yêu cầu.

Không chứa API secret trong bundle hoặc repo. Không thay đổi PSD gốc hay PRD chính thức.
