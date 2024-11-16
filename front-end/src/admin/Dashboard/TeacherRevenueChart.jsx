import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { server } from '../../main';

export default function TeacherRevenueChart() {
  const [instructorRevenue, setInstructorRevenue] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${server}/api/total_revenue_teacher`);
        const data = response.data;
        
        // Extract instructor names and revenue for chart
        const instructors = data.map(item => item.instructor);
        const revenueData = data.map(item => item.totalRevenue);

        setInstructors(instructors);
        setRevenueData(revenueData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div>
      <h3>Revenue Teacher</h3>
  
      <BarChart
        series={[{ data: revenueData }]}
        height={290}
        xAxis={[{ data: instructors, scaleType: 'band' }]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </div>
  );
}
