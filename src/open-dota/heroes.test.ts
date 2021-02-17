import opendota from './';

describe('heroes.test.ts', () => {
  it('should get and map /heroes from opendota', async () => {
    const heroes = await opendota.getHeroes();

    expect(heroes).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          attackType: expect.any(String),
          localizedName: expect.any(String),
          name: expect.any(String),
          primaryAttribute: expect.any(String),
          roles: expect.arrayContaining([expect.any(String)]),
        },
      ])
    );
  }, 60000);
});
