import { calculateFee, formatBs } from './parking.js';

const entradaEl = document.querySelector('#entrada');
const salidaEl  = document.querySelector('#salida');
const calcular  = document.querySelector('#calcular');
const limpiar   = document.querySelector('#limpiar');
const resultEl  = document.querySelector('#resultado');

calcular?.addEventListener('click', (e) => {
  e.preventDefault();

  const entrada = new Date(entradaEl.value);
  const salida  = new Date(salidaEl.value);

  const { total } = calculateFee(entrada, salida);
  resultEl.textContent = formatBs(total); // ← usa el formato del slice
});

limpiar?.addEventListener('click', (e) => {
  e.preventDefault();
  entradaEl.value = '';
  salidaEl.value  = '';
  resultEl.textContent = '';
});
