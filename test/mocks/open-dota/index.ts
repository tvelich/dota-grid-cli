import opendota from '../../../src/open-dota';
import heroRatesResponse from './hero-rates.json';
import heroesResponse from './heroes.json';

export function mockOpenDota(): void {
  (opendota.getHeroes as jest.Mock) = jest
    .fn()
    .mockResolvedValue(heroesResponse);
  (opendota.getHeroRates as jest.Mock) = jest
    .fn()
    .mockResolvedValue(heroRatesResponse);
}
