import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Participant } from '@/types';

export async function PUT(request: Request) {
    const { email, name, sex, lastExperience }: Participant = await request.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('participants').updateOne(
            { email },
            { $set: { name, sex, lastExperience } },
            { upsert: true }
        );
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
