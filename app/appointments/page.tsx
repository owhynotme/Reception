'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  tokenNumber: string;
  patient: {
    firstName: string;
    lastName: string;
  };
  doctorName: string;
  date: string;
  startTime: string;
  priority: string;
  status: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments?limit=1000');
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = (search: string, status: string, date: string) => {
    let filtered = appointments;

    if (search.trim()) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
          apt.patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
          apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
          apt.tokenNumber.includes(search)
      );
    }

    if (status !== 'All') {
      filtered = filtered.filter((apt) => apt.status === status);
    }

    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === selectedDate.getTime();
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterAppointments(value, statusFilter, dateFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterAppointments(searchTerm, value, dateFilter);
  };

  const handleDateFilter = (value: string) => {
    setDateFilter(value);
    filterAppointments(searchTerm, statusFilter, value);
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' at ' + timeString;
  };

  return (
    <div className="p-8">
      {/* Header with Book Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage all scheduled appointments</p>
        </div>
        <Link
          href="/book"
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <Plus size={20} />
          Book
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by patient, doctor, or token..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="All">All statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Waiting">Waiting</option>
              <option value="Checked In">Checked In</option>
              <option value="In Consult">In Consult</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    When
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Token
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDateTime(apt.date, apt.startTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {apt.patient.firstName} {apt.patient.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.doctorName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {apt.tokenNumber}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {apt.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'In Consult'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.status === 'Checked In'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-gray-900 hover:text-gray-600 transition-colors font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
