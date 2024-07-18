
import { useGetUserFavoriteProductsQuery } from "../../redux/api/usersApiSlice";

const FavoritesCount = () => {
  const {data:favProducts} = useGetUserFavoriteProductsQuery();

  console.log(favProducts);
  return (
    <div className="absolute bottom-0 left-4">
      {favProducts && (
        <span className="px-1 py-0 text-sm text-white bg-red-500 rounded-full">
          {favProducts.length || 0}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;