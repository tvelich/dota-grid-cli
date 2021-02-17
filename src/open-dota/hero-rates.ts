import fetchRetry from '../fetch-retry';

export interface OpenDotaHeroRateResponseRowRaw {
  hero_id: number;
  games: number;
  pickrate: number;
  winrate: number;
}

export interface OpenDotaHeroRateResponseRow {
  id: number;
  games: number;
  pickRate: number;
  winRate: number;
}

function mapHeroRate(
  heroRate: OpenDotaHeroRateResponseRowRaw
): OpenDotaHeroRateResponseRow {
  return {
    id: heroRate.hero_id,
    games: heroRate.games,
    pickRate: heroRate.pickrate,
    winRate: heroRate.winrate,
  };
}

export default async function getHeroRates(): Promise<
  OpenDotaHeroRateResponseRow[]
> {
  const response = await fetchRetry(
    `https://api.opendota.com/api/explorer?sql=${encodeURIComponent(
      `
        select hero_id, 
        count(distinct match_id) games, 
        count(distinct match_id)::float/sum(count(1)) OVER() * 10 pickrate,
        sum(case when radiant_win = (player_slot < 128) then 1 else 0 end)::float/count(1) winrate
        FROM public_matches
        JOIN public_player_matches using(match_id)
        JOIN heroes on public_player_matches.hero_id = heroes.id
        WHERE start_time >= extract(epoch from now() - interval '7 day')::int
        AND floor(avg_rank_tier / 10) >= 7
        AND floor(avg_rank_tier / 10)  <= 8
        GROUP BY hero_id
        ORDER BY games desc
        LIMIT 500
      `
    )}`,
    { retries: 10 }
  );

  const heroRatesResponse: {
    rows: OpenDotaHeroRateResponseRowRaw[];
  } = await response.json();

  return heroRatesResponse.rows.map<OpenDotaHeroRateResponseRow>(mapHeroRate);
}
