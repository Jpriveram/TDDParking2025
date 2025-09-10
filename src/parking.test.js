import  calculateFee  from './parking.js';

describe('parking fee', () => {
  it('debería devolver 10 cuando la entrada es 10:00 y la salida 11:00', () => {
    const entrada = new Date('2000-01-01T10:00:00');
    const salida  = new Date('2000-01-01T11:00:00');

    const result = calculateFee(entrada, salida);

    expect(result.total).toBe(10);
  });
});
