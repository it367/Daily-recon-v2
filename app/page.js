//**Clinic Tracking System - DEMO VERSION**- M //

'use client';
import { useState, useEffect, useRef } from 'react';
import { DollarSign, FileText, Building2, Bot, Send, Loader2, LogOut, User, Upload, X, File, Shield, Receipt, CreditCard, Package, RefreshCw, Monitor, Menu, Eye, EyeOff, FolderOpen, Edit3, Users, Plus, Trash2, Lock, Download, Settings, MessageCircle, Sparkles, AlertCircle, Maximize2, Minimize2, Search } from 'lucide-react';

// ============= DEMO DATA =============
const DEMO_LOCATIONS = [
  { id: 'loc-1', name: 'Honolulu Main', is_active: true },
  { id: 'loc-2', name: 'Kapolei', is_active: true },
  { id: 'loc-3', name: 'Pearl City', is_active: true },
  { id: 'loc-4', name: 'Kailua', is_active: true },
  { id: 'loc-5', name: 'Aiea', is_active: true },
  { id: 'loc-6', name: 'Waipahu', is_active: true },
  { id: 'loc-7', name: 'Kaneohe', is_active: true },
  { id: 'loc-8', name: 'Mililani', is_active: true },
];

const DEMO_USERS = [
  { id: 'user-1', name: 'Admin User', username: 'admin', email: 'admin@kidshine.com', password_hash: 'admin123', role: 'super_admin', is_active: true, locations: DEMO_LOCATIONS },
  { id: 'user-2', name: 'Finance Admin', username: 'finance', email: 'finance@kidshine.com', password_hash: 'finance123', role: 'finance_admin', is_active: true, locations: DEMO_LOCATIONS },
  { id: 'user-3', name: 'Sarah Johnson', username: 'sarah', email: 'sarah@kidshine.com', password_hash: 'staff123', role: 'staff', is_active: true, locations: [DEMO_LOCATIONS[0], DEMO_LOCATIONS[1]] },
  { id: 'user-4', name: 'Mike Chen', username: 'mike', email: 'mike@kidshine.com', password_hash: 'staff123', role: 'staff', is_active: true, locations: [DEMO_LOCATIONS[2]] },
  { id: 'user-5', name: 'Emily Davis', username: 'emily', email: 'emily@kidshine.com', password_hash: 'staff123', role: 'staff', is_active: true, locations: [DEMO_LOCATIONS[3], DEMO_LOCATIONS[4]] },
];

const generateDemoData = () => {
  const dailyRecon = [];
  const billingInquiries = [];
  const billsPayment = [];
  const orderRequests = [];
  const refundRequests = [];
  const itRequests = [];

  // Generate Daily Recon entries
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    const statuses = ['Pending', 'Accounted', 'Rejected'];
    dailyRecon.push({
      id: `recon-${i}`,
      recon_date: date.toISOString().split('T')[0],
      location_id: loc.id,
      locations: loc,
      cash: Math.floor(Math.random() * 2000) + 500,
      credit_card: Math.floor(Math.random() * 3000) + 1000,
      checks_otc: Math.floor(Math.random() * 500),
      insurance_checks: Math.floor(Math.random() * 1500),
      care_credit: Math.floor(Math.random() * 800),
      vcc: Math.floor(Math.random() * 300),
      efts: Math.floor(Math.random() * 600),
      deposit_cash: i % 3 === 0 ? Math.floor(Math.random() * 2000) : 0,
      deposit_credit_card: i % 3 === 0 ? Math.floor(Math.random() * 3000) : 0,
      deposit_checks: i % 3 === 0 ? Math.floor(Math.random() * 500) : 0,
      deposit_insurance: 0,
      deposit_care_credit: 0,
      deposit_vcc: 0,
      deposit_efts: 0,
      notes: i % 2 === 0 ? 'End of day reconciliation complete' : '',
      status: statuses[i % 3],
      created_at: date.toISOString(),
      created_by: DEMO_USERS[2].id,
      creator: DEMO_USERS[2],
      get total_collected() { return this.cash + this.credit_card + this.checks_otc + this.insurance_checks + this.care_credit + this.vcc + this.efts; },
      get total_deposit() { return this.deposit_cash + this.deposit_credit_card + this.deposit_checks + this.deposit_insurance + this.deposit_care_credit + this.deposit_vcc + this.deposit_efts; }
    });
  }

  // Generate Billing Inquiries
  const patients = ['Emma Wilson', 'Liam Smith', 'Olivia Brown', 'Noah Davis', 'Ava Martinez'];
  const inquiryTypes = ['Refund', 'Balance', 'Insurance', 'Payment Plan', 'Other'];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 2);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    billingInquiries.push({
      id: `billing-${i}`,
      patient_name: patients[i % patients.length],
      chart_number: `CH${10000 + i}`,
      parent_name: `Parent of ${patients[i % patients.length]}`,
      date_of_request: date.toISOString().split('T')[0],
      inquiry_type: inquiryTypes[i % inquiryTypes.length],
      description: 'Patient inquiry regarding account balance and payment options.',
      amount_in_question: Math.floor(Math.random() * 500) + 100,
      best_contact_method: ['Phone', 'Email', 'Text'][i % 3],
      best_contact_time: '10:00 AM - 2:00 PM',
      status: ['Pending', 'In Progress', 'Resolved'][i % 3],
      location_id: loc.id,
      locations: loc,
      created_at: date.toISOString(),
      creator: DEMO_USERS[3]
    });
  }

  // Generate Bills Payment
  const vendors = ['Hawaiian Tel', 'HECO', 'Office Depot', 'Dental Supply Co', 'IT Services LLC'];
  for (let i = 0; i < 8; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 3);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    billsPayment.push({
      id: `bill-${i}`,
      bill_status: ['Pending', 'Approved', 'Paid'][i % 3],
      bill_date: date.toISOString().split('T')[0],
      vendor: vendors[i % vendors.length],
      description: `Monthly service invoice from ${vendors[i % vendors.length]}`,
      amount: Math.floor(Math.random() * 2000) + 200,
      due_date: new Date(date.getTime() + 30*24*60*60*1000).toISOString().split('T')[0],
      manager_initials: 'MJ',
      ap_reviewed: i % 2 === 0 ? 'Yes' : 'No',
      location_id: loc.id,
      locations: loc,
      created_at: date.toISOString(),
      creator: DEMO_USERS[4]
    });
  }

  // Generate Order Requests
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 4);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    orderRequests.push({
      id: `order-${i}`,
      date_entered: date.toISOString().split('T')[0],
      vendor: vendors[i % vendors.length],
      invoice_number: `INV-${20240000 + i}`,
      invoice_date: date.toISOString().split('T')[0],
      due_date: new Date(date.getTime() + 45*24*60*60*1000).toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 3000) + 500,
      entered_by: DEMO_USERS[3].name,
      notes: 'Regular supply order',
      location_id: loc.id,
      locations: loc,
      created_at: date.toISOString(),
      creator: DEMO_USERS[3]
    });
  }

  // Generate Refund Requests
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 5);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    refundRequests.push({
      id: `refund-${i}`,
      patient_name: patients[i % patients.length],
      chart_number: `CH${10000 + i}`,
      parent_name: `Parent of ${patients[i % patients.length]}`,
      rp_address: '123 Main St, Honolulu, HI 96801',
      date_of_request: date.toISOString().split('T')[0],
      type: ['Refund', 'Credit', 'Adjustment'][i % 3],
      description: 'Overpayment refund request',
      amount_requested: Math.floor(Math.random() * 300) + 50,
      best_contact_method: ['Phone', 'Email', 'Text'][i % 3],
      eassist_audited: i % 2 === 0,
      status: ['Pending', 'Approved', 'Completed', 'Denied'][i % 4],
      location_id: loc.id,
      locations: loc,
      created_at: date.toISOString(),
      creator: DEMO_USERS[4]
    });
  }

  // Generate IT Requests
  const devices = ['Computer', 'Printer', 'Network', 'Phone System', 'Software'];
  const issues = ['Not working', 'Slow performance', 'Error message', 'Needs update', 'Access issue'];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 2);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    itRequests.push({
      id: `it-${i}`,
      ticket_number: 1000 + i,
      date_reported: date.toISOString().split('T')[0],
      urgency: ['Low', 'Medium', 'High', 'Critical'][i % 4],
      requester_name: DEMO_USERS[(i % 3) + 2].name,
      device_system: devices[i % devices.length],
      description_of_issue: `${devices[i % devices.length]} ${issues[i % issues.length]}`,
      best_contact_method: ['Phone', 'Email', 'Text'][i % 3],
      best_contact_time: '9:00 AM - 5:00 PM',
      status: ['Open', 'In Progress', 'Resolved', 'Closed'][i % 4],
      resolution_notes: i % 4 >= 2 ? 'Issue resolved successfully' : '',
      location_id: loc.id,
      locations: loc,
      created_at: date.toISOString(),
      creator: DEMO_USERS[(i % 3) + 2]
    });
  }

  return {
    'daily-recon': dailyRecon,
    'billing-inquiry': billingInquiries,
    'bills-payment': billsPayment,
    'order-requests': orderRequests,
    'refund-requests': refundRequests,
    'it-requests': itRequests
  };
};

// ============= CONSTANTS =============
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
  'daily-recon': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-500', light: 'bg-emerald-100' },
  'billing-inquiry': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500', light: 'bg-blue-100' },
  'bills-payment': { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', accent: 'bg-violet-500', light: 'bg-violet-100' },
  'order-requests': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500', light: 'bg-amber-100' },
  'refund-requests': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', accent: 'bg-rose-500', light: 'bg-rose-100' },
  'it-requests': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', accent: 'bg-cyan-500', light: 'bg-cyan-100' },
};

const IT_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];
const INQUIRY_TYPES = ['Refund', 'Balance', 'Insurance', 'Payment Plan', 'Other'];
const REFUND_TYPES = ['Refund', 'Credit', 'Adjustment'];
const CONTACT_METHODS = ['Phone', 'Email', 'Text'];
const DATE_RANGES = ['This Week', 'Last 2 Weeks', 'This Month', 'Last Month', 'This Quarter', 'This Year', 'Custom'];
const RECON_STATUSES = ['Pending', 'Accounted', 'Rejected'];

function canEditRecord(createdAt) {
  const now = new Date();
  const hawaiiNow = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));
  const recordDate = new Date(createdAt);
  const recordHawaii = new Date(recordDate.toLocaleString('en-US', { timeZone: 'Pacific/Honolulu' }));
  const dayOfWeek = recordHawaii.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  const friday = new Date(recordHawaii);
  friday.setDate(recordHawaii.getDate() + daysUntilFriday);
  friday.setHours(23, 59, 59, 999);
  return hawaiiNow <= friday;
}

// ============= COMPONENTS =============
function PasswordField({ label, value, onChange, placeholder = '', disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className={`flex items-center border-2 border-gray-200 rounded-xl bg-white transition-all hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 ${disabled ? 'bg-gray-100' : ''}`}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} disabled={disabled} className="w-full p-2.5 rounded-xl outline-none bg-transparent disabled:cursor-not-allowed" placeholder={placeholder} />
        <button type="button" onClick={() => setShow(!show)} className="px-3 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder = '', prefix, options, large, disabled, isNumber }) {
  if (options) {
    return (
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
        <select value={value} onChange={onChange} disabled={disabled} className="w-full p-2.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed">
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (large) {
    return (
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
        <textarea value={value} onChange={onChange} disabled={disabled} rows={4} className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder={placeholder} />
      </div>
    );
  }
  const handleNumberInput = (e) => {
    const val = e.target.value;
    if (isNumber || prefix === '$') {
      if (val === '' || /^\d*\.?\d*$/.test(val)) onChange(e);
    } else onChange(e);
  };
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className={`flex items-center border-2 border-gray-200 rounded-xl bg-white transition-all hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 ${disabled ? 'bg-gray-100' : ''}`}>
        {prefix && <span className="pl-3 text-gray-400 font-medium">{prefix}</span>}
        <input type={type} value={value} onChange={handleNumberInput} disabled={disabled} className="w-full p-2.5 rounded-xl outline-none bg-transparent disabled:cursor-not-allowed" placeholder={placeholder} inputMode={(isNumber || prefix === '$') ? 'decimal' : undefined} />
      </div>
    </div>
  );
}

function FileUpload({ label, files, onFilesChange, onViewFile, disabled }) {
  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({ file: f, name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), isNew: true }));
    onFilesChange([...files, ...newFiles]);
  };
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-blue-300 hover:from-blue-50 hover:to-indigo-50 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <label className={`flex flex-col items-center justify-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-gray-500 hover:text-blue-600`}>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Upload className="w-5 h-5 text-blue-600" /></div>
          <span className="text-sm font-medium">Click to upload files</span>
          <input type="file" multiple onChange={handleFileChange} disabled={disabled} className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
        </label>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 truncate flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><File className="w-4 h-4 text-blue-600" /></div>
                  <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {file.url && <button onClick={() => onViewFile(file)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>}
                  {!disabled && <button onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" /></button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileViewer({ file, onClose }) {
  if (!file) return null;
  const isImage = file.type?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm">
          <h3 className="font-semibold truncate text-gray-800">{file.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {isImage ? <img src={file.url} alt={file.name} className="max-w-full rounded-xl mx-auto shadow-lg" /> : (
            <div className="text-center py-12 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><File className="w-10 h-10 text-gray-400" /></div>
              <p className="mb-4">Preview not available</p>
              <a href={file.url} download={file.name} className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">Download File</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    'Open': 'bg-red-100 text-red-700 border-red-200',
    'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
    'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Closed': 'bg-gray-100 text-gray-600 border-gray-200',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Approved': 'bg-blue-100 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Denied': 'bg-red-100 text-red-700 border-red-200',
    'Accounted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200'
  };
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{status || 'Pending'}</span>;
}

function EntryPreview({ entry, module, onClose, colors }) {
  if (!entry) return null;
  const formatCurrency = (val) => val ? `$${Number(val).toFixed(2)}` : '$0.00';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-';
  const formatDateTime = (date) => date ? new Date(date).toLocaleString() : '-';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] w-full overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className={`flex justify-between items-center p-4 border-b sticky top-0 ${colors?.bg || 'bg-gray-50'}`}>
          <div><h3 className="font-semibold text-gray-800">Entry Details</h3><p className="text-sm text-gray-500">{module?.name}</p></div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={entry.status || 'Pending'} />
            <span className="text-sm text-gray-500">Created: {formatDateTime(entry.created_at)}</span>
          </div>
          {entry.locations?.name && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              <Building2 className="w-4 h-4" /> {entry.locations.name}
            </div>
          )}
          {module?.id === 'daily-recon' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="col-span-2 font-semibold text-emerald-800 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Cash Can Entries</h4>
                <div><span className="text-gray-600 text-sm">Date:</span> <span className="font-medium">{entry.recon_date}</span></div>
                <div><span className="text-gray-600 text-sm">Cash:</span> <span className="font-medium">{formatCurrency(entry.cash)}</span></div>
                <div><span className="text-gray-600 text-sm">Credit Card:</span> <span className="font-medium">{formatCurrency(entry.credit_card)}</span></div>
                <div><span className="text-gray-600 text-sm">Checks OTC:</span> <span className="font-medium">{formatCurrency(entry.checks_otc)}</span></div>
                <div><span className="text-gray-600 text-sm">Insurance:</span> <span className="font-medium">{formatCurrency(entry.insurance_checks)}</span></div>
                <div><span className="text-gray-600 text-sm">Care Credit:</span> <span className="font-medium">{formatCurrency(entry.care_credit)}</span></div>
                <div><span className="text-gray-600 text-sm">VCC:</span> <span className="font-medium">{formatCurrency(entry.vcc)}</span></div>
                <div><span className="text-gray-600 text-sm">EFTs:</span> <span className="font-medium">{formatCurrency(entry.efts)}</span></div>
                <div className="col-span-2 pt-2 border-t border-emerald-200">
                  <span className="text-gray-600 text-sm">Total Collected:</span> <span className="font-bold text-emerald-700 text-lg">{formatCurrency(entry.total_collected)}</span>
                </div>
              </div>
              {(entry.deposit_cash > 0 || entry.status === 'Accounted') && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="col-span-2 font-semibold text-blue-800 flex items-center gap-2"><Building2 className="w-4 h-4" /> Bank Deposit</h4>
                  <div><span className="text-gray-600 text-sm">Cash:</span> <span className="font-medium">{formatCurrency(entry.deposit_cash)}</span></div>
                  <div><span className="text-gray-600 text-sm">Credit Card:</span> <span className="font-medium">{formatCurrency(entry.deposit_credit_card)}</span></div>
                  <div><span className="text-gray-600 text-sm">Checks:</span> <span className="font-medium">{formatCurrency(entry.deposit_checks)}</span></div>
                  <div className="col-span-2 pt-2 border-t border-blue-200">
                    <span className="text-gray-600 text-sm">Total Deposit:</span> <span className="font-bold text-blue-700 text-lg">{formatCurrency(entry.total_deposit)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {module?.id === 'billing-inquiry' && (
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-600 text-sm block">Patient Name</span><span className="font-medium">{entry.patient_name || '-'}</span></div>
              <div><span className="text-gray-600 text-sm block">Chart Number</span><span className="font-medium">{entry.chart_number || '-'}</span></div>
              <div><span className="text-gray-600 text-sm block">Inquiry Type</span><span className="font-medium">{entry.inquiry_type || '-'}</span></div>
              <div><span className="text-gray-600 text-sm block">Amount</span><span className="font-medium text-emerald-600">{formatCurrency(entry.amount_in_question)}</span></div>
              <div className="col-span-2"><span className="text-gray-600 text-sm block">Description</span><p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">{entry.description || '-'}</p></div>
            </div>
          )}
          {module?.id === 'bills-payment' && (
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-600 text-sm block">Vendor</span><span className="font-medium">{entry.vendor || '-'}</span></div>
              <div><span className="text-gray-600 text-sm block">Amount</span><span className="font-medium text-emerald-600">{formatCurrency(entry.amount)}</span></div>
              <div><span className="text-gray-600 text-sm block">Due Date</span><span className="font-medium">{formatDate(entry.due_date)}</span></div>
              <div><span className="text-gray-600 text-sm block">Bill Status</span><span className="font-medium">{entry.bill_status || '-'}</span></div>
            </div>
          )}
          {module?.id === 'it-requests' && (
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-600 text-sm block">Ticket Number</span><span className="font-medium text-cyan-600">IT-{entry.ticket_number}</span></div>
              <div><span className="text-gray-600 text-sm block">Urgency</span><span className={`font-medium ${entry.urgency === 'Critical' ? 'text-red-600' : entry.urgency === 'High' ? 'text-orange-600' : ''}`}>{entry.urgency || '-'}</span></div>
              <div><span className="text-gray-600 text-sm block">Device/System</span><span className="font-medium">{entry.device_system || '-'}</span></div>
              <div><span className="text-gray-600 text-sm block">Requester</span><span className="font-medium">{entry.requester_name || '-'}</span></div>
              <div className="col-span-2"><span className="text-gray-600 text-sm block">Description</span><p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">{entry.description_of_issue || '-'}</p></div>
            </div>
          )}
          {entry.creator?.name && <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">Created by: <span className="font-medium text-gray-700">{entry.creator.name}</span></div>}
        </div>
        <div className="p-4 border-t bg-gray-50 sticky bottom-0">
          <button onClick={onClose} className="w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-all">Close</button>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN COMPONENT =============
export default function ClinicSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [locations, setLocations] = useState(DEMO_LOCATIONS);
  const [users, setUsers] = useState(DEMO_USERS);
  const [activeModule, setActiveModule] = useState('daily-recon');
  const [view, setView] = useState('entry');
  const [adminView, setAdminView] = useState('records');
  const [moduleData, setModuleData] = useState(generateDemoData());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewingFile, setViewingFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminLocation, setAdminLocation] = useState('all');
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingRecon, setEditingRecon] = useState(null);
  const [reconForm, setReconForm] = useState({});
  const [editingEntry, setEditingEntry] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docSearch, setDocSearch] = useState('');
  const [recordSearch, setRecordSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameForm, setNameForm] = useState('');
  const [editingStaffEntry, setEditingStaffEntry] = useState(null);
  const [staffEditForm, setStaffEditForm] = useState({});
  const [viewingUserSessions, setViewingUserSessions] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [viewingEntry, setViewingEntry] = useState(null);
  const [staffRecordSearch, setStaffRecordSearch] = useState('');
  const [staffSortOrder, setStaffSortOrder] = useState('desc');
  const [staffRecordsPerPage, setStaffRecordsPerPage] = useState(20);
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', role: 'staff', locations: [] });
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [exportModule, setExportModule] = useState('daily-recon');
  const [exportLocation, setExportLocation] = useState('all');
  const [exportRange, setExportRange] = useState('This Month');

  const today = new Date().toISOString().split('T')[0];

  const [forms, setForms] = useState({
    'daily-recon': { recon_date: today, cash: '', credit_card: '', checks_otc: '', insurance_checks: '', care_credit: '', vcc: '', efts: '', notes: '' },
    'billing-inquiry': { patient_name: '', chart_number: '', parent_name: '', date_of_request: today, inquiry_type: '', description: '', amount_in_question: '', best_contact_method: '', best_contact_time: '', status: 'Pending' },
    'bills-payment': { bill_status: 'Pending', bill_date: today, vendor: '', description: '', amount: '', due_date: '', manager_initials: '' },
    'order-requests': { date_entered: today, vendor: '', invoice_number: '', invoice_date: '', due_date: '', amount: '', notes: '' },
    'refund-requests': { patient_name: '', chart_number: '', parent_name: '', rp_address: '', date_of_request: today, type: '', description: '', amount_requested: '', best_contact_method: '', status: 'Pending' },
    'it-requests': { date_reported: today, urgency: '', requester_name: '', device_system: '', description_of_issue: '', best_contact_method: '', best_contact_time: '', status: 'Open' }
  });

  const [files, setFiles] = useState({
    'daily-recon': { documents: [] },
    'billing-inquiry': { documentation: [] },
    'bills-payment': { documentation: [] },
    'order-requests': { orderInvoices: [] },
    'refund-requests': { documentation: [] },
    'it-requests': { documentation: [] }
  });

  useEffect(() => { if (currentUser) setNameForm(currentUser.name || ''); }, [currentUser]);
  useEffect(() => { setCurrentPage(1); setRecordSearch(''); }, [activeModule, adminLocation]);
  useEffect(() => { setStaffCurrentPage(1); setStaffRecordSearch(''); setEditingStaffEntry(null); }, [activeModule, selectedLocation]);

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'finance_admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      showMessage('error', 'Please enter email/username and password');
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      const loginValue = loginEmail.toLowerCase().trim();
      const user = DEMO_USERS.find(u => (u.email.toLowerCase() === loginValue || u.username.toLowerCase() === loginValue) && u.password_hash === loginPassword && u.is_active);
      if (!user) {
        showMessage('error', 'Invalid email/username or password');
        setLoginLoading(false);
        return;
      }
      setCurrentUser(user);
      setUserLocations(user.locations);
      if (user.locations.length === 1) setSelectedLocation(user.locations[0].name);
      showMessage('success', '✓ Login successful!');
      setLoginLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserLocations([]);
    setSelectedLocation(null);
    setLoginEmail('');
    setLoginPassword('');
    setView('entry');
    setAdminView('records');
    setPwdForm({ current: '', new: '', confirm: '' });
  };

  const updateForm = (module, field, value) => {
    setForms(prev => ({ ...prev, [module]: { ...prev[module], [field]: value } }));
  };

  const updateFiles = (module, field, newFiles) => {
    setFiles(prev => ({ ...prev, [module]: { ...prev[module], [field]: newFiles } }));
  };

  const saveEntry = (moduleId) => {
    setSaving(true);
    setTimeout(() => {
      const form = forms[moduleId];
      const loc = locations.find(l => l.name === selectedLocation);
      if (!loc) {
        showMessage('error', 'Please select a location');
        setSaving(false);
        return;
      }
      const newEntry = {
        id: `${moduleId}-${Date.now()}`,
        ...form,
        location_id: loc.id,
        locations: loc,
        created_at: new Date().toISOString(),
        created_by: currentUser.id,
        creator: currentUser,
        status: form.status || 'Pending'
      };
      if (moduleId === 'daily-recon') {
        newEntry.cash = parseFloat(form.cash) || 0;
        newEntry.credit_card = parseFloat(form.credit_card) || 0;
        newEntry.checks_otc = parseFloat(form.checks_otc) || 0;
        newEntry.insurance_checks = parseFloat(form.insurance_checks) || 0;
        newEntry.care_credit = parseFloat(form.care_credit) || 0;
        newEntry.vcc = parseFloat(form.vcc) || 0;
        newEntry.efts = parseFloat(form.efts) || 0;
        newEntry.total_collected = newEntry.cash + newEntry.credit_card + newEntry.checks_otc + newEntry.insurance_checks + newEntry.care_credit + newEntry.vcc + newEntry.efts;
        newEntry.deposit_cash = 0;
        newEntry.deposit_credit_card = 0;
        newEntry.deposit_checks = 0;
        newEntry.total_deposit = 0;
      }
      if (moduleId === 'it-requests') {
        newEntry.ticket_number = 1000 + (moduleData['it-requests']?.length || 0) + 1;
      }
      if (moduleId === 'bills-payment' || moduleId === 'order-requests' || moduleId === 'refund-requests' || moduleId === 'billing-inquiry') {
        newEntry.amount = parseFloat(form.amount || form.amount_requested || form.amount_in_question) || 0;
      }
      setModuleData(prev => ({ ...prev, [moduleId]: [newEntry, ...(prev[moduleId] || [])] }));
      const resetForm = { ...forms[moduleId] };
      Object.keys(resetForm).forEach(k => { if (!k.includes('date')) resetForm[k] = ''; });
      setForms(prev => ({ ...prev, [moduleId]: { ...resetForm, [Object.keys(resetForm).find(k => k.includes('date'))]: today } }));
      setFiles(prev => ({ ...prev, [moduleId]: Object.fromEntries(Object.entries(files[moduleId]).map(([k]) => [k, []])) }));
      showMessage('success', '✓ Entry saved successfully!');
      setSaving(false);
    }, 500);
  };

  const startEditingRecon = (entry) => {
    setEditingRecon(entry.id);
    setReconForm(prev => ({
      ...prev,
      [entry.id]: {
        deposit_cash: entry.deposit_cash || '',
        deposit_credit_card: entry.deposit_credit_card || '',
        deposit_checks: entry.deposit_checks || '',
        deposit_insurance: entry.deposit_insurance || '',
        deposit_care_credit: entry.deposit_care_credit || '',
        deposit_vcc: entry.deposit_vcc || '',
        deposit_efts: entry.deposit_efts || '',
        status: entry.status || 'Pending'
      }
    }));
  };

  const updateReconForm = (entryId, field, value) => {
    setReconForm(prev => ({ ...prev, [entryId]: { ...prev[entryId], [field]: value } }));
  };

  const updateDailyRecon = (entryId) => {
    const form = reconForm[entryId];
    if (!form) return;
    setModuleData(prev => ({
      ...prev,
      'daily-recon': prev['daily-recon'].map(e => e.id === entryId ? {
        ...e,
        deposit_cash: parseFloat(form.deposit_cash) || 0,
        deposit_credit_card: parseFloat(form.deposit_credit_card) || 0,
        deposit_checks: parseFloat(form.deposit_checks) || 0,
        deposit_insurance: parseFloat(form.deposit_insurance) || 0,
        deposit_care_credit: parseFloat(form.deposit_care_credit) || 0,
        deposit_vcc: parseFloat(form.deposit_vcc) || 0,
        deposit_efts: parseFloat(form.deposit_efts) || 0,
        status: form.status,
        get total_deposit() { return this.deposit_cash + this.deposit_credit_card + this.deposit_checks + this.deposit_insurance + this.deposit_care_credit + this.deposit_vcc + this.deposit_efts; }
      } : e)
    }));
    showMessage('success', '✓ Daily Recon updated!');
    setEditingRecon(null);
    setReconForm(prev => { const n = { ...prev }; delete n[entryId]; return n; });
  };

  const updateEntryStatus = (moduleId, entryId, newStatus, additionalFields = {}) => {
    setModuleData(prev => ({
      ...prev,
      [moduleId]: prev[moduleId].map(e => e.id === entryId ? { ...e, status: newStatus, ...additionalFields } : e)
    }));
    showMessage('success', '✓ Status updated!');
    setEditingStatus(null);
  };

  const exportToCSV = () => {
    const data = moduleData[exportModule] || [];
    if (data.length === 0) {
      showMessage('error', 'No data to export');
      return;
    }
    showMessage('success', '✓ Export complete! (Demo mode)');
  };

  const getModuleEntries = () => {
    let data = moduleData[activeModule] || [];
    if (isAdmin && adminLocation !== 'all') {
      data = data.filter(e => e.locations?.name === adminLocation);
    }
    if (!isAdmin && selectedLocation) {
      data = data.filter(e => e.locations?.name === selectedLocation);
    }
    if (recordSearch.trim()) {
      const search = recordSearch.toLowerCase();
      data = data.filter(e => {
        const searchableFields = [e.recon_date, e.patient_name, e.vendor, e.chart_number, e.description, e.description_of_issue, e.locations?.name, e.creator?.name, e.status, e.ticket_number?.toString()];
        return searchableFields.some(field => field?.toLowerCase()?.includes(search));
      });
    }
    data = [...data].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return data;
  };

  const getPaginatedEntries = () => {
    const allEntries = getModuleEntries();
    if (recordsPerPage === 'all') return allEntries;
    const startIndex = (currentPage - 1) * recordsPerPage;
    return allEntries.slice(startIndex, startIndex + recordsPerPage);
  };

  const getTotalPages = () => {
    const allEntries = getModuleEntries();
    if (recordsPerPage === 'all') return 1;
    return Math.ceil(allEntries.length / recordsPerPage);
  };

  const getStaffEntries = () => {
    let data = moduleData[activeModule] || [];
    if (selectedLocation) {
      data = data.filter(e => e.locations?.name === selectedLocation);
    }
    if (staffRecordSearch.trim()) {
      const search = staffRecordSearch.toLowerCase();
      data = data.filter(e => {
        const searchableFields = [e.recon_date, e.patient_name, e.vendor, e.chart_number, e.description, e.description_of_issue, e.status, e.ticket_number?.toString()];
        return searchableFields.some(field => field?.toLowerCase()?.includes(search));
      });
    }
    data = [...data].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return staffSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return data;
  };

  const getStaffPaginatedEntries = () => {
    const allEntries = getStaffEntries();
    if (staffRecordsPerPage === 'all') return allEntries;
    const startIndex = (staffCurrentPage - 1) * staffRecordsPerPage;
    return allEntries.slice(startIndex, startIndex + staffRecordsPerPage);
  };

  const getStaffTotalPages = () => {
    const allEntries = getStaffEntries();
    if (staffRecordsPerPage === 'all') return 1;
    return Math.ceil(allEntries.length / staffRecordsPerPage);
  };

  const currentColors = MODULE_COLORS[activeModule];
  const currentModule = ALL_MODULES.find(m => m.id === activeModule);

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CMS - KidShine Hawaii</h1>
            <p className="text-gray-500 text-sm mt-1">Clinic Management Portal</p>
            <p className="text-amber-600 text-xs mt-2 font-medium bg-amber-50 px-3 py-1 rounded-full inline-block">🎯 DEMO MODE</p>
          </div>
          {message.text && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
              <AlertCircle className="w-4 h-4" />{message.text}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email / Username</label>
              <input type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full p-3.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all" placeholder="admin or sarah" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white transition-all hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                <input type={showLoginPwd ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="w-full p-3.5 rounded-xl outline-none bg-transparent" placeholder="admin123 or staff123" />
                <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="px-4 text-gray-400 hover:text-gray-600">
                  {showLoginPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loginLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50">
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Login →'}
            </button>
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><span className="font-medium">Admin:</span> admin / admin123</p>
                <p><span className="font-medium">Finance:</span> finance / finance123</p>
                <p><span className="font-medium">Staff:</span> sarah / staff123</p>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400">DEMO Version 0.26</p>
          </div>
        </div>
      </div>
    );
  }

  // LOCATION SELECTION
  if (!isAdmin && !selectedLocation && userLocations.length > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-500">Select your location</p>
          </div>
          <div className="space-y-2">
            {userLocations.map(loc => (
              <button key={loc.id} onClick={() => setSelectedLocation(loc.name)} className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 flex items-center gap-3 transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600" /></div>
                <span className="font-medium text-gray-700">{loc.name}</span>
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="w-full mt-6 py-2.5 text-gray-500 hover:text-gray-700 transition-colors">← Back to Login</button>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex">
      <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />
      <EntryPreview entry={viewingEntry} module={currentModule} onClose={() => setViewingEntry(null)} colors={currentColors} />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`p-5 ${isSuperAdmin ? 'bg-gradient-to-r from-rose-600 to-pink-600' : isAdmin ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              {isSuperAdmin ? <Shield className="w-6 h-6 text-white" /> : isAdmin ? <Shield className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
            </div>
            <div className="text-white">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm text-white/80">{isSuperAdmin ? 'Super Admin' : isAdmin ? 'Finance Admin' : selectedLocation}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg inline-block">🎯 Demo Mode</div>
        </div>

        {isAdmin && (
          <div className="p-4 border-b bg-purple-50">
            <label className="text-xs font-medium text-purple-700 mb-1.5 block">Filter by Location</label>
            <select value={adminLocation} onChange={e => setAdminLocation(e.target.value)} className="w-full p-2.5 border-2 border-purple-200 rounded-xl text-sm focus:border-purple-400 outline-none bg-white">
              <option value="all">📍 All Locations</option>
              {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
        )}

        {!isAdmin && userLocations.length > 1 && (
          <div className="p-4 border-b bg-blue-50">
            <label className="text-xs font-medium text-blue-700 mb-1.5 block">Switch Location</label>
            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-2.5 border-2 border-blue-200 rounded-xl text-sm focus:border-blue-400 outline-none bg-white">
              {userLocations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Modules</p>
          {MODULES.map(m => {
            const colors = MODULE_COLORS[m.id];
            const isActive = activeModule === m.id && adminView !== 'users' && adminView !== 'export' && adminView !== 'settings' && view !== 'settings';
            return (
              <button key={m.id} onClick={() => { setActiveModule(m.id); setAdminView('records'); setView('entry'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? `${colors.bg} ${colors.text} ${colors.border} border-2` : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? colors.light : 'bg-gray-100'}`}><m.icon className={`w-4 h-4 ${isActive ? colors.text : 'text-gray-500'}`} /></div>
                <span className="text-sm font-medium">{m.name}</span>
              </button>
            );
          })}

          <div className="border-t my-4"></div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Support</p>
          {SUPPORT_MODULES.map(m => {
            const colors = MODULE_COLORS[m.id];
            const isActive = activeModule === m.id && adminView !== 'users' && adminView !== 'export' && adminView !== 'settings' && view !== 'settings';
            return (
              <button key={m.id} onClick={() => { setActiveModule(m.id); setAdminView('records'); setView('entry'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? `${colors.bg} ${colors.text} ${colors.border} border-2` : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? colors.light : 'bg-gray-100'}`}><m.icon className={`w-4 h-4 ${isActive ? colors.text : 'text-gray-500'}`} /></div>
                <span className="text-sm font-medium">{m.name}</span>
              </button>
            );
          })}

          {isAdmin && (
            <>
              <div className="border-t my-4"></div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Management</p>
              <button onClick={() => { setAdminView('export'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${adminView === 'export' ? 'bg-purple-50 text-purple-700 border-2 border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${adminView === 'export' ? 'bg-purple-100' : 'bg-gray-100'}`}><Download className="w-4 h-4" /></div>
                <span className="text-sm font-medium">Export</span>
              </button>
              <button onClick={() => { setAdminView('users'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${adminView === 'users' ? 'bg-purple-50 text-purple-700 border-2 border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${adminView === 'users' ? 'bg-purple-100' : 'bg-gray-100'}`}><Users className="w-4 h-4" /></div>
                <span className="text-sm font-medium">Users</span>
              </button>
            </>
          )}
        </nav>

        {/* Bottom buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button onClick={() => { isAdmin ? setAdminView('settings') : setView('settings'); setSidebarOpen(false); }} className={`w-full flex items-center justify-center gap-2 py-2.5 mb-2 rounded-xl transition-all ${(isAdmin ? adminView : view) === 'settings' ? (isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700') : 'text-gray-500 hover:bg-gray-200'}`}>
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"><Menu className="w-5 h-5" /></button>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">
                  {isAdmin ? (adminView === 'users' ? 'User Management' : adminView === 'export' ? 'Export Data' : adminView === 'settings' ? 'Settings' : currentModule?.name) : (view === 'settings' ? 'Settings' : currentModule?.name)}
                </h1>
                <p className="text-sm text-gray-500">{isAdmin ? (adminLocation === 'all' ? 'All Locations' : adminLocation) : selectedLocation}</p>
              </div>
            </div>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            {isAdmin && adminView === 'records' ? (
              <button className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${currentColors?.accent} text-white shadow-lg`}>
                <FileText className="w-4 h-4" />Records
              </button>
            ) : !isAdmin && view !== 'settings' ? (
              [{ id: 'entry', label: '+ New Entry' }, { id: 'history', label: 'History' }].map(tab => (
                <button key={tab.id} onClick={() => setView(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab.label}</button>
              ))
            ) : null}
          </div>
        </header>

        {message.text && (
          <div className={`mx-4 mt-4 p-4 rounded-xl text-center font-medium shadow-sm flex items-center justify-center gap-2 ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700'}`}>
            {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : null}{message.text}
          </div>
        )}

        <main className="flex-1 p-4 max-w-4xl mx-auto w-full pb-24">
          {/* ADMIN: User Management */}
          {isAdmin && adminView === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">{users.length} Users</h2>
                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Demo: Read-only</span>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="divide-y">
                  {users.map(u => (
                    <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${u.role === 'super_admin' ? 'bg-gradient-to-br from-rose-500 to-pink-500' : u.role === 'finance_admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.username && <span className="text-blue-600">@{u.username} • </span>}{u.email} • <span className="capitalize">{u.role?.replace('_', ' ')}</span></p>
                          {u.role === 'staff' && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {u.locations?.slice(0, 3).map(loc => (
                                <span key={loc.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">{loc.name}</span>
                              ))}
                              {u.locations?.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">+{u.locations.length - 3} more</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN: Export */}
          {isAdmin && adminView === 'export' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Export Data</h2>
                  <p className="text-sm text-gray-500">Download records as CSV file</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Module</label>
                  <select value={exportModule} onChange={e => setExportModule(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none">
                    {ALL_MODULES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Location</label>
                  <select value={exportLocation} onChange={e => setExportLocation(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none">
                    <option value="all">All Locations</option>
                    {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Date Range</label>
                  <select value={exportRange} onChange={e => setExportRange(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none">
                    {DATE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={exportToCSV} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all">
                <Download className="w-5 h-5" />Export to CSV
              </button>
            </div>
          )}

          {/* Settings */}
          {((isAdmin && adminView === 'settings') || (!isAdmin && view === 'settings')) && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">Account Settings</h2>
                    <p className="text-sm text-gray-500">Demo mode - changes not persisted</p>
                  </div>
                </div>
                <div className="space-y-4 max-w-sm">
                  <InputField label="Display Name" value={nameForm} onChange={e => setNameForm(e.target.value)} placeholder="Enter your name" />
                  <button onClick={() => showMessage('success', '✓ Name updated! (Demo)')} className={`w-full py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${isAdmin ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                    Update Name
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Demo Session Active</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-red-600 font-medium hover:text-red-700 hover:underline">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Records View - Admin */}
          {isAdmin && adminView === 'records' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={recordSearch} onChange={e => { setRecordSearch(e.target.value); setCurrentPage(1); }} placeholder="Search records..." className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none transition-all" />
                      {recordSearch && (
                        <button onClick={() => setRecordSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Sort:</span>
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none bg-white">
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Show:</span>
                    <select value={recordsPerPage} onChange={e => { setRecordsPerPage(e.target.value === 'all' ? 'all' : parseInt(e.target.value)); setCurrentPage(1); }} className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none bg-white">
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-700">{getPaginatedEntries().length}</span> of <span className="font-semibold text-gray-700">{getModuleEntries().length}</span> records</p>
                  <span className={`text-sm font-medium px-3 py-1 rounded-lg ${currentColors?.light} ${currentColors?.text}`}>{currentModule?.name}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                {getModuleEntries().length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-gray-400" /></div>
                    <p className="text-gray-500">{recordSearch ? 'No records match your search' : 'No entries yet'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getPaginatedEntries().map(e => {
                      if (activeModule === 'daily-recon') {
                        const isEditing = editingRecon === e.id;
                        const form = reconForm[e.id] || {};
                        return (
                          <div key={e.id} className={`p-4 rounded-xl border-2 ${e.status === 'Accounted' ? 'border-emerald-200 bg-emerald-50' : e.status === 'Rejected' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'} hover:shadow-md transition-all`}>
                            <div className="flex justify-between items-start gap-4 mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-gray-800">{e.recon_date}</p>
                                  <StatusBadge status={e.status || 'Pending'} />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{e.locations?.name} • {e.creator?.name || 'Unknown'} • {new Date(e.created_at).toLocaleDateString()}</p>
                              </div>
                              {!isEditing && (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => setViewingEntry(e)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                                  <button onClick={() => startEditingRecon(e)} className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1"><Edit3 className="w-4 h-4" /> Review</button>
                                </div>
                              )}
                            </div>
                            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Staff Daily Cash Can</h4>
                              <div className="grid grid-cols-4 gap-3 text-sm">
                                <div><span className="text-gray-500">Cash:</span> <span className="font-medium">${Number(e.cash || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500">Credit Card:</span> <span className="font-medium">${Number(e.credit_card || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500">Checks OTC:</span> <span className="font-medium">${Number(e.checks_otc || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500">Insurance:</span> <span className="font-medium">${Number(e.insurance_checks || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500">Care Credit:</span> <span className="font-medium">${Number(e.care_credit || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500">VCC:</span> <span className="font-medium">${Number(e.vcc || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500">EFTs:</span> <span className="font-medium">${Number(e.efts || 0).toFixed(2)}</span></div>
                                <div><span className="text-gray-500 font-semibold">Total:</span> <span className="font-bold text-emerald-600">${Number(e.total_collected || 0).toFixed(2)}</span></div>
                              </div>
                            </div>
                            {isEditing ? (
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" /> Bank Deposit (Admin Entry)</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Cash</label>
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white"><span className="pl-2 text-gray-400">$</span><input type="text" value={form.deposit_cash || ''} onChange={ev => updateReconForm(e.id, 'deposit_cash', ev.target.value)} className="w-full p-2 outline-none rounded-lg" /></div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Credit Card</label>
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white"><span className="pl-2 text-gray-400">$</span><input type="text" value={form.deposit_credit_card || ''} onChange={ev => updateReconForm(e.id, 'deposit_credit_card', ev.target.value)} className="w-full p-2 outline-none rounded-lg" /></div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Checks</label>
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white"><span className="pl-2 text-gray-400">$</span><input type="text" value={form.deposit_checks || ''} onChange={ev => updateReconForm(e.id, 'deposit_checks', ev.target.value)} className="w-full p-2 outline-none rounded-lg" /></div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Status</label>
                                    <select value={form.status || 'Pending'} onChange={ev => updateReconForm(e.id, 'status', ev.target.value)} className="w-full p-2 border-2 border-gray-200 rounded-lg bg-white">
                                      {RECON_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => updateDailyRecon(e.id)} className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">Submit Review</button>
                                  <button onClick={() => setEditingRecon(null)} className="px-4 py-2.5 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-all">Cancel</button>
                                </div>
                              </div>
                            ) : (e.deposit_cash > 0 || e.status === 'Accounted') && (
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4" /> Bank Deposit (Reviewed)</h4>
                                <div className="grid grid-cols-4 gap-3 text-sm">
                                  <div><span className="text-gray-500">Cash:</span> <span className="font-medium">${Number(e.deposit_cash || 0).toFixed(2)}</span></div>
                                  <div><span className="text-gray-500">Credit Card:</span> <span className="font-medium">${Number(e.deposit_credit_card || 0).toFixed(2)}</span></div>
                                  <div><span className="text-gray-500">Checks:</span> <span className="font-medium">${Number(e.deposit_checks || 0).toFixed(2)}</span></div>
                                  <div><span className="text-gray-500 font-semibold">Total:</span> <span className="font-bold text-blue-600">${Number(e.total_deposit || 0).toFixed(2)}</span></div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return (
                        <div key={e.id} className={`p-4 rounded-xl border-2 ${currentColors?.border} ${currentColors?.bg} hover:shadow-md transition-all`}>
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-800">{e.ticket_number ? `IT-${e.ticket_number}` : e.patient_name || e.vendor || e.created_at?.split('T')[0]}</p>
                                <StatusBadge status={e.status} />
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{e.locations?.name} • {e.creator?.name || 'Unknown'} • {new Date(e.created_at).toLocaleDateString()}</p>
                              {e.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{e.description}</p>}
                              {e.description_of_issue && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{e.description_of_issue}</p>}
                              {(e.amount || e.amount_requested || e.amount_in_question) && (
                                <p className="text-lg font-bold text-emerald-600 mt-2">${Number(e.amount || e.amount_requested || e.amount_in_question || 0).toFixed(2)}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setViewingEntry(e)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                              {activeModule === 'it-requests' && (
                                <button onClick={() => setEditingStatus(editingStatus === e.id ? null : e.id)} className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1"><Edit3 className="w-4 h-4" /> Update</button>
                              )}
                            </div>
                          </div>
                          {activeModule === 'it-requests' && editingStatus === e.id && (
                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                              <select defaultValue={e.status} id={`status-${e.id}`} className="w-full p-2 border-2 rounded-lg text-sm">
                                {IT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <input type="text" id={`notes-${e.id}`} placeholder="Resolution notes" className="w-full p-2 border-2 rounded-lg text-sm" />
                              <div className="flex gap-2">
                                <button onClick={() => updateEntryStatus('it-requests', e.id, document.getElementById(`status-${e.id}`).value, { resolution_notes: document.getElementById(`notes-${e.id}`).value })} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Save</button>
                                <button onClick={() => setEditingStatus(null)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {getModuleEntries().length > 0 && recordsPerPage !== 'all' && getTotalPages() > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {currentPage} of {getTotalPages()}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">First</button>
                      <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Prev</button>
                      <span className="px-3 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-lg">{currentPage}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(p + 1, getTotalPages()))} disabled={currentPage === getTotalPages()} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Next</button>
                      <button onClick={() => setCurrentPage(getTotalPages())} disabled={currentPage === getTotalPages()} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Last</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Entry Form - Staff */}
          {!isAdmin && view === 'entry' && (
            <div className="space-y-4">
              {activeModule === 'daily-recon' && (
                <>
                  <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                    <h2 className="font-semibold mb-4 text-gray-800 flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500" />Daily Cash Can</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Date" type="date" value={forms['daily-recon'].recon_date} onChange={e => updateForm('daily-recon', 'recon_date', e.target.value)} />
                      <InputField label="Cash" prefix="$" value={forms['daily-recon'].cash} onChange={e => updateForm('daily-recon', 'cash', e.target.value)} />
                      <InputField label="Credit Card (OTC)" prefix="$" value={forms['daily-recon'].credit_card} onChange={e => updateForm('daily-recon', 'credit_card', e.target.value)} />
                      <InputField label="Checks (OTC)" prefix="$" value={forms['daily-recon'].checks_otc} onChange={e => updateForm('daily-recon', 'checks_otc', e.target.value)} />
                      <InputField label="Insurance Checks" prefix="$" value={forms['daily-recon'].insurance_checks} onChange={e => updateForm('daily-recon', 'insurance_checks', e.target.value)} />
                      <InputField label="Care Credit" prefix="$" value={forms['daily-recon'].care_credit} onChange={e => updateForm('daily-recon', 'care_credit', e.target.value)} />
                      <InputField label="VCC" prefix="$" value={forms['daily-recon'].vcc} onChange={e => updateForm('daily-recon', 'vcc', e.target.value)} />
                      <InputField label="EFTs" prefix="$" value={forms['daily-recon'].efts} onChange={e => updateForm('daily-recon', 'efts', e.target.value)} />
                    </div>
                    <div className="mt-4"><InputField label="Notes" value={forms['daily-recon'].notes} onChange={e => updateForm('daily-recon', 'notes', e.target.value)} /></div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="font-semibold mb-4 text-gray-800 flex items-center gap-2"><File className="w-5 h-5 text-amber-500" />Documents</h2>
                    <FileUpload label="Upload Documents (EOD Sheets, Bank Receipts, etc.)" files={files['daily-recon'].documents} onFilesChange={f => updateFiles('daily-recon', 'documents', f)} onViewFile={setViewingFile} />
                  </div>
                </>
              )}

              {activeModule === 'it-requests' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-2 text-gray-800">IT Request</h2>
                  <p className="text-sm text-gray-500 mb-4">Ticket # will be auto-generated</p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date Reported" type="date" value={forms['it-requests'].date_reported} onChange={e => updateForm('it-requests', 'date_reported', e.target.value)} />
                    <InputField label="Urgency Level" value={forms['it-requests'].urgency} onChange={e => updateForm('it-requests', 'urgency', e.target.value)} options={['Low', 'Medium', 'High', 'Critical']} />
                    <InputField label="Requester Name" value={forms['it-requests'].requester_name} onChange={e => updateForm('it-requests', 'requester_name', e.target.value)} />
                    <InputField label="Device / System" value={forms['it-requests'].device_system} onChange={e => updateForm('it-requests', 'device_system', e.target.value)} />
                    <InputField label="Contact Method" value={forms['it-requests'].best_contact_method} onChange={e => updateForm('it-requests', 'best_contact_method', e.target.value)} options={['Phone', 'Email', 'Text']} />
                    <InputField label="Contact Time" value={forms['it-requests'].best_contact_time} onChange={e => updateForm('it-requests', 'best_contact_time', e.target.value)} />
                  </div>
                  <div className="mt-4"><InputField label="Description of Issue" large value={forms['it-requests'].description_of_issue} onChange={e => updateForm('it-requests', 'description_of_issue', e.target.value)} placeholder="Describe the issue in detail..." /></div>
                </div>
              )}

              {activeModule === 'billing-inquiry' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Patient Accounting Inquiry</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Patient Name" value={forms['billing-inquiry'].patient_name} onChange={e => updateForm('billing-inquiry', 'patient_name', e.target.value)} />
                    <InputField label="Chart Number" value={forms['billing-inquiry'].chart_number} onChange={e => updateForm('billing-inquiry', 'chart_number', e.target.value)} />
                    <InputField label="Date of Request" type="date" value={forms['billing-inquiry'].date_of_request} onChange={e => updateForm('billing-inquiry', 'date_of_request', e.target.value)} />
                    <InputField label="Type of Inquiry" value={forms['billing-inquiry'].inquiry_type} onChange={e => updateForm('billing-inquiry', 'inquiry_type', e.target.value)} options={INQUIRY_TYPES} />
                    <InputField label="Amount in Question" prefix="$" value={forms['billing-inquiry'].amount_in_question} onChange={e => updateForm('billing-inquiry', 'amount_in_question', e.target.value)} />
                    <InputField label="Contact Method" value={forms['billing-inquiry'].best_contact_method} onChange={e => updateForm('billing-inquiry', 'best_contact_method', e.target.value)} options={CONTACT_METHODS} />
                  </div>
                  <div className="mt-4"><InputField label="Description" large value={forms['billing-inquiry'].description} onChange={e => updateForm('billing-inquiry', 'description', e.target.value)} /></div>
                </div>
              )}

              {activeModule === 'bills-payment' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Bills Payment Log</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Bill Status" value={forms['bills-payment'].bill_status} onChange={e => updateForm('bills-payment', 'bill_status', e.target.value)} options={['Pending', 'Approved', 'Paid']} />
                    <InputField label="Date" type="date" value={forms['bills-payment'].bill_date} onChange={e => updateForm('bills-payment', 'bill_date', e.target.value)} />
                    <InputField label="Vendor" value={forms['bills-payment'].vendor} onChange={e => updateForm('bills-payment', 'vendor', e.target.value)} />
                    <InputField label="Amount" prefix="$" value={forms['bills-payment'].amount} onChange={e => updateForm('bills-payment', 'amount', e.target.value)} />
                    <InputField label="Due Date" type="date" value={forms['bills-payment'].due_date} onChange={e => updateForm('bills-payment', 'due_date', e.target.value)} />
                    <InputField label="Manager Initials" value={forms['bills-payment'].manager_initials} onChange={e => updateForm('bills-payment', 'manager_initials', e.target.value)} />
                  </div>
                  <div className="mt-4"><InputField label="Description" large value={forms['bills-payment'].description} onChange={e => updateForm('bills-payment', 'description', e.target.value)} /></div>
                </div>
              )}

              {activeModule === 'order-requests' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Order Invoice Log</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date Entered" type="date" value={forms['order-requests'].date_entered} onChange={e => updateForm('order-requests', 'date_entered', e.target.value)} />
                    <InputField label="Vendor" value={forms['order-requests'].vendor} onChange={e => updateForm('order-requests', 'vendor', e.target.value)} />
                    <InputField label="Invoice Number" value={forms['order-requests'].invoice_number} onChange={e => updateForm('order-requests', 'invoice_number', e.target.value)} />
                    <InputField label="Amount" prefix="$" value={forms['order-requests'].amount} onChange={e => updateForm('order-requests', 'amount', e.target.value)} />
                    <InputField label="Due Date" type="date" value={forms['order-requests'].due_date} onChange={e => updateForm('order-requests', 'due_date', e.target.value)} />
                  </div>
                  <div className="mt-4"><InputField label="Notes" large value={forms['order-requests'].notes} onChange={e => updateForm('order-requests', 'notes', e.target.value)} /></div>
                </div>
              )}

              {activeModule === 'refund-requests' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Patient Refund Request Log</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Patient Name" value={forms['refund-requests'].patient_name} onChange={e => updateForm('refund-requests', 'patient_name', e.target.value)} />
                    <InputField label="Chart Number" value={forms['refund-requests'].chart_number} onChange={e => updateForm('refund-requests', 'chart_number', e.target.value)} />
                    <InputField label="Date of Request" type="date" value={forms['refund-requests'].date_of_request} onChange={e => updateForm('refund-requests', 'date_of_request', e.target.value)} />
                    <InputField label="Type" value={forms['refund-requests'].type} onChange={e => updateForm('refund-requests', 'type', e.target.value)} options={REFUND_TYPES} />
                    <InputField label="Amount Requested" prefix="$" value={forms['refund-requests'].amount_requested} onChange={e => updateForm('refund-requests', 'amount_requested', e.target.value)} />
                    <InputField label="Contact Method" value={forms['refund-requests'].best_contact_method} onChange={e => updateForm('refund-requests', 'best_contact_method', e.target.value)} options={CONTACT_METHODS} />
                  </div>
                  <div className="mt-4"><InputField label="Description" large value={forms['refund-requests'].description} onChange={e => updateForm('refund-requests', 'description', e.target.value)} /></div>
                </div>
              )}

              <button onClick={() => saveEntry(activeModule)} disabled={saving} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Entry'}
              </button>
            </div>
          )}

          {/* History View - Staff */}
          {!isAdmin && view === 'history' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={staffRecordSearch} onChange={e => { setStaffRecordSearch(e.target.value); setStaffCurrentPage(1); }} placeholder="Search records..." className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Sort:</span>
                    <select value={staffSortOrder} onChange={e => setStaffSortOrder(e.target.value)} className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none bg-white">
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-700">{getStaffPaginatedEntries().length}</span> of <span className="font-semibold text-gray-700">{getStaffEntries().length}</span> records</p>
                  <span className={`text-sm font-medium px-3 py-1 rounded-lg ${currentColors?.light} ${currentColors?.text}`}>{currentModule?.name}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="font-semibold mb-4 text-gray-800">Your Entries</h2>
                {getStaffEntries().length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-gray-400" /></div>
                    <p className="text-gray-500">{staffRecordSearch ? 'No records match your search' : 'No entries yet'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getStaffPaginatedEntries().map(e => {
                      const canEdit = canEditRecord(e.created_at);
                      let bgClass = `${currentColors?.bg} border ${currentColors?.border}`;
                      if (activeModule === 'daily-recon') {
                        if (e.status === 'Accounted') bgClass = 'bg-emerald-50 border-2 border-emerald-300';
                        else if (e.status === 'Rejected') bgClass = 'bg-red-50 border-2 border-red-300';
                        else bgClass = 'bg-amber-50 border-2 border-amber-300';
                      }
                      return (
                        <div key={e.id} className={`p-4 rounded-xl ${bgClass}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800">{e.ticket_number ? `IT-${e.ticket_number}` : e.patient_name || e.vendor || e.recon_date || new Date(e.created_at).toLocaleDateString()}</p>
                                <StatusBadge status={e.status || (activeModule === 'daily-recon' ? 'Pending' : e.status)} />
                                {!canEdit && <Lock className="w-4 h-4 text-gray-400" title="Locked (past Friday cutoff)" />}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{new Date(e.created_at).toLocaleDateString()}</p>
                              {activeModule === 'daily-recon' && e.total_collected && (<p className="text-lg font-bold text-emerald-600 mt-2">${Number(e.total_collected).toFixed(2)}</p>)}
                              {activeModule !== 'daily-recon' && (e.amount || e.amount_requested || e.amount_in_question) && (<p className="text-lg font-bold text-emerald-600 mt-2">${Number(e.amount || e.amount_requested || e.amount_in_question).toFixed(2)}</p>)}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setViewingEntry(e)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {getStaffEntries().length > 0 && staffRecordsPerPage !== 'all' && getStaffTotalPages() > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {staffCurrentPage} of {getStaffTotalPages()}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setStaffCurrentPage(1)} disabled={staffCurrentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">First</button>
                      <button onClick={() => setStaffCurrentPage(p => Math.max(p - 1, 1))} disabled={staffCurrentPage === 1} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Prev</button>
                      <span className="px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">{staffCurrentPage}</span>
                      <button onClick={() => setStaffCurrentPage(p => Math.min(p + 1, getStaffTotalPages()))} disabled={staffCurrentPage === getStaffTotalPages()} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Next</button>
                      <button onClick={() => setStaffCurrentPage(getStaffTotalPages())} disabled={staffCurrentPage === getStaffTotalPages()} className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">Last</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
