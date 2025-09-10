const DAY_RATE = 10;
const NIGHT_RATE = 6;
const DAILY_CAP = 50;

function diffInHours(start, end) {
  const ms = end - start;
  return ms / (1000 * 60 * 60);
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function calculateSameDaySubtotal(start, end) {
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

function calculateFee(entrada, salida, options = {}) {
  const { lostTicket = false } = options;

  if (salida < entrada) {
    throw new Error('La hora de salida no puede ser anterior a la de entrada');
  }

  if (lostTicket) {
    return { total: 80, breakdown: [] };
  }

  let total = 0;
  const breakdown = [];

  const sameDay =
    entrada.getFullYear() === salida.getFullYear() &&
    entrada.getMonth() === salida.getMonth() &&
    entrada.getDate() === salida.getDate();

  if (sameDay) {
    const dateKey = formatDate(entrada);
    const subtotal = calculateSameDaySubtotal(entrada, salida);
    const final = Math.min(subtotal, DAILY_CAP);
    const capApplied = subtotal > DAILY_CAP ? DAILY_CAP : 0;

    breakdown.push({ date: dateKey, subtotal, capApplied, final });
    total = final;
    return { total, breakdown };
  }

  let cursor = new Date(entrada);
  while (cursor < salida) {
    const endOfDay = new Date(cursor);
    endOfDay.setHours(23, 59, 59, 999);

    const segmentEnd = salida <= endOfDay ? salida : endOfDay;

    const subtotal = calculateSameDaySubtotal(cursor, segmentEnd);
    const final = Math.min(subtotal, DAILY_CAP);
    const capApplied = subtotal > DAILY_CAP ? DAILY_CAP : 0;

    breakdown.push({
      date: formatDate(cursor),
      subtotal,
      capApplied,
      final,
    });

    total += final;

    const nextDay = new Date(cursor);
    nextDay.setDate(cursor.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    cursor = nextDay;
  }

  return { total, breakdown };
}

function formatBs(amount) {
  const n = Number(amount);
  return `Bs ${n.toFixed(2)}`;
}

export { calculateFee, formatBs };
