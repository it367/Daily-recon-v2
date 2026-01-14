// Clinic Tracking System - DEMO VERSION

'use client';
import { useState, useEffect } from 'react';
import { DollarSign, FileText, Building2, Loader2, LogOut, User, Upload, X, File, Shield, Receipt, CreditCard, Package, RefreshCw, Monitor, Menu, Eye, EyeOff, Edit3, Users, Plus, Trash2, Lock, Download, Settings, AlertCircle } from 'lucide-react';

const DEMO_LOCATIONS = [
  { id: 'loc-1', name: 'HHDS', is_active: true },
  { id: 'loc-2', name: 'Honolulu', is_active: true },
  { id: 'loc-3', name: 'Kailua', is_active: true },
  { id: 'loc-4', name: 'Kapolei', is_active: true },
  { id: 'loc-5', name: 'Lihue', is_active: true },
  { id: 'loc-6', name: 'Ortho', is_active: true },
  { id: 'loc-7', name: 'OS', is_active: true },
  { id: 'loc-8', name: 'Pearl City', is_active: true },
];

const DEMO_USERS = [
  { id: 'user-1', name: 'Admin User', email: 'admin', password_hash: 'admin123', role: 'super_admin', is_active: true, locations: DEMO_LOCATIONS },
  { id: 'user-2', name: 'Finance Admin', email: 'finance', password_hash: 'finance123', role: 'finance_admin', is_active: true, locations: DEMO_LOCATIONS },
  { id: 'user-3', name: 'Sarah Johnson', email: 'sarah', password_hash: 'staff123', role: 'staff', is_active: true, locations: [DEMO_LOCATIONS[0], DEMO_LOCATIONS[1]] },
  { id: 'user-4', name: 'Mike Chen', email: 'mike', password_hash: 'staff123', role: 'staff', is_active: true, locations: [DEMO_LOCATIONS[2], DEMO_LOCATIONS[3]] },
  { id: 'user-5', name: 'Emily Davis', email: 'emily', password_hash: 'staff123', role: 'staff', is_active: true, locations: [DEMO_LOCATIONS[4], DEMO_LOCATIONS[5]] },
];

const generateDemoData = () => {
  const dailyRecon = [];
  const billingInquiries = [];
  const billsPayment = [];
  const orderRequests = [];
  const refundRequests = [];
  const itRequests = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(); date.setDate(date.getDate() - i);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    const statuses = ['Pending', 'Accounted', 'Rejected'];
    dailyRecon.push({
      id: `recon-${i}`, recon_date: date.toISOString().split('T')[0], location_id: loc.id, locations: loc,
      cash: Math.floor(Math.random() * 2000) + 500, credit_card: Math.floor(Math.random() * 3000) + 1000,
      checks_otc: Math.floor(Math.random() * 500), insurance_checks: Math.floor(Math.random() * 1500),
      care_credit: Math.floor(Math.random() * 800), vcc: Math.floor(Math.random() * 300), efts: Math.floor(Math.random() * 600),
      deposit_cash: i % 3 === 0 ? Math.floor(Math.random() * 2000) : 0, deposit_credit_card: i % 3 === 0 ? Math.floor(Math.random() * 3000) : 0,
      deposit_checks: i % 3 === 0 ? Math.floor(Math.random() * 500) : 0, deposit_insurance: 0, deposit_care_credit: 0, deposit_vcc: 0, deposit_efts: 0,
      notes: i % 2 === 0 ? 'End of day reconciliation complete' : '', status: statuses[i % 3],
      created_at: date.toISOString(), created_by: DEMO_USERS[2].id, creator: DEMO_USERS[2],
      get total_collected() { return this.cash + this.credit_card + this.checks_otc + this.insurance_checks + this.care_credit + this.vcc + this.efts; },
      get total_deposit() { return this.deposit_cash + this.deposit_credit_card + this.deposit_checks; }
    });
  }

  const patients = ['Emma Wilson', 'Liam Smith', 'Olivia Brown', 'Noah Davis', 'Ava Martinez'];
  const inquiryTypes = ['Refund', 'Balance', 'Insurance', 'Payment Plan', 'Other'];
  for (let i = 0; i < 8; i++) {
    const date = new Date(); date.setDate(date.getDate() - i * 2);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    billingInquiries.push({
      id: `billing-${i}`, patient_name: patients[i % patients.length], chart_number: `CH${10000 + i}`,
      parent_name: `Parent of ${patients[i % patients.length]}`, date_of_request: date.toISOString().split('T')[0],
      inquiry_type: inquiryTypes[i % inquiryTypes.length], description: 'Patient inquiry regarding account balance.',
      amount_in_question: Math.floor(Math.random() * 500) + 100, best_contact_method: ['Phone', 'Email', 'Text'][i % 3],
      best_contact_time: '10:00 AM - 2:00 PM', status: ['Pending', 'In Progress', 'Resolved'][i % 3],
      location_id: loc.id, locations: loc, created_at: date.toISOString(), creator: DEMO_USERS[3]
    });
  }

  const vendors = ['Hawaiian Tel', 'HECO', 'Office Depot', 'Dental Supply Co', 'IT Services LLC'];
  for (let i = 0; i < 6; i++) {
    const date = new Date(); date.setDate(date.getDate() - i * 3);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    billsPayment.push({
      id: `bill-${i}`, bill_status: ['Pending', 'Approved', 'Paid'][i % 3], bill_date: date.toISOString().split('T')[0],
      vendor: vendors[i % vendors.length], description: `Monthly service invoice from ${vendors[i % vendors.length]}`,
      amount: Math.floor(Math.random() * 2000) + 200, due_date: new Date(date.getTime() + 30*24*60*60*1000).toISOString().split('T')[0],
      manager_initials: 'MJ', ap_reviewed: i % 2 === 0 ? 'Yes' : 'No', location_id: loc.id, locations: loc,
      created_at: date.toISOString(), creator: DEMO_USERS[4]
    });
  }

  for (let i = 0; i < 5; i++) {
    const date = new Date(); date.setDate(date.getDate() - i * 4);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    orderRequests.push({
      id: `order-${i}`, date_entered: date.toISOString().split('T')[0], vendor: vendors[i % vendors.length],
      invoice_number: `INV-${20240000 + i}`, invoice_date: date.toISOString().split('T')[0],
      due_date: new Date(date.getTime() + 45*24*60*60*1000).toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 3000) + 500, entered_by: DEMO_USERS[3].name, notes: 'Regular supply order',
      location_id: loc.id, locations: loc, created_at: date.toISOString(), creator: DEMO_USERS[3]
    });
  }

  for (let i = 0; i < 4; i++) {
    const date = new Date(); date.setDate(date.getDate() - i * 5);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    refundRequests.push({
      id: `refund-${i}`, patient_name: patients[i % patients.length], chart_number: `CH${10000 + i}`,
      parent_name: `Parent of ${patients[i % patients.length]}`, rp_address: '123 Main St, Honolulu, HI 96801',
      date_of_request: date.toISOString().split('T')[0], type: ['Refund', 'Credit', 'Adjustment'][i % 3],
      description: 'Overpayment refund request', amount_requested: Math.floor(Math.random() * 300) + 50,
      best_contact_method: ['Phone', 'Email', 'Text'][i % 3], eassist_audited: i % 2 === 0,
      status: ['Pending', 'Approved', 'Completed', 'Denied'][i % 4], location_id: loc.id, locations: loc,
      created_at: date.toISOString(), creator: DEMO_USERS[4]
    });
  }

  const devices = ['Computer', 'Printer', 'Network', 'Phone System', 'Software'];
  for (let i = 0; i < 6; i++) {
    const date = new Date(); date.setDate(date.getDate() - i * 2);
    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    itRequests.push({
      id: `it-${i}`, ticket_number: 1000 + i, date_reported: date.toISOString().split('T')[0],
      urgency: ['Low', 'Medium', 'High', 'Critical'][i % 4], requester_name: DEMO_USERS[(i % 3) + 2].name,
      device_system: devices[i % devices.length], description_of_issue: `${devices[i % devices.length]} not working properly`,
      best_contact_method: ['Phone', 'Email', 'Text'][i % 3], best_contact_time: '9:00 AM - 5:00 PM',
      status: ['Open', 'In Progress', 'Resolved', 'Closed'][i % 4], resolution_notes: i % 4 >= 2 ? 'Issue resolved' : '',
      location_id: loc.id, locations: loc, created_at: date.toISOString(), creator: DEMO_USERS[(i % 3) + 2]
    });
  }

  return { 'daily-recon': dailyRecon, 'billing-inquiry': billingInquiries, 'bills-payment': billsPayment, 'order-requests': orderRequests, 'refund-requests': refundRequests, 'it-requests': itRequests };
};

const MODULES = [
  { id: 'daily-recon', name: 'Daily Recon', icon: DollarSign, color: 'emerald', table: 'daily_recon' },
  { id: 'billing-inquiry', name: 'Billing Inquiry', icon: Receipt, color: 'blue', table: 'billing_inquiries' },
  { id: 'bills-payment', name: 'Bills Payment', icon: CreditCard, color: 'violet', table: 'bills_payment' },
  { id: 'order-requests', name: 'Order Requests', icon: Package, color: 'amber', table: 'order_requests' },
  { id: 'refund-requests', name: 'Refund Requests', icon: RefreshCw, color: 'rose', table: 'refund_requests' },
];

const SUPPORT_MODULES = [{ id: 'it-requests', name: 'IT Requests', icon: Monitor, color: 'cyan', table: 'it_requests' }];
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

function PasswordField({ label, value, onChange, placeholder = '', disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className={`flex items-center border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 ${disabled ? 'bg-gray-100' : ''}`}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} disabled={disabled} className="w-full p-2.5 rounded-xl outline-none bg-transparent" placeholder={placeholder} />
        <button type="button" onClick={() => setShow(!show)} className="px-3 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder = '', prefix, options, large, disabled }) {
  if (options) {
    return (
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
        <select value={value} onChange={onChange} disabled={disabled} className="w-full p-2.5 border-2 border-gray-200 rounded-xl outline-none hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white">
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
        <textarea value={value} onChange={onChange} disabled={disabled} rows={3} className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none bg-white" placeholder={placeholder} />
      </div>
    );
  }
  const handleInput = (e) => {
    const val = e.target.value;
    if (prefix === '$') {
      if (val === '' || /^\d*\.?\d*$/.test(val)) onChange(e);
    } else onChange(e);
  };
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className={`flex items-center border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 ${disabled ? 'bg-gray-100' : ''}`}>
        {prefix && <span className="pl-3 text-gray-400 font-medium">{prefix}</span>}
        <input type={type} value={value} onChange={handleInput} disabled={disabled} className="w-full p-2.5 rounded-xl outline-none bg-transparent" placeholder={placeholder} />
      </div>
    </div>
  );
}

function FileUpload({ label, files, onFilesChange, onViewFile, disabled }) {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({ file: f, name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), isNew: true }));
    onFilesChange([...files, ...newFiles]);
  };
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition-all ${disabled ? 'opacity-50' : ''}`}>
        <label className={`flex flex-col items-center justify-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-gray-500 hover:text-blue-600`}>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Upload className="w-5 h-5 text-blue-600" /></div>
          <span className="text-sm font-medium">Click to upload files</span>
          <input type="file" multiple onChange={handleFileChange} disabled={disabled} className="hidden" />
        </label>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border">
                <div className="flex items-center gap-2 truncate flex-1">
                  <File className="w-4 h-4 text-blue-600" />
                  <span className="truncate text-sm text-gray-700">{file.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {file.url && <button onClick={() => onViewFile(file)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>}
                  {!disabled && <button onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>}
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
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h3 className="font-semibold truncate text-gray-800">{file.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {isImage ? <img src={file.url} alt={file.name} className="max-w-full rounded-xl mx-auto" /> : (
            <div className="text-center py-12 text-gray-500">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Preview not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    'Open': 'bg-red-100 text-red-700', 'In Progress': 'bg-amber-100 text-amber-700', 'Resolved': 'bg-emerald-100 text-emerald-700',
    'Closed': 'bg-gray-100 text-gray-600', 'Pending': 'bg-amber-100 text-amber-700', 'Approved': 'bg-blue-100 text-blue-700',
    'Completed': 'bg-emerald-100 text-emerald-700', 'Paid': 'bg-emerald-100 text-emerald-700', 'Denied': 'bg-red-100 text-red-700',
    'Accounted': 'bg-emerald-100 text-emerald-700', 'Rejected': 'bg-red-100 text-red-700'
  };
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status || 'Pending'}</span>;
}

function EntryPreview({ entry, module, onClose, colors }) {
  if (!entry) return null;
  const fmt = (val) => val ? `$${Number(val).toFixed(2)}` : '$0.00';
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] w-full overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className={`flex justify-between items-center p-4 border-b sticky top-0 ${colors?.bg || 'bg-gray-50'}`}>
          <div><h3 className="font-semibold text-gray-800">Entry Details</h3><p className="text-sm text-gray-500">{module?.name}</p></div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={entry.status || 'Pending'} />
            {entry.locations?.name && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{entry.locations.name}</span>}
          </div>
          {module?.id === 'daily-recon' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-emerald-50 rounded-xl">
                <h4 className="col-span-2 font-semibold text-emerald-800">Cash Can Entries</h4>
                <div><span className="text-gray-600 text-sm">Cash:</span> <span className="font-medium">{fmt(entry.cash)}</span></div>
                <div><span className="text-gray-600 text-sm">Credit Card:</span> <span className="font-medium">{fmt(entry.credit_card)}</span></div>
                <div><span className="text-gray-600 text-sm">Checks:</span> <span className="font-medium">{fmt(entry.checks_otc)}</span></div>
                <div><span className="text-gray-600 text-sm">Insurance:</span> <span className="font-medium">{fmt(entry.insurance_checks)}</span></div>
                <div className="col-span-2 pt-2 border-t border-emerald-200"><span className="text-gray-600">Total:</span> <span className="font-bold text-emerald-700 text-lg">{fmt(entry.total_collected)}</span></div>
              </div>
              {(entry.deposit_cash > 0 || entry.status === 'Accounted') && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-xl">
                  <h4 className="col-span-2 font-semibold text-blue-800">Bank Deposit</h4>
                  <div><span className="text-gray-600 text-sm">Cash:</span> <span className="font-medium">{fmt(entry.deposit_cash)}</span></div>
                  <div><span className="text-gray-600 text-sm">Credit Card:</span> <span className="font-medium">{fmt(entry.deposit_credit_card)}</span></div>
                  <div><span className="text-gray-600 text-sm">Checks:</span> <span className="font-medium">{fmt(entry.deposit_checks)}</span></div>
                  <div className="col-span-2 pt-2 border-t border-blue-200"><span className="text-gray-600">Total:</span> <span className="font-bold text-blue-700 text-lg">{fmt(entry.total_deposit)}</span></div>
                </div>
              )}
            </div>
          )}
          {module?.id === 'billing-inquiry' && (
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-600 text-sm block">Patient</span><span className="font-medium">{entry.patient_name}</span></div>
              <div><span className="text-gray-600 text-sm block">Chart #</span><span className="font-medium">{entry.chart_number}</span></div>
              <div><span className="text-gray-600 text-sm block">Type</span><span className="font-medium">{entry.inquiry_type}</span></div>
              <div><span className="text-gray-600 text-sm block">Amount</span><span className="font-medium text-emerald-600">{fmt(entry.amount_in_question)}</span></div>
            </div>
          )}
          {module?.id === 'it-requests' && (
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-gray-600 text-sm block">Ticket #</span><span className="font-medium text-cyan-600">IT-{entry.ticket_number}</span></div>
              <div><span className="text-gray-600 text-sm block">Urgency</span><span className={`font-medium ${entry.urgency === 'Critical' ? 'text-red-600' : ''}`}>{entry.urgency}</span></div>
              <div><span className="text-gray-600 text-sm block">Device</span><span className="font-medium">{entry.device_system}</span></div>
              <div><span className="text-gray-600 text-sm block">Requester</span><span className="font-medium">{entry.requester_name}</span></div>
              <div className="col-span-2"><span className="text-gray-600 text-sm block">Issue</span><p className="bg-gray-50 p-3 rounded-lg mt-1">{entry.description_of_issue}</p></div>
            </div>
          )}
          {entry.creator?.name && <p className="text-sm text-gray-500 pt-4 border-t">Created by: {entry.creator.name}</p>}
        </div>
        <div className="p-4 border-t bg-gray-50"><button onClick={onClose} className="w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium">Close</button></div>
      </div>
    </div>
  );
}

export default function ClinicSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [locations] = useState(DEMO_LOCATIONS);
  const [users, setUsers] = useState(DEMO_USERS);
  const [activeModule, setActiveModule] = useState('daily-recon');
  const [view, setView] = useState('entry');
  const [adminView, setAdminView] = useState('records');
  const [moduleData, setModuleData] = useState(generateDemoData());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewingFile, setViewingFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminLocation, setAdminLocation] = useState('all');
  const [editingRecon, setEditingRecon] = useState(null);
  const [reconForm, setReconForm] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [editingStaffEntry, setEditingStaffEntry] = useState(null);
  const [staffEditForm, setStaffEditForm] = useState({});
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff', locations: [] });
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
  const [nameForm, setNameForm] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [forms, setForms] = useState({
    'daily-recon': { recon_date: today, cash: '', credit_card: '', checks_otc: '', insurance_checks: '', care_credit: '', vcc: '', efts: '', notes: '' },
    'billing-inquiry': { patient_name: '', chart_number: '', parent_name: '', date_of_request: today, inquiry_type: '', description: '', amount_in_question: '', best_contact_method: '', status: 'Pending' },
    'bills-payment': { bill_status: 'Pending', bill_date: today, vendor: '', description: '', amount: '', due_date: '', manager_initials: '' },
    'order-requests': { date_entered: today, vendor: '', invoice_number: '', invoice_date: '', due_date: '', amount: '', notes: '' },
    'refund-requests': { patient_name: '', chart_number: '', parent_name: '', date_of_request: today, type: '', description: '', amount_requested: '', best_contact_method: '', status: 'Pending' },
    'it-requests': { date_reported: today, urgency: '', requester_name: '', device_system: '', description_of_issue: '', best_contact_method: '', status: 'Open' }
  });
  const [files, setFiles] = useState({
    'daily-recon': { documents: [] }, 'billing-inquiry': { documentation: [] }, 'bills-payment': { documentation: [] },
    'order-requests': { orderInvoices: [] }, 'refund-requests': { documentation: [] }, 'it-requests': { documentation: [] }
  });

  useEffect(() => { if (currentUser) setNameForm(currentUser.name || ''); }, [currentUser]);

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'finance_admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const showMessage = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: '', text: '' }), 4000); };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) { showMessage('error', 'Please enter email and password'); return; }
    setLoginLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.password_hash === loginPassword && u.is_active);
      if (!user) { showMessage('error', 'Invalid email or password'); setLoginLoading(false); return; }
      setCurrentUser(user); setUserLocations(user.locations);
      if (user.locations.length === 1) setSelectedLocation(user.locations[0].name);
      showMessage('success', '✓ Login successful!'); setLoginLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setCurrentUser(null); setUserLocations([]); setSelectedLocation(null); setLoginEmail(''); setLoginPassword('');
    setView('entry'); setAdminView('records'); setPwdForm({ current: '', new: '', confirm: '' });
  };

  const updateForm = (module, field, value) => setForms(prev => ({ ...prev, [module]: { ...prev[module], [field]: value } }));
  const updateFiles = (module, field, newFiles) => setFiles(prev => ({ ...prev, [module]: { ...prev[module], [field]: newFiles } }));

  const saveEntry = (moduleId) => {
    setSaving(true);
    setTimeout(() => {
      const form = forms[moduleId];
      const loc = locations.find(l => l.name === selectedLocation);
      if (!loc) { showMessage('error', 'Please select a location'); setSaving(false); return; }
      const newEntry = { id: `${moduleId}-${Date.now()}`, ...form, location_id: loc.id, locations: loc, created_at: new Date().toISOString(), creator: currentUser, status: form.status || 'Pending' };
      if (moduleId === 'daily-recon') {
        newEntry.cash = parseFloat(form.cash) || 0; newEntry.credit_card = parseFloat(form.credit_card) || 0;
        newEntry.checks_otc = parseFloat(form.checks_otc) || 0; newEntry.insurance_checks = parseFloat(form.insurance_checks) || 0;
        newEntry.care_credit = parseFloat(form.care_credit) || 0; newEntry.vcc = parseFloat(form.vcc) || 0; newEntry.efts = parseFloat(form.efts) || 0;
        newEntry.total_collected = newEntry.cash + newEntry.credit_card + newEntry.checks_otc + newEntry.insurance_checks + newEntry.care_credit + newEntry.vcc + newEntry.efts;
        newEntry.deposit_cash = 0; newEntry.deposit_credit_card = 0; newEntry.deposit_checks = 0; newEntry.total_deposit = 0;
      }
      if (moduleId === 'it-requests') newEntry.ticket_number = 1000 + (moduleData['it-requests']?.length || 0) + 1;
      setModuleData(prev => ({ ...prev, [moduleId]: [newEntry, ...(prev[moduleId] || [])] }));
      const resetForm = { ...forms[moduleId] }; Object.keys(resetForm).forEach(k => { if (!k.includes('date') && !k.includes('status')) resetForm[k] = ''; });
      setForms(prev => ({ ...prev, [moduleId]: resetForm }));
      setFiles(prev => ({ ...prev, [moduleId]: Object.fromEntries(Object.entries(files[moduleId]).map(([k]) => [k, []])) }));
      showMessage('success', '✓ Entry saved!'); setSaving(false);
    }, 500);
  };

  const startEditingRecon = (entry) => {
    setEditingRecon(entry.id);
    setReconForm(prev => ({ ...prev, [entry.id]: { deposit_cash: entry.deposit_cash || '', deposit_credit_card: entry.deposit_credit_card || '', deposit_checks: entry.deposit_checks || '', status: entry.status || 'Pending' } }));
  };
  const updateReconForm = (entryId, field, value) => setReconForm(prev => ({ ...prev, [entryId]: { ...prev[entryId], [field]: value } }));
  const updateDailyRecon = (entryId) => {
    const form = reconForm[entryId]; if (!form) return;
    setModuleData(prev => ({ ...prev, 'daily-recon': prev['daily-recon'].map(e => e.id === entryId ? { ...e, deposit_cash: parseFloat(form.deposit_cash) || 0, deposit_credit_card: parseFloat(form.deposit_credit_card) || 0, deposit_checks: parseFloat(form.deposit_checks) || 0, status: form.status, get total_deposit() { return this.deposit_cash + this.deposit_credit_card + this.deposit_checks; } } : e) }));
    showMessage('success', '✓ Updated!'); setEditingRecon(null);
  };

  const updateEntryStatus = (moduleId, entryId, newStatus, extra = {}) => {
    setModuleData(prev => ({ ...prev, [moduleId]: prev[moduleId].map(e => e.id === entryId ? { ...e, status: newStatus, ...extra } : e) }));
    showMessage('success', '✓ Status updated!'); setEditingStatus(null);
  };

  const startEditingStaffEntry = (entry) => {
    setEditingStaffEntry(entry.id);
    if (activeModule === 'daily-recon') setStaffEditForm({ recon_date: entry.recon_date || '', cash: entry.cash || '', credit_card: entry.credit_card || '', checks_otc: entry.checks_otc || '', insurance_checks: entry.insurance_checks || '', care_credit: entry.care_credit || '', vcc: entry.vcc || '', efts: entry.efts || '', notes: entry.notes || '' });
    else if (activeModule === 'billing-inquiry') setStaffEditForm({ patient_name: entry.patient_name || '', chart_number: entry.chart_number || '', date_of_request: entry.date_of_request || '', inquiry_type: entry.inquiry_type || '', description: entry.description || '', amount_in_question: entry.amount_in_question || '', best_contact_method: entry.best_contact_method || '' });
    else if (activeModule === 'bills-payment') setStaffEditForm({ bill_status: entry.bill_status || 'Pending', bill_date: entry.bill_date || '', vendor: entry.vendor || '', description: entry.description || '', amount: entry.amount || '', due_date: entry.due_date || '' });
    else if (activeModule === 'order-requests') setStaffEditForm({ date_entered: entry.date_entered || '', vendor: entry.vendor || '', invoice_number: entry.invoice_number || '', amount: entry.amount || '', due_date: entry.due_date || '', notes: entry.notes || '' });
    else if (activeModule === 'refund-requests') setStaffEditForm({ patient_name: entry.patient_name || '', chart_number: entry.chart_number || '', date_of_request: entry.date_of_request || '', type: entry.type || '', description: entry.description || '', amount_requested: entry.amount_requested || '', best_contact_method: entry.best_contact_method || '' });
    else if (activeModule === 'it-requests') setStaffEditForm({ date_reported: entry.date_reported || '', urgency: entry.urgency || '', requester_name: entry.requester_name || '', device_system: entry.device_system || '', description_of_issue: entry.description_of_issue || '', best_contact_method: entry.best_contact_method || '' });
  };
  const updateStaffEditForm = (field, value) => setStaffEditForm(prev => ({ ...prev, [field]: value }));
  const saveStaffEntryUpdate = () => {
    if (!editingStaffEntry) return; setSaving(true);
    setTimeout(() => {
      setModuleData(prev => ({ ...prev, [activeModule]: prev[activeModule].map(e => {
        if (e.id !== editingStaffEntry) return e;
        let updated = { ...e, ...staffEditForm };
        if (activeModule === 'daily-recon') {
          updated.cash = parseFloat(staffEditForm.cash) || 0; updated.credit_card = parseFloat(staffEditForm.credit_card) || 0;
          updated.checks_otc = parseFloat(staffEditForm.checks_otc) || 0; updated.insurance_checks = parseFloat(staffEditForm.insurance_checks) || 0;
          updated.care_credit = parseFloat(staffEditForm.care_credit) || 0; updated.vcc = parseFloat(staffEditForm.vcc) || 0; updated.efts = parseFloat(staffEditForm.efts) || 0;
          updated.total_collected = updated.cash + updated.credit_card + updated.checks_otc + updated.insurance_checks + updated.care_credit + updated.vcc + updated.efts;
        }
        return updated;
      }) }));
      showMessage('success', '✓ Updated!'); setEditingStaffEntry(null); setStaffEditForm({}); setSaving(false);
    }, 300);
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) { showMessage('error', 'Fill all fields'); return; }
    const created = { id: `user-${Date.now()}`, ...newUser, password_hash: newUser.password, is_active: true, locations: newUser.role === 'staff' ? locations.filter(l => newUser.locations.includes(l.id)) : DEMO_LOCATIONS };
    setUsers(prev => [...prev, created]); setNewUser({ name: '', email: '', password: '', role: 'staff', locations: [] }); setShowAddUser(false); showMessage('success', '✓ User created!');
  };
  const updateUser = () => {
    if (!editingUser.name || !editingUser.email) { showMessage('error', 'Fill required fields'); return; }
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name: editingUser.name, email: editingUser.email, role: editingUser.role, password_hash: editingUser.newPassword || u.password_hash, locations: editingUser.role === 'staff' ? locations.filter(l => editingUser.locationIds?.includes(l.id)) : DEMO_LOCATIONS } : u));
    setEditingUser(null); showMessage('success', '✓ User updated!');
  };
  const deleteUser = (id) => { if (window.confirm('Delete this user?')) { setUsers(prev => prev.filter(u => u.id !== id)); showMessage('success', '✓ User deleted'); } };
  const toggleUserLocation = (locId, isEditing) => {
    if (isEditing) { const locs = editingUser.locationIds || []; setEditingUser({ ...editingUser, locationIds: locs.includes(locId) ? locs.filter(l => l !== locId) : [...locs, locId] }); }
    else { const locs = newUser.locations; setNewUser({ ...newUser, locations: locs.includes(locId) ? locs.filter(l => l !== locId) : [...locs, locId] }); }
  };

  const getModuleEntries = () => {
    let data = moduleData[activeModule] || [];
    if (isAdmin && adminLocation !== 'all') data = data.filter(e => e.locations?.name === adminLocation);
    if (!isAdmin && selectedLocation) data = data.filter(e => e.locations?.name === selectedLocation);
    return [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const currentColors = MODULE_COLORS[activeModule];
  const currentModule = ALL_MODULES.find(m => m.id === activeModule);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Building2 className="w-10 h-10 text-white" /></div>
            <h1 className="text-2xl font-bold text-gray-800">CMS - KidShine Hawaii</h1>
            <p className="text-gray-500 text-sm mt-1">Clinic Management Portal</p>
            <p className="text-amber-600 text-xs mt-2 font-medium bg-amber-50 px-3 py-1 rounded-full inline-block">🎯 DEMO MODE</p>
          </div>
          {message.text && <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}><AlertCircle className="w-4 h-4" />{message.text}</div>}
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label><input type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full p-3.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400" placeholder="Enter email" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-blue-400">
                <input type={showLoginPwd ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="w-full p-3.5 rounded-xl outline-none" placeholder="Enter password" />
                <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)} className="px-4 text-gray-400 hover:text-gray-600">{showLoginPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loginLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:shadow-lg disabled:opacity-50">{loginLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Login →'}</button>
            <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs font-semibold text-gray-600 mb-2">Demo Accounts:</p><div className="text-xs text-gray-500 space-y-1"><p><b>Admin:</b> admin / admin123</p><p><b>Staff:</b> sarah / staff123</p></div></div>
            <p className="text-xs text-center text-gray-400">DEMO Version 0.19</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin && !selectedLocation && userLocations.length > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><User className="w-8 h-8 text-white" /></div>
            <h1 className="text-xl font-bold text-gray-800">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-500">Select your location</p>
          </div>
          <div className="space-y-2">
            {userLocations.map(loc => (
              <button key={loc.id} onClick={() => setSelectedLocation(loc.name)} className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:bg-blue-50 hover:border-blue-300 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600" /></div>
                <span className="font-medium text-gray-700">{loc.name}</span>
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="w-full mt-6 py-2.5 text-gray-500 hover:text-gray-700">← Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex">
      <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />
      <EntryPreview entry={viewingEntry} module={currentModule} onClose={() => setViewingEntry(null)} colors={currentColors} />

      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`p-5 ${isSuperAdmin ? 'bg-gradient-to-r from-rose-600 to-pink-600' : isAdmin ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">{isAdmin ? <Shield className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}</div>
            <div className="text-white"><p className="font-semibold">{currentUser.name}</p><p className="text-sm text-white/80">{isSuperAdmin ? 'Super Admin' : isAdmin ? 'Finance Admin' : selectedLocation}</p></div>
          </div>
          <div className="mt-2 text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg inline-block">🎯 Demo Mode</div>
        </div>

        {isAdmin && (
          <div className="p-4 border-b bg-purple-50">
            <label className="text-xs font-medium text-purple-700 mb-1.5 block">Filter by Location</label>
            <select value={adminLocation} onChange={e => setAdminLocation(e.target.value)} className="w-full p-2.5 border-2 border-purple-200 rounded-xl text-sm bg-white">
              <option value="all">📍 All Locations</option>
              {locations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
        )}

        {!isAdmin && userLocations.length > 1 && (
          <div className="p-4 border-b bg-blue-50">
            <label className="text-xs font-medium text-blue-700 mb-1.5 block">Switch Location</label>
            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-2.5 border-2 border-blue-200 rounded-xl text-sm bg-white">
              {userLocations.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            </select>
          </div>
        )}

        <nav className="p-4 space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Modules</p>
          {MODULES.map(m => {
            const colors = MODULE_COLORS[m.id];
            const isActive = activeModule === m.id && adminView === 'records' && view !== 'settings';
            return (
              <button key={m.id} onClick={() => { setActiveModule(m.id); setAdminView('records'); setView('entry'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? `${colors.bg} ${colors.text} border-2 ${colors.border}` : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? colors.light : 'bg-gray-100'}`}><m.icon className={`w-4 h-4 ${isActive ? colors.text : 'text-gray-500'}`} /></div>
                <span className="text-sm font-medium">{m.name}</span>
              </button>
            );
          })}

          <div className="border-t my-4"></div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Support</p>
          {SUPPORT_MODULES.map(m => {
            const colors = MODULE_COLORS[m.id];
            const isActive = activeModule === m.id && adminView === 'records' && view !== 'settings';
            return (
              <button key={m.id} onClick={() => { setActiveModule(m.id); setAdminView('records'); setView('entry'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? `${colors.bg} ${colors.text} border-2 ${colors.border}` : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? colors.light : 'bg-gray-100'}`}><m.icon className={`w-4 h-4 ${isActive ? colors.text : 'text-gray-500'}`} /></div>
                <span className="text-sm font-medium">{m.name}</span>
              </button>
            );
          })}

          {isAdmin && (
            <>
              <div className="border-t my-4"></div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Management</p>
              <button onClick={() => { setAdminView('users'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${adminView === 'users' ? 'bg-purple-50 text-purple-700 border-2 border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${adminView === 'users' ? 'bg-purple-100' : 'bg-gray-100'}`}><Users className="w-4 h-4" /></div>
                <span className="text-sm font-medium">Users</span>
              </button>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button onClick={() => { isAdmin ? setAdminView('settings') : setView('settings'); setSidebarOpen(false); }} className={`w-full flex items-center justify-center gap-2 py-2.5 mb-2 rounded-xl transition-all ${(isAdmin ? adminView : view) === 'settings' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-200'}`}><Settings className="w-4 h-4" /> Settings</button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"><Menu className="w-5 h-5" /></button>
              <div>
                <h1 className="font-bold text-gray-800 text-lg">{isAdmin ? (adminView === 'users' ? 'User Management' : adminView === 'settings' ? 'Settings' : currentModule?.name) : (view === 'settings' ? 'Settings' : currentModule?.name)}</h1>
                <p className="text-sm text-gray-500">{isAdmin ? (adminLocation === 'all' ? 'All Locations' : adminLocation) : selectedLocation}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-3">
            {isAdmin && adminView === 'records' && <button className={`px-4 py-2 rounded-xl text-sm font-medium ${currentColors?.accent} text-white shadow-lg flex items-center gap-2`}><FileText className="w-4 h-4" />Records</button>}
            {!isAdmin && view !== 'settings' && [{ id: 'entry', label: '+ New Entry' }, { id: 'history', label: 'History' }].map(tab => (
              <button key={tab.id} onClick={() => setView(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === tab.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab.label}</button>
            ))}
          </div>
        </header>

        {message.text && <div className={`mx-4 mt-4 p-4 rounded-xl text-center font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}

        <main className="flex-1 p-4 max-w-4xl mx-auto w-full pb-24">
          {isAdmin && adminView === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">{users.length} Users</h2>
                <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg"><Plus className="w-4 h-4" />Add User</button>
              </div>

              {(showAddUser || editingUser) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border">
                  <h3 className="font-semibold mb-4 text-gray-800">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Name *" value={editingUser ? editingUser.name : newUser.name} onChange={e => editingUser ? setEditingUser({...editingUser, name: e.target.value}) : setNewUser({...newUser, name: e.target.value})} />
                    <InputField label="Email *" value={editingUser ? editingUser.email : newUser.email} onChange={e => editingUser ? setEditingUser({...editingUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})} />
                    <PasswordField label={editingUser ? "New Password" : "Password *"} value={editingUser ? (editingUser.newPassword || '') : newUser.password} onChange={e => editingUser ? setEditingUser({...editingUser, newPassword: e.target.value}) : setNewUser({...newUser, password: e.target.value})} placeholder={editingUser ? "Leave blank to keep" : ""} />
                    <InputField label="Role" value={editingUser ? editingUser.role : newUser.role} onChange={e => editingUser ? setEditingUser({...editingUser, role: e.target.value}) : setNewUser({...newUser, role: e.target.value})} options={['staff', 'finance_admin', 'super_admin']} />
                  </div>
                  {((editingUser ? editingUser.role : newUser.role) === 'staff') && (
                    <div className="mt-4">
                      <label className="text-xs font-medium text-gray-600 mb-2 block">Assigned Locations</label>
                      <div className="flex flex-wrap gap-2">
                        {locations.map(loc => (
                          <button key={loc.id} onClick={() => toggleUserLocation(loc.id, !!editingUser)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${(editingUser ? editingUser.locationIds : newUser.locations)?.includes(loc.id) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{loc.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-5">
                    <button onClick={editingUser ? updateUser : addUser} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium">{editingUser ? 'Update' : 'Add'} User</button>
                    <button onClick={() => { setShowAddUser(false); setEditingUser(null); }} className="px-6 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200">Cancel</button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                <div className="divide-y">
                  {users.map(u => (
                    <div key={u.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${u.role === 'super_admin' ? 'bg-rose-500' : u.role === 'finance_admin' ? 'bg-purple-500' : 'bg-blue-500'}`}>{u.name.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email} • <span className="capitalize">{u.role?.replace('_', ' ')}</span></p>
                          {u.role === 'staff' && <div className="flex flex-wrap gap-1 mt-1">{u.locations?.slice(0, 3).map(loc => <span key={loc.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs">{loc.name}</span>)}{u.locations?.length > 3 && <span className="text-xs text-gray-400">+{u.locations.length - 3}</span>}</div>}
                        </div>
                      </div>
                      {u.id !== currentUser.id && (
                        <div className="flex gap-1">
                          <button onClick={() => setEditingUser({ ...u, locationIds: u.locations?.map(l => l.id) || [] })} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => deleteUser(u.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {((isAdmin && adminView === 'settings') || (!isAdmin && view === 'settings')) && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <h2 className="font-semibold text-gray-800 mb-4">Change Display Name</h2>
                <div className="max-w-sm space-y-4">
                  <InputField label="Display Name" value={nameForm} onChange={e => setNameForm(e.target.value)} />
                  <button onClick={() => { setCurrentUser({...currentUser, name: nameForm}); showMessage('success', '✓ Name updated!'); }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">Update Name</button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <h2 className="font-semibold text-gray-800 mb-4">Change Password</h2>
                <div className="max-w-sm space-y-4">
                  <PasswordField label="Current Password" value={pwdForm.current} onChange={e => setPwdForm({...pwdForm, current: e.target.value})} />
                  <PasswordField label="New Password" value={pwdForm.new} onChange={e => setPwdForm({...pwdForm, new: e.target.value})} />
                  <PasswordField label="Confirm Password" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})} />
                  <button onClick={() => { if (pwdForm.new === pwdForm.confirm && pwdForm.new) { setPwdForm({ current: '', new: '', confirm: '' }); showMessage('success', '✓ Password updated!'); } else showMessage('error', 'Passwords do not match'); }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {isAdmin && adminView === 'records' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              {getModuleEntries().length === 0 ? (
                <div className="text-center py-12"><FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">No entries yet</p></div>
              ) : (
                <div className="space-y-3">
                  {getModuleEntries().map(e => {
                    if (activeModule === 'daily-recon') {
                      const isEditing = editingRecon === e.id;
                      const form = reconForm[e.id] || {};
                      return (
                        <div key={e.id} className={`p-4 rounded-xl border-2 ${e.status === 'Accounted' ? 'border-emerald-200 bg-emerald-50' : e.status === 'Rejected' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2"><p className="font-semibold text-gray-800">{e.recon_date}</p><StatusBadge status={e.status || 'Pending'} /></div>
                              <p className="text-sm text-gray-600">{e.locations?.name} • {e.creator?.name}</p>
                            </div>
                            {!isEditing && <div className="flex gap-1"><button onClick={() => setViewingEntry(e)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button><button onClick={() => startEditingRecon(e)} className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-100 rounded-lg flex items-center gap-1"><Edit3 className="w-4 h-4" /> Review</button></div>}
                          </div>
                          <div className="bg-white rounded-xl p-3 mb-3 border">
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div><span className="text-gray-500">Cash:</span> ${Number(e.cash || 0).toFixed(2)}</div>
                              <div><span className="text-gray-500">CC:</span> ${Number(e.credit_card || 0).toFixed(2)}</div>
                              <div><span className="text-gray-500">Checks:</span> ${Number(e.checks_otc || 0).toFixed(2)}</div>
                              <div><span className="text-gray-500">Insurance:</span> ${Number(e.insurance_checks || 0).toFixed(2)}</div>
                              <div className="col-span-4 pt-2 border-t"><span className="font-semibold">Total Collected:</span> <span className="text-emerald-600 font-bold">${Number(e.total_collected || 0).toFixed(2)}</span></div>
                            </div>
                          </div>
                          {isEditing ? (
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                              <h4 className="text-sm font-semibold text-blue-700 mb-3">Bank Deposit (Admin)</h4>
                              <div className="grid grid-cols-4 gap-3 mb-3">
                                <div><label className="text-xs text-gray-600 block mb-1">Cash</label><div className="flex items-center border rounded-lg bg-white"><span className="pl-2 text-gray-400">$</span><input type="text" value={form.deposit_cash || ''} onChange={ev => updateReconForm(e.id, 'deposit_cash', ev.target.value)} className="w-full p-2 outline-none rounded-lg" /></div></div>
                                <div><label className="text-xs text-gray-600 block mb-1">Credit Card</label><div className="flex items-center border rounded-lg bg-white"><span className="pl-2 text-gray-400">$</span><input type="text" value={form.deposit_credit_card || ''} onChange={ev => updateReconForm(e.id, 'deposit_credit_card', ev.target.value)} className="w-full p-2 outline-none rounded-lg" /></div></div>
                                <div><label className="text-xs text-gray-600 block mb-1">Checks</label><div className="flex items-center border rounded-lg bg-white"><span className="pl-2 text-gray-400">$</span><input type="text" value={form.deposit_checks || ''} onChange={ev => updateReconForm(e.id, 'deposit_checks', ev.target.value)} className="w-full p-2 outline-none rounded-lg" /></div></div>
                                <div><label className="text-xs text-gray-600 block mb-1">Status</label><select value={form.status || 'Pending'} onChange={ev => updateReconForm(e.id, 'status', ev.target.value)} className="w-full p-2 border rounded-lg bg-white">{RECON_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                              </div>
                              <div className="flex gap-2"><button onClick={() => updateDailyRecon(e.id)} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-medium">Submit</button><button onClick={() => setEditingRecon(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button></div>
                            </div>
                          ) : (e.deposit_cash > 0 || e.status === 'Accounted') && (
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                              <h4 className="text-sm font-semibold text-blue-700 mb-2">Bank Deposit</h4>
                              <div className="grid grid-cols-4 gap-2 text-sm">
                                <div><span className="text-gray-500">Cash:</span> ${Number(e.deposit_cash || 0).toFixed(2)}</div>
                                <div><span className="text-gray-500">CC:</span> ${Number(e.deposit_credit_card || 0).toFixed(2)}</div>
                                <div><span className="text-gray-500">Checks:</span> ${Number(e.deposit_checks || 0).toFixed(2)}</div>
                                <div><span className="font-semibold">Total:</span> <span className="text-blue-600 font-bold">${Number(e.total_deposit || 0).toFixed(2)}</span></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={e.id} className={`p-4 rounded-xl border-2 ${currentColors?.border} ${currentColors?.bg}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2"><p className="font-semibold text-gray-800">{e.ticket_number ? `IT-${e.ticket_number}` : e.patient_name || e.vendor || e.created_at?.split('T')[0]}</p><StatusBadge status={e.status} /></div>
                            <p className="text-sm text-gray-600">{e.locations?.name} • {e.creator?.name}</p>
                            {(e.amount || e.amount_requested || e.amount_in_question) && <p className="text-lg font-bold text-emerald-600 mt-2">${Number(e.amount || e.amount_requested || e.amount_in_question).toFixed(2)}</p>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setViewingEntry(e)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                            {activeModule === 'it-requests' && (
                              editingStatus === e.id ? (
                                <div className="flex items-center gap-2">
                                  <select defaultValue={e.status} id={`st-${e.id}`} className="p-2 border rounded-lg text-sm">{IT_STATUSES.map(s => <option key={s}>{s}</option>)}</select>
                                  <button onClick={() => updateEntryStatus('it-requests', e.id, document.getElementById(`st-${e.id}`).value)} className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm">Save</button>
                                  <button onClick={() => setEditingStatus(null)} className="px-3 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                                </div>
                              ) : <button onClick={() => setEditingStatus(e.id)} className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-100 rounded-lg flex items-center gap-1"><Edit3 className="w-4 h-4" /> Update</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!isAdmin && view === 'entry' && (
            <div className="space-y-4">
              {activeModule === 'daily-recon' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800 flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500" />Daily Cash Can</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date" type="date" value={forms['daily-recon'].recon_date} onChange={e => updateForm('daily-recon', 'recon_date', e.target.value)} />
                    <InputField label="Cash" prefix="$" value={forms['daily-recon'].cash} onChange={e => updateForm('daily-recon', 'cash', e.target.value)} />
                    <InputField label="Credit Card" prefix="$" value={forms['daily-recon'].credit_card} onChange={e => updateForm('daily-recon', 'credit_card', e.target.value)} />
                    <InputField label="Checks OTC" prefix="$" value={forms['daily-recon'].checks_otc} onChange={e => updateForm('daily-recon', 'checks_otc', e.target.value)} />
                    <InputField label="Insurance" prefix="$" value={forms['daily-recon'].insurance_checks} onChange={e => updateForm('daily-recon', 'insurance_checks', e.target.value)} />
                    <InputField label="Care Credit" prefix="$" value={forms['daily-recon'].care_credit} onChange={e => updateForm('daily-recon', 'care_credit', e.target.value)} />
                    <InputField label="VCC" prefix="$" value={forms['daily-recon'].vcc} onChange={e => updateForm('daily-recon', 'vcc', e.target.value)} />
                    <InputField label="EFTs" prefix="$" value={forms['daily-recon'].efts} onChange={e => updateForm('daily-recon', 'efts', e.target.value)} />
                  </div>
                  <div className="mt-4"><InputField label="Notes" value={forms['daily-recon'].notes} onChange={e => updateForm('daily-recon', 'notes', e.target.value)} /></div>
                </div>
              )}
              {activeModule === 'billing-inquiry' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Billing Inquiry</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Patient Name" value={forms['billing-inquiry'].patient_name} onChange={e => updateForm('billing-inquiry', 'patient_name', e.target.value)} />
                    <InputField label="Chart Number" value={forms['billing-inquiry'].chart_number} onChange={e => updateForm('billing-inquiry', 'chart_number', e.target.value)} />
                    <InputField label="Date of Request" type="date" value={forms['billing-inquiry'].date_of_request} onChange={e => updateForm('billing-inquiry', 'date_of_request', e.target.value)} />
                    <InputField label="Type" value={forms['billing-inquiry'].inquiry_type} onChange={e => updateForm('billing-inquiry', 'inquiry_type', e.target.value)} options={INQUIRY_TYPES} />
                    <InputField label="Amount" prefix="$" value={forms['billing-inquiry'].amount_in_question} onChange={e => updateForm('billing-inquiry', 'amount_in_question', e.target.value)} />
                    <InputField label="Contact Method" value={forms['billing-inquiry'].best_contact_method} onChange={e => updateForm('billing-inquiry', 'best_contact_method', e.target.value)} options={CONTACT_METHODS} />
                  </div>
                  <div className="mt-4"><InputField label="Description" large value={forms['billing-inquiry'].description} onChange={e => updateForm('billing-inquiry', 'description', e.target.value)} /></div>
                </div>
              )}
              {activeModule === 'bills-payment' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Bills Payment</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Status" value={forms['bills-payment'].bill_status} onChange={e => updateForm('bills-payment', 'bill_status', e.target.value)} options={['Pending', 'Approved', 'Paid']} />
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
                  <h2 className="font-semibold mb-4 text-gray-800">Order Request</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date Entered" type="date" value={forms['order-requests'].date_entered} onChange={e => updateForm('order-requests', 'date_entered', e.target.value)} />
                    <InputField label="Vendor" value={forms['order-requests'].vendor} onChange={e => updateForm('order-requests', 'vendor', e.target.value)} />
                    <InputField label="Invoice #" value={forms['order-requests'].invoice_number} onChange={e => updateForm('order-requests', 'invoice_number', e.target.value)} />
                    <InputField label="Amount" prefix="$" value={forms['order-requests'].amount} onChange={e => updateForm('order-requests', 'amount', e.target.value)} />
                    <InputField label="Due Date" type="date" value={forms['order-requests'].due_date} onChange={e => updateForm('order-requests', 'due_date', e.target.value)} />
                  </div>
                  <div className="mt-4"><InputField label="Notes" large value={forms['order-requests'].notes} onChange={e => updateForm('order-requests', 'notes', e.target.value)} /></div>
                </div>
              )}
              {activeModule === 'refund-requests' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">Refund Request</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Patient Name" value={forms['refund-requests'].patient_name} onChange={e => updateForm('refund-requests', 'patient_name', e.target.value)} />
                    <InputField label="Chart Number" value={forms['refund-requests'].chart_number} onChange={e => updateForm('refund-requests', 'chart_number', e.target.value)} />
                    <InputField label="Date of Request" type="date" value={forms['refund-requests'].date_of_request} onChange={e => updateForm('refund-requests', 'date_of_request', e.target.value)} />
                    <InputField label="Type" value={forms['refund-requests'].type} onChange={e => updateForm('refund-requests', 'type', e.target.value)} options={REFUND_TYPES} />
                    <InputField label="Amount" prefix="$" value={forms['refund-requests'].amount_requested} onChange={e => updateForm('refund-requests', 'amount_requested', e.target.value)} />
                    <InputField label="Contact Method" value={forms['refund-requests'].best_contact_method} onChange={e => updateForm('refund-requests', 'best_contact_method', e.target.value)} options={CONTACT_METHODS} />
                  </div>
                  <div className="mt-4"><InputField label="Description" large value={forms['refund-requests'].description} onChange={e => updateForm('refund-requests', 'description', e.target.value)} /></div>
                </div>
              )}
              {activeModule === 'it-requests' && (
                <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${currentColors?.accent}`}>
                  <h2 className="font-semibold mb-4 text-gray-800">IT Request</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date Reported" type="date" value={forms['it-requests'].date_reported} onChange={e => updateForm('it-requests', 'date_reported', e.target.value)} />
                    <InputField label="Urgency" value={forms['it-requests'].urgency} onChange={e => updateForm('it-requests', 'urgency', e.target.value)} options={['Low', 'Medium', 'High', 'Critical']} />
                    <InputField label="Requester Name" value={forms['it-requests'].requester_name} onChange={e => updateForm('it-requests', 'requester_name', e.target.value)} />
                    <InputField label="Device/System" value={forms['it-requests'].device_system} onChange={e => updateForm('it-requests', 'device_system', e.target.value)} />
                    <InputField label="Contact Method" value={forms['it-requests'].best_contact_method} onChange={e => updateForm('it-requests', 'best_contact_method', e.target.value)} options={CONTACT_METHODS} />
                  </div>
                  <div className="mt-4"><InputField label="Description of Issue" large value={forms['it-requests'].description_of_issue} onChange={e => updateForm('it-requests', 'description_of_issue', e.target.value)} /></div>
                </div>
              )}
              <button onClick={() => saveEntry(activeModule)} disabled={saving} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold shadow-lg disabled:opacity-50">{saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Entry'}</button>
            </div>
          )}

          {!isAdmin && view === 'history' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border">
              <h2 className="font-semibold mb-4 text-gray-800">Your Entries</h2>
              {getModuleEntries().length === 0 ? (
                <div className="text-center py-12"><FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" /><p className="text-gray-500">No entries yet</p></div>
              ) : (
                <div className="space-y-3">
                  {getModuleEntries().map(e => {
                    const canEdit = canEditRecord(e.created_at);
                    const isEditing = editingStaffEntry === e.id;
                    let bgClass = `${currentColors?.bg} border ${currentColors?.border}`;
                    if (activeModule === 'daily-recon') {
                      if (e.status === 'Accounted') bgClass = 'bg-emerald-50 border-2 border-emerald-300';
                      else if (e.status === 'Rejected') bgClass = 'bg-red-50 border-2 border-red-300';
                      else bgClass = 'bg-amber-50 border-2 border-amber-300';
                    }
                    return (
                      <div key={e.id} className={`p-4 rounded-xl ${bgClass}`}>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between"><h4 className="font-semibold text-gray-800 flex items-center gap-2"><Edit3 className="w-4 h-4" /> Edit Entry</h4><button onClick={() => { setEditingStaffEntry(null); setStaffEditForm({}); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div>
                            {activeModule === 'daily-recon' && (
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Date" type="date" value={staffEditForm.recon_date} onChange={ev => updateStaffEditForm('recon_date', ev.target.value)} />
                                <InputField label="Cash" prefix="$" value={staffEditForm.cash} onChange={ev => updateStaffEditForm('cash', ev.target.value)} />
                                <InputField label="Credit Card" prefix="$" value={staffEditForm.credit_card} onChange={ev => updateStaffEditForm('credit_card', ev.target.value)} />
                                <InputField label="Checks" prefix="$" value={staffEditForm.checks_otc} onChange={ev => updateStaffEditForm('checks_otc', ev.target.value)} />
                                <InputField label="Insurance" prefix="$" value={staffEditForm.insurance_checks} onChange={ev => updateStaffEditForm('insurance_checks', ev.target.value)} />
                                <InputField label="Care Credit" prefix="$" value={staffEditForm.care_credit} onChange={ev => updateStaffEditForm('care_credit', ev.target.value)} />
                                <InputField label="VCC" prefix="$" value={staffEditForm.vcc} onChange={ev => updateStaffEditForm('vcc', ev.target.value)} />
                                <InputField label="EFTs" prefix="$" value={staffEditForm.efts} onChange={ev => updateStaffEditForm('efts', ev.target.value)} />
                                <div className="col-span-2"><InputField label="Notes" value={staffEditForm.notes} onChange={ev => updateStaffEditForm('notes', ev.target.value)} /></div>
                              </div>
                            )}
                            {activeModule === 'billing-inquiry' && (
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Patient Name" value={staffEditForm.patient_name} onChange={ev => updateStaffEditForm('patient_name', ev.target.value)} />
                                <InputField label="Chart #" value={staffEditForm.chart_number} onChange={ev => updateStaffEditForm('chart_number', ev.target.value)} />
                                <InputField label="Date" type="date" value={staffEditForm.date_of_request} onChange={ev => updateStaffEditForm('date_of_request', ev.target.value)} />
                                <InputField label="Type" value={staffEditForm.inquiry_type} onChange={ev => updateStaffEditForm('inquiry_type', ev.target.value)} options={INQUIRY_TYPES} />
                                <InputField label="Amount" prefix="$" value={staffEditForm.amount_in_question} onChange={ev => updateStaffEditForm('amount_in_question', ev.target.value)} />
                                <InputField label="Contact" value={staffEditForm.best_contact_method} onChange={ev => updateStaffEditForm('best_contact_method', ev.target.value)} options={CONTACT_METHODS} />
                                <div className="col-span-2"><InputField label="Description" large value={staffEditForm.description} onChange={ev => updateStaffEditForm('description', ev.target.value)} /></div>
                              </div>
                            )}
                            {activeModule === 'bills-payment' && (
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Status" value={staffEditForm.bill_status} onChange={ev => updateStaffEditForm('bill_status', ev.target.value)} options={['Pending', 'Approved', 'Paid']} />
                                <InputField label="Date" type="date" value={staffEditForm.bill_date} onChange={ev => updateStaffEditForm('bill_date', ev.target.value)} />
                                <InputField label="Vendor" value={staffEditForm.vendor} onChange={ev => updateStaffEditForm('vendor', ev.target.value)} />
                                <InputField label="Amount" prefix="$" value={staffEditForm.amount} onChange={ev => updateStaffEditForm('amount', ev.target.value)} />
                                <InputField label="Due Date" type="date" value={staffEditForm.due_date} onChange={ev => updateStaffEditForm('due_date', ev.target.value)} />
                                <div className="col-span-2"><InputField label="Description" large value={staffEditForm.description} onChange={ev => updateStaffEditForm('description', ev.target.value)} /></div>
                              </div>
                            )}
                            {activeModule === 'order-requests' && (
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Date" type="date" value={staffEditForm.date_entered} onChange={ev => updateStaffEditForm('date_entered', ev.target.value)} />
                                <InputField label="Vendor" value={staffEditForm.vendor} onChange={ev => updateStaffEditForm('vendor', ev.target.value)} />
                                <InputField label="Invoice #" value={staffEditForm.invoice_number} onChange={ev => updateStaffEditForm('invoice_number', ev.target.value)} />
                                <InputField label="Amount" prefix="$" value={staffEditForm.amount} onChange={ev => updateStaffEditForm('amount', ev.target.value)} />
                                <InputField label="Due Date" type="date" value={staffEditForm.due_date} onChange={ev => updateStaffEditForm('due_date', ev.target.value)} />
                                <div className="col-span-2"><InputField label="Notes" large value={staffEditForm.notes} onChange={ev => updateStaffEditForm('notes', ev.target.value)} /></div>
                              </div>
                            )}
                            {activeModule === 'refund-requests' && (
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Patient Name" value={staffEditForm.patient_name} onChange={ev => updateStaffEditForm('patient_name', ev.target.value)} />
                                <InputField label="Chart #" value={staffEditForm.chart_number} onChange={ev => updateStaffEditForm('chart_number', ev.target.value)} />
                                <InputField label="Date" type="date" value={staffEditForm.date_of_request} onChange={ev => updateStaffEditForm('date_of_request', ev.target.value)} />
                                <InputField label="Type" value={staffEditForm.type} onChange={ev => updateStaffEditForm('type', ev.target.value)} options={REFUND_TYPES} />
                                <InputField label="Amount" prefix="$" value={staffEditForm.amount_requested} onChange={ev => updateStaffEditForm('amount_requested', ev.target.value)} />
                                <InputField label="Contact" value={staffEditForm.best_contact_method} onChange={ev => updateStaffEditForm('best_contact_method', ev.target.value)} options={CONTACT_METHODS} />
                                <div className="col-span-2"><InputField label="Description" large value={staffEditForm.description} onChange={ev => updateStaffEditForm('description', ev.target.value)} /></div>
                              </div>
                            )}
                            {activeModule === 'it-requests' && (
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Date" type="date" value={staffEditForm.date_reported} onChange={ev => updateStaffEditForm('date_reported', ev.target.value)} />
                                <InputField label="Urgency" value={staffEditForm.urgency} onChange={ev => updateStaffEditForm('urgency', ev.target.value)} options={['Low', 'Medium', 'High', 'Critical']} />
                                <InputField label="Requester" value={staffEditForm.requester_name} onChange={ev => updateStaffEditForm('requester_name', ev.target.value)} />
                                <InputField label="Device" value={staffEditForm.device_system} onChange={ev => updateStaffEditForm('device_system', ev.target.value)} />
                                <InputField label="Contact" value={staffEditForm.best_contact_method} onChange={ev => updateStaffEditForm('best_contact_method', ev.target.value)} options={CONTACT_METHODS} />
                                <div className="col-span-2"><InputField label="Description" large value={staffEditForm.description_of_issue} onChange={ev => updateStaffEditForm('description_of_issue', ev.target.value)} /></div>
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              <button onClick={saveStaffEntryUpdate} disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}</button>
                              <button onClick={() => { setEditingStaffEntry(null); setStaffEditForm({}); }} className="px-4 py-2.5 bg-gray-200 rounded-xl font-medium hover:bg-gray-300">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800">{e.ticket_number ? `IT-${e.ticket_number}` : e.patient_name || e.vendor || e.recon_date || new Date(e.created_at).toLocaleDateString()}</p>
                                <StatusBadge status={e.status || (activeModule === 'daily-recon' ? 'Pending' : e.status)} />
                                {!canEdit && <Lock className="w-4 h-4 text-gray-400" title="Locked" />}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{new Date(e.created_at).toLocaleDateString()}</p>
                              {activeModule === 'daily-recon' && e.total_collected && <p className="text-lg font-bold text-emerald-600 mt-2">${Number(e.total_collected).toFixed(2)}</p>}
                              {activeModule !== 'daily-recon' && (e.amount || e.amount_requested || e.amount_in_question) && <p className="text-lg font-bold text-emerald-600 mt-2">${Number(e.amount || e.amount_requested || e.amount_in_question).toFixed(2)}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => setViewingEntry(e)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                              {canEdit && <button onClick={() => startEditingStaffEntry(e)} className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-1"><Edit3 className="w-4 h-4" /> Edit</button>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
