import { z } from "zod";
import { neon } from "@neondatabase/serverless";

const DB_URL = "postgresql://neondb_owner:EPLOU3JfAn6b@ep-restless-math-a6qja71p.us-west-2.aws.neon.tech/neondb?sslmode=require";

// GET: Retrieve all expenses
// export async function GET() {
//   const dbUrl = process.env.DATABASE_URL || "";
//   const sql = neon(dbUrl);

//   try {
//     const response = await sql`SELECT * FROM expenses ORDER BY year DESC, month DESC, day DESC`;
//     return new Response(JSON.stringify(response), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Failed to fetch expenses" }), { status: 500 });
//   }
// }

// GET: Retrieve filtered expenses based on year and month
export async function GET(request) {
  const { searchParams } = new URL(request.url); // Parse the URL
  const year = searchParams.get('year'); // Get 'year' parameter
  const month = searchParams.get('month'); // Get 'month' parameter
  // let year = 2024;
  // let month = 10;

  const dbUrl = DB_URL || "";
  const sql = neon(dbUrl);
  

  try {
    // Construct SQL query with optional filtering
    let query = `SELECT * FROM expenses`;
    const conditions = [];
    const params = [];

    if (year) {
      conditions.push(`year = ${parseInt(year)}`);
      params.push(year);
    }

    if (month) {
      conditions.push(`month = ${parseInt(month)}`);
      params.push(month);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY year DESC, month DESC, day DESC`;
    
    // console.log({ dbUrl, query });
    // console.log({ year, month });

    // const response = await sql`SELECT * FROM expenses WHERE year = 2024 AND month = 10 ORDER BY year DESC, month DESC, day DESC`;
    // const response = await sql.unsafe(query);
    // const response = await sql`${query.toString()}`;
    const response = await sql(query);
    // const response = await sql`{query}`;

    // const response = await sql(query, ...params);
    // console.log(response);
    // console.log({params});
    // console.log(query.raw);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch expenses" }), { status: 500 });
  }
}


// POST: Create a new expense
export async function POST(request) {
  let newExpense = await request.json();

  // Validate incoming data
  const newExpenseSchema = z.object({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    name: z.string().min(1),
    category: z.enum([
      'Housing', 'Utilities', 'Transportation', 'Groceries', 'Health',
      'Insurance', 'Debt', 'Savings', 'Education', 'Clothing', 'Taxes', 'Others'
    ]),
    amount: z.number().positive(),
    quantity: z.number().int().positive()
  });

  try {
    newExpenseSchema.parse(newExpense);
  } catch (error) {
    return new Response("Data does not match valid schema.", { status: 406 });
  }

  // Add the new expense to the database
  const dbUrl = DB_URL || "";
  const sql = neon(dbUrl);

  try {
    const response = await sql`
      INSERT INTO expenses (year, month, day, name, category, amount, quantity)
      VALUES (${newExpense.year}, ${newExpense.month}, ${newExpense.day}, ${newExpense.name}, 
              ${newExpense.category}, ${newExpense.amount}, ${newExpense.quantity})
      RETURNING *;
    `;

    return new Response(JSON.stringify(response[0]), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add expense" }), { status: 500 });
  }
}

// PUT: Update an existing expense
export async function PUT(request) {
  let updatedExpense = await request.json();

  // Validate incoming data
  const updateExpenseSchema = z.object({
    id: z.number().int().positive(),
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    name: z.string().min(1),
    category: z.enum([
      'Housing', 'Utilities', 'Transportation', 'Groceries', 'Health',
      'Insurance', 'Debt', 'Savings', 'Education', 'Clothing', 'Taxes', 'Others'
    ]),
    amount: z.number().positive(),
    quantity: z.number().int().positive()
  });

  try {
    updateExpenseSchema.parse(updatedExpense);
  } catch (error) {
    return new Response("Data does not match valid schema.", { status: 406 });
  }

  // Update the expense in the database
  const dbUrl = DB_URL || "";
  const sql = neon(dbUrl);

  try {
    const response = await sql`
      UPDATE expenses
      SET year = ${updatedExpense.year}, month = ${updatedExpense.month}, day = ${updatedExpense.day},
          name = ${updatedExpense.name}, category = ${updatedExpense.category},
          amount = ${updatedExpense.amount}, quantity = ${updatedExpense.quantity}
      WHERE id = ${updatedExpense.id}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: "Expense not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(response[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update expense" }), { status: 500 });
  }
}

// DELETE: Remove an expense
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing expense ID" }), { status: 400 });
  }

  const dbUrl = DB_URL || "";
  const sql = neon(dbUrl);

  try {
    const response = await sql`
      DELETE FROM expenses
      WHERE id = ${parseInt(id)}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: "Expense not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(response[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete expense" }), { status: 500 });
  }
}

