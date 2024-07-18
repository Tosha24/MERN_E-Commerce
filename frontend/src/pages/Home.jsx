import { Link, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Product from "./Products/Product.jsx";
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
        {/* <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data && data?.products?.map((product) => (
                <div key={product._id}>
                  
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div> */}
      </div>
    </>
  );
};

export default Home;
