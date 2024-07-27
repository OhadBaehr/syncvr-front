import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Participant } from '@/types';
import { WithId, Document } from 'mongodb';

export async function POST() {
    try {
        const { db } = await connectToDatabase();

        const pipeline = [
            {
                $lookup: {
                    from: 'scheduled',
                    let: { participantEmail: '$email' },
                    pipeline: [
                        { $unwind: '$selectedParticipants' },
                        { $match: { $expr: { $eq: ['$selectedParticipants.email', '$$participantEmail'] } } },
                        { $sort: { date: -1 } },
                        { $limit: 1 },
                        { $project: { date: 1 } }
                    ],
                    as: 'latestExperience'
                }
            },
            {
                $addFields: {
                    lastExperience: { $arrayElemAt: ['$latestExperience.date', 0] }
                }
            },
            {
                $project: {
                    latestExperience: 0
                }
            }
        ];

        const participants = await db.collection('participants').aggregate(pipeline).toArray();

        return NextResponse.json(participants, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
