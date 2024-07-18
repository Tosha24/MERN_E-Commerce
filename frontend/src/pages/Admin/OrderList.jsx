import React, { useMemo, useState, useEffect } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { BiSortAlt2 } from "react-icons/bi";

const overlappingImagesStyle = {
  display: "flex",
  alignItems: "center",
};

const imageStyle = (index) => ({
  width: "40px",
  height: "40px",
  objectFit: "cover",
  borderRadius: "50%",
  marginLeft: index > 0 ? "-15px" : "0",
  zIndex: 100 - index,
});

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return search
      ? orders.filter(
          (order) =>
            order._id.toLowerCase().includes(search.toLowerCase()) ||
            order.user.username.toLowerCase().includes(search.toLowerCase())
        )
      : orders;
  }, [orders, search]);

  const data = useMemo(
    () =>
      filteredOrders.map((order, index) => ({
        col1: index + 1,
        col2: (
          <div style={overlappingImagesStyle}>
            {order.orderItems.map((item, index) => (
              <img
                key={index}
                src={item.image}
                alt={item.name}
                style={imageStyle(index)}
                className="rounded-full border-2 border-gray-500 text-center m-2"
              />
            ))}
          </div>
        ),
        col3: order.user.username,
        col4: moment(order.createdAt).format("MMMM Do YYYY"),
        col5: `₹ ${order.totalPrice}`,
        col6: order.isPaid ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Paid
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Not Paid
          </span>
        ),
        col7: order.isDelivered ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Delivered
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Not Delivered
          </span>
        ),
        col8: (
          <Link to={`/order/${order._id}`}>
            <button className="bg-green-400 p-2 rounded-lg">Details</button>
          </Link>
        ),
      })),
    [filteredOrders]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: "col1",
      },
      { Header: "Items", accessor: "col2" },
      { Header: "User", accessor: "col3", sortType: "alphanumeric" },
      { Header: "Date", accessor: "col4", sortType: "basic" },
      { Header: "Total", accessor: "col5", sortType: "basic" },
      { Header: "Paid", accessor: "col6", sortType: "basic" },
      { Header: "Delivered", accessor: "col7", sortType: "basic" },
      { Header: "", accessor: "col8" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    state: { pageIndex, pageSize, globalFilter },
    setPageSize,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setSearch(search); // Trigger re-render on search change
  }, [search]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2 p-4">
        <h1 className="text-2xl font-semibold text-gray-700">Orders</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 p-4 rounded-xl">
        <table
          {...getTableProps()}
          className="min-w-full bg-gray-200 border border-gray-300 shadow-md rounded-xl overflow-hidden"
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="text-center"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          " 🔽"
                        ) : (
                          " 🔼"
                        )
                      ) : (
                        <span
                          className="cursor-pointer"
                          style={{ fontSize: "1rem" }}
                        >
                          <BiSortAlt2 className="inline-block ml-1" size={16} />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="text-center">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="bg-white border-b">
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center space-x-2 mb-2">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className={`px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            !canPreviousPage ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {Math.ceil(rows.length / pageSize)}
          </strong>{" "}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className={`px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            !canNextPage ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Next
        </button>
        <select
          className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderList;