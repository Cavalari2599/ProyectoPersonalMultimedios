<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { useTypewriter } from '../composables/useTypewriter.js'
import { useFizzyParticles } from '../composables/useFizzyParticles.js'
import FizzyButton from './FizzyButton.vue'

const props = defineProps({
  cvRuta: { type: String, default: '' },
})

const { t } = useI18n('about')

// ── Nombre en letras (split text) para entrada escalonada ──────
// Espacios → no-break space para conservar el hueco al animar inline-block.
const nombreLetras = computed(() => [...t.value.nombre].map((c) => (c === ' ' ? ' ' : c)))

// ── Rol con efecto máquina de escribir (respeta reduced-motion) ─
const { output: rolEscrito, escribiendo: rolEscribiendo } = useTypewriter(() => t.value.rol)

// ── Assets ────────────────────────────────────────────────────
// new URL + import.meta.url: Vite resuelve y hashea cada asset en build,
// manteniéndolos dentro de src/assets (sin moverlos a public).
const fotoUrl = new URL('../assets/images/foto-perfil.jpeg', import.meta.url).href
const posterUrl = new URL('../assets/images/poster.jpeg', import.meta.url).href
const audioUrl = new URL('../assets/audio/presentacion.mp3', import.meta.url).href
const videoUrl = new URL('../assets/video/intro.mp4', import.meta.url).href

// ── Reveal al entrar al viewport ──────────────────────────────
const { target: seccionRef, isRevealed } = useScrollReveal({ threshold: 0.1 })

// ── Audio ─────────────────────────────────────────────────────
const audioRef = ref(null)
const reproduciendo = ref(false)

function toggleAudio() {
  const audio = audioRef.value
  if (!audio) return

  if (reproduciendo.value) {
    audio.pause()
    reproduciendo.value = false
    return
  }

  audio
    .play()
    .then(() => {
      reproduciendo.value = true
    })
    .catch((error) => {
      console.error('No se pudo reproducir el audio:', error)
      reproduciendo.value = false
    })
}

// ── Descarga de CV ────────────────────────────────────────────
// Los retrasos coinciden con la animación del botón (la descarga
// dispara cuando el "fizzy" termina, el reset deja el botón listo de nuevo).
const DOWNLOAD_DELAY_MS = 4700
const RESET_DELAY_MS = 5200

const cvCheckbox = ref(null)
const descargando = ref(false)

// @change del checkbox (no @click del label): así también funciona
// activándolo con el teclado (Espacio sobre el input enfocado).
function onCvChange(event) {
  if (!event.target.checked || descargando.value) return
  descargando.value = true

  setTimeout(() => {
    // import.meta.url resuelve el PDF dentro de src/assets/data en dev y build.
    const link = document.createElement('a')
    link.href = new URL(`../assets/data/${props.cvRuta}`, import.meta.url).href
    link.download = props.cvRuta || ''
    link.click()
  }, DOWNLOAD_DELAY_MS)

  setTimeout(() => {
    if (cvCheckbox.value) cvCheckbox.value.checked = false
    descargando.value = false
  }, RESET_DELAY_MS)
}

// ── Partículas del botón CV ───────────────────────────────────
// Mismo enjambre "fizzy" que comparten los demás botones (FizzyButton);
// aquí, además, el CSS las usa para la secuencia de descarga (giro→check).
const { particles, spotStyle } = useFizzyParticles()

// ── Efecto zonas 3x3 sobre la foto ────────────────────────────
const zonaActiva = ref(0)

const desplazamientos = {
  1: 'translate(-12px, -12px)',
  2: 'translate(0,     -12px)',
  3: 'translate( 12px, -12px)',
  4: 'translate(-12px,  0)',
  5: 'translate(0,      0)',
  6: 'translate( 12px,  0)',
  7: 'translate(-12px,  12px)',
  8: 'translate(0,      12px)',
  9: 'translate( 12px,  12px)',
}

const fotoTransform = computed(() =>
  zonaActiva.value ? desplazamientos[zonaActiva.value] : 'translate(0, 0)',
)

function setZona(n) {
  zonaActiva.value = n
}
function resetZona() {
  zonaActiva.value = 0
}
</script>

<template>
  <section id="sobre-mi" class="section" ref="seccionRef">
    <div class="container">

      <div class="about-grid">

        <!-- Columna izquierda: foto -->
        <div class="hero-wrap reveal" :class="{ active: isRevealed }">
          <div class="hero-img">
            <!-- Imagen LCP (above the fold): prioridad alta, nunca lazy. -->
            <img
              class="foto"
              :src="fotoUrl"
              :alt="t.fotoAlt"
              width="256"
              height="320"
              fetchpriority="high"
              decoding="async"
              :style="{ transform: fotoTransform }"
            />
            <div class="zonas">
              <div
                v-for="n in 9"
                :key="n"
                class="zona"
                @mouseenter="setZona(n)"
                @mouseleave="resetZona"
              ></div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: texto + audio + CV -->
        <div class="about-texto">
          <p class="saludo-small">{{ t.saludo }}</p>
          <h1 class="hero-nombre" :aria-label="t.nombre">
            <span
              v-for="(letra, i) in nombreLetras"
              :key="i"
              class="letra"
              aria-hidden="true"
              :style="{ animationDelay: `${i * 0.06}s` }"
            >{{ letra }}</span>
          </h1>
          <p class="rol" :class="{ escribiendo: rolEscribiendo }" aria-live="off">{{ rolEscrito }}</p>
          <p class="bio">{{ t.bio }}</p>

          <!-- Fila de botones -->
          <div class="botones-fila">

            <FizzyButton tag="a" variant="solid" href="#contacto">
              {{ t.contactame }}
              <ion-icon name="arrow-down-outline" aria-hidden="true"></ion-icon>
            </FizzyButton>

            <FizzyButton
              tag="button"
              variant="outline"
              type="button"
              :class="{ 'is-active': reproduciendo }"
              :aria-pressed="reproduciendo"
              @click="toggleAudio"
            >
              <ion-icon :name="reproduciendo ? 'pause' : 'play'" aria-hidden="true"></ion-icon>
              {{ reproduciendo ? t.pausar : t.escuchar }}
            </FizzyButton>

            <div class="cv-wrapper">
              <input ref="cvCheckbox" type="checkbox" id="cv-check" @change="onCvChange" />
              <label for="cv-check">
                <div class="button_inner">
                  <ion-icon name="log-in-outline" class="l"></ion-icon>
                  <span class="t">{{ t.descargarCv }}</span>
                  <span>
                    <ion-icon name="checkmark-outline" class="tick"></ion-icon>
                  </span>
                  <div class="b_l_quad">
                    <div
                      v-for="(p, idx) in particles"
                      :key="idx"
                      class="button_spots"
                      :style="spotStyle(p)"
                    ></div>
                  </div>
                </div>
              </label>
            </div>

          </div>

          <audio
            ref="audioRef"
            :src="audioUrl"
            preload="none"
            @ended="reproduciendo = false"
          ></audio>

        </div>

      </div>

      <!-- Video -->
      <div class="video-wrap">
        <h3 class="video-titulo">{{ t.video }}</h3>
        <div class="video-container">
          <video
            controls
            preload="none"
            playsinline
            class="video-player"
            :poster="posterUrl"
          >
            <source :src="videoUrl" type="video/mp4">
            <p>
              {{ t.videoFallback }}
              <a :href="videoUrl" download>{{ t.videoDescargar }}</a>
            </p>
          </video>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ── Layout principal ── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 5rem;
}

.hero-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.reveal {
  opacity: 0;
  transform: translateY(3.75rem) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-img {
  position: relative;
  width: 16rem;
  height: 20rem;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--color-border),
              0 0 20px rgb(232 89 60 / 0);
  transition: box-shadow 0.4s ease;
}

.hero-img:hover {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--sunset-orange) 60%, transparent),
              0 0 30px color-mix(in srgb, var(--sunset-orange) 30%, transparent),
              0 0 60px color-mix(in srgb, var(--sunset-gold) 15%, transparent);
}

/* Flotación suave en reposo — solo si el usuario no pidió menos movimiento. */
@media (prefers-reduced-motion: no-preference) {
  .hero-img { animation: hero-float 6s ease-in-out infinite; }
}
@keyframes hero-float {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -0.5rem; }
}

.foto {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 1rem;
  /* Desaturada en reposo, a color al pasar el cursor (image hover effect) */
  filter: grayscale(0.85) contrast(1.02);
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1),
              filter 0.5s ease;
  z-index: 1;
}
.hero-img:hover .foto {
  filter: grayscale(0) contrast(1);
}

.zonas {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  z-index: 2;
}
.zona {
  cursor: default;
}

/* ── Texto ── */
.saludo-small {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--sunset-orange);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 0.75rem;
}

/* Nombre: cada letra entra de abajo con retardo escalonado (split text) */
.hero-nombre .letra {
  display: inline-block;
  opacity: 0;
  animation: letra-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes letra-in {
  from { opacity: 0; transform: translateY(0.6em) rotate(6deg); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-nombre .letra { opacity: 1; animation: none; }
}

.rol {
  min-height: 1.5em;
  color: var(--color-muted);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}
/* Cursor parpadeante mientras escribe (máquina de escribir) */
.rol.escribiendo::after {
  content: '';
  display: inline-block;
  width: 0.6ch;
  height: 1.1em;
  margin-left: 0.1em;
  vertical-align: -0.15em;
  background: var(--sunset-orange);
  animation: caret-blink 0.8s steps(1) infinite;
}
@keyframes caret-blink {
  50% { opacity: 0; }
}

.bio {
  white-space: pre-line;
  color: var(--color-muted);
  max-width: 30rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

/* ── Fila de botones ── */
.botones-fila {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

/* Los botones Contáctame y Escuchar usan el componente FizzyButton
   (variantes solid y outline); su contenido (icono play/pause + texto)
   va en el slot. */

/* ── Botón CV Fizzy ── */
.cv-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
/* Oculto visualmente pero enfocable por teclado (no display:none). */
.cv-wrapper input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.cv-wrapper input:focus-visible + label .button_inner {
  outline: 2px solid var(--sunset-gold);
  outline-offset: 3px;
}

.button_inner {
  border-radius: 999px;
  position: relative;
  width: 8.75rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1.5px solid var(--sunset-gold);
  color: var(--sunset-gold);
  font-family: var(--font-body);
  text-align: center;
  /* Propiedades explícitas (no `all`): solo transiciona lo que cambia. */
  transition: color 0.3s, background-color 0.3s, width 0.3s,
              border-radius 0.3s, box-shadow 0.2s, transform 0.2s 0.2s;
  overflow: visible;
}
.button_inner span.t {
  position: relative;
  top: 0;
  opacity: 1;
  left: -0.6rem;
  transition: left 0.4s 0.1s;
}
.button_inner .l {
  position: relative;
  left: -1rem;
  top: 0.1rem;
  color: var(--sunset-orange);
  font-size: 1.1rem;
  opacity: 0;
  transition: left 0.3s 0s, top 0.3s 0s, opacity 0.3s 0s;
}
.button_inner:hover {
  color: #1a0f0a;
  background: var(--sunset-gold);
  box-shadow: 0 17px 18px -14px rgb(0 0 0 / 0.3);
}
.button_inner:hover span.t {
  left: 0.8rem;
  transition: left 0.4s;
}
.button_inner:hover .l {
  top: 0.1rem;
  opacity: 1;
  transition: left 0.3s 0s, top 0.3s 0.1s, opacity 0.3s 0.1s;
}

.tick {
  position: absolute;
  left: 0;
  right: 0;
  transform: scale(0) rotate(-90deg);
  color: var(--sunset-gold);
  margin: auto;
  font-size: 1.1rem;
}

/* Contenedor del enjambre: cubre el botón (inset 0) para que el borde
   elíptico inscrito (50% por eje) coincida con el borde de la píldora. */
.b_l_quad {
  position: absolute;
  inset: 0;
}

/* Partículas: nacen en su punto del borde (cos/sin del ángulo). Mismo
   modelo radial que FizzyButton, para que salgan exactas del borde. */
.button_spots {
  position: absolute;
  left: calc(50% + cos(var(--angle)) * 50%);
  top: calc(50% + sin(var(--angle)) * 50%);
  width: var(--size);
  height: var(--size);
  margin-left: calc(var(--size) / -2);
  margin-top: calc(var(--size) / -2);
  border-radius: 50%;
  opacity: 0;
  background: hsl(var(--h) 95% 62%);
  box-shadow: 0 0 6px hsl(var(--h) 90% 55% / 0.7);
}

/* Hover: emisión radial hacia afuera, en bucle. */
.button_inner:hover .button_spots {
  animation: cv-emit var(--dur) var(--delay) ease-out infinite;
}
@keyframes cv-emit {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.2); }
  25%  { opacity: 1; }
  100% {
    opacity: 0;
    transform: translate(calc(cos(var(--angle)) * var(--dist)),
                         calc(sin(var(--angle)) * var(--dist))) scale(1);
  }
}

/* Estado activado */
input:checked + label .button_inner {
  background: transparent;
  transform: rotate(90deg);
  width: 2.25rem;
  border-radius: 100px;
  box-shadow: 0 0 0 440px rgb(0 0 0 / 0);
  animation: finalbox 0.4s 4.42s cubic-bezier(0.39, 2.01, 0.27, 0.75) forwards;
}
input:checked + label .button_inner span.t {
  opacity: 0;
  top: 1.25rem;
}
/* Centrado dentro del círculo final de 2.25rem: (2.25 - 1.1) / 2 */
input:checked + label .l {
  left: 0.575rem;
  opacity: 1;
  top: 0.15rem;
  animation: bajar 1s 0.25s infinite, final 0.2s 4s forwards;
}
input:checked + label .tick {
  transform: scale(0) rotate(-90deg);
  top: 0;
  animation: tick-anim 0.3s 4.7s forwards;
}
/* Al confirmar la descarga, las partículas explotan radialmente desde el
   borde (sale por su ángulo, más lejos y girando). Sin !important: este
   selector ya gana a .button_spots y al hover. */
input:checked + label .button_spots {
  opacity: 0;
  animation: cv-burst var(--burst-dur) 0.3s ease-out forwards;
}
@keyframes cv-burst {
  0%   { opacity: 1; transform: translate(0, 0) scale(1) rotate(0deg); }
  15%  { opacity: 1; }
  100% {
    opacity: 0;
    transform: translate(calc(cos(var(--angle)) * var(--burst)),
                         calc(sin(var(--angle)) * var(--burst))) scale(0.3) rotate(var(--spin));
  }
}

@keyframes bajar {
  from { transform: translateY(0); }
  to   { transform: translateY(6px); }
}
@keyframes final {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes finalbox {
  to { width: 2.25rem; }
}
@keyframes tick-anim {
  to { transform: scale(1) rotate(-90deg); }
}

/* ── Video ── */
.video-wrap {
  text-align: center;
}

.video-titulo {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: var(--color-muted);
}

.video-container {
  position: relative;
  /* Vídeo vertical (3:4): ancho contenido para que no domine la página. */
  max-width: 22rem;
  margin-inline: auto;
}

.video-player {
  width: 100%;
  /* Reserva el espacio con la proporción real (evita saltos de layout). */
  aspect-ratio: 3 / 4;
  /* contain (no cover): en pantalla completa muestra el vídeo vertical
     entero con barras, en vez de recortar la imagen. En el reproductor
     normal no cambia nada (contenedor y vídeo son 3:4). */
  object-fit: contain;
  border-radius: var(--radius);
  /* Gris oscuro neutro: son las barras laterales del vídeo vertical en
     pantalla completa (object-fit contain las rellena con este color). */
  background: #14151a;
  border: 1px solid var(--color-border);
}

/* Fondo de pantalla completa: gris oscuro neutro (no el morado del tema). */
.video-player::backdrop {
  background: #14151a;
}

/* ── Responsive ── */
@media (width <= 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-img {
    width: 12rem;
    height: 15rem;
    margin-inline: auto;
  }

  .hero-wrap {
    align-items: center;
  }

  .bio {
    margin-inline: auto;
  }

  .botones-fila {
    justify-content: center;
  }
}
</style>
