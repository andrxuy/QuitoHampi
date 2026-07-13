export const validarTelefono = (telefono) => {
  if (!telefono) return false
  const regex = /^(?:\+?593|0)9[3-9]\d{7}$/
  return regex.test(telefono)
}
