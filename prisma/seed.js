const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();

  // Create a sample patient
  const patient1 = await prisma.patient.create({
    data: {
      mrn: '222-2026-00001',
      firstName: 'Priya',
      lastName: 'Sharma',
      dob: new Date('1994-05-12'),
      gender: 'Female',
      phone: '+91-9876543210',
      email: 'priya.sharma@email.com',
      status: 'Active',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      mrn: '222-2026-00002',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      dob: new Date('1988-03-25'),
      gender: 'Male',
      phone: '+91-9876543211',
      email: 'rajesh.kumar@email.com',
      status: 'Active',
    },
  });

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create sample appointments for today
  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorName: 'Dr. Anjali Verma',
      date: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      startTime: '09:00',
      endTime: '09:30',
      tokenNumber: 'T001',
      priority: 'Normal',
      status: 'Scheduled',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorName: 'Dr. Rajesh Singh',
      date: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      startTime: '10:00',
      endTime: '10:30',
      tokenNumber: 'T002',
      priority: 'Urgent',
      status: 'Waiting',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorName: 'Dr. Anjali Verma',
      date: new Date(today.getTime() + 11 * 60 * 60 * 1000), // 11 AM
      startTime: '11:00',
      endTime: '11:30',
      tokenNumber: 'T003',
      priority: 'Normal',
      status: 'Checked In',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
