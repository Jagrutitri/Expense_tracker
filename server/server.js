import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0.01
  },

  category: {
    type: String,
    required: true,
    enum: ["food", "travel", "bills", "shopping", "other"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

expenseSchema.index({ createdAt: -1 });
expenseSchema.index({ category: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category
    });

    res.status(201).json(expense);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
});

app.get("/api/expenses", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const expenses = await Expense
      .find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch expenses"
    });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid expense ID"
      });
    }

    const expense =
      await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete expense"
    });
  }
});

app.get("/api/expenses/summary", async (req, res) => {
  try {

    const summary = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount"
          }
        }
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      },

      {
        $sort: {
          category: 1
        }
      }
    ]);

    res.status(200).json(summary);

  } catch (error) {

    res.status(500).json({
      message: "Failed to calculate summary"
    });
  }
});


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

  });