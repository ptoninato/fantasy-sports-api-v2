export async function getUserGames(yahooApi: any): Promise<string> {
  const returnedData = await yahooApi.user.games();
  const codes = await returnedData.games.reduce(
    (data: any[], game: { code: string }) => {
      if (game.code === 'mlb' || game.code === 'nfl') {
        data.push(game);
      }
      return data;
    },
    []
  );

  return codes;
}
