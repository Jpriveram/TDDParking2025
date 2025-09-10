import { calculateFee, formatBs } from './parking.js';

const entradaEl   = document.querySelector('#entrada');
const salidaEl    = document.querySelector('#salida');
const calcular    = document.querySelector('#calcular');
const limpiar     = document.querySelector('#limpiar');
const resultEl    = document.querySelector('#resultado');
const desgloseEl  = document.querySelector('#desglose');
const errorEl     = document.querySelector('#error');

function renderBreakdown(list, grandTotal) {
  if (!desgloseEl) return;
  if (!Array.isArray(list) || list.length === 0) {
    desgloseEl.innerHTML = '';
    return;
  }
  const rows = list.map(({ date, subtotal, capApplied, final }) => `
    <tr>
      <td>${date}</td>
      <td>${formatBs(subtotal)}</td>
      <td>${formatBs(capApplied)}</td>
      <td>${formatBs(final)}</td>
    </tr>
  `).join('');
  desgloseEl.innerHTML = `
    <h2>Desglose por día</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr><th>Fecha</th><th>Subtotal</th><th>Tope aplicado</th><th>Final</th></tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><th colspan="3" style="text-align:right;">Total</th><th>${formatBs(grandTotal)}</th></tr>
      </tfoot>
    </table>
  `;
}

calcular?.addEventListener('click', (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  try {
    const entrada = new Date(entradaEl.value);
    const salida  = new Date(salidaEl.value);

    const { total, breakdown } = calculateFee(entrada, salida);
    resultEl.textContent = formatBs(total);

    const computedTotal = Array.isArray(breakdown)
      ? breakdown.reduce((acc, d) => acc + (d.final || 0), 0)
      : total;

    renderBreakdown(breakdown, computedTotal);
  } catch (err) {
    // Mostrar error y limpiar resultado/desglose
    errorEl.textContent = err?.message ?? 'Datos inválidos';
    resultEl.textContent = '';
    if (desgloseEl) desgloseEl.innerHTML = '';
  }
});

limpiar?.addEventListener('click', (e) => {
  e.preventDefault();
  entradaEl.value = '';
  salidaEl.value  = '';
  resultEl.textContent = '';
  if (desgloseEl) desgloseEl.innerHTML = '';
  if (errorEl) errorEl.textContent = '';
});
