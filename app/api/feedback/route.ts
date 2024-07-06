import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uniqueId = searchParams.get('uniqueId');
    try {
        const { db } = await connectToDatabase();
        const scheduled = await db.collection('feedback').find({ uniqueId }).sort({ createdAt: -1 }).toArray();
        const response = NextResponse.json(scheduled, { status: 200 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}