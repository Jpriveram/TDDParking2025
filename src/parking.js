const DAY_RATE = 10;
const NIGHT_RATE = 6;

function isNight(date) {
  const h = date.getHours();
  return h >= 22 || h < 6;
}

function diffInHours(start, end) {
  const ms = end - start;
  return ms / (1000 * 60 * 60);
}

function calculateFee(entrada, salida) {
  let total = 0;

  // Caso: todo diurno
  if (!isNight(entrada) && !isNight(salida)) {
    const horas = diffInHours(entrada, salida);
    total = Math.ceil(horas) * DAY_RATE;
    return { total };
  }

  // Caso: todo nocturno
  if (isNight(entrada) && isNight(salida)) {
    const horas = diffInHours(entrada, salida);
    total = Math.ceil(horas) * NIGHT_RATE;
    return { total };
  }

  if (!isNight(entrada) && isNight(salida)) {
    const diurnoFin = new Date(entrada);
    diurnoFin.setHours(22, 0, 0, 0);

    const horasDia = diffInHours(entrada, diurnoFin);
    total += Math.ceil(horasDia) * DAY_RATE;

    const horasNoche = diffInHours(diurnoFin, salida);
    total += Math.ceil(horasNoche) * NIGHT_RATE;

    return { total };
  }

  return { total: 0 };
}

function formatBs(amount) {
  const n = Number(amount);
  return `Bs ${n.toFixed(2)}`;
}

export { calculateFee, formatBs };
