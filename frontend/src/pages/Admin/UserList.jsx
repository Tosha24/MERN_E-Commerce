import React, { useMemo, useState } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-hot-toast";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { BiSortAlt2 } from "react-icons/bi";

const UserList = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [search, setSearch] = useState("");

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error.data.message || error.error);
      }
    }
  };

  const toggleEdit = (id, name, email) => {
    setEditableUserId(id);
    setEditableUserName(name);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      const updatedData = {
        username: editableUserName,
        email: editableUserEmail,
      };

      if (!editableUserName || !editableUserEmail) {
        toast.error("Name and email are required");
        return;
      }

      await updateUser({
        userId: id,
        ...updatedData,
      }).unwrap();

      const currentUserInfo =
        JSON.parse(localStorage.getItem("userInfo")) || {};
      const newUserInfo = { ...currentUserInfo, ...updatedData };

      dispatch(setCredentials(newUserInfo));

      toast.success("User updated successfully");

      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return search
      ? users.filter(
          (user) =>
            user._id.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.email
              .toLowerCase()
              .split("@")[0]
              .includes(search.toLowerCase()) ||
            user.email
              .toLowerCase()
              .split("@")[1]
              .includes(search.toLowerCase()) ||
            user.isAdmin.toString().toLowerCase().includes(search.toLowerCase())
        )
      : users;
  }, [users, search]);

  const data = useMemo(
    () =>
      filteredUsers.map((user, index) => ({
        col1: index + 1,
        col2:
          editableUserId === user._id ? (
            <input
              type="text"
              value={editableUserName}
              onChange={(e) => setEditableUserName(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            user.username
          ),
        col3:
          editableUserId === user._id ? (
            <input
              type="text"
              value={editableUserEmail}
              onChange={(e) => setEditableUserEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <a href={`mailto:${user.email}`}>{user.email}</a>
          ),
        col4: user.isAdmin ? "Yes" : "No",
        col5:
          editableUserId === user._id ? (
            <button
              onClick={() => updateHandler(user._id)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              <FaCheck />
            </button>
          ) : (
            <>
              <button
                onClick={() => toggleEdit(user._id, user.username, user.email)}
                className="mr-2 bg-yellow-500 text-white py-2 px-4 rounded-lg"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteHandler(user._id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                <FaTrash />
              </button>
            </>
          ),
      })),
    [filteredUsers, editableUserId, editableUserName, editableUserEmail]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Sr. No",
        accessor: "col1",
      },
      { Header: "Name", accessor: "col2" },
      { Header: "Email", accessor: "col3" },
      { Header: "Admin", accessor: "col4" },
      { Header: "Actions", accessor: "col5" },
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

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2 p-4">
        <h1 className="text-2xl font-semibold text-gray-700">Users</h1>
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
          className="min-w-full border border-gray-300 shadow-md rounded-xl overflow-hidden"
        >
          <thead className="bg-gray-100 text-center">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-200 text-center"
          >
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap"
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
      <div className="flex justify-center items-center space-x-2 mb-4">
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

export default UserList;
