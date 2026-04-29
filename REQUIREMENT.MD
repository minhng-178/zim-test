Dưới đây là bản mô tả đề bài đã được định dạng lại theo cấu trúc chuẩn, làm nổi bật các từ khóa kỹ thuật để bạn dễ dàng theo dõi và đối chiếu trong quá trình làm bài:

# Comprehensive Skills Test for Software Development

## Mục tiêu
* Cải thiện trải nghiệm người dùng trên section **“Khoảnh khắc đáng nhớ”**.
* Ứng viên tự đề xuất và triển khai hiệu ứng tương tác (hover/motion) hiện đại, mượt, có khả năng truy cập (accessibility) tốt, không ảnh hưởng hiệu năng tổng thể.
* Dựng sản phẩm hoàn chỉnh, đóng gói và nộp bài theo hướng dẫn.

## Phạm vi đề bài
* **Trang:** Trang chủ zim.vn (chỉ thao tác trên section “Khoảnh khắc đáng nhớ”).
* Không chỉnh sửa nội dung/section khác ngoài phạm vi nếu không cần thiết.
* Có thể tái tạo section mục tiêu trong môi trường riêng (mock) nếu không lấy được code gốc, nhưng phải giữ nguyên tinh thần giao diện và layout.

---

## Yêu cầu chức năng và kỹ thuật

### 1. Cải thiện hiệu ứng hover/motion
* **Bắt buộc:**
    * Thêm hiệu ứng hover “move” (dịch chuyển/di chuyển mượt) cho các item trong section.
    * Giữ frame rate ổn định (60fps trên máy phổ thông), tránh jank.
    * Sử dụng `transform` và `opacity` thay vì thuộc tính gây reflow (`top`, `left`, `width`, `height`) trong animation.
    * Hỗ trợ hover bằng bàn phím (`focus-visible`) với hiệu ứng tương đương hoặc phù hợp.
* **Tùy chọn (chọn ít nhất 1 trong các nhóm sau):**
    * Parallax tinh tế giữa lớp ảnh và caption.
    * 3D tilt nhẹ theo hướng con trỏ, có giới hạn và snap-back mượt.
    * Reveal overlay (gradient/blur) với text/CTA xuất hiện có delay/easing hợp lý.
    * Micro-interaction cho icon/button liên quan (ví dụ: nút xem thêm).
* **Accessibility:**
    * Tôn trọng `prefers-reduced-motion`: giảm hoặc tắt animation khi người dùng bật chế độ giảm chuyển động.
    * Contrast văn bản/overlay đạt tối thiểu WCAG AA.
    * Tab order hợp lý; trạng thái `:focus-visible` rõ ràng.
    * Chạm lần 1 hiển thị trạng thái “hover”, chạm lần 2 điều hướng (nếu có).
    * Vuốt để thay đổi qua lại giữa các story.
* **Responsive:**
    * Hoạt động tốt khi chuyển đổi giữa Landscape và Portrait mode trên thiết bị.
    * Giới hạn hiệu ứng 3D/tilt quá mạnh trên mobile để tránh chóng mặt.

### 2. Chất lượng code
* **Công nghệ:** Bạn có thể chọn 1 trong 2 hướng:
    * **A)** Sử dụng React Native (CLI).
    * **B)** Sử dụng React Native Expo.
* **StyleSheet:**
    * Sử dụng CSS Stylesheet mặc định để custom component, tuyệt đối không sử dụng thư viện UI bên ngoài.
* **JavaScript / Logic:**
    * Không chặn main thread; tránh listener tần suất cao không tối ưu (nên sử dụng `debounce`/`throttle`).
    * Sử dụng **Native Animated API** cho animation trên app.
    * Code sạch, có tách hàm, bình luận ngắn gọn nơi cần thiết.
* **Asset (Tài nguyên):**
    * Tối ưu kích thước ảnh (ưu tiên dùng định dạng WebP/AVIF nếu có, tích hợp lazy-load hợp lý).
    * Tối ưu độ phân giải ảnh, lựa chọn độ phân giải phù hợp với từng mục đích hiển thị để tối ưu tài nguyên tải.

---

## Yêu cầu đầu ra

* **Một bản demo chạy được:**
    * Cung cấp source code trong repository.
    * Ứng dụng có thể chạy bằng:
        * Expo Go (khuyến khích) hoặc
        * Android / iOS Simulator.
    * Vui lòng đính kèm APK build hoặc link Expo Snack / Expo project để demo nhanh.
* **README.md bao gồm:**
    * Hướng dẫn cài đặt và chạy dự án:
        * Lệnh cài dependencies (`yarn` / `npm` / `pnpm`).
        * Lệnh khởi chạy app (`expo start` hoặc `npx react-native run-android` / `run-ios`).
    * Hướng dẫn build ứng dụng (APK / iOS build nếu có).
    * Mô tả ngắn về giải pháp kỹ thuật đã chọn và lý do lựa chọn.

> **Thời lượng:** Tối đa 24h kể từ khi nhận đề.