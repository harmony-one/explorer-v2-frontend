import dayjs from "dayjs";

export const getChartOptions = (theme: 'light' | 'dark', points: any) => {
    const [minPoint] = [...points]
        .sort((a: { count: number; }, b: { count: number; }) => a.count - b.count)
    let minY = minPoint ? minPoint.count : 0
    const minPointLog = Math.floor(Math.log10(minY))
    minY = minY - (minY % Math.pow(10, minPointLog))

    const options = {
        responsive: true,
        animation: false,
        animations: {
            colors: false,
            x: false,
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            intersect: false
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            // https://www.chartjs.org/docs/latest/configuration/tooltip.html
            tooltip: {
                intersect: false,
                displayColors: false, // Removes colored square icon
                caretPadding: 8,
                caretSize: 8,
                cornerRadius: 4,
                titleSpacing: 4,
                titleFont: { weight: 400 },
                bodyFont: { weight: 'bold' }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    // color: '#55626d',
                    maxRotation: 0,
                    minRotation: 0,
                    align: 'start',
                    callback: function(value: string, index: any, ticks: any) {
                        const item = points[index]
                        if (index === 0 || index === Math.floor((ticks.length - 1) / 2)) {
                            return dayjs(item.timestamp).format("MMM D")
                        }
                        // TODO: chartJs cannot render last item - it does not fit the container
                        // Render pre-last item and set text of last item
                        if(index === ticks.length - 2) {
                            return dayjs(points[index + 1].timestamp).format("MMM D")
                        }
                        return '';
                    }
                },
            },
            y: {
                min: minY,
                // max: 2300000,
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#55626d',
                    callback: function(value: string, index: any, ticks: any) {
                        if (index === 0 || index === ticks.length - 1) {
                            return Intl.NumberFormat('en-US', {
                                notation: "compact",
                                maximumFractionDigits: 1
                            }).format(+value);
                        }
                        return '';
                    }
                }
            }
        },
        tension: 0.4, // Curve line
        borderWidth: 1,
    };
    return options
}