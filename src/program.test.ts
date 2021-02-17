import { mockOpenDota } from '../test/mocks/open-dota';
import * as defaultCommand from './commands/default';
import runProgram from './program';

describe('program.test.ts', () => {
  let defaultCommandSpy: jest.SpyInstance;

  mockOpenDota();

  beforeEach(() => {
    defaultCommandSpy = jest
      .spyOn(defaultCommand, 'default')
      .mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should parse and pass sort by to command', async () => {
    await runProgram(['--sortBy', 'mixed', '/tmp/tmp']);

    expect(defaultCommandSpy).toBeCalledWith('/tmp/tmp', {
      writeSortedFile: false,
      sortBy: 'MIXED',
    });
  });

  it('should error with invalid sort type', () =>
    expect(
      runProgram(['--sortBy', 'doesnotexist', '/tmp/tmp'])
    ).rejects.toThrowError('Invalid sort by option'));

  it('should parse and pass write file to command', async () => {
    await runProgram(['--sortBy', 'mixed', '--writeSortedFile', '/tmp/tmp']);

    expect(defaultCommandSpy).toBeCalledWith('/tmp/tmp', {
      writeSortedFile: true,
      sortBy: 'MIXED',
    });
  });
});
