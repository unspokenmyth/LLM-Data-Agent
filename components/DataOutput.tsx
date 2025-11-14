import React, { useRef } from 'react';
import { TableCellsIcon } from './icons/TableCellsIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CollapsibleCard } from './CollapsibleCard';
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

const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const DataOutput: React.FC<DataOutputProps> = ({ data, chartConfig }) => {
    const chartRef = useRef<ChartJS<'bar' | 'line' | 'pie'>>(null);
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    const handleDownloadChart = () => {
        const chart = chartRef.current;
        if (chart) {
            const url = chart.toBase64Image();
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chart.png';
            a.click();
        }
    };
    
    const handleDownloadData = () => {
        if (data.length === 0) return;
        const csvHeader = headers.join(',') + '\n';
        const csvBody = data.map(row => 
            headers.map(header => {
                let value = row[header];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            }).join(',')
        ).join('\n');
        downloadFile(csvHeader + csvBody, 'data_preview.csv', 'text/csv');
    };

    const renderChart = () => {
        if (!chartConfig || !chartConfig.type || chartConfig.type === 'none') {
            return <div className="text-center p-8 text-text-secondary bg-surface rounded-md">The AI determined that a chart was not applicable for this query.</div>;
        }

        const chartOptions = { ...chartConfig.options, maintainAspectRatio: false };

        const chartComponent = () => {
             switch (chartConfig.type) {
                case 'bar': return <Bar ref={chartRef} options={chartOptions} data={chartConfig.data} />;
                case 'line': return <Line ref={chartRef} options={chartOptions} data={chartConfig.data} />;
                case 'pie': return <Pie ref={chartRef} options={chartOptions} data={chartConfig.data} />;
                default: return <div className="text-center p-8 text-text-secondary bg-surface rounded-md">Unsupported chart type: {chartConfig.type}</div>;
            }
        }
       
        return <div className="relative h-96">{chartComponent()}</div>;
    };

    const renderCellContent = (value: any) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    const actions = (
        <>
            {chartConfig && chartConfig.type !== 'none' && (
                <button onClick={handleDownloadChart} className="p-1 text-text-secondary hover:text-text-primary" aria-label="Download chart">
                    <DownloadIcon className="w-5 h-5" />
                </button>
            )}
        </>
    );

    return (
         <CollapsibleCard
            title="Chart & Data Preview"
            icon={<ChartBarIcon className="w-6 h-6" />}
            actions={actions}
            defaultOpen={true}
        >
            <div className="p-4">
                {renderChart()}
            </div>
             <div className="p-4 border-t border-border-light overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-3">
                        <TableCellsIcon className="w-6 h-6 text-text-secondary" />
                        <h4 className="font-bold text-text-primary">Data Preview</h4>
                    </div>
                    <button onClick={handleDownloadData} className="p-1 text-text-secondary hover:text-text-primary" aria-label="Download data preview">
                        <DownloadIcon className="w-5 h-5" />
                    </button>
                </div>
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
                                        {renderCellContent(row[header])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CollapsibleCard>
    );
};