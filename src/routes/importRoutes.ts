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

export default ImportRouter;
