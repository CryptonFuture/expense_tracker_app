import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  Receipt,
  Tag,
  CalendarDays,
  FileText,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AddExpense() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch(console.error);

    if (isEdit) {
      API.get(`/expenses/${id}`)
        .then((res) => {
          const e = res.data.data;

          setForm({
            title: e.title,
            amount: e.amount,
            category: e.category,
            type: e.type,
            date: new Date(e.date).toISOString().split('T')[0],
            description: e.description || '',
          });
        })
        .catch(() => navigate('/expenses'));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (isEdit) {
        await API.put(`/expenses/${id}`, payload);
      } else {
        await API.post('/expenses', payload);
      }

      navigate('/expenses');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) => c.type === form.type || c.type === 'both'
  );

  const isExpense = form.type === 'expense';

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 hover:shadow-md"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>

      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 p-6 shadow-xl sm:p-8">

        {/* Glow */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur">
              {isEdit ? (
                <Receipt className="h-7 w-7 text-primary-300" />
              ) : (
                <Wallet className="h-7 w-7 text-primary-300" />
              )}
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary-300" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-300">
                  Transaction Manager
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {isEdit ? 'Edit Transaction' : 'Add Transaction'}
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                {isEdit
                  ? 'Update your transaction details'
                  : 'Record a new income or expense'}
              </p>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur sm:block">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Transaction Type
            </p>
            <div className="mt-1 flex items-center gap-2">
              {isExpense ? (
                <TrendingDown className="h-4 w-4 text-red-400" />
              ) : (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              )}

              <span className="text-sm font-semibold text-white">
                {isExpense ? 'Expense' : 'Income'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">

        {/* Card Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <Receipt className="h-5 w-5 text-primary-600" />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Transaction Details
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Enter the information below
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-5 sm:p-7"
        >

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Unable to save transaction
                </p>
                <p className="mt-0.5 text-xs text-red-500">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Transaction Type */}
          <div>
            <label className="mb-2.5 block text-sm font-bold text-slate-700">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              {/* Expense */}
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    type: 'expense',
                    category: '',
                  }))
                }
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                  form.type === 'expense'
                    ? 'border-red-200 bg-gradient-to-br from-red-50 to-white shadow-md shadow-red-100'
                    : 'border-slate-200 bg-white hover:border-red-100 hover:bg-red-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                      form.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-500'
                    }`}
                  >
                    <TrendingDown className="h-5 w-5" />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-bold ${
                        form.type === 'expense'
                          ? 'text-red-700'
                          : 'text-slate-700'
                      }`}
                    >
                      Expense
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Money spent
                    </p>
                  </div>
                </div>

                {form.type === 'expense' && (
                  <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                )}
              </button>

              {/* Income */}
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    type: 'income',
                    category: '',
                  }))
                }
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                  form.type === 'income'
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-md shadow-emerald-100'
                    : 'border-slate-200 bg-white hover:border-emerald-100 hover:bg-emerald-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                      form.type === 'income'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-500'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-bold ${
                        form.type === 'income'
                          ? 'text-emerald-700'
                          : 'text-slate-700'
                      }`}
                    >
                      Income
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Money received
                    </p>
                  </div>
                </div>

                {form.type === 'income' && (
                  <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-emerald-500" />
                )}
              </button>
            </div>
          </div>

          {/* Title + Amount */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Title
              </label>

              <div className="relative">
                <Receipt className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Grocery shopping"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Amount (₹)
              </label>

              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-bold outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                    isExpense
                      ? 'border-slate-200 text-red-600 focus:border-red-300 focus:ring-red-100'
                      : 'border-slate-200 text-emerald-600 focus:border-emerald-300 focus:ring-emerald-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category
              </label>

              <div className="relative">
                <Tag className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
                >
                  <option value="">Select category</option>

                  {filteredCategories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>

                <ArrowRight className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 rotate-90 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Description
              <span className="ml-1.5 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-4 h-4.5 w-4.5 text-slate-400" />

              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Add any notes or additional details..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100"
              />
            </div>
          </div>

          {/* Summary */}
          <div
            className={`rounded-2xl border p-4 ${
              isExpense
                ? 'border-red-100 bg-red-50/60'
                : 'border-emerald-100 bg-emerald-50/60'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isExpense
                      ? 'bg-red-100 text-red-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {isExpense ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Transaction Summary
                  </p>

                  <p
                    className={`mt-0.5 text-sm font-bold ${
                      isExpense
                        ? 'text-red-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {isExpense ? 'Expense' : 'Income'}
                    {form.category && ` • ${form.category}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Amount
                </p>

                <p
                  className={`mt-0.5 text-xl font-bold ${
                    isExpense
                      ? 'text-red-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {isExpense ? '-' : '+'}₹
                  {form.amount
                    ? Number(form.amount).toLocaleString()
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${
                isExpense
                  ? 'bg-gradient-to-r from-primary-600 via-primary-600 to-violet-600 shadow-primary-200 hover:shadow-primary-300'
                  : 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 shadow-emerald-200 hover:shadow-emerald-300'
              }`}
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {isEdit
                      ? 'Update Transaction'
                      : 'Add Transaction'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Hint */}
      <div className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-slate-400">
        <Wallet className="h-3.5 w-3.5" />
        <span>Your financial data stays organized and easy to manage.</span>
      </div>
    </div>
  );
}


