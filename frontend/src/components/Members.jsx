import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    joinedDate: new Date().toISOString().split('T')[0],
    email: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all members on mount
  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/members');
      setMembers(Array.isArray(response.data) ? response.data : []);
      setErrorMsg('');
    } catch (err) {
      console.error('Error fetching members:', err);
      setErrorMsg('Failed to load members list from server.');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/members', formData);
      setFormData({
        fullName: '',
        nationalId: '',
        phone: '',
        joinedDate: new Date().toISOString().split('T')[0],
        email: ''
      });
      fetchMembers(); // Refresh list after creation
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Failed to create member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Member Management</h2>

      {errorMsg && (
        <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {/* Registration Form */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#334155' }}>Register New Member</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>National ID *</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>Date Joined</label>
            <input
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Registering...' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>

      {/* Members List Table */}
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#334155' }}>Registered Members ({members.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Full Name</th>
              <th style={{ padding: '12px' }}>National ID</th>
              <th style={{ padding: '12px' }}>Phone</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  No registered members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{member.fullName}</td>
                  <td style={{ padding: '12px' }}>{member.nationalId}</td>
                  <td style={{ padding: '12px' }}>{member.phone}</td>
                  <td style={{ padding: '12px' }}>{member.email || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    {member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;