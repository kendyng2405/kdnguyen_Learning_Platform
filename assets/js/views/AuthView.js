// ============================================================
//  AuthView.js — Login & Register Page Templates
// ============================================================

export class AuthView {
  renderLogin(lang) {
    const t = {
      vi: {
        title: "Chào mừng trở lại",
        sub: "Đăng nhập để tiếp tục học tập",
        email: "Email",
        password: "Mật khẩu",
        submit: "Đăng nhập",
        noAccount: "Chưa có tài khoản?",
        register: "Đăng ký ngay",
        emailPh: "your@email.com",
        passPh: "Mật khẩu của bạn",
      },
      en: {
        title: "Welcome Back",
        sub: "Sign in to continue learning",
        email: "Email",
        password: "Password",
        submit: "Sign In",
        noAccount: "Don't have an account?",
        register: "Register now",
        emailPh: "your@email.com",
        passPh: "Your password",
      }
    }[lang] || {};

    return `
      <div class="auth-page">
        <div class="auth-bg">
          <div class="auth-blob blob-1"></div>
          <div class="auth-blob blob-2"></div>
          <div class="auth-blob blob-3"></div>
        </div>
        <div class="auth-card animate-slide-up">
          <div class="auth-brand">
            <div class="auth-logo">🎓</div>
            <h1 class="auth-logo-text">LearnFlow</h1>
          </div>
          <h2 class="auth-title">${t.title}</h2>
          <p class="auth-sub">${t.sub}</p>
          <form id="loginForm" class="auth-form" novalidate>
            <div class="form-group">
              <label class="form-label">${t.email}</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="${t.emailPh}" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">${t.password}</label>
              <div class="input-password-wrap">
                <input type="password" id="loginPassword" class="form-input" placeholder="${t.passPh}" required autocomplete="current-password" />
                <button type="button" class="btn-eye" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'; this.textContent = this.previousElementSibling.type === 'password' ? '👁' : '🙈'">👁</button>
              </div>
            </div>
            <button type="submit" class="btn btn--primary btn--submit btn--full">${t.submit}</button>
          </form>
          <p class="auth-switch">
            ${t.noAccount}
            <a href="#" id="goToRegister" class="link">${t.register}</a>
          </p>
        </div>
      </div>
    `;
  }

  renderRegister(lang) {
    const t = {
      vi: {
        title: "Tạo tài khoản mới",
        sub: "Bắt đầu hành trình học tập của bạn",
        name: "Họ tên",
        email: "Email",
        password: "Mật khẩu",
        confirm: "Xác nhận mật khẩu",
        submit: "Đăng ký",
        hasAccount: "Đã có tài khoản?",
        login: "Đăng nhập",
        namePh: "Nguyễn Văn A",
        emailPh: "your@email.com",
        passPh: "Tối thiểu 6 ký tự",
        confirmPh: "Nhập lại mật khẩu",
      },
      en: {
        title: "Create Account",
        sub: "Start your learning journey",
        name: "Full Name",
        email: "Email",
        password: "Password",
        confirm: "Confirm Password",
        submit: "Register",
        hasAccount: "Already have an account?",
        login: "Sign in",
        namePh: "John Doe",
        emailPh: "your@email.com",
        passPh: "Minimum 6 characters",
        confirmPh: "Re-enter password",
      }
    }[lang] || {};

    return `
      <div class="auth-page">
        <div class="auth-bg">
          <div class="auth-blob blob-1"></div>
          <div class="auth-blob blob-2"></div>
          <div class="auth-blob blob-3"></div>
        </div>
        <div class="auth-card auth-card--register animate-slide-up">
          <div class="auth-brand">
            <div class="auth-logo">🎓</div>
            <h1 class="auth-logo-text">LearnFlow</h1>
          </div>
          <h2 class="auth-title">${t.title}</h2>
          <p class="auth-sub">${t.sub}</p>
          <form id="registerForm" class="auth-form" novalidate>
            <div class="form-group">
              <label class="form-label">${t.name}</label>
              <input type="text" id="registerName" class="form-input" placeholder="${t.namePh}" required />
            </div>
            <div class="form-group">
              <label class="form-label">${t.email}</label>
              <input type="email" id="registerEmail" class="form-input" placeholder="${t.emailPh}" required autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">${t.password}</label>
              <input type="password" id="registerPassword" class="form-input" placeholder="${t.passPh}" required autocomplete="new-password" />
            </div>
            <div class="form-group">
              <label class="form-label">${t.confirm}</label>
              <input type="password" id="registerConfirm" class="form-input" placeholder="${t.confirmPh}" required autocomplete="new-password" />
            </div>
            <button type="submit" class="btn btn--primary btn--submit btn--full">${t.submit}</button>
          </form>
          <p class="auth-switch">
            ${t.hasAccount}
            <a href="#" id="goToLogin" class="link">${t.login}</a>
          </p>
        </div>
      </div>
    `;
  }
}
