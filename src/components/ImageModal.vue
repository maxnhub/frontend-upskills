<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
    validator: value => value.every(img => img.src && img.alt)
  }
});

const activeImageIndex = ref(0);
const showModal = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);

const hasImages = computed(() => props.images?.length > 0);

const openModal = (index) => {
  if (index >= 0 && index < props.images.length) {
    activeImageIndex.value = index;
    showModal.value = true;
    document.body.style.overflow = 'hidden';
  }
};

const closeModal = () => {
  showModal.value = false;
  activeImageIndex.value = 0;
  document.body.style.overflow = '';
};

const navigate = (direction) => {
  const newIndex = activeImageIndex.value + direction;
  if (newIndex >= 0 && newIndex < props.images.length) {
    activeImageIndex.value = newIndex;
  }
};

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  if (touchStartX.value - touchEndX.value > 50) {
    navigate(1);
  }
  if (touchEndX.value - touchStartX.value > 50) {
    navigate(-1);
  }
};
</script>

<template>
  <div v-if="hasImages" class="image-gallery">
    <div 
      v-for="(image, index) in images" 
      :key="index"
      class="thumbnail-wrapper"
    >
      <img
        :src="image.src"
        :alt="image.alt"
        class="clickable-image"
        @click="openModal(index)"
      >
    </div>

    <div 
      v-if="showModal" 
      class="image-modal" 
      @click.self="closeModal"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="modal-content">
        <transition name="slide" mode="out-in">
          <img 
            :key="activeImageIndex"
            :src="images[activeImageIndex]?.src" 
            :alt="images[activeImageIndex]?.alt"
          >
        </transition>
        
        <button 
          v-if="activeImageIndex > 0"
          class="nav-btn prev-btn"
          @click.stop="navigate(-1)"
        >
          ‹
        </button>
        
        <button 
          v-if="activeImageIndex < images.length - 1"
          class="nav-btn next-btn"
          @click.stop="navigate(1)"
        >
          ›
        </button>
        
        <button class="close-btn" @click.stop="closeModal">
          ×
        </button>
        
        <div class="image-counter" v-if="images.length > 1">
          {{ activeImageIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
}

.thumbnail-wrapper {
  cursor: pointer;
  transition: transform var(--transition-base);
}

.thumbnail-wrapper:hover {
  transform: scale(1.03);
}

.clickable-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--radius-md);
  object-fit: cover;
  box-shadow: 0 2px 8px var(--shadow);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--primary-dark-rgb), 0.92);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  text-align: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 40px;
  cursor: pointer;
  padding: 0 15px;
  z-index: 2;
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.close-btn:hover {
  color: var(--accent);
  transform: scale(1.1);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(var(--primary-medium-dark-rgb), 0.6);
  border: none;
  color: var(--text-light);
  font-size: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.nav-btn:hover {
  background: rgba(var(--primary-medium-dark-rgb), 0.85);
  transform: translateY(-50%) scale(1.05);
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.image-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-light);
  background: rgba(var(--primary-medium-dark-rgb), 0.7);
  padding: 5px 15px;
  border-radius: var(--radius-lg);
  font-size: 14px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
