import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import styles from "./LineChart.module.scss";

const LineChart = ({ chartData, min, max }) => {
  return (
    <article className={styles.chartContainer}>
      <Line
        className={styles.chart}
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
              labels: {
                font: {
                  family: "Outfit",
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                color: "#FFFFFF",
              },
            },

            y: {
              beginAtZero: true,
              min,
              max,
            },
          },
        }}
      />
    </article>
  );
};

export default LineChart;
