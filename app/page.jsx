'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Wallet, PieChart, Settings, Plus, TrendingUp, CreditCard, 
  Users, ChevronRight, Eye, EyeOff, X, Shield, Flame, Flag,
  Sliders, FileText, Sparkles, Check, Car, Building, Briefcase
} from 'lucide-react';
import { useAppStore, formatRM } from '../stores/useAppStore';

// Card Component
const Card = ({ children, className = '', onClick }) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01 } : {}}
    whileTap={onClick ? { scale: 0.99 } : {}}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

// Progress Ring
const ProgressRing = ({ progress, size = 60, strokeWidth = 6, color = '#1e40af' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}/>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" 
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}/>
    </svg>
  );
};

// Tab Selector
const TabSelector = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-hide">
    {tabs.map(tab => (
      <button 
        key={tab.id} 
        onClick={() => onChange(tab.id)}
        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
          active === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        {tab.icon && <span className="mr-1.5">{tab.icon}</span>}{tab.label}
      </button>
    ))}
  </div>
);

// Member Selector
const MemberSelector = ({ members, selected, onSelect }) => (
  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
    <button 
      onClick={() => onSelect('all')}
      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
        selected === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
      }`}
    >
      👨‍👩‍👧 Semua
    </button>
    {members.map(m => (
      <button 
        key={m.id} 
        onClick={() => onSelect(m.id)}
        className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
          selected === m.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
        }`}
      >
        <span>{m.avatar}</span><span>{m.name}</span>
      </button>
    ))}
  </div>
);

// Balance Card
const BalanceCard = ({ totals, showBalance, toggleBalance }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-3xl p-6" 
    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)' }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-blue-200 text-sm font-medium">Jumlah Kekayaan Bersih</span>
        <button onClick={toggleBalance} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
          {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      
      <div className="text-white text-4xl font-bold tracking-tight mb-5">
        {showBalance ? formatRM(totals.netWorth) : 'RM ••••••'}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-blue-200 text-xs mb-1">Pendapatan</div>
          <div className="text-white font-semibold">{showBalance ? formatRM(totals.totalIncome) : '••••'}</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-blue-200 text-xs mb-1">Komitmen</div>
          <div className="text-white font-semibold">{showBalance ? formatRM(totals.totalCommitments) : '••••'}</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-blue-200 text-xs mb-1">Baki</div>
          <div className={`font-semibold ${totals.cashFlow >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {showBalance ? formatRM(totals.cashFlow) : '••••'}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Quick Stats
const QuickStats = ({ totals, showBalance }) => (
  <div className="grid grid-cols-2 gap-3">
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
          <TrendingUp size={20} />
        </div>
        <div>
          <div className="text-xs text-slate-400">Simpanan</div>
          <div className="font-bold text-slate-800">{showBalance ? formatRM(totals.totalSavings) : '••••'}</div>
        </div>
      </div>
    </Card>
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
          <PieChart size={20} />
        </div>
        <div>
          <div className="text-xs text-slate-400">Pelaburan</div>
          <div className="font-bold text-slate-800">{showBalance ? formatRM(totals.totalInvestments) : '••••'}</div>
        </div>
      </div>
    </Card>
  </div>
);

// Debt Progress Card
const DebtProgressCard = ({ totals, commitments, showBalance }) => {
  const sortedDebts = [...commitments].filter(c => c.totalDebt > 0).sort((a, b) => 
    (a.totalDebt - a.paidAmount) - (b.totalDebt - b.paidAmount)
  );
  const nextTarget = sortedDebts[0];
  
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Bebas Hutang</h3>
            <p className="text-xs text-slate-400">{totals.debtProgress.toFixed(0)}% selesai</p>
          </div>
        </div>
        <div className="relative">
          <ProgressRing progress={totals.debtProgress} size={50} color="#f97316" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-700">{totals.debtProgress.toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Sudah bayar</span>
          <span className="font-medium text-green-600">{showBalance ? formatRM(totals.totalPaidDebt) : '••••'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Baki hutang</span>
          <span className="font-medium text-slate-800">{showBalance ? formatRM(totals.remainingDebt) : '••••'}</span>
        </div>
      </div>
      
      {nextTarget && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <div className="text-xs text-blue-600 mb-1">Fokus seterusnya</div>
          <div className="font-medium text-blue-800">{nextTarget.name}</div>
          <div className="text-sm text-blue-600">
            Baki: {showBalance ? formatRM(nextTarget.totalDebt - nextTarget.paidAmount) : '••••'}
          </div>
        </div>
      )}
    </Card>
  );
};

// Commitment Item
const CommitmentItem = ({ item, showBalance }) => {
  const icons = {
    loan: Car,
    credit_card: CreditCard,
    utility: Building,
    subscription: Briefcase,
  };
  const IconComp = icons[item.category] || CreditCard;
  const today = new Date().getDate();
  const daysUntil = item.dueDate >= today ? item.dueDate - today : 30 - today + item.dueDate;
  const isUrgent = daysUntil <= 5;
  const progress = item.totalDebt ? ((item.paidAmount / item.totalDebt) * 100).toFixed(0) : 0;
  
  return (
    <div className="flex items-center gap-4 py-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
        <IconComp size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 text-sm">{item.name}</div>
        <div className="text-xs text-slate-400">
          {isUrgent ? <span className="text-red-500">{daysUntil} hari lagi</span> : `Setiap ${item.dueDate}hb`}
        </div>
        {item.totalDebt > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-slate-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}/>
            </div>
            <span className="text-xs text-slate-400">{progress}%</span>
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="font-semibold text-slate-800">{showBalance ? formatRM(item.amount) : '••••'}</div>
        <div className="text-xs text-slate-400">/bulan</div>
      </div>
    </div>
  );
};

// Transaction Item
const TransactionItem = ({ item, showBalance }) => {
  const icons = { food: '🍔', transport: '🚗', entertainment: '🎬', shopping: '🛍️', bills: '📄' };
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-base">
        {icons[item.category] || '💰'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-700 text-sm truncate">{item.description}</div>
        <div className="text-xs text-slate-400">{item.date}</div>
      </div>
      <div className={`font-semibold text-sm ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
        {showBalance ? formatRM(item.amount, true) : '••••'}
      </div>
    </div>
  );
};

// Zakat Card
const ZakatCard = ({ zakat, showBalance }) => {
  const isPaid = zakat.totalPaid >= zakat.totalDue;
  
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Zakat Tahunan</h3>
            <p className="text-xs text-slate-400">{isPaid ? 'Alhamdulillah, selesai' : 'Belum lengkap'}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {isPaid ? '✓ Selesai' : 'Belum'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Pendapatan', amount: zakat.incomeZakat },
          { label: 'Simpanan', amount: zakat.savingsZakat },
          { label: 'Emas', amount: zakat.goldZakat },
          { label: 'Pelaburan', amount: zakat.investmentZakat },
        ].map((item, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500">{item.label}</div>
            <div className="font-semibold text-slate-800">{showBalance ? formatRM(item.amount) : '••••'}</div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-emerald-50 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-emerald-700">Jumlah Zakat</div>
            <div className="text-2xl font-bold text-emerald-800">{showBalance ? formatRM(zakat.totalDue) : 'RM ••••'}</div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
            Bayar
          </button>
        </div>
      </div>
    </Card>
  );
};

// Faraid Card
const FaraidCard = ({ faraid, showBalance }) => {
  const beneficiaries = JSON.parse(faraid.beneficiaries || '[]');
  
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Perancangan Pusaka</h3>
          <p className="text-xs text-slate-400">Wasiat & Faraid</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${faraid.hasWasiat ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {faraid.hasWasiat ? <Check size={16} /> : <X size={16} />}
          <span className="text-sm">Wasiat</span>
        </div>
      </div>
      
      <div className="p-4 bg-indigo-50 rounded-xl mb-4">
        <div className="text-sm text-indigo-600 mb-1">Jumlah Harta</div>
        <div className="text-2xl font-bold text-indigo-800">{showBalance ? formatRM(faraid.totalAssets) : 'RM ••••'}</div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700">Simulasi Pembahagian</div>
        {beneficiaries.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="text-sm text-slate-700">{w.relation}</div>
              <div className="text-xs text-slate-400">Bahagian: {w.share}</div>
            </div>
            <div className="font-semibold text-slate-800">{showBalance ? formatRM(w.amount) : '••••'}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Budget Card
const BudgetCard = ({ budget, totalIncome, showBalance }) => {
  const amounts = {
    needs: (totalIncome * budget.needsPercentage) / 100,
    wants: (totalIncome * budget.wantsPercentage) / 100,
    savings: (totalIncome * budget.savingsPercentage) / 100,
  };
  
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          <Sliders size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Bajet Bulanan</h3>
          <p className="text-xs text-slate-400">Peraturan 50/30/20</p>
        </div>
      </div>
      
      <div className="h-3 rounded-full overflow-hidden flex mb-4">
        <div style={{ width: `${budget.needsPercentage}%`, backgroundColor: '#3b82f6' }} className="h-full"/>
        <div style={{ width: `${budget.wantsPercentage}%`, backgroundColor: '#f59e0b' }} className="h-full"/>
        <div style={{ width: `${budget.savingsPercentage}%`, backgroundColor: '#10b981' }} className="h-full"/>
      </div>
      
      <div className="space-y-3">
        {[
          { label: 'Keperluan', pct: budget.needsPercentage, amount: amounts.needs, color: '#3b82f6', icon: '🏠' },
          { label: 'Kehendak', pct: budget.wantsPercentage, amount: amounts.wants, color: '#f59e0b', icon: '🎮' },
          { label: 'Simpanan', pct: budget.savingsPercentage, amount: amounts.savings, color: '#10b981', icon: '💰' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="text-slate-700">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="font-bold" style={{ color: item.color }}>{item.pct}%</span>
              <span className="text-slate-400 text-sm ml-2">{showBalance ? formatRM(item.amount) : '••••'}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Goals Card
const GoalsCard = ({ goals, showBalance }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
          <Flag size={20} />
        </div>
        <h3 className="font-semibold text-slate-800">Matlamat Kewangan</h3>
      </div>
    </div>
    
    <div className="space-y-4">
      {goals.slice(0, 3).map(goal => {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        return (
          <div key={goal.id} className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium text-slate-800 text-sm">{goal.name}</div>
                <div className="text-xs text-slate-400">{goal.type === 'short' ? 'Jangka Pendek' : 'Jangka Panjang'}</div>
              </div>
              <div className="font-bold text-slate-800">{progress.toFixed(0)}%</div>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }}/>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{showBalance ? formatRM(goal.currentAmount) : '••••'}</span>
              <span>{showBalance ? formatRM(goal.targetAmount) : '••••'}</span>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

// Insurance Card
const InsuranceCard = ({ insurance, showBalance }) => {
  const monthlyTotal = insurance.reduce((sum, i) => sum + i.premium, 0);
  
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Perlindungan</h3>
            <p className="text-xs text-slate-400">{showBalance ? formatRM(monthlyTotal) : '••••'}/bulan</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {insurance.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <div className="font-medium text-slate-800 text-sm">{item.name}</div>
              <div className="text-xs text-slate-400">{item.provider} {item.isTakaful && '• Takaful'}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">{showBalance ? formatRM(item.coverage) : '••••'}</div>
              <div className="text-xs text-slate-400">coverage</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Quick Add Modal
const QuickAddModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('food');
  
  const categories = [
    { id: 'food', label: 'Makanan', icon: '🍔' },
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'bills', label: 'Bil', icon: '📄' },
    { id: 'entertainment', label: 'Hiburan', icon: '🎬' },
    { id: 'other', label: 'Lain-lain', icon: '📦' },
  ];
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" 
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: '100%' }} 
          animate={{ y: 0 }} 
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()} 
          className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Tambah Transaksi</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button 
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Perbelanjaan
            </button>
            <button 
              onClick={() => setType('income')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Pendapatan
            </button>
          </div>
          
          <div className="mb-6">
            <label className="text-sm text-slate-500 mb-2 block">Jumlah (RM)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="0.00"
              className="w-full text-3xl font-bold text-slate-800 bg-slate-50 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="text-sm text-slate-500 mb-2 block">Keterangan</label>
            <input 
              type="text" 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              placeholder="Contoh: Makan tengahari"
              className="w-full text-slate-800 bg-slate-50 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {type === 'expense' && (
            <div className="mb-6">
              <label className="text-sm text-slate-500 mb-3 block">Kategori</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      category === cat.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs text-slate-600">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
            Simpan
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Dashboard Screen
const DashboardScreen = () => {
  const { 
    household, members, commitments, transactions, totals, 
    showBalance, toggleBalance, selectedMember, setSelectedMember 
  } = useAppStore();
  
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-400 text-sm">Selamat datang 👋</div>
          <h1 className="text-2xl font-bold text-slate-800">{household.name}</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Users size={20} />
        </button>
      </div>
      
      <MemberSelector members={members} selected={selectedMember} onSelect={setSelectedMember} />
      <BalanceCard totals={totals} showBalance={showBalance} toggleBalance={toggleBalance} />
      <QuickStats totals={totals} showBalance={showBalance} />
      <DebtProgressCard totals={totals} commitments={commitments} showBalance={showBalance} />
      
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Komitmen Bulanan</h3>
          <button className="text-blue-600 text-sm font-medium flex items-center">
            Semua <ChevronRight size={16} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {commitments.slice(0, 3).map(item => (
            <CommitmentItem key={item.id} item={item} showBalance={showBalance} />
          ))}
        </div>
      </Card>
      
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Transaksi Terkini</h3>
          <button className="text-blue-600 text-sm font-medium flex items-center">
            Semua <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {transactions.slice(0, 4).map(item => (
            <TransactionItem key={item.id} item={item} showBalance={showBalance} />
          ))}
        </div>
      </Card>
    </div>
  );
};

// Planner Screen
const PlannerScreen = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const { budgetSettings, goals, insurance, zakat, totals, showBalance } = useAppStore();
  
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Perancang</h1>
        <p className="text-slate-400">Rancang & capai matlamat kewangan</p>
      </div>
      
      <TabSelector
        tabs={[
          { id: 'budget', icon: '💰', label: 'Bajet' },
          { id: 'goals', icon: '🎯', label: 'Matlamat' },
          { id: 'insurance', icon: '🛡️', label: 'Insurans' },
          { id: 'zakat', icon: '✨', label: 'Zakat' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'budget' && <BudgetCard budget={budgetSettings} totalIncome={totals.totalIncome} showBalance={showBalance} />}
      {activeTab === 'goals' && <GoalsCard goals={goals} showBalance={showBalance} />}
      {activeTab === 'insurance' && <InsuranceCard insurance={insurance} showBalance={showBalance} />}
      {activeTab === 'zakat' && <ZakatCard zakat={zakat} showBalance={showBalance} />}
    </div>
  );
};

// Savings Screen
const SavingsScreen = () => {
  const [activeTab, setActiveTab] = useState('savings');
  const { savings, investments, faraid, totals, showBalance } = useAppStore();
  
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Simpanan & Pelaburan</h1>
        <p className="text-slate-400">Pantau pertumbuhan kekayaan</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-xs text-slate-400">Simpanan</div>
          <div className="text-xl font-bold text-slate-800">{showBalance ? formatRM(totals.totalSavings) : '••••'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-400">Pelaburan</div>
          <div className="text-xl font-bold text-slate-800">{showBalance ? formatRM(totals.totalInvestments) : '••••'}</div>
        </Card>
      </div>
      
      <TabSelector
        tabs={[
          { id: 'savings', label: 'Simpanan' },
          { id: 'investments', label: 'Pelaburan' },
          { id: 'faraid', label: 'Pusaka' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'savings' && (
        <Card className="p-5">
          <div className="space-y-4">
            {savings.map(item => {
              const progress = (item.currentAmount / item.targetAmount) * 100;
              return (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="font-bold text-blue-600">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}/>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{showBalance ? formatRM(item.currentAmount) : '••••'}</span>
                    <span>{showBalance ? formatRM(item.targetAmount) : '••••'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {activeTab === 'investments' && (
        <Card className="p-5">
          <div className="space-y-3">
            {investments.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">{showBalance ? formatRM(item.currentValue) : '••••'}</div>
                  {item.isHalal && <span className="text-xs text-green-600">✓ Patuh Shariah</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {activeTab === 'faraid' && <FaraidCard faraid={faraid} showBalance={showBalance} />}
    </div>
  );
};

// Settings Screen
const SettingsScreen = () => {
  const { household } = useAppStore();
  
  const items = [
    { icon: '👤', label: 'Profil Akaun', desc: 'Nama, email' },
    { icon: '👨‍👩‍👧', label: 'Ahli Keluarga', desc: 'Urus ahli' },
    { icon: '🏦', label: 'Akaun Bank', desc: 'Sync bank' },
    { icon: '🔔', label: 'Notifikasi', desc: 'Peringatan' },
    { icon: '📊', label: 'Eksport', desc: 'Laporan' },
  ];
  
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tetapan</h1>
        <p className="text-slate-400">Urus akaun anda</p>
      </div>
      
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
            {household.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{household.name}</div>
            <div className="text-sm text-slate-400">Demo Mode</div>
          </div>
          <button className="ml-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium">
            Login
          </button>
        </div>
      </Card>
      
      <Card className="divide-y divide-slate-100">
        {items.map((item, i) => (
          <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{item.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-medium text-slate-700">{item.label}</div>
              <div className="text-sm text-slate-400">{item.desc}</div>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        ))}
      </Card>
      
      <div className="text-center text-sm text-slate-400">MyDuit v6.0.0 (Appwrite)</div>
    </div>
  );
};

// Bottom Nav
const BottomNav = ({ active, setActive }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Utama' },
    { id: 'planner', icon: Wallet, label: 'Perancang' },
    { id: 'savings', icon: PieChart, label: 'Simpanan' },
    { id: 'settings', icon: Settings, label: 'Tetapan' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 z-30 safe-bottom">
      <div className="flex justify-around max-w-lg mx-auto">
        {items.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              active === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${active === item.id ? 'bg-blue-50' : ''}`}>
              <item.icon size={22} />
            </div>
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// FAB
const FAB = ({ onClick }) => (
  <motion.button 
    initial={{ scale: 0 }} 
    animate={{ scale: 1 }} 
    whileHover={{ scale: 1.1 }} 
    whileTap={{ scale: 0.9 }}
    onClick={onClick} 
    className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center z-40"
  >
    <Plus size={24} />
  </motion.button>
);

// Main App
export default function MyDuitApp() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/30">
            M
          </div>
          <div className="text-slate-800 font-semibold">MyDuit</div>
          <div className="text-slate-400 text-sm">Memuatkan...</div>
        </motion.div>
      </div>
    );
  }
  
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <DashboardScreen />;
      case 'planner': return <PlannerScreen />;
      case 'savings': return <SavingsScreen />;
      case 'settings': return <SettingsScreen />;
      default: return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-28">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeScreen} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <FAB onClick={() => setShowQuickAdd(true)} />
      <BottomNav active={activeScreen} setActive={setActiveScreen} />
      <QuickAddModal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} />
    </div>
  );
}
