import ProductCarousel from "../pages/Products/ProductCarsousel";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

const Header = () => {
  const { isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-around">
        <div className="xl:block lg:block md:hidden sm:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4">
           
          </div>
        </div>
        <ProductCarousel />
      </div>
    </>
  );
};

export default Header;
