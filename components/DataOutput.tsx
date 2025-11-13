
import React from 'react';
import { TableCellsIcon } from './icons/TableCellsIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);


interface DataOutputProps {
    data: Record<string, any>[];
    chartConfig: any | null;
}

export const DataOutput: React.FC<DataOutputProps> = ({ data, chartConfig }) => {
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    const renderChart = () => {
        if (!chartConfig || !chartConfig.type || chartConfig.type === 'none') {
            return <div className="text-center p-8 text-text-secondary bg-surface rounded-md">The AI determined that a chart was not applicable for this query.</div>;
        }

        const chartOptions = {
            ...chartConfig.options,
            maintainAspectRatio: false,
        };

        const chartComponent = () => {
             switch (chartConfig.type) {
                case 'bar':
                    return <Bar options={chartOptions} data={chartConfig.data} />;
                case 'line':
                    return <Line options={chartOptions} data={chartConfig.data} />;
                case 'pie':
                    return <Pie options={chartOptions} data={chartConfig.data} />;
                default:
                    return <div className="text-center p-8 text-text-secondary bg-surface rounded-md">Unsupported chart type: {chartConfig.type}</div>;
            }
        }
       
        return (
            <div className="relative h-96">
                {chartComponent()}
            </div>
        )
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border-light">
            <div className="p-4 flex items-center gap-3 border-b border-border-light">
                <ChartBarIcon className="w-6 h-6 text-primary-action" />
                <h3 className="font-bold text-text-primary">Chart Display</h3>
            </div>
            <div className="p-4">
                {renderChart()}
            </div>
            <div className="p-4 flex items-center gap-3 border-t border-border-light">
                <TableCellsIcon className="w-6 h-6 text-primary-action" />
                <h3 className="font-bold text-text-primary">Data Preview</h3>
            </div>
             <div className="p-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-surface">
                        <tr>
                            {headers.map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                    {header.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map(header => (
                                    <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
