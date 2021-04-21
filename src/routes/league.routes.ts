import { Router, Request, Response } from 'express';
import * as LeagueController from '../controllers/LeagueController';

const leagueRouter = Router();

leagueRouter.get('/getLeagues', (req: Request, res: Response, yf: any): any => {
  LeagueController.getLeagues(req, res);
});

export default leagueRouter;
