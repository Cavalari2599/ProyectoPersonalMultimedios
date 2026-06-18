// Enjambre de partículas "fizzy" de los botones. Modelo radial: cada
// partícula se ancla a un ángulo del perímetro del botón y emana hacia
// afuera por ese mismo ángulo. El CSS sitúa el punto con cos()/sin() en
// porcentajes, así que se ajusta solo al borde sea cual sea el tamaño del
// botón (no depende de coordenadas en píxeles como el diseño SCSS original).
const SPOT_COUNT = 52
const rand = (min, max) => min + Math.random() * (max - min)

function crearParticulas() {
  return Array.from({ length: SPOT_COUNT }, (_, i) => {
    // Reparto uniforme alrededor del contorno + pequeño jitter (naturalidad).
    const angle = (i / SPOT_COUNT) * 360 + rand(-7, 7)
    return {
      angle, // grados: punto del borde y dirección de salida
      dist: rand(7, 18), // px que sale en hover
      burst: rand(45, 95), // px de la explosión (descarga del CV)
      size: rand(2, 5), // px de diámetro
      hue: Math.round(rand(20, 52)), // ámbar → naranja
      delay: rand(0, 0.7), // s, escalona la emisión en hover
      dur: rand(0.7, 1.2), // s, duración de cada emisión
      burstDur: rand(0.8, 1.3), // s de la explosión
      spin: Math.round(rand(120, 540)), // grados de giro en la explosión
    }
  })
}

// Traduce una partícula a las variables CSS que consume su elemento.
function spotStyle(p) {
  return {
    '--angle': `${p.angle.toFixed(2)}deg`,
    '--dist': `${p.dist.toFixed(1)}px`,
    '--burst': `${p.burst.toFixed(1)}px`,
    '--size': `${p.size.toFixed(1)}px`,
    '--h': p.hue,
    '--delay': `${p.delay.toFixed(2)}s`,
    '--dur': `${p.dur.toFixed(2)}s`,
    '--burst-dur': `${p.burstDur.toFixed(2)}s`,
    '--spin': `${p.spin}deg`,
  }
}

/**
 * Enjambre de partículas "fizzy" para un botón.
 * Cada llamada produce su propio set (ángulos y tiempos independientes).
 * @returns {{ particles: object[], spotStyle: (p: object) => Record<string, string> }}
 */
export function useFizzyParticles() {
  return { particles: crearParticulas(), spotStyle }
}
