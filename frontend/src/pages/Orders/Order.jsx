import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { clearCheckoutInfo } from "../../redux/features/cart/cartSlice";

import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import { FaPaypal } from "react-icons/fa";
import ReviewModal from "../../components/ReviewModal";
import { useClearCartMutation } from "../../redux/api/usersApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [clickedProductName, setClickedProductName] = useState(null);
  const [clickedProductId, setClickedProductId] = useState(null);
  const [clearCart] = useClearCartMutation();

  const dispatch = useDispatch();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
        await clearCart(userInfo._id);
      // reload
        window.location.reload();
        dispatch(clearCheckoutInfo());
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    const totalPriceUSD = order.totalPrice / 73;
    return actions.order
      .create({
        purchase_units: [
          { amount: { value: totalPriceUSD.toFixed(2), currency_code: "USD" } },
        ],
        // purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  const backgroundColors = [
    "bg-red-200",
    "bg-violet-200",
    "bg-green-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-cyan-200",
    "bg-blue-200",
    "bg-rose-200",
    "bg-gray-200",
    "bg-indigo-200",
    "bg-fuchsia-200",
    "bg-emerald-200",
    "bg-teal-200",
    "bg-amber-200",
    "bg-orange-200",
    "bg-purple-200",
    "bg-lime-200",
    "bg-sky-200",
  ];

  let globalColorIndex = 0;

  globalColorIndex = (globalColorIndex + 1) % backgroundColors.length;

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col lg:flex-row m-2">
      <div className="lg:w-2/3 pr-4 lg:border-r border-black">
        <div className="mt-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto flex flex-col gap-5">
              {order.orderItems.map((item, index) => {
                const currentBackgroundColor =
                  backgroundColors[globalColorIndex];

                globalColorIndex =
                  (globalColorIndex + 1) % backgroundColors.length;
                return (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row p-5 rounded-xl ${currentBackgroundColor}`}
                  >
                    {showModal ? (
                      <ReviewModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        productName={clickedProductName}
                        productId={clickedProductId}
                        userInfo={userInfo}
                      />
                    ) : null}
                    <div className="flex flex-shrink-0 items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-fill rounded-full"
                      />
                    </div>
                    <div className="flex-grow space-y-1 pl-4">
                      <p className="font-semibold text-xl">
                        <Link to={`/product/${item.product}`}>
                          {item.name.substring(0, 25) + "..."}
                        </Link>
                      </p>
                      <p className="font-semibold">
                        Quantity:{" "}
                        <span className="font-normal">{item.qty}</span>
                      </p>
                      <p className="font-semibold">
                        Unit Price:{" "}
                        <span className="font-normal">₹ {item.price}</span>
                      </p>
                      <p className="font-semibold">
                        Total:{" "}
                        <span className="font-normal">
                          ₹ {(item.qty * item.price).toFixed(2)}
                        </span>
                      </p>
                    </div>
                    {order?.isPaid &&
                      order?.isDelivered &&
                      order?.user?.username === userInfo?.username && (
                        <div
                          className="mt-3 sm:mt-0 border-2 border-rose-800 h-full p-2 rounded-lg bg-rose-500 text-white font-semibold flex items-center justify-center cursor-pointer hover:bg-rose-600"
                          onClick={() => {
                            setClickedProductName(item.name);
                            setClickedProductId(item.product);
                            setShowModal(true);
                          }}
                        >
                          Post a review
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="md:w-auto p-5 mt-5">
        <div className="pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <div className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </div>
          <div className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </div>
          <div className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </div>
          <div className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}
            {"-"}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </div>
          <div className="mb-4 flex gap-2">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod} <FaPaypal color="#0079C1" />
          </div>
          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex flex-col mb-2">
          <div className="flex justify-between">
            <span className="font-bold text-pink-500">Items</span>
            <span>₹ {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-pink-500">Shipping</span>
            <span>₹ {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-pink-500">Tax</span>
            <span>₹ {order.taxPrice}</span>
          </div>
          <div className="flex justify-between border-t border-gray-400">
            <span className="font-bold text-pink-500">Total</span>
            <span className="font-semibold">₹ {order.totalPrice}</span>
          </div>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}{" "}
            {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && order.isPaid ? (
          userInfo.isAdmin && !order.isDelivered ? (
            <div>
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          ) : order.isDelivered && (
            <div>
              <Message variant="success">
                Delivered on {order.deliveredAt}
              </Message>
            </div>
          )
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Order;
