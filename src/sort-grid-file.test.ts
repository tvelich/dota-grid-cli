import { GridConfigFile, SortBy, sortGridFile } from './sort-grid-file';

const categoryFillerData = {
  x_position: 0,
  y_position: 0,
  width: 0,
  height: 0,
};

const gridConfig: GridConfigFile = {
  version: 3,
  configs: [
    {
      config_name: 'Config Name',
      categories: [
        {
          category_name: 'Category 1 Name',
          hero_ids: [1, 2, 3],
          ...categoryFillerData,
        },
        {
          category_name: 'Category 2 Name',
          hero_ids: [4, 5, 6],
          ...categoryFillerData,
        },
      ],
    },
  ],
};

const heroScores: Parameters<typeof sortGridFile>[0]['heroScores'] = [
  { heroId: 1, pickRateScore: 1, winRateScore: 12 },
  { heroId: 2, pickRateScore: 2, winRateScore: 10 },
  { heroId: 3, pickRateScore: 3, winRateScore: 8 },
  { heroId: 4, pickRateScore: 4, winRateScore: 6 },
  { heroId: 5, pickRateScore: 5, winRateScore: 4 },
  { heroId: 6, pickRateScore: 6, winRateScore: 2 },
];

describe('sort-grid-file.test.ts', () => {
  it('should sort grid config entry by win rate', async () => {
    const sortedConfigFile = sortGridFile({
      gridConfig,
      heroScores,
      sortBy: SortBy.WIN_RATE,
    });

    expect(sortedConfigFile).toEqual({
      version: 3,
      configs: [
        {
          config_name: 'Config Name',
          categories: [
            expect.objectContaining({
              category_name: 'Category 1 Name',
              hero_ids: [1, 2, 3],
            }),
            expect.objectContaining({
              category_name: 'Category 2 Name',
              hero_ids: [4, 5, 6],
            }),
          ],
        },
      ],
    });
  });

  it('should sort grid config entry by pick rate', async () => {
    const sortedConfigFile = sortGridFile({
      gridConfig,
      heroScores,
      sortBy: SortBy.PICK_RATE,
    });

    expect(sortedConfigFile).toEqual({
      version: 3,
      configs: [
        {
          config_name: 'Config Name',
          categories: [
            expect.objectContaining({
              category_name: 'Category 1 Name',
              hero_ids: [3, 2, 1],
            }),
            expect.objectContaining({
              category_name: 'Category 2 Name',
              hero_ids: [6, 5, 4],
            }),
          ],
        },
      ],
    });
  });

  it('should sort grid config entry by mixed rates', async () => {
    const sortedConfigFile = sortGridFile({
      gridConfig,
      heroScores,
      sortBy: SortBy.MIXED,
    });

    expect(sortedConfigFile).toEqual({
      version: 3,
      configs: [
        {
          config_name: 'Config Name',
          categories: [
            expect.objectContaining({
              category_name: 'Category 1 Name',
              hero_ids: [1, 2, 3],
            }),
            expect.objectContaining({
              category_name: 'Category 2 Name',
              hero_ids: [4, 5, 6],
            }),
          ],
        },
      ],
    });
  });
});
