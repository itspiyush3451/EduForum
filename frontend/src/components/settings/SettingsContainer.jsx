import React, { useState } from 'react';

const SettingsPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('An error occurred while changing password.');
    }
  };

  const handleChangeEmail = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/changeemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
        },
        body: JSON.stringify({ newEmail }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error changing email:', error);
      setMessage('An error occurred while changing email.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-white-100">
      {/* Change Password Form */}
      <form className="mb-6" onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          className="w-full border bg-gray-600 rounded-md px-3 py-2 mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full bg-gray-600 border rounded-md px-3 py-2 mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Change Password
        </button>
      </form>

      {/* Change Email Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleChangeEmail(); }}>
  <h2 className="text-2xl font-semibold mt-8 mb-4">Change Email</h2>
  <input
    type="email"
    placeholder="New Email"
    className="w-full bg-gray-600 border rounded-md px-3 py-2 mb-4"
    value={newEmail}
    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    title="Please enter a valid email address" // Add title attribute for error message
    onChange={(e) => setNewEmail(e.target.value)}
    required
  />
  <button
    type="submit"
    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
  >
    Change Email
  </button>
</form>

      {/* Display message if any */}
      {message && <p className="mt-4 p-2 bg-gray-600 rounded-md">{message}</p>}
    </div>
  );
};

export default SettingsPage;
