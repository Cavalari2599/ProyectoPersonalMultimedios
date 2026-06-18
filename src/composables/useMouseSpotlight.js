import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Sigue el cursor para el efecto spotlight de fondo.
 * El estado se actualiza dentro de requestAnimationFrame para no escribir
 * en cada mousemove (throttle natural a ~1 frame).
 * @returns {{ x: import('vue').Ref<number>, y: import('vue').Ref<number>, visible: import('vue').Ref<boolean> }}
 */
export function useMouseSpotlight() {
  const x = ref(0)
  const y = ref(0)
  const visible = ref(false)

  let pendingX = 0
  let pendingY = 0
  let rafId = null

  function flush() {
    x.value = pendingX
    y.value = pendingY
    visible.value = true
    rafId = null
  }

  function onMove(event) {
    pendingX = event.clientX
    pendingY = event.clientY
    if (rafId === null) rafId = requestAnimationFrame(flush)
  }

  function onLeave() {
    visible.value = false
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return { x, y, visible }
}
