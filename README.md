# ZIM - Khoảnh Khắc Đáng Nhớ (Memorable Moments)

Component **React Native CLI** tái hiện section **"Khoảnh khắc đáng nhớ"** của [zim.vn](https://zim.vn) dưới dạng Carousel Cover Flow tương tác trên Mobile.

---

## 📋 Yêu cầu hệ thống

| Công cụ          | Phiên bản tối thiểu |
|------------------|---------------------|
| Node.js          | >= 22.11.0          |
| React Native     | 0.85.x              |
| Xcode (iOS)      | >= 15.0             |
| Android Studio   | >= Hedgehog         |
| JDK              | 17+                 |

---

## 🚀 Cài đặt

```bash
# 1. Cài dependencies (Package Manager: npm)
npm install

# 2. iOS — cài CocoaPods pods
cd ios && pod install && cd ..
```

---

## ▶️ Chạy ứng dụng

### Khởi động Metro Bundler

```bash
npm start
```

> Nếu muốn xoá cache Metro (khuyến nghị lần đầu sau khi pull code):
> ```bash
> npm start -- --reset-cache
> ```

### Chạy trên iOS Simulator

```bash
npx react-native run-ios
```

> Chỉ định device cụ thể:
> ```bash
> npx react-native run-ios --simulator="iPhone 15 Pro"
> ```

### Chạy trên Android Emulator / Device

```bash
npx react-native run-android
```

> Chỉ định device ID (lấy từ `adb devices`):
> ```bash
> npx react-native run-android --deviceId="emulator-5554"
> ```

> **Lưu ý:** Đảm bảo Android Emulator đang chạy hoặc thiết bị thật đã bật USB Debugging trước khi chạy lệnh.

---

## 📦 Build APK (Android Release)

> **Lưu ý:** Project dùng React Native CLI thuần — không dùng Expo.

### 1. Tạo keystore (chỉ làm 1 lần)

```bash
keytool -genkey -v -keystore android/app/zim-release.keystore \
  -alias zim-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Cấu hình signing trong `android/gradle.properties`

```properties
MYAPP_RELEASE_STORE_FILE=zim-release.keystore
MYAPP_RELEASE_KEY_ALIAS=zim-key-alias
MYAPP_RELEASE_STORE_PASSWORD=<mật_khẩu_keystore>
MYAPP_RELEASE_KEY_PASSWORD=<mật_khẩu_key>
```

### 3. Build APK

```bash
cd android
./gradlew assembleRelease
```

APK đầu ra: `android/app/build/outputs/apk/release/app-release.apk`

### 4. Cài trực tiếp lên thiết bị (tuỳ chọn)

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 🍎 Build iOS (Archive & Export)

> **Lưu ý:** Cần Mac + Xcode >= 15.0 + Apple Developer account.

### 1. Cài pods

```bash
cd ios && pod install && cd ..
```

### 2. Mở Xcode và archive

```bash
xed ios
```

Trong Xcode: **Product → Archive → Distribute App → Ad Hoc / App Store**

### Hoặc dùng lệnh (headless)

```bash
xcodebuild -workspace ios/zim.xcworkspace \
  -scheme zim \
  -configuration Release \
  -archivePath build/zim.xcarchive \
  archive
```

IPA đầu ra nằm trong thư mục `build/` sau bước export.

---

## 🗂️ Cấu trúc dự án

```
zim/
├── App.tsx                                   # Entry point — setup SafeAreaProvider + StatusBar
├── index.js                                  # React Native entry registration
├── src/
│   ├── data/
│   │   └── mockData.ts                       # Dữ liệu giả lập (StoryData[])
│   ├── lib/
│   │   └── constant.ts                       # Hằng số dùng chung (ITEM_WIDTH, SNAP_INTERVAL…)
│   ├── screens/
│   │   └── Home/
│   │       ├── HomeScreen.tsx                # Màn hình chính — layout Header + Carousel + Footer
│   │       └── styles.ts                     # Styles của HomeScreen
│   └── components/
│       ├── MemorableMoments/
│       │   ├── index.tsx                     # Component cha — FlatList Carousel + Pagination Dots
│       │   └── styles.ts                     # Styles của MemorableMoments
│       └── StoryItem/
│           ├── index.tsx                     # Component con — Scale Cover Flow + Reveal Overlay
│           └── styles.ts                     # Styles của StoryItem
└── README.md
```

---

## 🎨 Tính năng

### Carousel Cover Flow
- Item ở giữa **to** (scale = 1.0), item hai bên **nhỏ hơn** (scale ≈ 0.82).
- Vuốt ngang để chuyển story, snap từng item mượt mà.
- Pagination dots ở dưới — dot active kéo rộng bằng `scaleX` (không dùng `width` để tránh reflow).

### Reveal Overlay (Tương tác 2 bước)

| Trạng thái   | Hành động                                                         |
|--------------|-------------------------------------------------------------------|
| Chưa chạm    | Overlay ẩn (`opacity: 0`)                                         |
| Lần chạm 1   | Overlay hiện ra: tiêu đề + mô tả + nút CTA (`opacity: 0 → 1`)    |
| Lần chạm 2   | Log console điều hướng + reset overlay về `opacity: 0`           |

### Accessibility
- Lắng nghe `AccessibilityInfo.isReduceMotionEnabled()` realtime.
- Khi bật **Reduce Motion** trong Settings → mọi animation `duration` tự động về **0ms**.
- `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` đầy đủ trên mọi element tương tác.
- Contrast ratio text/background ≥ **10.5:1** (vượt chuẩn WCAG AAA 7:1).

---

## ⚡ Lý do chọn giải pháp: FlatList + useNativeDriver + opacity/transform

> **Giải thích kỹ thuật (dành cho reviewer):**
>
> React Native hoạt động trên hai thread song song: **JavaScript thread** xử lý logic ứng dụng và **UI thread (Native)** chịu trách nhiệm render và vẽ frame.
>
> ### 1. Tại sao dùng `useNativeDriver: true` cho TẤT CẢ animation?
> Khi bật `useNativeDriver: true`, các giá trị animation như `opacity` và `transform` được serialized và giao toàn quyền điều khiển cho UI thread — **bỏ qua hoàn toàn JS bridge**. Dù JS thread đang bận xử lý logic khác (fetch API, state update), animation vẫn chạy mượt **60fps** vì không cần chờ JS frame.
>
> Ngược lại, animate `width`, `height`, `left`, `right` — thuộc tính ảnh hưởng layout — sẽ trigger layout engine (reflow) trên mỗi frame, **không tương thích** với `useNativeDriver` và gây jank.
>
> ### 2. Tại sao dùng `FlatList` + `Animated.event` thay vì `PanResponder`?
> `Animated.event` với `useNativeDriver: true` cho phép map trực tiếp `nativeEvent.contentOffset.x` vào `scrollX` (Animated.Value) **hoàn toàn trên UI thread**, không routing qua JS bridge. Toàn bộ hiệu ứng scale Cover Flow được tính toán và áp dụng ở tầng Native — đây là kiến trúc **zero-JS-bridge** cho animation scroll.
>
> Dùng `FlatList` thay vì tự viết `PanResponder` giúp tận dụng Native scroll physics (momentum, snap) tối ưu trên từng platform mà không cần tái triển khai.
>
> ### 3. Tại sao chỉ dùng `opacity` cho overlay reveal?
> `opacity` là một trong số ít thuộc tính được Native Animated hỗ trợ hoàn toàn. Dùng `opacity` để fade-in overlay thay vì `height` hay `top` đảm bảo animation không trigger reflow, chạy 60fps trên cả iOS và Android.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ                          | Lý do chọn                                                    |
|------------------------------------|---------------------------------------------------------------|
| **React Native CLI** (không Expo)  | Kiểm soát hoàn toàn native layer, không overhead từ Expo SDK  |
| **TypeScript** strict mode         | Type safety, phát hiện lỗi sớm ở compile time                 |
| **Animated API** (RN native)       | Không cần Reanimated, đủ mạnh cho yêu cầu 60fps              |
| `useNativeDriver: true`            | Bỏ qua JS bridge, animation chạy trực tiếp trên UI thread    |
| **FlatList** + `snapToInterval`    | Native scroll physics, snap mượt, tối ưu memory với windowing |
| `decelerationRate="fast"`          | Snap chắc chắn, responsive                                    |
| **AccessibilityInfo**              | Tôn trọng `prefers-reduced-motion` của người dùng             |
| **StyleSheet** thuần               | Không phụ thuộc thư viện UI bên ngoài                        |

---

## 📄 License

MIT © ZIM Academy
