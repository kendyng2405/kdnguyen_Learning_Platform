// ============================================================
//  AuthController.js — Authentication Business Logic (MVC2)
// ============================================================

import { AuthModel } from "../models/AuthModel.js";
import { AuthView } from "../views/AuthView.js";

export class AuthController {
  constructor(app) {
    this.app   = app;
    this.model = new AuthModel();
    this.view  = new AuthView();
  }

  showLoginPage() {
    const lang = window.__i18n.current;
    const html = this.view.renderLogin(lang);
    this._renderPage(html, "login");
    this._bindLoginForm();
  }

  showRegisterPage() {
    const lang = window.__i18n.current;
    const html = this.view.renderRegister(lang);
    this._renderPage(html, "register");
    this._bindRegisterForm();
  }

  async logout() {
    try {
      await this.model.logout();
      window.__toast.success(
        window.__i18n.current === "vi" ? "Đã đăng xuất!" : "Logged out!"
      );
    } catch (e) {
      window.__toast.error(e.message);
    }
  }

  _bindLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email    = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const btn      = form.querySelector(".btn--submit");

      this._setLoading(btn, true);
      try {
        await this.model.login(email, password);
        // onAuthStateChanged in app.js handles the rest
      } catch (err) {
        const msg = this._friendlyError(err.code);
        window.__toast.error(msg);
        this._setLoading(btn, false);
      }
    });

    document.getElementById("goToRegister")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.app.navigate("register");
    });
  }

  _bindRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name     = document.getElementById("registerName").value.trim();
      const email    = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value;
      const confirm  = document.getElementById("registerConfirm").value;
      const btn      = form.querySelector(".btn--submit");

      if (password !== confirm) {
        window.__toast.error(
          window.__i18n.current === "vi"
            ? "Mật khẩu không khớp!"
            : "Passwords do not match!"
        );
        return;
      }

      this._setLoading(btn, true);
      try {
        await this.model.register(email, password, name);
        window.__toast.success(
          window.__i18n.current === "vi"
            ? "Đăng ký thành công!"
            : "Registration successful!"
        );
      } catch (err) {
        window.__toast.error(this._friendlyError(err.code));
        this._setLoading(btn, false);
      }
    });

    document.getElementById("goToLogin")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.app.navigate("login");
    });
  }

  _renderPage(html, name) {
    const container = document.getElementById("pageContainer");
    container.innerHTML = html;
    container.className = `page-container page-${name}`;
    requestAnimationFrame(() => container.classList.add("page-enter"));
  }

  _setLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    const lang = window.__i18n.current;
    if (isLoading) {
      btn.dataset.original = btn.textContent;
      btn.innerHTML = '<span class="spinner-sm"></span>';
    } else {
      btn.textContent = btn.dataset.original || (lang === "vi" ? "Xác nhận" : "Submit");
    }
  }

  _friendlyError(code) {
    const vi = {
      "auth/user-not-found":     "Email không tồn tại.",
      "auth/wrong-password":     "Mật khẩu không đúng.",
      "auth/email-already-in-use": "Email đã được sử dụng.",
      "auth/weak-password":      "Mật khẩu quá yếu (tối thiểu 6 ký tự).",
      "auth/invalid-email":      "Email không hợp lệ.",
      "auth/invalid-credential": "Email hoặc mật khẩu không đúng.",
    };
    const en = {
      "auth/user-not-found":     "Email not found.",
      "auth/wrong-password":     "Wrong password.",
      "auth/email-already-in-use": "Email already in use.",
      "auth/weak-password":      "Password too weak (min 6 chars).",
      "auth/invalid-email":      "Invalid email.",
      "auth/invalid-credential": "Invalid email or password.",
    };
    const map = window.__i18n.current === "vi" ? vi : en;
    return map[code] || (window.__i18n.current === "vi" ? "Đã xảy ra lỗi." : "An error occurred.");
  }
}
