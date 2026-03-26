// ============================================================
//  app.js — LearnFlow MVC2 Application Bootstrap & Router
//  MVC2 Pattern:
//    Model    → /models/   (data layer, Firebase interaction)
//    View     → /views/    (HTML template rendering)
//    Controller→ /controllers/ (business logic, event binding)
//    Service  → /services/ (shared utilities, API calls)
// ============================================================

import { AuthController } from "./controllers/AuthController.js";
import { CourseController } from "./controllers/CourseController.js";
import { QuizController } from "./controllers/QuizController.js";
import { ProgressController } from "./controllers/ProgressController.js";
import { AdminController } from "./controllers/AdminController.js";
import { ChatbotController } from "./controllers/ChatbotController.js";
import { AuthModel } from "./models/AuthModel.js";
import { I18nService } from "./services/I18nService.js";
import { ThemeService } from "./services/ThemeService.js";
import { ToastService } from "./services/ToastService.js";

export class App {
  constructor() {
    this.routes = {
      login:     () => this.authController.showLoginPage(),
      register:  () => this.authController.showRegisterPage(),
      dashboard: () => this.courseController.showDashboard(),
      courses:   () => this.courseController.showCourseList(),
      course:    (id) => this.courseController.showCourseDetail(id),
      lesson:    (courseId, lessonId) => this.courseController.showLesson(courseId, lessonId),
      quiz:      (courseId, quizId) => this.quizController.showQuiz(courseId, quizId),
      progress:  () => this.progressController.showProgress(),
      admin:     () => this.adminController.showAdmin(),
    };
    this.currentUser = null;
    this.currentPage = null;
  }

  async init() {
    // Init services first
    this.i18n    = new I18nService();
    this.theme   = new ThemeService();
    this.toast   = new ToastService();

    // Make services globally accessible
    window.__i18n  = this.i18n;
    window.__theme = this.theme;
    window.__toast = this.toast;
    window.__router = this;

    // Init controllers
    this.authModel          = new AuthModel();
    this.authController     = new AuthController(this);
    this.courseController   = new CourseController(this);
    this.quizController     = new QuizController(this);
    this.progressController = new ProgressController(this);
    this.adminController    = new AdminController(this);
    this.chatbotController  = new ChatbotController(this);

    // Bind global UI
    this._bindNavEvents();
    this._bindThemeToggle();
    this._bindLangToggle();

    // Listen for auth state
    this.authModel.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      this._updateNavbar(user);

      if (user) {
        // Load user role
        await this.authModel.loadUserProfile(user.uid);
        this._updateNavbar(user);
        document.getElementById("chatbotWidget").classList.remove("hidden");
        document.querySelector(".chatbot-fab").classList.remove("hidden");
        this.navigate(this.currentPage || "dashboard");
      } else {
        document.getElementById("chatbotWidget").classList.add("hidden");
        document.querySelector(".chatbot-fab").classList.add("hidden");
        this.navigate("login");
      }

      this._hideLoading();
    });
  }

  navigate(page, ...args) {
    this.currentPage = page;

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach(l => {
      l.classList.toggle("active", l.dataset.page === page);
    });

    const handler = this.routes[page];
    if (handler) {
      handler(...args);
    } else {
      this.routes["dashboard"]();
    }
  }

  _bindNavEvents() {
    document.querySelectorAll(".nav-link[data-page]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigate(link.dataset.page);
      });
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      this.authController.logout();
    });
  }

  _bindThemeToggle() {
    const btn = document.getElementById("themeToggle");
    btn?.addEventListener("click", () => {
      this.theme.toggle();
      btn.textContent = this.theme.current === "dark" ? "☀️" : "🌙";
    });
  }

  _bindLangToggle() {
    document.getElementById("langToggle")?.addEventListener("click", () => {
      this.i18n.toggle();
    });
  }

  _updateNavbar(user) {
    const navbar  = document.getElementById("navbar");
    const navUser = document.getElementById("navUser");
    const welcome = document.getElementById("welcomeText");
    const adminLink = document.querySelector(".nav-link--admin");

    if (user) {
      navbar.classList.remove("hidden");
      navUser.classList.remove("hidden");
      const profile = this.authModel.userProfile;
      const displayName = profile?.displayName || user.email.split("@")[0];
      const lang = this.i18n.current;
      welcome.textContent = lang === "vi"
        ? `Chào, ${displayName} 👋`
        : `Welcome, ${displayName} 👋`;

      // Show admin link if admin
      if (profile?.role === "admin") {
        adminLink?.classList.remove("hidden");
      } else {
        adminLink?.classList.add("hidden");
      }
    } else {
      navbar.classList.add("hidden");
      navUser.classList.add("hidden");
    }
  }

  _hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.add("fade-out");
    setTimeout(() => overlay.remove(), 600);
  }

  isAdmin() {
    return this.authModel.userProfile?.role === "admin";
  }

  getUser() {
    return this.currentUser;
  }

  getUserProfile() {
    return this.authModel.userProfile;
  }
}
