<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'

defineProps({
  tecnologias: { type: Array, default: () => [] }
})

const { t } = useI18n('skills')
const { target: seccionRef, isRevealed } = useScrollReveal({ threshold: 0.1 })

// Índice de la tecnología bajo el cursor; -1 = ninguna activa.
const activo = ref(-1)

// Escala cada item según su distancia al activo (efecto dock).
function getLerp(index) {
  if (activo.value === -1) return 0
  const distancia = Math.abs(index - activo.value)
  const lerps = [1, 0.5625, 0.25, 0.0625, 0]
  return lerps[Math.min(distancia, lerps.length - 1)]
}
</script>

<template>
  <section id="habilidades" class="section" ref="seccionRef">
    <div class="container">

      <h2 class="section-title">{{ t.titulo }}</h2>

      <!-- Dock de tecnologías con efecto de expansión.
           Es una lista (ul/li), no navegación. @mouseleave resetea el activo. -->
      <div class="dock-wrapper reveal-item" :class="{ active: isRevealed }" @mouseleave="activo = -1">
        <ul class="dock">

          <!--
            Cada item calcula su propio lerp según distancia al activo;
            :style lo pasa como variable CSS. tabindex + focus/blur dan
            acceso por teclado al nombre (el tooltip no es solo hover).
          -->
          <li
            v-for="(tech, index) in tecnologias"
            :key="tech.nombre"
            class="dock-item"
            tabindex="0"
            :style="{ '--lerp': getLerp(index) }"
            @mouseenter="activo = index"
            @focus="activo = index"
            @blur="activo = -1"
          >
            <!-- Ícono de Devicons via clase CSS -->
            <div class="dock-icono">
              <i :class="tech.icono" aria-hidden="true"></i>
            </div>

            <!-- Tooltip con el nombre — aparece al hover o foco -->
            <span class="dock-label">{{ tech.nombre }}</span>
          </li>

        </ul>
      </div>

    </div>
  </section>
</template>

<style scoped>
.dock-wrapper {
  display: flex;
  justify-content: center;
  padding-block: 3rem;
}

/* Entrada al hacer scroll */
.reveal-item {
  opacity: 0;
  transform: translateY(1.75rem);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-item.active {
  opacity: 1;
  transform: translateY(0);
}

/* Contenedor del dock — fila flex que se adapta con flex-wrap.
   El fondo deriva de la superficie del tema (día y noche). */
.dock {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 0;
  padding: 1rem 1.5rem;
  list-style: none;
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--color-surface) 70%, transparent);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  max-width: 55rem;
}

/* Cada item del dock */
.dock-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: default;
  /* El tamaño crece con --lerp: base 3rem, máximo 5rem al hover */
  width:  calc(3rem + var(--lerp, 0) * 2rem);
  height: calc(3rem + var(--lerp, 0) * 2rem);
  transition: width  0.2s ease,
              height 0.2s ease;
}

/* Contenedor del ícono */
.dock-icono {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background  0.2s ease,
              border-color 0.2s ease,
              transform    0.2s ease;
  /* Sube levemente con el lerp — igual que el ejemplo */
  transform: translateY(calc(var(--lerp, 0) * -0.75rem));
}

.dock-item:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 3px;
  border-radius: 0.75rem;
}

.dock-item:hover .dock-icono,
.dock-item:focus-visible .dock-icono {
  background: var(--color-surface);
  border-color: color-mix(in srgb, var(--sunset-orange) 40%, transparent);
}

/* Ícono de Devicons */
.dock-icono i {
  font-size: calc(1.5rem + var(--lerp, 0) * 0.75rem);
  transition: font-size 0.2s ease;
  line-height: 1;
}
/* Pop al pasar el cursor (spinning icon) */
.dock-item:hover .dock-icono i {
  animation: icon-pop 0.4s ease;
}
@keyframes icon-pop {
  0%   { transform: scale(1) rotate(0); }
  50%  { transform: scale(1.2) rotate(-8deg); }
  100% { transform: scale(1) rotate(0); }
}
@media (prefers-reduced-motion: reduce) {
  .dock-item:hover .dock-icono i { animation: none; }
}

/* Tooltip con el nombre */
.dock-label {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: 0.4rem;
  white-space: nowrap;
  /* Visible solo cuando --lerp > 0 (cerca del cursor) */
  opacity: var(--lerp, 0);
  transition: opacity 0.2s ease;
  pointer-events: none;
}

/* Media query al final */
@media (width <= 640px) {
  .dock {
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .dock-item {
    width:  calc(2.75rem + var(--lerp, 0) * 1.5rem);
    height: calc(2.75rem + var(--lerp, 0) * 1.5rem);
  }
}
</style>