import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice.js";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

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

  return (
    <div className="mx-5 my-3">
      <h2 className="text-2xl font-semibold mt-4 mb-4 text-center">
        My Orders
      </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="flex flex-col gap-4">
          {orders?.map((order) =>
            order?.orderItems?.map((item) => {
              const currentBackgroundColor = backgroundColors[globalColorIndex];

              globalColorIndex =
                (globalColorIndex + 1) % backgroundColors.length;
              return (
                <div
                  key={order._id}
                  className={`flex flex-col ${currentBackgroundColor} p-5 rounded-lg gap-3 cursor-pointer`}
                  onClick={() => {
                    window.location.href = `/order/${order._id}`;
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <img
                      src={item?.image}
                      alt={item?.name}
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border"
                    />
                    <div>
                      <p className="text-lg font-semibold">
                        {item?.name.substring(0, 25) + "..."}
                      </p>
                      <p className="font-semibold">₹{item?.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="font-bold">Qty: {item?.qty}</p>
                    <p>
                      Date:{" "}
                      <span className="font-bold">
                        {order?.createdAt?.substring(0, 10)}
                      </span>
                    </p>
                    <p>
                      Total:{" "}
                      <span className="font-bold">₹{order?.totalPrice}</span>
                    </p>
                    <div className="flex flex-row justify-between space-x-3">
                      <div>
                        {order?.isPaid ? (
                          <span className="p-2 bg-green-300 rounded-full border border-black">
                            Paid
                          </span>
                        ) : (
                          <span className="p-2 bg-red-300 rounded-full border border-black">
                            Not Paid
                          </span>
                        )}
                      </div>
                      <div>
                        {order?.isPaid ? (
                          order?.isDelivered ? (
                            <span className="p-2 bg-green-300 rounded-full border border-black">
                              Delivered
                            </span>
                          ) : (
                            <span className="p-2 bg-red-300 rounded-full border border-black">
                              Delivery in-process
                            </span>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrder;