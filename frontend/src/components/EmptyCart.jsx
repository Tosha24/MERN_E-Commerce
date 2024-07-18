import React from "react";
import emptyCartImage from "/assets/empty-cart.avif";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src={emptyCartImage}
        alt="Empty Cart"
        className="w-48 h-48 mb-4 object-contain"
      />
      <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500 mb-4">
        Explore our products and add something to your cart.
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

export default EmptyCart;
