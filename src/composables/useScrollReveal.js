import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Revela un elemento la primera vez que entra al viewport.
 * Usa IntersectionObserver (sin listeners de scroll en el hilo principal).
 * @param {{ threshold?: number, rootMargin?: string }} [options]
 * @returns {{ target: import('vue').Ref, isRevealed: import('vue').Ref<boolean> }}
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px' } = {}) {
  const target = ref(null)
  const isRevealed = ref(false)
  let observer = null

  onMounted(() => {
    if (!target.value) return

    // Si el elemento ya está visible al montar, revelar directamente
    // (no dependemos del primer callback del observer, que en algunos
    // entornos no se dispara para elementos ya en pantalla).
    const rect = target.value.getBoundingClientRect()
    const yaVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (yaVisible) {
      isRevealed.value = true
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isRevealed.value = true
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(target.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { target, isRevealed }
}
