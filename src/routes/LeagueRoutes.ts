import express from 'express';
import LeagueController from '../controllers/LeagueController';

const leagueRouter = express.Router();

function LeagueRoutes(req, res, yf): any {
  const controller = new LeagueController();

  leagueRouter.route('/getLeagues').get(controller.getLeagues(req, res, yf));

  return leagueRouter;
}

export default LeagueRoutes;
