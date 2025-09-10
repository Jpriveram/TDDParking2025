const DAY_RATE = 10;
const NIGHT_RATE = 6;

function isNight(date) {
  const h = date.getHours();
  return h >= 22 || h < 6;
}

export function calculateFee(entrada, salida) {
  const ms = salida - entrada;
  const horas = ms / (1000 * 60 * 60);
  const horasCobradas = Math.ceil(horas);

  const sameNight = isNight(entrada) && isNight(salida);
  const rate = sameNight ? NIGHT_RATE : DAY_RATE;

  return { total: horasCobradas * rate };
}

export default calculateFee;
