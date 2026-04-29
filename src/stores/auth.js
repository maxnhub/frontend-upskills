import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    token: localStorage.getItem('auth_token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
  },
  actions: {
    async register(name, email, password) {
      const response = await axios.post('/auth/register', { name, email, password });
      this._setSession(response.data.token, response.data.user);
    },
    async login(email, password) {
      const response = await axios.post('/auth/login', { email, password });
      this._setSession(response.data.token, response.data.user);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    async changePassword(currentPassword, newPassword) {
      await axios.put('/auth/change-password', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    },
    async updateAvatar(avatar) {
      const response = await axios.put('/auth/update-avatar', { avatar }, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.user = response.data.user;
      localStorage.setItem('auth_user', JSON.stringify(this.user));
    },
    _setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
  },
});
