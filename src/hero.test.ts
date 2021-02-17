import { mockOpenDota } from '../test/mocks/open-dota';
import { getHeroes, Hero } from './hero';

describe('hero.test.ts', () => {
  mockOpenDota();

  it('should get heroes', async () => {
    const heroes = await getHeroes();

    expect(heroes[0]).toEqual<Hero>({
      id: expect.any(Number),
      attackType: expect.any(String),
      localizedName: expect.any(String),
      name: expect.any(String),
      primaryAttribute: expect.any(String),
      roles: expect.arrayContaining([expect.any(String)]),
      stats: {
        games: expect.any(Number),
        pickRate: expect.any(Number),
        winRate: expect.any(Number),
        pickRateScore: expect.any(Number),
        winRateScore: expect.any(Number),
      },
    });
  });
});
