import React, { useState } from "react";
import { Line } from "react-chartjs-2"; // Example chart component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DARK_PURPLE } from "../constants/colors";
import { color } from "chart.js/helpers";

// Registering required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [type, setType] = useState("products"); // Default type: 'products'
  const [category, setCategory] = useState("food"); // Default category: 'food'
  const [timeFrame, setTimeFrame] = useState("monthly"); // Default time frame: 'monthly'

  // Dummy data for the chart (can be dynamic based on selected filters)
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: `${type} data for ${category}`,
        data: [12, 19, 3, 5, 2, 3], // Example data, replace with actual data
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      },
    },
  };

  return (
    <div style={pageStyles.pageContainer}>
      <h2 style={{ color: DARK_PURPLE }}>Reports</h2>
      <p style={{ color: DARK_PURPLE }}>
        View your reports by type, category, and time frame.
      </p>

      <div style={selectContainerStyles}>
        <div style={selectItemStyles}>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="products">Products</option>
            <option value="requests">Requests</option>
          </select>
        </div>

        <div style={selectItemStyles}>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
            <option value="transport">Transport</option>
          </select>
        </div>

        <div style={selectItemStyles}>
          <label>Time Frame:</label>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div style={chartContainerStyles}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    backgroundColor: "white",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    width: "80%",
    height: "80%",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
};

const selectContainerStyles = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
};

const selectItemStyles = {
  color: DARK_PURPLE,
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const chartContainerStyles = {
  marginTop: "20px",
};

export default Reports;
