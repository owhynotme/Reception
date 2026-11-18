import { Prisma, PrismaClient } from '@prisma/client';
import { Users, CheckCircle, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      patient: true,
    },
  });

  const checkedIn = todaysAppointments.filter(
    (a) => a.status === 'Checked In'
  ).length;
  const pending = todaysAppointments.filter(
    (a) => a.status === 'Scheduled' || a.status === 'Waiting'
  ).length;
  const completed = todaysAppointments.filter(
    (a) => a.status === 'Completed'
  ).length;

  return {
    total: todaysAppointments.length,
    checkedIn,
    pending,
    completed,
    appointments: todaysAppointments,
  };
}

const quickActions = [
  { title: 'Search Patients', href: '/patients', description: 'Find patient by name, phone, MRN' },
  { title: 'Register Patient', href: '/register', description: 'Add a new patient to the system' },
  { title: 'Book Appointment', href: '/book', description: 'Schedule a new appointment' },
  { title: 'View Queue', href: '/queue', description: 'Manage today\'s queue' },
];

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Reception Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here is your overview for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Checked In</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.checkedIn}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Zap className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Appointments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Appointments</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {stats.appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Token</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{apt.tokenNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {apt.patient.firstName} {apt.patient.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{apt.doctorName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{apt.startTime}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'In Consult'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'Checked In'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">No appointments scheduled for today.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
