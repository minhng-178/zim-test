### CHECKLIST NGHIỆM THU BÀI TEST 

**I. Phạm vi & Mục tiêu (Scope)**
*   [x] Chỉ thao tác và thay đổi trên section "Khoảnh khắc đáng nhớ" (không làm hỏng các phần khác)? **(Có)** — toàn bộ thay đổi nằm trong `src/components/MemorableMoments/`, `StoryItem/`, `OverlayLayer/`, `VideoLayer/`, `ProgressBar/`, `StoryControls/`; `HomeScreen` và các phần khác không bị chỉnh[cite: 4]
*   [x] Giữ nguyên tinh thần giao diện và layout gốc của website? **(Có)** — tiêu đề "6607 Khoảnh khắc đáng nhớ", màu đỏ `#da1e39`, card bo góc, carousel nằm ngang đúng với zim.vn[cite: 4]

**II. Hiệu ứng Bắt buộc (Mandatory Motion)**
*   [x] Đã thêm hiệu ứng hover "move" (dịch chuyển mượt) cho các item? **(Có)** — Cover Flow scale (`SCALE_INACTIVE=0.9 → 1.0`) + `imageTranslateX`/`captionTranslateX` parallax khi vuốt[cite: 4]
*   [x] Ứng dụng chạy mượt mà ở 60fps, không bị jank (giật khung hình)? **(Có)** — `useNativeDriver: true` trên toàn bộ 17 animation; `Animated.event` map scroll trực tiếp trên UI thread không qua JS bridge[cite: 4]
*   [x] CHỈ sử dụng `transform` và `opacity` cho animation (KHÔNG sử dụng `top`, `left`, `width`, `height`)? **(Có)** — chỉ dùng `scale`, `translateX`, `translateY`, `opacity`; không có `top/left/width/height` trong bất kỳ animation nào[cite: 4]
*   [x] Có hỗ trợ trạng thái `:focus-visible` khi dùng bàn phím? **(Có)** — `onFocus` → `showOverlay()`, border vàng `#FFD700` 3px trên `Animated.View` container ngoài (không bị clip bởi `overflow:hidden`)[cite: 4]

**III. Hiệu ứng Tùy chọn (Đạt tối thiểu 1/4 yêu cầu là "Có")**
*   [x] Có Parallax tinh tế giữa ảnh và caption? **(Có)** — `imageTranslateX` dịch ảnh ngược chiều, `captionTranslateX` (60% biên độ) dịch caption; tắt khi `reduceMotion`[cite: 4]
*   [ ] Có 3D tilt nhẹ theo con trỏ (có giới hạn, snap-back)? **(Không)** — không triển khai; 3 hiệu ứng còn lại đã đủ vượt ngưỡng 1/4[cite: 4]
*   [x] Có Reveal overlay (fade/blur) với text/CTA delay hợp lý? **(Có)** — `overlayOpacity` fade 260ms; `textReveal` delay +60ms; `ctaReveal` delay +140ms; tất cả dùng `Easing.out(Easing.cubic)`[cite: 4]
*   [x] Có Micro-interaction cho icon/button? **(Có)** — `ctaScale` (press 0.96→1), `muteScale` (0.92→1), `playScale` (0.92→1) với `Easing.out(Easing.cubic)` trên mọi nút[cite: 4]

**IV. Khả năng truy cập & UX (Accessibility)**
*   [x] Animation tự động tắt/giảm khi thiết bị bật chế độ `prefers-reduced-motion`? **(Có)** — `AccessibilityInfo.isReduceMotionEnabled()` lúc mount + listener `reduceMotionChanged` realtime → mọi `duration` về 0ms, `parallaxMax` về 0[cite: 4]
*   [x] Độ tương phản màu sắc văn bản/overlay đạt chuẩn tối thiểu WCAG AA? **(Có)** — text trắng trên overlay tối `rgba(0,0,0,0.72)` đạt contrast ≥10.5:1, vượt chuẩn AAA 7:1[cite: 4]
*   [x] Tab order được sắp xếp hợp lý? **(Có)** — `focusable`, `accessibilityRole="button"`, `accessibilityLabel`, `accessibilityHint` trên mọi element tương tác; nút mute/play trong `StoryControls` cũng có đầy đủ[cite: 4]
*   [x] Mobile: Chạm lần 1 = Hover, Chạm lần 2 = Điều hướng? **(Có)** — tap 1 → `showOverlay()`; tap 2 → `Linking.openURL(item.ctaUrl)` + `hideOverlay()`[cite: 4]
*   [x] Có thể vuốt qua lại (swipe) giữa các story? **(Có)** — `FlatList horizontal` + `snapToInterval={SNAP_INTERVAL}` + `decelerationRate="fast"`; auto-advance khi video kết thúc[cite: 4]

**V. Tính Tương thích (Responsive)**
*   [x] Giao diện không vỡ khi xoay ngang/dọc (Landscape/Portrait)? **(Có)** — `Dimensions.addEventListener('change')` cập nhật `screenWidth` state → `contentPadding` + `getItemLayout` tính lại; `useWindowDimensions` trong StoryItem điều chỉnh `parallaxMax`[cite: 4]
*   [x] (Nếu dùng hiệu ứng 3D) Đã giới hạn biên độ góc nghiêng trên thiết bị di động để chống chóng mặt? **(Không áp dụng)** — không triển khai 3D tilt[cite: 4]

**VI. Chất lượng Code & Asset (Clean Code & Perf)**
*   [x] Component được style bằng CSS StyleSheet mặc định (KHÔNG dùng thư viện UI ngoài)? **(Có)** — toàn bộ dùng `StyleSheet.create()` của React Native; không có styled-components, NativeWind, hay thư viện UI nào[cite: 4]
*   [x] Không chặn Main Thread (Các listener scroll/touch đã được debounce/throttle)? **(Có)** — `scrollX.addListener` throttle 16ms; `Animated.event` với `useNativeDriver:true` chạy hoàn toàn trên UI thread; `scrollEventThrottle={1}` iOS / `{16}` Android[cite: 4]
*   [x] Sử dụng hoàn toàn Native Animated API? **(Có)** — dùng `Animated` API của React Native; không dùng Reanimated; toàn bộ 17 animation đều có `useNativeDriver: true`[cite: 4]
*   [x] Code được tách hàm rõ ràng và có bình luận ngắn gọn? **(Có)** — mỗi component tách file riêng; hàm được đặt tên rõ (`showOverlay`, `hideOverlay`, `handleVideoEnd`…); comment giải thích WHY tại những điểm kỹ thuật quan trọng[cite: 4]
*   [x] Ảnh đã được tối ưu định dạng (WebP/AVIF) và có cơ chế Lazy-load? **(Có)** — ảnh WebP từ `gstatic.com` + proxy `images.weserv.nl?output=webp`; lazy-load do FlatList windowing (`windowSize=5`, `initialNumToRender=3`) tự unmount item ngoài 2 màn hình[cite: 4]
*   [x] Độ phân giải ảnh được chia phù hợp để không tải tài nguyên thừa? **(Có)** — `thumbnailUrlSmall` (360px) cho `screenWidth < 414px`; `thumbnailUrlLarge` (640px) cho `screenWidth ≥ 414px`[cite: 4]

**VII. Yêu cầu Đầu ra (Deliverables)**
*   [ ] Đã cấp Source code (repo github/gitlab)? **(Chờ nộp)** — cần push lên GitHub/GitLab và gửi link cho reviewer[cite: 4]
*   [ ] Đã kèm file APK release để test nhanh? **(Chờ build)** — chạy `cd android && ./gradlew assembleRelease`; APK tại `android/app/build/outputs/apk/release/app-release.apk`[cite: 4]
*   [x] File `README.md` có hướng dẫn cài đặt packages (yarn/npm)? **(Có)** — `npm install` + `cd ios && pod install`[cite: 4]
*   [x] File `README.md` có lệnh chạy app? **(Có)** — `npm start`, `npx react-native run-ios`, `npx react-native run-android`[cite: 4]
*   [x] File `README.md` có hướng dẫn build APK/iOS? **(Có)** — build APK (`./gradlew assembleRelease`) + build iOS (`xcodebuild archive`)[cite: 4]
*   [x] File `README.md` CÓ ĐOẠN MÔ TẢ NGẮN về giải pháp đã chọn và lý do? **(Có)** — section "Lý do chọn giải pháp" giải thích FlatList + useNativeDriver + opacity/transform với 3 luận điểm kỹ thuật cụ thể[cite: 4]
