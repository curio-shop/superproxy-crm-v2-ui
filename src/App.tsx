import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SimpleHeader from './components/SimpleHeader';
import StatsCard from './components/StatsCard';
import ChartCard from './components/ChartCard';
import TeamActivity from './components/TeamActivity';
import Contacts, { ContactDetail } from './components/Contacts';
import Companies, { Company } from './components/Companies';
import Products, { Product } from './components/Products';
import Quotations from './components/Quotations';
import Invoices from './components/Invoices';
import Presentations from './components/Presentations';
import Workspace, { Workspace as WorkspaceType } from './components/Workspace';
import AccountProfile from './components/AccountProfile';
import CallHistory, { CallHistoryRecord } from './components/CallHistory';
import CallDetailsDrawer from './components/CallDetailsDrawer';
import AddContactDrawer from './components/AddContactDrawer';
import AddCompanyDrawer from './components/AddCompanyDrawer';
import AddProductDrawer from './components/AddProductDrawer';
import ViewContactDrawer from './components/ViewContactDrawer';
import ViewCompanyDrawer from './components/ViewCompanyDrawer';
import ViewProductDrawer from './components/ViewProductDrawer';
import CreateQuote from './components/CreateQuote';
import CreateInvoice from './components/CreateInvoice';
import QuoteView from './components/QuoteView';
import ErrorBoundary from './components/ErrorBoundary';
import NewEmail from './components/NewEmail';
import EmailHistoryDrawer from './components/EmailHistoryDrawer';
import Celebration from './components/Celebration';
import Dropdown from './components/Dropdown';
import TreasureBurst from './components/TreasureBurst';
import PaperFly from './components/PaperFly';
import ColdCallModal from './components/ColdCallModal';
import PaymentReminderModal from './components/PaymentReminderModal';
import QuoteFollowUpModal from './components/QuoteFollowUpModal';
import MinimizedCallsBar from './components/MinimizedCallsBar';
import TemplateBuilder from './components/TemplateBuilder';
import AIChat from './components/AIChat';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import FloatingChatButton from './components/FloatingChatButton';
import SupportChatDialog from './components/SupportChatDialog';
import Notifications from './components/Notifications';
import { CallManagerProvider, Contact, Invoice, Quotation, useCallManager } from './contexts/CallManagerContext';
import { ToastProvider, useToast } from './components/ToastContainer';
import { supabase } from './lib/supabase';

function AppContent() {
  const { focusedCallId, getFocusedCall } = useCallManager();
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState('home');
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isCompanyDrawerOpen, setIsCompanyDrawerOpen] = useState(false);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isViewingQuote, setIsViewingQuote] = useState(false);
  const [isColdCallModalOpen, setIsColdCallModalOpen] = useState(false);
  const [isPaymentReminderModalOpen, setIsPaymentReminderModalOpen] = useState(false);
  const [isQuoteFollowUpModalOpen, setIsQuoteFollowUpModalOpen] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [selectedEmailContact, setSelectedEmailContact] = useState<{ name: string; email?: string } | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallHistoryRecord | null>(null);
  const [preSelectedQuote, setPreSelectedQuote] = useState<Quotation | null>(null);
  const [preSelectedInvoice, setPreSelectedInvoice] = useState<Invoice | null>(null);
  const [emailOriginPage, setEmailOriginPage] = useState<'contacts' | 'quotations' | 'invoices'>('contacts');
  const [preSelectedQuoteForInvoice, setPreSelectedQuoteForInvoice] = useState<Quotation | null>(null);
  const [selectedQuoteForAI, setSelectedQuoteForAI] = useState<Quotation | null>(null);
  const [selectedInvoiceForAI, setSelectedInvoiceForAI] = useState<Invoice | null>(null);
  const [aiChatOriginPage, setAiChatOriginPage] = useState<'quotations' | 'invoices'>('quotations');
  const [isViewContactDrawerOpen, setIsViewContactDrawerOpen] = useState(false);
  const [isViewCompanyDrawerOpen, setIsViewCompanyDrawerOpen] = useState(false);
  const [isViewProductDrawerOpen, setIsViewProductDrawerOpen] = useState(false);
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [templateBuilderType, setTemplateBuilderType] = useState<'quotation' | 'invoice'>('quotation');
  const [selectedViewContact, setSelectedViewContact] = useState<ContactDetail | null>(null);
  const [selectedViewCompany, setSelectedViewCompany] = useState<Company | null>(null);
  const [selectedViewProduct, setSelectedViewProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalEntity, setDeleteModalEntity] = useState<{ type: 'contact' | 'company' | 'product' | 'quotation' | 'invoice' | 'presentation'; id: string; name: string } | null>(null);
  const [isDeletingEntity, setIsDeletingEntity] = useState(false);

  // Chat state management
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(3);
  const [currentUser] = useState<{ id: string; name: string }>({
    id: 'mock-user-id',
    name: 'Melwyn Arrubio'
  });
  const [activeAccountTab, setActiveAccountTab] = useState<'profile' | 'preferences' | 'security' | 'billing' | 'workspaces' | 'voice' | 'contact'>('profile');

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isAccountDeleting, setIsAccountDeleting] = useState(false);
  const [deleteAccountConfirmText, setDeleteAccountConfirmText] = useState('');

  // Voice recording modals
  const [showRecordingConfirmModal, setShowRecordingConfirmModal] = useState(false);
  const [showVoiceConfigModal, setShowVoiceConfigModal] = useState(false);
  const [showVoiceDeleteConfirmModal, setShowVoiceDeleteConfirmModal] = useState(false);
  const [showVoiceSuccessModal, setShowVoiceSuccessModal] = useState(false);
  const [showDeleteCustomVoiceModal, setShowDeleteCustomVoiceModal] = useState(false);
  const [showPreviewVoiceModal, setShowPreviewVoiceModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [voiceRecordingTime, setVoiceRecordingTime] = useState(0);
  const [voiceToDelete, setVoiceToDelete] = useState<string | null>(null);
  const [voiceToPreview, setVoiceToPreview] = useState<{ name: string; accent: string; gender: string; age: string } | null>(null);
  const [voiceConfig, setVoiceConfig] = useState({
    name: '',
    description: '',
    accent: '',
    gender: '',
    age: '',
  });
  const [deleteVoiceCallback, setDeleteVoiceCallback] = useState<(() => void) | null>(null);

  const [isCallDetailsDrawerOpen, setIsCallDetailsDrawerOpen] = useState(false);
  const [isEmailHistoryDrawerOpen, setIsEmailHistoryDrawerOpen] = useState(false);
  const [workspaceHandlers, setWorkspaceHandlers] = useState<{
    onCreateWorkspace?: () => void;
    onJoinWorkspace?: () => void;
  }>({});
  const [celebrationTrigger, setCelebrationTrigger] = useState(0);
  const [celebrationPosition, setCelebrationPosition] = useState({ x: 0, y: 0 });
  const [shimmerBurstTrigger, setShimmerBurstTrigger] = useState(0);
  const [shimmerBurstPosition, setShimmerBurstPosition] = useState({ x: 0, y: 0 });
  const [paperFlyTrigger, setPaperFlyTrigger] = useState(0);
  const [paperFlyPosition, setPaperFlyPosition] = useState({ x: 0, y: 0 });
  const [isTeamView, setIsTeamView] = useState(false);
  const homeFilterPreference = isTeamView ? 'team' : 'personal';

  const handleDealWonClick = useCallback((x: number, y: number) => {
    setCelebrationPosition({ x, y });
    setCelebrationTrigger(prev => prev + 1);
  }, []);

  const handlePaymentsClick = useCallback((x: number, y: number) => {
    setShimmerBurstPosition({ x, y });
    setShimmerBurstTrigger(prev => prev + 1);
  }, []);

  const handleQuotationsClick = useCallback((x: number, y: number) => {
    setPaperFlyPosition({ x, y });
    setPaperFlyTrigger(prev => prev + 1);
  }, []);

  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType | null>(null);

  useEffect(() => {
    if (focusedCallId) {
      const focusedCall = getFocusedCall();
      if (focusedCall && !focusedCall.isMinimized) {
        setSelectedContact(focusedCall.contact);

        if (focusedCall.callType === 'paymentReminder') {
          setSelectedInvoice(focusedCall.invoiceData || null);
          setIsPaymentReminderModalOpen(true);
          setIsColdCallModalOpen(false);
          setIsQuoteFollowUpModalOpen(false);
        } else if (focusedCall.callType === 'quoteFollowUp') {
          setSelectedQuotation(focusedCall.quotationData || null);
          setIsQuoteFollowUpModalOpen(true);
          setIsColdCallModalOpen(false);
          setIsPaymentReminderModalOpen(false);
        } else {
          setIsColdCallModalOpen(true);
          setIsPaymentReminderModalOpen(false);
          setIsQuoteFollowUpModalOpen(false);
        }
      }
    }
  }, [focusedCallId, getFocusedCall]);

  // Load unread count when Contact Us tab is active
  useEffect(() => {
    if (activePage !== 'account' || activeAccountTab !== 'contact' || !currentUser?.id) return;

    const loadUnreadCount = async () => {
      const { data } = await supabase
        .from('support_conversations')
        .select('unread_count')
        .eq('user_id', currentUser.id)
        .eq('status', 'open')
        .maybeSingle();

      if (data) {
        setChatUnreadCount(data.unread_count || 0);
      }
    };

    loadUnreadCount();

    const channel = supabase
      .channel(`support_unread:${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_conversations',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'unread_count' in payload.new) {
            setChatUnreadCount((payload.new as any).unread_count || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activePage, activeAccountTab, currentUser?.id]);

  // Don't render special views with early returns - handle them in the main render
  // This prevents React hooks errors

  const handleCreateNew = useCallback((type: 'contact' | 'company' | 'product' | 'quote' | 'invoice') => {
    switch (type) {
      case 'contact':
        setIsContactDrawerOpen(true);
        break;
      case 'company':
        setIsCompanyDrawerOpen(true);
        break;
      case 'product':
        setIsProductDrawerOpen(true);
        break;
      case 'quote':
        setIsCreatingQuote(true);
        break;
      case 'invoice':
        setIsCreatingInvoice(true);
        break;
    }
  }, []);

  const handleViewCall = useCallback((call: CallHistoryRecord) => {
    setSelectedCall(call);
    setIsCallDetailsDrawerOpen(true);
  }, []);

  const handleOpenDeleteModal = (type: 'contact' | 'company' | 'product' | 'quotation' | 'invoice' | 'presentation', id: string, name: string) => {
    setDeleteModalEntity({ type, id, name });
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    if (!isDeletingEntity) {
      setIsDeleteModalOpen(false);
      setDeleteModalEntity(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalEntity) return;

    setIsDeletingEntity(true);

    try {
      const { type, id, name } = deleteModalEntity;

      let error = null;

      switch (type) {
        case 'contact':
          const { error: contactError } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);
          error = contactError;
          break;

        case 'company':
          const { error: companyError } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);
          error = companyError;
          break;

        case 'product':
          const { error: productError } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
          error = productError;
          break;

        case 'quotation':
          console.log('Delete quotation:', id);
          break;

        case 'invoice':
          console.log('Delete invoice:', id);
          break;

        case 'presentation':
          console.log('Delete presentation:', id);
          break;
      }

      if (error) {
        throw error;
      }

      setIsDeleteModalOpen(false);
      setDeleteModalEntity(null);

      const entityLabel = type.charAt(0).toUpperCase() + type.slice(1);
      showToast(`${entityLabel} removed successfully`, 'success');

      window.location.reload();
    } catch (error) {
      console.error('Error deleting entity:', error);
      showToast('Failed to delete. Please try again.', 'error');
    } finally {
      setIsDeletingEntity(false);
    }
  };

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleCloseDeleteAccountModal = () => {
    if (!isAccountDeleting) {
      setIsDeleteAccountModalOpen(false);
      setDeleteAccountConfirmText('');
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setIsAccountDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAccountDeleting(false);
    setIsDeleteAccountModalOpen(false);
    setDeleteAccountConfirmText('');
    showToast('Account deletion requested. You will receive a confirmation email.', 'info');
  };

  // ============================================
  // ALL HOOKS MUST BE ABOVE THIS LINE
  // React requires hooks to be called in the same order every render
  // ============================================

  // Render special full-screen views
  if (isViewingQuote) {
    console.log('📄 App: Rendering QuoteView');
    return (
      <div className="h-screen w-screen">
        <ErrorBoundary>
          <QuoteView onBackToQuotes={() => {
            console.log('📄 QuoteView: Back button clicked');
            setIsViewingQuote(false);
            setActivePage('quotations');
          }} />
        </ErrorBoundary>
      </div>
    );
  }

  if (isCreatingQuote) {
    console.log('📝 App: Rendering CreateQuote');
    return (
      <div className="h-screen w-screen">
        <ErrorBoundary>
          <CreateQuote
            onBack={() => {
              console.log('📝 CreateQuote: Back button clicked');
              setIsCreatingQuote(false);
            }}
            onPublish={() => {
              console.log('📝 CreateQuote: Publish button clicked');
              setIsCreatingQuote(false);
              setIsViewingQuote(true);
            }}
          />
        </ErrorBoundary>
      </div>
    );
  }

  if (isCreatingInvoice) {
    console.log('💰 App: Rendering CreateInvoice', { preSelectedQuote: preSelectedQuoteForInvoice });
    return (
      <div className="h-screen w-screen">
        <ErrorBoundary>
          <CreateInvoice
            onBack={() => {
              console.log('💰 CreateInvoice: Back button clicked');
              setIsCreatingInvoice(false);
              setPreSelectedQuoteForInvoice(null);
            }}
            onPublish={() => {
              console.log('💰 CreateInvoice: Publish button clicked');
              setIsCreatingInvoice(false);
              setPreSelectedQuoteForInvoice(null);
              setActivePage('invoices');
            }}
            preSelectedQuote={preSelectedQuoteForInvoice}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="h-screen text-slate-600 antialiased selection:bg-sky-200 selection:text-slate-900 overflow-hidden">
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#f8fafc]">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/60 blur-[100px] mix-blend-multiply"></div>
          <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sky-100/60 blur-[100px] mix-blend-multiply"></div>
          <div className="absolute -bottom-20 left-[20%] w-[40%] h-[40%] rounded-full bg-pink-100/60 blur-[100px] mix-blend-multiply"></div>
        </div>
        <div className="flex gap-3 h-screen pt-3 pr-3 pb-3 pl-3 gap-x-3 gap-y-3">
          <Sidebar activePage={activePage} onPageChange={setActivePage} currentWorkspace={currentWorkspace} onCreateNew={handleCreateNew} />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden relative z-30" style={{ scrollbarGutter: 'stable' }}>
          {activePage === 'account' ? (
            <SimpleHeader
              title="Account Settings"
              subtitle="Manage your profile, security, and preferences."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'invoices' ? (
            <SimpleHeader
              title="Invoices"
              subtitle="Track payments, manage billing, and monitor invoice status."
              showCreateButton={true}
              onOpenDrawer={() => setIsCreatingInvoice(true)}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'call-history' ? (
            <SimpleHeader
              title="Call History"
              subtitle="Review past calls, transcripts, and insights."
              onBack={() => setActivePage('contacts')}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'presentations' ? (
            <SimpleHeader
              title="Presentations"
              subtitle="Record and share video presentations for your quotes and invoices."
              customButton={{
                label: 'Record New',
                icon: 'solar:videocamera-record-bold',
                onClick: () => setShowRecordModal(true)
              }}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'notifications' ? (
            <SimpleHeader
              title="Notifications"
              subtitle="Stay updated with your team's activities and important alerts."
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          ) : activePage === 'new-email' ? null : activePage === 'ai-chat' ? null : (
            <Header
              activePage={activePage}
              onOpenDrawer={() => {
                if (activePage === 'contacts') {
                  setIsContactDrawerOpen(true);
                } else if (activePage === 'companies') {
                  setIsCompanyDrawerOpen(true);
                } else if (activePage === 'products') {
                  setIsProductDrawerOpen(true);
                } else if (activePage === 'quotations') {
                  setIsCreatingQuote(true);
                }
              }}
              onCreateWorkspace={workspaceHandlers.onCreateWorkspace}
              onJoinWorkspace={workspaceHandlers.onJoinWorkspace}
              isTeamView={isTeamView}
              onToggleView={setIsTeamView}
              onNavigateToNotifications={() => setActivePage('notifications')}
            />
          )}

          {activePage === 'home' ? (
            <div className="flex-1 overflow-y-auto md:p-8 custom-scrollbar pt-6 pr-6 pb-6 pl-6 space-y-8" style={{ scrollbarGutter: 'stable' }}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatsCard
                    title="Total Quotations"
                    value="$3,810,710"
                    subtitle={
                      <>
                        <span className="text-slate-900 font-semibold">24 quotes</span> sent this month
                      </>
                    }
                    icon="solar:document-text-linear"
                    iconColor="text-slate-400 group-hover:text-blue-500"
                    titleColor="text-blue-600"
                  />
                  <StatsCard
                    title="Deals Won"
                    value="12"
                    subtitle={
                      <>
                        Total amount: <span className="text-slate-900 font-semibold">$2,100,450</span>
                      </>
                    }
                    icon="solar:cup-star-linear"
                    iconColor="text-slate-400 group-hover:text-rose-500"
                    titleColor="text-rose-600"
                    onIconClick={handleDealWonClick}
                  />
                  <StatsCard
                    title="Total Revenue"
                    value="$3,415,820"
                    subtitle={
                      <>
                        <span className="text-slate-900 font-semibold">6 unpaid invoices</span>
                      </>
                    }
                    icon="solar:wallet-money-linear"
                    iconColor="text-slate-400 group-hover:text-amber-500"
                    titleColor="text-amber-600"
                  />
                  <StatsCard
                    title="Total Payments"
                    value="$1,728,950"
                    subtitle={
                      <>
                        <span className="text-slate-900 font-semibold">12 invoices</span> collected
                      </>
                    }
                    icon="solar:cash-out-linear"
                    iconColor="text-slate-400 group-hover:text-emerald-500"
                    titleColor="text-emerald-600"
                    onIconClick={handlePaymentsClick}
                    iconAnimation="shine"
                  />
                </div>

                <ChartCard />
              </div>

              <div className="col-span-12 xl:col-span-4">
                <TeamActivity
                  onViewFullActivity={() => {
                    setActivePage('workspace');
                    // Use requestAnimationFrame for instant, smooth scroll after render
                    requestAnimationFrame(() => {
                      document.getElementById('workspace-activity')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                  }}
                />
              </div>
            </div>
            </div>
          ) : activePage === 'contacts' ? (
            <Contacts
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onColdCallClick={(contact) => {
                setSelectedContact(contact);
                setIsColdCallModalOpen(true);
              }}
              onViewHistory={() => setActivePage('call-history')}
              onSendEmail={(contact) => {
                setSelectedEmailContact({ name: contact.name, email: contact.email });
                setEmailOriginPage('contacts');
                setActivePage('new-email');
              }}
              onViewContact={(contact) => {
                setSelectedViewContact(contact);
                setIsViewContactDrawerOpen(true);
              }}
              onDeleteContact={(contact) => {
                handleOpenDeleteModal('contact', contact.id, contact.name);
              }}
            />
          ) : activePage === 'new-email' && selectedEmailContact ? (
            <NewEmail
              onBack={() => {
                setActivePage(emailOriginPage);
                setSelectedEmailContact(null);
                setPreSelectedQuote(null);
                setPreSelectedInvoice(null);
              }}
              contactName={selectedEmailContact.name}
              contactEmail={selectedEmailContact.email}
              preSelectedQuote={preSelectedQuote}
              preSelectedInvoice={preSelectedInvoice}
              onOpenEmailHistory={() => {
                setIsEmailHistoryDrawerOpen(true);
              }}
            />
          ) : activePage === 'companies' ? (
            <Companies
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onViewCompany={(company) => {
                setSelectedViewCompany(company);
                setIsViewCompanyDrawerOpen(true);
              }}
              onDeleteCompany={(company) => {
                handleOpenDeleteModal('company', company.id, company.name);
              }}
            />
          ) : activePage === 'products' ? (
            <Products
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onViewProduct={(product) => {
                setSelectedViewProduct(product);
                setIsViewProductDrawerOpen(true);
              }}
              onDeleteProduct={(product) => {
                handleOpenDeleteModal('product', product.id, product.name);
              }}
            />
          ) : activePage === 'quotations' ? (
            <Quotations
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onViewQuote={() => {
                setIsViewingQuote(true);
              }}
              onQuoteFollowUpClick={(quotation, contact) => {
                setSelectedQuotation(quotation);
                setSelectedContact(contact);
                setIsQuoteFollowUpModalOpen(true);
              }}
              onEmailQuoteClick={(quotation) => {
                setPreSelectedQuote(quotation);
                setPreSelectedInvoice(null);
                setSelectedEmailContact({ name: quotation.client.name, email: undefined });
                setEmailOriginPage('quotations');
                setActivePage('new-email');
              }}
              onCreateInvoiceClick={(quotation) => {
                setPreSelectedQuoteForInvoice(quotation);
                setIsCreatingInvoice(true);
              }}
              onAskAIClick={(quotation) => {
                setSelectedQuoteForAI(quotation);
                setSelectedInvoiceForAI(null);
                setAiChatOriginPage('quotations');
                setActivePage('ai-chat');
              }}
              onOpenTemplateBuilder={() => {
                setTemplateBuilderType('quotation');
                setIsTemplateBuilderOpen(true);
              }}
              onDeleteQuotation={(quotation) => {
                handleOpenDeleteModal('quotation', quotation.id, quotation.number);
              }}
            />
          ) : activePage === 'invoices' ? (
            <Invoices
              isTeamView={isTeamView}
              homeFilterPreference={homeFilterPreference}
              onPaymentReminderClick={(invoice, contact) => {
                setSelectedInvoice(invoice);
                setSelectedContact(contact);
                setIsPaymentReminderModalOpen(true);
              }}
              onEmailInvoiceClick={(invoice) => {
                setPreSelectedInvoice(invoice);
                setPreSelectedQuote(null);
                setSelectedEmailContact({ name: invoice.client.name, email: undefined });
                setEmailOriginPage('invoices');
                setActivePage('new-email');
              }}
              onAskAIClick={(invoice) => {
                setSelectedInvoiceForAI(invoice);
                setSelectedQuoteForAI(null);
                setAiChatOriginPage('invoices');
                setActivePage('ai-chat');
              }}
              onOpenTemplateBuilder={() => {
                setTemplateBuilderType('invoice');
                setIsTemplateBuilderOpen(true);
              }}
              onDeleteInvoice={(invoice) => {
                handleOpenDeleteModal('invoice', invoice.id, invoice.number);
              }}
            />
          ) : activePage === 'presentations' ? (
            <Presentations
              showRecordModal={showRecordModal}
              onCloseRecordModal={() => setShowRecordModal(false)}
              onDeletePresentation={(presentation) => {
                handleOpenDeleteModal('presentation', presentation.id, presentation.title);
              }}
            />
          ) : activePage === 'notifications' ? (
            <Notifications />
          ) : activePage === 'workspace' ? (
            <Workspace onRegisterHandlers={setWorkspaceHandlers} onWorkspaceChange={setCurrentWorkspace} />
          ) : activePage === 'account' ? (
            <AccountProfile
              activeTab={activeAccountTab}
              onTabChange={setActiveAccountTab}
              onChatOpen={() => setIsSupportChatOpen(true)}
              chatUnreadCount={chatUnreadCount}
              onDeleteAccountClick={handleOpenDeleteAccountModal}
              onRecordingComplete={(recordingTime) => {
                setVoiceRecordingTime(recordingTime);
                setShowRecordingConfirmModal(true);
              }}
              onDeleteCustomVoice={(voiceId, callback) => {
                setVoiceToDelete(voiceId);
                setDeleteVoiceCallback(() => callback);
                setShowDeleteCustomVoiceModal(true);
              }}
              onPreviewVoice={(voice) => {
                setVoiceToPreview(voice);
                setShowPreviewVoiceModal(true);
              }}
            />
          ) : activePage === 'call-history' ? (
            <CallHistory onBack={() => setActivePage('contacts')} onViewCall={handleViewCall} />
          ) : activePage === 'ai-chat' ? (
            <AIChat
              onBack={() => {
                setActivePage(aiChatOriginPage);
                setSelectedQuoteForAI(null);
                setSelectedInvoiceForAI(null);
              }}
              quotation={selectedQuoteForAI}
              invoice={selectedInvoiceForAI}
              originPage={aiChatOriginPage}
            />
          ) : null}
        </main>
      </div>

      <AddContactDrawer isOpen={isContactDrawerOpen} onClose={() => setIsContactDrawerOpen(false)} />
      <AddCompanyDrawer isOpen={isCompanyDrawerOpen} onClose={() => setIsCompanyDrawerOpen(false)} />
      <AddProductDrawer isOpen={isProductDrawerOpen} onClose={() => setIsProductDrawerOpen(false)} />
      <ViewContactDrawer
        isOpen={isViewContactDrawerOpen}
        onClose={() => {
          setIsViewContactDrawerOpen(false);
          setSelectedViewContact(null);
        }}
        contact={selectedViewContact}
      />
      <ViewCompanyDrawer
        isOpen={isViewCompanyDrawerOpen}
        onClose={() => {
          setIsViewCompanyDrawerOpen(false);
          setSelectedViewCompany(null);
        }}
        company={selectedViewCompany}
      />
      <ViewProductDrawer
        isOpen={isViewProductDrawerOpen}
        onClose={() => {
          setIsViewProductDrawerOpen(false);
          setSelectedViewProduct(null);
        }}
        product={selectedViewProduct}
      />
      <EmailHistoryDrawer
        isOpen={isEmailHistoryDrawerOpen}
        onClose={() => setIsEmailHistoryDrawerOpen(false)}
        onComposeEmail={(recipient) => {
          setSelectedEmailContact({ name: recipient.name, email: recipient.email });
          setActivePage('new-email');
        }}
        contactEmail={selectedEmailContact?.email}
        contactName={selectedEmailContact?.name}
      />
      {isTemplateBuilderOpen && (
        <TemplateBuilder
          onClose={() => setIsTemplateBuilderOpen(false)}
          templateType={templateBuilderType}
        />
      )}
      <CallDetailsDrawer
        isOpen={isCallDetailsDrawerOpen}
        onClose={() => {
          setIsCallDetailsDrawerOpen(false);
          setSelectedCall(null);
        }}
        call={selectedCall}
      />
      <ColdCallModal
        isOpen={isColdCallModalOpen}
        onClose={() => {
          setIsColdCallModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onNavigateToHistory={() => setActivePage('call-history')}
      />
      <PaymentReminderModal
        isOpen={isPaymentReminderModalOpen}
        onClose={() => {
          setIsPaymentReminderModalOpen(false);
          setSelectedContact(null);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        contact={selectedContact}
        onNavigateToHistory={() => setActivePage('call-history')}
      />
      <QuoteFollowUpModal
        isOpen={isQuoteFollowUpModalOpen}
        onClose={() => {
          setIsQuoteFollowUpModalOpen(false);
          setSelectedContact(null);
          setSelectedQuotation(null);
        }}
        quotation={selectedQuotation}
        contact={selectedContact}
        onNavigateToHistory={() => setActivePage('call-history')}
      />
      <Celebration trigger={celebrationTrigger} originX={celebrationPosition.x} originY={celebrationPosition.y} />
      <TreasureBurst trigger={shimmerBurstTrigger} originX={shimmerBurstPosition.x} originY={shimmerBurstPosition.y} />
      <PaperFly trigger={paperFlyTrigger} originX={paperFlyPosition.x} originY={paperFlyPosition.y} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        entityType={deleteModalEntity?.type || 'contact'}
        entityName={deleteModalEntity?.name}
        isDeleting={isDeletingEntity}
      />
      <MinimizedCallsBar />
      <FloatingChatButton
        unreadCount={chatUnreadCount}
        onClick={() => setIsSupportChatOpen(!isSupportChatOpen)}
        isOpen={isSupportChatOpen}
        isVisible={activePage === 'account' && activeAccountTab === 'contact'}
      />
      {activePage === 'account' && activeAccountTab === 'contact' && (
        <SupportChatDialog
          isOpen={isSupportChatOpen}
          onClose={() => setIsSupportChatOpen(false)}
          userId={currentUser.id}
          userName={currentUser.name}
        />
      )}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={handleCloseDeleteAccountModal}
        onConfirm={handleConfirmDeleteAccount}
        deleteConfirmText={deleteAccountConfirmText}
        onDeleteConfirmTextChange={setDeleteAccountConfirmText}
        isDeleting={isAccountDeleting}
      />

      {/* Voice Recording Confirmation Modal */}
      {showRecordingConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 mx-auto mb-4">
                <Icon icon="solar:check-circle-bold" width="32" className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Recording Complete!</h3>
              <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                Your voice has been recorded successfully. Would you like to save and configure this voice?
              </p>
              
              {/* Audio Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-900 flex items-center justify-center transition-all">
                    <Icon icon="solar:play-bold" width="16" className="text-white ml-0.5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 h-8">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-slate-300 rounded-full"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {voiceRecordingTime}s
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRecordingConfirmModal(false);
                    setVoiceRecordingTime(0);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    setShowRecordingConfirmModal(false);
                    setShowVoiceConfigModal(true);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Configuration Modal */}
      {showVoiceConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Customize Your Superproxy's Voice</h3>
                <p className="text-sm text-slate-500 mt-1">Give your custom voice a unique identity</p>
              </div>
              <button
                onClick={() => setShowVoiceDeleteConfirmModal(true)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all flex-shrink-0 ml-4"
              >
                <Icon icon="solar:close-circle-linear" width="24" className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
              {/* Audio Preview Section */}
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Record Voice</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-900 flex items-center justify-center transition-all">
                      <Icon icon="solar:play-bold" width="16" className="text-white ml-0.5" />
                    </button>
                    <div className="flex-1">
                      <div className="relative h-2 bg-slate-300 rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-slate-700 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-500">0:00</span>
                        <span className="text-xs text-slate-500">0:{String(voiceRecordingTime).padStart(2, '0')}</span>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-all">
                      <Icon icon="solar:volume-loud-linear" width="18" className="text-slate-600" />
                    </button>
                    <button 
                      onClick={() => {
                        const speeds = [1, 1.25, 1.5, 2];
                        const currentIndex = speeds.indexOf(playbackSpeed);
                        const nextIndex = (currentIndex + 1) % speeds.length;
                        setPlaybackSpeed(speeds[nextIndex]);
                      }}
                      className="min-w-[60px] px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-sm hover:shadow active:scale-95"
                    >
                      {playbackSpeed}x
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Preview of your recorded voice</p>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Name</label>
                <input
                  type="text"
                  value={voiceConfig.name}
                  onChange={(e) => setVoiceConfig({ ...voiceConfig, name: e.target.value })}
                  placeholder="Enter a name for your custom voice"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                />
                {voiceConfig.name && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Your Superproxy will introduce as <span className="font-semibold text-purple-600">{voiceConfig.name}</span>, <span className="font-semibold text-slate-700">Melwyn</span>'s Superproxy from <span className="font-semibold text-slate-700">Appquant</span>
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Description</label>
                <textarea
                  value={voiceConfig.description}
                  onChange={(e) => setVoiceConfig({ ...voiceConfig, description: e.target.value })}
                  placeholder="Enter an optional description for your custom voice"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all resize-none"
                ></textarea>
              </div>

              {/* Voice Labels */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">Voice Labels</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Accent */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Accent</label>
                    <Dropdown
                      value={voiceConfig.accent}
                      options={[
                        { value: 'american', label: 'American' },
                        { value: 'british', label: 'British' },
                        { value: 'australian', label: 'Australian' },
                        { value: 'canadian', label: 'Canadian' },
                        { value: 'indian', label: 'Indian' },
                        { value: 'other', label: 'Other' },
                      ]}
                      onChange={(val) => setVoiceConfig({ ...voiceConfig, accent: val as string })}
                      placeholder="Select accent"
                      className="w-full"
                      buttonClassName="w-full"
                      menuClassName="w-full"
                      menuAlign="left"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Gender</label>
                    <Dropdown
                      value={voiceConfig.gender}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'non-binary', label: 'Non-binary' },
                      ]}
                      onChange={(val) => setVoiceConfig({ ...voiceConfig, gender: val as string })}
                      placeholder="Select gender"
                      className="w-full"
                      buttonClassName="w-full"
                      menuClassName="w-full"
                      menuAlign="left"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Age</label>
                  <Dropdown
                    value={voiceConfig.age}
                    options={[
                      { value: 'young', label: 'Young (18-30)' },
                      { value: 'middle', label: 'Middle Aged (31-50)' },
                      { value: 'mature', label: 'Mature (51+)' },
                    ]}
                    onChange={(val) => setVoiceConfig({ ...voiceConfig, age: val as string })}
                    placeholder="Select age"
                    className="w-full"
                    buttonClassName="w-full"
                    menuClassName="w-full"
                    menuAlign="left"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => {
                  setVoiceConfig({ name: '', description: '', accent: '', gender: '', age: '' });
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  // Save voice configuration
                  setShowVoiceConfigModal(false);
                  setShowVoiceSuccessModal(true);
                  setVoiceConfig({ name: '', description: '', accent: '', gender: '', age: '' });
                  setVoiceRecordingTime(0);
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Delete Confirmation Modal */}
      {showVoiceDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 mx-auto mb-4">
                <Icon icon="solar:trash-bin-trash-bold" width="32" className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Discard Voice Recording?</h3>
              <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                Are you sure you want to close? Your recording and all configurations will be lost.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVoiceDeleteConfirmModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowVoiceDeleteConfirmModal(false);
                    setShowVoiceConfigModal(false);
                    setVoiceConfig({ name: '', description: '', accent: '', gender: '', age: '' });
                    setVoiceRecordingTime(0);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25 transition-all"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Success Modal */}
      {showVoiceSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 mx-auto mb-4">
                <Icon icon="solar:check-circle-bold" width="32" className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Voice Uploaded Successfully!</h3>
              <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                Your custom voice has been saved and is now ready to use. You can select it from your voice list.
              </p>
              
              <button
                onClick={() => setShowVoiceSuccessModal(false)}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Custom Voice Modal */}
      {showDeleteCustomVoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 mx-auto mb-4">
                <Icon icon="solar:trash-bin-trash-bold" width="32" className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Voice Profile?</h3>
              <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
                Are you sure you want to delete this custom voice? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteCustomVoiceModal(false);
                    setVoiceToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteVoiceCallback) {
                      deleteVoiceCallback();
                      setDeleteVoiceCallback(null);
                    }
                    setShowDeleteCustomVoiceModal(false);
                    setVoiceToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Voice Modal */}
      {showPreviewVoiceModal && voiceToPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Preview Voice</h3>
                <p className="text-sm text-slate-500 mt-1">{voiceToPreview.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowPreviewVoiceModal(false);
                  setVoiceToPreview(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <Icon icon="solar:close-circle-linear" width="24" className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Voice Details */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50/50 to-violet-50/30 border border-purple-100 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:microphone-3-bold" width="24" className="text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{voiceToPreview.name}</h4>
                  <p className="text-xs text-slate-500">
                    {voiceToPreview.accent} • {voiceToPreview.gender} • {voiceToPreview.age}
                  </p>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <button className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-900 flex items-center justify-center transition-all shadow-lg shadow-slate-800/25">
                    <Icon icon="solar:play-bold" width="24" className="text-white ml-0.5" />
                  </button>
                  <div className="flex-1">
                    <div className="relative h-2 bg-slate-300 rounded-full overflow-hidden mb-2">
                      <div className="absolute left-0 top-0 h-full bg-purple-600 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">0:00</span>
                      <span className="text-xs text-slate-500">0:15</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-all">
                    <Icon icon="solar:volume-loud-linear" width="20" className="text-slate-600" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center">Sample preview of your custom voice</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowPreviewVoiceModal(false);
                  setVoiceToPreview(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreviewVoiceModal(false);
                  setVoiceToPreview(null);
                  // TODO: Set as active voice
                }}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/25 transition-all"
              >
                Use This Voice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CallManagerWithToast({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  return (
    <CallManagerProvider onError={(message) => showToast(message, 'warning')}>
      {children}
    </CallManagerProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <CallManagerWithToast>
        <AppContent />
      </CallManagerWithToast>
    </ToastProvider>
  );
}

export default App;
