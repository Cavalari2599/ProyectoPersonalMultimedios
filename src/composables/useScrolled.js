import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Indica si la página se ha desplazado más allá de un centinela colocado
 * al inicio del documento. Usa IntersectionObserver (sin listeners de
 * scroll en el hilo principal); la barra de progreso de lectura es CSS
 * puro con animation-timeline: scroll().
 * @returns {{ sentinel: import('vue').Ref, scrolled: import('vue').Ref<boolean> }}
 */
export function useScrolled() {
  const sentinel = ref(null)
  const scrolled = ref(false)
  let observer = null

  onMounted(() => {
    if (!sentinel.value) return
    observer = new IntersectionObserver(([entry]) => {
      scrolled.value = !entry.isIntersecting
    })
    observer.observe(sentinel.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { sentinel, scrolled }
}
