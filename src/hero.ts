import opendota from './open-dota';
import { OpenDotaHeroRateResponseRow } from './open-dota/hero-rates';

export interface HeroScore {
  pickRateScore: number;
  winRateScore: number;
}

export type HeroStats = Pick<
  OpenDotaHeroRateResponseRow,
  'games' | 'pickRate' | 'winRate'
> &
  HeroScore;

export interface Hero {
  id: number;
  name: string;
  localizedName: string;
  primaryAttribute: string;
  attackType: string;
  roles: string[];
  stats: HeroStats;
}

function getSortedHeroScores(
  heroRates: OpenDotaHeroRateResponseRow[]
): Map<number, HeroScore> {
  const heroSortedByPickRates = [
    ...heroRates.sort(
      (heroRateA, heroRateB) => heroRateB.pickRate - heroRateA.pickRate
    ),
  ];

  const heroPickRateScores = heroSortedByPickRates.reduce(
    (acc: { [id: number]: number }, heroRate, index: number) => {
      acc[heroRate.id] = heroSortedByPickRates.length - index;

      return acc;
    },
    {}
  );

  const heroWinRatesSorted = [
    ...heroRates.sort(
      (heroRateA, heroRateB) => heroRateB.winRate - heroRateA.winRate
    ),
  ];

  const heroWinRateScores = heroWinRatesSorted.reduce(
    (acc: { [id: number]: number }, heroRate, index: number) => {
      acc[heroRate.id] = heroWinRatesSorted.length - index;

      return acc;
    },
    {}
  );

  return heroRates.reduce(
    (acc: Map<number, HeroScore>, { id }) =>
      acc.set(id, {
        pickRateScore: heroPickRateScores[id],
        winRateScore: heroWinRateScores[id],
      }),
    new Map()
  );
}

export async function getHeroes(): Promise<Hero[]> {
  const [heroes, heroRates] = await Promise.all([
    opendota.getHeroes(),
    opendota.getHeroRates(),
  ]);

  const heroScoresById = getSortedHeroScores(heroRates);

  const heroRatesById = heroRates.reduce(
    (acc: Map<number, typeof heroRate>, heroRate) =>
      acc.set(heroRate.id, heroRate),
    new Map()
  );

  return heroes.map<Hero>((hero) => {
    const heroRateData = heroRatesById.get(hero.id);
    const heroScores = heroScoresById.get(hero.id);

    if (!heroRateData || !heroScores) {
      throw new Error('Missing required hero data from opendota api');
    }

    return {
      ...hero,
      stats: {
        games: heroRateData.games,
        pickRate: heroRateData.pickRate,
        winRate: heroRateData.winRate,
        ...heroScores,
      },
    };
  });
}
