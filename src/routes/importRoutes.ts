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

export default ImportRouter;
