// import { neon } from "@neondatabase/serverless";
// import { NextResponse } from 'next/server';

// export async function GET(request, { params }) {
//   const { time } = params;
//   const [year, month] = time.split('-');
  
//   const dbUrl = process.env.DATABASE_URL || "";
//   const sql = neon(dbUrl);

//   try {
//     let query = sql`SELECT * FROM expenses`
//     const conditions = []

//     if (year && year !== 'all') {
//       conditions.push(sql`year = ${parseInt(year)}`)
//     }
//     if (month && month !== 'all') {
//       conditions.push(sql`month = ${parseInt(month)}`)
//     }

//     if (conditions.length > 0) {
//       query = sql`${query} WHERE ${sql.join(conditions, sql` AND `)}`
//     }

//     query = sql`${query} ORDER BY year DESC, month DESC, day DESC`

//     const response = await query
//     return NextResponse.json(response);
//   } catch (error) {
//     console.error('Error fetching expenses:', error);
//     return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
//   }
// }

