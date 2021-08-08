import { Router, Request, Response } from 'express';
import * as LeagueController from '../controllers/LeagueController';

const leagueRouter = Router();

leagueRouter.get('/getLeagues', (req: Request, res: Response, yf: any): any => {
  console.log('here');

  LeagueController.getLeagues(req, res);
});

leagueRouter.get('/test', (req: Request, res: Response, yf: any): any => {
  console.log('here');

  LeagueController.getGameCodeTypes(req, res);
});

export default leagueRouter;
