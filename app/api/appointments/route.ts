import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '100');

    let where: any = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
      },
      take: limit,
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        doctorName: body.doctorName,
        date: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        tokenNumber: body.tokenNumber,
        priority: body.priority || 'Normal',
        status: body.status || 'Scheduled',
      },
      include: {
        patient: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
