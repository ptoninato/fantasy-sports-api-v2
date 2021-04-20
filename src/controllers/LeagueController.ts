import gameKeyService from '../services/api/gameKeyService';
import yahooUser from '../services/api/YahooApi/userApiService';

function LeagueController(): void {
  async function GetLeagues(
    req: Express.Request,
    res: Express.Response,
    yf: any
  ): Promise<Express.Response> {
    const game_keys = await gameKeyService.getGameKeysForUser(yf);
    const userLeagues = await yahooUser.getUserGameLeaguesByGameKeys(
      yf,
      game_keys
    );

    return res;
  }
}

export default new LeagueController();
