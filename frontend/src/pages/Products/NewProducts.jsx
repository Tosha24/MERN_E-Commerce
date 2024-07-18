import React from "react";
import { useGetRandomProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "../../components/Skeleton/ProductCardSkeleton";

const NewProducts = () => {
  const { data: randomProducts, isLoading } = useGetRandomProductsQuery();
  console.log(randomProducts);

  return (
    <div>
      <div className="flex justify-center mt-16 items-center">
        <h1 className="text-[3rem]">
          New Products
        </h1>
      </div>
      <div className="flex justify-center items-center md:items-start w-full mt-4">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 m-3">
          {isLoading
            ? Array.from({ length: 8 }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : randomProducts
              ? randomProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              : <h1>No Products Found</h1>
          }
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
