import {palette} from "../../theme";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import {MetricsDailyItem} from "../../types";
import {ChartOption, ChartOptions} from "./ChartFilter";

dayjs.extend(dayOfYear)

export const getChartData = (themeMode: string, items: MetricsDailyItem[], label: string) => {
    return {
        labels: items.map((i) => dayjs(i.date).format("dddd, MMMM DD YYYY")),
        datasets: [{
            label,
            data: items.map((i) => +i.value),
            borderColor: themeMode === 'light' ? palette.Purple : palette.MintGreen,
            borderWidth: 2,
            backgroundColor: 'white',
            pointRadius: 0,
            pointHoverRadius: 8,
            pointBorderWidth: 0,
            pointBorderColor: 'transparent',
            pointHoverBackgroundColor: themeMode === 'light' ? 'rgba(85, 98, 109, 0.4)' : 'rgba(105, 250, 189, 0.4)',
        }]
    }
}

export interface OptionsConfig {
    yAxisLabel?: string
}

export const getDetailedChartOptions = (themeMode: 'light' | 'dark', points: any, config: OptionsConfig = {}) => {
    const { yAxisLabel } = config

    const [minPoint] = [...points]
        .sort((a: { value: string; }, b: { value: string; }) => +a.value - +b.value)
    let minY = minPoint ? minPoint.value : 0
    const minPointLog = Math.floor(Math.log10(minY))
    minY = minY - (minY % Math.pow(10, minPointLog))

    const ticksColor = themeMode === 'light' ? palette.DarkGray : palette.WhiteGrey
    const tooltipColor = themeMode === 'light' ? '#3f4850' : palette.WhiteGrey
    const tooltipBorderColor = themeMode === 'light' ? '#3f4850' : palette.DarkBlue
    const tooltipBackground = themeMode === 'light' ? 'rgba(244, 247, 249, 0.85)' : 'rgba(27, 41, 94, 0.95)'

    return {
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
                titleFont: { weight: 400, size: 10 },
                bodyFont: { weight: 'bold' },
                backgroundColor: tooltipBackground,
                borderColor: tooltipBorderColor,
                borderWidth: 1,
                titleColor: tooltipColor,
                bodyColor: tooltipColor
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: true,
                },
                ticks: {
                    color: ticksColor,
                    maxTicksLimit: 1000,
                    maxRotation: 0,
                    minRotation: 0,
                    align: 'start',
                    callback: function(value: string, index: any, ticks: any) {
                        const item = points[index]
                        const nextItem = points[index + 1]
                        // Month change
                        if(nextItem) {
                            if (dayjs(item.timestamp).month() !== dayjs(nextItem.timestamp).month() &&
                                ([0, 6].includes(dayjs(item.timestamp).month()))) {
                                return dayjs(item.timestamp).format("MMM 'YY")
                            }
                        }
                        return '';
                    }
                },
            },
            y: {
                min: minY,
                title: {
                    display: !!yAxisLabel,
                    text: yAxisLabel
                },
                grid: {
                    display: true,
                    drawBorder: true,
                },
                ticks: {
                    color: ticksColor,
                    callback: function(value: string, index: any, ticks: any) {
                        if (index === 0 || index === ticks.length - 1 || index === Math.round(ticks.length / 2 - 1)) {
                            return Intl.NumberFormat('en-US', {
                                notation: "compact",
                                maximumFractionDigits: 4
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
}

export const enrichResponse = (items: MetricsDailyItem[]) => {
    return items.reverse().map(item => ({
        ...item,
        timestamp: item.date
    }))
}

export const getLimitByFilterOption = (option: ChartOption) => {
    switch(option) {
        case ChartOption.month: return 30
        case ChartOption.month3: return 30 * 3
        case ChartOption.year: {
            return 365
        }
        case ChartOption.ytd: {
            const date1 = dayjs()
            const date2 = dayjs().startOf('year')
            return date1.diff(date2, 'day')
        }
        case ChartOption.all: return 1000
        default:
            return 1000
    }
}
