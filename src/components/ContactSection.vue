<script setup>
import { useI18n } from '../composables/useI18n.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'

defineProps({
  contacto: {
    type: Object,
    default: () => ({}),
  },
})

const { t } = useI18n('contact')
const { target: seccionRef, isRevealed } = useScrollReveal({ threshold: 0.1 })
</script>

<template>
  <section id="contacto" class="section" ref="seccionRef">
    <div class="container">

      <h2 class="section-title">{{ t.titulo }}</h2>

      <!-- Enlaces reales (no botones con JS): permiten clic medio,
           copiar enlace y funcionan sin JavaScript. -->
      <div class="contacto-grid">

        <a
          v-if="contacto.email"
          class="contacto-card reveal-item"
          :class="{ active: isRevealed }"
          style="transition-delay: 0s"
          :href="`mailto:${contacto.email}`"
        >
          <span class="contacto-icono">
            <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
          </span>
          <span class="contacto-info">
            <span class="contacto-label">Email</span>
            <span class="contacto-valor">{{ contacto.email }}</span>
          </span>
          <ion-icon name="arrow-forward-outline" class="contacto-flecha" aria-hidden="true"></ion-icon>
        </a>

        <a
          v-if="contacto.linkedin"
          class="contacto-card reveal-item"
          :class="{ active: isRevealed }"
          style="transition-delay: 0.08s"
          :href="contacto.linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="contacto-icono linkedin">
            <ion-icon name="logo-linkedin" aria-hidden="true"></ion-icon>
          </span>
          <span class="contacto-info">
            <span class="contacto-label">LinkedIn</span>
            <span class="contacto-valor">{{ contacto.linkedin.replace('https://www.linkedin.com/in/', '') }}</span>
          </span>
          <ion-icon name="arrow-forward-outline" class="contacto-flecha" aria-hidden="true"></ion-icon>
        </a>

        <a
          v-if="contacto.github"
          class="contacto-card reveal-item"
          :class="{ active: isRevealed }"
          style="transition-delay: 0.16s"
          :href="contacto.github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="contacto-icono github">
            <ion-icon name="logo-github" aria-hidden="true"></ion-icon>
          </span>
          <span class="contacto-info">
            <span class="contacto-label">GitHub</span>
            <span class="contacto-valor">{{ contacto.github.replace('https://github.com/', '') }}</span>
          </span>
          <ion-icon name="arrow-forward-outline" class="contacto-flecha" aria-hidden="true"></ion-icon>
        </a>

      </div>

    </div>
  </section>
</template>

<style scoped>
.contacto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1.1rem;
  max-width: 52rem;
  margin-inline: auto;
}

/* Tarjeta de contacto (enlace con apariencia de tarjeta) */
.contacto-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.85rem 1.1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: var(--font-body);
  text-align: left;
  color: var(--color-text);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.28s ease,
              box-shadow 0.28s ease,
              background 0.28s ease,
              opacity 0.5s ease;
}

/* Entrada escalonada al hacer scroll (delay inline por tarjeta) */
.reveal-item { opacity: 0; transform: translateY(1.5rem); }
.reveal-item.active { opacity: 1; transform: translateY(0); }

/* Barra de acento que crece en hover (mismo lenguaje visual que el nav) */
.contacto-card::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--sunset-orange), var(--sunset-gold));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.contacto-card:hover {
  transform: translateY(-3px);
  border-color: transparent;
  background: var(--color-surface2);
  box-shadow: var(--shadow);
}
.contacto-card:hover::after {
  transform: scaleX(1);
}

.contacto-card:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 2px;
}

/* Ícono en tile redondeado con tinte de marca */
.contacto-icono {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  color: var(--sunset-orange);
  background: color-mix(in srgb, var(--sunset-orange) 10%, transparent);
  transition: transform 0.28s ease;
}
.contacto-card:hover .contacto-icono {
  transform: scale(1.06) rotate(-3deg);
  box-shadow: 0 0 1.5rem color-mix(in srgb, var(--sunset-orange) 40%, transparent);
}

.contacto-icono.linkedin {
  color: #2b8aef;
  background: rgb(10 102 194 / 0.14);
}
.contacto-card:hover .contacto-icono.linkedin {
  box-shadow: 0 0 1.5rem rgb(43 138 239 / 0.45);
}
.contacto-icono.github {
  color: var(--color-text);
  background: rgb(125 125 135 / 0.16);
}
.contacto-card:hover .contacto-icono.github {
  box-shadow: 0 0 1.5rem rgb(125 125 135 / 0.4);
}

/* Texto con jerarquía clara: plataforma destacada, detalle en mute */
.contacto-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.contacto-label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--color-text);
}

.contacto-valor {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Flecha sutil que se desliza en hover */
.contacto-flecha {
  font-size: 1.05rem;
  color: var(--color-muted);
  flex-shrink: 0;
  opacity: 0.45;
  transition: opacity 0.28s ease,
              transform 0.28s ease,
              color 0.28s ease;
}
.contacto-card:hover .contacto-flecha {
  opacity: 1;
  transform: translateX(3px);
  color: var(--sunset-orange);
}

@media (width <= 640px) {
  .contacto-grid {
    grid-template-columns: 1fr;
  }
}
</style>
