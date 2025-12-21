## 1. Core Purpose & Mission

* **Purpose:** Giải phóng nội dung video khỏi sự rào cản của độ trễ (latency) và sự phức tạp của giao diện.
* **Mission:** Tạo ra một "dòng chảy" nội dung vô tận (The Infinite Flow) giúp người dùng kết nối với tri thức và giải trí một cách tự nhiên nhất, trên mọi thiết bị, ngay cả trong điều kiện mạng yếu nhất.

## 2. Product & Design Philosophy

* **Product Philosophy (The "Invisible" App):** Ứng dụng là một bóng ma. Nó chỉ hiện diện khi người dùng cần tương tác, còn lại phải lùi về sau để tôn vinh nội dung (Video-centric).
* **Design Philosophy (Physics-First):** Giao diện phải tuân theo quy luật vật lý. Mọi chuyển động phải có quán tính, trọng lực và độ đàn hồi (Spring physics), không sử dụng các animation tuyến tính khô khan.

## 3. UX Patterns & Navigation Model

* **Navigation Model:** * **Z-Axis (Primary):** Vuốt dọc để chuyển nội dung.
* **X-Axis (Contextual):** Vuốt ngang để vào Profile tác giả hoặc chuyển Tab (Following/For You).
* **Modal Layers:** Comment và Share không chuyển trang mà là các lớp (Overlay) trượt lên từ đáy (Bottom sheets) để giữ ngữ cảnh video đang phát.


* **UX Pattern:** "Reachability First" – Mọi nút bấm tương tác quan trọng phải nằm trong vùng quét của ngón tay cái (Bottom 1/3 of the screen).

## 4. UI Visual System (The "Vortex" Design System)

| Yếu tố | Quy định |
| --- | --- |
| **Colors** | **Pitch Black (#000000)** là nền chủ đạo (tối ưu pin OLED). **Electric Violet (#8B5CF6)** làm màu nhấn (Action). |
| **Typography** | Font San-serif (Inter/Geist). Header: Bold, 20px+. Body: Medium, 14-16px. Shadow 2px cho text đè lên video. |
| **Spacing** | Hệ thống 8pt (8, 16, 24, 32...). |
| **Shapes** | Bo góc lớn (16px - 24px) tạo cảm giác thân thiện, hiện đại. |
| **Elevation** | Sử dụng Glassmorphism (blur) cho các lớp Overlay để duy trì sự kết nối với video phía dưới. |
| **Motion** | Thời gian transition mặc định: 300ms. Easing: `cubic-bezier(0.32, 0.72, 0, 1)`. |

## 5. Interaction Principles

1. **Instant Gratification:** Video phải phát ngay khi 30% diện tích xuất hiện trong viewport.
2. **Haptic Feedback:** Rung nhẹ khi Like, khi kéo kịch trần danh sách, hoặc khi chuyển đổi tốc độ phát.
3. **Graceful Degradation:** Nếu mạng yếu, ưu tiên âm thanh phát trước, hình ảnh hiển thị dạng placeholder (Blurry image) trước khi HLS segment kịp load.

## 6. Tone & Rules for Microcopy

* **Tone:** Trực diện, năng động, tối giản.
* **Rules:** * Không dùng câu bị động.
* Dưới 3 từ cho các nút bấm (e.g., "Theo dõi" thay vì "Nhấn để theo dõi").
* Lỗi hệ thống phải được báo cáo bằng ngôn ngữ con người (e.g., "Mạng đang hụt hơi, chờ chút nhé!" thay vì "Error 500").



## 7. Modules & Feature Groups

* **Core Engine:** HLS Player, Adaptive Bitrate Manager, Pre-fetcher Service.
* **Interaction Suite:** Like, Comment (threaded), Share (Deeplink), Save.
* **Creator Studio:** HLS Transcoding (FE-side preview), Filter engine (WebGPU).
* **Social Graph:** User Profile, Follow System, Activity Feed.
* **Discovery:** Search Engine, Hashtag System, Trending Algorithm.

## 8. Scope, Boundaries & Non-negotiables

* **In-scope:** Web App (Next.js), PWA, Mobile Web.
* **Out-of-scope:** Livestream 360 độ (giai đoạn 1), VR/AR.
* **Non-negotiables (Bất di bất dịch):**
* **Lighthouse Performance Score > 90.**
* **Time to Interactive (TTI) < 2s.**
* **Zero Layout Shift** khi load video mới.



## 9. User Roles & Flow Principles

* **Roles:** Viewer (Consumer), Creator, Moderator, Admin.
* **Flow Principles:** * "Zero-click to watch": Mở app là video phát ngay.
* "Minimum Friction": Đăng ký/Đăng nhập chỉ xuất hiện khi người dùng muốn tương tác sâu (Like/Comment).



## 10. Quality Bar & Constraints

* **Quality Bar:** Video phải chạy mượt ở 60fps trên thiết bị có cấu hình trung bình (e.g., iPhone X hoặc Samsung A series).
* **Constraints:** * Tổng dung lượng JS bundle lần đầu < 200KB (Gzip).
* Mức tiêu thụ CPU không quá 15% khi phát video 1080p trên trình duyệt.



## 11. AI Guidelines (Instruction for Screen Generation)

> "Khi tạo bất kỳ màn hình nào cho VortexStream, AI phải tuân thủ:
> 1. Luôn ưu tiên hiển thị nội dung video chiếm 100% diện tích.
> 2. Các nút tương tác nằm bên phải màn hình, xếp dọc.
> 3. Thanh tiến trình (Seek bar) phải cực mảnh (2px) và chỉ đậm lên khi chạm.
> 4. Không sử dụng nền trắng cho các trang chứa video.
> 5. Tất cả icon phải là dạng Outline, chuyển sang Solid khi được active."
> 
> 

## 12. Output Format cho mọi Screen

Mọi thiết kế/mô tả màn hình sau này phải xuất ra theo cấu trúc:

1. **Screen ID & Title.**
2. **Visual Stack:** (Mô tả các layer từ dưới lên trên).
3. **Logic Logic:** (Hành vi của HLS, Virtualization tại màn hình này).
4. **State Transitions:** (Trạng thái trước và sau khi tương tác).
5. **Edge Cases:** (Xử lý khi mất mạng, video lỗi, hoặc nội dung bị chặn).

---

## 13. Video Player Controls Specification

### 13.1 Core Controls

| Control | UI Element | Behavior |
|---------|------------|----------|
| **Play/Pause** | Icon ở giữa màn hình (fade out sau 1s) | Toggle trạng thái phát. Icon: ▶️ / ⏸️ |
| **Mute/Unmute** | Icon volume góc phải dưới | Toggle âm thanh. Persist across videos. |
| **Seek Bar** | Thanh ngang 2px ở đáy | Mở rộng 4px khi hover/touch. Hiển thị preview thumbnail khi kéo. |
| **Playback Speed** | Menu popup | Tốc độ: 0.5x, 0.75x, 1x (default), 1.25x, 1.5x, 2x |
| **Quality Selector** | Menu trong settings | Auto (default), 1080p, 720p, 480p, 360p |
| **Fullscreen** | Icon góc phải | Xoay landscape cho video 16:9. Escape để thoát. |

### 13.2 Seek Bar Behavior

| State | Visual |
|-------|--------|
| **Default** | 2px height, 30% opacity white |
| **Hover/Touch** | 4px height, 100% opacity, hiện buffer progress |
| **Dragging** | Hiện preview thumbnail, time indicator |
| **Buffering** | Animated gradient trên phần chưa buffer |

### 13.3 Video Info Overlay

| Element | Position | Behavior |
|---------|----------|----------|
| **Author Avatar** | Góc trái dưới | Tap → Profile. Border ring khi đang follow. |
| **Author Name** | Dưới avatar | `@username` format |
| **Caption** | Dưới author name | Truncate 2 dòng, tap để expand |
| **Hashtags** | Trong caption | Màu Electric Violet, tap để search |
| **Sound/Music** | Dưới caption | Marquee animation nếu text dài |

---

## 14. Gesture System

### 14.1 Tap Gestures

| Gesture | Zone | Action | Feedback |
|---------|------|--------|----------|
| **Single Tap** | Giữa màn hình | Play/Pause toggle | Icon fade in/out |
| **Double Tap** | Nửa trái | Tua lùi 10s | "-10s" animation + seek |
| **Double Tap** | Nửa phải | Tua tiến 10s | "+10s" animation + seek |
| **Double Tap** | Giữa | Like video | Heart explosion animation |
| **Long Press** | Bất kỳ | Hiện context menu | Haptic + blur background |
| **Hold** | Bất kỳ | Pause tạm thời | Video freeze, thả ra tiếp tục |

### 14.2 Swipe Gestures

| Gesture | Direction | Action | Threshold |
|---------|-----------|--------|-----------|
| **Swipe Up** | Vertical | Video tiếp theo | > 30% viewport height |
| **Swipe Down** | Vertical | Video trước đó | > 30% viewport height |
| **Swipe Left** | Horizontal | Vào profile tác giả | > 40% viewport width |
| **Swipe Right** | Horizontal | Quay lại từ profile | > 40% viewport width |
| **Horizontal Drag** | Trên seek bar | Seek trong video | 1px = 0.5s |

### 14.3 Context Menu (Long Press)

| Option | Icon | Action |
|--------|------|--------|
| **Lưu video** | Bookmark | Thêm vào danh sách đã lưu |
| **Không quan tâm** | X Circle | Ẩn video, feedback algorithm |
| **Ẩn tác giả này** | User X | Không hiện video từ author |
| **Báo cáo** | Flag | Mở report flow |
| **Sao chép link** | Link | Copy deeplink to clipboard |

---

## 15. Video Loading States

### 15.1 State Machine

```
[IDLE] → [LOADING] → [READY] → [PLAYING] ↔ [PAUSED]
                ↓           ↓
           [ERROR]    [BUFFERING]
                ↓           ↓
           [RETRY]    [STALLED]
```

### 15.2 State Definitions

| State | Duration | Visual | Audio |
|-------|----------|--------|-------|
| **IDLE** | - | Blank hoặc poster frame | Silent |
| **LOADING** | 0-500ms | Blur placeholder (từ thumbnail) | Silent |
| **LOADING** | 500ms-2s | Skeleton shimmer animation | Silent |
| **LOADING** | > 2s | Spinner subtle + "Đang tải..." | Silent |
| **READY** | Instant | First frame hiển thị | Ready to play |
| **PLAYING** | - | Video playing | Audio playing |
| **PAUSED** | - | Frozen frame + pause icon | Silent |
| **BUFFERING** | 0-1s | Video freeze, no indicator | Audio continue nếu có buffer |
| **BUFFERING** | > 1s | Spinner nhỏ góc | Audio continue nếu có buffer |
| **STALLED** | > 5s | "Mạng yếu, đang thử lại..." | Silent |
| **ERROR** | - | Error message + Retry button | Silent |

### 15.3 Error Messages (Human-friendly)

| Error Type | Message | Action |
|------------|---------|--------|
| **Network** | "Mạng đang nghỉ ngơi, thử lại nhé!" | [Thử lại] |
| **Not Found** | "Video này đã bay màu rồi" | Auto skip |
| **Restricted** | "Video không khả dụng ở khu vực bạn" | Auto skip |
| **Server** | "Có lỗi từ phía chúng tôi, xin lỗi!" | [Thử lại] |

---

## 16. Scroll & Virtualization Behavior

### 16.1 Scroll Mechanics

| Property | Value | Mô tả |
|----------|-------|-------|
| **Snap Type** | `mandatory` | Video luôn snap vào center |
| **Snap Align** | `center` | Điểm snap ở giữa viewport |
| **Scroll Behavior** | `smooth` | Smooth scroll với spring physics |
| **Deceleration Rate** | `0.998` | Tốc độ giảm dần tự nhiên |
| **Overscroll Behavior** | `contain` | Không scroll parent |

### 16.2 Video Activation Rules

| Condition | Action |
|-----------|--------|
| Video chiếm > 50% viewport | Activate (play) |
| Video chiếm < 30% viewport | Deactivate (pause + reset) |
| Scroll velocity > 2000px/s | Không activate video đang lướt qua |
| Scroll dừng > 300ms | Activate video gần nhất |

### 16.3 Pre-loading Strategy

| Position | Action | Priority |
|----------|--------|----------|
| **Current - 1** | Giữ trong memory, pause | High |
| **Current** | Playing | Highest |
| **Current + 1** | Pre-load first 3 segments | High |
| **Current + 2** | Pre-load first segment | Medium |
| **Current + 3** | Fetch metadata only | Low |
| **Current ± 4+** | Dispose, chỉ giữ metadata | - |

### 16.4 Memory Management

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Videos in DOM** | Max 5 | Remove furthest videos |
| **Decoded frames** | Max 3 videos | Dispose oldest decoded |
| **Total memory** | > 150MB | Aggressive cleanup |
| **Low memory warning** | System event | Keep only current + 1 |

### 16.5 Pull-to-Refresh

| State | Visual | Threshold |
|-------|--------|-----------|
| **Pulling** | Icon kéo xuống + progress | 0-80px |
| **Triggered** | Spinner + "Đang làm mới..." | > 80px |
| **Refreshing** | Fetch new content | - |
| **Complete** | Snap back, new video on top | - |

---

## 17. Watch Progress & History

### 17.1 Progress Tracking

| Event | Data Saved | Storage |
|-------|------------|---------|
| **Video Start** | `video_id`, `timestamp` | Local + Server |
| **Every 5s** | `current_time`, `duration` | Local only |
| **Video End** | `completed: true` | Local + Server |
| **Video Skip** | `watch_duration`, `skip_point` | Server (analytics) |

### 17.2 Resume Playback

| Scenario | Behavior |
|----------|----------|
| Quay lại video chưa xem hết | Resume từ vị trí cuối |
| Video đã xem > 90% | Phát từ đầu |
| Video < 10s | Luôn phát từ đầu |
| Progress > 7 ngày | Xóa, phát từ đầu |

### 17.3 Watch History

| Feature | Mô tả |
|---------|-------|
| **History List** | Danh sách video đã xem, mới nhất trước |
| **Watched Badge** | Checkmark nhỏ trên thumbnail đã xem hết |
| **Continue Watching** | Section riêng cho video chưa xem hết |
| **Clear History** | Option xóa toàn bộ lịch sử |
| **Retention** | 90 ngày, max 1000 videos |

---

## 18. Audio Management

### 18.1 Volume States

| State | Icon | Behavior |
|-------|------|----------|
| **Muted** | 🔇 | Không phát âm thanh |
| **Low** (0-33%) | 🔈 | Volume thấp |
| **Medium** (34-66%) | 🔉 | Volume trung bình |
| **High** (67-100%) | 🔊 | Volume cao |

### 18.2 Audio Persistence

| Setting | Scope | Default |
|---------|-------|---------|
| **Mute state** | Persist across videos | Unmuted |
| **Volume level** | Persist across sessions | 100% |
| **First visit** | Auto-muted (browser policy) | Muted |

### 18.3 Audio Focus Handling

| Event | Action |
|-------|--------|
| **Incoming call** | Pause video, duck audio |
| **Notification sound** | Continue playing |
| **Another app plays audio** | Pause our video |
| **Headphones disconnected** | Pause video |
| **Headphones connected** | Resume if was playing |

### 18.4 Background Audio (Optional)

| Mode | Behavior |
|------|----------|
| **Screen off** | Continue audio (nếu user opt-in) |
| **App in background** | Picture-in-Picture hoặc pause |
| **PiP Mode** | Mini player góc màn hình |

---

## 19. Captions & Accessibility

### 19.1 Caption System

| Feature | Mô tả |
|---------|-------|
| **Auto Captions** | AI-generated captions (nếu có) |
| **Creator Captions** | Phụ đề do creator upload |
| **Caption Toggle** | Bật/tắt trong settings hoặc CC button |
| **Default State** | Theo system preference |

### 19.2 Caption Styling

| Property | Options | Default |
|----------|---------|---------|
| **Font Size** | Small, Medium, Large | Medium |
| **Background** | None, Semi, Solid | Semi (50% black) |
| **Position** | Top, Bottom | Bottom |
| **Color** | White, Yellow | White |

### 19.3 Accessibility Features

| Feature | Implementation |
|---------|----------------|
| **Screen Reader** | ARIA labels cho tất cả controls |
| **Keyboard Navigation** | Space (play/pause), Arrow keys (seek), M (mute) |
| **Reduced Motion** | Tắt animations nếu `prefers-reduced-motion` |
| **High Contrast** | Tăng contrast cho text overlay |
| **Focus Indicators** | Visible focus ring cho keyboard users |

### 19.4 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `K` | Play/Pause |
| `M` | Mute/Unmute |
| `F` | Fullscreen |
| `←` | Tua lùi 5s |
| `→` | Tua tiến 5s |
| `J` | Tua lùi 10s |
| `L` | Tua tiến 10s |
| `↑` / `↓` | Video trước/sau |
| `0-9` | Seek to 0%-90% |
| `>` / `<` | Tăng/giảm tốc độ |

---

## 20. Content Control & Feedback

### 20.1 "Không quan tâm" Flow

| Step | Action | Result |
|------|--------|--------|
| 1 | Long press → "Không quan tâm" | Video bị ẩn ngay |
| 2 | Hiện toast "Đã ẩn video" | Có nút [Hoàn tác] |
| 3 | Algorithm nhận signal | Giảm content tương tự |

### 20.2 "Ẩn tác giả" Flow

| Step | Action | Result |
|------|--------|--------|
| 1 | Long press → "Ẩn tác giả này" | Confirm dialog |
| 2 | Confirm | Tất cả video từ author bị ẩn |
| 3 | Có thể bỏ ẩn trong Settings | Danh sách blocked authors |

### 20.3 Report Flow

| Step | UI |
|------|-----|
| 1 | Chọn "Báo cáo" từ context menu |
| 2 | Chọn lý do: Vi phạm / Spam / Bạo lực / Khác |
| 3 | (Optional) Thêm mô tả |
| 4 | Submit → Toast "Cảm ơn phản hồi" |

### 20.4 Algorithm Signals (từ hành vi xem)

| Signal | Weight | Mô tả |
|--------|--------|-------|
| **Watch Time** | High | Xem càng lâu = càng thích |
| **Completion Rate** | High | Xem hết = rất thích |
| **Re-watch** | Medium | Xem lại = content tốt |
| **Skip Early** | Negative | Skip < 3s = không phù hợp |
| **Like** | High | Explicit positive signal |
| **Share** | Highest | Muốn người khác xem |
| **Not Interested** | Negative | Explicit negative signal |

---

## 21. Offline & Caching Strategy

### 21.1 Smart Cache Layers

| Layer | Content | Max Size | TTL |
|-------|---------|----------|-----|
| **L1 - Memory** | Decoded video frames | 3 videos | Session |
| **L2 - IndexedDB** | HLS segments đã tải | 200MB | 7 days |
| **L3 - Service Worker** | Static assets, thumbnails | 50MB | 30 days |

### 21.2 Pre-cache Strategy

| Trigger | Action |
|---------|--------|
| **App idle** | Pre-cache next 5 video thumbnails |
| **WiFi connected** | Pre-cache next 3 videos (first 30s) |
| **Low battery** | Disable pre-caching |
| **Storage low** | Clear L2, keep L1 |

### 21.3 Offline Mode

| Scenario | Behavior |
|----------|----------|
| **Mất mạng đột ngột** | Tiếp tục phát video đang xem (nếu đã buffer) |
| **Mở app khi offline** | Hiện cached videos với badge "Đã lưu" |
| **Không có cache** | "Không có mạng. Kết nối để xem video mới!" |
| **Có mạng trở lại** | Auto-sync, refresh feed |

### 21.4 Cache Management UI

| Feature | Location |
|---------|----------|
| **Cache size indicator** | Settings > Storage |
| **Clear cache** | Settings > Storage > Xóa cache |
| **Download for offline** | (Future) Save video để xem offline |

---

## 22. Performance Metrics & Monitoring

### 22.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 1.5s | Largest Contentful Paint (first video frame) |
| **FID** | < 50ms | First Input Delay |
| **CLS** | < 0.05 | Cumulative Layout Shift |
| **INP** | < 150ms | Interaction to Next Paint |

### 22.2 Video-specific Metrics

| Metric | Target | Mô tả |
|--------|--------|-------|
| **Time to First Frame** | < 500ms | Từ lúc video visible đến frame đầu |
| **Buffering Ratio** | < 1% | % thời gian buffering/tổng watch time |
| **Startup Failures** | < 0.5% | % video không load được |
| **Seek Latency** | < 200ms | Thời gian từ seek đến playback |

### 22.3 Monitoring Dashboard

| Event | Data Collected |
|-------|----------------|
| **Video Start** | Load time, quality selected, network type |
| **Buffering** | Duration, position, network conditions |
| **Error** | Error type, video ID, retry count |
| **Quality Switch** | From/to quality, trigger reason |
| **User Interaction** | Like, comment, share, watch duration |

---

## 23. Like System

### 23.1 Like Button UI

| Property | Value |
|----------|-------|
| **Position** | Cạnh phải màn hình, trong action bar dọc |
| **Icon (Unliked)** | Heart Outline, màu trắng, 32px |
| **Icon (Liked)** | Heart Solid, màu đỏ (#FF2D55), 32px |
| **Counter** | Dưới icon, font 12px, format rút gọn (1.2K, 3.5M) |
| **Tap Area** | 48x48px (accessibility) |

### 23.2 Like Animation

| Trigger | Animation |
|---------|-----------|
| **Tap nút Like** | Icon scale 1 → 1.3 → 1 (spring), đổi màu |
| **Double Tap video** | Heart lớn (120px) xuất hiện giữa màn hình, scale up + fade out |
| **Haptic** | Light impact feedback |
| **Particles** | 5-8 mini hearts bay ra từ icon (optional) |

**Timeline Double Tap Animation:**
```
0ms     - Heart xuất hiện, scale 0
50ms    - Scale 1.2 (overshoot)
150ms   - Scale 1.0 (settle)
300ms   - Bắt đầu fade out
500ms   - Heart biến mất
```

### 23.3 Like States & Logic

| State | UI | Action khi tap |
|-------|-----|----------------|
| **Unliked** | Heart Outline trắng | Like → Liked |
| **Liked** | Heart Solid đỏ | Unlike → Unliked |
| **Loading** | Heart + spinner nhỏ | Disabled |
| **Error** | Shake animation | Retry toast |

### 23.4 Optimistic Update

| Step | Client | Server |
|------|--------|--------|
| 1 | Tap Like | - |
| 2 | UI cập nhật ngay (Liked, count +1) | - |
| 3 | - | POST /api/like |
| 4a | Giữ nguyên | Success (200) |
| 4b | Rollback UI | Error (4xx/5xx) |

### 23.5 Like Counter Format

| Range | Display |
|-------|---------|
| 0-999 | Số nguyên (523) |
| 1,000-9,999 | 1.2K |
| 10,000-999,999 | 52.3K |
| 1,000,000+ | 1.2M |

### 23.6 Double-Like Prevention

| Mechanism | Implementation |
|-----------|----------------|
| **Debounce** | 300ms giữa các tap |
| **Request dedup** | Cancel pending request nếu tap lại |
| **Visual feedback** | Icon disabled trong lúc loading |

---

## 24. Comment System

### 24.1 Comment Bottom Sheet

| Property | Value |
|----------|-------|
| **Trigger** | Tap nút Comment hoặc swipe up từ caption |
| **Height** | 60% viewport (có thể kéo lên 90%) |
| **Background** | Glassmorphism (blur 20px, rgba(0,0,0,0.8)) |
| **Animation** | Slide up từ đáy, spring physics |
| **Dismiss** | Swipe down hoặc tap outside |

### 24.2 Comment Sheet Layout

```
┌─────────────────────────────────────┐
│  ─────  (Drag handle)               │
│  💬 1.2K bình luận          [X]     │  ← Header
├─────────────────────────────────────┤
│                                     │
│  [Avatar] @user1 · 2h               │
│  Comment text here...               │
│  ❤️ 234   💬 Trả lời                │
│     └─ Xem 12 phản hồi ▼            │  ← Collapsed replies
│                                     │
│  [Avatar] @user2 · 5h               │
│  Another comment...                 │
│  ❤️ 89    💬 Trả lời                │
│                                     │
│  ... (Virtualized list)             │
│                                     │
├─────────────────────────────────────┤
│  [Avatar] [    Thêm bình luận...  ] │  ← Input (sticky bottom)
│           [@mention] [😊] [Send]    │
└─────────────────────────────────────┘
```

### 24.3 Comment Item UI

| Element | Style |
|---------|-------|
| **Avatar** | 32px, circle, tap → profile |
| **Username** | Bold, 14px, màu trắng |
| **Timestamp** | Regular, 12px, màu gray (#8E8E93) |
| **Content** | Regular, 14px, màu trắng, max 3 dòng (tap để expand) |
| **Like count** | 12px, bên trái |
| **Reply button** | 12px, text "Trả lời" |

### 24.4 Comment Input

| Property | Value |
|----------|-------|
| **Position** | Sticky bottom, trên safe area |
| **Avatar** | User avatar 28px bên trái |
| **Input** | Transparent background, placeholder "Thêm bình luận..." |
| **Mention** | Tap @ để mention, autocomplete dropdown |
| **Emoji** | Tap 😊 để mở emoji picker |
| **Send** | Icon send, disabled khi empty, Electric Violet khi có text |
| **Max length** | 500 ký tự |

### 24.5 Comment Actions

| Action | Trigger | Result |
|--------|---------|--------|
| **Like comment** | Tap ❤️ | Toggle like, update count |
| **Reply** | Tap "Trả lời" | Focus input, thêm @username |
| **View replies** | Tap "Xem X phản hồi" | Expand nested replies |
| **Copy** | Long press | Copy comment text |
| **Report** | Long press → Report | Report flow |
| **Delete** | Long press (own comment) | Confirm → Delete |

### 24.6 Comment States

| State | UI |
|-------|-----|
| **Loading** | Skeleton shimmer (3 items) |
| **Empty** | "Chưa có bình luận. Hãy là người đầu tiên!" |
| **Error** | "Không tải được bình luận" + Retry |
| **Posting** | Comment hiện với opacity 0.5, spinner |
| **Posted** | Scroll to new comment, highlight 2s |
| **Deleted** | Fade out animation |

### 24.7 Comment Pagination

| Trigger | Action |
|---------|--------|
| **Initial load** | 20 comments đầu |
| **Scroll near bottom** | Load thêm 20 |
| **Pull down** | Refresh, load newest |
| **Max display** | 200 comments (virtualized) |

### 24.8 Comment Virtualization

| Property | Value |
|----------|-------|
| **Visible items** | ~8-10 (tùy viewport) |
| **Overscan** | 3 items trên/dưới |
| **Item height** | Dynamic (estimated 80px, đo lại sau render) |
| **Recycle** | Reuse DOM nodes khi scroll |

---

## 25. Reply (Threaded Comments)

### 25.1 Reply UI Structure

```
[Parent Comment]
  └─ "Xem 5 phản hồi" (collapsed)
  
[Parent Comment]
  ├─ [Reply 1]
  ├─ [Reply 2]  
  ├─ [Reply 3]
  └─ "Xem thêm 2 phản hồi" (nếu > 3)
```

### 25.2 Reply Display Rules

| Condition | Display |
|-----------|---------|
| 0 replies | Không hiện gì |
| 1-3 replies | Mặc định collapsed, tap để expand |
| > 3 replies | Hiện 3 đầu, "Xem thêm X phản hồi" |
| Nested > 1 level | Flat display (không nest quá 1 level) |

### 25.3 Reply Item UI

| Property | Value |
|----------|-------|
| **Indent** | 40px từ parent |
| **Avatar size** | 24px (nhỏ hơn parent) |
| **Connecting line** | 1px gray từ parent avatar xuống replies |
| **Reply-to indicator** | "@username" ở đầu nếu reply reply |

### 25.4 Reply Input Flow

| Step | Action |
|------|--------|
| 1 | Tap "Trả lời" trên comment |
| 2 | Input focus, hiện "@username " prefix |
| 3 | Keyboard mở, sheet scroll để input visible |
| 4 | Gõ reply content |
| 5 | Tap Send |
| 6 | Reply xuất hiện dưới parent, highlight |

### 25.5 Reply States

| State | UI |
|-------|-----|
| **Collapsed** | "Xem X phản hồi ▼" |
| **Expanding** | Spinner, fetch replies |
| **Expanded** | Danh sách replies, "Ẩn phản hồi ▲" |
| **Loading more** | Spinner ở cuối list |

### 25.6 Reply Notifications

| Event | Notification |
|-------|--------------|
| **Someone replies to your comment** | "@user đã trả lời: [preview]" |
| **Someone mentions you** | "@user đã nhắc đến bạn: [preview]" |
| **Tap notification** | Mở video → Comment sheet → Scroll to reply |

---

## 26. Share System

### 26.1 Share Button UI

| Property | Value |
|----------|-------|
| **Position** | Trong action bar dọc, dưới Comment |
| **Icon** | Share/Arrow Outline, 32px, trắng |
| **Counter** | Share count dưới icon |
| **Tap Area** | 48x48px |

### 26.2 Share Bottom Sheet

```
┌─────────────────────────────────────┐
│  ─────  (Drag handle)               │
│  Chia sẻ                      [X]   │
├─────────────────────────────────────┤
│                                     │
│  [Messenger] [Zalo] [WhatsApp] [...] │  ← Social apps row
│                                     │
│  [Copy link] [SMS] [Email] [More]   │  ← Actions row
│                                     │
├─────────────────────────────────────┤
│  Link preview:                      │
│  ┌─────────────────────────────┐   │
│  │ [Thumb] Title của video...  │   │
│  │         vortex.app/v/abc123 │   │
│  └─────────────────────────────┘   │
│                               [Copy]│
└─────────────────────────────────────┘
```

### 26.3 Share Options

| Option | Icon | Action |
|--------|------|--------|
| **Messenger** | Messenger icon | Open Messenger với deeplink |
| **Zalo** | Zalo icon | Open Zalo share |
| **WhatsApp** | WhatsApp icon | Open WhatsApp với link |
| **Telegram** | Telegram icon | Open Telegram share |
| **Facebook** | Facebook icon | Open FB share dialog |
| **Twitter/X** | X icon | Open tweet composer |
| **Copy link** | Link icon | Copy to clipboard, toast "Đã sao chép" |
| **SMS** | Message icon | Open SMS với link |
| **Email** | Mail icon | Open email composer |
| **More** | More icon | Native share sheet |

### 26.4 Share Link Format

| Type | Format |
|------|--------|
| **Web link** | `https://vortex.app/v/{video_id}` |
| **Deep link** | `vortex://video/{video_id}` |
| **Short link** | `https://vtx.to/{short_code}` |

### 26.5 Share Metadata (OG Tags)

| Tag | Value |
|-----|-------|
| **og:title** | Video caption (truncate 60 chars) |
| **og:description** | @author · X likes · X comments |
| **og:image** | Video thumbnail |
| **og:video** | Video URL (cho platforms hỗ trợ) |
| **og:type** | video.other |

### 26.6 Share Analytics

| Event | Data |
|-------|------|
| **share_initiated** | video_id, share_method |
| **share_completed** | video_id, platform, success |
| **link_copied** | video_id |

---

## 27. Action Bar (Video Interactions)

### 27.1 Action Bar Layout

```
Vị trí: Cạnh phải màn hình, bottom 1/3

┌─────────────────────────────────┐
│                          [👤+]  │  ← Follow (nếu chưa follow)
│                          [❤️]   │  ← Like
│                          1.2K   │
│                          [💬]   │  ← Comment  
│                          234    │
│                          [🔗]   │  ← Share
│                          56     │
│                          [🔖]   │  ← Save/Bookmark
└─────────────────────────────────┘
```

### 27.2 Action Bar Specs

| Property | Value |
|----------|-------|
| **Position** | `right: 12px`, `bottom: 20%` |
| **Spacing** | 20px giữa các buttons |
| **Icon size** | 32px |
| **Counter font** | 12px, white, text-shadow |
| **Background** | Transparent (rely on video contrast) |
| **Animation** | Stagger appear khi video loads (50ms delay each) |

### 27.3 Follow Button (trong Action Bar)

| State | UI |
|-------|-----|
| **Not following** | Avatar với badge "+" màu đỏ |
| **Following** | Avatar không badge |
| **Loading** | Avatar với spinner badge |

### 27.4 Save/Bookmark Button

| State | Icon | Action |
|-------|------|--------|
| **Not saved** | Bookmark Outline | Save to collection |
| **Saved** | Bookmark Solid (Electric Violet) | Unsave |
| **Tap** | Haptic + icon fill animation | Toggle |

### 27.5 Interaction Counters Update

| Event | Behavior |
|-------|----------|
| **Like/Unlike** | Counter +1/-1 ngay (optimistic) |
| **New comment** | Counter +1 ngay |
| **Share** | Counter +1 sau khi share thành công |
| **Polling** | Refresh counts mỗi 30s khi video active |

---
