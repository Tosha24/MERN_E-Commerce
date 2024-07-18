import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineHeart,
  AiOutlineLogout,
  AiOutlineUser,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice.js";
import { logout } from "../../redux/features/auth/authSlice.js";
import FavoritesCount from "../Products/FavoritesCount.jsx";
import CartCount from "../Products/CartCount.jsx";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
      setDropdownOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="hidden lg:flex flex-row w-full justify-between items-center p-4 bg-rose-400 z-100">
        <div className="flex flex-row gap-24">
          <div className="flex flex-row w-full">
            <Link to="/">
              <h1 className="text-3xl font-bold text-white">E-Kart</h1>
            </Link>
          </div>
        </div>
        <div className="flex flex-row space-x-6 mr-6">
          {userInfo?.isAdmin && (
            <div className="flex flex-row space-x-6 mr-6">
              <Link
                to="/admin/dashboard"
                className="flex items-center justify-start gap-2 
1
                "
              >
                <span
                  className="text-lg
                  font-semibold p-2 hover:bg-rose-300  hover:rounded-xl

                "
                >
                  Dashboard
                </span>
              </Link>
              <Link
                to="/admin/allproductslist"
                className="flex items-center justify-start gap-2 rounded-md"
              >
                <span
                  className="text-lg font-semibold p-2 hover:bg-rose-300  hover:rounded-xl
"
                >
                  Products
                </span>
              </Link>
              <Link
                to="/admin/categorylist"
                className="flex items-center justify-start gap-2 rounded-md"
              >
                <span
                  className="text-lg font-semibold p-2 hover:bg-rose-300  hover:rounded-xl
"
                >
                  Categories
                </span>
              </Link>
              <Link
                to="/admin/orderlist"
                className="flex items-center justify-start gap-2 rounded-md"
              >
                <span
                  className="text-lg font-semibold p-2 hover:bg-rose-300  hover:rounded-xl
"
                >
                  Orders
                </span>
              </Link>
              <Link
                to="/admin/userlist"
                className="flex items-center justify-start gap-2 rounded-md"
              >
                <span
                  className="text-lg font-semibold p-2 hover:bg-rose-300  hover:rounded-xl
"
                >
                  Users
                </span>
              </Link>
            </div>
          )}
          {!userInfo?.isAdmin && (
            <div className="flex flex-row space-x-6 mr-6">
              <Link
                to="/cart"
                className="flex items-center justify-start realtive"
              >
                <div className="relative">
                  <CartCount />
                </div>
                <AiOutlineShoppingCart size={26} />
              </Link>

              <Link to="/favorites" className="flex items-center justify-start">
                <div className="relative">
                  <FavoritesCount />
                </div>
                <AiOutlineHeart size={26} />
              </Link>
            </div>
          )}
          {userInfo ? (
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-start bg-rose-200 p-3 rounded-full transform transition duration-300 ease-in-out"
            >
              <AiOutlineUser size={23} />
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-start  hover:bg-rose-200 hover:p-1 pl-3 rounded-md ml-5 hover:scale-110 transform transition duration-300 ease-in-out"
            >
              <AiOutlineLogin size={23} />
              <span className="">LOGIN</span>{" "}
            </Link>
          )}
        </div>

        {dropdownOpen && (
          <div className="absolute top-16 right-2 p-3 space-y-4 w-40 bg-rose-200 rounded-md z-50">
            <Link
              to="/account"
              className="flex items-center justify-start gap-2  rounded-md"
            >
              <AiOutlineUserAdd size={23} />
              <span>PROFILE</span>{" "}
            </Link>
            {!userInfo?.isAdmin && (
              <Link
                to="/user-orders"
                className="flex items-center justify-start gap-2  rounded-md"
              >
                <AiOutlineShopping size={23} />
                <span>MY ORDERS</span>{" "}
              </Link>
            )}
            <button
              onClick={logoutHandler}
              className="flex items-center justify-start gap-2 rounded-md"
            >
              <AiOutlineLogout size={23} />
              <span>LOGOUT</span>{" "}
            </button>
          </div>
        )}
      </nav>

      <div className="lg:hidden z-[999] w-full flex! flex-row! justify-between! items-center! ">
        <div
          className={`lg:hidden flex items-center justify-center rounded-3xl fixed top-8 left-5 w-10 h-10 z-[500] cursor-pointer ${
            showSidebar
              ? "bg-rose-400"
              : "bg-rose-300 transition duration-300 ease-in-out"
          }`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
        <div className="flex items-center justify-center h-[15vh]">
          <h1 className="text-2xl font-bold text-black">E-Kart</h1>
        </div>
      </div>

      {showSidebar && (
        <div className="lg:hidden flex flex-col py-20 h-[100vh] w-[100vw] bg-rose-300 z-500 transition duration-300 ease-in-out">
          <div className="flex flex-col justify-start items-center h-[70vh]  space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 justify-center hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
              onClick={() => setShowSidebar(false)}
            >
              <AiOutlineHome size={26} />
              <span>HOME</span>{" "}
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 justify-center   hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
              onClick={() => setShowSidebar(false)}
            >
              <AiOutlineShoppingCart size={26} />
              <span>CART</span>{" "}
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-2 justify-center  hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
              onClick={() => setShowSidebar(false)}
            >
              <AiOutlineHeart size={26} />
              <span>FAVORITES</span>{" "}
            </Link>

            <Link
              to="/user-orders"
              className="flex items-center justify-center gap-2 hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
              onClick={() => setShowSidebar(false)}
            >
              <AiOutlineShopping size={26} />
              <span>ORDERS</span>{" "}
            </Link>

            <Link
              to="/account"
              className="flex items-center justify-center gap-2 hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
              onClick={() => setShowSidebar(false)}
            >
              <AiOutlineUserAdd className="mr-2" size={26} />
              <span className="">ACCOUNT</span>{" "}
            </Link>

            {userInfo ? (
              <button
                onClick={logoutHandler}
                className="flex items-center justify-center  hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
              >
                <AiOutlineLogout className="mr-2" size={26} />
                <span className="">LOGOUT</span>{" "}
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center  hover:bg-rose-200 p-3 rounded-md hover:scale-110 transform transition duration-300 ease-in-out"
                onClick={() => setShowSidebar(false)}
              >
                <AiOutlineLogin className="mr-2" size={26} />
                <span className="">LOGIN</span>{" "}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
