import pool from '../../database/db';
import { FantasyTeamModel } from '../../Models/FantasyTeamModel';
import { LeagueModel } from '../../Models/LeagueModel';
import { OwnerModel } from '../../Models/Owner';
import { SeasonModel } from '../../Models/SeasonModel';
import { Team } from '../../Types/Team';

const GetTeamBySeasonAndTeamId = async (
  league: LeagueModel,
  owner: OwnerModel,
  season: SeasonModel,
  team: Team
): Promise<FantasyTeamModel> => {
  try {
    const query = `select * from fantasyteam where leagueid = ${league.leagueid} and seasonid = ${season.seasonid} and ownerid = ${owner.ownerid} and yahooteamid = ${team.team_id} limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const team = result.rows[0] as FantasyTeamModel;
      return team;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportFantasyTeam = async (
  owner: OwnerModel,
  league: LeagueModel,
  season: SeasonModel,
  yahooTeam: Team
): Promise<FantasyTeamModel> => {
  try {
    console.log(season);

    let fantasyTeamModel = await GetTeamBySeasonAndTeamId(
      league,
      owner,
      season,
      yahooTeam
    );

    if (fantasyTeamModel == null) {
      fantasyTeamModel = await InsertFantasyTeam(
        league,
        owner,
        season,
        yahooTeam
      );
    }

    return fantasyTeamModel;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const InsertFantasyTeam = async (
  league: LeagueModel,
  owner: OwnerModel,
  season: SeasonModel,
  team: Team
): Promise<FantasyTeamModel> => {
  try {
    const teamName = team.name.replace(/'/g, "''");

    const query = `INSERT INTO public.fantasyteam
(leagueid, seasonid, ownerid, yahooteamid, teamname, teamurl, teamlogo, moves, trades)
VALUES(${league.leagueid}, ${season.seasonid}, ${owner.ownerid}, ${team.team_id}, '${teamName}', '${team.url}', '${team.team_logo}', ${team.number_of_moves}, ${team.number_of_trades}) RETURNING *`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const team = result.rows[0] as FantasyTeamModel;

      console.log(team);
      return team;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default {
  GetTeamBySeasonAndTeamId,
  GetOrImportFantasyTeam,
  InsertFantasyTeam
};
