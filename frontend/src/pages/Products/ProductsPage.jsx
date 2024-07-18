import React, { useEffect, useState } from "react";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Filter from "../../components/Filter";
import FilterModal from "../../components/FilterModal";
import ProductCardSkeleton from "../../components/Skeleton/ProductCardSkeleton";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const { data: Products, isLoading } = useGetProductsQuery({ category });
  const [products, setProducts] = useState([]);
  const [showProduct, setshowProduct] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  useEffect(() => {
    if (Products) {
      setProducts(Products);
    }
  }, [Products]);

  console.log(showProduct);

  const displayProducts = products.length > 0 ? products : Products;

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={`${
          filterApplied ? "justify-around w-full" : "justify-end w-[90vw]"
        } md:hidden flex flex-row h-full rounded-xl cursor-pointer`}
      >
        <div
          className={`${
            filterApplied ? "" : "hidden"
          } border-2 border-rose-700 text-rose-700 font-semibold tracking-wider px-3 py-1 rounded-xl cursor-pointer bg-rose-200`}
          onClick={() => {
            setFilterApplied(false);
            setProducts(Products);
          }}
        >
          Clear Filter
        </div>
        <div
          className="border-2 border-rose-700 text-rose-700 font-semibold tracking-wider px-3 py-1 rounded-xl cursor-pointer bg-rose-200"
          onClick={() => setFilterModalOpen(true)}
        >
          Filter
        </div>
      </div>
      <Filter
        category={category}
        setProducts={setProducts}
        setshowProduct={setshowProduct}
      />

      <div className="flex justify-center items-center md:items-start w-full mt-4">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 m-3">
          {isLoading ? (
            Array.from({ length: 8 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : displayProducts ? (
            displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <h1>No Products Found</h1>
          )}
        </div>
      </div>

      {filterModalOpen && (
        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          category={category}
          setProducts={setProducts}
          setshowProduct={setshowProduct}
          setFilterApplied={setFilterApplied}
        />
      )}
    </div>
  );
};

export default ProductsPage;
