'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  email?: string;
  status: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Patient</h1>
        <p className="text-gray-600">Search by name, phone, MRN, or email</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter patient name, MRN, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          >
            <Search className="inline mr-2" size={18} />
            Search
          </button>
        </form>
      </div>

      {/* Results Table */}
      {searched && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : patients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      MRN
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      DOB
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Phone
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
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {patient.mrn}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(patient.dob)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {patient.gender}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {patient.status}
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
              <p className="text-gray-600">No patients found. Try a different search.</p>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center py-12">
          <p className="text-gray-500">Use the search bar above to find patients</p>
        </div>
      )}
    </div>
  );
}
