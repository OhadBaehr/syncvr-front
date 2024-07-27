import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";


export async function POST() {
    try {
        const { db } = await connectToDatabase();
        const scheduled = await db.collection('scheduled').find({ done: false }).sort({ createdAt: -1 }).toArray();
        const response = NextResponse.json(scheduled, { status: 200 });

        return response;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}