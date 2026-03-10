import type { ChartOptions } from 'chart.js';
import { ru } from 'date-fns/locale';
import { getAgeString } from '@/utils/helpers';
import type { ChartRawData } from './types';

export const CHART_OPTIONS: ChartOptions<'scatter'> = {
  scales: {
    x: {
      adapters: {
        date: {
          locale: ru,
        },
      },
      title: { display: true, text: 'Дата анализа и возраст' },
      time: {
        displayFormats: {
          day: 'dd.MM.y',
        },
        unit: 'day',
      },
      ticks: {
        source: 'data',

        callback(tickValue, index) {
          const date = new Date(tickValue);

          const chart = this.chart;
          const dataset = chart.data.datasets[0];
          const rawValue = dataset.data[index] as ChartRawData;

          if (rawValue?.age) {
            return `${date.toLocaleDateString()} (${getAgeString(rawValue.age)})`;
          }

          return `${date.toLocaleDateString()}`;
        },

        minRotation: 30,
      },
      bounds: 'data',
      type: 'time',
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
          const date = context[0].parsed.x;
          const formattedDate = date
            ? new Date(date).toLocaleDateString()
            : 'Неизвестная дата';
          return `Анализы от ${formattedDate}`;
        },
        label: (context) => {
          const xValue = (context.raw as ChartRawData).age;
          const yValue = context.parsed.y;
          const currency = (context.raw as ChartRawData).currency;
          return `Возраст: ${xValue} лет | Показатель: ${yValue!.toFixed(2)} ${currency}`;
        },
      },
    },
  },
  responsive: true,
};
