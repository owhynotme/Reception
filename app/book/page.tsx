'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  mrn: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorName: '',
    date: '',
    startTime: '',
    endTime: '',
    priority: 'Normal',
  });

  // Fetch all patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTokenNumber = () => {
    const timestamp = Date.now();
    return `T${String(timestamp).slice(-4)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        patientId: formData.patientId,
        doctorName: formData.doctorName,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        tokenNumber: generateTokenNumber(),
        priority: formData.priority,
        status: 'Scheduled',
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      router.push('/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Appointment</h1>
        <p className="text-gray-600">Schedule a new appointment for a patient</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              disabled={patientsLoading}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">
                {patientsLoading ? 'Loading patients...' : 'Select a patient'}
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} ({patient.mrn})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor Name *
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
              placeholder="e.g., Dr. Anjali Verma"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
