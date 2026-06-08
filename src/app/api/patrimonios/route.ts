import { NextResponse } from "next/server";
import { db } from "@/lib/server-db";

export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, c.nome AS categoria
       FROM pontos_turisticos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       ORDER BY p.id DESC`
    );
    return NextResponse.json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
