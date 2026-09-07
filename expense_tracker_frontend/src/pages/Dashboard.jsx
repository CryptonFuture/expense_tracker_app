import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CalendarDays,
  PieChart as PieChartIcon,
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#64748b',
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, expensesRes] = await Promise.all([
          API.get('/expenses/stats'),
          API.get('/expenses?limit=5'),
        ]);

        setStats(statsRes.data.data);
        setRecent(expensesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="relative">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-600" />
          </div>
        </div>

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  /* =========================================================
     PIE / BAR CHART DATA
  ========================================================== */

  const chartData = (stats?.byCategory || []).map((c) => ({
    name: c._id,
    value: Number(c.total) || 0,
  }));

  /* =========================================================
     LINE / AREA CHART DATA
     Uses existing recent transactions.
  ========================================================== */

  const lineData = [...recent]
    .reverse()
    .map((item, index) => ({
      name:
        item.title?.length > 12
          ? `${item.title.substring(0, 12)}...`
          : item.title || `Transaction ${index + 1}`,

      amount: Number(item.amount) || 0,

      income:
        item.type === 'income'
          ? Number(item.amount) || 0
          : 0,

      expense:
        item.type === 'expense'
          ? Number(item.amount) || 0
          : 0,
    }));

  const balance = stats?.balance || 0;

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 p-6 shadow-xl sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="mb-3 flex items-center gap-2">

              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                <Activity className="h-4 w-4 text-primary-300" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                Financial Overview
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Keep track of your income, expenses and balance.
            </p>

          </div>

          <Link
            to="/add"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-xl"
          >
            <Plus className="h-4 w-4 text-primary-600 transition-transform group-hover:rotate-90" />

            Add Transaction

            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

        </div>
      </div>


      {/* =====================================================
          STATS CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Income */}

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />

          <div className="relative flex items-start justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Income
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">
                ₹{(stats?.income || 0).toLocaleString()}
              </p>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                Income
              </div>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>

          </div>
        </div>


        {/* Expense */}

        <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-100">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-100/60 blur-2xl" />

          <div className="relative flex items-start justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Expense
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-red-700">
                ₹{(stats?.expense || 0).toLocaleString()}
              </p>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                <TrendingDown className="h-3 w-3" />
                Spending
              </div>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>

          </div>
        </div>


        {/* Balance */}

        <div className="group relative overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-100">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-100/70 blur-2xl" />

          <div className="relative flex items-start justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Balance
              </p>

              <p
                className={`mt-2 text-2xl font-bold tracking-tight ${
                  balance >= 0
                    ? 'text-primary-700'
                    : 'text-red-600'
                }`}
              >
                ₹{balance.toLocaleString()}
              </p>

              <div
                className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  balance >= 0
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <Wallet className="h-3 w-3" />

                {balance >= 0
                  ? 'Positive balance'
                  : 'Negative balance'}
              </div>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <Wallet className="h-6 w-6 text-primary-600" />
            </div>

          </div>
        </div>

      </div>


      {/* =====================================================
          PIE + BAR CHARTS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ===================================================
            PIE CHART
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                <PieChartIcon className="h-5 w-5 text-primary-600" />
              </div>

              <div>

                <h2 className="font-bold text-slate-800">
                  Expenses by Category
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Spending distribution
                </p>

              </div>

            </div>

          </div>


          <div className="p-4 sm:p-6">

            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    cornerRadius={5}
                    dataKey="value"
                  >

                    {chartData.map((_, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />

                    ))}

                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString()}`
                    }
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow:
                        '0 10px 30px rgba(15,23,42,0.10)',
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={45}
                    iconType="circle"
                  />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-64 flex-col items-center justify-center text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                  <PieChartIcon className="h-6 w-6 text-slate-300" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  No expense data yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add transactions to see your spending breakdown.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ===================================================
            BAR CHART
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <BarChart3 className="h-5 w-5 text-orange-500" />
              </div>

              <div>

                <h2 className="font-bold text-slate-800">
                  Category Spending
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Compare expenses by category
                </p>

              </div>

            </div>

          </div>


          <div className="p-4 sm:p-6">

            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString()}`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString()}`
                    }
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow:
                        '0 10px 30px rgba(15,23,42,0.10)',
                    }}
                  />

                  <Bar
                    dataKey="value"
                    name="Expense"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    barSize={34}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-64 flex-col items-center justify-center text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                  <BarChart3 className="h-6 w-6 text-slate-300" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  No spending data
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add expenses to generate your category chart.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


   
{/* =====================================================
    LINE + AREA CHARTS
====================================================== */}

<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

  {/* ===================================================
      LINE CHART - LEFT
  ==================================================== */}

  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

    {/* Header */}

    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          <LineChartIcon className="h-5 w-5 text-violet-600" />
        </div>

        <div>

          <h2 className="font-bold text-slate-800">
            Transaction Trend
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Recent income and expense activity
          </p>

        </div>

      </div>

      {/* Legend */}

      <div className="hidden items-center gap-3 text-xs sm:flex">

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-500">
            Income
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="font-medium text-slate-500">
            Expense
          </span>
        </div>

      </div>

    </div>


    {/* Chart */}

    <div className="p-4 sm:p-6">

      {lineData.length > 0 ? (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <LineChart
            data={lineData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 10,
                fill: '#64748b',
              }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />

            <YAxis
              tick={{
                fontSize: 10,
                fill: '#64748b',
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString()}`
              }
            />

            <Tooltip
              formatter={(value, name) => [
                `₹${Number(value).toLocaleString()}`,
                name === 'income'
                  ? 'Income'
                  : 'Expense',
              ]}
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow:
                  '0 12px 35px rgba(15,23,42,0.12)',
                padding: '10px 12px',
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={35}
              iconType="circle"
            />

            {/* Income */}

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: '#ffffff',
              }}
              activeDot={{
                r: 6,
              }}
            />

            {/* Expense */}

            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: '#ffffff',
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      ) : (

        <div className="flex h-64 flex-col items-center justify-center text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
            <LineChartIcon className="h-6 w-6 text-slate-300" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            No transaction trend available
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add transactions to see your activity trend.
          </p>

          <Link
            to="/add"
            className="mt-4 text-xs font-semibold text-primary-600 hover:underline"
          >
            Add transaction
          </Link>

        </div>

      )}

    </div>

  </div>


  {/* ===================================================
      AREA CHART - RIGHT
  ==================================================== */}

  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

    {/* Header */}

    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
          <Activity className="h-5 w-5 text-cyan-600" />
        </div>

        <div>

          <h2 className="font-bold text-slate-800">
            Cash Flow Overview
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Income vs expense activity
          </p>

        </div>

      </div>

      {/* Legend */}

      <div className="hidden items-center gap-3 text-xs sm:flex">

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-500">
            Income
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="font-medium text-slate-500">
            Expense
          </span>
        </div>

      </div>

    </div>


    {/* Chart */}

    <div className="p-4 sm:p-6">

      {lineData.length > 0 ? (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <AreaChart
            data={lineData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 5,
            }}
          >

            {/* Gradients */}

            <defs>

              <linearGradient
                id="incomeAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#10b981"
                  stopOpacity={0.40}
                />

                <stop
                  offset="50%"
                  stopColor="#10b981"
                  stopOpacity={0.15}
                />

                <stop
                  offset="100%"
                  stopColor="#10b981"
                  stopOpacity={0.02}
                />

              </linearGradient>


              <linearGradient
                id="expenseAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#ef4444"
                  stopOpacity={0.35}
                />

                <stop
                  offset="50%"
                  stopColor="#ef4444"
                  stopOpacity={0.12}
                />

                <stop
                  offset="100%"
                  stopColor="#ef4444"
                  stopOpacity={0.02}
                />

              </linearGradient>

            </defs>


            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e2e8f0"
            />


            <XAxis
              dataKey="name"
              tick={{
                fontSize: 10,
                fill: '#64748b',
              }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />


            <YAxis
              tick={{
                fontSize: 10,
                fill: '#64748b',
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString()}`
              }
            />


            <Tooltip
              formatter={(value, name) => [
                `₹${Number(value).toLocaleString()}`,
                name === 'Income'
                  ? 'Income'
                  : 'Expense',
              ]}
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow:
                  '0 12px 35px rgba(15,23,42,0.12)',
                padding: '10px 12px',
              }}
            />


            <Legend
              verticalAlign="top"
              align="right"
              height={35}
              iconType="circle"
            />


            {/* Income Area */}

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#incomeAreaGradient)"
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: '#ffffff',
              }}
            />


            {/* Expense Area */}

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#expenseAreaGradient)"
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: '#ffffff',
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      ) : (

        <div className="flex h-64 flex-col items-center justify-center text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
            <Activity className="h-6 w-6 text-slate-300" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            No cash flow data
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add transactions to visualize your cash flow.
          </p>

          <Link
            to="/add"
            className="mt-4 text-xs font-semibold text-primary-600 hover:underline"
          >
            Add transaction
          </Link>

        </div>

      )}

    </div>

  </div>

</div>



      {/* =====================================================
          RECENT TRANSACTIONS
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
              <Receipt className="h-5 w-5 text-violet-600" />
            </div>

            <div>

              <h2 className="font-bold text-slate-800">
                Recent Transactions
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Your latest activity
              </p>

            </div>

          </div>

          <Link
            to="/expenses"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-primary-600 transition hover:bg-primary-50"
          >
            View all

            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

        </div>


        <div className="p-4 sm:p-5">

          {recent.length === 0 ? (

            <div className="flex h-56 flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                <Receipt className="h-6 w-6 text-slate-300" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                No transactions yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your recent activity will appear here.
              </p>

              <Link
                to="/add"
                className="mt-4 text-xs font-semibold text-primary-600 hover:underline"
              >
                Add your first transaction
              </Link>

            </div>

          ) : (

            <div className="space-y-1">

              {recent.map((exp) => {

                const isIncome = exp.type === 'income';

                return (

                  <div
                    key={exp._id}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-slate-50"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isIncome
                            ? 'bg-emerald-50'
                            : 'bg-red-50'
                        }`}
                      >

                        {isIncome ? (

                          <ArrowDownRight className="h-5 w-5 text-emerald-600" />

                        ) : (

                          <ArrowUpRight className="h-5 w-5 text-red-500" />

                        )}

                      </div>


                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-slate-700">
                          {exp.title}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">

                          <span>
                            {exp.category}
                          </span>

                          <span className="text-slate-300">
                            •
                          </span>

                          <CalendarDays className="h-3 w-3" />

                          <span>
                            {new Date(exp.date).toLocaleDateString()}
                          </span>

                        </div>

                      </div>

                    </div>


                    <div className="shrink-0 text-right">

                      <p
                        className={`text-sm font-bold ${
                          isIncome
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}
                      >

                        {isIncome ? '+' : '-'}₹
                        {exp.amount.toLocaleString()}

                      </p>

                      <span
                        className={`mt-1 inline-block text-[10px] font-medium ${
                          isIncome
                            ? 'text-emerald-500'
                            : 'text-red-400'
                        }`}
                      >
                        {isIncome
                          ? 'Income'
                          : 'Expense'}
                      </span>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

