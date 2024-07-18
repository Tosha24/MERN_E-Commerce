import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice.js";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaClock, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
// import { addToCart } from "../../redux/features/cart/cartSlice.js";
import { AiOutlineLeft } from "react-icons/ai";
import { useAddAndUpdateProductToCartMutation } from "../../redux/api/usersApiSlice.js";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const [addAndUpdateProductToCart] = useAddAndUpdateProductToCartMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = async () => {
    try {
      await addAndUpdateProductToCart({
        productId: product._id,
        quantity: Number(qty),
      });
      toast.success("Added to cart");
      navigate("/cart");
    } catch (error) {
      toast.error("Something went wrong.. Try again");
    }
  };

  return (
    <>
      <div className="mt-3">
        <div
          className="text-black font-semibold hover:underline ml-[10%] md:ml-[10rem] flex gap-2 items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <AiOutlineLeft /> Go Back
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row relative items-center mt-4 lg:mt-8 mx-4 lg:mx-10 gap-6 mb-10 bg-red-100 p-6 rounded-2xl ">
            <div className="lg:mr-4 p-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full md:max-w-[45rem] lg:max-w-[45rem] md:w-[30rem] sm:w-[20rem] mb-4 md:mb-0 mx-auto md:mx-0 rounded-[50%]"
                style={{ contain: "content" }}
              />
              <div className="absolute top-3 right-3 text-4xl">
                <HeartIcon product={product} />
              </div>
            </div>

            <div className="flex flex-col justify-between w-full lg:w-1/2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
                {product.name}
              </h2>
              <p className="my-2 text-slate-500 text-justify">
                {product.description}
              </p>

              <p className="text-2xl md:text-3xl lg:text-4xl my-2 font-extrabold">
                ₹ {product.price}
              </p>

              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <div className="flex items-center mb-2 md:mb-0">
                    <FaStore className="mr-2 text-black" />{" "}
                    <span className="font-semibold mr-2">Brand:</span>
                    {product.brand}
                  </div>
                  <div className="flex items-center mb-2 md:mb-0">
                    <FaClock className="mr-2 text-black" />{" "}
                    <span className="font-semibold mr-2">Added:</span>{" "}
                    {moment(product.createdAt).fromNow()}
                  </div>
                  <div className="flex items-center mb-2 md:mb-0">
                    <FaStar className="mr-2 text-black" />{" "}
                    <span className="font-semibold mr-2">Ratings:</span>
                    {rating}
                  </div>
                </div>
              </div>

              <div className="flex justify-between flex-wrap items-center mt-5 gap-3">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div className="mb-2 md:mb-0">
                    <span className="font-semibold mr-2">Qty:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container mt-4 md:mt-8">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg w-full md:w-auto"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <div className="!w-full">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
