// Combination of values per round-step that matches the game rules
const pointsPerStep = [7, 5, 3];

export function getRoundScore(
  stepsScores: [number, number][],
  points: number,
  teamIndexThatRaisedStakes?: 0 | 1,
): [number, number] {
  if (stepsScores.length === 1) {
    return [0, 0];
  }

  const [totalA, totalB] = getTotals(stepsScores);
  const isPartialWin =
    stepsScores.length === 2 && Math.abs(totalA - totalB) === 2;
  if (isPartialWin) {
    return [0, 0];
  }

  if ((totalA || totalB) && totalA >= totalB) {
    return [points, 0];
  }
  if (totalA || totalB) {
    return [0, points];
  }
  // the team that raised stakes must untie a draw!
  if (teamIndexThatRaisedStakes === 0) {
    return [0, points];
  }
  if (teamIndexThatRaisedStakes === 1) {
    return [points, 0];
  }
  return [0, 0];
}

function getTotals(stepsScores: [number, number][]) {
  let totalA = 0;
  let totalB = 0;
  stepsScores.forEach(([stepA, stepB], index) => {
    totalA += stepA * pointsPerStep[index];
    totalB += stepB * pointsPerStep[index];
  });
  return [totalA, totalB];
}
