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

  it('debería devolver 12 cuando cruza medianoche: 23:30 → 00:30', () => {
  const entrada = new Date('2000-01-01T23:30:00');
  const salida  = new Date('2000-01-02T00:30:00');

  const result = calculateFee(entrada, salida);

  expect(result.total).toBe(12);
  });

  it('debería aplicar tope de 50 en un mismo día (10:00 → 20:30)', () => {
  const entrada = new Date('2000-01-01T10:00:00');
  const salida  = new Date('2000-01-01T20:30:00');

  const result = calculateFee(entrada, salida);

  expect(result.total).toBe(50);
  });

  it('debería incluir breakdown por día cuando cruza medianoche', () => {
  const entrada = new Date('2000-01-01T10:00:00');
  const salida  = new Date('2000-01-02T01:00:00');

  const result = calculateFee(entrada, salida);

  expect(result.breakdown).toEqual([
    { date: '2000-01-01', subtotal: 132, capApplied: 50, final: 50 },
    { date: '2000-01-02', subtotal: 6,   capApplied: 0,  final: 6  },
  ]);
  });

it('debería devolver 80 cuando se marca ticket perdido (ignora horas)', () => {
  const entrada = new Date('2000-01-01T10:00:00');
  const salida  = new Date('2000-01-01T22:00:00');

  const result = calculateFee(entrada, salida, { lostTicket: true });

  expect(result.total).toBe(80);
  });

  it('debería devolver 256 cuando la estadía abarca varios días con topes diarios', () => {
  const entrada = new Date('2025-10-09T10:00:00');
  const salida  = new Date('2025-10-14T01:00:00');

  const result = calculateFee(entrada, salida);

  expect(result.total).toBe(256);
  });



});
