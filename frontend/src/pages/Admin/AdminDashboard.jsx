import { useGetUsersQuery } from "../../redux/api/usersApiSlice.js";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice.js";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import Chart from "react-apexcharts";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers } = useGetUsersQuery();
  const { data: orders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
        padding: {
          right: 30,
          left: 20,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        show: false,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <section className="p-5 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-3">
          <div className="bg-rose-200 text-black p-10 rounded-3xl shadow-lg border flex items-center flex-col justify-start">
            <p className="mt-5 text-xl">Sales</p>
            <h1 className="text-3xl font-bold">
              ₹ {isLoading ? <Loader /> : sales?.toFixed(2)}
            </h1>
          </div>

          <div className="bg-rose-200 text-black p-10 rounded-3xl shadow-lg border flex items-center flex-col justify-start">
            <p className="mt-5 text-xl">Customers</p>
            <h1 className="text-3xl font-bold">
              {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>

          <div className="bg-rose-200 text-black p-10 rounded-3xl shadow-lg border flex items-center flex-col justify-start">
            <p className="mt-5 text-xl">All Orders</p>
            <h1 className="text-3xl font-bold">
              {isLoading ? <Loader /> : orders}
            </h1>
          </div>
        </div>

        <div className="mt-8 w-[80%] mx-auto">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
            className="rounded-lg shadow-lg border p-5 flex items-center justify-center"
          />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;