<script setup>
import { inject } from 'vue'

const theme       = inject('theme')
const lang        = inject('lang')
const toggleTheme = inject('toggleTheme')
const toggleLang  = inject('toggleLang')

const t = {
  es: { sobre: 'Sobre mí', galeria: 'Galería', habilidades: 'Habilidades' },
  en: { sobre: 'About',    galeria: 'Gallery',  habilidades: 'Skills'      }
}
</script>

<template>
  <header class="nav" role="banner">
    <div class="container nav-inner">
      <span class="nav-brand">
        <span class="dot" aria-hidden="true">●</span> Portfolio
      </span>

      <nav class="nav-links" aria-label="Secciones">
        <a href="#sobre-mi">{{ t[lang].sobre }}</a>
        <a href="#galeria">{{ t[lang].galeria }}</a>
        <a href="#habilidades">{{ t[lang].habilidades }}</a>
      </nav>

      <div class="nav-controls">
        <button class="btn-control" @click="toggleLang"
          :aria-label="lang === 'es' ? 'Switch to English' : 'Cambiar a Español'">
          {{ lang === 'es' ? 'EN' : 'ES' }}
        </button>
        <button class="btn-control" @click="toggleTheme"
          :aria-label="theme === 'night' ? 'Activar modo día' : 'Activar modo noche'">
          {{ theme === 'night' ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding-block: 1rem;
  backdrop-filter: blur(12px);
  transition: background-color 0.4s ease;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
}
.dot { color: var(--sunset-orange); font-size: 0.7rem; }

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  position: relative;
  color: var(--color-muted);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
  transition: color 0.3s ease;
}
.nav-links a::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: -0.25rem;
  height: 1px;
  background: var(--sunset-orange);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.nav-links a:hover { color: var(--color-text); opacity: 1; }
.nav-links a:hover::after { transform: scaleX(1); }

.nav-controls { display: flex; gap: 0.5rem; }

.btn-control {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  transition: var(--transition-color);
}
.btn-control:hover { border-color: var(--sunset-orange); color: var(--sunset-orange); }

@media (width <= 640px) {
  .nav-links { gap: 1rem; font-size: 0.85rem; }
  .nav-brand  { font-size: 1rem; }
}
</style>