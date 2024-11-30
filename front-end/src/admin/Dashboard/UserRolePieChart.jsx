import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from "axios";
import { server } from "../../main";

const UserRolePieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/api/total_role`)
      .then((response) => {
        const { totalUsers, totalInstructors, totalAdmins } = response.data;

        setData([
          { label: "User", value: totalUsers, color: "#4CAF50" },
          { label: "Instructor", value: totalInstructors, color: "#FFC107" },
          { label: "Admin", value: totalAdmins, color: "#2196F3" },
        ]);
      })
      .catch((error) => console.error("API error:", error));
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>User Roles Distribution</h3>
      <PieChart
        series={[
          {
            data: data,
            outerRadius: 150,
            innerRadius: 70,
          },
        ]}
        height={400}
        width={400}
      />
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: item.color,
                marginRight: "5px",
              }}
            ></div>
            <span>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRolePieChart;
