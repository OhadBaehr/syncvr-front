// app/api/notes/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uniqueId = searchParams.get('uniqueId');

    try {
        const { db } = await connectToDatabase();
        const notes = await db.collection('notes').find({ uniqueId }).toArray();
        return NextResponse.json(notes, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { content, date, noteId, author, uniqueId } = await request.json();

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('notes').insertOne({
            content,
            date: new Date(date),
            noteId,
            uniqueId,
            author,
            createdAt: new Date(),
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}



export async function PUT(request: Request) {
    const { content, date, noteId } = await request.json();

    if (!noteId) {
        return NextResponse.json({ message: 'noteId ID is required.' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('notes').updateOne(
            { noteId },
            {
                $set: {
                    content,
                    date,
                    noteId,
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'No notes found.' }, { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');

    if (!noteId) {
        return NextResponse.json({ message: 'noteId ID is required.' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('notes').deleteOne({ noteId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'No notes found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Notes deleted successfully.' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}