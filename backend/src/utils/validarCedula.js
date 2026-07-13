export const validarCedula = (cedula) => {
  if (!cedula || cedula.length !== 10 || !/^\d{10}$/.test(cedula)) {
    return false
  }

  const provincia = parseInt(cedula.substring(0, 2), 10)
  if (provincia < 1 || provincia > 24) {
    return false
  }

  const digitos = cedula.split('').map(Number)
  const verificador = digitos.pop()

  let suma = 0
  for (let i = 0; i < digitos.length; i++) {
    let valor = digitos[i]
    if (i % 2 === 0) {
      valor *= 2
      if (valor > 9) valor -= 9
    }
    suma += valor
  }

  const residuo = suma % 10
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo

  return digitoCalculado === verificador
}
