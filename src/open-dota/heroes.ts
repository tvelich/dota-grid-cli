import fetchRetry from '../fetch-retry';

export interface OpenDotaHeroResponseRowRaw {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
}

export interface OpenDotaHeroResponseRow {
  id: number;
  name: string;
  localizedName: string;
  primaryAttribute: string;
  attackType: string;
  roles: string[];
}

function mapHero(hero: OpenDotaHeroResponseRowRaw): OpenDotaHeroResponseRow {
  return {
    id: hero.id,
    attackType: hero.attack_type,
    localizedName: hero.localized_name,
    name: hero.name,
    primaryAttribute: hero.primary_attr,
    roles: hero.roles,
  };
}

export default async function getHeroes(): Promise<OpenDotaHeroResponseRow[]> {
  const response = await fetchRetry('https://api.opendota.com/api/heroes', {
    retries: 10,
  });

  const heroesResponse: OpenDotaHeroResponseRowRaw[] = await response.json();

  return heroesResponse.map<OpenDotaHeroResponseRow>(mapHero);
}
