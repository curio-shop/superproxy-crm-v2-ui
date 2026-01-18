import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  profile: string | null;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  currentWorkspace: Workspace | null;
  onCreateNew?: (type: 'contact' | 'company' | 'product' | 'quote' | 'invoice') => void;
}

export default function Sidebar({ activePage, onPageChange, currentWorkspace, onCreateNew }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };

    if (isCreateMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateMenuOpen]);

  const handleCreateClick = (type: 'contact' | 'company' | 'product' | 'quote' | 'invoice') => {
    setIsCreateMenuOpen(false);
    onCreateNew?.(type);
  };

  const createOptions = [
    { type: 'contact' as const, label: 'Contact', icon: 'solar:user-plus-rounded-linear', color: 'text-blue-600' },
    { type: 'company' as const, label: 'Company', icon: 'solar:buildings-2-linear', color: 'text-emerald-600' },
    { type: 'product' as const, label: 'Product', icon: 'solar:box-linear', color: 'text-amber-600' },
    { type: 'quote' as const, label: 'Quote', icon: 'solar:file-text-linear', color: 'text-rose-600' },
    { type: 'invoice' as const, label: 'Invoice', icon: 'solar:bill-list-linear', color: 'text-slate-600' },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col z-40 shadow-slate-200/40 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group/sidebar bg-white/60 border-white/50 border rounded-[24px] relative shadow-2xl backdrop-blur-lg overflow-visible ${
        collapsed ? 'w-[88px]' : 'w-72'
      }`}
    >
      <div className="flex items-center justify-between pt-6 pr-5 pb-2 pl-6 transition-all duration-300 relative">
        <div className="flex items-center gap-3 transition-all duration-300">
          <div className="relative shrink-0">
            <img
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5e3c965b-bdab-4f66-8ba7-0e6b2303234c_320w.png"
              alt="Superproxy"
              className="w-8 h-8 object-contain transition-all duration-300"
            />
          </div>
          <div className={`flex items-center gap-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${
            collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
          }`}>
            <span className="text-lg font-semibold text-slate-900 tracking-tight font-display">
              Superproxy
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/80 shadow-sm">
              <Icon icon="solar:crown-bold" width="10" className="text-slate-700" />
              <span className="text-[10px] font-bold text-slate-800 tracking-wide uppercase">
                Pro
              </span>
            </span>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100/50 transition-all focus:outline-none group-hover/sidebar:opacity-100 duration-200 ${
            collapsed
              ? 'opacity-0 rotate-180 group-hover/sidebar:translate-x-0 absolute right-0 translate-x-full group-hover/sidebar:opacity-100'
              : 'opacity-0 translate-x-2 group-hover/sidebar:translate-x-0'
          }`}
          aria-label="Toggle sidebar"
        >
          <Icon icon="solar:sidebar-minimalistic-linear" width="20" />
        </button>
      </div>

      <nav
        className={`flex-1 pt-4 pb-4 ${
          collapsed ? 'px-3' : 'px-3'
        }`}
      >
        <div className="space-y-1.5">
        <button
          onClick={() => onPageChange('home')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'home'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'home' ? 'solar:widget-bold' : 'solar:widget-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'home' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 text-sm font-medium ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Home
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Home
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('contacts')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'contacts'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'contacts' ? 'solar:users-group-two-rounded-bold' : 'solar:users-group-two-rounded-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'contacts'
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Contact
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Contact
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('companies')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'companies'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'companies' ? 'solar:buildings-2-bold' : 'solar:buildings-2-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'companies'
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Company
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Company
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('products')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'products'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'products' ? 'solar:box-bold' : 'solar:box-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'products'
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Products
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Products
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('quotations')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'quotations'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'quotations' ? 'solar:file-text-bold' : 'solar:file-text-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'quotations'
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Quotation
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Quotation
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('invoices')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'invoices'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'invoices' ? 'solar:bill-list-bold' : 'solar:bill-list-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'invoices'
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Invoicing
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Invoicing
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('presentations')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'presentations'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <Icon
            icon={activePage === 'presentations' ? 'solar:videocamera-record-bold' : 'solar:videocamera-record-linear'}
            width="20"
            className={`shrink-0 transition-colors ${
              activePage === 'presentations'
                ? 'text-blue-600'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            Presentations
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Presentations
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>
        </div>
      </nav>

      {/* Collapsed Trial Badge - Shows outside sidebar */}
      <div className={`px-3 transition-all duration-300 overflow-visible ${
        collapsed ? 'opacity-100 max-h-[80px] pb-2' : 'opacity-0 max-h-0 pb-0'
      }`}>
        <div className="group/badge relative flex items-center justify-center rounded-2xl bg-white border border-indigo-100 ring-1 ring-slate-100 p-3 shadow-sm hover:bg-indigo-50/50 hover:border-indigo-200 hover:shadow-md transition-all duration-300 cursor-pointer">
          <div className="relative flex items-center justify-center">
            <Icon icon="solar:star-linear" width="18" className="text-indigo-600" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>

          {/* Tooltip badge showing outside */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover/badge:opacity-100 group-hover/badge:scale-100 group-hover/badge:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap pointer-events-none min-w-[180px] z-[35]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-400"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Free Trial</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium mb-1">14 days remaining</p>
            <p className="text-[10px] text-slate-400">Upgrade for full access</p>
            <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[6px] border-transparent border-r-slate-800 mr-[-1px]"></span>
          </div>
        </div>
      </div>

      {/* Expanded Trial Badge */}
      <div className={`px-5 transition-all duration-300 overflow-hidden ${
        collapsed
          ? 'opacity-0 max-h-0 pb-0'
          : 'opacity-100 max-h-[200px] pb-2'
      }`}>
        <div className="overflow-hidden bg-white border-indigo-100 border ring-slate-100 ring-1 rounded-2xl pt-4 pr-4 pb-4 pl-4 relative shadow-sm">
          {/* Overlay with upgrade prompt */}
          <div className="z-20 flex flex-col transition-all bg-white/95 pt-4 pr-4 pb-4 pl-4 absolute top-0 right-0 bottom-0 left-0 backdrop-blur-sm justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
                    Free Trial
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  14 days left
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                Upgrade your workspace for unlimited access.
              </p>
            </div>
            <button className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:shadow-md active:scale-[0.98]">
              <span>Upgrade Plan</span>
              <Icon icon="solar:arrow-right-linear" width="12" className="opacity-40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </button>
          </div>

          {/* Background content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-sm tracking-wide uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-400"></span>
                </span>
                Free Trial
              </span>
              <span className="text-[10px] font-semibold text-indigo-600">
                14 days left
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-900 mb-1">
                Upgrade your workspace
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Unlock unlimited quotes and team seats today.
              </p>
            </div>

            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-[0.98] ring-1 ring-inset ring-indigo-500/20">
              Subscribe Now
              <Icon icon="solar:arrow-right-linear" width="12" className="opacity-70 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-300 pt-2 pb-4 ${collapsed ? 'px-3' : 'px-5'}`} ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className={`relative group flex items-center justify-center shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:shadow-slate-900/30 active:scale-[0.98] text-white bg-slate-900 w-full ring-slate-900 ring-1 rounded-2xl shadow-lg ${collapsed ? 'p-3' : 'gap-3 py-3.5 px-4'}`}
          >
            <Icon icon="solar:add-circle-linear" width="20" className="text-slate-200 group-hover:text-white transition-colors" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 text-sm font-semibold tracking-tight ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Create New
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Create New
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* Dropdown Menu - Always positioned to the right */}
          {isCreateMenuOpen && (
            <div className="absolute left-full ml-3 bottom-full mb-2 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200/80 backdrop-blur-xl z-[50] overflow-hidden transition-all duration-300 ease-out origin-bottom-left animate-in fade-in slide-in-from-bottom-2">
              <div className="p-2 min-w-[200px]">
                {createOptions.map((option, index) => (
                  <button
                    key={option.type}
                    onClick={() => handleCreateClick(option.type)}
                    className="w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-slate-50 text-left"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-white transition-all duration-200 ${option.color}`}>
                      <Icon icon={option.icon} width="18" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`h-px w-auto bg-slate-100 transition-all duration-300 ${collapsed ? 'mx-3' : 'mx-6'}`}></div>

      <div className={`transition-all duration-300 py-3 ${collapsed ? 'px-2' : 'px-3'}`}>
        <button
          onClick={() => onPageChange('workspace')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'workspace'
              ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <div className={`h-5 w-5 rounded-lg overflow-hidden flex items-center justify-center shrink-0 transition-colors ${
            activePage === 'workspace'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-300 text-slate-600 group-hover:bg-slate-400'
          }`}>
            {currentWorkspace?.logo_url ? (
              <img
                src={currentWorkspace.logo_url}
                alt={currentWorkspace.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const initial = currentWorkspace.name.charAt(0);
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold">${initial}</span>`;
                }}
              />
            ) : (
              <span className="text-xs font-bold">
                {currentWorkspace?.name.charAt(0) || 'W'}
              </span>
            )}
          </div>
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            {currentWorkspace?.name || 'Workspace'}
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              {currentWorkspace?.name || 'Workspace'}
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('account')}
          className={`relative w-full flex items-center p-2.5 mt-0.5 rounded-2xl hover:bg-slate-50/80 cursor-pointer transition-colors duration-200 group ${
            activePage === 'account' ? 'bg-slate-100/80' : ''
          } ${collapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
              alt="Melwyn Arrubio"
              className="h-8 w-8 rounded-full object-cover border border-white ring-1 ring-slate-100 transition-all duration-200"
            />
            <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></div>
          </div>
          <div className={`flex-1 min-w-0 text-left whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
            <p className="truncate group-hover:text-slate-900 transition-colors text-sm font-medium text-slate-900">
              Richard Mell
            </p>
            <p className="text-xs text-slate-400 truncate group-hover:text-slate-500">richardmell@gmail.com</p>
          </div>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Richard Mille
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
