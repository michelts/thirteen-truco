import { expect, it } from "vitest";
import { getRoundScore } from "../getRoundScore";

it.each`
  composition         | scoreA | scoreB
  ${"Win Win"}        | ${1}   | ${0}
  ${"Win Lose Win"}   | ${1}   | ${0}
  ${"Win Draw"}       | ${1}   | ${0}
  ${"Win Lose Draw"}  | ${1}   | ${0}
  ${"Lose Win Win"}   | ${1}   | ${0}
  ${"Draw Win"}       | ${1}   | ${0}
  ${"Draw Draw Win"}  | ${1}   | ${0}
  ${"Lose Lose"}      | ${0}   | ${1}
  ${"Lose Win Lose"}  | ${0}   | ${1}
  ${"Lose Draw"}      | ${0}   | ${1}
  ${"Lose Win Draw"}  | ${0}   | ${1}
  ${"Win Lose Lose"}  | ${0}   | ${1}
  ${"Draw Lose"}      | ${0}   | ${1}
  ${"Draw Draw Lose"} | ${0}   | ${1}
  ${"Draw Draw Draw"} | ${0}   | ${0}
`(
  "should indicate who won for $composition",
  ({
    composition,
    scoreA,
    scoreB,
  }: {
    composition: string;
    scoreA: number;
    scoreB: number;
  }) => {
    const scores = getScoresFromComposition(composition);
    const points = 1;
    const teamIndexThatRaisedStakes = undefined;
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual([
      scoreA,
      scoreB,
    ]);
  },
);

it.each`
  composition
  ${"Win"}
  ${"Lose"}
  ${"Draw"}
  ${"Win Lose"}
  ${"Lose Win"}
  ${"Draw Draw"}
`(
  "should return incomplete games as undefined ($composition)",
  ({ composition }: { composition: string }) => {
    const scores = getScoresFromComposition(composition);
    const points = 1;
    const teamIndexThatRaisedStakes = undefined;
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual(
      undefined,
    );
  },
);

it("should return incomplete game that doesn't have any round done as undefined", () => {
  const points = 1;
  const teamIndexThatRaisedStakes = undefined;
  expect(getRoundScore([], points, teamIndexThatRaisedStakes)).toEqual(
    undefined,
  );
});

it("should return incomplete game that doesn't have any round but raised stakes start as undefined", () => {
  const points = 3;
  const teamIndexThatRaisedStakes = 1;
  expect(getRoundScore([], points, teamIndexThatRaisedStakes)).toEqual(
    undefined,
  );
});

it.each`
  composition         | points | teamIndexThatRaisedStakes | scoreA | scoreB
  ${"Draw Draw Draw"} | ${6}   | ${0}                      | ${0}   | ${6}
  ${"Draw Draw Draw"} | ${6}   | ${1}                      | ${6}   | ${0}
`(
  "should make the team raising the most points to lose the last draw $composition ($pointsPerTeam)",
  ({
    composition,
    points,
    teamIndexThatRaisedStakes,
    scoreA,
    scoreB,
  }: {
    composition: string;
    points: number;
    teamIndexThatRaisedStakes: 0 | 1;
    scoreA: number;
    scoreB: number;
  }) => {
    const scores = getScoresFromComposition(composition);
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual([
      scoreA,
      scoreB,
    ]);
  },
);

it.each`
  composition
  ${"Win"}
  ${"Lose"}
  ${"Draw"}
  ${"Win Lose"}
  ${"Lose Win"}
  ${"Draw Draw"}
`(
  "should not consider the team raising stakes the loser for partial scores ($composition)",
  ({ composition }: { composition: string }) => {
    const scores = getScoresFromComposition(composition);
    const points = 3;
    const teamIndexThatRaisedStakes = 1;
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual(
      undefined,
    );
  },
);

function getScoresFromComposition(composition: string) {
  // Transforms string with win/lose/draw into a list of tuples
  const scoresMapper: Record<string, [number, number]> = {
    Win: [1, 0],
    Lose: [0, 1],
    Draw: [0, 0],
  };
  return composition.split(" ").map((key) => scoresMapper[key]);
}
