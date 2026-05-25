<script setup>
import { ref, inject, computed } from 'vue'

const lang = inject('lang')

const textos = {
  es: { titulo: 'Tecnologías' },
  en: { titulo: 'Technologies' }
}
const t = computed(() => textos[lang.value])

// Recibe ambas props — habilidades se mantiene por compatibilidad con el JSON
// tecnologias es el nuevo array de iconos
defineProps({
  
  tecnologias:  { type: Array, default: () => [] }
})

// Zona activa del dock — índice de la tecnología sobre la que está el cursor
// -1 significa que ninguna está activa
const activo = ref(-1)

// Calcula el "lerp" (interpolación) de cada item según distancia al activo
// Igual al efecto del código de ejemplo: items cercanos crecen menos
function getLerp(index) {
  if (activo.value === -1) return 0
  const distancia = Math.abs(index - activo.value)
  const lerps = [1, 0.5625, 0.25, 0.0625, 0]
  return lerps[Math.min(distancia, lerps.length - 1)]
}
</script>

<template>
  <section id="habilidades" class="section">
    <div class="container">

      <h2 class="section-title">{{ t.titulo }}</h2>

      <!-- Dock de tecnologías con efecto de expansión -->
      <!-- @mouseleave del contenedor resetea el activo -->
      <div class="dock-wrapper" @mouseleave="activo = -1">
        <nav class="dock" aria-label="Tecnologías">

          <!--
            v-for sobre el array de tecnologías que llegó como prop.
            Cada item calcula su propio lerp según distancia al cursor.
            :style pasa el lerp como variable CSS para que el CSS lo use.
          -->
          <div
            v-for="(tech, index) in tecnologias"
            :key="tech.nombre"
            class="dock-item"
            :style="{ '--lerp': getLerp(index) }"
            @mouseenter="activo = index"
          >
            <!-- Ícono de Devicons via clase CSS -->
            <div class="dock-icono">
              <i :class="tech.icono"></i>
            </div>

            <!-- Tooltip con el nombre — aparece al hover -->
            <span class="dock-label">{{ tech.nombre }}</span>
          </div>

        </nav>
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

/* Contenedor del dock — fila flex que se adapta con flex-wrap */
.dock {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 1.25rem;
  background: rgba(26, 16, 37, 0.7);
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

.dock-item:hover .dock-icono {
  background: var(--color-surface);
  border-color: rgba(232, 89, 60, 0.4);
}

/* Ícono de Devicons */
.dock-icono i {
  font-size: calc(1.5rem + var(--lerp, 0) * 0.75rem);
  transition: font-size 0.2s ease;
  line-height: 1;
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
    width:  calc(2.5rem + var(--lerp, 0) * 1.5rem);
    height: calc(2.5rem + var(--lerp, 0) * 1.5rem);
  }
}
</style>