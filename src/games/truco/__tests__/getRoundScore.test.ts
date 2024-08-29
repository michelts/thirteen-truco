import { it, expect } from "vitest";
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
    console.log(composition);
    const scoresMapper: Record<string, [number, number]> = {
      Win: [1, 0],
      Lose: [0, 1],
      Draw: [0, 0],
    };
    const scores = composition.split(" ").map((key) => scoresMapper[key]);
    const roundPointsPerTeam: [number, number] = [1, 1];
    expect(getRoundScore(scores, roundPointsPerTeam)).toEqual([scoreA, scoreB]);
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
    console.log(composition);
    const scores = composition.split(" ").map((key) => scoresMapper[key]);
    const roundPointsPerTeam: [number, number] = [1, 1];
    expect(getRoundScore(scores, roundPointsPerTeam)).toEqual([scoreA, scoreB]);
  },
);

it.each`
  composition         | pointsPerTeam | scoreA | scoreB
  ${"Draw Draw"}      | ${[3, 1]}     | ${0}   | ${1}
  ${"Draw Draw"}      | ${[3, 6]}     | ${1}   | ${0}
  ${"Draw Draw Draw"} | ${[3, 1]}     | ${0}   | ${1}
  ${"Draw Draw Draw"} | ${[3, 6]}     | ${1}   | ${0}
`(
  "should make the team raising the most points to lose the last draw $composition ($pointsPerTeam)",
  ({
    composition,
    scoreA,
    scoreB,
    pointsPerTeam,
  }: {
    composition: string;
    scoreA: number;
    scoreB: number;
    pointsPerTeam: [number, number];
  }) => {
    console.log(composition);
    const scoresMapper: Record<string, [number, number]> = {
      Win: [1, 0],
      Lose: [0, 1],
      Draw: [0, 0],
    };
    const scores = composition.split(" ").map((key) => scoresMapper[key]);
    expect(getRoundScore(scores, pointsPerTeam)).toEqual([scoreA, scoreB]);
  },
);
