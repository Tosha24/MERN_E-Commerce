import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useAddFavoriteProductMutation,
  useGetUserFavoriteProductsQuery,
  useRemoveFavoriteProductMutation,
} from "../../redux/api/usersApiSlice";
import toast from "react-hot-toast";

const HeartIcon = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [addProductToFavorites] = useAddFavoriteProductMutation();
  const [removeProductFromFavorites] = useRemoveFavoriteProductMutation();

  const { data: favProducts, refetch } = useGetUserFavoriteProductsQuery();

  useEffect(() => {
    const isProductInFavorites = favProducts?.find(
      (favProduct) => favProduct._id === product._id
    );
    setIsFavorite(isProductInFavorites);
  }, [favProducts, product._id]);

  const toggleFavorites = async () => {
    if (!userInfo) {
      toast.error("Please login to add product to favorites");
      return;
    }

    if (isFavorite) {
      await removeProductFromFavorites({
        userId: userInfo._id,
        productId: product._id,
      });
      refetch();
      setIsFavorite(false);
      toast.success("Product removed from favorites");
    } else {
      await addProductToFavorites({
        userId: userInfo._id,
        productId: product._id,
      });
      refetch();
      setIsFavorite(true);
      toast.success("Product added to favorites");
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-black" />
      )}
    </div>
  );
};

export default HeartIcon;
