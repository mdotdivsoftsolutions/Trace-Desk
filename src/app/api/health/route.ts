import { NextResponse } from 'next/server';
import dbConnect from '@/server/config/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection established successfully',
      database: mongoose.connection.name,
      connectionState: states[state] || state,
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
