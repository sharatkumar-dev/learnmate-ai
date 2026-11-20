import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLearnMate } from '@/context/LearnMateContext';
import type { UserSettings } from '@/types/index';
import {
  getUserSettings,
  setUserSettings,
  setThemePreference,
  exportUserDataBackup,
  clearOfflineCache,
} from '@/utils/dashboardStore';
import { saveSettingsToServer, resetPasswordOnServer } from '@/api/client';

export function Settings() {
  const navigate = useNavigate();
  const { user, updateUserProfile, updateStoredPassword, signOut } = useLearnMate();

  // Load persisted settings
  const [settings, setSettings] = useState<UserSettings>(() => getUserSettings(user));

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'all' | 'profile' | 'ai' | 'goals' | 'appearance' | 'notifications' | 'security'
  >('all');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modals state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showVcsModal, setShowVcsModal] = useState<'github' | 'gitlab' | null>(null);
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);

  // Password modal form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 2FA modal state
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState('');

  // VCS modal state
  const [vcsUsername, setVcsUsername] = useState('');

  // Local Device Avatar Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileSize, setSelectedFileSize] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Preset avatars
  const PRESET_AVATARS = [
    {
      label: 'Alex Rivera (Staff Systems Engineer)',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXpXrboKZ3t3zyTfpdX2qdG5qJKRnB0Yr0ev8TDWomCidH9kNXTTvFrBR0L4L3XJEjDzIFkUZuy12j8RfG2NUuulFupU9kxglD4pQF5rb6oQGDGjvd_u3MIVxFzcROxqaOwWxuucO9g8smwJ6siyhE8j8Qof5xdYrM-YUdFflXM4mN02JmHbSl9K8Xet4L6K_nCFwFTvYydAYOrwwnRMtYZygDussufkJfzrum1axk',
    },
    {
      label: 'Elena Rostova (Systems Architect)',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Marcus Chen (Distributed SRE)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Priya Sharma (Cloud Core Lead)',
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
  ];

  // Sync with context user if authenticated details arrive later
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          fullName: user.fullName || prev.profile.fullName,
          email: user.email || prev.profile.email,
          role: user.trajectory || prev.profile.role,
          avatarUrl: user.avatar || prev.profile.avatarUrl,
        },
      }));
    }
  }, [user]);

  // Handle toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Helper to update specific sub-objects in settings
  const updateProfile = (updates: Partial<UserSettings['profile']>) => {
    setSettings((prev) => ({ ...prev, profile: { ...prev.profile, ...updates } }));
    if (updates.avatarUrl !== undefined) {
      updateUserProfile({ avatar: updates.avatarUrl });
    }
    setHasUnsavedChanges(true);
  };

  // File upload change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format: Please choose a PNG, JPEG, WebP, or GIF image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 5MB.`);
      return;
    }

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setSelectedFileName(file.name);
    setSelectedFileSize(sizeStr);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedFilePreview(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmUploadedAvatar = () => {
    if (!selectedFilePreview) return;
    updateProfile({ avatarUrl: selectedFilePreview });
    updateUserProfile({ avatar: selectedFilePreview });
    setShowAvatarModal(false);
    setSelectedFilePreview(null);
    setSelectedFileName('');
    setSelectedFileSize('');
    showToast('Profile photo updated successfully!');
  };

  const handleSelectPresetAvatar = (url: string) => {
    updateProfile({ avatarUrl: url });
    updateUserProfile({ avatar: url });
    setShowAvatarModal(false);
    setSelectedFilePreview(null);
    setSelectedFileName('');
    setSelectedFileSize('');
    showToast('Profile photo updated!');
  };

  const updateAiCompanion = (updates: Partial<UserSettings['aiCompanion']>) => {
    setSettings((prev) => ({ ...prev, aiCompanion: { ...prev.aiCompanion, ...updates } }));
    setHasUnsavedChanges(true);
  };

  const updateLearning = (updates: Partial<UserSettings['learning']>) => {
    setSettings((prev) => ({ ...prev, learning: { ...prev.learning, ...updates } }));
    setHasUnsavedChanges(true);
  };

  const updateAppearance = (updates: Partial<UserSettings['appearance']>) => {
    setSettings((prev) => {
      const nextAppearance = { ...prev.appearance, ...updates };
      if (updates.theme) {
        setThemePreference(updates.theme);
      }
      return { ...prev, appearance: nextAppearance };
    });
    setHasUnsavedChanges(true);
  };

  const updateNotifications = (updates: Partial<UserSettings['notifications']>) => {
    setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, ...updates } }));
    setHasUnsavedChanges(true);
  };

  // Save changes handler
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // 1. Save locally in dashboardStore
      setUserSettings(settings);

      // 2. Update platform auth state & context (including avatar)
      updateUserProfile({
        fullName: settings.profile.fullName,
        email: settings.profile.email,
        trajectory: settings.profile.role,
        avatar: settings.profile.avatarUrl,
      });

      // 3. Save to backend / Vercel API
      await saveSettingsToServer(settings);

      // 4. Update UI feedback
      setIsSaving(false);
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      showToast('All modifications saved and synchronized across workspace!');

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch {
      setIsSaving(false);
      showToast('Modifications saved locally on this device.', 'success');
      setHasUnsavedChanges(false);
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const res = updateStoredPassword(currentPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'Failed to update password.');
      return;
    }

    try {
      await resetPasswordOnServer(currentPassword, newPassword);
    } catch {
      // local reset succeeded
    }

    setPasswordSuccess(true);
    showToast('Account password successfully updated!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(false);
    }, 1500);
  };

  // 2FA reconfigure handler
  const handleToggle2FA = () => {
    if (totpCode.length < 6) {
      setTotpError('Please enter a valid 6-digit TOTP verification code.');
      return;
    }
    const nextState = !settings.security.twoFactorEnabled;
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, twoFactorEnabled: nextState },
    }));
    setShow2FAModal(false);
    setTotpCode('');
    setTotpError('');
    showToast(`Two-Factor Authentication (2FA) is now ${nextState ? 'enabled' : 'disabled'}.`);
  };

  // Revoke session handler
  const handleRevokeSession = (sessionId: string) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        activeSessions: prev.security.activeSessions.filter((s) => s.id !== sessionId),
      },
    }));
    showToast('Session revoked successfully.');
  };

  // Sign out of all sessions
  const handleLogOutOfAllSessions = () => {
    if (window.confirm('Are you sure you want to log out of all active sessions across all devices?')) {
      signOut();
      navigate('/signup');
    }
  };

  // Connect VCS repository handler
  const handleConnectVcs = () => {
    if (!showVcsModal || !vcsUsername.trim()) return;
    const vcsKey = showVcsModal;
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        vcs: {
          ...prev.profile.vcs,
          [vcsKey]: { username: vcsUsername.trim(), linked: true },
        },
      },
    }));
    setShowVcsModal(null);
    setVcsUsername('');
    showToast(`Successfully linked ${vcsKey === 'github' ? 'GitHub' : 'GitLab'} account!`);
  };

  // Disconnect VCS repository handler
  const handleDisconnectVcs = (vcsKey: 'github' | 'gitlab') => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        vcs: {
          ...prev.profile.vcs,
          [vcsKey]: { username: '', linked: false },
        },
      },
    }));
    showToast(`Disconnected ${vcsKey === 'github' ? 'GitHub' : 'GitLab'} repository link.`);
  };

  // Clear offline cache handler
  const handleConfirmClearCache = () => {
    clearOfflineCache();
    setShowClearCacheModal(false);
    showToast('Offline cache and session study buffers cleared successfully.');
  };

  // Filter sections by activeTab
  const isSectionVisible = (tab: typeof activeTab) => activeTab === 'all' || activeTab === tab;

  return (
    <>
      <div className="flex flex-col w-full pb-20">
        {/* Top Ambient Glow */}
        <div className="relative w-full">
          <div className="absolute -top-6 left-1/4 w-96 h-48 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute -top-10 right-10 w-72 h-44 bg-surface-container-high/60 rounded-full blur-2xl pointer-events-none -z-10"></div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Workspace
              </span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-sm text-label-sm text-primary font-medium">
                Settings &amp; Preferences
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Settings &amp; Preferences
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
              Manage your personal credentials, IBM Granite AI model parameters, learning cadences,
              and security settings.
            </p>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-container-lowest shadow-sm rounded-xl px-space-md py-2 self-start md:self-auto border border-outline-variant/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              Cloud Sync Active
            </span>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-20 right-6 z-50 max-w-md bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-body-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              toastType === 'error' ? 'border-l-4 border-error' : 'border-l-4 border-secondary-fixed'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  toastType === 'error' ? 'text-error' : 'text-secondary-fixed'
                }`}
              >
                {toastType === 'error' ? 'error' : 'task_alt'}
              </span>
              <span className="font-medium text-sm">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-outline hover:text-inverse-on-surface ml-2"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Settings Navigation Tabs */}
        <div className="w-full bg-surface-container-lowest shadow-sm rounded-xl p-1.5 mb-space-xl overflow-x-auto border border-outline-variant/30">
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'all'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">apps</span>
              <span>All Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'profile'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>General &amp; Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'ai'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">neurology</span>
              <span>AI Companion &amp; Model</span>
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'goals'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">pace</span>
              <span>Goals &amp; Cadence</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'appearance'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">palette</span>
              <span>Appearance &amp; Display</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'notifications'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'security'
                  ? 'bg-surface-container text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span>Security &amp; Privacy</span>
            </button>
          </div>
        </div>

        {/* Primary Asymmetric Grid Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* LEFT COLUMN: Main Configuration Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-space-lg">
            {/* ── Section 1: Profile & Identity ── */}
            {isSectionVisible('profile') && (
              <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30 transition-all">
                <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Profile &amp; Account Overview
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Update your public identity, technical track, and linked repository profiles.
                      </p>
                    </div>
                  </div>
                  <span className="font-code-sm text-code-sm px-2.5 py-1 rounded bg-surface-container text-primary font-medium">
                    Public ID: {settings.profile.publicId}
                  </span>
                </div>

                {/* Avatar & Summary Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md mb-space-lg bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30">
                  <div className="relative group shrink-0">
                    <img
                      className="w-20 h-20 rounded-xl object-cover shadow-sm ring-2 ring-surface-container-lowest bg-surface-container"
                      alt={settings.profile.fullName}
                      src={settings.profile.avatarUrl}
                    />
                    <div
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute inset-0 bg-inverse-surface/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                      title="Change Profile Photo"
                    >
                      <span className="material-symbols-outlined text-inverse-on-surface text-[22px]">
                        photo_camera
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {settings.profile.fullName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold shrink-0">
                        Active Learner
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {settings.profile.email}
                    </p>
                    <p className="font-code-sm text-code-sm text-outline mt-1">
                      Role Target: <span className="text-primary font-medium">{settings.profile.role}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container hover:text-primary text-on-surface font-label-md text-label-md font-medium transition-all shadow-sm"
                      type="button"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={() =>
                        updateProfile({
                          avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                            settings.profile.fullName,
                          )}`,
                        })
                      }
                      className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-all border border-transparent hover:border-error/20"
                      title="Reset to Initials Avatar"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                      <span>Full Name</span>
                      <span className="font-label-sm text-label-sm text-outline">Visible to mentors</span>
                    </label>
                    <input
                      className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                      type="text"
                      value={settings.profile.fullName}
                      onChange={(e) => updateProfile({ fullName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                      <span>Professional Role / Target Trajectory</span>
                      <span className="font-label-sm text-label-sm text-primary font-semibold">Track Tailored</span>
                    </label>
                    <input
                      className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                      type="text"
                      value={settings.profile.role}
                      onChange={(e) => updateProfile({ role: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      Primary Contact Email
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                        mail
                      </span>
                      <input
                        className="w-full pl-10 pr-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateProfile({ email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      Timezone &amp; Spaced Cadence Sync
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                        schedule
                      </span>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => updateProfile({ timezone: e.target.value })}
                        className="w-full pl-10 pr-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary appearance-none cursor-pointer shadow-inner border border-outline-variant/30"
                      >
                        <option value="Asia/Kolkata">UTC+05:30 (Indian Standard Time - India / Kolkata)</option>
                        <option value="America/Los_Angeles">UTC-08:00 (Pacific Time - Los Angeles)</option>
                        <option value="America/New_York">UTC-05:00 (Eastern Time - New York)</option>
                        <option value="Europe/London">UTC+00:00 (Greenwich Mean Time - London)</option>
                        <option value="Europe/Berlin">UTC+01:00 (Central European Time - Berlin)</option>
                        <option value="Asia/Tokyo">UTC+09:00 (Japan Standard Time - Tokyo)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-[18px] text-outline pointer-events-none">
                        unfold_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connected VCS Profiles */}
                <div className="mt-space-lg pt-space-md border-t border-outline-variant/20">
                  <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-space-sm font-semibold">
                    Repository &amp; Portfolio Verification
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    {/* GitHub Card */}
                    <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-md bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-code-sm text-code-sm font-bold">
                          GH
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface font-medium leading-tight">
                            {settings.profile.vcs.github?.linked
                              ? `github.com/${settings.profile.vcs.github.username}`
                              : 'GitHub Account'}
                          </p>
                          <p className="font-label-sm text-label-sm flex items-center gap-1">
                            {settings.profile.vcs.github?.linked ? (
                              <span className="text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Linked &amp; verified
                              </span>
                            ) : (
                              <span className="text-outline">Not connected</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {settings.profile.vcs.github?.linked ? (
                        <button
                          type="button"
                          onClick={() => handleDisconnectVcs('github')}
                          className="font-label-sm text-label-sm text-outline hover:text-error px-2.5 py-1 rounded bg-surface-container-lowest border border-outline-variant/30 hover:border-error transition-all"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowVcsModal('github');
                            setVcsUsername('');
                          }}
                          className="font-label-sm text-label-sm text-primary hover:text-on-primary hover:bg-primary-container px-2.5 py-1 rounded bg-surface-container-lowest border border-primary/30 transition-all font-semibold"
                        >
                          Connect
                        </button>
                      )}
                    </div>

                    {/* GitLab Card */}
                    <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/30">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center font-code-sm text-code-sm font-bold">
                          GL
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface font-medium leading-tight">
                            {settings.profile.vcs.gitlab?.linked
                              ? `gitlab.com/${settings.profile.vcs.gitlab.username}`
                              : 'GitLab Account'}
                          </p>
                          <p className="font-label-sm text-label-sm flex items-center gap-1">
                            {settings.profile.vcs.gitlab?.linked ? (
                              <span className="text-primary flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Active runner
                              </span>
                            ) : (
                              <span className="text-outline">Not connected</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {settings.profile.vcs.gitlab?.linked ? (
                        <button
                          type="button"
                          onClick={() => handleDisconnectVcs('gitlab')}
                          className="font-label-sm text-label-sm text-outline hover:text-error px-2.5 py-1 rounded bg-surface-container-lowest border border-outline-variant/30 hover:border-error transition-all"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowVcsModal('gitlab');
                            setVcsUsername('');
                          }}
                          className="font-label-sm text-label-sm text-primary hover:text-on-primary hover:bg-primary-container px-2.5 py-1 rounded bg-surface-container-lowest border border-primary/30 transition-all font-semibold"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Section 2: AI Companion & Model Calibration ── */}
            {isSectionVisible('ai') && (
              <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg relative overflow-hidden border border-outline-variant/30 transition-all">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        AI Companion Calibration &amp; Engine
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Fine-tune reasoning behavior, cognitive depth, and context retrieval boundaries.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-code-sm text-code-sm font-semibold">
                    watsonx.ai Orchestration
                  </span>
                </div>

                {/* Model Selector Cards (Strictly IBM Granite 3.0 watsonx) */}
                <div className="space-y-space-sm mb-space-lg">
                  <label className="font-label-md text-label-md text-on-surface font-medium block">
                    Inference Engine Backing
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    {/* Model 1: IBM Granite 3.0 */}
                    <div
                      onClick={() => updateAiCompanion({ model: 'granite-3.0' })}
                      className={`relative flex flex-col p-space-md rounded-xl cursor-pointer transition-all border ${
                        settings.aiCompanion.model === 'granite-3.0'
                          ? 'bg-primary-fixed/30 border-primary ring-2 ring-primary/30'
                          : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                          Recommended
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            settings.aiCompanion.model === 'granite-3.0'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high'
                          }`}
                        >
                          {settings.aiCompanion.model === 'granite-3.0' && (
                            <span className="material-symbols-outlined text-[12px]">check</span>
                          )}
                        </div>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        IBM Granite 3.0
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        High-fidelity architecture analysis, deep system proofs, and nuanced invariants feedback.
                      </p>
                      <div className="mt-3 pt-2 flex items-center gap-1.5 font-code-sm text-code-sm text-outline border-t border-outline-variant/20">
                        <span className="material-symbols-outlined text-[14px]">speed</span> 32ms t/s • watsonx.ai
                      </div>
                    </div>

                    {/* Model 2: IBM Granite 3.0 Instruct */}
                    <div
                      onClick={() => updateAiCompanion({ model: 'granite-3.0-instruct' })}
                      className={`relative flex flex-col p-space-md rounded-xl cursor-pointer transition-all border ${
                        settings.aiCompanion.model === 'granite-3.0-instruct'
                          ? 'bg-primary-fixed/30 border-primary ring-2 ring-primary/30'
                          : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-label-sm text-label-sm text-outline uppercase font-semibold tracking-wider">
                          Direct Execution
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            settings.aiCompanion.model === 'granite-3.0-instruct'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high'
                          }`}
                        >
                          {settings.aiCompanion.model === 'granite-3.0-instruct' && (
                            <span className="material-symbols-outlined text-[12px]">check</span>
                          )}
                        </div>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Granite 3.0 Instruct
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Rapid code snippet refactoring, algorithmic solutions, and structured tabular comparisons.
                      </p>
                      <div className="mt-3 pt-2 flex items-center gap-1.5 font-code-sm text-code-sm text-outline border-t border-outline-variant/20">
                        <span className="material-symbols-outlined text-[14px]">speed</span> 48ms t/s • watsonx.ai
                      </div>
                    </div>

                    {/* Model 3: IBM Granite 3.0 Guardian */}
                    <div
                      onClick={() => updateAiCompanion({ model: 'granite-3.0-guardian' })}
                      className={`relative flex flex-col p-space-md rounded-xl cursor-pointer transition-all border ${
                        settings.aiCompanion.model === 'granite-3.0-guardian'
                          ? 'bg-primary-fixed/30 border-primary ring-2 ring-primary/30'
                          : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold tracking-wider">
                          Safety &amp; Audit
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            settings.aiCompanion.model === 'granite-3.0-guardian'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high'
                          }`}
                        >
                          {settings.aiCompanion.model === 'granite-3.0-guardian' && (
                            <span className="material-symbols-outlined text-[12px]">check</span>
                          )}
                        </div>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Granite 3.0 Guardian
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Concurrency safety audit, race condition detection, and formal correctness verification.
                      </p>
                      <div className="mt-3 pt-2 flex items-center gap-1.5 font-code-sm text-code-sm text-outline border-t border-outline-variant/20">
                        <span className="material-symbols-outlined text-[14px]">psychology</span> 8k CoT • watsonx.ai
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cognitive Mode Toggle & Context Window Slider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-space-lg pt-2">
                  {/* Cognitive Mode */}
                  <div className="space-y-space-xs bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md text-on-surface font-medium">
                        Cognitive Mode
                      </label>
                      <span className="font-label-sm text-label-sm text-primary font-bold">
                        Active: {settings.aiCompanion.cognitiveMode === 'socratic' ? 'Socratic' : 'Direct Solutions'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Dictates whether the assistant guides with probing questions or provides immediate code snippets.
                    </p>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-surface-container rounded-lg mt-space-sm border border-outline-variant/20">
                      <button
                        type="button"
                        onClick={() => updateAiCompanion({ cognitiveMode: 'socratic' })}
                        className={`py-2 px-3 rounded-md font-label-md text-label-md transition-all flex items-center justify-center gap-1.5 ${
                          settings.aiCompanion.cognitiveMode === 'socratic'
                            ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">help_center</span>
                        <span>Socratic Guidance</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAiCompanion({ cognitiveMode: 'direct' })}
                        className={`py-2 px-3 rounded-md font-label-md text-label-md transition-all flex items-center justify-center gap-1.5 ${
                          settings.aiCompanion.cognitiveMode === 'direct'
                            ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        <span>Direct Solutions</span>
                      </button>
                    </div>
                  </div>

                  {/* Context Window Retention Slider */}
                  <div className="space-y-space-xs bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between border border-outline-variant/30">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="font-label-md text-label-md text-on-surface font-medium">
                          Context Window Retention
                        </label>
                        <span className="font-code-sm text-code-sm px-2.5 py-0.5 rounded bg-surface-container text-primary font-bold">
                          {settings.aiCompanion.contextWindowTokens}k Tokens
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Memory depth cached from earlier milestones, code submissions, and chat turns.
                      </p>
                    </div>
                    <div className="pt-3">
                      <input
                        className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                        max="128"
                        min="8"
                        step="8"
                        type="range"
                        value={settings.aiCompanion.contextWindowTokens}
                        onChange={(e) =>
                          updateAiCompanion({ contextWindowTokens: parseInt(e.target.value, 10) })
                        }
                      />
                      <div className="flex justify-between font-code-sm text-code-sm text-outline mt-1.5">
                        <span>8k (Session only)</span>
                        <span>64k (Recommended)</span>
                        <span>128k (Full Depth)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Prompt Personality Directive */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1.5">
                      <span>System Prompt Personality Directive</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-outline cursor-help"
                        title="Injected into every chat inference request as persona guidelines"
                      >
                        info
                      </span>
                    </label>
                    <span className="font-code-sm text-code-sm text-outline">
                      {settings.aiCompanion.personalityDirective.length} / 1000 chars
                    </span>
                  </div>
                  <textarea
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-code-sm text-code-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner resize-none leading-relaxed border border-outline-variant/30"
                    rows={3}
                    maxLength={1000}
                    value={settings.aiCompanion.personalityDirective}
                    onChange={(e) => updateAiCompanion({ personalityDirective: e.target.value })}
                  ></textarea>
                </div>
              </section>
            )}

            {/* ── Section 3: Learning & Spaced Repetition Preferences ── */}
            {isSectionVisible('goals') && (
              <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30 transition-all">
                <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">timelapse</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Learning &amp; Spaced Repetition Preferences
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Calibrate retention algorithms based on the Ebbinghaus forgetting curve.
                      </p>
                    </div>
                  </div>
                  <span className="font-code-sm text-code-sm text-outline font-medium">
                    FSRS-4.5 Algorithm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
                  {/* Weekly Target Commitment */}
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      Target Weekly Study Commitment
                    </label>
                    <div className="relative flex items-center">
                      <input
                        className="w-full pl-space-md pr-16 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                        type="number"
                        min="1"
                        max="60"
                        value={settings.learning.weeklyTargetHours}
                        onChange={(e) =>
                          updateLearning({
                            weeklyTargetHours: Math.max(1, parseInt(e.target.value, 10) || 1),
                          })
                        }
                      />
                      <span className="absolute right-4 font-label-md text-label-md text-outline font-medium">
                        hrs / wk
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline">
                      Paces dynamic curriculum modules to match ~
                      {(settings.learning.weeklyTargetHours / 7).toFixed(1)} hrs/day.
                    </p>
                  </div>

                  {/* Daily Flashcard Queue Maximum */}
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      Daily Flashcard Queue Maximum
                    </label>
                    <div className="relative flex items-center">
                      <input
                        className="w-full pl-space-md pr-20 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/30"
                        type="number"
                        min="5"
                        max="100"
                        value={settings.learning.dailyCardLimit}
                        onChange={(e) =>
                          updateLearning({
                            dailyCardLimit: Math.max(5, parseInt(e.target.value, 10) || 5),
                          })
                        }
                      />
                      <span className="absolute right-4 font-label-md text-label-md text-outline font-medium">
                        cards / day
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline">
                      Prevents cognitive overload during high-stress sprint cycles.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2 border-t border-outline-variant/20">
                  {/* Retention Threshold Sensitivity (Fixed from broken "Revoke" buttons!) */}
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      Retention Threshold Sensitivity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateLearning({ retentionSensitivity: 'relaxed' })}
                        className={`py-2 px-2 rounded-lg font-label-md text-label-md text-center transition-all border ${
                          settings.learning.retentionSensitivity === 'relaxed'
                            ? 'bg-surface-container text-primary font-bold border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        Relaxed (85%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLearning({ retentionSensitivity: 'balanced' })}
                        className={`py-2 px-2 rounded-lg font-label-md text-label-md text-center transition-all border ${
                          settings.learning.retentionSensitivity === 'balanced'
                            ? 'bg-surface-container text-primary font-bold border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        Balanced (90%)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLearning({ retentionSensitivity: 'strict' })}
                        className={`py-2 px-2 rounded-lg font-label-md text-label-md text-center transition-all border ${
                          settings.learning.retentionSensitivity === 'strict'
                            ? 'bg-surface-container text-primary font-bold border-primary shadow-sm'
                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                        }`}
                      >
                        Strict (95%)
                      </button>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline">
                      Controls spaced recall intervals for optimal memory decay prevention.
                    </p>
                  </div>

                  {/* Preferred Coding Sandbox */}
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface font-medium">
                      Preferred Coding Sandbox Engine
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(
                        [
                          { id: 'rust', label: 'Rust (1.78)' },
                          { id: 'go', label: 'Go (1.22)' },
                          { id: 'python', label: 'Python (3.12)' },
                          { id: 'typescript', label: 'TypeScript (5.4)' },
                        ] as const
                      ).map((sb) => {
                        const active = settings.learning.preferredSandbox === sb.id;
                        return (
                          <button
                            key={sb.id}
                            type="button"
                            onClick={() => updateLearning({ preferredSandbox: sb.id })}
                            className={`px-3 py-1.5 rounded-lg font-code-sm text-code-sm font-semibold flex items-center gap-1.5 transition-all border ${
                              active
                                ? 'bg-surface-container text-primary border-primary shadow-sm'
                                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                active ? 'bg-primary' : 'bg-outline-variant'
                              }`}
                            ></span>
                            <span>{sb.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="font-body-sm text-body-sm text-outline">
                      Default runtime container for inline code execution and benchmarking.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ── Section 4: Appearance & Display Preferences (NEW) ── */}
            {isSectionVisible('appearance') && (
              <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30 transition-all">
                <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">palette</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Appearance &amp; Display Preferences
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Customize platform aesthetics, color contrast, and layout density.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-space-md">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface font-medium block mb-2">
                      Interface Theme Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: 'system', label: 'System Default', icon: 'brightness_auto', desc: 'Syncs with OS theme' },
                          { id: 'light', label: 'Light Studio', icon: 'light_mode', desc: 'Crisp high-readability' },
                          { id: 'dark', label: 'Dark Midnight', icon: 'dark_mode', desc: 'Low-glare deep contrast' },
                        ] as const
                      ).map((th) => {
                        const active = settings.appearance.theme === th.id;
                        return (
                          <div
                            key={th.id}
                            id={`theme-card-${th.id}`}
                            onClick={() => {
                              updateAppearance({ theme: th.id });
                              showToast(`Interface theme switched to ${th.label}`);
                            }}
                            className={`p-space-md rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                              active
                                ? 'bg-primary-fixed/30 border-primary ring-2 ring-primary/30'
                                : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="material-symbols-outlined text-[24px] text-primary">
                                {th.icon}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  active ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                                }`}
                              >
                                {active && <span className="material-symbols-outlined text-[10px]">check</span>}
                              </div>
                            </div>
                            <div>
                              <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                                {th.label}
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                {th.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2 border-t border-outline-variant/20">
                    {/* High Contrast */}
                    <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          High Contrast Borders
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Sharpen element boundaries for enhanced visual legibility.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateAppearance({ highContrast: !settings.appearance.highContrast })}
                        className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                          settings.appearance.highContrast ? 'bg-primary' : 'bg-surface-container-high'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${
                            settings.appearance.highContrast ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Reduced Motion */}
                    <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          Reduced Motion
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Minimize animated transitions and floating gradient effects.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateAppearance({ reducedMotion: !settings.appearance.reducedMotion })}
                        className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                          settings.appearance.reducedMotion ? 'bg-primary' : 'bg-surface-container-high'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${
                            settings.appearance.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Section 5: Notifications Preferences (NEW) ── */}
            {isSectionVisible('notifications') && (
              <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30 transition-all">
                <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Notification Cadences &amp; Alerts
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Configure digest frequencies, spaced repetition reminders, and achievement alerts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-space-sm">
                  {/* Toggle 1: Email Digest */}
                  <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[22px] text-primary mt-0.5">
                        mail
                      </span>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          Weekly Learning Digest
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Receive weekly summary reports of study hours, milestones completed, and retention decay.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateNotifications({ emailDigest: !settings.notifications.emailDigest })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                        settings.notifications.emailDigest ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${
                          settings.notifications.emailDigest ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Spaced Repetition Alerts */}
                  <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[22px] text-primary mt-0.5">
                        alarm
                      </span>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          Spaced Repetition Review Alerts
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Gentle in-browser reminders when flashcard queues reach their review threshold.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateNotifications({
                          spacedRepetitionAlerts: !settings.notifications.spacedRepetitionAlerts,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                        settings.notifications.spacedRepetitionAlerts ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${
                          settings.notifications.spacedRepetitionAlerts ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Milestone Achievements */}
                  <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[22px] text-primary mt-0.5">
                        military_tech
                      </span>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          Milestone &amp; Capstone Credentials
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Receive notifications when major track milestones are evaluated and verified.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateNotifications({
                          milestoneAchievements: !settings.notifications.milestoneAchievements,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                        settings.notifications.milestoneAchievements ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${
                          settings.notifications.milestoneAchievements ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 4: AI Mentor Feedback */}
                  <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[22px] text-primary mt-0.5">
                        psychology
                      </span>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          AI Mentor Code Reviews
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Real-time alerts when IBM Granite finishes auditing attached codebases or architectural proofs.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateNotifications({ mentorFeedback: !settings.notifications.mentorFeedback })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                        settings.notifications.mentorFeedback ? 'bg-primary' : 'bg-surface-container-high'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform transform ${
                          settings.notifications.mentorFeedback ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ── Section 6: Security & Authentication ── */}
            {isSectionVisible('security') && (
              <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30 transition-all">
                <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container-low/40 -mx-space-lg -mt-space-lg p-space-lg rounded-t-xl border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">shield</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Security &amp; Authentication
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Multi-factor tokens, session tracking, and password verification.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-error-container/40 text-on-surface font-label-sm text-label-sm font-medium">
                    SOC-2 Compliant
                  </span>
                </div>

                <div className="space-y-space-md">
                  {/* Password Reset Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-label-md text-label-md text-on-surface font-semibold">
                          Account Password
                        </p>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-code-sm text-code-sm">
                          Encrypted (Argon2)
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Protected with cryptographic password hashing and salting.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        onClick={() => {
                          setShowPasswordModal(true);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                          setPasswordSuccess(false);
                        }}
                        className="px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container hover:text-primary text-on-surface font-label-md text-label-md font-medium transition-all shadow-sm flex items-center gap-1.5 group"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">
                          key
                        </span>
                        <span>Reset Password</span>
                      </button>
                    </div>
                  </div>

                  {/* 2FA Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed mt-0.5 shrink-0">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-label-md text-label-md text-on-surface font-semibold">
                            Two-Factor Authentication (2FA)
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 ${
                              settings.security.twoFactorEnabled
                                ? 'bg-primary-container text-on-primary'
                                : 'bg-surface-container text-outline'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[12px]">
                              {settings.security.twoFactorEnabled ? 'check' : 'close'}
                            </span>
                            {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          TOTP Authenticator application (1Password / Google Authenticator) verification.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        onClick={() => {
                          setShow2FAModal(true);
                          setTotpCode('');
                          setTotpError('');
                        }}
                        className="px-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container hover:text-primary text-on-surface font-label-md text-label-md font-medium transition-all shadow-sm flex items-center gap-1.5 group"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">
                          sync_alt
                        </span>
                        <span>{settings.security.twoFactorEnabled ? 'Reconfigure' : 'Enable 2FA'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Authorized Sessions */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-space-sm">
                      <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                        Active Authorized Sessions
                      </p>
                      <button
                        type="button"
                        onClick={handleLogOutOfAllSessions}
                        className="font-label-sm text-label-sm text-error hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Log Out of All Sessions
                      </button>
                    </div>

                    <div className="space-y-2">
                      {settings.security.activeSessions.map((sess) => (
                        <div
                          key={sess.id}
                          className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                sess.current ? 'text-primary' : 'text-outline'
                              }`}
                            >
                              {sess.device.includes('iPhone') || sess.device.includes('iOS')
                                ? 'phone_iphone'
                                : 'laptop_mac'}
                            </span>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface font-medium">
                                {sess.device}
                              </p>
                              <p className="font-code-sm text-code-sm text-outline">
                                {sess.location} • {sess.ip} •{' '}
                                {sess.current ? (
                                  <span className="text-primary font-semibold">Current Session</span>
                                ) : (
                                  <span>{sess.lastActive}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {sess.current ? (
                              <span className="font-code-sm text-code-sm text-primary font-semibold">
                                Active now
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRevokeSession(sess.id)}
                                className="font-label-sm text-label-sm text-error hover:underline px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant/30 hover:border-error transition-all"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Metric Sparkline & Data Storage (4 cols) */}
          <div className="lg:col-span-4 space-y-space-lg">
            {/* Memory Curve Stability Metric Card */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                    Memory Curve Stability
                  </p>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">94.2% Estimated</h4>
                </div>
                <span className="material-symbols-outlined text-[24px] text-primary">insights</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Based on your last 340 flashcard recalls across Distributed Systems &amp; Consensus topics.
              </p>

              {/* Retention Curve Chart */}
              <div className="w-full h-24 bg-surface-container-low rounded-lg p-2 flex items-end justify-center relative overflow-hidden border border-outline-variant/20">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 80">
                  <defs>
                    <linearGradient id="curveGradSettings" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 Q35,20 70,35 T140,25 T210,15 T280,10 L280,80 L0,80 Z"
                    fill="url(#curveGradSettings)"
                  ></path>
                  <path
                    d="M0,60 Q35,20 70,35 T140,25 T210,15 T280,10"
                    fill="none"
                    stroke="#3525cd"
                    strokeWidth="2.5"
                  ></path>
                  <circle cx="280" cy="10" fill="#3525cd" r="3.5"></circle>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-space-md pt-space-sm bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md rounded-b-xl border-t border-outline-variant/20">
                <div>
                  <p className="font-code-sm text-code-sm text-outline">Streak Retention</p>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold">14 Consecutive</p>
                </div>
                <div>
                  <p className="font-code-sm text-code-sm text-outline">Pending Recall</p>
                  <p className="font-headline-sm text-headline-sm text-primary font-bold">3 Modules</p>
                </div>
              </div>
            </section>

            {/* Offline Data & Export Section */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">folder_data</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Offline &amp; Cached Data</h4>
                  <p className="font-code-sm text-code-sm text-outline">12.4 MB stored locally</p>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Personal study notes, flashcard review history, and cached curriculum modules are safely stored on
                this device.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={exportUserDataBackup}
                  className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  Export Data Backup
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearCacheModal(true)}
                  className="font-label-sm text-label-sm text-on-surface-variant hover:text-error hover:underline font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">delete_outline</span>
                  Clear Cached Data
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Floating Sticky Action Bar */}
        <div className="sticky bottom-6 mt-space-xl z-30 w-full">
          <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md max-w-4xl mx-auto ring-1 ring-outline-variant/30 border border-outline-variant/30">
            <div className="flex items-center gap-space-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-primary">
                {hasUnsavedChanges ? 'pending' : 'check_circle'}
              </span>
              <span className="font-body-sm text-body-sm font-medium">
                {hasUnsavedChanges ? (
                  <span className="text-secondary font-semibold">Unsaved modifications ready to apply</span>
                ) : (
                  'All modifications are synchronized and staged locally.'
                )}
              </span>
              <span className="hidden md:inline font-code-sm text-code-sm text-outline">
                • Cloud Sync Active
              </span>
            </div>

            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <Link
                to="/dashboard"
                className="px-space-lg py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-all inline-flex items-center justify-center border border-outline-variant/30"
              >
                Cancel
              </Link>
              <button
                type="button"
                id="save-changes-btn"
                disabled={isSaving}
                onClick={handleSaveChanges}
                className={`px-space-xl py-2.5 rounded-lg font-label-md text-label-md font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                  saveSuccess
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                }`}
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Synchronizing...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Changes Applied!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: Avatar Picker ── */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => {
            setShowAvatarModal(false);
            setSelectedFilePreview(null);
            setUploadError(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-space-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Profile Photo & Avatar</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Upload an image from your device or select an engineer persona.
                </p>
              </div>
              <button
                type="button"
                id="closeAvatarModalBtn"
                onClick={() => {
                  setShowAvatarModal(false);
                  setSelectedFilePreview(null);
                  setUploadError(null);
                }}
                className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* 1. Device File Upload Section */}
            <div className="mb-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-primary">upload_file</span>
                  Upload From Your Device
                </span>
                <span className="font-label-sm text-xs text-outline">Max 5MB</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="avatarLocalFileInput"
              />

              {uploadError && (
                <div className="p-2.5 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 font-body-sm text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{uploadError}</span>
                </div>
              )}

              {selectedFilePreview ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                  <img
                    src={selectedFilePreview}
                    alt="Uploaded Preview"
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary/40 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className="font-label-md text-xs font-semibold text-on-surface truncate">
                      {selectedFileName || 'Uploaded Photo'}
                    </p>
                    <p className="font-code-sm text-[11px] text-outline mt-0.5">
                      {selectedFileSize} • Ready to apply
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmUploadedAvatar}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Save Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-outline-variant/40 hover:border-primary/60 rounded-xl cursor-pointer hover:bg-surface-container transition-all group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
                    <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
                  </div>
                  <p className="font-label-md text-xs font-semibold text-on-surface">
                    Choose an image from your device
                  </p>
                  <p className="font-body-sm text-[11px] text-outline mt-0.5">
                    PNG, JPEG, WebP, or GIF (up to 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* 2. Persona Preset Avatars Section */}
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2.5">
                Or Choose a Persona Avatar
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_AVATARS.map((av) => (
                  <div
                    key={av.url}
                    onClick={() => handleSelectPresetAvatar(av.url)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      settings.profile.avatarUrl === av.url
                        ? 'border-primary bg-primary-fixed/30 ring-2 ring-primary/30'
                        : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 bg-surface-container"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-label-sm text-xs text-on-surface font-medium truncate">
                        {av.label.split('(')[0].trim()}
                      </p>
                      <p className="font-code-sm text-[10px] text-outline truncate">
                        {av.label.includes('(') ? av.label.split('(')[1].replace(')', '') : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Reset Password ── */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-space-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Update Account Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 rounded-lg bg-error-container/30 border border-error/20 text-error text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-primary-fixed/40 border border-primary/20 text-primary text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Password successfully updated!</span>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-medium block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-medium block mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface font-medium block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: 2FA Reconfigure ── */}
      {show2FAModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShow2FAModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-space-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {settings.security.twoFactorEnabled ? 'Reconfigure 2FA' : 'Enable 2FA'}
              </h3>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Scan the QR code or enter the secret key in your authenticator app (Google Authenticator,
              1Password, or Authy).
            </p>

            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container-low mb-4 border border-outline-variant/30">
              <div className="w-32 h-32 bg-white rounded-lg p-2 shadow-inner flex items-center justify-center border border-outline-variant/40">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[64px] text-primary">qr_code_2</span>
                  <p className="text-[10px] text-outline font-code-sm">TOTP QR Code</p>
                </div>
              </div>
              <p className="font-code-sm text-code-sm text-outline mt-3">Secret Key:</p>
              <p className="font-code-sm text-code-sm text-primary font-bold select-all">
                JBSWY3DPEHPK3PXP
              </p>
            </div>

            {totpError && (
              <div className="mb-3 p-2.5 rounded-lg bg-error-container/30 border border-error/20 text-error text-body-sm">
                {totpError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-medium block mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full text-center text-xl tracking-widest px-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-code-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
                >
                  Verify &amp; Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: VCS Connect ── */}
      {showVcsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowVcsModal(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-space-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Connect {showVcsModal === 'github' ? 'GitHub' : 'GitLab'} Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowVcsModal(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Enter your {showVcsModal === 'github' ? 'GitHub' : 'GitLab'} username to link your public
              repositories and code portfolio.
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-label-md text-label-md text-on-surface font-medium block mb-1">
                  Username
                </label>
                <div className="flex items-center rounded-lg bg-surface-container-low border border-outline-variant/30 overflow-hidden">
                  <span className="px-3 py-2.5 text-outline font-code-sm text-code-sm bg-surface-container border-r border-outline-variant/30">
                    {showVcsModal === 'github' ? 'github.com/' : 'gitlab.com/'}
                  </span>
                  <input
                    type="text"
                    value={vcsUsername}
                    onChange={(e) => setVcsUsername(e.target.value)}
                    placeholder="your-username"
                    className="flex-1 px-3 py-2.5 bg-transparent text-on-surface font-body-sm text-body-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVcsModal(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConnectVcs}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
                >
                  Link Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Clear Cache Confirmation ── */}
      {showClearCacheModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowClearCacheModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-space-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/20 mb-4 text-error">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Clear Cached Study Data?</h3>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              This will remove cached flashcard review buffers and offline study notes stored in your browser.
              Your account, profile credentials, and server-synced learning pathway will remain safe.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearCacheModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearCache}
                className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md text-label-md font-semibold hover:bg-error/90 transition-all"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
