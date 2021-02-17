interface Category {
  category_name: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  hero_ids: number[];
}

interface ConfigEntry {
  config_name: string;
  categories: Category[];
}

export interface GridConfigFile {
  version: number;
  configs: ConfigEntry[];
}

export enum SortBy {
  WIN_RATE = 'WIN_RATE',
  PICK_RATE = 'PICK_RATE',
  MIXED = 'MIXED',
}

export function sortGridFile({
  gridConfig,
  heroScores,
  sortBy,
}: {
  gridConfig: GridConfigFile;
  heroScores: { heroId: number; pickRateScore: number; winRateScore: number }[];
  sortBy: SortBy;
}): GridConfigFile {
  let heroScoresSorted: typeof heroScores;

  switch (sortBy) {
    case SortBy.MIXED:
      heroScoresSorted = heroScores.sort(
        (heroA, heroB) =>
          heroB.pickRateScore +
          heroB.winRateScore -
          (heroA.pickRateScore + heroA.winRateScore)
      );
      break;
    case SortBy.PICK_RATE:
      heroScoresSorted = heroScores.sort(
        (heroA, heroB) => heroB.pickRateScore - heroA.pickRateScore
      );
      break;
    case SortBy.WIN_RATE:
    default:
      heroScoresSorted = heroScores.sort(
        (heroA, heroB) => heroB.winRateScore - heroA.winRateScore
      );
  }

  return {
    ...gridConfig,
    configs: [
      ...gridConfig.configs.map((config) => ({
        ...config,
        categories: config.categories.map((category) => {
          const heroIdsById = category.hero_ids.reduce(
            (acc: { [key: number]: number }, id) => {
              acc[id] = id;
              return acc;
            },
            {}
          );

          return {
            ...category,
            hero_ids: heroScoresSorted.reduce((acc: number[], heroScore) => {
              if (heroIdsById[heroScore.heroId]) {
                acc.push(heroScore.heroId);
              }

              return acc;
            }, []),
          };
        }),
      })),
    ],
  };
}
