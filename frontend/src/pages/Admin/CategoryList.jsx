import React, { useState } from "react";
import {
  useDeleteCategoryMutation,
  useGetTotalProductsByCategoryQuery,
} from "../../redux/api/categoryApiSlice";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import CreateCategoryModal from "../../components/CreateCategoryModal.";
import UpdateCategoryModal from "../../components/UpdateCategoryModal";

import { BiSortAlt2 } from "react-icons/bi";

const CategoryList = () => {
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [updatingCategoryName, setUpdatingCategoryName] = useState("");
  const [updatingCategoryImage, setUpdatingCategoryImage] = useState("");

  const [deleteCatgeory] = useDeleteCategoryMutation();

  const { data: totalProducts, refetch } = useGetTotalProductsByCategoryQuery();
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCatgeory(id);
      refetch();
    }
  };

  // Define columns for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }) => (
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-14 h-14 object-cover rounded-full text-center mx-auto border-2 border-gray-400 m-2"
          />
        ),
      },
      {
        Header: "Category Name",
        accessor: "name",
      },
      {
        Header: "Total Products",
        accessor: "totalProducts",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex justify-center items-center flex-row gap-4">
            <button
              onClick={() => {
                setUpdatingCategoryId(row.original._id);
                setUpdatingCategoryName(row.original.name);
                setUpdatingCategoryImage(row.original.image);
                setShowUpdateCategoryModal(true);
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

  // Create a data array with the required structure for react-table
  const data = React.useMemo(() => {
    return totalProducts
      ? totalProducts.map((product) => ({ ...product, actions: "" }))
      : [];
  }, [totalProducts]);

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

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2 p-4">
        <h1 className="text-2xl font-semibold text-gray-700">Categories</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateCategoryModal(true)}
            className="flex items-center p-2 bg-rose-500 font-semibold text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            <AiOutlinePlus className="mr-2" />
            Add New Category
          </button>
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
          className="min-w-full border border-gray-300 shadow-md rounded-xl overflow-hidden"
        >
          <thead className="bg-gray-100">
            {headerGroups?.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup?.headers?.map((column) => (
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
      {
        <>
          <CreateCategoryModal
            isOpen={showCreateCategoryModal}
            onClose={() => setShowCreateCategoryModal(false)}
            refetch={refetch}
          />

          <UpdateCategoryModal
            isOpen={showUpdateCategoryModal}
            onClose={() => setShowUpdateCategoryModal(false)}
            refetch={refetch}
            updatingCategoryId={updatingCategoryId}
            updatingCategoryName={updatingCategoryName}
            updatingCategoryImage={updatingCategoryImage}
          />
        </>
      }
    </div>
  );
};

export default CategoryList;
