import { NextResponse } from "next/server";
import prisma from "../../../src/lib/prisma";

export async function GET() {
  const count = await prisma.transaction.count();

  return NextResponse.json({
    ok: true,
    transactions: count,
  });
}
