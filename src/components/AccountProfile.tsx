import { Icon } from '@iconify/react';
import { useState, useRef } from 'react';

export default function AccountProfile() {
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

  const [companies] = useState([
    { id: '1', name: 'Fiamma', role: 'Owner', joined: '2024-01-15' },
    { id: '2', name: 'Acme Corporation', role: 'Admin', joined: '2024-03-20' },
    { id: '3', name: 'TechStart Inc', role: 'Member', joined: '2024-06-10' },
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

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
            <p className="text-sm text-slate-500 mt-1">Update your personal details and profile picture</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                  {avatarPreview || profileData.avatar ? (
                    <img
                      src={avatarPreview || profileData.avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon icon="solar:user-linear" width="32" className="text-slate-400" />
                  )}
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center shadow-lg">
                  <Icon icon="solar:check-circle-bold" width="16" className="text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Profile Picture</h3>
                  <p className="text-xs text-slate-500 mb-3">PNG, JPG or WEBP (max. 5MB). Recommended size: 400x400px</p>
                </div>
                <div className="flex items-center gap-2">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                  >
                    <Icon icon="solar:upload-linear" width="16" />
                    Upload Photo
                  </label>
                  {(avatarPreview || profileData.avatar) && (
                    <button
                      onClick={() => {
                        setAvatarPreview(null);
                        setProfileData({ ...profileData, avatar: '' });
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
                    >
                      <Icon icon="solar:trash-bin-trash-linear" width="16" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm pr-10 cursor-not-allowed text-slate-600"
                    placeholder="your@email.com"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Email address cannot be changed</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm cursor-pointer"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-sm resize-none"
                  rows={3}
                  placeholder="Tell us a little about yourself..."
                />
                <p className="text-xs text-slate-500 mt-1.5">Brief description for your profile</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">Make sure your information is up to date</p>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Security</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your password and security settings</p>
            </div>

            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Icon icon="solar:lock-password-linear" width="20" className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-slate-900">Change Password</h3>
                    <p className="text-xs text-slate-500">Update your account password</p>
                  </div>
                </div>
                <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Icon icon="solar:shield-check-linear" width="20" className="text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Disabled</span>
                  <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Icon icon="solar:devices-linear" width="20" className="text-amber-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-slate-900">Active Sessions</h3>
                    <p className="text-xs text-slate-500">Manage your active devices</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">3 devices</span>
                  <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Account Activity</h2>
              <p className="text-sm text-slate-500 mt-1">Overview of your account usage</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="solar:file-text-linear" width="18" className="text-slate-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quotations</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{activityData.totalQuotations}</p>
                  <p className="text-xs text-slate-500 mt-1">Total created</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="solar:bill-list-linear" width="18" className="text-slate-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoices</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{activityData.totalInvoices}</p>
                  <p className="text-xs text-slate-500 mt-1">Total generated</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:clock-circle-linear" width="20" className="text-slate-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Last Login</h3>
                    <p className="text-xs text-slate-500">{activityData.lastLogin}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:calendar-linear" width="20" className="text-slate-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Member Since</h3>
                    <p className="text-xs text-slate-500">{activityData.accountCreated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Your Companies</h2>
            <p className="text-sm text-slate-500 mt-1">Workspaces you've joined or created</p>
          </div>

          <div className="p-6 space-y-3">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{company.name}</h3>
                    <p className="text-xs text-slate-500">Joined {new Date(company.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  company.role === 'Owner'
                    ? 'bg-slate-900 text-white'
                    : company.role === 'Admin'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {company.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Billing & Subscription</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your subscription and billing</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:crown-line-bold" width="20" className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Free Trial</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    14 days remaining. Upgrade to unlock unlimited features and premium support.
                  </p>
                  <button
                    onClick={() => window.open('https://billing.stripe.com', '_blank')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <Icon icon="solar:card-linear" width="16" />
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon icon="solar:bill-list-linear" width="20" className="text-slate-400" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Billing History</h3>
                  <p className="text-xs text-slate-500">View past invoices and receipts</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                View History
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-rose-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-rose-100">
            <h2 className="text-lg font-bold text-rose-900">Danger Zone</h2>
            <p className="text-sm text-rose-600 mt-1">Irreversible actions that affect your account</p>
          </div>

          <div className="p-6 space-y-3">
            <button
              onClick={() => alert('Logging out...')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon icon="solar:logout-linear" width="20" className="text-slate-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-900">Log Out</h3>
                  <p className="text-xs text-slate-500">Sign out from this device</p>
                </div>
              </div>
              <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all group border border-rose-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Icon icon="solar:logout-2-linear" width="20" className="text-rose-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-rose-900">Sign Out All Devices</h3>
                  <p className="text-xs text-rose-600">End all active sessions except this one</p>
                </div>
              </div>
              <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-rose-400 group-hover:text-rose-600 transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all group border border-rose-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Icon icon="solar:trash-bin-trash-linear" width="20" className="text-rose-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-rose-900">Delete Account</h3>
                  <p className="text-xs text-rose-600">Permanently delete your account and all data</p>
                </div>
              </div>
              <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-rose-400 group-hover:text-rose-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
