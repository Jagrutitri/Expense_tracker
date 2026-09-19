import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api";

const categories = [
  "food",
  "travel",
  "bills",
  "shopping",
  "other"
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "food"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async (selectedCategory = filter) => {
    try {
      setLoading(true);
      setError("");

      let url = `${API_URL}/expenses`;

      if (selectedCategory !== "all") {
        url += `?category=${selectedCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch expenses"
        );
      }

      setExpenses(data);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(
        `${API_URL}/expenses/summary`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch summary"
        );
      }

      setSummary(data);

    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: form.title,
            amount: Number(form.amount),
            category: form.category
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add expense"
        );
      }

      setForm({
        title: "",
        amount: "",
        category: "food"
      });

      await fetchExpenses();
      await fetchSummary();

    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/expenses/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete expense"
        );
      }

      await fetchExpenses();
      await fetchSummary();

    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = async (event) => {
    const selectedCategory = event.target.value;

    setFilter(selectedCategory);

    await fetchExpenses(selectedCategory);
  };

  const grandTotal = useMemo(() => {
    return summary.reduce(
      (total, item) => total + item.total,
      0
    );
  }, [summary]);

  return (
    <div className="container">

      <h1>Mini Expense Tracker</h1>

      <section className="card">

        <h2>Add Expense</h2>

        <form
          className="expense-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Expense title"
            value={form.title}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value
              })
            }
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(event) =>
              setForm({
                ...form,
                amount: event.target.value
              })
            }
          />

          <select
            value={form.category}
            onChange={(event) =>
              setForm({
                ...form,
                category: event.target.value
              })
            }
          >

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}

          </select>

          <button type="submit">
            Add Expense
          </button>

        </form>

      </section>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <section className="card">

        <div className="section-header">

          <h2>Expenses</h2>

          <select
            value={filter}
            onChange={handleFilterChange}
          >

            <option value="all">
              All
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}

          </select>

        </div>

        {loading ? (
          <p>Loading...</p>

        ) : expenses.length === 0 ? (
          <p>No expenses yet.</p>

        ) : (

          <table>

            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {expenses.map((expense) => (
                <tr key={expense._id}>

                  <td>
                    {expense.title}
                  </td>

                  <td>
                    ₹{expense.amount.toFixed(2)}
                  </td>

                  <td>
                    {expense.category}
                  </td>

                  <td>
                    {new Date(
                      expense.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleDelete(expense._id)
                      }
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </section>

      <section className="card">

        <h2>Summary</h2>

        {summary.length === 0 ? (

          <p>No expenses yet.</p>

        ) : (

          <>
            {summary.map((item) => (
              <div
                className="summary-row"
                key={item.category}
              >
                <span>
                  {item.category}
                </span>

                <strong>
                  ₹{item.total.toFixed(2)}
                </strong>
              </div>
            ))}

            <hr />

            <div className="summary-row">
              <strong>
                Grand Total
              </strong>

              <strong>
                ₹{grandTotal.toFixed(2)}
              </strong>
            </div>
          </>
        )}

      </section>

    </div>
  );
}

export default App;