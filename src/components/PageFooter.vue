<script setup>
import { useI18n } from '../composables/useI18n.js'

defineProps({
  contacto: { type: Object, default: () => ({}) },
})

const { t } = useI18n('footer')
const anioActual = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="footer-copy">© {{ anioActual }} Carlos Daniel (Cava) · {{ t.curso }}</p>

      <nav class="footer-links" :aria-label="t.redes">
        <a
          v-if="contacto.github"
          :href="contacto.github"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
        <a
          v-if="contacto.linkedin"
          :href="contacto.linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >LinkedIn</a>
        <a v-if="contacto.email" :href="`mailto:${contacto.email}`">Email</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding-block: 2rem;
  background: var(--color-surface);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.footer-links {
  display: flex;
  gap: 1.25rem;
}

.footer-links a {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-muted);
  transition: var(--transition-color);
}
.footer-links a:hover {
  color: var(--color-accent);
  opacity: 1;
}
.footer-links a:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 3px;
}

@media (width <= 640px) {
  .footer-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
