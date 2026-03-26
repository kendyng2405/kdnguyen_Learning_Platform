// ============================================================
//  seed-data.js — Sample Data Seeder
//  Chạy script này từ browser console (khi đã login với admin)
//  để tạo dữ liệu mẫu cho demo
// ============================================================
//
//  CÁCH SỬ DỤNG:
//  1. Mở trang web, đăng nhập với tài khoản admin
//  2. Mở DevTools (F12) → Console
//  3. Copy toàn bộ nội dung file này và paste vào console
//  4. Nhấn Enter
// ============================================================

(async () => {
  const { addDoc, collection, serverTimestamp } = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
  );
  const db = window.__firebaseDB;

  console.log("🌱 Seeding sample data...");

  // Sample courses
  const courses = [
    {
      title: "JavaScript Cơ bản đến Nâng cao",
      description: "Học JavaScript từ zero đến hero. Bao gồm ES6+, async/await, DOM manipulation và nhiều hơn nữa.",
      category: "Lập trình",
      level: "beginner",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&q=80",
      lessonCount: 0,
      enrolledCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "React.js Modern Development",
      description: "Xây dựng ứng dụng web hiện đại với React 18, Hooks, Context API và React Router.",
      category: "Frontend",
      level: "intermediate",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
      lessonCount: 0,
      enrolledCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      title: "Python cho Data Science",
      description: "Phân tích dữ liệu với Python, Pandas, NumPy và Matplotlib. Bắt đầu hành trình Data Science của bạn.",
      category: "Data Science",
      level: "beginner",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80",
      lessonCount: 0,
      enrolledCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  ];

  for (const courseData of courses) {
    const courseRef = await addDoc(collection(db, "courses"), courseData);
    console.log(`✅ Course created: ${courseData.title} (${courseRef.id})`);

    // Add sample lessons to first course only
    if (courseData.title.includes("JavaScript")) {
      const lessons = [
        { title: "Giới thiệu JavaScript", type: "video", order: 1, duration: "12 phút", videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk", content: "## Chào mừng đến với JavaScript!\n\nJavaScript là ngôn ngữ lập trình phổ biến nhất thế giới, được dùng để tạo ra các trang web tương tác.\n\n### Bạn sẽ học gì?\n- Cú pháp cơ bản\n- Biến và kiểu dữ liệu\n- Hàm và vòng lặp" },
        { title: "Biến và Kiểu dữ liệu", type: "text", order: 2, duration: "15 phút", content: "## Biến trong JavaScript\n\nJavaScript có 3 cách khai báo biến:\n\n- `var` — phạm vi function (cũ)\n- `let` — phạm vi block\n- `const` — hằng số\n\n### Ví dụ\n\n`let name = 'LearnFlow';`\n`const PI = 3.14159;`\n\n### Các kiểu dữ liệu cơ bản\n\n- **String**: chuỗi ký tự\n- **Number**: số\n- **Boolean**: true/false\n- **Array**: mảng\n- **Object**: đối tượng" },
        { title: "Hàm (Functions)", type: "video", order: 3, duration: "20 phút", videoUrl: "https://www.youtube.com/watch?v=xUI5Tsl2JpY", content: "## Hàm trong JavaScript\n\nHàm là khối mã có thể tái sử dụng.\n\n### Arrow Function\n`const add = (a, b) => a + b;`" },
      ];

      for (const lesson of lessons) {
        await addDoc(collection(db, "courses", courseRef.id, "lessons"), {
          ...lesson,
          createdAt: serverTimestamp(),
        });
      }

      // Add sample quiz
      await addDoc(collection(db, "courses", courseRef.id, "quizzes"), {
        title: "Quiz: JavaScript Cơ bản",
        timeLimitMinutes: 10,
        passingScore: 60,
        createdAt: serverTimestamp(),
        questions: [
          {
            question: "JavaScript được sử dụng chủ yếu để làm gì?",
            options: ["Tạo giao diện web tương tác", "Quản lý database", "Phân tích dữ liệu", "Tạo ứng dụng mobile"],
            correctAnswer: 0,
          },
          {
            question: "Từ khóa nào được dùng để khai báo hằng số trong JavaScript?",
            options: ["var", "let", "const", "static"],
            correctAnswer: 2,
          },
          {
            question: "Kết quả của `typeof 42` là gì?",
            options: ['"integer"', '"number"', '"float"', '"numeric"'],
            correctAnswer: 1,
          },
          {
            question: "Đâu là cách viết Arrow Function đúng?",
            options: [
              "function => (x) { return x * 2 }",
              "const double = (x) => x * 2",
              "const double = x => { x * 2 }",
              "double(x) => x * 2",
            ],
            correctAnswer: 1,
          },
        ],
      });

      // Update lesson count
      const { updateDoc, doc } = await import(
        "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
      );
      await updateDoc(doc(db, "courses", courseRef.id), { lessonCount: lessons.length });
      console.log(`  📖 Added ${lessons.length} lessons + 1 quiz`);
    }
  }

  console.log("🎉 Seed complete! Refresh the page to see sample data.");
})();
