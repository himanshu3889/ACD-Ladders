import React, {FC, useState} from "react";
import {Checkbox, FormControlLabel} from "@mui/material";

interface IIndicesAnalyticsHeader {
  userHandlesColors: {[key: string]: string};
  showUserHandleDataPoints: {[key: string]: boolean};
  setShowUserHandleDataPoints: React.Dispatch<
    React.SetStateAction<{[key: string]: boolean}>
  >;
  contestUserHandles: string[];
}
export const IndicesAnalyticsHeader: FC<IIndicesAnalyticsHeader> = ({
  userHandlesColors,
  showUserHandleDataPoints,
  setShowUserHandleDataPoints,
  contestUserHandles,
}) => {
  const [showingDataPoints, setShowingDataPoints] = useState<boolean>(true);

  const isAnyHandleDataPointShowing = (userHandleDataPoints: {
    [key: string]: boolean;
  }): boolean => {
    return Object.values(userHandleDataPoints).some((value) => value === true);
  };

  const handleShowUserHandleDataPoint = (userHandle: string) => {
    const prevShow: boolean = showUserHandleDataPoints[userHandle];
    const newShowUserHandleDataPoints = {
      ...showUserHandleDataPoints,
      [userHandle]: !prevShow,
    };
    setShowUserHandleDataPoints(newShowUserHandleDataPoints);
    const newShowingDataPoints = isAnyHandleDataPointShowing(
      newShowUserHandleDataPoints
    );
    setShowingDataPoints(newShowingDataPoints);
  };

  const handleUserDataPointShowCheckbox = () => {
    const prev = showingDataPoints;
    setShowingDataPoints(!prev);
    setShowUserHandleDataPoints((prevState) => {
      const newState = {...prevState};
      Object.keys(newState).forEach((key) => {
        newState[key] = !prev;
      });
      return newState;
    });
  };

  return (
    <div className="flex flex-row items-center ml-2">
      {contestUserHandles.length > 0 && (
        <FormControlLabel
          label={undefined}
          control={<Checkbox onChange={handleUserDataPointShowCheckbox} />}
          checked={showingDataPoints}
        />
      )}
      <div className="flex flex-row items-center space-x-2">
        {Object.entries(showUserHandleDataPoints).map(
          ([userHandle, showPoint], index: number) => (
            <div
              key={index}
              className="flex flex-row items-center cursor-pointer"
              onClick={() => handleShowUserHandleDataPoint(userHandle)}
              style={{opacity: showPoint ? 1 : 0.6}}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: userHandlesColors?.[userHandle],
                }}
              />
              <div
                className="ml-1 text-sm"
                style={{
                  color: showPoint ? userHandlesColors?.[userHandle] : "",
                }}
              >
                {userHandle}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
