<script setup>
import { reactive, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useTheme } from '../composables/useTheme.js'
import { useScrollSpy } from '../composables/useScrollSpy.js'

defineProps({
  scrolled: { type: Boolean, default: false },
})

const { locale, toggleLocale, t } = useI18n('nav')
const { theme, toggleTheme } = useTheme()

// Secciones del nav: id de ancla + clave de traducción.
const secciones = [
  { id: 'sobre-mi', key: 'sobre' },
  { id: 'galeria', key: 'galeria' },
  { id: 'habilidades', key: 'habilidades' },
  { id: 'contacto', key: 'contacto' },
]

const { activeId } = useScrollSpy(secciones.map((s) => s.id))

// ── Magic line: subrayado único que se desliza al enlace activo ──
const navEl = ref(null)
const underline = reactive({ left: 0, width: 0 })

function moverSubrayado() {
  const cont = navEl.value
  if (!cont) return
  const activo = cont.querySelector('.active')
  if (!activo) {
    underline.width = 0
    return
  }
  underline.left = activo.offsetLeft
  underline.width = activo.offsetWidth
}

// El idioma también recoloca el subrayado: cambia el ancho de los enlaces.
watch([activeId, locale], () => nextTick(moverSubrayado))

// ResizeObserver sobre el nav (en vez de escuchar window resize);
// su callback inicial cubre el posicionamiento al montar.
let resizeObserver = null
onMounted(() => {
  if (!navEl.value) return
  resizeObserver = new ResizeObserver(() => moverSubrayado())
  resizeObserver.observe(navEl.value)
})
onUnmounted(() => resizeObserver?.disconnect())
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="container nav-inner">
      <span class="nav-brand">
        <ion-icon name="ellipse" class="dot" aria-hidden="true"></ion-icon> Portfolio
      </span>

      <nav ref="navEl" class="nav-links" aria-label="Secciones">
        <a
          v-for="sec in secciones"
          :key="sec.id"
          :href="`#${sec.id}`"
          :class="{ active: activeId === sec.id }"
          :aria-current="activeId === sec.id ? 'true' : undefined"
        >{{ t[sec.key] }}</a>

        <!-- Subrayado deslizante (magic line) -->
        <span
          class="nav-underline"
          aria-hidden="true"
          :style="{ transform: `translateX(${underline.left}px)`, width: `${underline.width}px` }"
        ></span>
      </nav>

      <div class="nav-controls">
        <button class="btn-control" type="button" @click="toggleLocale"
          :aria-label="locale === 'es' ? 'Switch to English' : 'Cambiar a Español'">
          {{ locale === 'es' ? 'EN' : 'ES' }}
        </button>
        <button class="btn-control btn-icon" type="button" @click="toggleTheme"
          :aria-label="theme === 'night' ? t.temaDia : t.temaNoche">
          <ion-icon
            :name="theme === 'night' ? 'sunny-outline' : 'moon-outline'"
            :style="{ transform: theme === 'day' ? 'rotate(180deg)' : 'rotate(0deg)' }"
            aria-hidden="true"
          ></ion-icon>
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
  background-color: color-mix(in srgb, var(--color-bg) 80%, transparent);
  border-bottom: 1px solid var(--color-border);
  padding-block: 1rem;
  backdrop-filter: blur(12px);
  transition: background-color 0.4s ease, box-shadow 0.3s ease, padding-block 0.3s ease;
}
/* Elevación al hacer scroll (CSS shadow on scroll) */
.nav.scrolled {
  box-shadow: var(--shadow-lg);
  padding-block: 0.6rem;
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
.dot { color: var(--sunset-orange); font-size: 0.6rem; }

.nav-links {
  position: relative;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--color-muted);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
  padding-block: 0.5rem;
  transition: color 0.3s ease;
  border-radius: var(--radius-sm);
}
.nav-links a:hover { color: var(--color-text); opacity: 1; }
.nav-links a.active { color: var(--color-text); }
.nav-links a:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 4px;
}

/* Subrayado deslizante compartido */
.nav-underline {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--sunset-orange), var(--sunset-gold));
  transition: transform 0.3s ease, width 0.3s ease;
}

.nav-controls { display: flex; gap: 0.5rem; }

.btn-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  transition: var(--transition-color), transform 0.2s ease;
}
.btn-control:hover { border-color: var(--sunset-orange); color: var(--sunset-orange); }
.btn-control:active { transform: scale(0.94); }
.btn-control:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 2px;
}
.btn-icon { font-size: 1.2rem; padding-inline: 0.5rem; }
/* Giro del icono al cambiar de tema */
.btn-icon ion-icon { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

@media (width <= 640px) {
  .nav-inner { gap: 0.75rem 1rem; flex-wrap: wrap; justify-content: center; }
  .nav-links { gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
  .nav-links a { font-size: 0.85rem; }
  .nav-brand  { font-size: 1rem; }
}
</style>
