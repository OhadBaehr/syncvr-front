import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Participant } from '@/types';

// Delete a participant by its email
export async function DELETE(request: Request) {
    const { email }: Participant = await request.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('participants').deleteOne({ email });
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
