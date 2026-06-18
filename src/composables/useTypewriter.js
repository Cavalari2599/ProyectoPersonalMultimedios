import { ref, onMounted, onUnmounted, watch } from 'vue'
import { prefiereMenosMovimiento } from '../utils/motion.js'

/**
 * Efecto máquina de escribir sobre un texto reactivo.
 * Si el usuario pide menos movimiento, muestra el texto completo al instante.
 * @param {() => string} getText Getter del texto a escribir (reactivo).
 * @param {{ speed?: number, startDelay?: number }} [opts] ms por carácter y retardo inicial.
 * @returns {{ output: import('vue').Ref<string>, escribiendo: import('vue').Ref<boolean> }}
 */
export function useTypewriter(getText, { speed = 55, startDelay = 300 } = {}) {
  const output = ref('')
  const escribiendo = ref(false)
  let timer = null

  function run() {
    clearTimeout(timer)
    const texto = getText() || ''

    if (prefiereMenosMovimiento()) {
      output.value = texto
      escribiendo.value = false
      return
    }

    output.value = ''
    escribiendo.value = true
    let i = 0
    const tick = () => {
      output.value = texto.slice(0, i)
      if (i++ < texto.length) {
        timer = setTimeout(tick, speed)
      } else {
        escribiendo.value = false
      }
    }
    timer = setTimeout(tick, startDelay)
  }

  onMounted(run)
  watch(getText, run)
  onUnmounted(() => clearTimeout(timer))

  return { output, escribiendo }
}
