//Clinic Management System v0.73
// Developer: Mark Murillo
// Company: Kidshine Hawaii
'use client';
import { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { supabase } from '../lib/supabase';
import {
  DollarSign, FileText, Building2, Bot, Send, Loader2, LogOut, User, Upload, X,
  File, Shield, Receipt, CreditCard, Package, RefreshCw, Monitor, Menu, Eye,
  EyeOff, FolderOpen, Edit3, Users, Plus, Trash2, Lock, Download, Settings,
  MessageCircle, Sparkles, AlertCircle, Maximize2, Minimize2, Headphones,
  Search, TrendingUp, TrendingDown, Calendar, PieChart, BarChart3, ClipboardList,
  Paperclip, CheckCircle, Circle
} from 'lucide-react';

// ─── Feature Flags ────────────────────────────────────────────────────────────
const CHECKLIST_ENABLED = false;
const DAILY_RECON_ENABLED = false;

// ─── Module Definitions ───────────────────────────────────────────────────────
const CHECKLIST_MODULES = [
  { id:'daily-recon',          name:'Daily Reconciliation', icon:DollarSign,   color:'emerald', table:'daily_recon' },
  { id:'completed-procedure',  name:'Completed Procedure',  icon:ClipboardList, color:'teal',    table:'completed_procedures' },
  { id:'claims-documents',     name:'Claims & Documents',   icon:Paperclip,    color:'sky',     table:'claims_documents' },
];
const MODULES = [
  { id:'billing-inquiry',  name:'Billing Inquiry',  icon:Receipt,   color:'blue',   table:'billing_inquiries' },
  { id:'bills-payment',    name:'Bills Payment',    icon:CreditCard,color:'violet', table:'bills_payment' },
  { id:'order-requests',   name:'Order Requests',   icon:Package,   color:'amber',  table:'order_requests' },
  { id:'refund-requests',  name:'Refund Requests',  icon:RefreshCw, color:'rose',   table:'refund_requests' },
  { id:'hospital-cases',   name:'Hospital Cases',   icon:Building2, color:'indigo', table:'hospital_cases' },
];
const SUPPORT_MODULES = [
  { id:'it-requests', name:'IT Requests', icon:Monitor, color:'cyan', table:'it_requests' },
];
const ALL_MODULES = [...CHECKLIST_MODULES, ...MODULES, ...SUPPORT_MODULES];
const INQUIRY_TYPES = ['Patient Refund','Insurance Refund','Patient Balance','Payment Plan','Other'];

const MC = {
  'daily-recon':        {bg:'bg-emerald-50',border:'border-emerald-200',text:'text-emerald-700',accent:'bg-emerald-500',light:'bg-emerald-100'},
  'billing-inquiry':    {bg:'bg-blue-50',   border:'border-blue-200',   text:'text-blue-700',   accent:'bg-blue-500',   light:'bg-blue-100'},
  'bills-payment':      {bg:'bg-violet-50', border:'border-violet-200', text:'text-violet-700', accent:'bg-violet-500', light:'bg-violet-100'},
  'order-requests':     {bg:'bg-amber-50',  border:'border-amber-200',  text:'text-amber-700',  accent:'bg-amber-500',  light:'bg-amber-100'},
  'refund-requests':    {bg:'bg-rose-50',   border:'border-rose-200',   text:'text-rose-700',   accent:'bg-rose-500',   light:'bg-rose-100'},
  'it-requests':        {bg:'bg-cyan-50',   border:'border-cyan-200',   text:'text-cyan-700',   accent:'bg-cyan-500',   light:'bg-cyan-100'},
  'completed-procedure':{bg:'bg-teal-50',   border:'border-teal-200',   text:'text-teal-700',   accent:'bg-teal-500',   light:'bg-teal-100'},
  'claims-documents':   {bg:'bg-sky-50',    border:'border-sky-200',    text:'text-sky-700',    accent:'bg-sky-500',    light:'bg-sky-100'},
  'hospital-cases':     {bg:'bg-indigo-50', border:'border-indigo-200', text:'text-indigo-700', accent:'bg-indigo-500', light:'bg-indigo-100'},
};

// ─── Form Field Configs (drives all forms & EntryPreview data-driven) ─────────
const MF = {
  'daily-recon': [
    {k:'recon_date',t:'date',l:'Date'},{k:'cash',t:'number',l:'Cash'},{k:'credit_card',t:'number',l:'Credit Card'},
    {k:'checks_otc',t:'number',l:'Checks OTC'},{k:'insurance_checks',t:'number',l:'Insurance'},
    {k:'care_credit',t:'number',l:'Care Credit'},{k:'vcc',t:'number',l:'VCC'},{k:'efts',t:'number',l:'EFTs'},
    {k:'deposit_cash',t:'number',l:'Deposit Cash'},{k:'deposit_credit_card',t:'number',l:'Deposit CC'},
    {k:'deposit_checks',t:'number',l:'Deposit Checks'},{k:'deposit_insurance',t:'number',l:'Deposit Insurance'},
    {k:'deposit_care_credit',t:'number',l:'Deposit Care Credit'},{k:'deposit_vcc',t:'number',l:'Deposit VCC'},
    {k:'deposit_efts',t:'number',l:'Deposit EFTs'},{k:'notes',large:true,l:'Notes'},{k:'entered_by',l:'Entered By'},
  ],
  'billing-inquiry': [
    {k:'patient_name',l:'Patient Name'},{k:'chart_number',l:'Chart Number'},{k:'parent_name',l:'Parent/Guardian'},
    {k:'date_of_request',t:'date',l:'Date of Request'},{k:'inquiry_type',l:'Type of Inquiry',opts:INQUIRY_TYPES},
    {k:'description',large:true,l:'Description'},{k:'amount_in_question',t:'number',l:'Amount in Question'},
    {k:'best_contact_method',l:'Best Contact Method'},{k:'best_contact_time',l:'Best Contact Time'},
    {k:'billing_team_reviewed',l:'Billing Team Reviewed'},{k:'date_reviewed',t:'date',l:'Date Reviewed'},
    {k:'status',l:'Status',opts:['Pending','In Progress','Resolved','Closed']},{k:'result',large:true,l:'Result'},
  ],
  'bills-payment': [
    {k:'bill_date',t:'date',l:'Bill Date'},{k:'vendor',l:'Vendor'},{k:'transaction_id',l:'Transaction ID'},
    {k:'description',large:true,l:'Description'},{k:'amount',t:'number',l:'Amount'},
    {k:'due_date',t:'date',l:'Due Date'},{k:'paid',l:'Paid',opts:['Yes','No','']},
  ],
  'order-requests': [
    {k:'date_entered',t:'date',l:'Date Entered'},{k:'vendor',l:'Vendor'},{k:'invoice_number',l:'Invoice Number'},
    {k:'invoice_date',t:'date',l:'Invoice Date'},{k:'due_date',t:'date',l:'Due Date'},
    {k:'amount',t:'number',l:'Amount'},{k:'entered_by',l:'Entered By'},{k:'notes',large:true,l:'Notes'},
  ],
  'refund-requests': [
    {k:'patient_name',l:'Patient Name'},{k:'chart_number',l:'Chart Number'},{k:'parent_name',l:'Parent/Guardian'},
    {k:'rp_address',l:'RP Address'},{k:'rp_phone',l:'RP Phone'},{k:'rp_email',t:'email',l:'RP Email'},
    {k:'date_of_request',t:'date',l:'Date of Request'},{k:'insurance_company',l:'Insurance Company'},
    {k:'insurance_id',l:'Insurance ID'},{k:'refund_amount',t:'number',l:'Refund Amount'},
    {k:'refund_reason',large:true,l:'Reason for Refund'},{k:'notes',large:true,l:'Notes'},
  ],
  'it-requests': [
    {k:'requester_name',l:'Requester Name'},{k:'department',l:'Department'},
    {k:'date_reported',t:'date',l:'Date Reported'},{k:'urgency',l:'Urgency',opts:['Low','Medium','High','Critical']},
    {k:'device_system',l:'Device/System'},{k:'description_of_issue',large:true,l:'Description'},
    {k:'resolution_notes',large:true,l:'Resolution Notes'},
  ],
  'completed-procedure': [{k:'checked_by',l:'Checked By'},{k:'notes',large:true,l:'Notes'}],
  'claims-documents':    [{k:'checked_by',l:'Checked By'},{k:'notes',large:true,l:'Notes'}],
  'hospital-cases': [
    {k:'patient_name',l:'Patient Name'},{k:'chart_number',l:'Chart Number'},{k:'parent_name',l:'Parent/Guardian'},
    {k:'date_of_request',t:'date',l:'Date of Request'},{k:'inquiry_type',l:'Type of Inquiry',opts:INQUIRY_TYPES},
    {k:'description',large:true,l:'Description'},{k:'amount_in_question',t:'number',l:'Amount in Question'},
    {k:'best_contact_method',l:'Best Contact Method'},{k:'best_contact_time',l:'Best Contact Time'},
    {k:'billing_team_reviewed',l:'Billing Team Reviewed'},{k:'date_reviewed',t:'date',l:'Date Reviewed'},
    {k:'status',l:'Status',opts:['Pending','In Progress','Resolved','Closed']},{k:'result',large:true,l:'Result'},
  ],
};

const today = new Date().toISOString().split('T')[0];
const BLANK_FORMS = {
  'daily-recon':        {recon_date:today,cash:'',credit_card:'',checks_otc:'',insurance_checks:'',care_credit:'',vcc:'',efts:'',deposit_cash:'',deposit_credit_card:'',deposit_checks:'',deposit_insurance:'',deposit_care_credit:'',deposit_vcc:'',deposit_efts:'',notes:'',entered_by:''},
  'billing-inquiry':    {patient_name:'',chart_number:'',parent_name:'',date_of_request:today,inquiry_type:'',description:'',amount_in_question:'',best_contact_method:'',best_contact_time:'',billing_team_reviewed:'',date_reviewed:'',status:'Pending',result:''},
  'bills-payment':      {bill_date:today,vendor:'',transaction_id:'',description:'',amount:'',due_date:'',paid:''},
  'order-requests':     {date_entered:today,vendor:'',invoice_number:'',invoice_date:'',due_date:'',amount:'',entered_by:'',notes:''},
  'refund-requests':    {patient_name:'',chart_number:'',parent_name:'',rp_address:'',rp_phone:'',rp_email:'',date_of_request:today,insurance_company:'',insurance_id:'',refund_amount:'',refund_reason:'',notes:''},
  'it-requests':        {requester_name:'',department:'',date_reported:today,urgency:'',device_system:'',description_of_issue:'',resolution_notes:''},
  'completed-procedure':{checked_by:'',notes:'',status:'Pending'},
  'claims-documents':   {checked_by:'',notes:'',status:'Pending'},
  'hospital-cases':     {patient_name:'',chart_number:'',parent_name:'',date_of_request:today,inquiry_type:'',description:'',amount_in_question:'',best_contact_method:'',best_contact_time:'',billing_team_reviewed:'',date_reviewed:'',status:'Pending',result:''},
};
const BLANK_FILES = Object.fromEntries(ALL_MODULES.map(m => [m.id,{documentation:[]}]));

// ─── Utilities ────────────────────────────────────────────────────────────────
const formatRole = r => ({it:'IT',staff:'Staff',super_admin:'Super Admin',finance_admin:'Finance Admin',office_manager:'Office Manager',rev_rangers:'Rev Rangers'}[r]||r);
const formatCurrency = v => '$'+Number(v||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const getHawaiiNow = () => new Date(new Date().toLocaleString('en-US',{timeZone:'Pacific/Honolulu'}));
const getHawaiiToday = () => { const d=getHawaiiNow(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

function canEditRecord(createdAt) {
  const now=getHawaiiNow(), rec=new Date(new Date(createdAt).toLocaleString('en-US',{timeZone:'Pacific/Honolulu'}));
  const fri=new Date(rec); fri.setDate(rec.getDate()+((5-rec.getDay()+7)%7)); fri.setHours(23,59,59,999);
  return now<=fri;
}

// ─── Shared UI Components ─────────────────────────────────────────────────────
const inputCls = "w-full p-2.5 border-2 border-gray-200 rounded-xl outline-none transition-all hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";

function PasswordField({label,value,onChange,placeholder='',disabled}) {
  const [show,setShow]=useState(false);
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <input type={show?'text':'password'} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} className={inputCls+' pr-10'} />
        <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
        </button>
      </div>
    </div>
  );
}

function InputField({label,value,onChange,type='text',large,options,disabled,placeholder=''}) {
  return (
    <div className="flex flex-col">
      {label&&<label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>}
      {options ? (
        <select value={value} onChange={onChange} disabled={disabled} className={inputCls}>
          <option value="">Select...</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : large ? (
        <textarea value={value} onChange={onChange} disabled={disabled} rows={4} placeholder={placeholder} className={inputCls+' resize-none'} />
      ) : (
        <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} className={inputCls} />
      )}
    </div>
  );
}

function FileUpload({label,files,onFilesChange,onViewFile}) {
  const ref=useRef();
  return (
    <div className="flex flex-col">
      {label&&<label className="text-xs font-medium text-gray-600 mb-1.5">{label}</label>}
      <div onDrop={e=>{e.preventDefault();onFilesChange([...files,...e.dataTransfer.files]);}} onDragOver={e=>e.preventDefault()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 cursor-pointer transition-all" onClick={()=>ref.current.click()}>
        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1"/><p className="text-xs text-gray-500">Click or drag files here</p>
        <input ref={ref} type="file" multiple className="hidden" onChange={e=>onFilesChange([...files,...e.target.files])}/>
      </div>
      {files.length>0&&<div className="mt-2 space-y-1">{files.map((f,i)=>(
        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm">
          <File className="w-4 h-4 text-gray-400 flex-shrink-0"/>
          <span className="flex-1 truncate text-gray-700">{f.name}</span>
          {onViewFile&&<button onClick={()=>onViewFile(f)} className="text-blue-500 hover:text-blue-700 text-xs">View</button>}
          <button onClick={()=>onFilesChange(files.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-600"><X className="w-3 h-3"/></button>
        </div>
      ))}</div>}
    </div>
  );
}

function FileViewer({file,onClose}) {
  const isImg=/\.(png|jpg|jpeg|gif|webp)$/i.test(file?.name||'')||file?.type?.startsWith('image/');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white/90 backdrop-blur-sm">
          <h3 className="font-semibold truncate text-gray-800">{file.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6">
          {isImg ? <img src={file.url} alt={file.name} className="max-w-full rounded-xl mx-auto shadow-lg"/> : (
            <div className="text-center py-12 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><File className="w-10 h-10 text-gray-400"/></div>
              <p className="font-medium">{file.name}</p>
              <a href={file.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"><Download className="w-4 h-4"/>Download File</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({status}) {
  const m={'For Review':'bg-purple-100 text-purple-700 border-purple-200','Open':'bg-red-100 text-red-700 border-red-200','In Progress':'bg-amber-100 text-amber-700 border-amber-200','On-hold':'bg-gray-100 text-gray-600 border-gray-200','Resolved':'bg-emerald-100 text-emerald-700 border-emerald-200','Closed':'bg-gray-100 text-gray-600 border-gray-200','Pending':'bg-amber-100 text-amber-700 border-amber-200','Approved':'bg-blue-100 text-blue-700 border-blue-200','Completed':'bg-emerald-100 text-emerald-700 border-emerald-200','Paid':'bg-emerald-100 text-emerald-700 border-emerald-200','Denied':'bg-red-100 text-red-700 border-red-200','Accounted':'bg-emerald-100 text-emerald-700 border-emerald-200','Rejected':'bg-red-100 text-red-700 border-red-200','Needs Revisions':'bg-orange-100 text-orange-700 border-orange-200','Reviewed':'bg-blue-100 text-blue-700 border-blue-200'};
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${m[status]||'bg-gray-100 text-gray-600 border-gray-200'}`}>{status||'—'}</span>;
}

function renderMarkdown(text) {
  if(!text)return'';
  return text.split('\n').map((line,i)=>{
    line=line.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    if(/^#{1,3}\s/.test(line))return`<p class="font-semibold text-gray-800 mt-3">${line.replace(/^#{1,3}\s/,'')}</p>`;
    if(/^[•\-\*]\s/.test(line))return`<li class="ml-4 text-gray-700">${line.replace(/^[•\-\*]\s/,'')}</li>`;
    if(!line.trim())return`<br/>`;
    return`<p class="text-gray-700">${line}</p>`;
  }).join('');
}

function FloatingChat({messages,input,setInput,onSend,loading,userRole}) {
  const [isOpen,setIsOpen]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
  const isAdmin=['super_admin','finance_admin','it'].includes(userRole);
  return (
    <>
      <button onClick={()=>setIsOpen(o=>!o)} className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl ${isOpen?'bg-gray-700':'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
        {isOpen?<X className="w-6 h-6 text-white"/>:<div className="relative"><MessageCircle className="w-6 h-6 text-white"/><Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1"/></div>}
      </button>
      {isOpen&&(
        <div className={`fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all ${expanded?'w-[600px] h-[700px]':'w-96 h-[500px]'}`}>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5"/><span className="font-semibold">AI Assistant</span>
              {!isAdmin&&<span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Limited</span>}
            </div>
            <button onClick={()=>setExpanded(e=>!e)} className="p-1.5 hover:bg-white/20 rounded-lg">
              {expanded?<Minimize2 className="w-4 h-4"/>:<Maximize2 className="w-4 h-4"/>}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m,i)=>(
              <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                {m.role==='assistant'&&<div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0"><Bot className="w-4 h-4 text-indigo-600"/></div>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role==='user'?'bg-indigo-600 text-white rounded-br-sm':'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  {m.role==='assistant'?<div dangerouslySetInnerHTML={{__html:renderMarkdown(m.content)}}/>:m.content}
                </div>
              </div>
            ))}
            {loading&&<div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 className="w-4 h-4 animate-spin"/>Thinking...</div>}
            <div ref={endRef}/>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&onSend()} placeholder="Ask about your data..." className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all"/>
              <button onClick={onSend} disabled={loading||!input.trim()} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"><Send className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Generic data-driven fields grid — replaces all repeated InputField blocks
function FieldsGrid({fields,form,onChange,disabled}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(f=>(
        <div key={f.k} className={f.large||f.full?'col-span-2':''}>
          <InputField label={f.l} type={f.t||'text'} value={form[f.k]??''} large={f.large} options={f.opts} disabled={disabled} onChange={e=>onChange(f.k,e.target.value)}/>
        </div>
      ))}
    </div>
  );
}

// ─── EntryPreview — data-driven, replaces 879-line version ───────────────────
function EntryPreview({entry,module,onClose,colors,onViewDocument,currentUser,itUsers,financeAdminUsers,
  onUpdateStatus,onDelete,onUpdateBillingInquiry,onUpdateBillsPayment,onUpdateOrderRequest,
  onUpdateRefundRequest,onUpdateChecklist,onUpdateHospitalCase}) {
  const mid=module?.id;
  const fields=MF[mid]||[];
  const isAdmin=['super_admin','finance_admin','it','rev_rangers','office_manager'].includes(currentUser?.role);
  const canEdit=canEditRecord(entry?.created_at);

  const [ef,setEf]=useState({status:entry?.status||'For Review',assigned_to:entry?.assigned_to||'',resolution_notes:entry?.resolution_notes||''});
  const [bf,setBf]=useState({status:entry?.status||'Pending',billing_team_reviewed:entry?.billing_team_reviewed||'',date_reviewed:entry?.date_reviewed||'',result:entry?.result||'',paid:entry?.paid??null});
  const [of,setOf]=useState({status:entry?.status||'Pending',reviewed_by:entry?.reviewed_by||''});
  const [rf,setRf]=useState({status:entry?.status||'Pending',reviewed_by:entry?.reviewed_by||''});
  const [cf,setCf]=useState({status:entry?.status||'Pending',admin_notes:entry?.admin_notes||''});
  const [hf,setHf]=useState({status:entry?.status||'Pending',billing_team_reviewed:entry?.billing_team_reviewed||'',date_reviewed:entry?.date_reviewed||'',result:entry?.result||''});

  const Row=({label,value})=>value!=null&&value!==''?(<div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0"><span className="text-gray-500 text-sm w-44 flex-shrink-0">{label}:</span><span className="text-gray-800 text-sm font-medium">{value}</span></div>):null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border-t-4 ${colors?.accent||'border-blue-500'}`} onClick={e=>e.stopPropagation()}>
        <div className={`flex justify-between items-center p-5 ${colors?.bg||'bg-gray-50'} sticky top-0`}>
          <div>
            <h2 className={`font-bold text-lg ${colors?.text||'text-gray-800'}`}>{module?.name}</h2>
            <p className="text-gray-500 text-sm">Entry #{entry?.ticket_number||entry?.id?.slice(0,8)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={entry?.status}/>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl"><X className="w-5 h-5"/></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className={`${colors?.bg||'bg-gray-50'} rounded-xl p-4`}>
            {fields.map(f=><Row key={f.k} label={f.l} value={entry?.[f.k]}/>)}
            <Row label="Location" value={entry?.locations?.name}/>
            <Row label="Created By" value={entry?.creator?.name}/>
            <Row label="Created At" value={entry?.created_at?new Date(entry.created_at).toLocaleString():null}/>
          </div>
          {entry?.documents?.length>0&&(
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {entry.documents.map(doc=>(
                  <button key={doc.id} onClick={()=>onViewDocument(doc)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm transition-colors">
                    <File className="w-4 h-4 text-gray-500"/>{doc.file_name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isAdmin&&canEdit&&(
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-gray-800">Update Record</h4>
              {mid==='it-requests'&&<>
                <InputField label="Status" value={ef.status} options={['For Review','Open','In Progress','On-hold','Resolved','Closed']} onChange={e=>setEf(p=>({...p,status:e.target.value}))}/>
                <InputField label="Assigned To" value={ef.assigned_to} options={itUsers.map(u=>u.name)} onChange={e=>setEf(p=>({...p,assigned_to:e.target.value}))}/>
                <InputField label="Resolution Notes" value={ef.resolution_notes} large onChange={e=>setEf(p=>({...p,resolution_notes:e.target.value}))}/>
                <button onClick={()=>onUpdateStatus(entry.id,ef)} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">Save Changes</button>
              </>}
              {['billing-inquiry','hospital-cases'].includes(mid)&&<>
                <InputField label="Status" value={bf.status} options={['Pending','In Progress','Resolved','Closed']} onChange={e=>setBf(p=>({...p,status:e.target.value}))}/>
                <InputField label="Billing Team Reviewed" value={bf.billing_team_reviewed} options={financeAdminUsers.map(u=>u.name)} onChange={e=>setBf(p=>({...p,billing_team_reviewed:e.target.value}))}/>
                <InputField label="Date Reviewed" type="date" value={bf.date_reviewed} onChange={e=>setBf(p=>({...p,date_reviewed:e.target.value}))}/>
                <InputField label="Result" value={bf.result} large onChange={e=>setBf(p=>({...p,result:e.target.value}))}/>
                <button onClick={()=>mid==='billing-inquiry'?onUpdateBillingInquiry(entry.id,bf):onUpdateHospitalCase(entry.id,bf)} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">Save Changes</button>
              </>}
              {mid==='bills-payment'&&<>
                <InputField label="Status" value={bf.status} options={['Pending','Approved','Paid','Denied']} onChange={e=>setBf(p=>({...p,status:e.target.value}))}/>
                <InputField label="Reviewed By" value={bf.billing_team_reviewed} options={financeAdminUsers.map(u=>u.name)} onChange={e=>setBf(p=>({...p,billing_team_reviewed:e.target.value}))}/>
                <InputField label="Date Reviewed" type="date" value={bf.date_reviewed} onChange={e=>setBf(p=>({...p,date_reviewed:e.target.value}))}/>
                <InputField label="Paid" value={bf.paid===true?'Yes':bf.paid===false?'No':''} options={['Yes','No','']} onChange={e=>setBf(p=>({...p,paid:e.target.value==='Yes'?true:e.target.value==='No'?false:null}))}/>
                <button onClick={()=>onUpdateBillsPayment(entry.id,bf)} className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium">Save Changes</button>
              </>}
              {mid==='order-requests'&&<>
                <InputField label="Status" value={of.status} options={['Pending','Reviewed','Approved','Denied']} onChange={e=>setOf(p=>({...p,status:e.target.value}))}/>
                <InputField label="Reviewed By" value={of.reviewed_by} options={financeAdminUsers.map(u=>u.name)} onChange={e=>setOf(p=>({...p,reviewed_by:e.target.value}))}/>
                <button onClick={()=>onUpdateOrderRequest(entry.id,of)} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium">Save Changes</button>
              </>}
              {mid==='refund-requests'&&<>
                <InputField label="Status" value={rf.status} options={['Pending','Reviewed','Approved','Denied']} onChange={e=>setRf(p=>({...p,status:e.target.value}))}/>
                <InputField label="Reviewed By" value={rf.reviewed_by} options={financeAdminUsers.map(u=>u.name)} onChange={e=>setRf(p=>({...p,reviewed_by:e.target.value}))}/>
                <button onClick={()=>onUpdateRefundRequest(entry.id,rf)} className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium">Save Changes</button>
              </>}
              {['completed-procedure','claims-documents'].includes(mid)&&<>
                <InputField label="Status" value={cf.status} options={['Pending','Needs Revisions','Approved']} onChange={e=>setCf(p=>({...p,status:e.target.value}))}/>
                <InputField label="Admin Notes" value={cf.admin_notes} large onChange={e=>setCf(p=>({...p,admin_notes:e.target.value}))}/>
                <button onClick={()=>onUpdateChecklist(entry.id,mid,cf)} className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-medium">Save Changes</button>
              </>}
              {on
