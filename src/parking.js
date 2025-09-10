function calculateFee(entrada, salida) {
  const ms = salida - entrada;
  const horas = ms / (1000 * 60 * 60);
  const horasCobradas = Math.ceil(horas);
  const total = horasCobradas * 10;
  return { total };
}
export  {calculateFee};