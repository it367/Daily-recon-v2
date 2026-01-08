'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DollarSign, FileText, Building2, Bot, Send, Loader2, LogOut, User, Upload, X, File, Shield, Receipt, CreditCard, Package, RefreshCw, Monitor, Menu, Eye, EyeOff, FolderOpen, Edit3, Users, Plus, Trash2, Lock, Download, Settings, MessageCircle, Sparkles, AlertCircle, Maximize2, Minimize2, Headphones, Search } from 'lucide-react';

const MODULES = [
  { id: 'daily-recon', name: 'Daily Recon', icon: DollarSign, color: 'emerald', table: 'daily_recon' },
  { id: 'billing-inquiry', name: 'Billing Inquiry', icon: Receipt, color: 'blue', table: 'billing_inquiries' },
  { id: 'bills-payment', name: 'Bills Payment', icon: CreditCard, color: 'violet', table: 'bills_payment' },
  { id: 'order-requests', name: 'Order Requests', icon: Package, color: 'amber', table: 'order_requests' },
  { id: 'refund-requests', name: 'Refund Requests', icon: RefreshCw, color: 'rose', table: 'refund_requests' },
];

const SUPPORT_MODULES = [
  { id: 'it-requests', name: 'IT Requests', icon: Monitor, color: 'cyan', table: 'it_requests' },
];

const ALL_MODULES = [...MODULES, ...SUPPORT_MODULES];

const MODULE_COLORS = {
  'daily-recon': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500', light: 'bg-emerald-100', gradient: 'from-emerald-500 to-emerald-600' },
  'billing-inquiry': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500', light: 'bg-blue-100', gradient: 'from-blue-500 to-blue-600' },
  'bills-payment': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', accent: 'bg-violet-500', light: 'bg-violet-100', gradient: 'from-violet-500 to-violet-600' },
  'order-requests': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500', light: 'bg-amber-100', gradient: 'from-amber-500 to-amber-600' },
  'refund-requests': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', accent: 'bg-rose-500', light: 'bg-rose-100', gradient: 'from-rose-500 to-rose-600' },
  'it-requests': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', accent: 'bg-cyan-500', light: 'bg-cyan-100', gradient: 'from-cyan-500 to-cyan-600' },
};

const STATUS_OPTIONS = {
  'billing-inquiry': ['Pending', 'In Progress', 'Resolved'],
  'bills-payment': ['Pending', 'Approved', 'Paid'],
  'order-requests': ['Pending', 'Approved', 'Paid'],
  'refund-requests': ['Pending', 'Approved', 'Completed', 'Denied'],
  'it-requests': ['Open', 'In Progress', 'Resolved', 'Closed'],
};

const URGENCY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const INQUIRY_TYPES = ['Balance Question', 'Insurance Claim', 'Payment Plan', 'Billing Error', 'Statement Request', 'Other'];
const REFUND_TYPES = ['Overpayment', 'Cancelled Service', 'Insurance Adjustment', 'Billing Error', 'Other'];

export default function ClinicSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentModule, setCurrentModule] = useState('daily-recon');
  const [adminView, setAdminView] = useState('records');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState({});
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docSearch, setDocSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // AI Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // Form states
  const [formData, setFormData] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  
  // User management
  const [editingUser, setEditingUser] = useState(null);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [userFormData, setUserFormData] = useState({ email: '', password: '', name: '', role: 'staff', locations: [] });
  
  // Settings
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [nameForm, setNameForm] = useState('');

  // Filters
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      loadRecords();
      if (isAdmin) {
        loadUsers();
        loadDocuments();
      }
    }
  }, [isLoggedIn, currentUser, selectedLocation, currentModule]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadLocations = async () => {
    const { data } = await supabase.from('locations').select('*').order('name');
    if (data) setLocations(data);
  };

  const loadRecords = async () => {
    setLoading(true);
    const module = ALL_MODULES.find(m => m.id === currentModule);
    if (!module) return;

    let query = supabase.from(module.table).select('*');
    
    if (!isAdmin && selectedLocation) {
      const loc = locations.find(l => l.name === selectedLocation);
      if (loc) query = query.eq('location_id', loc.id);
    }

    const { data } = await query.order('created_at', { ascending: false });
    setRecords(prev => ({ ...prev, [currentModule]: data || [] }));
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data: usersData } = await supabase.from('users').select('*').order('name');
    if (usersData) {
      const usersWithLocations = await Promise.all(usersData.map(async (user) => {
        const { data: locs } = await supabase
          .from('user_locations')
          .select('location_id, locations(name)')
          .eq('user_id', user.id);
        return { ...user, assignedLocations: locs?.map(l => l.locations?.name) || [] };
      }));
      setUsers(usersWithLocations);
    }
  };

  const loadDocuments = async () => {
    const { data } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (data) setDocuments(data);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', loginEmail)
      .single();

    if (user && user.password === loginPassword) {
      setCurrentUser(user);
      setIsAdmin(['super_admin', 'finance_admin', 'admin'].includes(user.role));
      
      if (['super_admin', 'finance_admin', 'admin'].includes(user.role)) {
        setUserLocations(locations.map(l => l.name));
        setSelectedLocation(locations[0]?.name || '');
      } else {
        const { data: locs } = await supabase
          .from('user_locations')
          .select('locations(name)')
          .eq('user_id', user.id);
        const locNames = locs?.map(l => l.locations?.name) || [];
        setUserLocations(locNames);
        setSelectedLocation(locNames[0] || '');
      }
      
      setIsLoggedIn(true);
      setNameForm(user.name || '');
      showNotification(`Welcome, ${user.name || user.email}!`);
    } else {
      showNotification('Invalid email or password', 'error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setChatMessages([]);
    setRecords({});
  };

  const handleNumberInput = (e, field) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const module = ALL_MODULES.find(m => m.id === currentModule);
    const loc = locations.find(l => l.name === selectedLocation);
    
    const recordData = {
      ...formData,
      location_id: loc?.id,
      created_by: currentUser.id,
      entered_by_name: currentUser.name || currentUser.email,
    };

    if (currentModule === 'it-requests' && !editingRecord) {
      const { data: lastTicket } = await supabase
        .from('it_requests')
        .select('ticket_number')
        .order('ticket_number', { ascending: false })
        .limit(1);
      recordData.ticket_number = (lastTicket?.[0]?.ticket_number || 0) + 1;
    }

    let result;
    if (editingRecord) {
      result = await supabase.from(module.table).update(recordData).eq('id', editingRecord.id);
    } else {
      result = await supabase.from(module.table).insert([recordData]);
    }

    if (result.error) {
      showNotification(result.error.message, 'error');
    } else {
      // Handle file uploads
      if (uploadFiles.length > 0) {
        const recordId = editingRecord?.id || result.data?.[0]?.id;
        for (const file of uploadFiles) {
          const fileName = `${module.table}/${recordId}/${Date.now()}-${file.name}`;
          await supabase.storage.from('clinic-documents').upload(fileName, file);
          await supabase.from('documents').insert([{
            record_type: module.table,
            record_id: recordId,
            file_name: file.name,
            file_path: fileName,
            uploaded_by: currentUser.id,
          }]);
        }
      }
      
      showNotification(editingRecord ? 'Record updated!' : 'Record submitted!');
      setFormData({});
      setUploadFiles([]);
      setEditingRecord(null);
      loadRecords();
      if (isAdmin) loadDocuments();
    }
    setLoading(false);
  };

  const handleDeleteRecord = async (record) => {
    if (!confirm('Delete this record?')) return;
    const module = ALL_MODULES.find(m => m.id === currentModule);
    await supabase.from(module.table).delete().eq('id', record.id);
    showNotification('Record deleted');
    loadRecords();
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      email: userFormData.email,
      name: userFormData.name,
      role: userFormData.role,
      password: userFormData.password || (editingUser?.password || 'default123'),
    };

    let userId;
    if (editingUser) {
      if (!userFormData.password) delete userData.password;
      await supabase.from('users').update(userData).eq('id', editingUser.id);
      userId = editingUser.id;
    } else {
      const { data } = await supabase.from('users').insert([userData]).select();
      userId = data?.[0]?.id;
    }

    // Update locations if staff role
    if (userId && userFormData.role === 'staff') {
      await supabase.from('user_locations').delete().eq('user_id', userId);
      const locInserts = userFormData.locations.map(locName => {
        const loc = locations.find(l => l.name === locName);
        return { user_id: userId, location_id: loc?.id };
      }).filter(l => l.location_id);
      if (locInserts.length > 0) {
        await supabase.from('user_locations').insert(locInserts);
      }
    }

    showNotification(editingUser ? 'User updated!' : 'User created!');
    setUserFormData({ email: '', password: '', name: '', role: 'staff', locations: [] });
    setEditingUser(null);
    loadUsers();
    setLoading(false);
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Delete user ${user.name || user.email}?`)) return;
    await supabase.from('user_locations').delete().eq('user_id', user.id);
    await supabase.from('users').delete().eq('id', user.id);
    showNotification('User deleted');
    loadUsers();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.current !== currentUser.password) {
      showNotification('Current password is incorrect', 'error');
      return;
    }
    if (passwordForm.new.length < 4) {
      showNotification('New password must be at least 4 characters', 'error');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      showNotification('New passwords do not match', 'error');
      return;
    }

    await supabase.from('users').update({ password: passwordForm.new }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, password: passwordForm.new });
    setPasswordForm({ current: '', new: '', confirm: '' });
    showNotification('Password changed successfully!');
  };

  const handleChangeName = async (e) => {
    e.preventDefault();
    if (!nameForm.trim()) {
      showNotification('Name cannot be empty', 'error');
      return;
    }
    await supabase.from('users').update({ name: nameForm }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, name: nameForm });
    showNotification('Name updated successfully!');
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          context: {
            module: currentModule,
            location: selectedLocation,
            isAdmin,
            userName: currentUser?.name || currentUser?.email,
          },
        }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setChatLoading(false);
  };

  const exportCSV = () => {
    const module = ALL_MODULES.find(m => m.id === currentModule);
    const data = records[currentModule] || [];
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(r => Object.values(r).map(v => `"${v || ''}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${module.name.replace(/\s+/g, '-')}-export.csv`;
    a.click();
  };

  const getLocationName = (locationId) => {
    return locations.find(l => l.id === locationId)?.name || 'Unknown';
  };

  const currentModuleData = ALL_MODULES.find(m => m.id === currentModule);
  const colors = MODULE_COLORS[currentModule] || MODULE_COLORS['daily-recon'];

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Clinic Management</h1>
            <p className="text-gray-500 mt-1">Sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white font-medium`}>
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${isAdmin ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-cyan-600'} rounded-xl flex items-center justify-center`}>
              {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-semibold truncate">{currentUser?.name || currentUser?.email}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
              </div>
            )}
          </div>
        </div>

        {sidebarOpen && !isAdmin && userLocations.length > 1 && (
          <div className="p-4 border-b border-slate-700">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-700 border-0 rounded-lg px-3 py-2 text-sm"
            >
              {userLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 px-2">Modules</p>
          {MODULES.map(mod => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id && adminView === 'records';
            return (
              <button
                key={mod.id}
                onClick={() => { setCurrentModule(mod.id); setAdminView('records'); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? `bg-${mod.color}-500/20 text-${mod.color}-400` : 'text-slate-300 hover:bg-slate-700/50'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? `text-${mod.color}-400` : ''}`} />
                {sidebarOpen && <span className="text-sm">{mod.name}</span>}
              </button>
            );
          })}

          <p className="text-xs text-slate-400 uppercase tracking-wider mt-6 mb-2 px-2">Support</p>
          {SUPPORT_MODULES.map(mod => {
            const Icon = mod.icon;
            const isActive = currentModule === mod.id && adminView === 'records';
            return (
              <button
                key={mod.id}
                onClick={() => { setCurrentModule(mod.id); setAdminView('records'); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? `bg-${mod.color}-500/20 text-${mod.color}-400` : 'text-slate-300 hover:bg-slate-700/50'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? `text-${mod.color}-400` : ''}`} />
                {sidebarOpen && <span className="text-sm">{mod.name}</span>}
              </button>
            );
          })}

          {isAdmin && (
            <>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-6 mb-2 px-2">Management</p>
              <button
                onClick={() => setAdminView('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${adminView === 'users' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}
              >
                <Users className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">Users</span>}
              </button>
              <button
                onClick={() => setAdminView('documents')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${adminView === 'documents' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}
              >
                <FolderOpen className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">Documents</span>}
              </button>
              <button
                onClick={() => setAdminView('export')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${adminView === 'export' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}
              >
                <Download className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">Export</span>}
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-1">
          <button
            onClick={() => setAdminView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${adminView === 'settings' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className={`bg-gradient-to-r ${colors.gradient} text-white px-6 py-4 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">
                {adminView === 'users' ? 'User Management' : adminView === 'documents' ? 'Documents' : adminView === 'export' ? 'Export Data' : adminView === 'settings' ? 'Settings' : currentModuleData?.name}
              </h1>
            </div>
            {isAdmin && adminView === 'records' && (
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-white/20 border-0 rounded-lg px-4 py-2 text-sm backdrop-blur-sm"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.name} className="text-gray-800">{loc.name}</option>
                ))}
              </select>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Settings View */}
          {adminView === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Change Display Name
                </h2>
                <form onSubmit={handleChangeName} className="space-y-4">
                  <input
                    type="text"
                    value={nameForm}
                    onChange={(e) => setNameForm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                    placeholder="Your display name"
                  />
                  <button type="submit" className={`px-6 py-2.5 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-medium hover:opacity-90`}>
                    Update Name
                  </button>
                </form>
              </div>

              <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6`}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" /> Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 pr-12"
                        required
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 pr-12"
                        required
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 pr-12"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className={`px-6 py-2.5 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-medium hover:opacity-90`}>
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Users View */}
          {adminView === 'users' && isAdmin && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email/Username</label>
                    <input
                      type="text"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && '(leave blank to keep)'}</label>
                    <div className="relative">
                      <input
                        type={showUserPassword ? 'text' : 'password'}
                        value={userFormData.password}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 pr-12"
                        {...(!editingUser && { required: true })}
                      />
                      <button type="button" onClick={() => setShowUserPassword(!showUserPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="staff">Staff</option>
                      <option value="finance_admin">Finance Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  {userFormData.role === 'staff' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Locations</label>
                      <div className="flex flex-wrap gap-2">
                        {locations.map(loc => (
                          <label key={loc.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={userFormData.locations.includes(loc.name)}
                              onChange={(e) => {
                                const locs = e.target.checked
                                  ? [...userFormData.locations, loc.name]
                                  : userFormData.locations.filter(l => l !== loc.name);
                                setUserFormData({ ...userFormData, locations: locs });
                              }}
                              className="rounded text-purple-600"
                            />
                            <span className="text-sm">{loc.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90">
                      {editingUser ? 'Update User' : 'Create User'}
                    </button>
                    {editingUser && (
                      <button type="button" onClick={() => { setEditingUser(null); setUserFormData({ email: '', password: '', name: '', role: 'staff', locations: [] }); }} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Locations</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                              {(user.name || user.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{user.name || '-'}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : user.role === 'finance_admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.role?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {['super_admin', 'finance_admin'].includes(user.role) ? 'All Locations' : (user.assignedLocations?.join(', ') || '-')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setEditingUser(user); setUserFormData({ email: user.email, password: '', name: user.name || '', role: user.role, locations: user.assignedLocations || [] }); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(user)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents View */}
          {adminView === 'documents' && isAdmin && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">File</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Related To</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Uploaded</th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {documents
                      .filter(doc => !docSearch || doc.file_name.toLowerCase().includes(docSearch.toLowerCase()) || doc.record_type.toLowerCase().includes(docSearch.toLowerCase()))
                      .map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <File className="w-5 h-5 text-gray-400" />
                              <span className="font-medium text-gray-800">{doc.file_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                              {doc.record_type} #{doc.record_id}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={async () => {
                                const { data } = await supabase.storage.from('clinic-documents').createSignedUrl(doc.file_path, 60);
                                if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export View */}
          {adminView === 'export' && isAdmin && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Export Records</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                    <select
                      value={filterModule}
                      onChange={(e) => setFilterModule(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Modules</option>
                      {ALL_MODULES.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Locations</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.name}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <button onClick={exportCSV} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Export to CSV
                </button>
              </div>
            </div>
          )}

          {/* Records View */}
          {adminView === 'records' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className={`lg:col-span-1 ${colors.bg} ${colors.border} border rounded-2xl p-6`}>
                <h2 className={`text-lg font-semibold ${colors.text} mb-4`}>
                  {editingRecord ? 'Edit Record' : 'New Entry'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {currentModule === 'daily-recon' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={formData.recon_date || ''} onChange={(e) => setFormData({ ...formData, recon_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cash Can Amount</label>
                        <input type="text" inputMode="decimal" value={formData.cash_can || ''} onChange={(e) => handleNumberInput(e, 'cash_can')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="0.00" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Deposit Amount</label>
                        <input type="text" inputMode="decimal" value={formData.bank_deposit || ''} onChange={(e) => handleNumberInput(e, 'bank_deposit')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="0.00" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" rows={3} />
                      </div>
                    </>
                  )}

                  {currentModule === 'billing-inquiry' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        <input type="text" value={formData.patient_name || ''} onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                        <input type="text" value={formData.parent_name || ''} onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input type="text" inputMode="numeric" value={formData.account_number || ''} onChange={(e) => handleNumberInput(e, 'account_number')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type of Inquiry</label>
                        <select value={formData.inquiry_type || ''} onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required>
                          <option value="">Select type...</option>
                          {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" rows={3} />
                      </div>
                      {isAdmin && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={formData.status || 'Pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                              {STATUS_OPTIONS['billing-inquiry'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Reviewed</label>
                            <input type="date" value={formData.date_reviewed || ''} onChange={(e) => setFormData({ ...formData, date_reviewed: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {currentModule === 'bills-payment' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                        <input type="text" value={formData.vendor_name || ''} onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                        <input type="text" value={formData.invoice_number || ''} onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input type="text" inputMode="decimal" value={formData.amount || ''} onChange={(e) => handleNumberInput(e, 'amount')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="0.00" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input type="date" value={formData.due_date || ''} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paid</label>
                        <select value={formData.paid ? 'yes' : 'no'} onChange={(e) => setFormData({ ...formData, paid: e.target.value === 'yes' })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {isAdmin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select value={formData.status || 'Pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                            {STATUS_OPTIONS['bills-payment'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {currentModule === 'order-requests' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                        <input type="text" value={formData.vendor || ''} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                        <textarea value={formData.item_description || ''} onChange={(e) => setFormData({ ...formData, item_description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" rows={2} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                        <input type="text" inputMode="decimal" value={formData.estimated_cost || ''} onChange={(e) => handleNumberInput(e, 'estimated_cost')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="0.00" />
                      </div>
                      {isAdmin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select value={formData.status || 'Pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                            {STATUS_OPTIONS['order-requests'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {currentModule === 'refund-requests' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        <input type="text" value={formData.patient_name || ''} onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input type="text" inputMode="numeric" value={formData.account_number || ''} onChange={(e) => handleNumberInput(e, 'account_number')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                        <input type="text" inputMode="decimal" value={formData.refund_amount || ''} onChange={(e) => handleNumberInput(e, 'refund_amount')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="0.00" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Type</label>
                        <select value={formData.refund_type || ''} onChange={(e) => setFormData({ ...formData, refund_type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required>
                          <option value="">Select type...</option>
                          {REFUND_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" rows={2} />
                      </div>
                      {isAdmin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select value={formData.status || 'Pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                            {STATUS_OPTIONS['refund-requests'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {currentModule === 'it-requests' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                        <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" rows={3} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                        <select value={formData.urgency || 'Medium'} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                          {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      {isAdmin && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={formData.status || 'Open'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500">
                              {STATUS_OPTIONS['it-requests'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                            <input type="text" value={formData.assigned_to || ''} onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500" />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-colors">
                      <input type="file" multiple onChange={(e) => setUploadFiles([...uploadFiles, ...Array.from(e.target.files)])} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Click to upload files</span>
                      </label>
                    </div>
                    {uploadFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {uploadFiles.map((file, i) => (
                          <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                            <button type="button" onClick={() => setUploadFiles(uploadFiles.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" disabled={loading} className={`flex-1 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2`}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingRecord ? 'Update' : 'Submit'}
                    </button>
                    {editingRecord && (
                      <button type="button" onClick={() => { setEditingRecord(null); setFormData({}); }} className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Records List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {isAdmin ? 'All Records' : 'Your Submissions'}
                  </h2>
                  <span className="text-sm text-gray-500">{records[currentModule]?.length || 0} records</span>
                </div>

                {loading ? (
                  <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                  </div>
                ) : (records[currentModule]?.length || 0) === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No records found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records[currentModule]?.map(record => (
                      <div key={record.id} className={`bg-white rounded-2xl shadow-sm border ${colors.border} p-4 hover:shadow-md transition-shadow`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 ${colors.light} ${colors.text} rounded text-xs font-medium`}>
                                {getLocationName(record.location_id)}
                              </span>
                              {record.status && (
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${record.status === 'Resolved' || record.status === 'Completed' || record.status === 'Paid' || record.status === 'Closed' ? 'bg-green-100 text-green-700' : record.status === 'In Progress' || record.status === 'Approved' ? 'bg-blue-100 text-blue-700' : record.status === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {record.status}
                                </span>
                              )}
                              {record.urgency && (
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${record.urgency === 'Critical' ? 'bg-red-100 text-red-700' : record.urgency === 'High' ? 'bg-orange-100 text-orange-700' : record.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {record.urgency}
                                </span>
                              )}
                              {record.ticket_number && (
                                <span className="text-xs text-gray-500">#{record.ticket_number}</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {currentModule === 'daily-recon' && (
                                <>
                                  <p><strong>Date:</strong> {record.recon_date}</p>
                                  <p><strong>Cash Can:</strong> ${parseFloat(record.cash_can || 0).toFixed(2)} | <strong>Bank:</strong> ${parseFloat(record.bank_deposit || 0).toFixed(2)}</p>
                                </>
                              )}
                              {currentModule === 'billing-inquiry' && (
                                <>
                                  <p><strong>Patient:</strong> {record.patient_name}</p>
                                  <p><strong>Account:</strong> {record.account_number} | <strong>Type:</strong> {record.inquiry_type}</p>
                                </>
                              )}
                              {currentModule === 'bills-payment' && (
                                <>
                                  <p><strong>Vendor:</strong> {record.vendor_name}</p>
                                  <p><strong>Invoice:</strong> {record.invoice_number} | <strong>Amount:</strong> ${parseFloat(record.amount || 0).toFixed(2)}</p>
                                </>
                              )}
                              {currentModule === 'order-requests' && (
                                <>
                                  <p><strong>Vendor:</strong> {record.vendor}</p>
                                  <p className="truncate">{record.item_description}</p>
                                </>
                              )}
                              {currentModule === 'refund-requests' && (
                                <>
                                  <p><strong>Patient:</strong> {record.patient_name}</p>
                                  <p><strong>Amount:</strong> ${parseFloat(record.refund_amount || 0).toFixed(2)} | <strong>Type:</strong> {record.refund_type}</p>
                                </>
                              )}
                              {currentModule === 'it-requests' && (
                                <>
                                  <p className="font-medium text-gray-800">{record.title}</p>
                                  <p className="truncate">{record.description}</p>
                                </>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(record.created_at).toLocaleString()} {record.entered_by_name && `by ${record.entered_by_name}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <button onClick={() => { setEditingRecord(record); setFormData(record); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteRecord(record)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating AI Chat */}
      <div className="fixed bottom-6 right-6 z-40">
        {chatOpen ? (
          <div className={`bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 ${chatExpanded ? 'w-[500px] h-[600px]' : 'w-[380px] h-[480px]'}`}>
            <div className={`bg-gradient-to-r ${isAdmin ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-cyan-600'} px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setChatExpanded(!chatExpanded)} className="p-1.5 hover:bg-white/20 rounded-lg text-white">
                  {chatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setChatOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: chatExpanded ? '480px' : '360px' }}>
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>How can I help you today?</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${msg.role === 'user' ? `bg-gradient-to-r ${isAdmin ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-cyan-600'} text-white` : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button type="submit" disabled={chatLoading || !chatInput.trim()} className={`p-2.5 bg-gradient-to-r ${isAdmin ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-cyan-600'} text-white rounded-xl hover:opacity-90 disabled:opacity-50`}>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className={`w-14 h-14 bg-gradient-to-r ${isAdmin ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-cyan-600'} text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center`}
          >
            <Sparkles className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
