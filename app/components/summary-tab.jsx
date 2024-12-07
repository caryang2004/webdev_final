'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { SearchFilters } from '@/app/components/search-filters';
import {Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const categories = [
  'Housing',
  'Utilities',
  'Transportation',
  'Groceries',
  'Health',
  'Insurance',
  'Debt',
  'Savings',
  'Education',
  'Clothing',
  'Taxes',
  'Others',
];

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export function SummaryTab() {

  const [summaryData, setSummaryData] = useState([]);
  const [searchYear, setSearchYear] = useState(0);
  const [searchMonth, setSearchMonth] = useState(0);
  const handleYear = (event) => setSearchYear(event.target.value);
  const handleMonth = (event) => setSearchMonth(event.target.value);

  const handleSearch = (year, month) => {
    // need to recode
    fetchSummaryData(year, month);
  };
  
  const fetchSummaryData = async (year, month) => {
    try {
      // let url = process.env.NEXT_PUBLIC_API_URL;
      let url = '/api/expenses';

      // let year = 2024;
      // let month = 10;
      if (year) {
        url += `?year=${year}`;
        if (month) {
          url += `&month=${month}`;
        }
      }
      console.log("1. URL =",url);
      console.log("1.1 DB_URL", process.env.NEXT_PUBLIC_DATABASE_URL);
      // console.log('3.1. NEXT_PUBLIC_DATABASE_URL:', process.env.NEXT_PUBLIC_DATABASE_URL);
      // console.log('3.2. DATABASE_URL:', process.env.DATABASE_URL);      

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const expenses = await response.json();
      // console.log("3. expenses =",{expenses});
      

      
      // console.log('3.2. dbUrl:', dbUrl);

      // console.log(expenses);
      // Initialize summary with zero values
      const initialSummary = categories.map((category) => ({
        category,
        total: 0,
      }));

      // Only process expenses if we have data
      if (Array.isArray(expenses) && expenses.length > 0) {
        expenses.forEach((expense) => {
          const categoryIndex = categories.indexOf(expense.category);
          if (categoryIndex !== -1) {
            const amount = parseFloat(expense.amount) || 0;
            const quantity = parseInt(expense.quantity) || 0;
            initialSummary[categoryIndex].total += amount * quantity;
          }
        });
      }

      // Ensure all `total` values are valid numbers
      setSummaryData(
        initialSummary.map((item) => ({
          ...item,
          total: isNaN(item.total) ? 0 : item.total, // Default invalid values to 0
        }))
      );
      // console.log("4. summaryData", summaryData);

    } catch (error) {
      console.error('Error fetching summary data:', error);
      setSummaryData(
        categories.map((category) => ({
          category,
          total: 0,
        }))
      );
    }
  };

  useEffect(() => {
    fetchSummaryData(searchYear, searchMonth);
  }, [searchYear, searchMonth]);

  

  const totalExpenses = summaryData.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );

  // const validChartData = summaryData.map((item) => ({
  //   category: item.category,
  //   total: Number(item.total) || 0, // Ensure `total` is a number
  // }));

  const chartData = {
    labels: summaryData.map((item) => item.category),
    datasets: [
      {
        label: 'Total Amount ($)',
        data: summaryData.map((item) => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // useEffect(() => {
  //   console.log('validChartData before rendering BarChart:', validChartData);
  // }, [validChartData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Expense Categories',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Amount ($)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-4">
      <SearchFilters onSearch={handleSearch} />

      <Card>
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summaryData.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium">{item.category}</span>
                <span>${item.total.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>${totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>  
  );
}



