import  {calculateFee,formatBs}  from './parking.js';

describe('parking fee', () => {
  it('debería devolver 10 cuando la entrada es 10:00 y la salida 11:00', () => {
    const entrada = new Date('2000-01-01T10:00:00');
    const salida  = new Date('2000-01-01T11:00:00');

    const result = calculateFee(entrada, salida);

    expect(result.total).toBe(10);
  });
  it('debería devolver 6 cuando la entrada es 22:00 y la salida 23:00', () => {
    const entrada = new Date('2000-01-01T22:00:00');
    const salida  = new Date('2000-01-01T23:00:00');

    const result = calculateFee(entrada, salida); 

    expect(result.total).toBe(6);
  });

  it('debería formatear 10 como "Bs 10.00"', () => {
  const texto = formatBs(10);
  expect(texto).toBe('Bs 10.00');
  });

  it('debería devolver 16 cuando combina 21:30 → 22:30 (1h diurna + 1h nocturna)', () => {
  const entrada = new Date('2000-01-01T21:30:00'); // 0.5h diurna
  const salida  = new Date('2000-01-01T22:30:00'); // 0.5h nocturna
  const result = calculateFee(entrada, salida);
  expect(result.total).toBe(16);
  });


 

});
