import { calculateFee, formatBs } from './parking.js';

const entradaEl = document.querySelector('#entrada');
const salidaEl  = document.querySelector('#salida');
const calcular  = document.querySelector('#calcular');
const limpiar   = document.querySelector('#limpiar');
const resultEl  = document.querySelector('#resultado');
const desgloseEl = document.querySelector('#desglose');

function renderBreakdown(list) {
  if (!desgloseEl) return;

  if (!Array.isArray(list) || list.length === 0) {
    desgloseEl.innerHTML = '';
    return;
  }

  // Tabla simple
  const rows = list.map(item => {
    const { date, subtotal, capApplied, final } = item;
    return `
      <tr>
        <td>${date}</td>
        <td>${formatBs(subtotal)}</td>
        <td>${formatBs(capApplied)}</td>
        <td>${formatBs(final)}</td>
      </tr>
    `;
  }).join('');

  desgloseEl.innerHTML = `
    <h2>Desglose por día</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Subtotal</th>
          <th>Tope aplicado</th>
          <th>Final</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

calcular?.addEventListener('click', (e) => {
  e.preventDefault();

  const entrada = new Date(entradaEl.value);
  const salida  = new Date(salidaEl.value);

  const { total, breakdown } = calculateFee(entrada, salida);
  resultEl.textContent = formatBs(total);
  renderBreakdown(breakdown);
});

limpiar?.addEventListener('click', (e) => {
  e.preventDefault();
  entradaEl.value = '';
  salidaEl.value  = '';
  resultEl.textContent = '';
  if (desgloseEl) desgloseEl.innerHTML = '';
});
