import { ref, onMounted } from 'vue'

// new URL + import.meta.url deja que Vite resuelva y hashee el asset en build,
// manteniendo el JSON dentro de src/assets (sin moverlo a public).
const DATA_URL = new URL('../assets/data/portfolio.json', import.meta.url).href

/**
 * Carga los datos del portafolio una vez al montar.
 * Devuelve refs reactivos que se rellenan al resolver el fetch.
 */
export function usePortfolioData() {
  const proyectos = ref([])
  const tecnologias = ref([])
  const contacto = ref({})
  const cvRuta = ref('')
  const error = ref(null)
  const cargando = ref(true)

  async function load() {
    try {
      const response = await fetch(DATA_URL)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      proyectos.value = data.proyectos ?? []
      tecnologias.value = data.tecnologias ?? []
      contacto.value = data.contacto ?? {}
      cvRuta.value = data.cv ?? ''
    } catch (e) {
      error.value = e
      console.error('Error cargando portfolio.json:', e)
    } finally {
      cargando.value = false
    }
  }

  onMounted(load)

  return { proyectos, tecnologias, contacto, cvRuta, error, cargando }
}
