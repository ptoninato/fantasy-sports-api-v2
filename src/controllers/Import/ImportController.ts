import { Request, Response } from 'express';
import leagueImporter from '../../services/Importers/leagueImporter';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const result = await leagueImporter
    .importLeague(league_key)
    .catch((error) => {
      console.log(error);
    });

  console.log(result);

  return res.json();
}
