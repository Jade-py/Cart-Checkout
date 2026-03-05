import { NextResponse } from "next/server";
import { mockCartData } from "@/lib/mockData";

export async function GET() {
  // Simulate network latency for realism
  await new Promise((resolve) => setTimeout(resolve, 80));
  return NextResponse.json(mockCartData);
}
