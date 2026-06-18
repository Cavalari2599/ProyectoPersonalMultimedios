<script setup>
import { watch } from 'vue'

// Cielo decorativo de fondo. Cada estrella lleva su posición, tamaño,
// tono y tiempos en variables CSS calculadas aquí (mismo patrón que las
// partículas del botón CV): pocas @keyframes sirven para todas.
//
// Noche: estrellas cálidas que titilan; ~30% destella de golpe y las
// grandes llevan cruz de difracción. Día: las mismas se convierten en
// motas de polvo dorado que derivan lentamente, como polvo al sol.
// Además, las estrellas cercanas al cursor se avivan (reacción al ratón).
const STAR_COUNT = 80
const PROBABILIDAD_DESTELLO = 0.3
const RADIO_CURSOR = 130 // px: distancia a la que el cursor aviva una estrella

const props = defineProps({
  cursorX: { type: Number, default: 0 },
  cursorY: { type: Number, default: 0 },
  cursorActive: { type: Boolean, default: false },
})

const aleatorio = (min, max) => min + Math.random() * (max - min)

// Tamaños 1-3px: mayoría pequeñas, pocas grandes (con halo y cruz).
function tamanoAleatorio() {
  const azar = Math.random()
  if (azar < 0.15) return 3
  return azar < 0.5 ? 2 : 1
}

const estrellas = Array.from({ length: STAR_COUNT }, () => ({
  x: aleatorio(0, 100),
  y: aleatorio(0, 100),
  size: tamanoAleatorio(),
  hue: aleatorio(36, 52),
  dur: aleatorio(2.5, 7),
  delay: aleatorio(0, 8),
  base: aleatorio(0.4, 1),
  destella: Math.random() < PROBABILIDAD_DESTELLO,
}))

function estiloEstrella(estrella) {
  return {
    '--x': `${estrella.x}%`,
    '--y': `${estrella.y}%`,
    '--size': `${estrella.size}px`,
    '--h': estrella.hue.toFixed(0),
    '--dur': `${estrella.dur.toFixed(2)}s`,
    '--delay': `${estrella.delay.toFixed(2)}s`,
    '--base': estrella.base.toFixed(2),
  }
}

// ── Reacción al cursor ────────────────────────────────────────
// Nodos DOM de cada estrella (escritura directa de --glow: evita que
// la reactividad de Vue recorra 80 elementos en cada frame de ratón).
const nodos = []
function registrar(el, i) {
  if (el) nodos[i] = el
}

// Índices avivados en el frame anterior, para apagar solo esos.
let encendidas = new Set()

function apagar(indice) {
  nodos[indice]?.style.setProperty('--glow', '0')
}

function reaccionarAlCursor() {
  // Cursor fuera de la ventana: apaga lo que quedara encendido.
  if (!props.cursorActive) {
    encendidas.forEach(apagar)
    encendidas.clear()
    return
  }

  const anchoVentana = window.innerWidth
  const altoVentana = window.innerHeight
  const siguientes = new Set()

  for (let i = 0; i < estrellas.length; i++) {
    const estrella = estrellas[i]
    const dx = props.cursorX - (estrella.x / 100) * anchoVentana
    const dy = props.cursorY - (estrella.y / 100) * altoVentana
    const distancia = Math.hypot(dx, dy)

    if (distancia < RADIO_CURSOR) {
      const glow = 1 - distancia / RADIO_CURSOR
      nodos[i]?.style.setProperty('--glow', glow.toFixed(3))
      siguientes.add(i)
    }
  }

  // Apaga las que salieron del radio desde el frame anterior.
  encendidas.forEach((i) => {
    if (!siguientes.has(i)) apagar(i)
  })
  encendidas = siguientes
}

// El cursor ya viene throttleado a 1 frame por useMouseSpotlight (rAF),
// así que basta reaccionar cuando cambian sus coordenadas o presencia.
watch(() => [props.cursorX, props.cursorY, props.cursorActive], reaccionarAlCursor)
</script>

<template>
  <div class="cielo" aria-hidden="true">
    <span
      v-for="(estrella, i) in estrellas"
      :key="i"
      :ref="(el) => registrar(el, i)"
      class="estrella"
      :class="{ destello: estrella.destella, grande: estrella.size === 3 }"
      :style="estiloEstrella(estrella)"
    ></span>
    <span class="fugaz"></span>
  </div>
</template>

<style scoped>
.cielo {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* Cada estrella tiene su propio tono cálido (--h entre dorado y ámbar).
   Noche: punto luminoso casi blanco con halo. Día: mota de polvo dorado.
   --glow (0..1) lo escribe el JS según la cercanía del cursor: aviva el
   brillo (filter), agranda (scale, propiedad independiente que se compone
   con el transform del titileo) y expande el halo. */
.estrella {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: light-dark(
    hsl(var(--h) 65% 38% / 0.55),
    hsl(var(--h) 90% 90% / 0.95)
  );
  box-shadow: 0 0 calc(var(--size) * 3 + var(--glow, 0) * 14px) light-dark(
    hsl(var(--h) 75% 45% / calc(0.3 + var(--glow, 0) * 0.5)),
    hsl(var(--h) 90% 70% / calc(0.45 + var(--glow, 0) * 0.45))
  );
  opacity: var(--base);
  scale: calc(1 + var(--glow, 0) * 1.5);
  filter: brightness(calc(1 + var(--glow, 0) * 2));
  transition: scale 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
}

/* Cruz de difracción en las estrellas grandes (destello en 4 puntas);
   pulsa junto a la estrella porque la opacidad del padre la arrastra. */
.estrella.grande::before,
.estrella.grande::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: calc(var(--size) * 6);
  background: linear-gradient(
    transparent,
    light-dark(hsl(var(--h) 65% 45% / 0.5), hsl(var(--h) 90% 85% / 0.8)),
    transparent
  );
  transform: translate(-50%, -50%);
}
.estrella.grande::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

/* ── Animación nocturna: titileo con encogimiento; las marcadas con
   .destello permanecen estables y lanzan un fogonazo breve. ── */
@media (prefers-reduced-motion: no-preference) {
  .estrella {
    animation: titilar var(--dur) ease-in-out var(--delay) infinite;
  }
  .estrella.destello {
    animation: destellar calc(var(--dur) * 2) ease-in-out var(--delay) infinite;
  }

  /* ── Día: deriva lenta hacia arriba, como polvo en un rayo de sol.
     Va después de las reglas nocturnas para ganar a .destello. ── */
  [data-theme='day'] .estrella {
    animation: flotar calc(var(--dur) * 3) ease-in-out var(--delay) infinite alternate;
  }
}

@keyframes titilar {
  0%, 100% { opacity: var(--base); transform: scale(1); }
  50%      { opacity: calc(var(--base) * 0.2); transform: scale(0.7); }
}

@keyframes destellar {
  0%, 90%, 100% { opacity: calc(var(--base) * 0.7); transform: scale(1); }
  95%           { opacity: 1; transform: scale(1.8); }
}

@keyframes flotar {
  from { transform: translate(0, 0) scale(1.2); opacity: calc(var(--base) * 0.5); }
  to   { transform: translate(0.4rem, -1.25rem) scale(1.4); opacity: var(--base); }
}

/* De día las motas no llevan cruz de difracción (son polvo, no astros). */
[data-theme='day'] .estrella::before,
[data-theme='day'] .estrella::after {
  display: none;
}

/* Estrella fugaz: cruza una vez por ciclo y descansa el resto.
   Solo tiene sentido de noche; de día se oculta. */
.fugaz {
  position: absolute;
  top: 12%;
  left: -8%;
  width: 7rem;
  height: 1px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--sunset-gold), #fff);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .fugaz {
    animation: cruzar 11s linear 4s infinite;
  }
}

@keyframes cruzar {
  0%        { transform: translate(0, 0) rotate(17deg); opacity: 0; }
  2%        { opacity: 0.9; }
  9%, 100%  { transform: translate(65vw, 20vw) rotate(17deg); opacity: 0; }
}

[data-theme='day'] .fugaz {
  display: none;
}
</style>
