import React from "react";
import { TbHeartSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const EmptyFavorite = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <TbHeartSearch className="text-[10rem] text-blue-500" />
      <h2 className="text-2xl font-semibold mb-2">You don't have favorites</h2>
      <p className="text-gray-500 mb-4">
        Explore our products and mark them as favorites.
      </p>
      <button
        className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600"
        onClick={() => {
          navigate("/");
        }}
      >
        Explore Products
      </button>
    </div>
  );
};

export default EmptyFavorite;
