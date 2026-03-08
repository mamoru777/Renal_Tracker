import type { ChartOptions } from 'chart.js';
import type { ChartData } from './types';

export const CHART_OPTIONS: ChartOptions<'scatter'> = {
  scales: {
    x: {
      title: { display: true, text: 'Возраст (лет)' },
      ticks: {
        stepSize: 5,
      },
      type: 'linear',
    },
    y: {
      title: { display: true, text: 'Скорость клубочковой фильтрации' },
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: (context) => {
          if (context[0].datasetIndex === 1) {
            return `Минимально допустимый показатель для данной категории`;
          }
          const date = (context[0].raw as ChartData).date;
          const formattedDate = date
            ? new Date(date).toLocaleDateString()
            : 'Неизвестная дата';
          return `Анализы от ${formattedDate}`;
        },
        label: (context) => {
          const xValue = context.parsed.x;
          const yValue = context.parsed.y;
          const currency = (context.raw as ChartData).currency;
          return `Возраст: ${xValue} лет | Показатель: ${yValue!.toFixed(2)} ${currency}`;
        },
      },
    },
  },
  responsive: true,
};
