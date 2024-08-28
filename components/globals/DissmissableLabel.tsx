import React from "react";
import clsx from "clsx";
import {IoIosCloseCircle} from "react-icons/io";

interface IDissmissableLabelProps {
  text: string;
  onRemove: () => void;
  className?: string;
}

const DismissableLabel: React.FC<IDissmissableLabelProps> = ({
  text,
  onRemove,
  className = "bg-gray-300",
}) => {
  return (
    <div
      className={clsx(
        "relative flex items-center px-2 border rounded-md",
        className
      )}
    >
      <div className="text-center">{text}</div>
      <IoIosCloseCircle
        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer text-red-500 hover:text-red-700"
        onClick={onRemove}
        aria-label="remove"
        size="20px"
      />
    </div>
  );
};

export default DismissableLabel;
