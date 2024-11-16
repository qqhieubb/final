import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import { PieChart } from '@mui/x-charts/PieChart';

const UserRolePieChart = () => {
  const [data, setData] = useState(null); // Initially null for loading check

  useEffect(() => {
    axios
      .get(`${server}/api/total_role`)
      .then((response) => {
        const { totalUsers, totalInstructors, totalAdmins } = response.data;

        // Format the data for PieChart component
        setData({
          series: [
            {
              data: [
                { id: 0, value: totalUsers, label: 'User' },
                { id: 1, value: totalInstructors, label: 'Instructor' },
                { id: 2, value: totalAdmins, label: 'Admin' },
              ],
            },
          ],
        });
      })
      .catch((error) => console.log("API call failed:", error));
  }, []);

  if (!data) {
    return <p>Loading...</p>; // Show loading message while data is being fetched
  }

  return (
    <div>
      <h3>User Roles Distribution</h3>
      <PieChart
        series={data.series}
        width={400}
        height={200}
      />
    </div>
  );
};

export default UserRolePieChart;
