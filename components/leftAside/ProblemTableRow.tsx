import React, {FC} from "react";
import Link from "next/link";
import {StatusOptions} from "../../features/filters/filterConstants";
import {IProblem, IProblemStatistics} from "../../types";
import {PLATFORMS} from "../../configs/constants";

const getProblemDifficultyColorStyle = (rating: number): string => {
  return rating == 0
    ? "text-gray-500"
    : rating < 1200
    ? "text-gray-600"
    : rating < 1400
    ? "text-green-600"
    : rating < 1600
    ? "text-cyan-600"
    : rating < 1900
    ? "text-blue-600"
    : rating < 2100
    ? "text-fuchsia-600"
    : rating < 2400
    ? "text-orange-600"
    : "text-red-600";
};

const getProblemRowColorStyle = ({
  problemStatus,
  tableProblemNumber,
}: {
  problemStatus: string;
  tableProblemNumber: number;
}): string => {
  return problemStatus === StatusOptions.Attempted
    ? `${
        tableProblemNumber % 2 === 1 ? "bg-red-200" : "bg-red-300"
      } hover:bg-red-400`
    : problemStatus === StatusOptions.Solved
    ? `${
        tableProblemNumber % 2 === 1 ? "bg-green-200" : "bg-green-300"
      } hover:bg-green-400`
    : `${
        tableProblemNumber % 2 === 1 ? "bg-gray-200" : "bg-gray-300"
      } hover:bg-gray-400`;
};

interface IProblemTableRow {
  problem: IProblem;
  problemStatistics: IProblemStatistics;
  tableProblemNumber: number;
  platform: PLATFORMS;
  problemStatus: StatusOptions | "";
  sameProblemOtherContestId: number;
  sameProblemOtherContestIndex: string;
}

const ProblemTableRow: FC<IProblemTableRow> = ({
  problem,
  problemStatistics,
  tableProblemNumber,
  platform,
  problemStatus,
  sameProblemOtherContestId,
  sameProblemOtherContestIndex,
}) => {
  const contestID: number = problem?.contestId || 0;
  const problemIndex: string = problem?.index;
  const problemName: string = problem?.name;
  const problemSolvedCount: number = problemStatistics?.solvedCount || 0;
  const problemScore: number = problem?.frequency || 0;
  const problemDifficulty: number = problem?.rating || 0;

  const rowColorStyle = getProblemRowColorStyle({
    problemStatus: problemStatus,
    tableProblemNumber: tableProblemNumber,
  });

  return (
    <tr
      className={`border-1.5 border-gray-400 hover:border-2 hover:border-gray-500 hover:text-gray-800 hover:font-bold
      ${rowColorStyle}`}
      key={tableProblemNumber}
    >
      <td className="lg:py-0.5 py-1 px-2 text-left">
        <div className="flex items-center">
          <span className="">{tableProblemNumber}</span>
        </div>
      </td>
      <td className="lg:py-0.5 py-1 px-2 text-left">
        <div className="flex items-center justify-between text-blue-600 hover:text-blue-800">
          <Link
            href={`https://codeforces.com/contest/${contestID}/problem/${problemIndex}`}
            legacyBehavior
          >
            <a target="_blank">
              {contestID}
              <span className="font-bold italic">{problemIndex}</span>
            </a>
          </Link>
          {problemStatus !== "Unsolved" && sameProblemOtherContestId !== -1 && (
            <Link
              href={`https://codeforces.com/contest/${sameProblemOtherContestId}/problem/${sameProblemOtherContestIndex}`}
              legacyBehavior
            >
              <a target="_blank">
                <i
                  className="mr-6 ml-2 fa-solid fa-circle-exclamation text-sm text-yellow-500 hover:text-yellow-600"
                  title={`Tried in ${sameProblemOtherContestId}${sameProblemOtherContestIndex}`}
                />
              </a>
            </Link>
          )}
        </div>
      </td>

      <td className="lg:py-0.5 py-1 px-2  text-left">
        <div className="flex flex-wrap">
          <span>{problemName}</span>
        </div>
      </td>

      <td className="lg:py-0.5 py-1 px-2 text-left">
        <div className="flex items-center">
          <span>
            {platform === PLATFORMS.ACD ? problemScore : problemSolvedCount}
          </span>
        </div>
      </td>
      <td className="lg:py-0.5 py-1 px-2 text-left">
        <div className="flex items-center">
          <span
            className={`font-bold ${getProblemDifficultyColorStyle(
              problemDifficulty
            )}`}
          >
            {problemDifficulty}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default ProblemTableRow;
