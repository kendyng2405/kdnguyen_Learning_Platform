# 🎓 LearnFlow — Learning Platform

Nền tảng học tập trực tuyến xây dựng theo mô hình **MVC2**, chạy hoàn toàn trên **GitHub Pages** với Firebase + Gemini AI.

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔐 Auth | Đăng ký / Đăng nhập / Đăng xuất qua Firebase Auth |
| 📚 Courses | Danh sách khóa học, xem chi tiết, đăng ký |
| 🎥 Lesson | Video (YouTube embed), tài liệu, nội dung Markdown |
| 📝 Quiz | Trắc nghiệm, tính điểm, lưu điểm cao nhất |
| 📊 Progress | Theo dõi tiến độ từng khóa học |
| 🛡️ Admin | CRUD Khóa học / Bài học / Quiz (chỉ admin) |
| 🤖 ChatBot | AI chatbot Gemini trả lời thắc mắc |
| 🌙 Theme | Chế độ sáng / tối |
| 🌐 i18n | Song ngữ Tiếng Việt / English |

---

## 🏗️ Kiến trúc MVC2

```
learning-platform/
├── index.html                    # Entry point (View shell)
├── assets/
│   ├── css/
│   │   ├── main.css              # Design system, layout
│   │   ├── animations.css        # Keyframes & transitions
│   │   └── components.css        # Chatbot, Toast, components
│   └── js/
│       ├── config.js             # Firebase + Gemini config
│       ├── app.js                # MVC2 Bootstrap & Router
│       ├── models/               # ── MODEL LAYER ──
│       │   ├── AuthModel.js      # Firebase Auth + User profiles
│       │   ├── CourseModel.js    # Firestore: courses & lessons
│       │   └── QuizModel.js      # Firestore: quizzes & progress
│       ├── views/                # ── VIEW LAYER ──
│       │   ├── AuthView.js       # Login / Register templates
│       │   ├── CourseView.js     # Dashboard, course list, lesson
│       │   ├── QuizView.js       # Quiz & result templates
│       │   ├── ProgressView.js   # Progress tracking template
│       │   └── AdminView.js      # Admin panel templates
│       ├── controllers/          # ── CONTROLLER LAYER ──
│       │   ├── AuthController.js     # Login/register/logout logic
│       │   ├── CourseController.js   # Course/lesson business logic
│       │   ├── QuizController.js     # Quiz taking & scoring
│       │   ├── ProgressController.js # Progress aggregation
│       │   ├── AdminController.js    # Admin CRUD operations
│       │   └── ChatbotController.js  # Gemini AI chatbot
│       └── services/             # ── SERVICE LAYER ──
│           ├── I18nService.js    # Internationalization (Vi/En)
│           ├── ThemeService.js   # Light/Dark theme
│           └── ToastService.js   # Notification toasts
```

---

## 🚀 Deploy lên GitHub Pages

### Bước 1 — Clone & push

```bash
git init
git add .
git commit -m "feat: LearnFlow learning platform"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Bước 2 — Enable GitHub Pages

1. Vào repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → folder: **/ (root)**
4. Click **Save**
5. Sau ~2 phút: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## 🔥 Cấu hình Firebase

### Tạo tài khoản Admin

Sau khi deploy, đăng ký tài khoản xong thì vào **Firestore Console**:

1. Vào `https://console.firebase.google.com` → project của bạn
2. **Firestore Database** → Collection `users` → tìm document của bạn
3. Đổi field `role` từ `"student"` → `"admin"`

Hoặc thêm email vào `adminEmails` trong `config.js` trước khi đăng ký:

```js
export const APP_CONFIG = {
  adminEmails: ["your-email@gmail.com"],
  // ...
};
```

### Firestore Security Rules

Vào Firebase Console → Firestore → **Rules**, paste vào:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() { return request.auth != null; }
    function isAdmin() {
      return isAuth() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{uid} {
      allow read: if isAuth();
      allow create: if isAuth() && request.auth.uid == uid;
      allow update: if isAuth() && (request.auth.uid == uid || isAdmin());
    }

    match /courses/{courseId} {
      allow read: if isAuth();
      allow write: if isAdmin();

      match /lessons/{lessonId} {
        allow read: if isAuth();
        allow write: if isAdmin();
      }

      match /quizzes/{quizId} {
        allow read: if isAuth();
        allow write: if isAdmin();
      }
    }

    match /progress/{progressId} {
      allow read, write: if isAuth();
    }
  }
}
```

---

## 🤖 Gemini API

API key miễn phí tại: https://aistudio.google.com/app/apikey

Model đang dùng: `gemini-2.0-flash` (nhanh, miễn phí tier)

---

## 📦 Công nghệ sử dụng

- **Frontend**: Pure HTML5 / CSS3 / ES6 Modules (no bundler!)
- **Database**: Firebase Firestore v10
- **Auth**: Firebase Authentication v10
- **AI Chatbot**: Google Gemini 2.0 Flash API
- **Fonts**: Syne + DM Sans (Google Fonts)
- **Hosting**: GitHub Pages (static)

---

## 👨‍💻 Phát triển local

Vì dùng ES Modules, cần chạy qua HTTP server (không mở file:// trực tiếp):

```bash
# Python
python -m http.server 3000

# Node.js
npx serve .

# VS Code
# Cài extension "Live Server" → click Go Live
```

Mở: `http://localhost:3000`

---

## 📝 Ghi chú

- File `config.js` chứa API keys — nếu muốn bảo mật hơn khi production, hãy setup Firebase Security Rules chặt chẽ
- Chatbot giữ lịch sử 10 lượt hội thoại gần nhất
- Quiz lưu điểm cao nhất (best score)
- Admin có thể thêm video YouTube bằng cách paste link thông thường

---

*Built with ❤️ by LearnFlow Team*
