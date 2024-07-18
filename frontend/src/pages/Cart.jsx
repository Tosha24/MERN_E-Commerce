import { Link, useNavigate } from "react-router-dom";

import { FaTrash } from "react-icons/fa";

import {
  useAddAndUpdateProductToCartMutation,
  useGetUserCartQuery,
  useRemoveProductFromCartMutation,
} from "../redux/api/usersApiSlice.js";
import toast from "react-hot-toast";
import EmptyCart from "../components/EmptyCart.jsx";
import { useEffect } from "react";

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

const Cart = () => {
  const { data: cartItems, refetch } = useGetUserCartQuery();
  const [addAndUpdateProductToCart] = useAddAndUpdateProductToCartMutation();
  const [removeFromCart] = useRemoveProductFromCartMutation();

  const navigate = useNavigate();

  console.log(cartItems);

  useEffect(() => {
    refetch();
  }, [cartItems?.length, refetch]);

  const addToCartHandler = async (productId, qty) => {
    try {
      await addAndUpdateProductToCart({
        productId,
        quantity: qty,
      }).unwrap();
      refetch();
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Error changing the quantity");
    }
  };

  const removeFromCartHandler = async (id) => {
    await removeFromCart({
      cartId: id,
    }).unwrap();
    refetch();
    toast.success("Removed from cart");
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto p-4">
      {cartItems && cartItems.length === 0 ? (
        <div>
          <EmptyCart />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
          <div className="w-full">
            <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">
              Shopping Cart
            </h1>

            {cartItems &&
              cartItems.map((item, index) => {
                const currentBackgroundColor =
                  backgroundColors[
                    (globalColorIndex + index) % backgroundColors.length
                  ];
                const anotherBackgroundColor =
                  backgroundColors[
                    (globalColorIndex + index + 1) % backgroundColors.length
                  ];

                return (
                  <div
                    key={item._id}
                    className={`flex flex-col md:flex-row !w-full items-center gap-4 p-2 rounded-xl shadow relative ${currentBackgroundColor} mb-4`}
                  >
                    <div className="w-28 h-28 md:w-48 md:h-48 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-[50%]"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-lg font-semibold text-black"
                      >
                        {item.product.name.substring(0, 35) + "..."}
                      </Link>
                      <div className="flex justify-between lg:justify-normal  flex-wrap gap-2 items-center mt-2">
                        <span
                          className={`text-sm font-bold ${anotherBackgroundColor} p-2 rounded-3xl border border-black`}
                        >
                          {item.product.brand}
                        </span>
                        <span className="text-lg font-bold">
                          ₹ {item.product.price}
                        </span>
                      </div>
                    </div>
                    <div
                      className="
                    flex  flex-row
                    justify-center items-center
                    gap-2 md:absolute
                    bottom-2 right-2
                  "
                    >
                      <label htmlFor="qty" className="text-sm font-bold">
                        Qty:
                      </label>

                      <select
                        className="
                        text-sm font-bold
                        bg-white
                        border-2 border-black
                        p-2 rounded-full
                      "
                        value={item.quantity}
                        onChange={(e) =>
                          addToCartHandler(
                            item?.product?._id,
                            Number(e.target.value)
                          )
                        }
                      >
                        {[...Array(item.product.countInStock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <button
                      className="text-red-500 absolute top-2 right-2"
                      onClick={() => removeFromCartHandler(item?._id)}
                    >
                      <FaTrash size="1.5em" />
                    </button>
                  </div>
                );
              })}
          </div>
          <div
            className={`w-full h-full  md:w-1/3 lg:w-1/4 shadow p-4 rounded-xl bg-slate-200 md:mt-12`}
          >
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p className="text-lg">
              Items (
              {cartItems &&
                cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              )
            </p>
            <p className="text-2xl font-bold mb-4">
              Total: ₹
              {cartItems &&
                cartItems
                  .reduce(
                    (acc, item) => acc + item.quantity * item.product.price,
                    0
                  )
                  .toFixed(2)}
            </p>
            <button
              className="
                w-full
                bg-rose-500
                text-white
                font-semibold
                p-2
                rounded-xl
                mb-4
              "
              disabled={cartItems && cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
