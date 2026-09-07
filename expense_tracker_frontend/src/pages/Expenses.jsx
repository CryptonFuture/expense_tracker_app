
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CalendarDays,
  Tag,
  SearchX,
} from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [categories, setCategories] = useState([]);

  const fetchExpenses = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filter.type) params.append('type', filter.type);
      if (filter.category) params.append('category', filter.category);

      const res = await API.get(`/expenses?${params.toString()}`);
      setExpenses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    API.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch(console.error);
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;

    try {
      await API.delete(`/expenses/${id}`);

      setExpenses((prev) =>
        prev.filter((e) => e._id !== id)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-200">
              <Receipt className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Transactions
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage and track all your income & expenses
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/add"
          className="
            group inline-flex items-center justify-center gap-2
            rounded-xl
            bg-gradient-to-r from-primary-600 to-primary-500
            px-5 py-3
            text-sm font-semibold text-white
            shadow-lg shadow-primary-200
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-xl hover:shadow-primary-300
          "
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Add New
        </Link>
      </div>

      {/* =====================================================
          FILTER CARD
      ====================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

        {/* Decorative gradient */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-50 blur-2xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end">

          {/* Filter Heading */}
          <div className="flex items-center gap-3 lg:mr-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <Filter className="h-4 w-4 text-primary-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Filters
              </p>

              <p className="text-xs text-slate-400">
                Refine transactions
              </p>
            </div>
          </div>

          {/* Type */}
          <div className="w-full lg:w-44">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Transaction Type
            </label>

            <div className="relative">
              <ArrowUpRight className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                className="
                  h-11 w-full appearance-none rounded-xl
                  border border-slate-200
                  bg-slate-50/70
                  pl-10 pr-4
                  text-sm text-slate-700
                  outline-none
                  transition
                  hover:border-slate-300
                  focus:border-primary-500
                  focus:bg-white
                  focus:ring-4 focus:ring-primary-500/10
                "
                value={filter.type}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">All Transactions</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="w-full lg:w-52">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </label>

            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                className="
                  h-11 w-full appearance-none rounded-xl
                  border border-slate-200
                  bg-slate-50/70
                  pl-10 pr-4
                  text-sm text-slate-700
                  outline-none
                  transition
                  hover:border-slate-300
                  focus:border-primary-500
                  focus:bg-white
                  focus:ring-4 focus:ring-primary-500/10
                "
                value={filter.category}
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    category: e.target.value,
                  }))
                }
              >
                <option value="">All Categories</option>

                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filter.type || filter.category) && (
            <button
              type="button"
              onClick={() =>
                setFilter({
                  type: '',
                  category: '',
                })
              }
              className="
                h-11 rounded-xl border border-slate-200
                bg-white px-4 text-sm font-medium
                text-slate-500 transition
                hover:border-red-200
                hover:bg-red-50
                hover:text-red-600
              "
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          TRANSACTIONS CARD
      ====================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">

        {/* Card Header */}
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <div>
            <h2 className="font-bold text-slate-800">
              All Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {expenses.length} transaction
              {expenses.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {!loading && expenses.length > 0 && (
            <div className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              Showing {expenses.length}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center">

            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />

              <WalletIcon />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading transactions...
            </p>
          </div>
        ) : expenses.length === 0 ? (

          /* Empty State */
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
              <SearchX className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="text-base font-bold text-slate-700">
              No transactions found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Try changing your filters or add your first
              transaction to get started.
            </p>

            <Link
              to="/add"
              className="
                mt-6 inline-flex items-center gap-2
                rounded-xl
                bg-gradient-to-r from-primary-600 to-primary-500
                px-5 py-3
                text-sm font-semibold text-white
                shadow-lg shadow-primary-200
                transition-all
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              <Plus className="h-4 w-4" />
              Add your first transaction
            </Link>
          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================== */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Transaction
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {expenses.map((exp) => {

                  const isIncome = exp.type === 'income';

                  return (
                    <tr
                      key={exp._id}
                      className="
                        group
                        transition-colors duration-200
                        hover:bg-primary-50/30
                      "
                    >

                      {/* Transaction */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`
                              flex h-11 w-11 shrink-0
                              items-center justify-center
                              rounded-xl
                              ${
                                isIncome
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-red-50 text-red-500'
                              }
                            `}
                          >
                            {isIncome ? (
                              <ArrowDownRight className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-800">
                              {exp.title}
                            </p>

                            {exp.description && (
                              <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                                {exp.description}
                              </p>
                            )}

                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">

                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          <Tag className="h-3 w-3 text-slate-400" />
                          {exp.category}
                        </span>

                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-500">

                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          {new Date(exp.date).toLocaleDateString(
                            undefined,
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}

                        </div>

                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-right">

                        <span
                          className={`
                            inline-flex items-center rounded-lg
                            px-3 py-1.5
                            text-sm font-bold
                            ${
                              isIncome
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-red-50 text-red-600'
                            }
                          `}
                        >
                          {isIncome ? '+' : '-'}₹
                          {exp.amount.toLocaleString()}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">

                        <div className="flex items-center justify-end gap-1">

                          <Link
                            to={`/edit/${exp._id}`}
                            title="Edit transaction"
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-xl
                              text-slate-400
                              transition-all
                              hover:bg-primary-50
                              hover:text-primary-600
                            "
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(exp._id)}
                            title="Delete transaction"
                            className="
                              flex h-9 w-9 items-center justify-center
                              rounded-xl
                              text-slate-400
                              transition-all
                              hover:bg-red-50
                              hover:text-red-600
                            "
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* Small loading icon */
function WalletIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Receipt className="h-4 w-4 text-primary-600" />
    </div>
  );
}

