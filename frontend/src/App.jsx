import { useEffect, useState } from "react";
import {
  getExpenses,
  getSummary,
  addExpense,
  updateExpense,
  deleteExpense,
} from "./api";
import "./App.css";

const today = new Date().toLocaleDateString("en-CA");
const emptyForm = { amount: "", category: "", expenseDate: today, note: "" };
const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const list = await getExpenses(month, category);
      const sum = month ? await getSummary(month) : null;
      setExpenses(list);
      setSummary(sum);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [month, category]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const body = { ...form, amount: Number(form.amount) };
    try {
      if (editingId) {
        await updateExpense(editingId, body);
      } else {
        await addExpense(body);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(expense) {
    setEditingId(expense.id);
    setForm({
      amount: expense.amount,
      category: expense.category,
      expenseDate: expense.expenseDate,
      note: expense.note ?? "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <h1>Expense Tracker</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="card form">
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          name="expenseDate"
          type="date"
          value={form.expenseDate}
          onChange={handleChange}
        />
        <input
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"} expense</button>
        {editingId && (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="card filters">
        <label>
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {summary && (
        <div className="card summary">
          <h2>Total: {Number(summary.total).toFixed(2)}</h2>
          <ul>
            {Object.entries(summary.byCategory).map(([name, sum]) => (
              <li key={name}>
                {name}: {Number(sum).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <table className="card">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 && (
            <tr>
              <td colSpan="5">No expenses found.</td>
            </tr>
          )}
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.expenseDate}</td>
              <td>{e.category}</td>
              <td>{Number(e.amount).toFixed(2)}</td>
              <td>{e.note}</td>
              <td>
                <button onClick={() => handleEdit(e)}>Edit</button>{" "}
                <button className="danger" onClick={() => handleDelete(e.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}