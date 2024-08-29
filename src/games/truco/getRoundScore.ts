const pointsPerStep = [7, 5, 3];

export function getRoundScore(
  stepsScores: [number, number][],
  roundPointsPerTeam: [number, number],
) {
  if (stepsScores.length === 1) {
    return [0, 0];
  }

  const [totalA, totalB] = getTotals(stepsScores);
  const isPartialWin =
    stepsScores.length === 2 && Math.abs(totalA - totalB) === 2;
  if (isPartialWin) {
    return [0, 0];
  }

  const [roundPointsA, roundPointsB] = roundPointsPerTeam;
  if ((totalA || totalB) && totalA >= totalB) {
    return [1, 0];
  }
  if (totalA || totalB) {
    return [0, 1];
  }
  if (roundPointsA > roundPointsB) {
    return [0, 1];
  }
  if (roundPointsB > roundPointsA) {
    return [1, 0];
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
