<template>
  <span
    class="skeleton"
    :style="{ width, height, borderRadius: rounded ? 'var(--radius-pill)' : 'var(--radius-sm)' }"
  />
</template>

<script setup>
defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "16px" },
  rounded: { type: Boolean, default: false }
});
</script>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    rgba(229, 229, 229, 0.6) 0%,
    rgba(242, 242, 242, 0.95) 50%,
    rgba(229, 229, 229, 0.6) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
