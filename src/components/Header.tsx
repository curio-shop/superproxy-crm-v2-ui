import { Icon } from '@iconify/react';
import { useState } from 'react';
import NotificationCard from './NotificationCard';
import CurrencyDropdown from './CurrencyDropdown';
import Dropdown from './Dropdown';

interface HeaderProps {
  activePage: string;
  onOpenDrawer?: () => void;
  onCreateWorkspace?: () => void;
  onJoinWorkspace?: () => void;
  isTeamView?: boolean;
  onToggleView?: (isTeam: boolean) => void;
  onNavigateToNotifications?: () => void;
}

export default function Header({ activePage, onOpenDrawer, onCreateWorkspace, onJoinWorkspace, isTeamView = false, onToggleView, onNavigateToNotifications }: HeaderProps) {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [filterCurrency, setFilterCurrency] = useState('ALL');
  const [showConverter, setShowConverter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'SGD'];

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
    SGD: 'S$',
  };

  const exchangeRates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.52, CAD: 1.36, CHF: 0.88, CNY: 7.24, INR: 83.12, SGD: 1.34, USD: 1 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 162.50, AUD: 1.65, CAD: 1.48, CHF: 0.96, CNY: 7.88, INR: 90.45, SGD: 1.46, EUR: 1 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 189.30, AUD: 1.92, CAD: 1.72, CHF: 1.11, CNY: 9.19, INR: 105.42, SGD: 1.70, GBP: 1 },
    JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, AUD: 0.010, CAD: 0.0091, CHF: 0.0059, CNY: 0.048, INR: 0.56, SGD: 0.009, JPY: 1 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.40, CAD: 0.89, CHF: 0.58, CNY: 4.76, INR: 54.68, SGD: 0.88, AUD: 1 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 109.93, AUD: 1.12, CHF: 0.65, CNY: 5.32, INR: 61.12, SGD: 0.99, CAD: 1 },
    CHF: { USD: 1.14, EUR: 1.04, GBP: 0.90, JPY: 169.89, AUD: 1.72, CAD: 1.54, CNY: 8.23, INR: 94.45, SGD: 1.52, CHF: 1 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.67, AUD: 0.21, CAD: 0.19, CHF: 0.12, INR: 11.48, SGD: 0.19, CNY: 1 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.087, SGD: 0.016, INR: 1 },
    SGD: { USD: 0.75, EUR: 0.68, GBP: 0.59, JPY: 111.57, AUD: 1.14, CAD: 1.01, CHF: 0.66, CNY: 5.40, INR: 62.01, SGD: 1 },
  };

  const convertCurrency = (value: number): number => {
    return value * (exchangeRates[fromCurrency]?.[toCurrency] || 1);
  };

  const convertedAmount = convertCurrency(parseFloat(amount) || 0);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleDisplayDropdownChange = (open: boolean) => {
    if (open) {
      setFilterDropdownOpen(false);
      setShowConverter(false);
    }
    setDisplayDropdownOpen(open);
  };

  const handleFilterDropdownChange = (open: boolean) => {
    if (open) {
      setDisplayDropdownOpen(false);
      setShowConverter(false);
    }
    setFilterDropdownOpen(open);
  };

  const handleConverterToggle = () => {
    const newState = !showConverter;
    if (newState) {
      setDisplayDropdownOpen(false);
      setFilterDropdownOpen(false);
    }
    setShowConverter(newState);
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/30 sticky top-0 bg-white/40 backdrop-blur-xl z-30 transition-all">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight font-display">
          {activePage === 'contacts'
            ? 'Contacts'
            : activePage === 'companies'
            ? 'Companies'
            : activePage === 'products'
            ? 'Products'
            : activePage === 'quotations'
            ? 'Quotations'
            : activePage === 'invoices'
            ? 'Invoices'
            : activePage === 'workspace'
            ? 'Workspace'
            : activePage === 'account'
            ? 'Account Settings'
            : 'Good afternoon, Richard!'}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {activePage === 'contacts'
            ? 'Manage leads, track interactions, and organize business relationships.'
            : activePage === 'companies'
            ? 'Manage organizations, partnerships, and business accounts.'
            : activePage === 'products'
            ? 'Manage inventory, track stock levels, and organize your catalog.'
            : activePage === 'quotations'
            ? 'Create, track, and manage client quotations with ease.'
            : activePage === 'invoices'
            ? 'Track payments, manage billing, and monitor invoice status.'
            : activePage === 'workspace'
            ? 'Manage your team, settings, and workspace configuration.'
            : activePage === 'account'
            ? 'Manage your profile, security, and preferences.'
            : isTeamView
            ? 'Viewing consolidated team performance and metrics.'
            : 'Track your revenue performance, quotations, and business growth.'}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {activePage === 'home' && onToggleView && (
          <div className="relative flex items-center gap-0.5 bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 rounded-xl p-0.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]">
            <button
              onClick={() => onToggleView(false)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all duration-300 min-w-[100px] justify-center overflow-hidden group ${
                !isTeamView
                  ? 'bg-white text-slate-800 shadow-[0_2px_6px_-1px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)] border border-slate-200/60'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 opacity-60 hover:opacity-100'
              }`}
            >
              <Icon icon="solar:user-circle-bold" width="15" className={!isTeamView ? 'text-slate-700' : 'text-slate-400'} />
              <span className="relative z-10">Personal</span>
              {!isTeamView && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
            <button
              onClick={() => onToggleView(true)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all duration-300 min-w-[100px] justify-center overflow-hidden group ${
                isTeamView
                  ? 'bg-white text-slate-800 shadow-[0_2px_6px_-1px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)] border border-slate-200/60'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 opacity-60 hover:opacity-100'
              }`}
            >
              <Icon icon="solar:users-group-rounded-bold" width="15" className={isTeamView ? 'text-slate-700' : 'text-slate-400'} />
              <span className="relative z-10">Team</span>
              {isTeamView && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          </div>
        )}

        {activePage === 'home' && onToggleView && (
          <div className="h-8 w-px bg-slate-200"></div>
        )}

        {activePage === 'contacts' && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="20" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Add Contact</span>
          </button>
        )}
        {activePage === 'companies' && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="20" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Add Company</span>
          </button>
        )}
        {activePage === 'products' && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="20" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Add Product</span>
          </button>
        )}
        {activePage === 'quotations' && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="20" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Create Quote</span>
          </button>
        )}
        {activePage !== 'contacts' && activePage !== 'companies' && activePage !== 'products' && activePage !== 'quotations' && activePage !== 'invoices' && activePage !== 'workspace' && (
          <div className="hidden lg:flex gap-3 items-center">
            {/* Display Currency Selector */}
            <CurrencyDropdown
              value={displayCurrency}
              options={currencies}
              onChange={setDisplayCurrency}
              icon="solar:dollar-minimalistic-linear"
              label="Display:"
              isOpen={displayDropdownOpen}
              onOpenChange={handleDisplayDropdownChange}
            />

            {/* Currency Filter */}
            <CurrencyDropdown
              value={filterCurrency}
              options={[
                { value: 'ALL', label: 'All Currencies' },
                ...currencies.map((c) => ({ value: c, label: c })),
              ]}
              onChange={setFilterCurrency}
              icon="solar:filter-linear"
              isOpen={filterDropdownOpen}
              onOpenChange={handleFilterDropdownChange}
            />

            {/* Currency Converter Toggle */}
            <div className="relative">
            <button
              onClick={handleConverterToggle}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 active:scale-[0.98]"
            >
              <Icon icon="solar:transfer-horizontal-linear" width="16" className="text-slate-500 group-hover:text-slate-700 transition-colors" />
              <span>Convert</span>
            </button>

            {showConverter && (
              <div className="absolute top-full right-0 mt-2 w-80 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 z-[60]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">Currency Converter</h3>
                  <button
                    onClick={() => setShowConverter(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Icon icon="solar:close-circle-linear" width="20" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">From</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 focus:border-slate-400 focus:ring-0 outline-none transition-colors"
                        placeholder="Amount"
                      />
                      <Dropdown
                        value={fromCurrency}
                        options={currencies}
                        onChange={(val) => setFromCurrency(val as string)}
                        buttonClassName="h-[38px] px-3"
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleSwapCurrencies}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
                      aria-label="Swap currencies"
                    >
                      <Icon icon="solar:refresh-linear" width="18" className="text-slate-600" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">To</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={convertedAmount.toFixed(2)}
                        readOnly
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 outline-none"
                      />
                      <Dropdown
                        value={toCurrency}
                        options={currencies}
                        onChange={(val) => setToCurrency(val as string)}
                        buttonClassName="h-[38px] px-3"
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-500 text-center">
                    1 {fromCurrency} = {exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4)} {toCurrency}
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        )}

        {(activePage === 'contacts' || activePage === 'companies' || activePage === 'products' || activePage === 'quotations' || activePage === 'invoices') && (
          <div className="h-8 w-px bg-slate-200"></div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="group hover:text-slate-800 hover:border-slate-300 hover:shadow-md transition-all flex outline-none focus:ring-2 focus:ring-slate-100 text-slate-500 bg-white w-10 h-10 border-slate-200 border rounded-xl relative items-center justify-center"
          >
            <Icon icon="solar:bell-linear" width="22" className="transition-transform group-hover:scale-105 group-active:scale-95" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
            </span>
          </button>

          <NotificationCard
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            onViewAll={() => {
              setShowNotifications(false);
              onNavigateToNotifications?.();
            }}
          />
        </div>
      </div>
    </header>
  );
}
