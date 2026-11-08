'use client';

import React from 'react';
import Modal from './Modal';
import { User } from '@/types/auth.types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
      <div className="profile-details">
        <div className="profile-avatar-large">{initials}</div>
        <h3 className="profile-name">{user.name}</h3>
        <p className="profile-email">{user.email}</p>
      </div>
      <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default UserProfileModal;

