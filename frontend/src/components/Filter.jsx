import React, { useEffect, useState } from "react";
import {
  useGetBrandsUsingCategoryQuery,
  useGetFilteredProductsQuery,
} from "../redux/api/productApiSlice";

const Filter = ({ category, setProducts, setshowProduct }) => {
  const { data: brands } = useGetBrandsUsingCategoryQuery({ category });

  const [checkedBrands, setCheckedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const { data: filteredProducts, refetch } = useGetFilteredProductsQuery({
    checkedBrands,
    category,
    minPrice,
    maxPrice,
  });

  console.log(filteredProducts);

  const handleCheck = (value) => {
    if (checkedBrands.includes(value)) {
      setCheckedBrands(checkedBrands.filter((item) => item !== value));
    } else {
      setCheckedBrands([...checkedBrands, value]);
    }
  };

  const applyFilters = () => {
    refetch({
      checkedBrands,
      category,
      minPrice: parseInt(minPrice, 10),
      maxPrice: parseInt(maxPrice, 10),
    });
  };

  useEffect(() => {
    if (filteredProducts?.length > 0) {
      setshowProduct(true);
    } else {
      setshowProduct(false);
    }
  }, [filteredProducts, setshowProduct]);

  useEffect(() => {
    if (filteredProducts) {
      setProducts(filteredProducts);
    }
  }, [filteredProducts, setProducts, checkedBrands, minPrice, maxPrice]);

  return (
    <div
      className="hidden md:flex flex-col min-w-[250px] gap-10 bg-orange-200 shadow-2xl"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div>
        <div className="m-6 border-2 border-black text-black bg-rose-50 font-semibold rounded-3xl p-2 items-center justify-center flex text-lg">
          Shop By Brand
        </div>
        {brands &&
          brands.map((brand, index) => (
            <div className="ml-7 text-black" key={index}>
              <input
                type="checkbox"
                className="w-[20px] h-[20px] border-orange-800 checked:bg-orange-800 cursor-pointer"
                name={brand}
                value={brand}
                onChange={(e) => handleCheck(e.target.value)}
              />{" "}
              {brand}
            </div>
          ))}
      </div>
      <div>
        <div className="m-6 border-2 border-black bg-rose-50 text-black font-semibold rounded-3xl p-2 items-center justify-center flex text-lg">
          Price Range
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-black">Between</span>
          <input
            type="number"
            className="border border-black rounded-xl p-2 w-3/4 flex text-lg text-black"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-black">and</span>
          <input
            type="number"
            className="border border-black rounded-xl p-2 w-3/4 flex text-lg text-black"
            placeholder="max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
