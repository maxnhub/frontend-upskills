<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.js';

const emit = defineEmits(['navigate']);
const authStore = useAuthStore();

// Avatar
const avatarInput = ref(null);
const avatarLoading = ref(false);
const avatarSuccess = ref('');
const avatarError = ref('');

function onAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Выберите изображение';
    return;
  }
  const reader = new FileReader();
  reader.onload = async (e) => {
    avatarError.value = '';
    avatarSuccess.value = '';
    avatarLoading.value = true;
    try {
      await authStore.updateAvatar(e.target.result);
      avatarSuccess.value = 'Аватар обновлён';
    } catch (err) {
      avatarError.value = err.response?.data?.error || 'Ошибка при загрузке аватара';
    } finally {
      avatarLoading.value = false;
    }
  };
  reader.readAsDataURL(file);
}

// Password
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordLoading = ref(false);
const passwordSuccess = ref('');
const passwordError = ref('');

async function changePassword() {
  passwordError.value = '';
  passwordSuccess.value = '';
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Пароли не совпадают';
    return;
  }
  passwordLoading.value = true;
  try {
    await authStore.changePassword(currentPassword.value, newPassword.value);
    passwordSuccess.value = 'Пароль успешно изменён';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (err) {
    passwordError.value = err.response?.data?.error || 'Ошибка при смене пароля';
  } finally {
    passwordLoading.value = false;
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <button class="back-btn" @click="emit('navigate', 'main')">← Назад</button>
        <h1 class="profile-title">Профиль</h1>
      </div>

      <!-- Avatar section -->
      <div class="profile-section">
        <h2 class="section-title">Аватар</h2>
        <div class="avatar-block">
          <div class="avatar-preview" @click="avatarInput.click()">
            <img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              alt="Аватар"
              class="avatar-img"
            />
            <div v-else class="avatar-placeholder">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="avatar-overlay">Изменить</div>
          </div>
          <div class="avatar-info">
            <p class="user-name">{{ authStore.user?.name }}</p>
            <p class="user-email">{{ authStore.user?.email }}</p>
            <button class="upload-btn" :disabled="avatarLoading" @click="avatarInput.click()">
              {{ avatarLoading ? 'Загрузка...' : 'Выбрать фото' }}
            </button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="onAvatarChange"
            />
            <p v-if="avatarSuccess" class="success-msg">{{ avatarSuccess }}</p>
            <p v-if="avatarError" class="error-msg">{{ avatarError }}</p>
          </div>
        </div>
      </div>

      <!-- Change password section -->
      <div class="profile-section">
        <h2 class="section-title">Смена пароля</h2>
        <form class="password-form" @submit.prevent="changePassword">
          <div class="field">
            <label>Текущий пароль</label>
            <input
              v-model="currentPassword"
              type="password"
              placeholder="Введите текущий пароль"
              required
              autocomplete="current-password"
            />
          </div>
          <div class="field">
            <label>Новый пароль</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="Минимум 6 символов"
              required
              autocomplete="new-password"
            />
          </div>
          <div class="field">
            <label>Подтвердите новый пароль</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Повторите новый пароль"
              required
              autocomplete="new-password"
            />
          </div>
          <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="success-msg">{{ passwordSuccess }}</p>
          <button type="submit" class="submit-btn" :disabled="passwordLoading">
            {{ passwordLoading ? 'Сохранение...' : 'Сменить пароль' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--background-light);
  padding: 80px 20px 40px;
}

.profile-container {
  max-width: 560px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 15px;
  cursor: pointer;
  padding: 6px 0;
  font-weight: 500;
}

.back-btn:hover {
  opacity: 0.75;
}

.profile-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.profile-section {
  background: var(--text-light);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 16px var(--shadow);
  padding: 28px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

/* Avatar */
.avatar-block {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-preview {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  border: 2px solid var(--border);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-light);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.upload-btn {
  padding: 8px 18px;
  background: var(--primary);
  color: var(--text-light);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity var(--transition-fast);
  width: fit-content;
}

.upload-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hidden-input {
  display: none;
}

/* Password form */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  opacity: 0.88;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  font-size: 13px;
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  border-radius: var(--radius-xs);
  padding: 8px 12px;
}

.error-msg {
  font-size: 13px;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.08);
  border-radius: var(--radius-xs);
  padding: 8px 12px;
}
</style>
