import React from "react";
import { Link } from "react-router-dom";

// Counter to keep track of the current color index

const backgroundColors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-300",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-teal-300",
  "bg-cyan-300",
  "bg-amber-300",
  "bg-orange-300",
];

let globalColorIndex = 0;

const ProductHeaderCard = ({ image, name, price, id }) => {
  // Get the current background color using the globalColorIndex
  const currentBackgroundColor = backgroundColors[globalColorIndex];

  // Increment the globalColorIndex for the next card
  globalColorIndex = (globalColorIndex + 1) % backgroundColors.length;

  return (
    <Link to={`/product/${id}`}>
      <div
        className={`flex flex-col justify-center items-center w-auto h-auto sm:h-[350px] rounded-lg p-2 ${currentBackgroundColor}`}
      >
        <img
          src={image}
          alt={name}
          className="w-3/4 sm:w-[12rem] h-auto sm:h-[12rem] rounded-full"
        />
        <h1 className="text-base sm:text-[18px] w-full md:w-[220px] text-center mt-2 mb-2 font-bold">
          {name.length > 20 ? name.substring(0, 30) + "..." : name}
        </h1>
        <h1 className="text-base sm:text-[18px] text-center mt-2 mb-2 font-bold">
          ₹{price}
        </h1>
      </div>
    </Link>
  );
};

export default ProductHeaderCard;
