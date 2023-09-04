import { Router, Request, Response } from 'express';
import * as ImportController from '../controllers/Import/ImportController';

const ImportRouter = Router();

ImportRouter.get(
  '/importLeague',
  (req: Request, res: Response, yf: any): any => {
    ImportController.ImportLeague(req, res);
    return res.json();
  }
);

ImportRouter.get(
  '/importSeason',
  (req: Request, res: Response, yf: any): any => {
    ImportController.ImportSeason(req, res);
    return res.json();
  }
);

ImportRouter.get(
  '/importtransactions',
  (req: Request, res: Response): Response => {
    ImportController.ImportTransactions(req, res);
    return res.json();
  }
);

ImportRouter.get(
  '/importrosterpositions',
  (req: Request, res: Response): Response => {
    ImportController.ImportRosterPositions(req, res);
    return res.json();
  }
);

ImportRouter.get(
  '/importstatcategories',
  (req: Request, res: Response): Response => {
    ImportController.ImportStatCategories(req, res);
    return res.json();
  }
);

ImportRouter.get(
  '/importstatcategorymodifiers',
  (req: Request, res: Response): Response => {
    ImportController.ImportStatCategoryModifiers(req, res);
    return res.json();
  }
);

ImportRouter.get(
  '/importmatchups',
  async (req: Request, res: Response): Promise<Response> => {
    try {
      await ImportController.ImportMatchups(req, res);
      return res.json();
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }
);

ImportRouter.get(
  '/importmatchuprosterplayerstats',
  async (req: Request, res: Response): Promise<Response> => {
    try {
      await ImportController.ImportMatchupRosterPlayerStatsAll(req, res);
      return res.json();
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }
);

ImportRouter.get(
  '/importmatchuprosterplayerstatsbyweek',
  async (req: Request, res: Response): Promise<Response> => {
    try {
      await ImportController.ImportMatchupRosterPlayerStatsByWeek(req, res);
      return res.json();
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }
);

ImportRouter.get(
  '/ImportDailyMatchupRosterPlayerStatsForYear',
  async (req: Request, res: Response): Promise<Response> => {
    try {
      await ImportController.ImportDailyMatchupRosterPlayerStatsForYear(
        req,
        res
      );
      return res.json();
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }
);

export default ImportRouter;
