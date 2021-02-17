import opendota from './';

describe('hero-rates.test.ts', () => {
  it('should get and map /hero-rates from opendota', async () => {
    const heroRates = await opendota.getHeroRates();

    expect(heroRates).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          games: expect.any(Number),
          pickRate: expect.any(Number),
          winRate: expect.any(Number),
        },
      ])
    );
  }, 60000);
});
