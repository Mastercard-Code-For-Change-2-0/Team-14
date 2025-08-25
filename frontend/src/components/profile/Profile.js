import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import { FiUser, FiShield, FiTrash2 } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiShield },
    { id: 'danger', label: 'Danger Zone', icon: FiTrash2 }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-8 h-8 text-primary-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.username
              }
            </h2>
            <p className="text-gray-600">@{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'password' && <PasswordForm />}
          {activeTab === 'danger' && <DangerZone />}
        </div>
      </div>
    </div>
  );
};

// Danger Zone Component
const DangerZone = () => {
  const { logout } = useAuth();
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      setIsDeactivating(true);
      try {
        // In a real app, you would call the deactivate API
        await logout();
      } catch (error) {
        console.error('Deactivation error:', error);
      } finally {
        setIsDeactivating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Deactivate Account</h3>
        <p className="text-sm text-gray-600 mt-1">
          Permanently deactivate your account. This action cannot be undone.
        </p>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-red-800">Deactivate Account</h4>
            <p className="text-sm text-red-700 mt-1">
              Once you deactivate your account, you will lose access to all your data.
            </p>
          </div>
          <button
            onClick={handleDeactivate}
            disabled={isDeactivating}
            className="btn-danger"
          >
            {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

