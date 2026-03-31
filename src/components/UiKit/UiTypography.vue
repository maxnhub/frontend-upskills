<script setup>
import { defineProps } from 'vue'

defineProps({
  variant: {
    type: String,
    default: 'body',
    validator: value => ['h1', 'h2', 'h3', 'body', 'caption'].includes(value)
  }
})
</script>

<template>
  <component :is="tag" :class="['ui-typography', variant]">
    <slot />
  </component>
</template>

<script>
export default {
  computed: {
    tag() {
      const tags = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        body: 'p',
        caption: 'span'
      }
      return tags[this.variant] || 'p'
    }
  }
}
</script>

<style scoped>
.ui-typography {
  margin: 0;
  color: var(--text-primary);
}

.ui-typography.h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-medium-dark);
}

.ui-typography.h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-medium-dark);
}

.ui-typography.h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-dark);
}

.ui-typography.body {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-primary);
}

.ui-typography.caption {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
