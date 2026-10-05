# SmartMeal — bản ứng dụng Fresh Intelligent Wellness

Ngày: 05/10/2026. Nhánh: `feat/fresh-wellness-app`.

Đây là bản triển khai phát triển theo văn bản BUILD SMARTMEAL AI mới. Không phải tuyên bố ứng dụng production đã hoàn tất. Không dùng PSD làm mục tiêu khớp hình; không sửa PSD hoặc PRD.

## Nguồn và các quyết định thay thế

- Văn bản người dùng yêu cầu triển khai: SHA-256 `512de16c56a330f57206c31c19e37877c0e0b8321d29afff5f965a7013bf7ca0`.
- PRD v1.2 đính kèm: SHA-256 `fa9b438ac75f1f0b6a6ac41ac86c89240b1b74a2828e33f2608efb58cf2e41a6`.
- Văn bản mới thay yêu cầu bắt chước PSD bằng giao diện mới, thay các màu/cấu trúc cũ, bỏ carousel hướng dẫn trên Home, dùng Bạn Dài/Bạn Gạo thay Bạn Thỏ trên Home. Nhân vật là HIN, LIN, Đi Đi, Anh Anh, Hạt Cơm thường.
- Giới hạn combo 6 món và ưu tiên combo khi chọn trùng món thành phần nay đã rõ. Không áp dụng lại quyết định OPEN cũ cho hai mục này.
- Phân bữa theo văn bản mới/PRD 1.2: HCM 02:30–09:59 sáng; 10:00–15:29 trưa; còn lại tối. Ăn nhẹ độc lập. Không dùng mốc cũ 00:00/10:00/15:00 của wireframe.
- Bảng xác nhận là thiết kế mới; không bị ràng buộc chiều cao 2/3 của PSD cũ.

## Thiết kế và thành phần

Giao diện chữ đậm, nền trung tính, xanh lá chính `#386B53`, chữ `#233C35`; tông đào/vàng ở Nhật ký, lime/kem ở Sổ tay, xanh/lavender ở Ghi lại. Bề mặt bán trong suốt chỉ dùng ở vùng nổi và hội thoại; nội dung dài và form dùng bề mặt gần như đặc.

| Thành phần | Nguồn mã | Vai trò |
|---|---|---|
| Home, tháp, icon hình học | `app/mobile/src/Fresh.tsx` | Home mới; tháp toàn màn hình và chọn tầng; insight có tương tác, hỗ trợ giảm chuyển động |
| Nội dung có nguồn | `src/content.ts` | Adapter tháp, insight, mục tiêu, diễn giải; chưa có dữ liệu kiểm chứng thì để trống/placeholder |
| Sổ tay | `src/FreshNotebook.tsx` | Tìm kiếm + lọc kết hợp, hai chế độ; giữ tìm kiếm/lọc khi quay từ chi tiết; cập nhật phiên bản có xác nhận |
| Lời chào AI | `src/FreshWelcome.tsx` | Thiết kế mới, hành động tài khoản tách câu hỏi chat |
| Thẻ kết quả | `src/RecommendationCard.tsx` | Chọn đã ăn tách lưu Sổ tay; mở rộng; dữ liệu có nguồn; chi tiết dùng chung |
| Chi tiết món/combo | `src/RecipeDetail.tsx` | Một thành phần cho AI, Sổ tay và Nhật ký; component→combo→nguồn qua route stack |
| Phân tích | `src/DigestiveTrends.tsx` | Bốn khối dữ liệu; thời gian không nối ngày thiếu; phân bố theo mẫu số hợp lệ |
| Đọc câu trả lời | `src/useReader.ts` | Một tin nhắn mỗi lần, tạm dừng/tiếp tục theo vị trí từ, giọng Việt trên thiết bị và tốc độ tùy chỉnh |
| Ảnh | `src/FoodImage.tsx` | Dùng chung nguồn ảnh, trạng thái tải lỗi; không thay bằng ảnh món giả |
| Quy tắc | `src/domain.ts` | Phân bữa, đợt ăn, xóa, combo, mục tiêu 7 ngày, evidence và A8 |
| Máy chủ | `supabase/functions`, `supabase/migrations` | Auth/RLS, private storage, giới hạn combo, kiểm tra ứng viên, API AI phía máy chủ |

Các hình chân dung là bản cắt từ tài sản đã có, có thể thay thế độc lập. Không tạo hay tuyên bố hình mới là tài sản chính thức. Hình món trong chế độ trải nghiệm chỉ là fixture.

## Luồng và dữ liệu triển khai

- Năm tab đúng thứ tự; AI không có bottom navigation. Back từ AI giữ tab nguồn. Profile thiếu mục tiêu/khẩu vị vẫn truy cập các tab; tạo món chuyển đến hoàn thiện hồ sơ rồi trở lại xác nhận điều kiện.
- Home có trạng thái chưa đăng nhập, tháp lớn, mục tiêu, BMI, streak, số bản ghi 7 ngày → Ghi lại, insight. Thiếu dữ liệu không chuyển thành số 0 hoặc đánh giá sức khỏe.
- Giữ/Bỏ qua mục tiêu lưu ngày xem lại, hẹn chu kỳ 7 ngày; chỉ đổi mục tiêu mới tạo lịch sử. Không tự triển khai push notification từ xa.
- AI: mic giữ→thả→phiên âm→xem/sửa→gửi; TTS một tin; permission chỉ cho lần tạo hiện tại và reset sau khi sử dụng/hủy. Context tạm không ghi đè Profile.
- Sửa rõ một điều kiện chỉ thay trường đó, không lấy câu “giảm thời gian…” làm nguyên liệu. Mỗi đợt kết quả giữ danh sách ID và hạn thời gian riêng trong lịch sử hội thoại; không đánh giá lại kết quả cũ theo điều kiện mới.
- Catalog server là nguồn được duyệt. Gate nguyên liệu, khẩu vị, loại bữa, T+10, thành phần và giới hạn 6 chạy trước gọi AI. Thời gian combo phải đủ tổng tuần tự trừ khi có kế hoạch song song đã xác minh trong nguồn.
- Recipe + ảnh đều hoàn tất mới trả kết quả. `imageId` giữ định danh kho; URL hiển thị được cấp riêng. Cùng phiên bản nguồn dùng lại ảnh; nguồn phiên bản mới tạo entity mới, có `supersedesId`; cập nhật Sổ tay không viết lại Nhật ký.
- Combo + món trong combo: bỏ chọn món trùng trong chính thao tác lưu, ưu tiên combo. Vẫn từ chối gộp ăn nhẹ/bữa chính. Hai combo trùng nhau vẫn cần quyết định thêm, hiện từ chối rõ ràng.
- “Đã ăn” lưu một đợt cho các món tương thích. Ngày ăn độc lập thời điểm tạo. Xóa từng món không ảnh hưởng anh em; món cuối xóa đợt. Không có sửa món trong Nhật ký.
- Ghi lại: thời lượng số dương; các trường quan sát còn lại bỏ trống được. Sửa giữ ID, đổi ngày cập nhật đếm hai ngày; lưu mở phân tích cá nhân. Lịch sử vẫn có sửa và xác nhận xóa.
- A8 chỉ dùng Digestive Records. Tỷ lệ và trung bình loại trường thiếu. Nội dung diễn giải kiểm chứng chưa có được đánh dấu rõ, không sinh kết luận y khoa.
- Evidence cần cấu trúc `source`, `sourceId`, trạng thái `verified`, `supports`; có thể kèm URL/version/checkedAt/foodForm/unitBasis. Một chuỗi nguồn cũ không đủ để hiển thị khẳng định đã xác minh.
- Cache tài khoản chỉ để đọc, tách theo ID của phiên đã xác thực; fallback chỉ cho lỗi kết nối. Không có hàng đợi ghi. Đăng xuất xóa cache của tài khoản đó. URL ảnh hết hạn có thể cần mạng để làm mới. Cache lỗi không biến thao tác máy chủ đã thành công thành lưu thất bại.

## Đối chiếu phạm vi văn bản mới

“Đã có mã” không đồng nghĩa đã kiểm chứng bằng thao tác trên thiết bị.

| Mục | Trạng thái triển khai |
|---|---|
| 0–6: mục tiêu, nền tảng, điều hướng, thiết kế | Đã có mã mới; kiểm tra hình ảnh trực tiếp NOT VERIFIED |
| 7–13: Home, tài khoản, profile, mục tiêu, tháp, insight, mascot | Đã có cấu trúc và hành vi; nội dung tháp/insight và hình Bạn Dài DEPENDENCY |
| 14: persona | Năm persona, preview/saved, lưu và dirty exit có mã; artwork giữ dạng thay thế được |
| 15–21: chat, voice, TTS, context và xác nhận | Đã có mã; voice/TTS thiết bị và dịch vụ thật NOT VERIFIED |
| 22–25: ứng viên, G/I/B, thời gian, evidence | Gate/nhóm Pareto có kiểm thử; production goal matrix và catalog DEPENDENCY |
| 26: sao món đơn | Không hiển thị khi chưa có nguồn/mapping đủ chứng cứ; mapping production OPEN, không tạo sao combo |
| 27–36: gia vị, recipe/ảnh, card, chi tiết, lưu/đã ăn, trùng combo, regen/no result | Đã có mã và kiểm thử quy tắc; sinh ảnh/món thật DEPENDENCY |
| 37–45: Sổ tay, tìm/lọc/xóa/cập nhật, Nhật ký/phân bữa/đợt ăn | Đã có mã; quy tắc có kiểm thử, thao tác trực quan NOT VERIFIED |
| 46–54: Ghi lại/form/phân tích cá nhân/lịch sử | Đã có mã; dữ liệu/validation có kiểm thử; hình minh họa cuối và diễn giải DEPENDENCY |
| 55–64: phân tích 7 ngày, A8, kết luận/gợi ý | Cấu trúc và phép tính có mã/kiểm thử; câu diễn giải đã kiểm chứng DEPENDENCY |
| 65–67: entity, context và lưu dữ liệu | SQL/RLS, revision guard, cache đọc có mã; nhiều thiết bị trên Supabase thật NOT VERIFIED |
| 68–78: tương tác, context, swipe, chuyển động, feedback, keyboard, loading/error | Đã có mã; kiểm thử tương tác native/visual NOT VERIFIED |
| 79–82: xóa tài khoản, privacy, an toàn, non-goals | Có gửi yêu cầu xóa, auth/RLS và server-only secrets; quy trình xóa hoàn tất/SLA/pháp lý DEPENDENCY |
| 83: OPEN/config | Không tự khóa các quyết định chưa có nguồn; xem phần dưới |
| 84–88: responsive, disclosure, chất lượng, kiểm thử | Source/TypeScript/build/test được kiểm tra; phát hành thật và visual QA chưa đủ để công bố hoàn tất |

## Các phần chưa thể xác nhận production

1. Chưa có Supabase/SMTP/OpenAI credentials hoặc triển khai cloud. Adapter và migration có sẵn; không đăng ký dịch vụ, mua gói hoặc gọi AI tốn phí trong tác vụ.
2. Dataset công thức có giấy phép, goal→nutrient matrix, nguồn tháp/insight/diễn giải và nội dung cảnh báo chưa cung cấp. Không thay bằng sự thật do AI bịa.
3. Hai combo trùng thành phần chưa có chính sách dedup cuối. Đang báo cần xác nhận riêng, không âm thầm đếm trùng.
4. Voice/speed chuẩn phát hành, retry/timeout ảnh, xử lý xung đột nhiều thiết bị ngoài revision guard, thời hạn draft, xóa tài khoản/backup và yêu cầu trẻ vị thành niên vẫn OPEN theo văn bản.
5. Native Android/iOS installation, mic/audio, keyboard/safe area, swipe/tap và accessibility thực tế phải kiểm tra trên thiết bị. Export JavaScript không phải APK/IPA.
6. Trình duyệt công cụ đã từ chối `localhost:8772` vì quyền đã lưu, kể cả sau khi người dùng đồng ý trong chat. Không tìm cách vượt chặn; không tạo ảnh “bằng chứng” giả. Visual QA là NOT VERIFIED.

## Cách kiểm tra và tiếp quản

Chạy `pnpm typecheck`, `pnpm test`, `pnpm export` trong `app/mobile`. Chạy `pnpm web --port 8772` để mở bản xem trước; chọn Trải nghiệm bằng dữ liệu mẫu để kiểm tra khi chưa cấu hình máy chủ. `eas.json` cung cấp cấu hình preview APK, iOS simulator và production; chưa chạy EAS, chưa ký hoặc phát hành.

Kết quả thực thi cuối được lưu tại `evidence/mobile/fresh-2026-10-05/`. Không tái dùng kết quả kiểm thử ngày 03/10 để khẳng định bản này đã qua.
