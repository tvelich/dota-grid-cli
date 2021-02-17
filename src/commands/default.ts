import { promises as fs } from 'fs';
import { homedir } from 'os';
import path from 'path';

import { getHeroes } from '../hero';
import { SortBy, sortGridFile } from '../sort-grid-file';

export default async function processDefaultCommand(
  configFilePath: string,
  {
    writeSortedFile,
    sortBy,
  }: {
    writeSortedFile: boolean;
    sortBy: SortBy;
  }
): Promise<void> {
  const heroes = await getHeroes();

  const pathToConfig = path.join(
    configFilePath.startsWith('~')
      ? configFilePath.replace('~', homedir())
      : configFilePath
  );

  const file = await fs.readFile(pathToConfig, 'utf8');

  const gridConfig = JSON.parse(file);

  const sortedConfig = sortGridFile({
    gridConfig,
    heroScores: heroes.map((hero) => ({
      heroId: hero.id,
      pickRateScore: hero.stats.pickRate,
      winRateScore: hero.stats.pickRate,
    })),
    sortBy,
  });

  const { dir, name, ext } = path.parse(pathToConfig);

  if (writeSortedFile) {
    await fs.copyFile(pathToConfig, path.join(dir, `${name}_backup${ext}`));
    await fs.writeFile(pathToConfig, JSON.stringify(sortedConfig));
  } else {
    console.log(JSON.stringify(sortedConfig));
  }
}
