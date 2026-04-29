<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.js';

const authStore = useAuthStore();

const mode = ref('login'); // 'login' | 'register'
const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

function switchMode(newMode) {
  mode.value = newMode;
  error.value = '';
  name.value = '';
  email.value = '';
  password.value = '';
}

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    if (mode.value === 'login') {
      await authStore.login(email.value, password.value);
    } else {
      await authStore.register(name.value, email.value, password.value);
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Произошла ошибка. Попробуйте снова.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-overlay">
    <div class="auth-modal">
      <div class="auth-tabs">
        <button
          class="auth-tab"
          :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >
          Вход
        </button>
        <button
          class="auth-tab"
          :class="{ active: mode === 'register' }"
          @click="switchMode('register')"
        >
          Регистрация
        </button>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <div v-if="mode === 'register'" class="field">
          <label>Имя</label>
          <input
            v-model="name"
            type="text"
            placeholder="Ваше имя"
            required
            autocomplete="name"
          />
        </div>

        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="example@mail.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="field">
          <label>Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="Минимум 6 символов"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button type="submit" class="auth-submit" :disabled="loading">
          {{ loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(47, 42, 45, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-modal {
  background: var(--text-light);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 40px var(--shadow);
  width: 100%;
  max-width: 400px;
  padding: 32px;
  margin: 16px;
}

.auth-tabs {
  display: flex;
  gap: 4px;
  background: var(--background);
  border-radius: var(--radius-sm);
  padding: 4px;
  margin-bottom: 28px;
}

.auth-tab {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: var(--radius-xs);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.auth-tab.active {
  background: var(--text-light);
  color: var(--primary);
  box-shadow: 0 1px 6px var(--shadow);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.field input {
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: var(--text-primary);
  background: var(--background-light);
  outline: none;
  transition: border-color var(--transition-fast);
}

.field input:focus {
  border-color: var(--primary);
}

.auth-error {
  font-size: 13px;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.08);
  border-radius: var(--radius-xs);
  padding: 8px 12px;
  margin: 0;
}

.auth-submit {
  margin-top: 4px;
  padding: 13px;
  background: var(--primary);
  color: var(--text-light);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.auth-submit:hover:not(:disabled) {
  opacity: 0.88;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
