import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    let where: any = {};

    if (search) {
      where = {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { mrn: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
        ],
      };
    }

    const patients = await prisma.patient.findMany({
      where,
      take: 100,
      orderBy: {
        lastName: 'asc',
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const patient = await prisma.patient.create({
      data: {
        mrn: body.mrn,
        firstName: body.firstName,
        lastName: body.lastName,
        dob: new Date(body.dob),
        gender: body.gender,
        phone: body.phone,
        email: body.email,
        status: body.status || 'Active',
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
