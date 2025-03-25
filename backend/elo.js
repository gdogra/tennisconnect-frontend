function calculateElo(winnerRating, loserRating, k = 32) {
  const expectedWin = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const newWinnerRating = Math.round(winnerRating + k * (1 - expectedWin));
  const newLoserRating = Math.round(loserRating + k * (0 - (1 - expectedWin)));
  return { newWinnerRating, newLoserRating };
}

module.exports = { calculateElo };

