import React, { useState } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { DARK_PURPLE } from "../constants/colors";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [type, setType] = useState("products");
  const [category, setCategory] = useState("food");
  const [timeFrame, setTimeFrame] = useState("monthly");

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: `${type} data for ${category}`,
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: `${type} data for ${category}`,
        data: [10, 15, 5, 7, 4, 6],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Food", "Entertainment", "Transport"],
    datasets: [
      {
        label: "Categories",
        data: [300, 500, 200],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Priority Levels",
        data: [120, 150, 100],
        backgroundColor: ["#4BC0C0", "#FF9F40", "#FF6384"],
        hoverBackgroundColor: ["#4BC0C0", "#FF9F40", "#FF6384"],
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
    <div style={styles.pageContainer}>
      <h2 style={{ color: DARK_PURPLE }}>Reports</h2>
      <p style={{ color: DARK_PURPLE }}>
        View your reports by type, category, and time frame.
      </p>

      <div style={styles.selectContainer}>
        <div style={styles.selectItem}>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="products">Products</option>
            <option value="requests">Requests</option>
          </select>
        </div>

        <div style={styles.selectItem}>
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

        <div style={styles.selectItem}>
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

      <div style={styles.chartGrid}>
        <div style={styles.chartContainer}>
          <Line data={data} options={options} />
        </div>
        <div style={styles.chartContainer}>
          <Bar data={barData} options={options} />
        </div>
        <div style={styles.chartContainer}>
          <Pie data={pieData} />
        </div>
        <div style={styles.chartContainer}>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "white",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "90%",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  selectContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  selectItem: {
    color: DARK_PURPLE,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Two columns for 2x2 layout
    gap: "20px",
  },
  chartContainer: {
    width: "100%",
    height: "300px", // Uniform size for all charts
  },
};

export default Reports;
