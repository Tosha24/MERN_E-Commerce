import EmptyFavorite from "../../components/EmptyFavorite.jsx";
import { useGetUserFavoriteProductsQuery } from "../../redux/api/usersApiSlice.js";
import ProductCard from "./ProductCard.jsx";

const Favorites = () => {
  const {data: favProducts} = useGetUserFavoriteProductsQuery();

  return (
    <div className="m-3">
      <h1 className="text-lg font-bold ml-3 mb-5 ">
        FAVORITE PRODUCTS ({favProducts && favProducts.length || 0})
      </h1>
      {
        favProducts && favProducts.length === 0 && (
          <div>
            <EmptyFavorite/>
          </div>)
      }

      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 m-3">
        {favProducts && favProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;