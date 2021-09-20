import { SeasonModel } from '../../Models/SeasonModel';
import { MatchupTeamModel } from '../../Models/MatchupTeamModel';

import { Matchup } from '../../Types/Matchup';
import { Team, MatchupGrade } from '../../Types/Scoreboard';
import matchupGradeTypeDao from '../DataAccess/matchupGradeTypeDao';
import fantasyTeamDao from '../DataAccess/fantasyTeamDao';
import { MatchupModel } from '../../Models/MatchupModel';
import matchupTeamDao from '../../services/DataAccess/matchupTeamDao';

async function ImportMatchupTeam(
  team: Team,
  matchupFromYahoo: Matchup,
  season: SeasonModel,
  matchupModel: MatchupModel
): Promise<MatchupTeamModel> {
  let matchupGradeTypeModel;

  if (matchupFromYahoo.matchup_grades != null) {
    const matchupGrade = matchupFromYahoo.matchup_grades.filter(
      (value) => value.team_key == team.team_key
    )[0] as MatchupGrade;

    matchupGradeTypeModel = await matchupGradeTypeDao.GetOrImportMatchupGradeType(
      matchupGrade.grade
    );
  }

  const fantasyTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
    season.seasonid,
    <number>(<unknown>team.team_id)
  );

  const matchupTeam = {} as MatchupTeamModel;

  matchupTeam.fantasyteamid = fantasyTeam.fantasyteamid;
  matchupTeam.matchupid = matchupModel.matchupid;
  matchupTeam.pointsfor = <number>(<unknown>team.points.total);

  const projectedPoints =
    team.projected_points != null
      ? <number>(<unknown>team.projected_points?.total)
      : null;

  matchupTeam.projectedpoitsfor = projectedPoints;

  matchupTeam.matchupgradetypeid =
    matchupGradeTypeModel?.matchupgradetypeid ?? null;
  const matchupTeamDb = await matchupTeamDao.GetOrImportMatchupTeam(
    matchupTeam
  );

  return matchupTeamDb;
}

async function ImportMatchupTeamTies(
  matchupModel: MatchupModel,
  matchupFromYahoo: Matchup
): Promise<void> {
  const tiedScores = matchupFromYahoo.stat_winners?.filter(
    (value) => value.stat_winner.is_tied === 1
  );
  if (tiedScores != null && tiedScores.length > 0) {
    const newTiedMatchup = {} as MatchupTeamModel;
    newTiedMatchup.matchupid = matchupModel.matchupid;
    newTiedMatchup.tiedpoints = tiedScores.length;
    const tiedMatchup = await matchupTeamDao.GetOrImportMatchupTiedScores(
      newTiedMatchup
    );

    console.log(tiedMatchup);
  }
}

export default {
  ImportMatchupTeam,
  ImportMatchupTeamTies
};
