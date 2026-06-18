<script setup>
import { useFizzyParticles } from '../composables/useFizzyParticles.js'

defineProps({
  // Etiqueta a renderizar: 'button' para acciones, 'a' para enlaces.
  tag: { type: String, default: 'button' },
  // 'solid' (relleno) | 'outline' (borde que se llena en hover/activo).
  variant: { type: String, default: 'solid' },
})

const { particles, spotStyle } = useFizzyParticles()
</script>

<template>
  <component :is="tag" class="fizzy" :class="`fizzy--${variant}`">
    <span class="fizzy-label"><slot /></span>
    <span class="fizzy-spots" aria-hidden="true">
      <span
        v-for="(p, i) in particles"
        :key="i"
        class="fizzy-spot"
        :style="spotStyle(p)"
      ></span>
    </span>
  </component>
</template>

<style scoped>
.fizzy {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 2.25rem;
  padding-inline: 1rem;
  border: 1.5px solid transparent;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  overflow: visible;
  transition: background-color 0.3s ease, color 0.3s ease,
              transform 0.2s ease, box-shadow 0.3s ease;
}
.fizzy:active { transform: scale(0.96); }
.fizzy:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 3px;
}
.fizzy :deep(ion-icon) { font-size: 0.95rem; }

/* Texto e iconos por encima de las partículas. */
.fizzy-label {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* ── Variante rellena (CTA principal) ── */
.fizzy--solid {
  background: linear-gradient(135deg, var(--sunset-orange), var(--sunset-deep));
  color: #fff;
}
.fizzy--solid:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--sunset-orange) 40%, transparent);
}

/* ── Variante con borde que se llena en hover / activo ── */
.fizzy--outline {
  border-color: var(--sunset-orange);
  background: transparent;
  color: var(--sunset-orange);
}
.fizzy--outline:hover,
.fizzy--outline.is-active {
  background: var(--sunset-orange);
  color: #fff;
}

/* ── Enjambre de partículas (efecto "fizzy") ──
   Cada partícula trae posición, color y tiempos en variables CSS
   (useFizzyParticles). Burbujean en bucle mientras el cursor está encima;
   es feedback iniciado por el usuario, por eso se conserva con reduced-motion. */
/* Caja de las partículas: cubre exactamente el botón (inset 0), así el
   borde elíptico inscrito (50% en cada eje) coincide con el borde de la
   píldora a cualquier tamaño. */
.fizzy-spots {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
/* Cada partícula nace en su punto del borde (cos/sin del ángulo) y emana
   hacia afuera por ese mismo ángulo. Al ir en %, se ajusta solo al botón. */
.fizzy-spot {
  position: absolute;
  left: calc(50% + cos(var(--angle)) * 50%);
  top: calc(50% + sin(var(--angle)) * 50%);
  width: var(--size);
  height: var(--size);
  margin-left: calc(var(--size) / -2);
  margin-top: calc(var(--size) / -2);
  border-radius: 50%;
  background: hsl(var(--h) 95% 62%);
  box-shadow: 0 0 6px hsl(var(--h) 90% 55% / 0.7);
  opacity: 0;
}
.fizzy:hover .fizzy-spot {
  animation: fizzy-emit var(--dur) var(--delay) ease-out infinite;
}

/* Emisión radial: el destino lo marca el propio ángulo de la partícula. */
@keyframes fizzy-emit {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.2); }
  25%  { opacity: 1; }
  100% {
    opacity: 0;
    transform: translate(calc(cos(var(--angle)) * var(--dist)),
                         calc(sin(var(--angle)) * var(--dist))) scale(1);
  }
}
</style>
