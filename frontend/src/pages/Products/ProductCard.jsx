import React from "react";
import HeartIcon from "./HeartIcon";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useAddAndUpdateProductToCartMutation, useGetUserCartQuery } from "../../redux/api/usersApiSlice.js";
import { useSelector } from "react-redux";

const backgroundColors = [
  "bg-red-200",
  "bg-violet-200",
  "bg-green-200",
  "bg-pink-200",
  "bg-yellow-200",
  "bg-cyan-200",
  "bg-blue-200",
  "bg-rose-200",
  "bg-gray-200",
  "bg-indigo-200",
  "bg-fuchsia-200",
  "bg-emerald-200",
  "bg-teal-200",
  "bg-amber-200",
  "bg-orange-200",
  "bg-purple-200",
  "bg-lime-200",
  "bg-sky-200",
];

let globalColorIndex = 0;
const ProductCard = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [addAndUpdateProductToCart] = useAddAndUpdateProductToCartMutation();
  const { data: cartItems, refetch } = useGetUserCartQuery();

  

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error("Please login to add product to cart");
      return;
    }
    try {
      await addAndUpdateProductToCart({
        productId: product?._id,
        quantity: 1,
      });
      refetch();
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Something went wrong.. Try again");
    }
  };

  const currentBackgroundColor = backgroundColors[globalColorIndex];
  const anotherBackgroundColor =
    backgroundColors[(globalColorIndex + 1) % backgroundColors.length];

  globalColorIndex = (globalColorIndex + 1) % backgroundColors.length;

  return (
    <div
      className={`flex flex-col justify-center items-center relative h-[300px] sm:h-[400px] rounded-lg ${currentBackgroundColor} p-2 shadow-slate-200 shadow-lg cursor-pointer `}
    >
      <div
        className="flex flex-col justify-center items-center "
        onClick={() => {
          window.location.href = `/product/${product._id}`;
        }}
      >
        <img
          src={product?.image}
          alt={product?.name}
          className={`w-[120px] h-[120px] sm:!w-[200px] sm:!h-[200px] rounded-full object-contain mt-[-40px] bg-white`}
        />

        <h1 className="text-[12px] sm:text-[18px] font-bold flex flex-wrap mt-2 text-center">
          {product?.name.length > 20
            ? product?.name.substring(0, 30) + "..."
            : product?.name}
        </h1>
        <div className="flex flex-col md:flex-row !justify-between items-center w-full mt-4 sm:mt-10 pl-4 pr-4 gap-3">
          <p
            className={`text-[12px] font-bold flex flex-wrap text-center ${anotherBackgroundColor} border-2 border-black p-1 sm:p-2 rounded-full`}
          >
            {product.brand}
          </p>
          <p className="text-lg text-black font-bold text-[12px]">₹{product.price}</p>
        </div>
      </div>
      <div className="absolute top-0 right-[-12px] cursor-pointer">
        <HeartIcon product={product} />
      </div>
      <div
        onClick={handleAddToCart}
        className="absolute bottom-2 right-5 cursor-pointer"
      >
        <AiOutlineShoppingCart size={26} />
      </div>
    </div>
  );
};

export default ProductCard;
