import { useEffect, useRef } from "react";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const GraphComponent = ({ data, labels, height, width }: { data: number[], labels: string[], height: number, width: number }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null); // Reference to the canvas element
    let chartInstance = useRef<Chart | null>(null);

    const chartData = {
        labels: labels, // x-axis labels
        datasets: [
            {
                label: "Transaction Volume",
                data: data, // y-axis data points
                borderColor: "rgba(57, 255, 20, 1)", // Line color
                backgroundColor: "rgba(57, 255, 20, 0.2)", // Fill color
                borderWidth: 2,
                tension: 0.3, // Smooth curve
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 12, // Font size for x-axis labels
                    },
                    color: "rgba(255, 255, 255, 0.8)", // Optional: Customize label color
                },
                title: {
                    display: false,
                    text: "Date",
                    font: {
                        size: 12,
                    },
                    color: "rgba(255, 255, 255, 0.8)",
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 12, // Font size for y-axis labels
                    },
                    color: "rgba(255, 255, 255, 0.8)", // Optional: Customize label color
                },
                title: {
                    display: true,
                    text: "Volume",
                    font: {
                        size: 12,
                    },
                    color: "rgba(255, 255, 255, 0.8)",
                },
            },
        },
    };

    useEffect(() => {
        if (!chartRef.current) return; // Ensure the canvas element exists
        const ctx = chartRef.current.getContext("2d"); // Get the canvas context

        if (!ctx) {
            console.error("Failed to get 2D context for canvas.");
            return;
        }

        if (chartInstance.current) {
            // Destroy the old chart if it exists
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, labels]);

    return <canvas ref={chartRef} id="myChart" height={height} width={width}></canvas>;
};

export default GraphComponent;
