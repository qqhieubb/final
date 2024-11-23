import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { server } from "../../main";

export default function TeacherRevenueChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${server}/api/total_revenue_teacher`);
        const data = response.data;

        if (data && Array.isArray(data)) {
          const groupedData = {};
          data.forEach((item) => {
            const instructor = item.instructor || "Unknown";
            const monthYear = `${item.month}/${item.year}`;
            if (!groupedData[instructor]) {
              groupedData[instructor] = [];
            }
            groupedData[instructor].push({ x: monthYear, y: item.totalRevenue || 0 });
          });

          const formattedData = Object.entries(groupedData).map(([instructor, values]) => ({
            name: instructor,
            data: values,
          }));

          setChartData(formattedData);
        } else {
          setError("No data available");
        }
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData.length) return <div>No data to display</div>;

  const xAxisLabels = Array.from(
    new Set(chartData.flatMap((item) => item.data.map((entry) => entry.x)))
  ).sort();

  const formattedSeries = chartData.map((item) => ({
    name: item.name,
    data: xAxisLabels.map(
      (label) => item.data.find((entry) => entry.x === label)?.y || 0
    ),
  }));

  const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại (0-based nên +1)
  const currentYear = new Date().getFullYear(); // Năm hiện tại

  const currentMonthRevenue = chartData.map((item) => ({
    name: item.name,
    totalRevenue: item.data
      .filter((entry) => {
        const [month, year] = entry.x.split("/").map(Number);
        return month === currentMonth && year === currentYear;
      })
      .reduce((acc, curr) => acc + curr.y, 0),
  }));

  const pastMonthRevenue = chartData.map((item) => ({
    name: item.name,
    pastData: item.data.filter((entry) => {
      const [month, year] = entry.x.split("/").map(Number);
      return !(month === currentMonth && year === currentYear);
    }),
  }));

  return (
    <div>
      <h3>Revenue by Instructor and Month</h3>
      <p>
        This chart visualizes the monthly revenue for each instructor. Each bar
        represents the revenue generated by a specific instructor for a given
        month. The legend below the chart maps the bar colors to the respective
        instructors.
      </p>
      <BarChart
        series={formattedSeries}
        height={400}
        xAxis={[
          {
            data: xAxisLabels,
            scaleType: "band",
            labelRotation: -45, // Xoay nhãn trục X
            tickInterval: 1, // Hiển thị đầy đủ nhãn
          },
        ]}
        margin={{ top: 10, bottom: 60, left: 50, right: 10 }}
        barWidth={20} // Thu nhỏ các cột
        barGap={10} // Tăng khoảng cách giữa các nhóm cột
        tooltip={{
          trigger: "item",
          formatter: (params) =>
            `${params.seriesName}: ${params.data.toLocaleString()} VND (on ${params.name})`,
        }}
        legend={{
          position: "bottom", // Chú thích nằm dưới
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <h4>Revenue for Current Month ({currentMonth}/{currentYear})</h4>
        <ul>
          {currentMonthRevenue.map((item) => (
            <li key={item.name}>
              <strong>{item.name}:</strong> {item.totalRevenue.toLocaleString()} VND
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h4>Past Revenue</h4>
        {pastMonthRevenue.map((item) => (
          <div key={item.name}>
            <h5>{item.name}</h5>
            <ul>
              {item.pastData.map((entry, index) => (
                <li key={index}>
                  {entry.x}: {entry.y.toLocaleString()} VND
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
