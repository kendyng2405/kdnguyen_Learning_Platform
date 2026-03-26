// ============================================================
//  AuthModel.js — Authentication & User Profile Data Layer
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { APP_CONFIG } from "../config.js";

export class AuthModel {
  constructor() {
    this.auth = window.__firebaseAuth;
    this.db   = window.__firebaseDB;
    this.userProfile = null;
  }

  onAuthStateChanged(callback) {
    onAuthStateChanged(this.auth, callback);
  }

  async login(email, password) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = cred.user;

    // Determine role: first user or listed admin email = admin
    const isAdmin = APP_CONFIG.adminEmails.includes(email);

    await setDoc(doc(this.db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName: displayName || email.split("@")[0],
      role: isAdmin ? "admin" : "student",
      createdAt: serverTimestamp(),
      progress: {},
      enrolledCourses: [],
    });

    await this.loadUserProfile(user.uid);
    return user;
  }

  async logout() {
    this.userProfile = null;
    await signOut(this.auth);
  }

  async loadUserProfile(uid) {
    const snap = await getDoc(doc(this.db, "users", uid));
    if (snap.exists()) {
      this.userProfile = snap.data();
    } else {
      this.userProfile = null;
    }
    return this.userProfile;
  }

  async updateProfile(uid, data) {
    await updateDoc(doc(this.db, "users", uid), data);
    if (this.userProfile) {
      Object.assign(this.userProfile, data);
    }
  }

  async promoteToAdmin(uid) {
    await updateDoc(doc(this.db, "users", uid), { role: "admin" });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
