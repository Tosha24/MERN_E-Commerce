import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useAllProductsQuery, useGetProductsQuery } from "../../redux/api/productApiSlice.js";
import Loader from "../../components/Loader";
import ProductCard from "./ProductCard";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetProductsQuery({category: ""});

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="flex flex-row justify-center items-center md:mr-5 gap-2">
        <button
          className={`w-full md:w-auto p-4 cursor-pointer text-lg focus:outline-none rounded-xl
            background-color: ${
              activeTab === 1 ? "bg-stone-100" : "bg-white/50"
            }
          
          ${activeTab === 1 ? "font-bold" : ""}`}
          onClick={() => handleTabClick(1)}
        >
          All Reviews
        </button>
        <button
          className={`w-full md:w-auto p-4 cursor-pointer text-lg focus:outline-none rounded-xl
            background-color: ${
              activeTab === 2 ? "bg-stone-100" : "bg-white/50"
            }
          ${activeTab === 2 ? "font-bold" : ""}`}
          onClick={() => handleTabClick(2)}
        >
          Related Products
        </button>
      </section>

      {/* Second Part */}
      <section className="w-full">
        {activeTab === 1 && (
          <>
            <div className="flex justify-center items-center w-full">
              {product.reviews.length === 0 && (
                <div className="border w-full m-8 font-semibold text-white bg-gray-500 text-xl p-2 items-center justify-center flex rounded-lg flex-col">
                  <p>No Reviews yet</p>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center w-full">
              {product?.reviews?.map((review) => (
                <div
                  key={review._id}
                  className="bg-stone-100 p-4 rounded-lg lg:w-[60rem] m-2 w-full"
                >
                  <div className="flex justify-between">
                    <p className="text-rose-500 tracking-wider font-bold text-sm md:text-lg">
                      {review.user === userInfo?._id ? (
                        <span>{review.name.toUpperCase()} (You) </span>
                      ) : (
                        review.name.toUpperCase()
                      )}
                    </p>
                    <p className="text-rose-400 font-semibold text-sm md:text-lg">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>

                  <p className="my-4">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 2 && (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 m-3">
            {console.log(data)}
            {console.log(product)}
            {!data ? (
              <Loader />
            ) : (
              data.map(
                (productData) =>
                  product?.category === productData?.category &&
                  product?._id !== productData?._id && (
                    <ProductCard key={productData._id} product={productData} />
                  )
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
