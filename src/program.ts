import commander, { Command } from 'commander';

import { version } from '../package.json';
import processDefaultCommand from './commands/default';
import { SortBy } from './sort-grid-file';

export default function runProgram(
  args?: string[]
): Promise<commander.Command> {
  const program = new Command();

  program.version(version);
  program.name('dota-grid-cli');

  program.arguments('<grid-config-file-path>');

  program.option(
    '-w, --writeSortedFile',
    'Overwrite the file specified with the sorted result',
    false
  );
  program.option(
    '-s, --sortBy <method>',
    'The method used to sort each grid group (mixed, win-rate, or pick-rate)',
    'mixed'
  );

  program.action(
    async (
      configFilePath: string,
      options: { writeSortedFile: boolean; sortBy: string }
    ) => {
      let sortBy: SortBy;

      switch (options.sortBy) {
        case 'mixed':
          sortBy = SortBy.MIXED;
          break;
        case 'win-rate':
          sortBy = SortBy.WIN_RATE;
          break;
        case 'pick-rate':
          sortBy = SortBy.PICK_RATE;
          break;
        default:
          throw new Error('Invalid sort by option');
      }

      try {
        await processDefaultCommand(configFilePath, {
          writeSortedFile: options.writeSortedFile,
          sortBy,
        });
      } catch (err) {
        console.error(err.message);
      }
    }
  );

  return program.parseAsync(args ? ['', '', ...args] : process.argv);
}
