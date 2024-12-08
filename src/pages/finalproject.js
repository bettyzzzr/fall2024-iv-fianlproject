import React, { useState, useEffect } from "react";
import { csv } from "d3";
import Heatmap from "../components/Heatmap";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import styles from "../styles/final_project.module.css";

const dataUrl =
  "https://raw.githubusercontent.com/bettyzzzr/fall2024-iv-final-project/refs/heads/main/15%E5%9B%BD%E7%A2%B3%E6%8E%92%E6%94%BE.csv";

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null); // Stores the clicked square data

  useEffect(() => {
    // Load data from the URL
    csv(dataUrl).then((parsedData) => {
      parsedData.forEach((d) => {
        d.Year = +d.Year; // Ensure Year is numeric
        d.Total = +d.Total;
        d.Population = +d.Population;
        d.GDP = +d["GDP(usd/one trillion)"]; // Normalize GDP key to match dataset
        d.Coal = +d.Coal;
        d.Oil = +d.Oil;
        d.Gas = +d.Gas;
        d.Cement = +d.Cement;
        d.Flaring = +d.Flaring;
        d.Other = +d.Other;
      });
      setData(parsedData);
    });
  }, []);

  const handleCellClick = (data) => {
    // When a heatmap square is clicked, update selectedData
    setSelectedData(data);
    console.log("Clicked data:", data); // Debugging log to verify clicked square
  };

  return (
    <div className={styles.container}>
      {/* Heatmap Section */}
      <div className={styles.Heatmap}>
        <h1>Fossil CO2 Analysis</h1>
        {data.length > 0 ? (
          <Heatmap
            data={data}
            metric="Population" // Default metric for heatmap
            onGridClick={handleCellClick} // Pass click handler to Heatmap
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      {/* Right-side Charts Section */}
      <div className={styles["right-charts"]}>
        {/* Pie Chart */}
        <div className={styles.PieChart}>
          {selectedData && (
            <PieChart
              data={preparePieChartData(selectedData)} // Pass formatted pie chart data
            />
          )}
        </div>

        {/* Line Chart */}
        <div className={styles.LineChart}>
          {selectedData && (
            <LineChart
              data={prepareLineChartData(data, selectedData)} // Pass formatted line chart data
            />
          )}
        </div>
      </div>
    </div>
  );
}

function preparePieChartData(selectedData) {
  const { Coal, Oil, Gas, Cement, Flaring, Other } = selectedData;
  const total = Coal + Oil + Gas + Cement + Flaring + Other;

  return [
    { label: "Coal", value: Coal, percentage: ((Coal / total) * 100).toFixed(2) },
    { label: "Oil", value: Oil, percentage: ((Oil / total) * 100).toFixed(2) },
    { label: "Gas", value: Gas, percentage: ((Gas / total) * 100).toFixed(2) },
    { label: "Cement", value: Cement, percentage: ((Cement / total) * 100).toFixed(2) },
    { label: "Flaring", value: Flaring, percentage: ((Flaring / total) * 100).toFixed(2) },
    { label: "Other", value: Other, percentage: ((Other / total) * 100).toFixed(2) },
  ];
}

function prepareLineChartData(data, selectedData) {
  return data
    .filter((d) => d.Country === selectedData.Country) // Match the selected country
    .map((d) => ({
      Year: d.Year,
      CO2: d.Total, // Total CO2 emissions
      GDP: d["GDP(usd/one trillion)"], // GDP data
    }));
}
