import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";

import { useGetUserCartQuery } from "../../redux/api/usersApiSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const checkoutInfo = useSelector((state) => state.shippingAddress);
  const { data: cartItems } = useGetUserCartQuery();

  console.log(cartItems);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!checkoutInfo?.shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [navigate, checkoutInfo]);

  const shippingPrice = 0;
  const taxPrice =
    0.15 *
    cartItems?.reduce(
      (acc, item) => acc + item.product?.price * item.quantity,
      0
    );
  const totalPrice = (
    Number(
      cartItems?.reduce(
        (acc, item) => acc + item?.product?.price * item?.quantity,
        0
      )
    ) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item?.product?.price * item?.quantity,
    0
  );

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: checkoutInfo?.shippingAddress,
        paymentMethod: checkoutInfo?.paymentMethod,
        itemsPrice,
        taxPrice: 0.15,
        shippingPrice,
        totalPrice,
      }).unwrap();

      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="container mx-auto mt-8">
        <ProgressSteps step1 step2 step3 />
        {cartItems?.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="flex flex-col w-full p-4">
            {cartItems?.map(
              (item, index) => (
                console.log(item),
                (
                  <div
                    key={index}
                    className="mb-4 border-b border-gray-300 pb-4"
                  >
                    <div className="flex">
                      <img
                        src={item?.product?.image}
                        alt={item?.product?.name}
                        className="w-16 h-16 object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item?.product?._id}`}
                          className="text-lg font-semibold"
                        >
                          {item?.product?.name?.substring(0, 40) + "..."}
                        </Link>
                        <div className="text-gray-600">
                          Quantity: {item?.quantity}
                        </div>
                        <div className="text-gray-600">
                          Price: ₹{item?.product?.price?.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          Total: ₹
                          {(item?.quantity * item?.product?.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}

        <div className="mt-5 p-4">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex flex-col bg-rose-100 p-4 rounded-lg mb-4">
            <ul className="text-lg mb-4">
              <li>
                <span className="font-semibold">Items:</span> ₹{itemsPrice}
              </li>
              <li>
                <span className="font-semibold">Shipping:</span> ₹
                {shippingPrice}
              </li>
              <li>
                <span className="font-semibold">Tax:</span> ₹{taxPrice}
              </li>
              <li>
                <span className="font-semibold">Total:</span> ₹{totalPrice}
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Shipping</h2>
              <p>
                <strong>Address:</strong>{" "}
                {checkoutInfo?.shippingAddress?.address},{" "}
                {checkoutInfo?.shippingAddress?.city}{" "}
                {checkoutInfo?.shippingAddress?.postalCode},{" "}
                {checkoutInfo?.shippingAddress?.country}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
              <span className="font-">Method:</span>{" "}
              {checkoutInfo?.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className={`bg-rose-500 text-white py-2 px-4 rounded-full text-lg w-full mb-4 hover:bg-rose-600`}
            disabled={cartItems === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
