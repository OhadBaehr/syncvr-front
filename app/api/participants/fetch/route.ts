import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Participant } from '@/types';
import { WithId, Document } from 'mongodb';

export async function POST() {
    try {
        const { db } = await connectToDatabase();
        const participants = await db.collection('participants').find({}).toArray();

        // Explicitly map documents to Participant type
        const formattedParticipants: Participant[] = participants.map((participant: WithId<Document>) => ({
            _id: participant._id,
            name: participant.name,
            email: participant.email,
            sex: participant.sex,
            lastExperience: participant.lastExperience,
        }));

        return NextResponse.json(formattedParticipants, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
