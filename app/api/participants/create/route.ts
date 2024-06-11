import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Participant } from '@/types';

export async function POST(request: Request) {
    const { name, email, sex, lastExperience }: Participant = await request.json();

    if (!name || !email || !sex) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('participants').insertOne({
            name,
            email,
            sex,
            lastExperience: lastExperience || '-',
        });
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
