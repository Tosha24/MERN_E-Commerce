import { useEffect, useState } from "react";
import {  useGetBrandsUsingCategoryQuery, useGetFilteredProductsQuery } from "../redux/api/productApiSlice";


const FilterModal = ({ isOpen, onClose, category, setProducts, setshowProduct, setFilterApplied }) => {
  const { data: brands } = useGetBrandsUsingCategoryQuery({ category });

  const [checkedBrands, setCheckedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const { data: filteredProducts} = useGetFilteredProductsQuery({
    checkedBrands,
    category,
    minPrice,
    maxPrice,
  });


  const handleCheck = (value) => {
    if (checkedBrands.includes(value)) {
      setCheckedBrands(checkedBrands.filter((item) => item !== value));
    } else {
      setCheckedBrands([...checkedBrands, value]);
      setFilterApplied(true);
    }
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
      className={`${
        isOpen ? "block md:hidden" : "hidden"
      } fixed inset-0 bg-gray-900 bg-opacity-50 z-50 overflow-y-auto`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-white/10"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="m-6 border border-black rounded-3xl p-2 items-center justify-center flex text-lg">
              Shop By Brand
            </div>
            {brands &&
              brands.map((brand, index) => (
                <div className="ml-7" key={index}>
                  <input
                    type="checkbox"
                    className="w-[20px] h-[20px]"
                    name={brand}
                    value={brand}
                    onChange={(e) => handleCheck(e.target.value)}
                  />{" "}
                  {brand}
                </div>
              ))}
            <div className="m-6 border border-black rounded-3xl p-2 items-center justify-center flex text-lg">
              Price Range
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <input
                type="number"
                className="border border-black rounded-xl p-2 w-3/4 flex text-lg"
                placeholder="min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="border border-black rounded-xl p-2 w-3/4 flex text-lg"
                placeholder="max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
