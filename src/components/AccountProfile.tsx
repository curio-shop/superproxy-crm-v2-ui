import { Icon } from '@iconify/react';
import { useState, useRef } from 'react';

export default function AccountProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'billing' | 'workspaces'>('profile');
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'Melwyn',
    lastName: 'Arrubio',
    email: 'arrubiomelwyn@gmail.com',
    phone: '+63 906 463 6955',
    location: 'Bangkok, Thailand',
    timezone: 'Asia/Bangkok',
    bio: 'Product designer and developer focused on creating beautiful, user-friendly experiences.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
    language: 'en',
  });

  const [sessions] = useState([
    { id: '1', device: 'Chrome on MacOS', location: 'Bangkok, Thailand', lastActive: '2 mins ago', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'Bangkok, Thailand', lastActive: '1 hour ago', current: false },
    { id: '3', device: 'Firefox on Windows', location: 'Chiang Mai, Thailand', lastActive: '2 days ago', current: false },
  ]);

  const [companies] = useState([
    { id: '1', name: 'Fiamma', role: 'Owner', joined: '2024-01-15', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&q=80' },
    { id: '2', name: 'Acme Corporation', role: 'Admin', joined: '2024-03-20', logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=80&q=80' },
    { id: '3', name: 'TechStart Inc', role: 'Member', joined: '2024-06-10', logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&q=80' },
  ]);

  const [activityData] = useState({
    lastLogin: '2 hours ago',
    accountCreated: 'Jan 15, 2024',
    totalQuotations: 24,
    totalInvoices: 18,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Avatar file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      setUploadingAvatar(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setProfileData({ ...profileData, avatar: reader.result as string });
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    alert('Profile updated successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'solar:user-linear' },
    { id: 'preferences', label: 'Preferences', icon: 'solar:settings-minimalistic-linear' },
    { id: 'security', label: 'Security', icon: 'solar:shield-keyhole-linear' },
    { id: 'billing', label: 'Billing', icon: 'solar:card-linear' },
    { id: 'workspaces', label: 'Workspaces', icon: 'solar:buildings-2-linear' },
  ] as const;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-xl ring-2 ring-slate-200">
                    {avatarPreview || profileData.avatar ? (
                      <img
                        src={avatarPreview || profileData.avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Icon icon="solar:user-linear" width="36" className="text-slate-400" />
                      </div>
                    )}
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-3xl">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center shadow-lg">
                    <Icon icon="solar:check-circle-bold" width="16" className="text-white" />
                  </div>
                </div>

                <div className="pt-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-slate-600 mb-3">{profileData.email}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Icon icon="solar:map-point-linear" width="16" />
                      {profileData.location}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Icon icon="solar:calendar-linear" width="16" />
                      Member since {activityData.accountCreated}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-center px-4">
                  <div className="text-2xl font-bold text-slate-900">{activityData.totalQuotations}</div>
                  <div className="text-xs text-slate-500 font-medium">Quotations</div>
                </div>
                <div className="h-10 w-px bg-slate-200"></div>
                <div className="text-center px-4">
                  <div className="text-2xl font-bold text-slate-900">{activityData.totalInvoices}</div>
                  <div className="text-xs text-slate-500 font-medium">Invoices</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2 sticky top-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon icon={tab.icon} width="20" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    <p className="text-sm text-slate-500 mt-1">Update your personal details and public profile</p>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 pb-6 border-b border-slate-100">
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                        >
                          <Icon icon="solar:upload-linear" width="16" />
                          Upload New
                        </label>
                        {(avatarPreview || profileData.avatar) && (
                          <button
                            onClick={() => {
                              setAvatarPreview(null);
                              setProfileData({ ...profileData, avatar: '' });
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                          >
                            <Icon icon="solar:trash-bin-trash-linear" width="16" />
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">PNG, JPG or WEBP. Max 5MB. Recommended 400x400px</p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">First Name</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                          placeholder="Enter last name"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profileData.email}
                            readOnly
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm pr-10 cursor-not-allowed text-slate-600"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-500" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Your email address is verified and cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Timezone</label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm cursor-pointer"
                        >
                          <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                          <option value="America/New_York">New York (GMT-5)</option>
                          <option value="Europe/London">London (GMT+0)</option>
                          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                          <option value="Australia/Sydney">Sydney (GMT+11)</option>
                          <option value="Europe/Paris">Paris (GMT+1)</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm resize-none"
                          rows={4}
                          placeholder="Tell us a little about yourself..."
                        />
                        <p className="text-xs text-slate-500 mt-2">Brief description for your public profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Icon icon="solar:check-circle-bold" width="16" />
                      <span className="font-medium">All changes saved</span>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Appearance</h2>
                    <p className="text-sm text-slate-500 mt-1">Customize how the app looks and feels</p>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <Icon icon={isDarkMode ? "solar:moon-bold" : "solar:sun-bold"} width="24" className="text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Dark Mode</h3>
                          <p className="text-xs text-slate-500">Toggle between light and dark theme</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          isDarkMode ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                            isDarkMode ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <Icon icon="solar:palette-2-linear" width="24" className="text-slate-700" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Language</h3>
                          <p className="text-xs text-slate-500">Select your preferred language</p>
                        </div>
                      </div>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage how you receive updates</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:letter-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Email Notifications</h3>
                          <p className="text-xs text-slate-500">Receive email updates about your activity</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.emailNotifications ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:bell-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Push Notifications</h3>
                          <p className="text-xs text-slate-500">Receive push notifications in your browser</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.pushNotifications ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:calendar-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Weekly Digest</h3>
                          <p className="text-xs text-slate-500">Get a weekly summary of your activity</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, weeklyDigest: !preferences.weeklyDigest })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.weeklyDigest ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:mailbox-linear" width="20" className="text-slate-400" />
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Marketing Emails</h3>
                          <p className="text-xs text-slate-500">Receive news and product updates</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, marketingEmails: !preferences.marketingEmails })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          preferences.marketingEmails ? 'bg-slate-900' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your account security and authentication</p>
                  </div>

                  <div className="p-6 space-y-3">
                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Icon icon="solar:lock-password-linear" width="22" className="text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Change Password</h3>
                          <p className="text-xs text-slate-500">Update your account password</p>
                        </div>
                      </div>
                      <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>

                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <Icon icon="solar:shield-check-linear" width="22" className="text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Two-Factor Authentication</h3>
                          <p className="text-xs text-slate-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold">Disabled</span>
                        <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Active Sessions</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage where you're logged in</p>
                      </div>
                      <button className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                        Log out all sessions
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <Icon icon="solar:monitor-smartphone-linear" width="20" className="text-slate-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-slate-900">{session.device}</h3>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">Current</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{session.location} • {session.lastActive}</p>
                          </div>
                        </div>
                        {!session.current && (
                          <button className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">
                            Log out
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <button
                      onClick={() => alert('Logging out...')}
                      className="w-full flex items-center justify-center gap-3 p-4 bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-white font-semibold shadow-lg"
                    >
                      <Icon icon="solar:logout-linear" width="20" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon="solar:crown-bold" width="24" className="text-amber-400" />
                          <h2 className="text-2xl font-bold text-white">Free Trial</h2>
                        </div>
                        <p className="text-slate-300 text-sm">14 days remaining</p>
                      </div>
                      <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/30">
                        TRIAL
                      </span>
                    </div>

                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                      Upgrade to unlock unlimited features and premium support. Get access to advanced analytics, priority customer service, and more.
                    </p>

                    <button
                      onClick={() => window.open('https://billing.stripe.com', '_blank')}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-lg"
                    >
                      <Icon icon="solar:card-linear" width="18" />
                      Upgrade to Pro
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Billing History</h2>
                    <p className="text-sm text-slate-500 mt-1">View and download your invoices</p>
                  </div>

                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Icon icon="solar:bill-list-linear" width="28" className="text-slate-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">No billing history yet</h3>
                      <p className="text-xs text-slate-500">Your invoices and receipts will appear here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your payment information</p>
                  </div>

                  <div className="p-6">
                    <button className="w-full flex items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all">
                      <Icon icon="solar:card-linear" width="20" />
                      <span className="text-sm font-semibold">Add Payment Method</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workspaces' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Your Workspaces</h2>
                    <p className="text-sm text-slate-500 mt-1">Organizations you've joined or created</p>
                  </div>

                  <div className="p-6 grid grid-cols-1 gap-4">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 group">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                            <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{company.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Joined {new Date(company.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            company.role === 'Owner'
                              ? 'bg-slate-900 text-white'
                              : company.role === 'Admin'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {company.role}
                          </span>
                          <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                            <Icon icon="solar:settings-linear" width="18" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowDangerZone(!showDangerZone)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon icon="solar:danger-triangle-linear" width="20" className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">Advanced Settings</span>
                  </div>
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    width="18"
                    className={`text-slate-400 transition-transform ${showDangerZone ? 'rotate-180' : ''}`}
                  />
                </button>

                {showDangerZone && (
                  <div className="bg-gradient-to-br from-rose-50 to-red-50/30 border-2 border-rose-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-rose-200">
                      <div className="flex items-center gap-3">
                        <Icon icon="solar:danger-triangle-bold" width="24" className="text-rose-600" />
                        <div>
                          <h2 className="text-lg font-bold text-rose-900">Danger Zone</h2>
                          <p className="text-sm text-rose-600 mt-0.5">Irreversible and destructive actions</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="bg-white border-2 border-rose-300 rounded-xl p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Delete Account</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          Once you delete your account, there is no going back. All your data, workspaces, and documents will be permanently erased. This action cannot be undone.
                        </p>
                        <button
                          onClick={() => {
                            if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                              alert('Account deletion requested');
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                          <Icon icon="solar:trash-bin-minimalistic-bold" width="16" />
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
