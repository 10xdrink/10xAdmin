// src/pages/InviteUserPage.jsx

import React from 'react';
import InviteUser from '../components/Users/InviteUser';
import { useUsers } from '../contexts/UserContext';
import toast from 'react-hot-toast';

const InviteUserPage = () => {
  const { inviteUser } = useUsers();

  // Handle user invitation
  const handleInvite = async (email, role) => {
    try {
      await inviteUser(email, role);
      toast.success('Invitation sent successfully!');
    } catch (err) {
      console.error('Invitation Error:', err);
      toast.error(`Invitation failed: ${err}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Invite New User</h1>
      <InviteUser onInvite={handleInvite} />
    </div>
  );
};

export default InviteUserPage;
