<script setup>
import { ref, computed } from 'vue';
import { useLanguageStore } from '../stores/language';
import UiButton from './UiKit/UiButton.vue';

const props = defineProps({
  task: {
    type: String,
    required: true,
  },
  initialCode: {
    type: String,
    default: '',
  },
  solution: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    default: '',
  },
});

const languageStore = useLanguageStore();

const userCode = ref(props.initialCode);
const isChecked = ref(false);
const isCorrect = ref(false);
const isHintVisible = ref(false);

/**
 * Normalizes code string for comparison by trimming whitespace and collapsing multiple spaces.
 * @param {string} code - The code string to normalize.
 * @return {string} Normalized code string.
 */
const normalizeCode = (code) =>
  code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

/**
 * Checks user's code against the expected solution.
 */
const checkSolution = () => {
  isChecked.value = true;
  isCorrect.value = normalizeCode(userCode.value) === normalizeCode(props.solution);
};

/**
 * Toggles the hint visibility.
 */
const toggleHint = () => {
  isHintVisible.value = !isHintVisible.value;
};

/**
 * Resets the sandbox to initial state.
 */
const resetSandbox = () => {
  userCode.value = props.initialCode;
  isChecked.value = false;
  isCorrect.value = false;
  isHintVisible.value = false;
};

const resultClass = computed(() => {
  if (!isChecked.value) return '';
  return isCorrect.value ? 'code-sandbox--correct' : 'code-sandbox--incorrect';
});

const checkLabel = computed(() => languageStore.getTranslation('check'));
const hintLabel = computed(() => languageStore.getTranslation('getHint'));
const correctLabel = computed(() => languageStore.getTranslation('correct'));
const incorrectLabel = computed(() => languageStore.getTranslation('incorrect'));
const resetLabel = computed(() => languageStore.getTranslation('reset'));
</script>

<template>
  <div class="code-sandbox">
    <div class="code-sandbox__task">
      <h4>📝 {{ task }}</h4>
    </div>

    <div class="code-sandbox__editor">
      <textarea
        v-model="userCode"
        class="code-sandbox__textarea"
        :class="resultClass"
        spellcheck="false"
        rows="10"
      />
    </div>

    <div class="code-sandbox__actions">
      <UiButton variant="primary" @click="checkSolution">
        ✅ {{ checkLabel }}
      </UiButton>
      <UiButton variant="secondary" @click="toggleHint">
        💡 {{ hintLabel }}
      </UiButton>
      <UiButton variant="secondary" @click="resetSandbox">
        🔄 {{ resetLabel }}
      </UiButton>
    </div>

    <div v-if="isChecked" class="code-sandbox__result" :class="resultClass">
      <p v-if="isCorrect">🎉 {{ correctLabel }}</p>
      <p v-else>❌ {{ incorrectLabel }}</p>
    </div>

    <div v-if="isHintVisible" class="code-sandbox__hint">
      <p>💡 {{ hint }}</p>
    </div>
  </div>
</template>

<style scoped>
.code-sandbox {
  background: var(--background);
  border-radius: var(--radius-md);
  padding: 24px;
  margin: 24px 0;
  border-left: 4px solid var(--primary);
}

.code-sandbox__task {
  margin-bottom: 16px;
}

.code-sandbox__task h4 {
  color: var(--primary-dark);
  font-size: 18px;
  font-weight: 600;
}

.code-sandbox__editor {
  margin-bottom: 16px;
}

.code-sandbox__textarea {
  width: 100%;
  min-height: 180px;
  padding: 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  background: var(--neutral-dark);
  color: #e0e0e0;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  resize: vertical;
  outline: none;
  tab-size: 2;
  transition: border-color var(--transition-base);
}

.code-sandbox__textarea:focus {
  border-color: var(--primary);
}

.code-sandbox__textarea.code-sandbox--correct {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.code-sandbox__textarea.code-sandbox--incorrect {
  border-color: #f44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

.code-sandbox__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.code-sandbox__result {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.code-sandbox__result.code-sandbox--correct {
  background: rgba(76, 175, 80, 0.12);
  color: #2e7d32;
}

.code-sandbox__result.code-sandbox--incorrect {
  background: rgba(244, 67, 54, 0.12);
  color: #c62828;
}

.code-sandbox__hint {
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .code-sandbox {
    padding: 16px;
  }

  .code-sandbox__actions {
    flex-direction: column;
  }

  .code-sandbox__textarea {
    font-size: 13px;
    min-height: 150px;
  }
}
</style>

