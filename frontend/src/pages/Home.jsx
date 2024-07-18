import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import ProductCarousel from "./Products/ProductCarsousel.jsx";
import CategoryCarousel from "./Category/CategoryCarousel.jsx";
import NewProducts from "./Products/NewProducts.jsx";

const Home = () => {
  const { keyword } = useParams();
  const { data } = useGetProductsQuery({ keyword });

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <CategoryCarousel />
        <ProductCarousel />
        <NewProducts/>
      </div>
    </>
  );
};

export default Home;
