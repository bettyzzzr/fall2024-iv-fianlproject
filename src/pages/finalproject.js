import React, { useState, useEffect } from "react";
import { csv } from "d3";
import Heatmap from "../components/Heatmap";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import styles from '../styles/final_project.module.css';

const dataUrl =
 "https://raw.githubusercontent.com/bettyzzzr/fall2024-iv-final-project/refs/heads/main/15国碳排放.csv"
export default function Home() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    // Load data from the URL
    csv(dataUrl).then((parsedData) => {
      setData(parsedData);
    });
  }, []);

  const handleCellClick = (data) => {
    setSelectedData(data);
  };

  return (
    <div className={styles.container}>
      {/* Heatmap Section */}
      <div className={styles.Heatmap}>
        <h1>Fossil CO2 Analysis</h1>
        {data.length > 0 ? (
          <Heatmap data={data} metric="Population" onGridClick={handleCellClick} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      {/* Right-side Charts Section */}
      <div className={styles["right-charts"]}>
        {/* Pie Chart */}
        <div className={styles.PieChart}>
          {selectedData && <PieChart data={preparePieChartData(selectedData)} />}
        </div>

        {/* Line Chart */}
        <div className={styles.LineChart}>
          {selectedData && <LineChart data={prepareLineChartData(data, selectedData)} />}
        </div>
      </div>
    </div>
  );
}

function preparePieChartData(selectedData) {
  const { Coal, Oil, Gas, Cement, Flaring, Other, Total } = selectedData;

  return [
    { label: "Coal", value: Coal, percentage: ((Coal / Total) * 100).toFixed(2) },
    { label: "Oil", value: Oil, percentage: ((Oil / Total) * 100).toFixed(2) },
    { label: "Gas", value: Gas, percentage: ((Gas / Total) * 100).toFixed(2) },
    { label: "Cement", value: Cement, percentage: ((Cement / Total) * 100).toFixed(2) },
    { label: "Flaring", value: Flaring, percentage: ((Flaring / Total) * 100).toFixed(2) },
    { label: "Other", value: Other, percentage: ((Other / Total) * 100).toFixed(2) },
  ];
}


function prepareLineChartData(data, selectedData) {
  return data
    .filter((d) => d.Country === selectedData.Country)
    .map((d) => ({ Year: d.Year, Total: d['Total'], GDP: d["GDP"] }));
}
