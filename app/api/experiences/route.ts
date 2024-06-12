import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const scheduled = await db.collection('scheduled').find({ done: true }).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(scheduled, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}