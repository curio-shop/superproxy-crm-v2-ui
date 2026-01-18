import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AccountProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'billing' | 'workspaces' | 'contact'>('profile');
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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
    marketingEmails: false,
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
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const [contactForm, setContactForm] = useState({
    subject: 'General Inquiry',
    message: '',
    priority: 'normal' as 'normal' | 'urgent',
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setShowDeleteModal(false);
    setDeleteConfirmText('');
    alert('Account deletion requested. You will receive a confirmation email.');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (contactForm.message.length > 500) {
      alert('Message must be 500 characters or less');
      return;
    }

    setIsSubmittingContact(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to submit a contact form');
        setIsSubmittingContact(false);
        return;
      }

      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          user_id: user.id,
          user_email: profileData.email,
          user_name: `${profileData.firstName} ${profileData.lastName}`,
          subject: contactForm.subject,
          message: contactForm.message,
          priority: contactForm.priority,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      const newTicketNumber = `CS-${data.id.slice(0, 8).toUpperCase()}`;
      setTicketNumber(newTicketNumber);
      setShowSuccessModal(true);
      setContactForm({
        subject: 'General Inquiry',
        message: '',
        priority: 'normal',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal && !isDeleting) {
        setShowDeleteModal(false);
        setDeleteConfirmText('');
      }
    };

    if (showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDeleteModal, isDeleting]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'solar:user-linear' },
    { id: 'preferences', label: 'Preferences', icon: 'solar:settings-minimalistic-linear' },
    { id: 'security', label: 'Security', icon: 'solar:shield-keyhole-linear' },
    { id: 'billing', label: 'Billing', icon: 'solar:card-linear' },
    { id: 'workspaces', label: 'Workspaces', icon: 'solar:buildings-2-linear' },
    { id: 'contact', label: 'Contact Us', icon: 'solar:chat-round-call-linear' },
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-8 pt-6">
        <div className="max-w-7xl mx-auto">
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
                    <div className="absolute -bottom-1.5 -right-1.5 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-lg ring-2 ring-blue-50">
                      <Icon icon="solar:check-circle-bold" width="18" className="text-blue-600" />
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
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-8 py-6">
        <div className="max-w-7xl mx-auto h-full flex gap-8">
          <div className="w-64 flex-shrink-0">
            <nav className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2 sticky top-0">
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

          <div ref={contentScrollRef} className="flex-1 min-w-0 overflow-y-auto custom-scrollbar pr-2">
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

                  <div className="p-6">
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

                  <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => alert('Logging out...')}
                      className="inline-flex items-center gap-2 px-10 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-white text-sm font-semibold shadow-sm"
                    >
                      <Icon icon="solar:logout-linear" width="18" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_50%)]"></div>

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-amber-400 blur-xl opacity-40 rounded-full"></div>
                          <Icon icon="solar:crown-bold" width="26" className="text-amber-400 relative drop-shadow-lg" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white tracking-tight">Free Trial</h2>
                          <p className="text-slate-400 text-sm">14 days remaining</p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-xl"></div>
                        <span className="relative px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-400/40 tracking-wider shadow-lg backdrop-blur-sm">
                          TRIAL
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white tracking-tight">$9</span>
                        <span className="text-slate-400 text-sm">/month</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Unlock unlimited potential with multiple workspaces, team collaboration, and advanced features. No lock-in period, cancel anytime.
                      </p>
                      <ul className="space-y-2.5 text-sm">
                        <li className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full"></div>
                              <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-400 relative" />
                            </div>
                          </div>
                          <span className="text-slate-200 font-medium">Unlimited quotations, invoices, and presentations</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full"></div>
                              <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-400 relative" />
                            </div>
                          </div>
                          <span className="text-slate-200 font-medium">No watermarks on any documents</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full"></div>
                              <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-400 relative" />
                            </div>
                          </div>
                          <span className="text-slate-200 font-medium">Team collaboration with shared access</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full"></div>
                              <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-400 relative" />
                            </div>
                          </div>
                          <span className="text-slate-200 font-medium">Full access to AI features and smart calling</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full"></div>
                              <Icon icon="solar:check-circle-bold" width="18" className="text-emerald-400 relative" />
                            </div>
                          </div>
                          <span className="text-slate-200 font-medium">Priority support and dedicated account manager</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => window.open('https://billing.stripe.com', '_blank')}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Icon icon="solar:rocket-2-bold" width="18" />
                      Upgrade to Superporxy Professional Now
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
                          onClick={() => setShowDeleteModal(true)}
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

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                      <Icon icon="solar:chat-round-call-bold" width="32" className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">We're Here to Help</h2>
                    <p className="text-slate-600 max-w-md mx-auto">
                      Have a question or need assistance? Our support team is ready to help you succeed.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
                    <p className="text-sm text-slate-500 mt-1">Fill out the form below and we'll get back to you shortly</p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Your Name</label>
                        <input
                          type="text"
                          value={`${profileData.firstName} ${profileData.lastName}`}
                          readOnly
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm cursor-not-allowed text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Your Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          readOnly
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm cursor-not-allowed text-slate-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Subject</label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        disabled={isSubmittingContact}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Billing Question">Billing Question</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        disabled={isSubmittingContact}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={6}
                        maxLength={500}
                        placeholder="Describe your question or issue in detail..."
                        required
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-500">Please be as detailed as possible</p>
                        <p className={`text-xs font-medium ${contactForm.message.length > 450 ? 'text-amber-600' : 'text-slate-500'}`}>
                          {contactForm.message.length}/500
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Priority</label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, priority: 'normal' })}
                          disabled={isSubmittingContact}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            contactForm.priority === 'normal'
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:chat-round-line-linear" width="18" />
                          Normal
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, priority: 'urgent' })}
                          disabled={isSubmittingContact}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            contactForm.priority === 'urgent'
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:danger-triangle-linear" width="18" />
                          Urgent
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact || !contactForm.message.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingContact ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:letter-bold" width="18" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Other Ways to Reach Us</h2>
                    <p className="text-sm text-slate-500 mt-1">Alternative contact methods for your convenience</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon icon="solar:letter-linear" width="20" className="text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">Email Support</h3>
                        <p className="text-xs text-slate-500 mb-2">Send us an email directly</p>
                        <a
                          href="mailto:support@superproxy.ai"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          support@superproxy.ai
                          <Icon icon="solar:arrow-right-up-linear" width="14" />
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('support@superproxy.ai');
                          alert('Email address copied to clipboard!');
                        }}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"
                        title="Copy email address"
                      >
                        <Icon icon="solar:copy-linear" width="18" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-emerald-50/30 rounded-xl border border-blue-100">
                      <div className="h-11 w-11 rounded-xl bg-white border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon icon="solar:chat-round-dots-bold" width="20" className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">Live Chat Support</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          Get instant responses from our support team through the live chat feature. Available right here in your account profile for faster assistance.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          Response time: We typically respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-modal-title"
          aria-describedby="delete-account-modal-description"
        >
          <div
            className="fixed inset-0"
            onClick={!isDeleting ? () => {
              setShowDeleteModal(false);
              setDeleteConfirmText('');
            } : undefined}
          />

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-5 ring-8 ring-rose-50">
                <Icon icon="solar:danger-triangle-bold" width="32" className="text-rose-600" />
              </div>

              <h3
                id="delete-account-modal-title"
                className="text-xl font-bold text-slate-900 mb-2"
              >
                Delete Account
              </h3>

              <p
                id="delete-account-modal-description"
                className="text-sm text-slate-600 mb-1"
              >
                This action is permanent and cannot be undone
              </p>

              <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-4 my-5">
                <ul className="text-left text-sm text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Icon icon="solar:close-circle-bold" width="18" className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>All your personal data will be permanently deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="solar:close-circle-bold" width="18" className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>You will lose access to all workspaces and documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon icon="solar:close-circle-bold" width="18" className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>This action cannot be reversed or undone</span>
                  </li>
                </ul>
              </div>

              <div className="w-full mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2 text-left">
                  Type <span className="font-mono text-rose-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  disabled={isDeleting}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:trash-bin-minimalistic-bold" width="16" />
                      <span>Yes, delete account</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setShowSuccessModal(false)} />

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5 ring-8 ring-emerald-50">
                <Icon icon="solar:check-circle-bold" width="32" className="text-emerald-600" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Message Sent Successfully
              </h3>

              <p className="text-sm text-slate-600 mb-4">
                Thank you for contacting us. We've received your message and will respond to <span className="font-semibold text-slate-900">{profileData.email}</span> within 24 hours.
              </p>

              <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">Your Ticket Number</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ticketNumber);
                      alert('Ticket number copied to clipboard!');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-lg font-mono font-bold text-slate-900">{ticketNumber}</p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-slate-600 leading-relaxed">
                  For faster support, use the live chat feature available in your account profile. Our team can provide instant assistance with your inquiry.
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-5 py-3 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 active:scale-95"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
