import React, { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { server } from '../../main';

export default function CategoryPieChart() {
  const [categoryData, setCategoryData] = useState([]);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${server}/api/total_course_category`);
        const data = response.data;

        // Calculate total courses for percentage calculation
        const totalCourses = data.reduce((acc, curr) => acc + curr.totalCourses, 0);

        // Calculate percentage for each category and assign random color
        const categoryData = data.map(item => ({
          label: item.category,
          value: ((item.totalCourses / totalCourses) * 100).toFixed(2), // Store as percentage
          color: getRandomColor() // Assign a random color to each category
        }));

        setCategoryData(categoryData);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }
    
    fetchData();
  }, []);

  // Function to generate random color for each category
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Function to calculate percentage label
  const getArcLabel = (params) => `${params.value}%`;

  return (
    <PieChart
      series={[
        {
          outerRadius: 100,
          data: categoryData,
          arcLabel: getArcLabel,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontSize: 12,
        },
      }}
      height={200} // Increased height to allow more space
      width={560} // Increased width to allow more space
    />
  );
}
