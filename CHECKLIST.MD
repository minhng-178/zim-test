
**[VAI TRÒ]**
Bạn là một Technical Interviewer / Senior React Native Expert đang chấm điểm bài test thực hành của tôi. 

**[NHIỆM VỤ]**
Dưới đây là bản mô tả yêu cầu gốc của bài test. Tôi đã chèn thêm các **[QUYẾT ĐỊNH KỸ THUẬT CỦA TÔI]** vào từng mục. Dựa vào code bạn vừa tạo ra (hoặc tôi vừa cung cấp), hãy rà soát lại từng dòng một như một danh sách kiểm tra (checklist) để xác nhận code đã đáp ứng 100% các tiêu chí này chưa. Nếu có bất kỳ điểm nào vi phạm hoặc có nguy cơ gây giảm hiệu năng (jank), hãy báo lỗi và đề xuất code sửa ngay lập tức.

---
### DANH SÁCH KIỂM TRA YÊU CẦU ĐỀ BÀI:

**1. Cải thiện hiệu ứng hover/motion**
* **Bắt buộc:**
    * Thêm hiệu ứng hover “move” (dịch chuyển/di chuyển mượt) cho các item.
    * Giữ frame rate 60fps, tránh jank. **[KIỂM TRA: Code đã thêm `useNativeDriver: true` vào TẤT CẢ các animation chưa?]**
    * Sử dụng `transform` và `opacity` thay vì thuộc tính gây reflow. **[KIỂM TRA CHÍ MẠNG: Tuyệt đối không có animate `width`, `height`, `top`, `left`, `margin`, `padding`.]**
    * Hỗ trợ hover bằng bàn phím (`focus-visible`).
* **Tùy chọn:**
    * **[QUYẾT ĐỊNH KỸ THUẬT CỦA TÔI]:** Đã chọn -> **Reveal overlay (gradient/blur) với text/CTA xuất hiện có delay/easing hợp lý.** *(Chỉ sử dụng `opacity` để fade-in lớp overlay đen mờ và text).*
* **Accessibility:**
    * Tôn trọng `prefers-reduced-motion`. **[KIỂM TRA: Đã import `AccessibilityInfo` và handle thời gian animation = 0 khi user bật chế độ này chưa?]**
    * Contrast văn bản/overlay đạt tối thiểu WCAG AA.
    * Tab order hợp lý.
    * Chạm lần 1 hiển thị trạng thái “hover”, chạm lần 2 điều hướng. **[KIỂM TRA: Element touchable có lưu state số lần chạm (toggled) chưa?]**
    * Vuốt để thay đổi qua lại giữa các story. **[QUYẾT ĐỊNH KỸ THUẬT CỦA TÔI]:** Đã chọn -> **Sử dụng `FlatList` nằm ngang với `snapToInterval`, `decelerationRate="fast"` kết hợp `Animated.event` cho `contentOffset.x` thay vì tự viết `PanResponder` để đảm bảo mượt nhất.**

**2. Chất lượng code**
* **Công nghệ:** * **[QUYẾT ĐỊNH KỸ THUẬT CỦA TÔI]:** Đã chọn -> **A) Sử dụng React Native CLI (Thuần Native, KHÔNG dùng Expo).**
* **StyleSheet:**
    * Sử dụng CSS Stylesheet mặc định, **tuyệt đối không** sử dụng thư viện UI bên ngoài.
* **JavaScript / Logic:**
    * Không chặn main thread.
    * Sử dụng **Native Animated API** (`Animated` từ `react-native`). Không dùng `Reanimated` nếu không thực sự cần thiết, ưu tiên Native Animated thuần.
    * Code sạch, tách hàm, có bình luận giải thích logic tính toán animation.
* **Asset:**
    * Dùng link ảnh trực tuyến (giả lập), tối ưu kích thước. **[KIỂM TRA: Component `Image` có cache hoặc resizeMode hợp lý chưa?]**

**3. Yêu cầu đầu ra & README.md**
* Cung cấp source code chạy bằng Android/iOS Simulator.
* **[QUYẾT ĐỊNH KỸ THUẬT CỦA TÔI]:** Đã chọn Package Manager -> **`npm`**.
* README.md phải có hướng dẫn cài đặt (`npm install`), cách chạy app (`npx react-native run-android` / `run-ios`) và mô tả ngắn gọn lý do chọn giải pháp (FlatList + NativeDriver + Opacity).

---
**[HÀNH ĐỘNG CỦA BẠN]**
Hãy trả lời theo format sau:
1. **Trạng thái:** [ĐẠT / CHƯA ĐẠT]
2. **Các lỗi vi phạm (Nếu có):** Liệt kê các điểm code chưa đúng với [QUYẾT ĐỊNH KỸ THUẬT] hoặc có nguy cơ lag/reflow.
3. **Đề xuất fix code (Nếu có):** Cung cấp lại đoạn code đã được sửa tối ưu. 
4. **Cấu trúc README.md:** Hãy sinh ra file `README.md` hoàn chỉnh theo đúng yêu cầu sử dụng `npm` và `React Native CLI`.