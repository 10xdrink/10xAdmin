// src/components/Settings/BackupSettings.jsx
import React, { useState } from 'react';

const BackupSettings = ({ 
  settings = {}, 
  onBackupSettingsChange, 
  onMaintenanceSettingsChange, 
  loading 
}) => {
  // Ensure settings objects exist to prevent errors
  const backupSettings = settings.backupSettings || {};
  const maintenanceSettings = settings.maintenanceSettings || {};
  
  // Ensure nested objects exist
  backupSettings.automatedBackups = backupSettings.automatedBackups || {};
  backupSettings.storageLocation = backupSettings.storageLocation || {};
  maintenanceSettings.scheduledMaintenance = maintenanceSettings.scheduledMaintenance || {};
  const [activeSection, setActiveSection] = useState('backup');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Backup & Maintenance Settings</h2>
        <p className="text-gray-600">Configure database backups and maintenance mode settings.</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('backup')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'backup'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Backup Settings
        </button>
        <button
          onClick={() => setActiveSection('maintenance')}
          className={`mr-4 pb-2 text-sm font-medium ${
            activeSection === 'maintenance'
              ? 'border-b-2 border-indigo-500 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Maintenance Mode
        </button>
      </div>

      {/* Backup Settings */}
      {activeSection === 'backup' && (
        <div className="space-y-6">
          {/* Automated Backups */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Automated Backups</h3>
                <p className="text-sm text-gray-500">Schedule regular database backups</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="automated_backups_enabled"
                  checked={backupSettings.automatedBackups.enabled || false}
                  onChange={(e) => onBackupSettingsChange({ 
                    automatedBackups: { 
                      ...backupSettings.automatedBackups, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="automated_backups_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.backupSettings.automatedBackups.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.backupSettings.automatedBackups.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.backupSettings.automatedBackups.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      value={backupSettings.automatedBackups.frequency || 'daily'}
                      onChange={(e) => onBackupSettingsChange({ 
                        automatedBackups: { 
                          ...backupSettings.automatedBackups, 
                          frequency: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={backupSettings.automatedBackups.time || '02:00'}
                      onChange={(e) => onBackupSettingsChange({ 
                        automatedBackups: { 
                          ...backupSettings.automatedBackups, 
                          time: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={backupSettings.automatedBackups.retentionDays || 30}
                    onChange={(e) => onBackupSettingsChange({ 
                      automatedBackups: { 
                        ...backupSettings.automatedBackups, 
                        retentionDays: parseInt(e.target.value) || 30 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Number of days to keep backups before automatic deletion.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Storage Location */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Type</label>
                <select
                  value={backupSettings.storageLocation.type || 'local'}
                  onChange={(e) => onBackupSettingsChange({ 
                    storageLocation: { 
                      ...backupSettings.storageLocation, 
                      type: e.target.value 
                    } 
                  })}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="local">Local Storage</option>
                  <option value="s3">Amazon S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="dropbox">Dropbox</option>
                </select>
              </div>

              {backupSettings.storageLocation.type === 'local' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Local Path</label>
                  <input
                    type="text"
                    value={backupSettings.storageLocation.localPath || ''}
                    onChange={(e) => onBackupSettingsChange({ 
                      storageLocation: { 
                        ...backupSettings.storageLocation, 
                        localPath: e.target.value 
                      } 
                    })}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="/var/backups/10x"
                  />
                </div>
              )}

              {backupSettings.storageLocation.type === 's3' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">S3 Bucket Name</label>
                    <input
                      type="text"
                      value={backupSettings.storageLocation.s3Bucket || ''}
                      onChange={(e) => onBackupSettingsChange({ 
                        storageLocation: { 
                          ...backupSettings.storageLocation, 
                          s3Bucket: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="my-backup-bucket"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AWS Access Key</label>
                    <input
                      type="password"
                      value={backupSettings.storageLocation.s3AccessKey || ''}
                      onChange={(e) => onBackupSettingsChange({ 
                        storageLocation: { 
                          ...backupSettings.storageLocation, 
                          s3AccessKey: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AWS Secret Key</label>
                    <input
                      type="password"
                      value={backupSettings.storageLocation.s3SecretKey || ''}
                      onChange={(e) => onBackupSettingsChange({ 
                        storageLocation: { 
                          ...backupSettings.storageLocation, 
                          s3SecretKey: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manual Backup */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Backup</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Create a backup of your database and files manually.
                </p>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Backup Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Mode */}
      {activeSection === 'maintenance' && (
        <div className="space-y-6">
          {/* Maintenance Mode Toggle */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Put your site in maintenance mode during updates</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="maintenance_mode_enabled"
                  checked={maintenanceSettings.enabled || false}
                  onChange={(e) => onMaintenanceSettingsChange({ enabled: e.target.checked })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="maintenance_mode_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.maintenanceSettings.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.maintenanceSettings.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.maintenanceSettings.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                    <textarea
                      value={maintenanceSettings.message || "We're currently performing maintenance. Please check back soon."}
                      onChange={(e) => onMaintenanceSettingsChange({ message: e.target.value })}
                      disabled={loading}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="We're currently performing maintenance. Please check back soon."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion</label>
                    <input
                      type="datetime-local"
                      value={maintenanceSettings.expectedCompletion || ''}
                      onChange={(e) => onMaintenanceSettingsChange({ expectedCompletion: e.target.value })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <input
                        id="allow_admin_access"
                        type="checkbox"
                        checked={maintenanceSettings.allowAdminAccess || true}
                        onChange={(e) => onMaintenanceSettingsChange({ allowAdminAccess: e.target.checked })}
                        disabled={loading}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allow_admin_access" className="ml-2 block text-sm text-gray-700">
                        Allow admin users to access the site
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Maintenance Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Scheduled Maintenance</h3>
                <p className="text-sm text-gray-500">Schedule maintenance mode for a future time</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="scheduled_maintenance_enabled"
                  checked={maintenanceSettings.scheduledMaintenance.enabled || false}
                  onChange={(e) => onMaintenanceSettingsChange({ 
                    scheduledMaintenance: { 
                      ...maintenanceSettings.scheduledMaintenance, 
                      enabled: e.target.checked 
                    } 
                  })}
                  disabled={loading}
                  className="sr-only"
                />
                <label
                  htmlFor="scheduled_maintenance_enabled"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                    settings.maintenanceSettings.scheduledMaintenance.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                      settings.maintenanceSettings.scheduledMaintenance.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {settings.maintenanceSettings.scheduledMaintenance.enabled && (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={maintenanceSettings.scheduledMaintenance.startTime || ''}
                      onChange={(e) => onMaintenanceSettingsChange({ 
                        scheduledMaintenance: { 
                          ...maintenanceSettings.scheduledMaintenance, 
                          startTime: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={maintenanceSettings.scheduledMaintenance.endTime || ''}
                      onChange={(e) => onMaintenanceSettingsChange({ 
                        scheduledMaintenance: { 
                          ...maintenanceSettings.scheduledMaintenance, 
                          endTime: e.target.value 
                        } 
                      })}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupSettings;
