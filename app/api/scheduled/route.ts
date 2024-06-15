import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';



export async function PUT(request: Request) {
    const {
        uniqueId,
        createdBy,
        createdByEmail,
        selectedParticipants,
        phaseDuration,
        historyLength,
        rateOfTesting,
        highSync,
        lowSync,
        date,
        experienceType,
        pendulumRotation,
        highSyncColor,
        midSyncColor,
        lowSyncColor,
    } = await request.json();

    if (!selectedParticipants || selectedParticipants.length !== 2) {
        return NextResponse.json({ message: 'Please select exactly 2 participants.' }, { status: 400 });
    }

    if (!date) {
        return NextResponse.json({ message: 'Please select a date and time.' }, { status: 400 });
    }

    if (!experienceType || experienceType.length === 0) {
        return NextResponse.json({ message: 'Please select at least one experience type.' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('scheduled').updateOne(
            { uniqueId },
            {
                $set: {
                    createdBy,
                    createdByEmail,
                    selectedParticipants,
                    phaseDuration,
                    historyLength,
                    rateOfTesting,
                    highSync,
                    lowSync,
                    date: new Date(date),
                    experienceType,
                    pendulumRotation,
                    highSyncColor,
                    midSyncColor,
                    lowSyncColor,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Experience not found.' }, { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}



export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const uniqueId = searchParams.get('uniqueId');

    if (!uniqueId) {
        return NextResponse.json({ message: 'Unique ID is required.' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('scheduled').deleteOne({ uniqueId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Experience not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Experience deleted successfully.' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const {
        sessionId,
        uniqueId,
        createdBy,
        createdByEmail,
        selectedParticipants,
        phaseDuration,
        historyLength,
        rateOfTesting,
        highSync,
        lowSync,
        date,
        experienceType,
        pendulumRotation,
        highSyncColor,
        midSyncColor,
        lowSyncColor,
    } = await request.json();

    if (!selectedParticipants || selectedParticipants.length !== 2) {
        return NextResponse.json({ message: 'Please select exactly 2 participants.' }, { status: 400 });
    }

    if (!date) {
        return NextResponse.json({ message: 'Please select a date and time.' }, { status: 400 });
    }

    if (!experienceType || experienceType.length === 0) {
        return NextResponse.json({ message: 'Please select at least one experience type.' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('scheduled').insertOne({
            done: false,
            sessionId,
            uniqueId,
            createdBy,
            createdByEmail,
            selectedParticipants,
            phaseDuration,
            historyLength,
            rateOfTesting,
            highSync,
            lowSync,
            date: new Date(date),
            experienceType,
            pendulumRotation,
            highSyncColor,
            midSyncColor,
            lowSyncColor,
            createdAt: new Date(),
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}



export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const scheduled = await db.collection('scheduled').find({ done: false }).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(scheduled, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}