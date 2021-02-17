import { promises as fs } from 'fs';
import { sep } from 'path';

import configFile from '../../sample-config-files/default.json';
import { mockOpenDota } from '../../test/mocks/open-dota';
import { SortBy } from '../sort-grid-file';
import processDefaultCommand from './default';

describe('default.test.ts', () => {
  let copyFileSpy: jest.SpyInstance;
  let writeFileSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  mockOpenDota();

  beforeEach(() => {
    (fs.readFile as jest.Mock) = jest
      .fn()
      .mockImplementation(async () => JSON.stringify(configFile));
    copyFileSpy = jest.spyOn(fs, 'copyFile').mockImplementation();
    writeFileSpy = jest.spyOn(fs, 'writeFile').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should output sorted file', async () => {
    await processDefaultCommand('/tmp/dota-grid-config.json', {
      sortBy: SortBy.MIXED,
      writeSortedFile: false,
    });

    expect(() => JSON.parse(consoleLogSpy.mock.calls[0])).not.toThrow();
  });

  it('should write sorted file', async () => {
    await processDefaultCommand('/tmp/dota-grid-config.json', {
      sortBy: SortBy.MIXED,
      writeSortedFile: true,
    });

    expect(copyFileSpy).toBeCalledWith(
      `${sep}tmp${sep}dota-grid-config.json`,
      `${sep}tmp${sep}dota-grid-config_backup.json`
    );

    expect(JSON.parse(writeFileSpy.mock.calls[0][1])).toEqual(
      expect.objectContaining({
        version: expect.any(Number),
        configs: expect.arrayContaining([
          expect.objectContaining({
            config_name: expect.any(String),
          }),
        ]),
      })
    );

    expect(writeFileSpy).toBeCalledWith(
      `${sep}tmp${sep}dota-grid-config.json`,
      expect.any(String)
    );
  });
});
