import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { server } from "../../main";

export default function CategoryPieChart() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${server}/api/total_course_category`);
        const data = response.data;

        const totalCourses = data.reduce((acc, curr) => acc + curr.totalCourses, 0);

        const categoryData = data.map((item, index) => ({
          label: item.category,
          value: ((item.totalCourses / totalCourses) * 100).toFixed(1),
          color: getFixedColor(index),
        }));

        setCategoryData(categoryData);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

    fetchData();
  }, []);

  // Xóa Legend mặc định từ DOM sau khi render
  useEffect(() => {
    const legendElement = document.querySelector(".MuiChartsLegend-root"); // Tìm phần tử Legend
    if (legendElement) {
      legendElement.remove(); // Xóa phần tử khỏi DOM
    }
  }, [categoryData]);

  const getFixedColor = (index) => {
    const colors = [
      "#4CAF50",
      "#2196F3",
      "#FF5722",
      "#FFC107",
      "#9C27B0",
      "#3F51B5",
      "#FF9800",
      "#607D8B",
      "#8BC34A",
      "#E91E63",
    ];
    return colors[index % colors.length];
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
            
      <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <PieChart
          series={[
            {
              outerRadius: 150,
              innerRadius: 70,
              data: categoryData,
              arcLabel: () => "", // Không hiển thị nhãn trong lát cắt
            },
          ]}
          height={400} // Đảm bảo canvas vuông
          width={400} // Đảm bảo canvas vuông
        />
        {/* Custom Legend */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
          {categoryData.map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: item.color,
                  marginRight: "5px",
                }}
              ></div>
              <span style={{ fontSize: "14px" }}>{item.label}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
