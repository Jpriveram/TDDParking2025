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

function calculateSameDayFee(start, end) {
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const sixAM = new Date(start);
  sixAM.setHours(6, 0, 0, 0);

  const tenPM = new Date(start);
  tenPM.setHours(22, 0, 0, 0);

  let total = 0;

  if (end <= sixAM) {
    const h = diffInHours(start, end);
    return Math.ceil(h) * NIGHT_RATE;
  }

  if (start >= sixAM && end <= tenPM) {
    const h = diffInHours(start, end);
    return Math.ceil(h) * DAY_RATE;
  }

  if (start >= tenPM) {
    const h = diffInHours(start, end);
    return Math.ceil(h) * NIGHT_RATE;
  }

  if (start < sixAM && end > sixAM && end <= tenPM) {
    const hNoche = diffInHours(start, sixAM);
    total += Math.ceil(hNoche) * NIGHT_RATE;

    const hDia = diffInHours(sixAM, end);
    total += Math.ceil(hDia) * DAY_RATE;

    return total;
  }

  // Si cruza 22:00 (día → noche dentro del mismo día)
  if (start >= sixAM && start < tenPM && end > tenPM) {
    const hDia = diffInHours(start, tenPM);
    total += Math.ceil(hDia) * DAY_RATE;

    const hNoche = diffInHours(tenPM, end);
    total += Math.ceil(hNoche) * NIGHT_RATE;

    return total;
  }

  if (start < sixAM && end > tenPM) {
    const hNoche1 = diffInHours(start, sixAM);
    total += Math.ceil(hNoche1) * NIGHT_RATE;

    const hDia = diffInHours(sixAM, tenPM);
    total += Math.ceil(hDia) * DAY_RATE;

    const hNoche2 = diffInHours(tenPM, end);
    total += Math.ceil(hNoche2) * NIGHT_RATE;

    return total;
  }

  const h = diffInHours(start, end);
  return Math.ceil(h) * DAY_RATE;
}

function calculateFee(entrada, salida) {
  let total = 0;

  const sameDay =
    entrada.getFullYear() === salida.getFullYear() &&
    entrada.getMonth() === salida.getMonth() &&
    entrada.getDate() === salida.getDate();

  if (sameDay) {
    total = calculateSameDayFee(entrada, salida);
    return { total };
  }

  let cursor = new Date(entrada);
  while (cursor < salida) {
    const endOfDay = new Date(cursor);
    endOfDay.setHours(23, 59, 59, 999);

    const segmentEnd = (salida <= endOfDay) ? salida : endOfDay;

    total += calculateSameDayFee(cursor, segmentEnd);

    const nextDay = new Date(cursor);
    nextDay.setDate(cursor.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    cursor = nextDay;
  }

  return { total };
}

function formatBs(amount) {
  const n = Number(amount);
  return `Bs ${n.toFixed(2)}`;
}

export { calculateFee, formatBs };
