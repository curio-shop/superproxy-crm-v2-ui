import { Icon } from '@iconify/react';
import { useState } from 'react';

interface AddCompanyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const industries = [
  { id: 'tech', name: 'Technology', icon: 'solar:laptop-linear' },
  { id: 'software', name: 'Software', icon: 'solar:code-circle-linear' },
  { id: 'finance', name: 'Finance', icon: 'solar:wallet-money-linear' },
  { id: 'healthcare', name: 'Healthcare', icon: 'solar:health-linear' },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'solar:settings-linear' },
  { id: 'retail', name: 'Retail', icon: 'solar:shop-linear' },
  { id: 'education', name: 'Education', icon: 'solar:book-linear' },
  { id: 'aerospace', name: 'Aerospace', icon: 'solar:rocket-linear' },
  { id: 'realestate', name: 'Real Estate', icon: 'solar:home-linear' },
  { id: 'other', name: 'Other', icon: 'solar:help-linear' },
];

export default function AddCompanyDrawer({ isOpen, onClose }: AddCompanyDrawerProps) {
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [industrySearchQuery, setIndustrySearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  if (!isOpen) return null;

  const filteredIndustries = industries.filter((industry) =>
    industry.name.toLowerCase().includes(industrySearchQuery.toLowerCase())
  );

  const handleIndustrySelect = (id: string) => {
    setSelectedIndustry(id);
    setIndustryDropdownOpen(false);
    setIndustrySearchQuery('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
        style={{
          animation: 'fadeIn 300ms ease-out'
        }}
      />

      <div
        className="relative w-full max-w-[520px] h-full bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-all duration-500 ease-out border-l border-white/60 rounded-l-[32px] ml-auto overflow-hidden"
        style={{
          animation: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 backdrop-blur-md z-10 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <Icon icon="solar:buildings-2-linear" width="20" />
            </div>
            <div>
              <h2 className="text-lg text-slate-900 tracking-tight font-display font-semibold">
                Add Company
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                New entry for your database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center"
          >
            <Icon icon="solar:close-circle-linear" width="20" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form className="space-y-5">
            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:buildings-2-linear" width="14" />
                Company Details
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Acme Inc."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="flex rounded-xl shadow-sm border border-slate-200 bg-white/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <div className="relative flex items-center border-r border-slate-200 px-3">
                      <span className="text-xs font-medium text-slate-500">
                        +63
                      </span>
                      <Icon icon="solar:alt-arrow-down-linear" className="ml-1 text-slate-300" width="10" />
                    </div>
                    <input
                      type="tel"
                      className="block w-full border-0 bg-transparent py-2 pl-3 text-slate-700 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                      placeholder="906 463 6955"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Type
                  </label>
                  <div className="relative group">
                    <select className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 pl-10 text-sm font-semibold text-slate-900 transition-all hover:bg-white hover:shadow-md hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-sm">
                      <option value="" disabled selected>
                        Select Type
                      </option>
                      <option>Client</option>
                      <option>Partner</option>
                      <option>Prospect</option>
                      <option>Vendor</option>
                      <option>Competitor</option>
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Icon icon="solar:buildings-2-linear" width="18" />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Icon icon="lucide:chevron-down" width="16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:map-point-linear" width="14" />
                Location &amp; Contact
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      City
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                      placeholder="e.g. New York"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      State/Region
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                      placeholder="e.g. NY"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                      placeholder="e.g. 10001"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Website
                  </label>
                  <input
                    type="url"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                    placeholder="e.g. www.company.com or company.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:case-linear" width="14" />
                Business Information
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Industry
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-10 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md hover:border-slate-300 text-left flex items-center justify-between"
                    >
                      <span>
                        {selectedIndustry
                          ? industries.find((i) => i.id === selectedIndustry)?.name
                          : 'Select an industry'}
                      </span>
                      <Icon
                        icon="lucide:chevron-down"
                        width="16"
                        className={`text-slate-400 transition-transform ${industryDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Icon icon="solar:case-linear" width="18" />
                    </div>

                    {industryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl shadow-slate-900/10 z-50 overflow-hidden max-h-72">
                        <div className="p-3 border-b border-slate-100">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Icon icon="solar:magnifer-linear" width="16" className="text-slate-400" />
                            </div>
                            <input
                              type="text"
                              value={industrySearchQuery}
                              onChange={(e) => setIndustrySearchQuery(e.target.value)}
                              placeholder="Search industries..."
                              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredIndustries.map((industry) => (
                            <button
                              key={industry.id}
                              type="button"
                              onClick={() => handleIndustrySelect(industry.id)}
                              className={`w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-all text-left border-b border-slate-100 last:border-0 ${
                                selectedIndustry === industry.id ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                  <Icon icon={industry.icon} width="18" />
                                </div>
                                <p className="text-sm font-semibold text-slate-900">{industry.name}</p>
                              </div>
                              {selectedIndustry === industry.id && (
                                <Icon icon="solar:check-circle-bold" className="text-blue-600" width="20" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 resize-none"
                    placeholder="e.g. Brief description about the company..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:users-group-rounded-linear" width="14" />
                Associates
              </h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Select existing contacts to associate with this company. Their company field will be updated automatically.
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="solar:magnifer-linear" width="16" className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 rounded-xl border-slate-200 bg-white/80 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                  placeholder="Select contacts to associate"
                />
              </div>
            </div>

            <div className="h-12"></div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-slate-100/50 bg-white/80 backdrop-blur-xl flex items-center gap-3 absolute bottom-0 w-full z-20">
          <button className="flex-1 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-t border-white/20 text-white px-4 py-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Icon icon="solar:check-circle-linear" width="18" />
            Create Company
          </button>
          <button className="hover:bg-slate-50 transition-all active:scale-[0.98] text-sm font-semibold text-slate-600 bg-white border-slate-200 border rounded-xl px-4 py-2.5 shadow-sm whitespace-nowrap">
            Create &amp; Add Another
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
