import { LeagueKeyParam } from '../../../Types/LeagueKeyParam';
import { RosterRootObject } from '../../../Types/Roster';
import YahooFantasy from '../YahooFantasyWrapper';

export async function GetRosterForMatchupWeek(
  teamId: string,
  leagueKeyParam: LeagueKeyParam,
  week: number
): Promise<RosterRootObject> {
  const fullTeamKey = `${leagueKeyParam.league_key}.t.${teamId}`;
  const weekString = `${week}`;
  const returnedData = await YahooFantasy.yf.roster.players(
    fullTeamKey,
    weekString
  );
  const roster = <RosterRootObject>returnedData;

  return roster;
}

export async function GetRosterForDay(
  teamId: string,
  leagueKeyParam: LeagueKeyParam,
  day: Date
): Promise<RosterRootObject> {
  const fullTeamKey = `${leagueKeyParam.league_key}.t.${teamId}`;
  const returnedData = await YahooFantasy.yf.roster.players(fullTeamKey, day);
  const roster = <RosterRootObject>returnedData;

  return roster;
}
export default {
  GetRosterForMatchupWeek,
  GetRosterForDay
};
