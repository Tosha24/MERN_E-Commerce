import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import moment from "moment";
import {
  useAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApiSlice";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import CreateProductModal from "../../components/CreateProductModal";
import toast from "react-hot-toast";
import { BiSortAlt2 } from "react-icons/bi";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [filterInput, setFilterInput] = useState("");
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [id, setId] = useState("");

  const [deleteProduct] = useDeleteProductMutation();

  const toggleModal = () => {
    setId("");
    setShowCreateProductModal(true);
  };

  // Handle the filter change
  const handleFilterChange = (e) => {
    setFilterInput(e.target.value || undefined);
  };

  const handleDeleteClick = async (id) => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      await deleteProduct(id);
      toast.success(`Product is deleted`);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  // Filter products based on search input
  const filteredProducts = useMemo(() => {
    if (!products) return []; // Ensures always an array

    return filterInput
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(filterInput.toLowerCase()) ||
            product.brand.toLowerCase().includes(filterInput.toLowerCase())
        )
      : products;
  }, [products, filterInput]);

  // Define the columns for the table
  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img
            src={value}
            alt="Product"
            className="w-14 h-14 object-cover rounded-full text-center mx-auto border-2 border-gray-400 m-2"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value, row }) => (
          <span
            className="cursor-pointer"
            onClick={() => {
              setId(row.original._id);
              setShowCreateProductModal(true);
            }}
          >
            {value.length > 20 ? value.substring(0, 35) + "..." : value}
          </span>
        ),
        // Adding sorting functionality for the 'Name' column
        sortType: "alphanumeric",
      },
      {
        Header: "Brand",
        accessor: "brand",
        // Adding sorting functionality for the 'Brand' column
        sortType: "alphanumeric",
      },
      {
        Header: "In Stock",
        accessor: "countInStock",
        // Adding sorting functionality for the 'In Stock' column
        sortType: "basic",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        // Adding sorting functionality for the 'Created At' column
        sortType: "basic",
        Cell: ({ value }) => moment(value).format("MMMM Do YYYY"),
      },
      {
        Header: "Price",
        accessor: "price",
        // Adding sorting functionality for the 'Price' column
        sortType: "basic",
        Cell: ({ value }) => `₹ ${value}`,
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex justify-center items-center flex-row gap-4">
            <button
              onClick={() => {
                setId(row.original._id);
                setShowCreateProductModal(true);
              }}
              className="flex items-center p-2 bg-blue-500 font-semibold text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <AiOutlineEdit />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original._id)}
              className="flex items-center p-2 bg-red-500 font-semibold text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              <AiOutlineDelete />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Prepare the data for the table
  const data = useMemo(
    () => filteredProducts.map((product) => ({ ...product })),
    [filteredProducts]
  );

  // Use the useTable and usePagination hooks with sorting
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    rows,

    state: { pageIndex, pageSize, sortBy },
  } = useTable({ columns, data }, useSortBy, usePagination);

  useEffect(() => {
    // Trigger a refetch whenever the sorting changes
    refetch();
  }, [refetch, sortBy]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !products) {
    return <div>Error loading products or products not found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2 p-4">
        <h1 className="text-2xl font-semibold text-gray-700">Products</h1>
        <div className="flex items-center space-x-4">
          <div
            onClick={toggleModal}
            className="flex items-center p-2 bg-rose-500 font-semibold text-white rounded-md hover:bg-blue-600 focus:outline-none cursor-pointer"
          >
            <AiOutlinePlus className="mr-2" />
            Add New Product
          </div>
          <input
            type="text"
            value={filterInput || ""}
            onChange={handleFilterChange}
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
            {page.map((row, i) => {
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

      {showCreateProductModal && (
        <div>
          <CreateProductModal
            isOpen={showCreateProductModal}
            onClose={() => setShowCreateProductModal(false)}
            productId={id}
            refetch={refetch}
          />
        </div>
      )}
    </div>
  );
};

export default AllProducts;
