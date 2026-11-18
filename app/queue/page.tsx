'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap } from 'lucide-react';

interface QueueAppointment {
  id: string;
  tokenNumber: string;
  patient: {
    firstName: string;
    lastName: string;
    mrn: string;
  };
  doctorName: string;
  startTime: string;
  priority: string;
  status: string;
}

export default function QueuePage() {
  const [appointments, setAppointments] = useState<QueueAppointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<QueueAppointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await fetch(
        `/api/appointments?date=${today.toISOString()}&limit=100`
      );
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = (search: string, status: string) => {
    let filtered = appointments;

    if (search.trim()) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
          apt.patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
          apt.patient.mrn.includes(search) ||
          apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
          apt.tokenNumber.includes(search)
      );
    }

    if (status !== 'All') {
      filtered = filtered.filter((apt) => apt.status === status);
    }

    setFilteredAppointments(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterAppointments(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterAppointments(searchTerm, value);
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Checked In' }),
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const getStatusCounts = () => {
    return {
      waiting: appointments.filter((a) => a.status === 'Waiting').length,
      checkedIn: appointments.filter((a) => a.status === 'Checked In').length,
      inConsult: appointments.filter((a) => a.status === 'In Consult').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Queue</h1>
        <p className="text-gray-600">Today's appointments — manage check-ins</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, token, doctor, or MRN..."
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
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Waiting', 'Checked In', 'In Consult'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status === 'All' ? 'All' : status);
                filterAppointments(searchTerm, status === 'All' ? 'All' : status);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status || (status === 'All' && statusFilter === 'All')
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
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
                    Token
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Time
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
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {apt.tokenNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        {apt.patient.firstName} {apt.patient.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{apt.patient.mrn}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.doctorName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.startTime}</td>
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
                      {apt.status === 'Scheduled' || apt.status === 'Waiting' ? (
                        <button
                          onClick={() => handleCheckIn(apt.id)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-gray-500 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No appointments match your filters.</p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Waiting</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{counts.waiting}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Activity className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Checked In</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{counts.checkedIn}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Consultation</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{counts.inConsult}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
