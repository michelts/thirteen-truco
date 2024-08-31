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
    const scoresMapper: Record<string, [number, number]> = {
      Win: [1, 0],
      Lose: [0, 1],
      Draw: [0, 0],
    };
    const scores = composition.split(" ").map((key) => scoresMapper[key]);
    const points = 1;
    const teamIndexThatRaisedStakes = undefined;
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual([
      scoreA,
      scoreB,
    ]);
  },
);

it.each`
  composition    | scoreA | scoreB
  ${"Win"}       | ${0}   | ${0}
  ${"Lose"}      | ${0}   | ${0}
  ${"Draw"}      | ${0}   | ${0}
  ${"Win Lose"}  | ${0}   | ${0}
  ${"Lose Win"}  | ${0}   | ${0}
  ${"Draw Draw"} | ${0}   | ${0}
`(
  "should return incomplete games as draws ($composition)",
  ({
    composition,
    scoreA,
    scoreB,
  }: {
    composition: string;
    scoreA: number;
    scoreB: number;
  }) => {
    const scoresMapper: Record<string, [number, number]> = {
      Win: [1, 0],
      Lose: [0, 1],
      Draw: [0, 0],
    };
    const scores = composition.split(" ").map((key) => scoresMapper[key]);
    const points = 1;
    const teamIndexThatRaisedStakes = undefined;
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual([
      scoreA,
      scoreB,
    ]);
  },
);

it.each`
  composition         | points | teamIndexThatRaisedStakes | scoreA | scoreB
  ${"Draw Draw"}      | ${3}   | ${0}                      | ${0}   | ${3}
  ${"Draw Draw"}      | ${3}   | ${1}                      | ${3}   | ${0}
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
    const scoresMapper: Record<string, [number, number]> = {
      Win: [1, 0],
      Lose: [0, 1],
      Draw: [0, 0],
    };
    const scores = composition.split(" ").map((key) => scoresMapper[key]);
    expect(getRoundScore(scores, points, teamIndexThatRaisedStakes)).toEqual([
      scoreA,
      scoreB,
    ]);
  },
);
