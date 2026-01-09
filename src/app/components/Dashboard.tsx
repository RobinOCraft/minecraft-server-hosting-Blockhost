import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { PaymentReminderAlert } from './PaymentReminderAlert';
import { PaymentWarning1Alert } from './PaymentWarning1Alert';
import { PaymentWarning2Alert } from './PaymentWarning2Alert';
import { PaymentWarning3Alert } from './PaymentWarning3Alert';
import { ServerSuspendedAlert } from './ServerSuspendedAlert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { 
  Server, 
  Power, 
  RotateCcw, 
  Settings, 
  Users, 
  HardDrive, 
  Cpu, 
  Activity,
  FileText,
  Download,
  Upload,
  Terminal,
  LogOut,
  Home,
  CreditCard,
  Database,
  Shield,
  Clock,
  TrendingUp,
  ChevronRight,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Folder,
  File,
  Trash2,
  Edit,
  Menu,
  Plus,
  X,
  Network,
  ArrowUpCircle,
  Crown,
  Globe,
  Copy,
  Info,
  ShoppingCart,
  RefreshCw,
  ChevronLeft,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSelector } from './LanguageSelector';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
  onLogout?: () => void;
  onBackToHome?: () => void;
}

type TabType = 'overview' | 'console' | 'files' | 'settings' | 'backups' | 'billing';
type Currency = 'CHF' | 'USD' | 'EUR';

export function Dashboard({ onLogout, onBackToHome }: DashboardProps) {
  const { t } = useLanguage();
  const { user, updateUserPlan } = useUser();
  const { cart, setIsCartOpen } = useCart();
  
  // Check if user is admin or owner (gets everything free)
  const isOwner = user?.isOwner || false;
  const isAdmin = user?.isAdmin || false;
  const isPrivileged = isOwner || isAdmin;
  
  // Track if component is mounted to prevent initial logs
  const [isMounted, setIsMounted] = useState(false);
  
  // Helper functions to load/save dashboard data per user
  const getDashboardStorageKey = (key: string) => {
    return `blockhost_dashboard_${user?.email || 'default'}_${key}`;
  };
  
  const loadDashboardData = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined' || !user?.email) return defaultValue;
    try {
      const stored = localStorage.getItem(getDashboardStorageKey(key));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
    }
    return defaultValue;
  };
  
  const saveDashboardData = (key: string, value: any) => {
    if (typeof window === 'undefined' || !user?.email) return;
    try {
      localStorage.setItem(getDashboardStorageKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  };
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'starting' | 'stopping'>(() => 
    loadDashboardData('serverStatus', 'offline')
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chartTimeRange, setChartTimeRange] = useState<'10m' | '30m' | '1h' | '2h' | '3h' | '4h' | '5h' | '12h' | '24h' | '48h' | '72h' | '1w'>('1h');
  
  // Live uptime tracking
  const [serverStartTime, setServerStartTime] = useState<Date>(() => {
    const stored = loadDashboardData('serverStartTime', null);
    return stored ? new Date(stored) : new Date();
  });
  const [liveUptime, setLiveUptime] = useState<string>('0m 0s')
  
  // Currency state and exchange rates
  const [currency, setCurrency] = useState<Currency>('CHF');
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currencyRates, setCurrencyRates] = useState({
    CHF: 1,
    USD: 1.12,  // Fallback values
    EUR: 0.95
  });
  
  // Fetch live exchange rates
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/CHF');
      const data = await response.json();
      
      if (data && data.rates) {
        setCurrencyRates({
          CHF: 1,
          USD: data.rates.USD || 1.12,
          EUR: data.rates.EUR || 0.95
        });
        setLastUpdated(new Date());
        toast.success('Wechselkurse aktualisiert');
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      toast.error('Wechselkurse konnten nicht aktualisiert werden. Verwende Standardwerte.');
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Save server status to localStorage when it changes
  useEffect(() => {
    if (user?.email && isMounted) {
      saveDashboardData('serverStatus', serverStatus);
    }
  }, [serverStatus, user?.email, isMounted]);
  
  // Save server start time to localStorage when it changes
  useEffect(() => {
    if (user?.email && isMounted) {
      saveDashboardData('serverStartTime', serverStartTime.toISOString());
    }
  }, [serverStartTime, user?.email, isMounted]);
  
  // Fetch rates on settings tab open
  useEffect(() => {
    if (activeTab === 'settings') {
      fetchExchangeRates();
    }
  }, [activeTab]);
  
  // Live uptime updater - updates every second
  useEffect(() => {
    const updateUptime = () => {
      // Only update uptime if server is online
      if (serverStatus !== 'online') {
        return;
      }
      
      const now = new Date();
      const diff = now.getTime() - serverStartTime.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      let uptimeString = '';
      if (days > 0) uptimeString += `${days}d `;
      if (hours > 0 || days > 0) uptimeString += `${hours}h `;
      uptimeString += `${minutes}m ${seconds}s`;
      
      setLiveUptime(uptimeString.trim());
    };
    
    // Update immediately
    updateUptime();
    
    // Then update every second
    const interval = setInterval(updateUptime, 1000);
    
    return () => clearInterval(interval);
  }, [serverStartTime, serverStatus]);
  
  // Currency conversion helper
  const convertAmount = (amount: number) => {
    return amount * currencyRates[currency];
  };
  
  // Format currency display
  const formatCurrency = (amount: number) => {
    const convertedAmount = convertAmount(amount);
    const symbols = { CHF: 'CHF', USD: '$', EUR: '€' };
    const symbol = symbols[currency];
    
    if (currency === 'CHF') {
      return `${symbol} ${convertedAmount.toFixed(2)}`;
    } else {
      return `${symbol}${convertedAmount.toFixed(2)}`;
    }
  };
  
  // Format network speed display (bit/s, kbit/s or Mbit/s)
  const formatNetworkSpeed = (kbitsPerSecond: number): string => {
    if (kbitsPerSecond >= 1000) {
      const mbits = kbitsPerSecond / 1000;
      return `${mbits.toFixed(1)} Mbit/s`;
    } else if (kbitsPerSecond >= 1) {
      return `${Math.round(kbitsPerSecond)} kbit/s`;
    } else {
      // Display in bit/s for values under 1 kbit/s
      const bits = Math.round(kbitsPerSecond * 1000);
      return `${bits} bit/s`;
    }
  };
  
  // Format total traffic (MB, GB, or TB) - no decimal places
  const formatTraffic = (gb: number): string => {
    if (gb >= 1000) {
      // Display in TB
      const tb = Math.round(gb / 1000);
      return `${tb} TB`;
    } else if (gb >= 1) {
      // Display in GB
      const gbRounded = Math.round(gb);
      return `${gbRounded} GB`;
    } else {
      // Display in MB
      const mb = Math.round(gb * 1024);
      return `${mb} MB`;
    }
  };
  
  const [consoleLog, setConsoleLog] = useState<string[]>(() => 
    loadDashboardData('consoleLog', [])
  );
  const [consoleInput, setConsoleInput] = useState('');
  const [gameMode, setGameMode] = useState<'survival' | 'creative' | 'adventure' | 'spectator' | 'hardcore'>(() =>
    loadDashboardData('gameMode', 'survival')
  );
  const [difficulty, setDifficulty] = useState<'peaceful' | 'easy' | 'normal' | 'hard'>(() =>
    loadDashboardData('difficulty', 'normal')
  );
  const [minecraftVersion, setMinecraftVersion] = useState(() =>
    loadDashboardData('minecraftVersion', '1.21.11')
  );
  const [autoUpdate, setAutoUpdate] = useState(() =>
    loadDashboardData('autoUpdate', true)
  );
  const [serverType, setServerType] = useState<'vanilla' | 'paper' | 'forge' | 'fabric' | 'neoforge' | 'quilt'>(() =>
    loadDashboardData('serverType', 'vanilla')
  );
  
  // Server Settings
  const [maxPlayers, setMaxPlayers] = useState(() =>
    loadDashboardData('maxPlayers', 20)
  );
  const [renderDistance, setRenderDistance] = useState(() =>
    loadDashboardData('renderDistance', 10)
  );
  
  // Server Connection Details
  const serverIp = `${user?.email?.split('@')[0] || 'server'}.blockhosts.org`;
  const serverPort = 25565;
  const rconPort = 25575;
  const [rconPassword, setRconPassword] = useState(() => {
    const saved = localStorage.getItem(`dashboard_${user?.email || 'default'}_rconPassword`);
    return saved || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  });
  
  // Server Name and MOTD
  const [serverName, setServerName] = useState(() => {
    const saved = localStorage.getItem(`dashboard_${user?.email || 'default'}_serverName`);
    return saved || 'Mein Minecraft Server';
  });
  const [motd, setMotd] = useState(() => {
    const saved = localStorage.getItem(`dashboard_${user?.email || 'default'}_motd`);
    return saved || 'Willkommen auf meinem Server!';
  });
  
  // Whitelist
  const [whitelist, setWhitelist] = useState(false);
  const [whitelistedPlayers, setWhitelistedPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // Plan Management
  const [currentPlan, setCurrentPlan] = useState<'basic' | 'pro' | 'premium' | 'enterprise'>(() => {
    // Initialize from user's current plan or default to 'basic'
    return user?.currentPlan?.toLowerCase() as 'basic' | 'pro' | 'premium' | 'enterprise' || 'basic';
  });
  const [showPlanChangeDialog, setShowPlanChangeDialog] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<'basic' | 'pro' | 'premium' | 'enterprise' | null>(null);
  
  // Enterprise custom configuration
  const [enterpriseRam, setEnterpriseRam] = useState(() => {
    // First check if user has a saved config from purchase
    if (user?.planConfig?.ram) return user.planConfig.ram;
    const saved = localStorage.getItem(`dashboard_${user?.email || 'default'}_enterpriseRam`);
    return saved ? parseInt(saved) : 2;
  });
  const [enterpriseCpu, setEnterpriseCpu] = useState(() => {
    // First check if user has a saved config from purchase
    if (user?.planConfig?.cpu) return user.planConfig.cpu;
    const saved = localStorage.getItem(`dashboard_${user?.email || 'default'}_enterpriseCpu`);
    return saved ? parseInt(saved) : 2;
  });
  const [enterpriseStorage, setEnterpriseStorage] = useState(() => {
    // First check if user has a saved config from purchase
    if (user?.planConfig?.storage) return user.planConfig.storage;
    const saved = localStorage.getItem(`dashboard_${user?.email || 'default'}_enterpriseStorage`);
    return saved ? parseInt(saved) : 15;
  });
  
  // Temporary Enterprise config (for confirmation dialog)
  const [tempEnterpriseRam, setTempEnterpriseRam] = useState(2);
  const [tempEnterpriseCpu, setTempEnterpriseCpu] = useState(2);
  const [tempEnterpriseStorage, setTempEnterpriseStorage] = useState(15);
  const [showEnterpriseConfigDialog, setShowEnterpriseConfigDialog] = useState(false);
  
  // Priority Support state
  const [hasPrioritySupport, setHasPrioritySupport] = useState(false);
  const [prioritySupportPending, setPrioritySupportPending] = useState(false);
  const [prioritySupportActivationDate, setPrioritySupportActivationDate] = useState<Date | null>(null);
  
  // Extra Backup Slots (0.20 CHF per slot)
  const [extraBackupSlots, setExtraBackupSlots] = useState(0);
  
  // Resource monitoring
  const [lastNotifiedLevels, setLastNotifiedLevels] = useState({
    cpu: 0,
    ram: 0,
    storage: 0
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB in bytes
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Available Minecraft versions (comprehensive list)
  const minecraftVersions = [
    // 1.21.x (Latest)
    '1.21.11', '1.21.10', '1.21.9', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21',
    // 1.20.x
    '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
    // 1.19.x
    '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
    // 1.18.x
    '1.18.2', '1.18.1', '1.18',
    // 1.17.x
    '1.17.1', '1.17',
    // 1.16.x
    '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16',
    // 1.15.x
    '1.15.2', '1.15.1', '1.15',
    // 1.14.x
    '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14',
    // 1.13.x
    '1.13.2', '1.13.1', '1.13',
    // 1.12.x (sehr beliebt für Modding)
    '1.12.2', '1.12.1', '1.12',
    // 1.11.x
    '1.11.2', '1.11.1', '1.11',
    // 1.10.x
    '1.10.2', '1.10.1', '1.10',
    // 1.9.x
    '1.9.4', '1.9.3', '1.9.2', '1.9.1', '1.9',
    // 1.8.x (sehr beliebt für PvP)
    '1.8.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8.2', '1.8.1', '1.8',
    // Legacy versions
    '1.7.10', '1.7.9', '1.7.8', '1.7.7', '1.7.6', '1.7.5', '1.7.4', '1.7.2',
  ];

  // Server type descriptions
  const serverTypeInfo = {
    vanilla: {
      name: 'Vanilla',
      icon: '⛏️',
      description: 'Original Minecraft Server von Mojang',
      color: 'bg-gray-600',
    },
    paper: {
      name: 'Paper',
      icon: '📄',
      description: 'Optimiert für Performance & Plugins',
      color: 'bg-blue-600',
    },
    forge: {
      name: 'Forge',
      icon: '🔥',
      description: 'Klassisches Mod-Loading (1.7 - 1.20.1)',
      color: 'bg-orange-600',
    },
    fabric: {
      name: 'Fabric',
      icon: '🧵',
      description: 'Modernes Mod-Loading (1.14+)',
      color: 'bg-purple-600',
    },
    neoforge: {
      name: 'NeoForge',
      icon: '🔱',
      description: 'Nachfolger von Forge (1.20.2+)',
      color: 'bg-red-600',
    },
    quilt: {
      name: 'Quilt',
      icon: '🪡',
      description: 'Fork von Fabric (1.18+)',
      color: 'bg-pink-600',
    },
  };

  // Handle game mode change
  const handleGameModeChange = (mode: typeof gameMode) => {
    setGameMode(mode);
    if (mode === 'hardcore') {
      setDifficulty('hard');
    }
    
    // Add console log when server is online
    if (serverStatus === 'online') {
      addConsoleLog(`⚙️ Spielmodus geändert zu: ${mode}`);
      toast.success(`Spielmodus auf ${mode} geändert!`);
    }
  };

  // Handle difficulty change
  const handleDifficultyChange = (diff: typeof difficulty) => {
    setDifficulty(diff);
    
    // Add console log when server is online
    if (serverStatus === 'online') {
      addConsoleLog(`⚙️ Schwierigkeit geändert zu: ${diff}`);
      toast.success(`Schwierigkeit auf ${diff} geändert!`);
    }
  };

  // Calculate Enterprise backups based on configuration
  const calculateEnterpriseBackups = (ram: number, cpu: number, storage: number) => {
    return Math.min(20, Math.max(5, Math.floor(5 + ram / 2 + cpu / 2 + storage / 10)));
  };

  // Plan information
  const planInfo = {
    basic: {
      name: 'Basic',
      price: 5,
      ram: 2,
      cpu: 2,
      storage: 10,
      backups: 5,
      color: 'bg-blue-600',
    },
    pro: {
      name: 'Pro',
      price: 12,
      ram: 4,
      cpu: 4,
      storage: 25,
      backups: 10,
      color: 'bg-purple-600',
    },
    premium: {
      name: 'Premium',
      price: 24,
      ram: 8,
      cpu: 6,
      storage: 50,
      backups: 15,
      color: 'bg-green-600',
    },
    enterprise: {
      name: 'Enterprise',
      price: enterpriseRam * 1.5 + enterpriseCpu * 1.5 + enterpriseStorage * 0.1,
      ram: enterpriseRam,
      cpu: enterpriseCpu,
      storage: enterpriseStorage,
      backups: calculateEnterpriseBackups(enterpriseRam, enterpriseCpu, enterpriseStorage),
      color: 'bg-amber-600',
    },
  };

  // Calculate total monthly cost including extras
  const calculateTotalMonthlyCost = () => {
    if (isPrivileged) return 0; // Admin/Owner gets everything free
    
    const basePlanCost = planInfo[currentPlan].price;
    const backupSlotsCost = extraBackupSlots * 0.20;
    
    return basePlanCost + backupSlotsCost;
  };

  // Handle plan change
  const handlePlanChange = (newPlan: 'basic' | 'pro' | 'premium' | 'enterprise') => {
    setSelectedNewPlan(newPlan);
    setShowPlanChangeDialog(true);
  };

  const confirmPlanChange = () => {
    if (!selectedNewPlan) return;
    
    const oldPlan = currentPlan;
    setCurrentPlan(selectedNewPlan);
    setShowPlanChangeDialog(false);
    
    // Update user's plan in UserContext
    const capitalizedPlan = selectedNewPlan.charAt(0).toUpperCase() + selectedNewPlan.slice(1) as 'Basic' | 'Pro' | 'Premium' | 'Enterprise';
    updateUserPlan(capitalizedPlan);
    
    const isUpgrade = planInfo[selectedNewPlan].price > planInfo[oldPlan].price;
    const planName = planInfo[selectedNewPlan].name;
    const price = isPrivileged ? '0.00' : planInfo[selectedNewPlan].price.toFixed(2);
    
    // Log plan change to console
    addConsoleLog(`═══════════════════════════════════════════════════`);
    addConsoleLog(`Plan ${isUpgrade ? 'UPGRADE' : 'CHANGE'}: ${oldPlan.toUpperCase()} → ${selectedNewPlan.toUpperCase()}`);
    addConsoleLog(`Plan Name: ${planName}`);
    if (isPrivileged) {
      addConsoleLog(`Preis: CHF 0.00/Monat (${user?.isOwner ? 'Owner' : 'Admin'} - Kostenlos)`);
    } else {
      addConsoleLog(`Preis: CHF ${price}/Monat`);
    }
    const resources = getPlanResources(selectedNewPlan);
    addConsoleLog(`Neue Ressourcen - RAM: ${resources.ram}GB, CPU: ${resources.cpu} Cores, Storage: ${resources.storage}GB`);
    addConsoleLog(`Status: ${isUpgrade ? 'Sofort verfügbar' : 'Ab nächster Abrechnung'}`);
    addConsoleLog(`═══════════════════════════════════════════════════`);
    
    if (isPrivileged) {
      toast.success(`👑 ${user?.isOwner ? 'Owner' : 'Admin'}: Plan auf ${planName} aktualisiert - Kostenlos! Neue Ressourcen sind sofort verfügbar.`, {
        duration: 6000,
      });
    } else if (isUpgrade) {
      toast.success(`🚀 Plan auf ${planName} (CHF ${price}/Monat) aktualisiert! Neue Ressourcen sind sofort verfügbar.`, {
        duration: 6000,
      });
    } else {
      toast.success(`✅ Plan auf ${planName} (CHF ${price}/Monat) geändert. Änderung wird ab nächster Abrechnung wirksam.`, {
        duration: 6000,
      });
    }
    
    setSelectedNewPlan(null);
  };

  // Handle server type change
  const handleServerTypeChange = (type: typeof serverType) => {
    setServerType(type);
    saveDashboardData('serverType', type);
    
    const serverInfo = serverTypeInfo[type];
    toast.success(`${serverInfo.icon} Server-Typ geändert zu ${serverInfo.name}!`, {
      description: `${serverInfo.description} • Beim nächsten Server-Start wird automatisch ${serverInfo.name} ${minecraftVersion} heruntergeladen.`,
      duration: 5000,
    });
  };

  // Mock server data - dynamically updates based on currentPlan
  const getPlanResources = (planName: 'basic' | 'pro' | 'premium' | 'enterprise') => {
    // If user has a saved config from checkout, use that
    if (user?.planConfig) {
      return { 
        ram: user.planConfig.ram, 
        cpu: user.planConfig.cpu, 
        storage: user.planConfig.storage 
      };
    }
    
    // Otherwise use default plan resources
    switch (planName) {
      case 'basic':
        return { ram: 2, cpu: 2, storage: 10 };
      case 'pro':
        return { ram: 4, cpu: 4, storage: 25 };
      case 'premium':
        return { ram: 8, cpu: 6, storage: 50 };
      case 'enterprise':
        return { ram: enterpriseRam, cpu: enterpriseCpu, storage: enterpriseStorage };
      default:
        return { ram: 2, cpu: 2, storage: 10 };
    }
  };

  const planResources = getPlanResources(currentPlan);
  
  const serverData = {
    name: serverName,
    plan: currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1) as 'Basic' | 'Pro' | 'Premium' | 'Enterprise',
    ram: planResources.ram,
    cpu: planResources.cpu,
    storage: planResources.storage,
    maxPlayers: maxPlayers,
    currentPlayers: 12,
    uptime: liveUptime,
    version: '1.21.11',
    ip: `${user?.username || 'user'}.blockhosts.org`,
    port: '25565',
  };

  // Calculate storage percentage from GB values
  const getStoragePercentage = () => {
    return (stats.storage / serverData.storage) * 100;
  };

  // Get render distance performance threshold based on CPU cores
  const getRenderDistanceThreshold = (cores: number): number => {
    if (cores <= 3) return 8;  // 1-3 cores: max 8 chunks
    if (cores === 4) return 12; // 4 cores: max 12 chunks
    if (cores === 5) return 14; // 5 cores: max 14 chunks
    return 16; // 6+ cores: max 16 chunks
  };

  // Get maximum recommended players based on CPU cores and render distance
  const getMaxPlayersThreshold = (cores: number, renderDist: number): number => {
    // Base limits per CPU core
    let baseLimit = 0;
    if (cores === 1) baseLimit = 8;
    else if (cores === 2) baseLimit = 10;
    else if (cores === 3) baseLimit = 16;
    else if (cores === 4) baseLimit = 20;
    else if (cores === 5) baseLimit = 30;
    else if (cores >= 6) baseLimit = 40;

    // Reduce limit based on render distance
    // High render distance = more server load = fewer players
    const renderDistanceMultiplier = renderDist > 16 ? 0.7 : renderDist > 12 ? 0.85 : 1.0;
    
    return Math.floor(baseLimit * renderDistanceMultiplier);
  };

  // Backup configuration based on plan - dynamically updates with plan changes
  const getBackupConfig = () => {
    let baseMaxBackups = 0;
    
    switch (serverData.plan) {
      case 'Basic':
        baseMaxBackups = 5;
        return {
          frequency: 'Tägliche Backups',
          description: 'Tägliche automatische Backups um 03:00 Uhr',
          canCreateManual: false,
          retentionDays: 7,
          maxBackups: baseMaxBackups + extraBackupSlots,
          baseMaxBackups: baseMaxBackups,
        };
      case 'Pro':
        baseMaxBackups = 7;
        return {
          frequency: 'Stündliche Backups',
          description: 'Stündliche automatische Backups + Manuelle Backups',
          canCreateManual: true,
          retentionDays: 10,
          maxBackups: baseMaxBackups + extraBackupSlots,
          baseMaxBackups: baseMaxBackups,
        };
      case 'Premium':
        baseMaxBackups = 10;
        return {
          frequency: 'Echtzeit-Backups',
          description: 'Echtzeit-Backups bei wichtigen Änderungen + Manuelle Backups',
          canCreateManual: true,
          retentionDays: 14,
          maxBackups: baseMaxBackups + extraBackupSlots,
          baseMaxBackups: baseMaxBackups,
        };
      case 'Enterprise':
        baseMaxBackups = planInfo.enterprise.backups;
        return {
          frequency: 'Echtzeit-Backups',
          description: 'Echtzeit-Backups + Unbegrenzte manuelle Backups',
          canCreateManual: true,
          retentionDays: 30,
          maxBackups: baseMaxBackups + extraBackupSlots,
          baseMaxBackups: baseMaxBackups,
        };
    }
  };

  const backupConfig = getBackupConfig();

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      toast.error(`Datei ist zu groß! (${sizeInGB} GB). Maximale Größe: 10 GB`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const currentDate = new Date().toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    const fileSizeFormatted = formatFileSize(file.size);
    const tempFileName = file.name;

    // Add file immediately with uploading status
    const newFile = {
      name: tempFileName,
      type: 'file' as const,
      size: fileSizeFormatted,
      modified: currentDate,
      path: currentPath,
      uploading: true,
      uploadProgress: 0
    };
    
    setFiles(prev => [...prev, newFile]);

    // Simulate upload
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        
        // Update file progress in list
        setFiles(current => 
          current.map(f => 
            f.name === tempFileName && f.uploading 
              ? { ...f, uploadProgress: newProgress }
              : f
          )
        );
        
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Mark file as complete
          setFiles(current => 
            current.map(f => 
              f.name === tempFileName && f.uploading
                ? { ...f, uploading: false, uploadProgress: undefined }
                : f
            )
          );
          
          toast.success(`${file.name} erfolgreich hochgeladen!`);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return 0;
        }
        return newProgress;
      });
    }, 200);
  };

  // Folder upload handler
  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    // Convert FileList to array
    const filesArray = Array.from(fileList);
    
    // Calculate total size
    const totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
    
    // Check total size
    if (totalSize > MAX_FILE_SIZE) {
      const sizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
      toast.error(`Ordner ist zu groß! (${sizeInGB} GB). Maximale Größe: 10 GB`);
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
      }
      return;
    }

    // Get folder name from first file's path
    const firstPath = filesArray[0].webkitRelativePath;
    const folderName = firstPath.split('/')[0];

    const currentDate = new Date().toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    const folderSizeFormatted = formatFileSize(totalSize);

    // Add folder immediately with uploading status
    setFiles(prev => [...prev, {
      name: folderName,
      type: 'folder',
      size: folderSizeFormatted,
      modified: currentDate,
      path: currentPath,
      uploading: true,
      uploadProgress: 0
    }]);

    // Simulate upload
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        
        // Update folder progress in list
        setFiles(current => 
          current.map(f => 
            f.name === folderName && f.uploading 
              ? { ...f, uploadProgress: newProgress }
              : f
          )
        );
        
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Mark folder as complete
          setFiles(current => 
            current.map(f => 
              f.name === folderName && f.uploading
                ? { ...f, uploading: false, uploadProgress: undefined }
                : f
            )
          );
          
          toast.success(`Ordner "${folderName}" mit ${filesArray.length} Dateien erfolgreich hochgeladen!`);
          if (folderInputRef.current) {
            folderInputRef.current.value = '';
          }
          return 0;
        }
        return newProgress;
      });
    }, 200);
  };

  // Download file handler
  const handleFileDownload = (file: { name: string; type: 'file' | 'folder'; size: string; modified: string }) => {
    if (file.type === 'folder') {
      toast.error('Ordner können nicht direkt heruntergeladen werden. Bitte erstellen Sie ein Backup.');
      return;
    }

    // Create a simulated file download
    const fileContent = `BlockHost Server File: ${file.name}\nGröße: ${file.size}\nGeändert: ${file.modified}\n\nDies ist eine simulierte Datei von Ihrem Minecraft Server.`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`${file.name} wird heruntergeladen...`);
  };

  // Delete file handler
  const handleFileDelete = (fileName: string, fileSize: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
    
    // Storage will be auto-calculated by useEffect
    toast.success(`${fileName} wurde gelöscht`);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Parse file size string back to GB
  const parseSizeToGB = (sizeStr: string): number => {
    if (!sizeStr || sizeStr === '-') return 0;
    
    const match = sizeStr.match(/^([\d.]+)\s*(Bytes|KB|MB|GB)$/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'Bytes':
        return value / (1024 * 1024 * 1024);
      case 'KB':
        return value / (1024 * 1024);
      case 'MB':
        return value / 1024;
      case 'GB':
        return value;
      default:
        return 0;
    }
  };

  // Calculate total storage from all files
  const calculateTotalStorage = (): number => {
    return files.reduce((total, file) => {
      return total + parseSizeToGB(file.size);
    }, 0);
  };

  // Create folder handler
  const handleCreateFolder = () => {
    const trimmedName = newFolderName.trim();
    
    if (!trimmedName) {
      toast.error('Bitte geben Sie einen Ordnernamen ein');
      return;
    }

    // Validate folder name - only allow alphanumeric, spaces, dashes, underscores, and dots
    const invalidChars = /[\/\\:*?"<>|]/;
    if (invalidChars.test(trimmedName)) {
      toast.error('Ungültiger Ordnername!', {
        description: 'Ordnernamen dürfen keine Sonderzeichen wie / \\ : * ? " < > | enthalten.',
      });
      return;
    }

    // Check name length
    if (trimmedName.length > 255) {
      toast.error('Ordnername ist zu lang!', {
        description: 'Maximale Länge: 255 Zeichen',
      });
      return;
    }

    // Check if folder already exists in current path
    if (files.some(file => file.name === trimmedName && file.type === 'folder' && (file.path || '/') === currentPath)) {
      toast.error('Ein Ordner mit diesem Namen existiert bereits in diesem Verzeichnis');
      return;
    }

    // Create new folder
    const newFolder = {
      name: trimmedName,
      type: 'folder' as const,
      size: '-',
      modified: new Date().toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      path: currentPath
    };

    setFiles([...files, newFolder]);
    toast.success(`Ordner "${trimmedName}" erfolgreich erstellt!`);
    setNewFolderName('');
    setShowCreateFolderDialog(false);
  };

  // Live server stats with real-time updates
  const [stats, setStats] = useState({
    cpu: 0,
    ram: 0,
    storage: 0,
    tps: 0,
    currentPlayers: 0,
    networkDownload: 2500, // kbit/s - starts at ~2.5 Mbit/s baseline
    networkUpload: 1200, // kbit/s - starts at ~1.2 Mbit/s baseline
    totalDownload: 0, // GB this month
    totalUpload: 0, // GB this month
  });

  // Live update stats every 2 seconds
  useEffect(() => {
    if (serverStatus !== 'online') {
      // Reset players to 0 when offline
      setStats(prevStats => ({ ...prevStats, currentPlayers: 0 }));
      return;
    }

    const interval = setInterval(() => {
      setStats(prevStats => {
        // Generate realistic variations
        const cpuVariation = (Math.random() - 0.5) * 8; // ±4%
        const ramVariation = (Math.random() - 0.5) * 4; // ±2%
        const storageIncrease = Math.random() * 0.08 + 0.02; // Faster increase: 0.02-0.10% per update (grows steadily)
        const tpsVariation = (Math.random() - 0.5) * 0.4; // ±0.2
        const downloadVariation = (Math.random() - 0.5) * 1000; // ±500 kbit/s (~±0.5 Mbit/s visible variation)
        const uploadVariation = (Math.random() - 0.5) * 600; // ±300 kbit/s (~±0.3 Mbit/s visible variation)
        
        // Player count changes - can join or leave randomly
        const playerChange = Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0;
        const newPlayerCount = Math.min(serverData.maxPlayers, Math.max(0, prevStats.currentPlayers + playerChange));

        return {
          ...prevStats,
          cpu: Math.min(100, Math.max(0, prevStats.cpu + cpuVariation)),
          ram: Math.min(100, Math.max(0, prevStats.ram + ramVariation)),
          storage: Math.min(100, Math.max(0, prevStats.storage + storageIncrease)), // Storage grows steadily
          tps: Math.min(20, Math.max(17, prevStats.tps + tpsVariation)),
          currentPlayers: newPlayerCount,
          networkDownload: Math.min(10000, Math.max(0, prevStats.networkDownload + downloadVariation)), // kbit/s, capped at 10 Mbit/s
          networkUpload: Math.min(5000, Math.max(0, prevStats.networkUpload + uploadVariation)), // kbit/s, capped at 5 Mbit/s
          totalDownload: prevStats.totalDownload + (Math.random() * 0.001), // Slowly increases
          totalUpload: prevStats.totalUpload + (Math.random() * 0.0003), // Slowly increases
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [serverStatus, maxPlayers]);

  // Historical data for charts with different time ranges
  const generateHistoricalData = (timeRange: typeof chartTimeRange) => {
    const data = [];
    const now = new Date();
    let points = 24;
    let intervalMs = 60 * 60 * 1000; // 1 hour
    let formatTime = (date: Date) => `${date.getHours()}:00`;

    // Configure based on time range
    switch (timeRange) {
      case '10m':
        points = 10;
        intervalMs = 1 * 60 * 1000; // 1 minute
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '30m':
        points = 30;
        intervalMs = 1 * 60 * 1000; // 1 minute
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '1h':
        points = 60;
        intervalMs = 1 * 60 * 1000; // 1 minute
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '2h':
        points = 24;
        intervalMs = 5 * 60 * 1000; // 5 minutes
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '3h':
        points = 36;
        intervalMs = 5 * 60 * 1000; // 5 minutes
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '4h':
        points = 48;
        intervalMs = 5 * 60 * 1000; // 5 minutes
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '5h':
        points = 60;
        intervalMs = 5 * 60 * 1000; // 5 minutes
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '12h':
        points = 24;
        intervalMs = 30 * 60 * 1000; // 30 minutes
        formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        break;
      case '24h':
        points = 24;
        intervalMs = 60 * 60 * 1000; // 1 hour
        formatTime = (date: Date) => `${date.getHours()}:00`;
        break;
      case '48h':
        points = 48;
        intervalMs = 60 * 60 * 1000; // 1 hour
        formatTime = (date: Date) => {
          const day = date.getDate();
          return `${day}.${date.getMonth() + 1} ${date.getHours()}:00`;
        };
        break;
      case '72h':
        points = 36;
        intervalMs = 2 * 60 * 60 * 1000; // 2 hours
        formatTime = (date: Date) => {
          const day = date.getDate();
          return `${day}.${date.getMonth() + 1} ${date.getHours()}:00`;
        };
        break;
      case '1w':
        points = 28;
        intervalMs = 6 * 60 * 60 * 1000; // 6 hours
        formatTime = (date: Date) => {
          const day = date.getDate();
          return `${day}.${date.getMonth() + 1}`;
        };
        break;
    }

    // Load saved persistent data if available for this time range
    const savedData = loadDashboardData(`historicalData_${timeRange}`, null);
    const savedBaseValues = loadDashboardData('historicalBaseValues', null);
    
    if (savedData && Array.isArray(savedData) && savedData.length > 0) {
      // Use saved data and continue from there
      return savedData;
    }

    // Generate realistic historical data with variations
    let baseCpu = savedBaseValues?.cpu || (45 + Math.random() * 10); // Base CPU: 45-55%
    let baseRam = savedBaseValues?.ram || (60 + Math.random() * 10); // Base RAM: 60-70%
    let baseStorageGB = savedBaseValues?.storage || (stats.storage > 0 ? stats.storage : 1.5 + Math.random() * 0.5); // Base Storage: 1.5-2 GB
    let baseDownload = savedBaseValues?.download || (1500 + Math.random() * 500); // Base Download: 1.5-2 Mbit/s
    let baseUpload = savedBaseValues?.upload || (800 + Math.random() * 300); // Base Upload: 0.8-1.1 Mbit/s

    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMs);
      
      // Add smooth variations over time
      baseCpu = Math.min(95, Math.max(20, baseCpu + (Math.random() - 0.5) * 8));
      baseRam = Math.min(95, Math.max(40, baseRam + (Math.random() - 0.5) * 5));
      baseStorageGB = Math.min(serverData.storage, Math.max(0.1, baseStorageGB + Math.random() * 0.01)); // Slowly grows in GB
      baseDownload = Math.min(8000, Math.max(100, baseDownload + (Math.random() - 0.5) * 800));
      baseUpload = Math.min(4000, Math.max(50, baseUpload + (Math.random() - 0.5) * 400));
      
      data.push({
        time: formatTime(time),
        cpu: baseCpu,
        ram: baseRam,
        storage: baseStorageGB,
        download: baseDownload,
        upload: baseUpload,
      });
    }
    
    // Save the base values for continuous evolution
    saveDashboardData('historicalBaseValues', {
      cpu: baseCpu,
      ram: baseRam,
      storage: baseStorageGB,
      download: baseDownload,
      upload: baseUpload,
    });
    
    return data;
  };

  const [historicalData, setHistoricalData] = useState(() => generateHistoricalData(chartTimeRange));

  // Calculate average stats from historical data for the selected time range
  const calculateAverageStats = () => {
    if (historicalData.length === 0) return stats;
    
    const sum = historicalData.reduce((acc, data) => ({
      cpu: acc.cpu + data.cpu,
      ram: acc.ram + data.ram,
      storage: acc.storage + data.storage,
      download: acc.download + data.download,
      upload: acc.upload + data.upload,
    }), { cpu: 0, ram: 0, storage: 0, download: 0, upload: 0 });
    
    const count = historicalData.length;
    return {
      cpu: sum.cpu / count,
      ram: sum.ram / count,
      storage: sum.storage / count,
      networkDownload: sum.download / count,
      networkUpload: sum.upload / count,
    };
  };

  const averageStats = calculateAverageStats();

  // Regenerate historical data when time range changes
  useEffect(() => {
    setHistoricalData(generateHistoricalData(chartTimeRange));
  }, [chartTimeRange]);

  // Live update historical chart data - update interval adapts to time range
  useEffect(() => {
    // Determine update interval based on time range for optimal performance
    let updateInterval = 2000; // Default: 2 seconds
    
    switch (chartTimeRange) {
      case '10m':
      case '30m':
        updateInterval = 1000; // 1 second for short ranges
        break;
      case '1h':
      case '2h':
      case '3h':
        updateInterval = 2000; // 2 seconds for medium ranges
        break;
      case '4h':
      case '5h':
      case '12h':
        updateInterval = 5000; // 5 seconds for longer ranges
        break;
      case '24h':
        updateInterval = 10000; // 10 seconds for 24h
        break;
      case '48h':
      case '72h':
        updateInterval = 30000; // 30 seconds for multi-day
        break;
      case '1w':
        updateInterval = 60000; // 1 minute for week
        break;
    }
    
    const interval = setInterval(() => {
      setHistoricalData(prevData => {
        const now = new Date();
        let formatTime = (date: Date) => `${date.getHours()}:00`;

        // Configure time format based on current time range
        switch (chartTimeRange) {
          case '10m':
          case '30m':
          case '1h':
          case '2h':
          case '3h':
          case '4h':
          case '5h':
          case '12h':
            formatTime = (date: Date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            break;
          case '48h':
          case '72h':
            formatTime = (date: Date) => {
              const day = date.getDate();
              return `${day}.${date.getMonth() + 1} ${date.getHours()}:00`;
            };
            break;
          case '1w':
            formatTime = (date: Date) => {
              const day = date.getDate();
              return `${day}.${date.getMonth() + 1}`;
            };
            break;
        }

        // Create new data point - if server is offline, use 0 values
        const newDataPoint = {
          time: formatTime(now),
          cpu: serverStatus === 'online' ? Math.floor(stats.cpu) : 0,
          ram: serverStatus === 'online' ? Math.floor(stats.ram) : 0,
          storage: Math.floor(stats.storage), // Storage persists
          download: serverStatus === 'online' ? Math.floor(stats.networkDownload) : 0, // Keep in kbit/s for proper formatting
          upload: serverStatus === 'online' ? Math.floor(stats.networkUpload) : 0, // Keep in kbit/s for proper formatting
        };

        // Add new point and remove oldest to maintain size
        const newData = [...prevData.slice(1), newDataPoint];
        
        // Save to localStorage for persistence across page reloads
        saveDashboardData(`historicalData_${chartTimeRange}`, newData);
        
        // Update base values for continuous evolution
        const lastPoint = newData[newData.length - 1];
        saveDashboardData('historicalBaseValues', {
          cpu: lastPoint.cpu,
          ram: lastPoint.ram,
          storage: lastPoint.storage,
          download: lastPoint.download,
          upload: lastPoint.upload,
        });
        
        return newData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [serverStatus, stats, chartTimeRange]);

  // File Manager - load saved files per user with path support
  const [files, setFiles] = useState<Array<{ name: string; type: 'file' | 'folder'; size: string; modified: string; path?: string; uploading?: boolean; uploadProgress?: number }>>(() => {
    const loadedFiles = loadDashboardData('files', []);
    // Ensure all files have a path property (default to '/')
    return loadedFiles.map((file: any) => ({
      ...file,
      path: file.path || '/'
    }));
  });
  const [currentPath, setCurrentPath] = useState<string>('/');

  // Get files in current directory
  const getCurrentFiles = () => {
    return files.filter(file => {
      const filePath = file.path || '/';
      return filePath === currentPath;
    });
  };

  // Navigate into folder
  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    setCurrentPath(newPath);
  };

  // Navigate to parent folder
  const navigateUp = () => {
    if (currentPath === '/') return;
    const pathParts = currentPath.split('/').filter(p => p);
    pathParts.pop();
    setCurrentPath(pathParts.length === 0 ? '/' : '/' + pathParts.join('/'));
  };

  // Get breadcrumb parts
  const getBreadcrumbs = () => {
    if (currentPath === '/') return [{ name: 'Root', path: '/' }];
    const parts = currentPath.split('/').filter(p => p);
    const breadcrumbs = [{ name: 'Root', path: '/' }];
    let accumulatedPath = '';
    for (const part of parts) {
      accumulatedPath += '/' + part;
      breadcrumbs.push({ name: part, path: accumulatedPath });
    }
    return breadcrumbs;
  };

  // Generate backups based on plan limits
  const getInitialBackupsForPlan = () => {
    // Start with no backups for new users
    return [];
  };

  const [backups, setBackups] = useState(() => 
    loadDashboardData('backups', getInitialBackupsForPlan())
  );

  // Update backups when plan changes or extra slots are added/removed
  useEffect(() => {
    const newBackups = getInitialBackupsForPlan();
    setBackups(newBackups);
  }, [currentPlan, enterpriseRam, enterpriseCpu, enterpriseStorage, extraBackupSlots]);

  // Handle backup deletion with confirmation
  const handleDeleteBackup = (backupId: number, backupName: string) => {
    if (window.confirm(`Möchten Sie das Backup "${backupName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      setBackups(prevBackups => prevBackups.filter(backup => backup.id !== backupId));
      toast.success('🗑️ Backup erfolgreich gelöscht!');
    }
  };

  // Generate dynamic invoices based on current plan and add-ons
  const generateInvoiceAmount = () => {
    const basePlanCost = isPrivileged ? 0 : planInfo[currentPlan].price;
    const backupSlotsCost = isPrivileged ? 0 : extraBackupSlots * 0.20;
    
    // Calculate Priority Support cost
    let prioritySupportCost = 0;
    if (serverData.plan === 'Enterprise') {
      const enterprisePrice = enterpriseRam * 1.5 + enterpriseCpu * 1.5 + enterpriseStorage * 0.1;
      
      if (enterprisePrice <= 15 && hasPrioritySupport) {
        prioritySupportCost = isPrivileged ? 0 : 15.00;
      }
    }
    
    const subtotal = basePlanCost + backupSlotsCost + prioritySupportCost;
    const vat = subtotal * 0.081;
    const total = subtotal + vat;
    
    return total;
  };

  const invoiceAmount = generateInvoiceAmount();
  
  // Generate invoices dynamically based on user's nextPaymentDate
  const generateInvoices = () => {
    // Don't generate invoices for privileged users (Owner/Admin)
    if (isPrivileged) {
      return [];
    }
    
    const invoicesList: Array<{ id: string; date: string; amount: number; status: 'paid' | 'pending' }> = [];
    
    if (!user?.nextPaymentDate) {
      // If no payment date, generate default invoices
      return [
        { id: '#000123', date: '2024-12-01', amount: invoiceAmount, status: 'paid' as const },
        { id: '#000124', date: '2025-01-01', amount: invoiceAmount, status: 'pending' as const },
      ];
    }
    
    const nextPayment = new Date(user.nextPaymentDate);
    const now = new Date();
    
    // Generate last month's invoice (paid)
    const lastMonth = new Date(nextPayment);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthId = `#${String(100000 + Math.floor(Math.random() * 900000)).slice(0, 6)}`;
    invoicesList.push({
      id: lastMonthId,
      date: lastMonth.toISOString().split('T')[0],
      amount: invoiceAmount,
      status: 'paid'
    });
    
    // Generate current month's invoice (pending if payment date has passed, otherwise paid)
    const currentMonthId = `#${String(100001 + Math.floor(Math.random() * 900000)).slice(0, 6)}`;
    const isPending = nextPayment <= now;
    invoicesList.push({
      id: currentMonthId,
      date: nextPayment.toISOString().split('T')[0],
      amount: invoiceAmount,
      status: isPending ? 'pending' : 'paid'
    });
    
    // If current payment is overdue, add next month's invoice
    if (isPending) {
      const nextMonth = new Date(nextPayment);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthId = `#${String(100002 + Math.floor(Math.random() * 900000)).slice(0, 6)}`;
      invoicesList.push({
        id: nextMonthId,
        date: nextMonth.toISOString().split('T')[0],
        amount: invoiceAmount,
        status: 'pending'
      });
    }
    
    return invoicesList;
  };
  
  const invoices = generateInvoices();

  const handleDownloadInvoice = (invoice: typeof invoices[0]) => {
    // Calculate costs
    const basePlanCost = isPrivileged ? 0 : planInfo[currentPlan].price;
    const backupSlotsCost = isPrivileged ? 0 : extraBackupSlots * 0.20;
    
    // Calculate Priority Support cost for Enterprise plans
    let prioritySupportCost = 0;
    let prioritySupportIncluded = false;
    
    if (serverData.plan === 'Enterprise') {
      const enterprisePrice = enterpriseRam * 1.5 + enterpriseCpu * 1.5 + enterpriseStorage * 0.1;
      
      if (enterprisePrice > 15) {
        // Priority Support is included in plan
        prioritySupportIncluded = true;
        prioritySupportCost = 0;
      } else if (hasPrioritySupport) {
        // Priority Support purchased as add-on
        prioritySupportCost = isPrivileged ? 0 : 15.00;
      }
    }
    
    const subtotal = basePlanCost + backupSlotsCost + prioritySupportCost;
    const vat = subtotal * 0.081;
    const total = subtotal + vat;
    
    // Generate invoice content
    const invoiceContent = `
═══════════════════════════════════════════════════════════════
                         BLOCKHOST
                    Minecraft Server Hosting
                     blockhosts.org
═══════════════════════════════════════════════════════════════

RECHNUNG ${invoice.id}

Rechnungsdatum: ${invoice.date}
Fälligkeitsdatum: ${invoice.date}
Kundennummer: ${user?.username || 'DEMO'}${isPrivileged ? ` (${user?.isOwner ? 'OWNER' : 'ADMIN'} - Kostenlos)` : ''}

═══════════════════════════════════════════════════════════════
RECHNUNGSDETAILS
═══════════════���═══════════════════════════════════════════════

Position                                    Menge    Preis (CHF)
───────────────────────────────────────────────────────────────
Minecraft Server Hosting - ${serverData.plan} Plan      1x      ${basePlanCost.toFixed(2)}${extraBackupSlots > 0 ? `
Zusätzliche Backup-Slots                   ${extraBackupSlots}x      ${backupSlotsCost.toFixed(2)}` : ''}${prioritySupportCost > 0 ? `
Enterprise Priority Support                 1x      ${prioritySupportCost.toFixed(2)}` : ''}

                                           Zwischensumme:  ${subtotal.toFixed(2)} CHF
                                           MwSt. (8.1%):   ${vat.toFixed(2)} CHF
                                           ───────────────────────
                                           Gesamtbetrag:   ${total.toFixed(2)} CHF

═══════════════════════════════════════════════════════════════
ZAHLUNGSINFORMATIONEN
═══════════════════════════════════════════════════════════════

Kontoinhaber: BlockHost
IBAN: ${invoice.status === 'paid' ? '**** **** **** **** 7181 8' : 'CH81 8080 8006 1780 7181 8'}
Verwendungszweck: ${invoice.id}

Status: ${invoice.status === 'paid' ? 'BEZAHLT ✓' : 'AUSSTEHEND'}

══��════════════════════════════════════════════════════════════
SERVER DETAILS
═══════════════════════════════════════════════════════════════

Servername:     ${serverData.name}
Plan:           ${serverData.plan}
RAM:            ${serverData.ram}GB
Storage:        ${serverData.storage}GB
CPU Cores:      ${serverData.plan === 'Basic' ? '1' : serverData.plan === 'Pro' ? '3' : '6'}
Backups:        ${backupConfig.baseMaxBackups}${extraBackupSlots > 0 ? ` + ${extraBackupSlots} extra = ${backupConfig.maxBackups} total` : ''}
Standort:       St. Gallen, Schweiz
DDoS-Schutz:    TCPShield
${(prioritySupportIncluded || hasPrioritySupport) ? `
═══════════════════════════════════════════════════════════════
ENTERPRISE PRIORITY SUPPORT ${prioritySupportIncluded ? '(INKLUDIERT)' : '(AKTIV)'}
═══════════════════════�����═══════════════════════════════════════

✓ Dedizierter Support-Manager 24/7
✓ Garantierte Antwortzeit unter 15 Minuten
✓ Kostenlose Server-Optimierung & Beratung
✓ Priorität bei Server-Wartungen
` : ''}
═══════════════════════════════════════════════════════════════
KONTAKT
════════════════════════════════════════════════════════════���══

BlockHost
Web: blockhosts.org
Support: support@blockhosts.org

Vielen Dank für Ihr Vertrauen!

═══════════════════════════════════════════════════════════════
    `;

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BlockHost_Rechnung_${invoice.id}_${invoice.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Rechnung ${invoice.id} wurde heruntergeladen!`);
  };

  // Helper function to add console logs
  const addConsoleLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleServerAction = (action: 'start' | 'stop' | 'restart') => {
    if (action === 'start') {
      setServerStatus('starting');
      toast.success(t('toast.serverStarting'));
      
      // Clear console and start installation process
      setConsoleLog([]);
      
      // Simulated automatic installation process
      const getServerDownloadInfo = () => {
        switch (serverType) {
          case 'vanilla':
            return {
              name: 'Vanilla',
              source: 'mojang.com',
              size: '45 MB',
              icon: '⛏️'
            };
          case 'paper':
            return {
              name: 'Paper',
              source: 'papermc.io',
              size: '42 MB',
              icon: '📄'
            };
          case 'forge':
            return {
              name: 'Forge',
              source: 'files.minecraftforge.net',
              size: '52 MB',
              icon: '🔥'
            };
          case 'fabric':
            return {
              name: 'Fabric',
              source: 'fabricmc.net',
              size: '38 MB',
              icon: '🧵'
            };
          case 'neoforge':
            return {
              name: 'NeoForge',
              source: 'neoforged.net',
              size: '54 MB',
              icon: '🔱'
            };
          case 'quilt':
            return {
              name: 'Quilt',
              source: 'quiltmc.org',
              size: '39 MB',
              icon: '🪡'
            };
          default:
            return {
              name: 'Vanilla',
              source: 'mojang.com',
              size: '45 MB',
              icon: '⛏️'
            };
        }
      };

      const serverInfo = getServerDownloadInfo();
      
      const installationSteps = [
        { delay: 0, message: 'BlockHost Server Manager initialisiert...' },
        { delay: 300, message: '📦 Überprüfe System-Anforderungen...' },
        { delay: 600, message: '✓ System-Anforderungen erfüllt' },
        { delay: 900, message: `☕ Downloade Java 21 JRE von adoptium.net...` },
        { delay: 1500, message: '✓ Java 21 JRE erfolgreich heruntergeladen (187 MB)' },
        { delay: 1700, message: '⚙️ Installiere Java Runtime Environment...' },
        { delay: 2200, message: '✓ Java erfolgreich installiert' },
        { delay: 2400, message: `${serverInfo.icon} Downloade Minecraft ${serverInfo.name} ${minecraftVersion}...` },
        { delay: 3000, message: `📥 Lade ${serverInfo.name} Server von ${serverInfo.source} herunter...` },
        { delay: 4500, message: `✓ Minecraft ${serverInfo.name} ${minecraftVersion} heruntergeladen (${serverInfo.size})` },
        { delay: 4700, message: '📝 Erstelle server.properties...' },
        { delay: 5000, message: `✓ Schwierigkeit: ${difficulty}` },
        { delay: 5100, message: `✓ Spielmodus: ${gameMode}` },
        { delay: 5200, message: `✓ Max Spieler: ${maxPlayers}` },
        { delay: 5300, message: `✓ Render Distance: ${renderDistance}` },
        { delay: 5400, message: `✓ Server Port: ${serverPort}` },
        { delay: 5500, message: `✓ RCON Port: ${rconPort}` },
        { delay: 5700, message: '✓ server.properties konfiguriert' },
        { delay: 5900, message: '📄 Akzeptiere Minecraft EULA...' },
        { delay: 6200, message: '✓ eula.txt erstellt' },
        { delay: 6400, message: '🌍 Generiere neue Welt...' },
        { delay: 6600, message: '📍 Erstelle Spawn-Bereich...' },
        { delay: 7000, message: '⏳ Bereite Spawn-Bereich vor: 0%' },
        { delay: 7500, message: '⏳ Bereite Spawn-Bereich vor: 25%' },
        { delay: 8000, message: '⏳ Bereite Spawn-Bereich vor: 50%' },
        { delay: 8500, message: '⏳ Bereite Spawn-Bereich vor: 75%' },
        { delay: 9000, message: '✓ Spawn-Bereich vorbereitet: 100%' },
        { delay: 9200, message: '🗺️ Generiere Terrain...' },
        { delay: 10000, message: '✓ Welt erfolgreich generiert' },
        { delay: 10200, message: '🔌 Starte Server...' },
        { delay: 10500, message: `✓ Server gestartet auf ${serverIp}:${serverPort}` },
        { delay: 10700, message: '🛡️ TCPShield DDoS-Schutz aktiviert' },
        { delay: 10900, message: '✓ Server läuft und ist bereit!' },
        { delay: 11100, message: `📢 MOTD: ${motd}` },
        { delay: 11200, message: '═══════════════════════════════════════' },
        { delay: 11300, message: '🎮 VERBINDUNGSINFORMATIONEN' },
        { delay: 11350, message: `📍 Server-Adresse: ${serverIp}:${serverPort}` },
        { delay: 11400, message: '🌍 Standort: St. Gallen, Schweiz' },
        { delay: 11450, message: '🛡️ DDoS-Schutz: TCPShield aktiv' },
        { delay: 11500, message: '✓ Kopiere die Adresse und verbinde in Minecraft!' },
        { delay: 11550, message: '═══════════════════════════════════════' },
      ];

      installationSteps.forEach(step => {
        setTimeout(() => {
          addConsoleLog(step.message);
        }, step.delay);
      });

      setTimeout(() => {
        setServerStatus('online');
        setServerStartTime(new Date()); // Reset uptime on server start
        
        // Initialize network stats when server starts
        setStats(prev => ({
          ...prev,
          networkDownload: 2500 + Math.random() * 500, // Start with 2.5-3 Mbit/s
          networkUpload: 1200 + Math.random() * 300, // Start with 1.2-1.5 Mbit/s
        }));
        
        // Create initial server files when first started
        if (files.length === 0) {
          const currentDate = new Date().toLocaleDateString('de-DE', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          });
          
          const serverJarName = serverType === 'vanilla' ? 'server.jar' : `${serverType}-${minecraftVersion}.jar`;
          
          setFiles([
            { name: serverJarName, type: 'file', size: serverInfo.size, modified: currentDate, path: '/' },
            { name: 'server.properties', type: 'file', size: '1.2 KB', modified: currentDate, path: '/' },
            { name: 'eula.txt', type: 'file', size: '156 Bytes', modified: currentDate, path: '/' },
            { name: 'world', type: 'folder', size: '842 MB', modified: currentDate, path: '/' },
            { name: 'logs', type: 'folder', size: '2.4 MB', modified: currentDate, path: '/' },
          ]);
          
          // Storage will be auto-calculated by useEffect
        }
        
        toast.success(t('toast.serverStarted'));
      }, 11500);
    } else if (action === 'stop') {
      const timestamp = new Date().toLocaleTimeString();
      
      // First save the world
      setConsoleLog(prev => [
        ...prev,
        `[${timestamp}] 💾 Führe save-all aus...`,
        `[${timestamp}] Speichere Welt...`,
        `[${timestamp}] ✓ Welt erfolgreich gespeichert!`,
        `[${timestamp}] Stoppe Server...`,
      ]);
      
      setServerStatus('stopping');
      toast.success('💾 Speichere Welt...');
      
      // Wait for save to complete, then stop
      setTimeout(() => {
        setServerStatus('offline');
        setLiveUptime('0m 0s'); // Reset uptime display to zero
        // Reset all stats to zero when server stops
        setStats({
          cpu: 0,
          ram: 0,
          storage: stats.storage, // Storage persists
          tps: 0,
          currentPlayers: 0,
          networkDownload: 0,
          networkUpload: 0,
          totalDownload: stats.totalDownload, // Total data persists
          totalUpload: stats.totalUpload, // Total data persists
        });
        setConsoleLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${t('toast.serverStopped')}`]);
        toast.success(t('toast.serverStopped'));
      }, 3000); // Increased from 2000 to 3000 to allow save time
    } else if (action === 'restart') {
      const timestamp = new Date().toLocaleTimeString();
      
      // First save the world before restart
      setConsoleLog(prev => [
        ...prev,
        `[${timestamp}] 🔄 Neustart initiiert...`,
        `[${timestamp}] 💾 Führe save-all aus...`,
        `[${timestamp}] Speichere Welt...`,
        `[${timestamp}] ✓ Welt erfolgreich gespeichert!`,
        `[${timestamp}] Stoppe Server...`,
      ]);
      
      setServerStatus('stopping');
      toast.success('💾 Speichere Welt...');
      
      setTimeout(() => {
        const restartTimestamp = new Date().toLocaleTimeString();
        setConsoleLog(prev => [...prev, `[${restartTimestamp}] Server gestoppt, starte neu...`]);
        setServerStatus('starting');
        toast.success(t('toast.serverRestarting'));
        
        setTimeout(() => {
          setServerStatus('online');
          setServerStartTime(new Date()); // Reset uptime on server restart
          
          // Re-initialize network stats on restart
          setStats(prev => ({
            ...prev,
            networkDownload: 2500 + Math.random() * 500, // Start with 2.5-3 Mbit/s
            networkUpload: 1200 + Math.random() * 300, // Start with 1.2-1.5 Mbit/s
          }));
          
          setConsoleLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${t('toast.serverRestarted')}`]);
          toast.success(t('toast.serverRestarted'));
        }, 2000);
      }, 1000);
    }
  };

  const handleConsoleCommand = () => {
    if (!consoleInput.trim()) return;
    
    const command = consoleInput.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString();
    
    // Add user's command to console
    setConsoleLog(prev => [...prev, `[${timestamp}] > ${consoleInput}`]);
    
    // Handle special server control commands
    if (command === 'start') {
      if (serverStatus === 'online') {
        setConsoleLog(prev => [...prev, `[${timestamp}] ⚠️ Server läuft bereits!`]);
        toast.warning('Server läuft bereits!');
      } else {
        handleServerAction('start');
      }
    } else if (command === 'stop') {
      if (serverStatus === 'offline') {
        setConsoleLog(prev => [...prev, `[${timestamp}] ⚠️ Server ist bereits gestoppt!`]);
        toast.warning('Server ist bereits gestoppt!');
      } else {
        handleServerAction('stop');
      }
    } else if (command === 'restart') {
      if (serverStatus === 'offline') {
        setConsoleLog(prev => [...prev, `[${timestamp}] ⚠️ Server ist offline. Verwenden Sie 'start' stattdessen.`]);
        toast.warning('Server ist offline. Verwenden Sie "start"');
      } else {
        handleServerAction('restart');
      }
    } else if (command === 'help') {
      setConsoleLog(prev => [
        ...prev,
        `[${timestamp}] ═══════════════════════════════════════`,
        `[${timestamp}] 📖 VERFÜGBARE BEFEHLE:`,
        `[${timestamp}] ═══════════════════════���═══════════════`,
        `[${timestamp}] Server-Verwaltung:`,
        `[${timestamp}]   start     - Server starten`,
        `[${timestamp}]   stop      - Server stoppen`,
        `[${timestamp}]   restart   - Server neustarten`,
        `[${timestamp}]   status    - Server-Status anzeigen`,
        `[${timestamp}]   connect   - Verbindungsinformationen anzeigen`,
        `[${timestamp}] `,
        `[${timestamp}] Minecraft-Befehle:`,
        `[${timestamp}]   list      - Zeigt alle Online-Spieler`,
        `[${timestamp}]   whitelist - Whitelist verwalten`,
        `[${timestamp}]   op        - Operator-Rechte vergeben`,
        `[${timestamp}]   deop      - Operator-Rechte entziehen`,
        `[${timestamp}]   kick      - Spieler kicken`,
        `[${timestamp}]   ban       - Spieler bannen`,
        `[${timestamp}]   pardon    - Spieler entbannen`,
        `[${timestamp}]   save-all  - Welt speichern`,
        `[${timestamp}]   time set  - Zeit ändern (day/night)`,
        `[${timestamp}]   weather   - Wetter ändern (clear/rain)`,
        `[${timestamp}]   difficulty - Schwierigkeit ändern`,
        `[${timestamp}]   gamemode  - Spielmodus ändern`,
        `[${timestamp}]   clear     - Konsole leeren`,
        `[${timestamp}] ═══════════════════════════════════════`,
      ]);
      toast.success('✓ Befehlsliste angezeigt');
    } else if (command === 'status') {
      setConsoleLog(prev => [
        ...prev,
        `[${timestamp}] ═══════════════════════════════════════`,
        `[${timestamp}] 📊 SERVER-STATUS:`,
        `[${timestamp}] Status: ${getStatusText()}`,
        `[${timestamp}] Spieler: ${stats.currentPlayers}/${maxPlayers}`,
        `[${timestamp}] CPU: ${stats.cpu.toFixed(1)}%`,
        `[${timestamp}] RAM: ${stats.ram.toFixed(1)}%`,
        `[${timestamp}] TPS: ${stats.tps.toFixed(1)}`,
        `[${timestamp}] Uptime: ${serverData.uptime}`,
        serverStatus === 'online' ? `[${timestamp}] 📍 Adresse: ${serverIp}:${serverPort}` : '',
        `[${timestamp}] ═══════════════════════════════════════`,
      ].filter(Boolean));
      toast.success('✓ Status angezeigt');
    } else if (command === 'clear') {
      setConsoleLog([`[${timestamp}] Konsole geleert`]);
      toast.success('✓ Konsole geleert');
    } else if (command === 'list') {
      const onlinePlayers = whitelistedPlayers.slice(0, stats.currentPlayers).map(p => p.name).join(', ');
      setConsoleLog(prev => [
        ...prev,
        `[${timestamp}] Es sind ${stats.currentPlayers} von maximal ${maxPlayers} Spielern online: ${onlinePlayers || 'Keine Spieler online'}`,
      ]);
      toast.success(`✓ ${stats.currentPlayers} Spieler online`);
    } else if (command === 'connect') {
      if (serverStatus === 'online') {
        setConsoleLog(prev => [
          ...prev,
          `[${timestamp}] ═══════════════════════════════════════`,
          `[${timestamp}] 🎮 VERBINDUNGSINFORMATIONEN`,
          `[${timestamp}] ═══════════════════════════════════════`,
          `[${timestamp}] 📍 Server-Adresse: ${serverIp}:${serverPort}`,
          `[${timestamp}] 🌍 Standort: St. Gallen, Schweiz`,
          `[${timestamp}] 🛡️ DDoS-Schutz: TCPShield aktiv`,
          `[${timestamp}] 📄 Version: Minecraft ${minecraftVersion}`,
          `[${timestamp}] 🎯 Typ: ${serverType.charAt(0).toUpperCase() + serverType.slice(1)}`,
          `[${timestamp}] 📢 MOTD: ${motd}`,
          `[${timestamp}] `,
          `[${timestamp}] ✓ Kopiere die Adresse und verbinde in Minecraft!`,
          `[${timestamp}] ═══════════════════════════════════════`,
        ]);
        
        // Copy to clipboard
        navigator.clipboard.writeText(`${serverIp}:${serverPort}`).then(() => {
          toast.success('📋 Server-Adresse in Zwischenablage kopiert!');
        }).catch(() => {
          toast.success('✓ Verbindungsinformationen angezeigt');
        });
      } else {
        setConsoleLog(prev => [...prev, `[${timestamp}] ⚠️ Server ist offline. Starte den Server zuerst.`]);
        toast.warning('Server ist offline');
      }
    } else if (command.startsWith('whitelist ')) {
      const action = command.split(' ')[1];
      if (action === 'on') {
        setWhitelist(true);
        setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Whitelist aktiviert`]);
        toast.success('✓ Whitelist aktiviert');
      } else if (action === 'off') {
        setWhitelist(false);
        setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Whitelist deaktiviert`]);
        toast.success('✓ Whitelist deaktiviert');
      } else if (action === 'list') {
        const players = whitelistedPlayers.map(p => p.name).join(', ');
        setConsoleLog(prev => [...prev, `[${timestamp}] Whitelisted Spieler: ${players || 'Keine'}`]);
        toast.success('✓ Whitelist angezeigt');
      } else {
        setConsoleLog(prev => [...prev, `[${timestamp}] ⚠️ Verwendung: whitelist <on|off|list>`]);
      }
    } else if (command.startsWith('op ')) {
      const playerName = consoleInput.trim().split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ ${playerName} ist jetzt ein Operator`]);
      toast.success(`✓ ${playerName} hat OP-Rechte erhalten`);
    } else if (command.startsWith('deop ')) {
      const playerName = consoleInput.trim().split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ ${playerName} ist kein Operator mehr`]);
      toast.success(`✓ ${playerName} hat OP-Rechte verloren`);
    } else if (command.startsWith('kick ')) {
      const playerName = consoleInput.trim().split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ ${playerName} wurde vom Server gekickt`]);
      toast.success(`✓ ${playerName} wurde gekickt`);
    } else if (command.startsWith('ban ')) {
      const playerName = consoleInput.trim().split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ ${playerName} wurde gebannt`]);
      toast.success(`✓ ${playerName} wurde gebannt`);
    } else if (command.startsWith('pardon ')) {
      const playerName = consoleInput.trim().split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ ${playerName} wurde entbannt`]);
      toast.success(`✓ ${playerName} wurde entbannt`);
    } else if (command === 'save-all') {
      setConsoleLog(prev => [
        ...prev,
        `[${timestamp}] Speichere Welt...`,
        `[${timestamp}] ✓ Welt erfolgreich gespeichert!`,
      ]);
      toast.success('✓ Welt gespeichert');
    } else if (command.startsWith('time set ')) {
      const timeValue = command.split(' ')[2];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Zeit auf ${timeValue} gesetzt`]);
      toast.success(`✓ Zeit: ${timeValue}`);
    } else if (command.startsWith('weather ')) {
      const weatherType = command.split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Wetter auf ${weatherType} gesetzt`]);
      toast.success(`✓ Wetter: ${weatherType}`);
    } else if (command.startsWith('difficulty ')) {
      const diff = command.split(' ')[1];
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Schwierigkeit auf ${diff} gesetzt`]);
      toast.success(`✓ Schwierigkeit: ${diff}`);
    } else if (command.startsWith('gamemode ')) {
      const mode = command.split(' ')[1];
      const player = command.split(' ')[2] || 'self';
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Spielmodus von ${player} auf ${mode} gesetzt`]);
      toast.success(`✓ Gamemode: ${mode}`);
    } else {
      // Generic command - simulate execution
      setConsoleLog(prev => [...prev, `[${timestamp}] ✓ Befehl ausgeführt: ${consoleInput}`]);
      toast.success('✓ Befehl ausgeführt');
    }
    
    setConsoleInput('');
  };

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500 animate-pulse';
      case 'stopping': return 'bg-orange-500 animate-pulse';
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case 'online': return t('dashboard.online');
      case 'offline': return t('dashboard.offline');
      case 'starting': return t('dashboard.starting');
      case 'stopping': return t('dashboard.stopping');
    }
  };

  // Resource monitoring with notifications
  useEffect(() => {
    const checkResourceLimits = () => {
      // Check CPU
      if (stats.cpu >= 90 && lastNotifiedLevels.cpu < 90) {
        toast.error('⚠️ Kritische CPU-Auslastung: ' + Math.round(stats.cpu) + '%! Server kann instabil werden.');
        setLastNotifiedLevels(prev => ({ ...prev, cpu: 90 }));
      } else if (stats.cpu >= 80 && stats.cpu < 90 && lastNotifiedLevels.cpu < 80) {
        toast.warning('⚠️ Hohe CPU-Auslastung: ' + Math.round(stats.cpu) + '%');
        setLastNotifiedLevels(prev => ({ ...prev, cpu: 80 }));
      } else if (stats.cpu < 80 && lastNotifiedLevels.cpu > 0) {
        setLastNotifiedLevels(prev => ({ ...prev, cpu: 0 }));
      }

      // Check RAM
      if (stats.ram >= 90 && lastNotifiedLevels.ram < 90) {
        toast.error('⚠️ Kritische RAM-Auslastung: ' + Math.round(stats.ram) + '%! Erwäge einen Upgrade.');
        setLastNotifiedLevels(prev => ({ ...prev, ram: 90 }));
      } else if (stats.ram >= 80 && stats.ram < 90 && lastNotifiedLevels.ram < 80) {
        toast.warning('⚠️ Hohe RAM-Auslastung: ' + Math.round(stats.ram) + '%');
        setLastNotifiedLevels(prev => ({ ...prev, ram: 80 }));
      } else if (stats.ram < 80 && lastNotifiedLevels.ram > 0) {
        setLastNotifiedLevels(prev => ({ ...prev, ram: 0 }));
      }

      // Check Storage
      const storagePercent = getStoragePercentage();
      if (storagePercent >= 90 && lastNotifiedLevels.storage < 90) {
        toast.error('⚠️ Kritische Speicher-Auslastung: ' + Math.round(storagePercent) + '%! Bitte Dateien löschen.');
        setLastNotifiedLevels(prev => ({ ...prev, storage: 90 }));
      } else if (storagePercent >= 80 && storagePercent < 90 && lastNotifiedLevels.storage < 80) {
        toast.warning('⚠️ Hohe Speicher-Auslastung: ' + Math.round(storagePercent) + '%');
        setLastNotifiedLevels(prev => ({ ...prev, storage: 80 }));
      } else if (storagePercent < 80 && lastNotifiedLevels.storage > 0) {
        setLastNotifiedLevels(prev => ({ ...prev, storage: 0 }));
      }
    };

    checkResourceLimits();
  }, [stats.cpu, stats.ram, stats.storage]);

  // Helper function to get resource status color
  const getResourceColor = (value: number) => {
    if (value >= 90) return 'text-red-500';
    if (value >= 80) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getResourceBgColor = (value: number) => {
    if (value >= 90) return 'bg-red-900/20 border-red-600/50';
    if (value >= 80) return 'bg-yellow-900/20 border-yellow-600/50';
    return 'bg-green-900/20 border-green-600/50';
  };

  // Save Enterprise configuration to localStorage
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`dashboard_${user.email}_enterpriseRam`, enterpriseRam.toString());
      localStorage.setItem(`dashboard_${user.email}_enterpriseCpu`, enterpriseCpu.toString());
      localStorage.setItem(`dashboard_${user.email}_enterpriseStorage`, enterpriseStorage.toString());
    }
  }, [enterpriseRam, enterpriseCpu, enterpriseStorage, user?.email]);

  // Set mounted state after first render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Save console log to localStorage
  useEffect(() => {
    if (user?.email && isMounted) {
      saveDashboardData('consoleLog', consoleLog);
    }
  }, [consoleLog, user?.email, isMounted]);
  
  // Save game settings to localStorage
  useEffect(() => {
    if (user?.email && isMounted) {
      saveDashboardData('gameMode', gameMode);
      saveDashboardData('difficulty', difficulty);
      saveDashboardData('minecraftVersion', minecraftVersion);
      saveDashboardData('autoUpdate', autoUpdate);
      saveDashboardData('serverType', serverType);
    }
  }, [gameMode, difficulty, minecraftVersion, autoUpdate, serverType, user?.email, isMounted]);
  
  // Save files to localStorage and update storage stats
  useEffect(() => {
    if (user?.email && isMounted) {
      saveDashboardData('files', files);
      
      // Update storage stats based on all files
      const totalStorage = calculateTotalStorage();
      setStats(prev => ({
        ...prev,
        storage: totalStorage
      }));
    }
  }, [files, user?.email, isMounted]);
  
  // Save backups to localStorage
  useEffect(() => {
    if (user?.email && isMounted) {
      saveDashboardData('backups', backups);
    }
  }, [backups, user?.email, isMounted]);
  
  // NOTE: maxPlayers and renderDistance are now saved manually via "Einstellungen speichern" button
  // to avoid spamming console logs on every slider change

  // Auto-scroll console to bottom when new logs are added
  const consoleEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLog]);

  // Check for monthly payment reminders
  useEffect(() => {
    if (!user || !user.nextPaymentDate || isPrivileged) return;

    const checkPaymentReminder = () => {
      const now = new Date();
      const nextPayment = new Date(user.nextPaymentDate);
      const daysUntilPayment = Math.ceil((nextPayment.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Store in localStorage that we've checked this session
      const storageKey = `payment_reminder_shown_${user.email}_${nextPayment.toISOString().split('T')[0]}`;
      const hasShownToday = sessionStorage.getItem(storageKey);
      
      // Only show once per session
      if (hasShownToday) return;
      
      // Check if payment is due (today or past due)
      if (daysUntilPayment <= 0 && daysUntilPayment >= -30) {
        const daysPastDue = Math.abs(daysUntilPayment);
        
        if (daysPastDue === 0) {
          // Payment is due today
          const message = t('dashboard.paymentDueToday')
            ? t('dashboard.paymentDueToday').replace('{amount}', invoiceAmount.toFixed(2))
            : `💳 Zahlungserinnerung: Ihre monatliche Zahlung von CHF ${invoiceAmount.toFixed(2)} ist heute fällig!`;
          toast.warning(message, {
            duration: 10000,
          });
          sessionStorage.setItem(storageKey, 'true');
        } else if (daysPastDue > 0) {
          // Payment is overdue
          const days = daysPastDue > 1 ? (t('dashboard.days') || 'Tagen') : (t('dashboard.day') || 'Tag');
          const message = t('dashboard.paymentOverdue')
            ? t('dashboard.paymentOverdue').replace('{amount}', invoiceAmount.toFixed(2)).replace('{days}', `${daysPastDue} ${days}`)
            : `⚠️ Zahlungserinnerung: Ihre Zahlung von CHF ${invoiceAmount.toFixed(2)} ist seit ${daysPastDue} Tag${daysPastDue > 1 ? 'en' : ''} überfällig!`;
          toast.error(message, {
            duration: 15000,
          });
          sessionStorage.setItem(storageKey, 'true');
        }
      } else if (daysUntilPayment > 0 && daysUntilPayment <= 7) {
        // Remind 7 days before payment
        const days = daysUntilPayment > 1 ? (t('dashboard.days') || 'Tagen') : (t('dashboard.day') || 'Tag');
        const message = t('dashboard.paymentUpcoming')
          ? t('dashboard.paymentUpcoming').replace('{amount}', invoiceAmount.toFixed(2)).replace('{days}', `${daysUntilPayment} ${days}`)
          : `📅 Zahlungserinnerung: Ihre nächste Zahlung von CHF ${invoiceAmount.toFixed(2)} ist in ${daysUntilPayment} Tag${daysUntilPayment > 1 ? 'en' : ''} fällig.`;
        toast.info(message, {
          duration: 8000,
        });
        sessionStorage.setItem(storageKey, 'true');
      }
    };

    // Delay check slightly to ensure component is fully mounted
    const timer = setTimeout(() => {
      checkPaymentReminder();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isPrivileged, invoiceAmount]);

  // Save Server Name and MOTD to localStorage
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`dashboard_${user.email}_serverName`, serverName);
      localStorage.setItem(`dashboard_${user.email}_motd`, motd);
    }
  }, [serverName, motd, user?.email]);

  // Auto-Update is already saved by the game settings useEffect above

  // Save RCON password to localStorage
  useEffect(() => {
    if (user?.email && rconPassword) {
      localStorage.setItem(`dashboard_${user.email}_rconPassword`, rconPassword);
    }
  }, [rconPassword, user?.email]);

  // Log server configuration changes to console
  useEffect(() => {
    if (isMounted && serverName !== 'Mein Minecraft Server') {
      addConsoleLog(`Server Name geändert zu: ${serverName}`);
    }
  }, [serverName, isMounted]);

  useEffect(() => {
    if (isMounted && motd !== 'Willkommen auf meinem Server!') {
      addConsoleLog(`MOTD geändert zu: ${motd}`);
    }
  }, [motd, isMounted]);

  useEffect(() => {
    if (isMounted) {
      addConsoleLog(`Auto-Update ${autoUpdate ? 'aktiviert' : 'deaktiviert'}`);
    }
  }, [autoUpdate, isMounted]);

  useEffect(() => {
    if (isMounted && minecraftVersion !== '1.21.11') {
      addConsoleLog(`Minecraft Version geändert zu: ${minecraftVersion}`);
    }
  }, [minecraftVersion, isMounted]);

  useEffect(() => {
    if (isMounted) {
      addConsoleLog(`Game Mode geändert zu: ${gameMode}`);
    }
  }, [gameMode, isMounted]);

  useEffect(() => {
    if (isMounted) {
      addConsoleLog(`Difficulty geändert zu: ${difficulty}`);
    }
  }, [difficulty, isMounted]);

  useEffect(() => {
    if (isMounted) {
      addConsoleLog(`Server Type geändert zu: ${serverType}`);
    }
  }, [serverType, isMounted]);

  useEffect(() => {
    if (isMounted) {
      addConsoleLog(`Whitelist ${whitelist ? 'aktiviert' : 'deaktiviert'}`);
    }
  }, [whitelist, isMounted]);

  useEffect(() => {
    if (isMounted && maxPlayers !== 20) {
      addConsoleLog(`Max Players geändert zu: ${maxPlayers}`);
    }
  }, [maxPlayers, isMounted]);

  useEffect(() => {
    if (isMounted && renderDistance !== 10) {
      addConsoleLog(`Render Distance geändert zu: ${renderDistance} chunks`);
    }
  }, [renderDistance, isMounted]);

  useEffect(() => {
    if (isMounted && currentPlan === 'enterprise') {
      addConsoleLog(`Enterprise RAM konfiguriert: ${enterpriseRam}GB`);
    }
  }, [enterpriseRam, isMounted, currentPlan]);

  useEffect(() => {
    if (isMounted && currentPlan === 'enterprise') {
      addConsoleLog(`Enterprise CPU konfiguriert: ${enterpriseCpu} Cores`);
    }
  }, [enterpriseCpu, isMounted, currentPlan]);

  useEffect(() => {
    if (isMounted && currentPlan === 'enterprise') {
      addConsoleLog(`Enterprise Storage konfiguriert: ${enterpriseStorage}GB`);
    }
  }, [enterpriseStorage, isMounted, currentPlan]);

  // Auto-update Minecraft version to latest
  useEffect(() => {
    if (autoUpdate && minecraftVersions.length > 0) {
      const latestVersion = minecraftVersions[0]; // First version is always the latest
      if (minecraftVersion !== latestVersion) {
        const previousVersion = minecraftVersion;
        setMinecraftVersion(latestVersion);
        toast.success(`🎮 Minecraft automatisch aktualisiert: ${previousVersion} → ${latestVersion}`, {
          duration: 5000,
        });
      }
    }
  }, [autoUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-xl border-b border-green-500/30 sticky top-0 z-50 shadow-2xl shadow-green-500/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-3 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl shadow-2xl shadow-green-500/50 group-hover:shadow-green-500/70 transition-all group-hover:scale-110 transform duration-300">
                <Server className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent drop-shadow-lg">{t('dashboard.title')}</h1>
              <p className="text-sm text-gray-300 flex items-center gap-2">{t('dashboard.welcome')}, <span className="text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/30">{user?.username}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button
              variant="ghost"
              onClick={() => setIsCartOpen(true)}
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all relative group backdrop-blur-sm border border-white/5 hover:border-green-500/30 shadow-lg hover:shadow-green-500/20"
            >
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg shadow-green-500/50 animate-pulse">
                  {cart.length}
                </span>
              )}
              {t('dashboard.cart')}
            </Button>
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm border border-white/5 hover:border-blue-500/30 shadow-lg hover:shadow-blue-500/20 group"
            >
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {t('dashboard.home')}
            </Button>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm border border-white/5 hover:border-red-500/30 shadow-lg hover:shadow-red-500/20 group"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {t('dashboard.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Payment Status Alerts */}
        <div className="space-y-6 mb-6">
          <ServerSuspendedAlert onGoToBilling={() => setActiveTab('billing')} />
          <PaymentWarning3Alert onGoToBilling={() => setActiveTab('billing')} />
          <PaymentWarning2Alert onGoToBilling={() => setActiveTab('billing')} />
          <PaymentWarning1Alert onGoToBilling={() => setActiveTab('billing')} />
          <PaymentReminderAlert onGoToBilling={() => setActiveTab('billing')} />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className={`col-span-12 transition-all duration-300 ${sidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <Card className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/90 to-black/95 backdrop-blur-2xl border border-green-500/20 shadow-2xl shadow-green-500/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
              <CardContent className="p-5 relative">
                <div className="flex items-center justify-between mb-6">
                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
                      <p className="text-white font-bold text-base bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">Navigation</p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="text-gray-400 hover:text-white hover:bg-green-500/20 p-2 ml-auto transition-all duration-300 hover:scale-110 rounded-lg border border-green-500/20 hover:border-green-500/40 shadow-lg hover:shadow-green-500/30"
                    title={sidebarCollapsed ? 'Sidebar erweitern' : 'Sidebar einklappen'}
                  >
                    {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </Button>
                </div>
                <nav className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1 relative overflow-hidden ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl shadow-green-500/50 border border-green-400/30'
                        : 'text-gray-400 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white border border-transparent hover:border-green-500/20'
                    }`}
                    title={sidebarCollapsed ? t('dashboard.overview') : ''}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'overview' ? 'opacity-20' : ''}`}></div>
                    <Activity className={`w-5 h-5 relative z-10 ${activeTab === 'overview' ? 'drop-shadow-lg' : ''}`} />
                    {!sidebarCollapsed && <span className="font-semibold relative z-10">{t('dashboard.overview')}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('console')}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1 relative overflow-hidden ${
                      activeTab === 'console'
                        ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl shadow-green-500/50 border border-green-400/30'
                        : 'text-gray-400 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white border border-transparent hover:border-green-500/20'
                    }`}
                    title={sidebarCollapsed ? t('dashboard.console') : ''}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'console' ? 'opacity-20' : ''}`}></div>
                    <Terminal className={`w-5 h-5 relative z-10 ${activeTab === 'console' ? 'drop-shadow-lg' : ''}`} />
                    {!sidebarCollapsed && <span className="font-semibold relative z-10">{t('dashboard.console')}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('files')}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1 relative overflow-hidden ${
                      activeTab === 'files'
                        ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl shadow-green-500/50 border border-green-400/30'
                        : 'text-gray-400 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white border border-transparent hover:border-green-500/20'
                    }`}
                    title={sidebarCollapsed ? t('dashboard.files') : ''}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'files' ? 'opacity-20' : ''}`}></div>
                    <Folder className={`w-5 h-5 relative z-10 ${activeTab === 'files' ? 'drop-shadow-lg' : ''}`} />
                    {!sidebarCollapsed && <span className="font-semibold relative z-10">{t('dashboard.files')}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1 relative overflow-hidden ${
                      activeTab === 'settings'
                        ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl shadow-green-500/50 border border-green-400/30'
                        : 'text-gray-400 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white border border-transparent hover:border-green-500/20'
                    }`}
                    title={sidebarCollapsed ? t('dashboard.settings') : ''}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'settings' ? 'opacity-20' : ''}`}></div>
                    <Settings className={`w-5 h-5 relative z-10 ${activeTab === 'settings' ? 'drop-shadow-lg' : ''}`} />
                    {!sidebarCollapsed && <span className="font-semibold relative z-10">{t('dashboard.settings')}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('backups')}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-1 relative overflow-hidden ${
                      activeTab === 'backups'
                        ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl shadow-green-500/50 border border-green-400/30'
                        : 'text-gray-400 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white border border-transparent hover:border-green-500/20'
                    }`}
                    title={sidebarCollapsed ? t('dashboard.backups') : ''}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'backups' ? 'opacity-20' : ''}`}></div>
                    <Database className={`w-5 h-5 relative z-10 ${activeTab === 'backups' ? 'drop-shadow-lg' : ''}`} />
                    {!sidebarCollapsed && <span className="font-semibold relative z-10">{t('dashboard.backups')}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all transform hover:scale-105 ${
                      activeTab === 'billing'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    title={sidebarCollapsed ? t('dashboard.billing') : ''}
                  >
                    <CreditCard className="w-5 h-5" />
                    {!sidebarCollapsed && <span>{t('dashboard.billing')}</span>}
                  </button>
                </nav>
              </CardContent>
            </Card>

            {/* Server Info Card */}
            {!sidebarCollapsed && (
              <Card className="bg-gray-800/50 border-gray-700 mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">{t('dashboard.serverStatus')}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{t('dashboard.status')}</p>
                    <p className="text-white font-medium">{getStatusText()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{t('dashboard.ipAddress')}</p>
                    <p className="text-white font-mono text-sm">{serverData.ip}:{serverData.port}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{t('dashboard.plan')}</p>
                    <Badge className="bg-green-600">{serverData.plan}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className={`col-span-12 transition-all duration-300 ${sidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'}`}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Server Control */}
                <Card className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/90 to-black/95 backdrop-blur-2xl border border-green-500/30 shadow-2xl shadow-green-500/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/30 shadow-lg shadow-green-500/20">
                          <Server className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-3xl font-black bg-gradient-to-r from-green-300 via-emerald-200 to-white bg-clip-text text-transparent drop-shadow-lg">{serverData.name}</CardTitle>
                          <CardDescription className="text-gray-300 flex items-center gap-2 mt-2 font-medium">
                            <Server className="w-4 h-4 text-emerald-400" />
                            Minecraft {serverData.version}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleServerAction('start')}
                          disabled={serverStatus === 'online' || serverStatus === 'starting'}
                          className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:via-emerald-500 hover:to-green-600 shadow-xl shadow-green-500/40 disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-105 font-semibold group/btn border border-green-400/20"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-md"></div>
                          <Play className="w-4 h-4 mr-2 relative z-10" />
                          <span className="relative z-10">Start</span>
                        </Button>
                        <Button
                          onClick={() => handleServerAction('stop')}
                          disabled={serverStatus === 'offline' || serverStatus === 'stopping'}
                          className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 shadow-xl shadow-red-500/40 disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-105 font-semibold group/btn border border-red-400/20"
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-md"></div>
                          <Pause className="w-4 h-4 mr-2 relative z-10" />
                          <span className="relative z-10">Stop</span>
                        </Button>
                        <Button
                          onClick={() => handleServerAction('restart')}
                          disabled={serverStatus !== 'online'}
                          className="relative bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 border border-gray-500/30 shadow-xl shadow-gray-500/20 disabled:opacity-50 disabled:shadow-none transition-all duration-300 hover:scale-105 font-semibold group/btn"
                        >
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-md"></div>
                          <RotateCcw className="w-4 h-4 mr-2 relative z-10" />
                          <span className="relative z-10">Restart</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="group relative p-5 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 rounded-2xl border border-green-500/20 hover:border-green-500/60 transition-all duration-300 shadow-xl hover:shadow-green-500/30 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-xl group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                              <Users className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                            </div>
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Spieler</span>
                          </div>
                          {serverStatus === 'online' && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-400 font-semibold">LIVE</span>
                            </div>
                          )}
                        </div>
                        <p className="relative text-3xl font-black bg-gradient-to-r from-green-300 via-green-100 to-white bg-clip-text text-transparent drop-shadow-lg">{stats.currentPlayers}/{serverData.maxPlayers}</p>
                      </div>
                      <div className="group relative p-5 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 rounded-2xl border border-blue-500/20 hover:border-blue-500/60 transition-all duration-300 shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                            <Clock className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                          </div>
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Uptime</span>
                        </div>
                        <p className="relative text-3xl font-black bg-gradient-to-r from-blue-300 via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">{serverData.uptime}</p>
                      </div>
                      <div className="group relative p-5 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 rounded-2xl border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-xl group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                              <TrendingUp className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                            </div>
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">TPS</span>
                          </div>
                          {serverStatus === 'online' && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-400 font-semibold">LIVE</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="relative text-3xl font-black bg-gradient-to-r from-purple-300 via-purple-100 to-white bg-clip-text text-transparent drop-shadow-lg">{stats.tps.toFixed(1)}</p>
                          <span className={`text-sm font-semibold ${stats.tps >= 19.5 ? 'text-green-400' : stats.tps >= 18 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {stats.tps >= 19.5 ? '✓ Excellent' : stats.tps >= 18 ? '~ Good' : '✗ Lag'}
                          </span>
                        </div>
                      </div>
                      <div className="group relative p-5 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/60 transition-all duration-300 shadow-xl hover:shadow-yellow-500/30 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-yellow-500/30 to-amber-500/20 rounded-xl group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all">
                            <Shield className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                          </div>
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">DDoS</span>
                        </div>
                        <p className="relative text-lg font-black bg-gradient-to-r from-yellow-300 via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-lg">TCPShield</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Information Card - Only when server is online */}
                {serverStatus === 'online' && (
                  <Card className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/90 to-black/95 backdrop-blur-2xl border border-green-500/30 shadow-2xl shadow-green-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent pointer-events-none"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                    <CardHeader className="relative pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/30 shadow-lg shadow-green-500/20">
                          <Globe className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl font-bold bg-gradient-to-r from-green-300 via-emerald-200 to-white bg-clip-text text-transparent">🎮 Verbindungsinformationen</CardTitle>
                          <CardDescription className="text-gray-400 text-sm mt-0.5">Nutze diese Adresse zum Verbinden in Minecraft</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Server Address */}
                        <div className="p-4 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Server-Adresse</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(`${serverIp}:${serverPort}`);
                                toast.success('📋 Server-Adresse kopiert!');
                              }}
                              className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-all"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-white font-mono text-lg font-bold group-hover:text-green-400 transition-colors">{serverIp}:{serverPort}</p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="p-4 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">Standort</span>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <p className="text-white font-semibold">St. Gallen, Schweiz 🇨🇭</p>
                          </div>
                        </div>

                        {/* Minecraft Version */}
                        <div className="p-4 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">Minecraft Version</span>
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-purple-400" />
                            <p className="text-white font-semibold">{minecraftVersion} ({serverType.charAt(0).toUpperCase() + serverType.slice(1)})</p>
                          </div>
                        </div>

                        {/* DDoS Protection */}
                        <div className="p-4 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">DDoS-Schutz</span>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-yellow-400" />
                            <p className="text-white font-semibold">TCPShield <span className="text-green-400 text-xs">✓ Aktiv</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Connect Instructions */}
                      <div className="p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10 rounded-xl border border-green-500/30">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-white font-semibold mb-1">Schnellstart-Anleitung:</p>
                            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                              <li>Öffne Minecraft {minecraftVersion}</li>
                              <li>Klicke auf "Multiplayer"</li>
                              <li>Klicke auf "Server hinzufügen"</li>
                              <li>Kopiere die Server-Adresse: <code className="px-2 py-0.5 bg-black/40 rounded text-green-400 font-mono">{serverIp}:{serverPort}</code></li>
                              <li>Verbinde und spiele! 🎮</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Resource Warning Banner */}
                {(stats.cpu >= 80 || stats.ram >= 80 || stats.storage >= 80) && (
                  <div className="mb-6">
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                      stats.cpu >= 90 || stats.ram >= 90 || stats.storage >= 90
                        ? 'bg-red-900/20 border-red-600/50'
                        : 'bg-yellow-900/20 border-yellow-600/50'
                    }`}>
                      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        stats.cpu >= 90 || stats.ram >= 90 || stats.storage >= 90
                          ? 'text-red-500'
                          : 'text-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className={`font-medium mb-1 ${
                          stats.cpu >= 90 || stats.ram >= 90 || stats.storage >= 90
                            ? 'text-red-500'
                            : 'text-yellow-500'
                        }`}>
                          {stats.cpu >= 90 || stats.ram >= 90 || stats.storage >= 90 
                            ? '⚠️ Kritische Ressourcen-Auslastung!' 
                            : '⚠️ Hohe Ressourcen-Auslastung'}
                        </h4>
                        <div className="text-sm space-y-1">
                          {stats.cpu >= 80 && (
                            <p className={stats.cpu >= 90 ? 'text-red-400' : 'text-yellow-400'}>
                              • CPU: {Math.round(stats.cpu)}% {stats.cpu >= 90 ? '(KRITISCH)' : '(HOCH)'}
                            </p>
                          )}
                          {stats.ram >= 80 && (
                            <p className={stats.ram >= 90 ? 'text-red-400' : 'text-yellow-400'}>
                              • RAM: {Math.round(stats.ram)}% {stats.ram >= 90 ? '(KRITISCH)' : '(HOCH)'}
                            </p>
                          )}
                          {stats.storage >= 80 && (
                            <p className={stats.storage >= 90 ? 'text-red-400' : 'text-yellow-400'}>
                              • Speicher: {Math.round(stats.storage)}% {stats.storage >= 90 ? '(KRITISCH)' : '(HOCH)'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resource Usage */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border ${stats.cpu >= 90 ? 'border-red-500/50 shadow-xl shadow-red-500/20' : stats.cpu >= 80 ? 'border-yellow-500/50 shadow-xl shadow-yellow-500/20' : 'border-blue-500/20 shadow-lg'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stats.cpu >= 90 ? 'from-red-500/10 to-rose-500/10' : stats.cpu >= 80 ? 'from-yellow-500/10 to-amber-500/10' : 'from-blue-500/10 to-cyan-500/10'} pointer-events-none`}></div>
                    <CardHeader className="relative">
                      <CardTitle className="text-white text-sm flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${stats.cpu >= 90 ? 'bg-red-500/20' : stats.cpu >= 80 ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                            <Cpu className={`w-4 h-4 ${stats.cpu >= 90 ? 'text-red-400' : stats.cpu >= 80 ? 'text-yellow-400' : 'text-blue-400'}`} />
                          </div>
                          <span className="font-semibold">CPU Nutzung</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {serverStatus === 'online' && (
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-400 font-semibold">LIVE</span>
                            </div>
                          )}
                          {stats.cpu >= 80 && (
                            <AlertCircle className={`w-4 h-4 animate-pulse ${stats.cpu >= 90 ? 'text-red-500' : 'text-yellow-500'}`} />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">Aktuell</span>
                          <span className={`font-bold text-lg ${stats.cpu >= 90 ? 'text-red-400' : stats.cpu >= 80 ? 'text-yellow-400' : 'text-blue-400'}`}>{Math.round(stats.cpu)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 shadow-lg ${
                              stats.cpu >= 90 ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/50' : 
                              stats.cpu >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/50' : 
                              'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/50'
                            }`}
                            style={{ width: `${stats.cpu}%` }}
                          />
                        </div>
                        {stats.cpu >= 80 && (
                          <p className={`text-xs font-medium ${stats.cpu >= 90 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {stats.cpu >= 90 ? '⚠️ Kritisch!' : '⚠️ Hoch'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border ${stats.ram >= 90 ? 'border-red-500/50 shadow-xl shadow-red-500/20' : stats.ram >= 80 ? 'border-yellow-500/50 shadow-xl shadow-yellow-500/20' : 'border-green-500/20 shadow-lg'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stats.ram >= 90 ? 'from-red-500/10 to-rose-500/10' : stats.ram >= 80 ? 'from-yellow-500/10 to-amber-500/10' : 'from-green-500/10 to-emerald-500/10'} pointer-events-none`}></div>
                    <CardHeader className="relative">
                      <CardTitle className="text-white text-sm flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${stats.ram >= 90 ? 'bg-red-500/20' : stats.ram >= 80 ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                            <Activity className={`w-4 h-4 ${stats.ram >= 90 ? 'text-red-400' : stats.ram >= 80 ? 'text-yellow-400' : 'text-green-400'}`} />
                          </div>
                          <span className="font-semibold">RAM Nutzung</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {serverStatus === 'online' && (
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-400 font-semibold">LIVE</span>
                            </div>
                          )}
                          {stats.ram >= 80 && (
                            <AlertCircle className={`w-4 h-4 animate-pulse ${stats.ram >= 90 ? 'text-red-500' : 'text-yellow-500'}`} />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">{(serverData.ram * Math.round(stats.ram) / 100).toFixed(1)}GB / {serverData.ram}GB</span>
                          <span className={`font-bold text-lg ${stats.ram >= 90 ? 'text-red-400' : stats.ram >= 80 ? 'text-yellow-400' : 'text-green-400'}`}>{Math.round(stats.ram)}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 shadow-lg ${
                              stats.ram >= 90 ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/50' : 
                              stats.ram >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/50' : 
                              'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/50'
                            }`}
                            style={{ width: `${stats.ram}%` }}
                          />
                        </div>
                        {stats.ram >= 80 && (
                          <p className={`text-xs font-medium ${stats.ram >= 90 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {stats.ram >= 90 ? '⚠️ Kritisch!' : '⚠️ Hoch'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border ${stats.storage >= 90 ? 'border-red-500/50 shadow-xl shadow-red-500/20' : stats.storage >= 80 ? 'border-yellow-500/50 shadow-xl shadow-yellow-500/20' : 'border-purple-500/20 shadow-lg'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stats.storage >= 90 ? 'from-red-500/10 to-rose-500/10' : stats.storage >= 80 ? 'from-yellow-500/10 to-amber-500/10' : 'from-purple-500/10 to-pink-500/10'} pointer-events-none`}></div>
                    <CardHeader className="relative">
                      <CardTitle className="text-white text-sm flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${stats.storage >= 90 ? 'bg-red-500/20' : stats.storage >= 80 ? 'bg-yellow-500/20' : 'bg-purple-500/20'}`}>
                            <HardDrive className={`w-4 h-4 ${stats.storage >= 90 ? 'text-red-400' : stats.storage >= 80 ? 'text-yellow-400' : 'text-purple-400'}`} />
                          </div>
                          <span className="font-semibold">Storage Nutzung</span>
                        </div>
                        {stats.storage >= 80 && (
                          <AlertCircle className={`w-4 h-4 animate-pulse ${stats.storage >= 90 ? 'text-red-500' : 'text-yellow-500'}`} />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium">{stats.storage.toFixed(2)}GB / {serverData.storage}GB</span>
                          <span className={`font-bold text-lg ${getStoragePercentage() >= 90 ? 'text-red-400' : getStoragePercentage() >= 80 ? 'text-yellow-400' : 'text-purple-400'}`}>{Math.round(getStoragePercentage())}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 shadow-lg ${
                              getStoragePercentage() >= 90 ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/50' : 
                              getStoragePercentage() >= 80 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/50' : 
                              'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/50'
                            }`}
                            style={{ width: `${Math.min(100, getStoragePercentage())}%` }}
                          />
                        </div>
                        {getStoragePercentage() >= 80 && (
                          <p className={`text-xs font-medium ${getStoragePercentage() >= 90 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {getStoragePercentage() >= 90 ? '⚠️ Kritisch!' : '⚠️ Hoch'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Charts */}
                <div className="space-y-6">
                  {/* Time Range Selector */}
                  <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold text-sm">Zeitbereich</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: '10m', label: '10 Min' },
                          { value: '30m', label: '30 Min' },
                          { value: '1h', label: '1 Std' },
                          { value: '2h', label: '2 Std' },
                          { value: '3h', label: '3 Std' },
                          { value: '4h', label: '4 Std' },
                          { value: '5h', label: '5 Std' },
                          { value: '12h', label: '12 Std' },
                          { value: '24h', label: '24 Std' },
                          { value: '48h', label: '2 Tage' },
                          { value: '72h', label: '3 Tage' },
                          { value: '1w', label: '1 Woche' },
                        ].map((range) => (
                          <button
                            key={range.value}
                            onClick={() => setChartTimeRange(range.value as typeof chartTimeRange)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                              chartTimeRange === range.value
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* CPU & RAM Chart */}
                    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <div className="p-1.5 bg-blue-500/20 rounded-lg">
                            <Activity className="w-4 h-4 text-blue-400" />
                          </div>
                          CPU & RAM Auslastung
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* CPU & RAM Stats - Average for Time Range */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500/20 rounded">
                              <Cpu className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">CPU Ø</p>
                              <p className={`text-sm font-bold ${averageStats.cpu >= 90 ? 'text-red-400' : averageStats.cpu >= 80 ? 'text-yellow-400' : 'text-blue-400'}`}>
                                {serverStatus === 'online' ? `${Math.round(averageStats.cpu)}%` : '-'}
                              </p>
                            </div>
                          </div>
                          <div className="h-8 w-px bg-gray-700/50"></div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-500/20 rounded">
                              <Activity className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">RAM Ø</p>
                              <p className={`text-sm font-bold ${averageStats.ram >= 90 ? 'text-red-400' : averageStats.ram >= 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {serverStatus === 'online' ? `${Math.round(averageStats.ram)}%` : '-'}
                              </p>
                            </div>
                          </div>
                          <div className="h-8 w-px bg-gray-700/50"></div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">RAM Nutzung Ø</p>
                            <p className="text-sm text-gray-300">
                              {serverStatus === 'online' ? `${(serverData.ram * Math.round(averageStats.ram) / 100).toFixed(1)}GB / ${serverData.ram}GB` : '-'}
                            </p>
                          </div>
                        </div>

                        <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={historicalData}>
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                          <Area type="monotone" dataKey="ram" stroke="#22c55e" fillOpacity={1} fill="url(#colorRam)" name="RAM %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                    {/* Storage Chart */}
                    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <div className="p-1.5 bg-purple-500/20 rounded-lg">
                            <HardDrive className="w-4 h-4 text-purple-400" />
                          </div>
                          Storage-Auslastung
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Storage Stats - Average for Time Range */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-500/20 rounded">
                              <HardDrive className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Storage (Aktuell)</p>
                              <p className={`text-sm font-bold ${getStoragePercentage() >= 90 ? 'text-red-400' : getStoragePercentage() >= 80 ? 'text-yellow-400' : 'text-purple-400'}`}>
                                {Math.round(getStoragePercentage())}%
                              </p>
                            </div>
                          </div>
                          <div className="h-8 w-px bg-gray-700/50"></div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Genutzt / Total</p>
                            <p className="text-sm text-gray-300">
                              {stats.storage.toFixed(2)}GB / {serverData.storage}GB
                            </p>
                          </div>
                          {getStoragePercentage() >= 80 && (
                            <>
                              <div className="h-8 w-px bg-gray-700/50"></div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className={`w-4 h-4 animate-pulse ${getStoragePercentage() >= 90 ? 'text-red-500' : 'text-yellow-500'}`} />
                                <span className={`text-xs font-medium ${getStoragePercentage() >= 90 ? 'text-red-400' : 'text-yellow-400'}`}>
                                  {getStoragePercentage() >= 90 ? 'Kritisch!' : 'Hoch'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={historicalData}>
                          <defs>
                            <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="storage" stroke="#a855f7" fillOpacity={1} fill="url(#colorStorage)" name="Storage %" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                    {/* Network Chart */}
                    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-orange-500/20 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <div className="p-1.5 bg-orange-500/20 rounded-lg">
                            <Network className="w-4 h-4 text-orange-400" />
                          </div>
                          Netzwerk
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Network Stats - Average for Time Range */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-green-500/20 rounded">
                                <Download className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Download Ø</p>
                                <p className="text-sm font-bold text-white">
                                  {serverStatus === 'online' ? formatNetworkSpeed(averageStats.networkDownload) : '-'}
                                </p>
                              </div>
                            </div>
                            <div className="h-8 w-px bg-gray-700/50"></div>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-500/20 rounded">
                                <Upload className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Upload Ø</p>
                                <p className="text-sm font-bold text-white">
                                  {serverStatus === 'online' ? formatNetworkSpeed(averageStats.networkUpload) : '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Total Traffic</p>
                            <p className="text-sm text-gray-300">
                              ↓ {formatTraffic(stats.totalDownload)} • ↑ {formatTraffic(stats.totalUpload)}
                            </p>
                          </div>
                        </div>

                        {/* Network Chart */}
                        <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis 
                            stroke="#9ca3af" 
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => formatNetworkSpeed(value)}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                            formatter={(value: number) => formatNetworkSpeed(value)}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="download" stroke="#22c55e" strokeWidth={3} name="Download" dot={{ fill: '#22c55e', r: 4 }} />
                          <Line type="monotone" dataKey="upload" stroke="#3b82f6" strokeWidth={3} name="Upload" dot={{ fill: '#3b82f6', r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                    {/* Combined Overview Chart */}
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">Gesamt-Übersicht</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
                          <Line type="monotone" dataKey="ram" stroke="#22c55e" strokeWidth={2} name="RAM %" />
                          <Line type="monotone" dataKey="storage" stroke="#a855f7" strokeWidth={2} name="Storage %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  </div>
                </div>

                {/* Quick Actions */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Schnellzugriff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button 
                        onClick={() => setActiveTab('console')}
                        className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-600 transition-all group"
                      >
                        <Terminal className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Konsole</p>
                      </button>
                      <button 
                        onClick={() => setActiveTab('backups')}
                        className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-600 transition-all group"
                      >
                        <Database className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Backup</p>
                      </button>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-600 transition-all group"
                      >
                        <Settings className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Einstellungen</p>
                      </button>
                      <button 
                        onClick={() => setActiveTab('files')}
                        className="p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-green-600 transition-all group"
                      >
                        <Folder className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-300">Dateien</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'console' && (
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Terminal className="w-5 h-5 text-green-400" />
                    </div>
                    Server Konsole
                  </CardTitle>
                  <CardDescription>Führen Sie Server-Befehle aus und überwachen Sie Logs (Tippen Sie 'help' für alle Befehle)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative bg-black/90 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm border border-green-500/20 shadow-inner">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      {consoleLog.map((log, index) => (
                        <div key={index} className="text-green-400 mb-1 hover:bg-green-500/10 px-2 py-0.5 rounded transition-colors">
                          <span className="text-gray-600 mr-2">&gt;</span>{log}
                        </div>
                      ))}
                      <div ref={consoleEndRef} />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={consoleInput}
                        onChange={(e) => setConsoleInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleConsoleCommand()}
                        placeholder="Befehl eingeben... (z.B. 'start', 'help', 'status')"
                        className="bg-gray-900/50 border-gray-700 text-white font-mono focus:border-green-500 transition-all"
                      />
                      <Button
                        onClick={handleConsoleCommand}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                      >
                        Ausführen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'files' && (
              <div className="space-y-6">
                {/* Quick Server Control in Files Tab */}
                <Card className="bg-gradient-to-br from-gray-800/95 via-gray-900/90 to-black/95 backdrop-blur-2xl border border-green-500/20 shadow-xl shadow-green-500/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-lg border border-green-500/30">
                          <Server className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-sm font-bold">Server-Steuerung</CardTitle>
                          <CardDescription className="text-xs">Schnellzugriff auf Server-Befehle</CardDescription>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        serverStatus === 'online' ? 'bg-green-500/20 border border-green-500/30' :
                        serverStatus === 'offline' ? 'bg-red-500/20 border border-red-500/30' :
                        'bg-yellow-500/20 border border-yellow-500/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                        <span className="text-xs font-semibold text-white">{getStatusText()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleServerAction('start')}
                        disabled={serverStatus === 'online' || serverStatus === 'starting'}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-sm h-9"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                      <Button
                        onClick={() => handleServerAction('stop')}
                        disabled={serverStatus === 'offline' || serverStatus === 'stopping'}
                        variant="destructive"
                        className="flex-1 text-sm h-9"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                      <Button
                        onClick={() => handleServerAction('restart')}
                        disabled={serverStatus === 'offline' || serverStatus === 'starting' || serverStatus === 'stopping'}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-sm h-9"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Folder className="w-5 h-5" />
                      Datei-Manager
                    </CardTitle>
                    <CardDescription>Verwalten Sie Ihre Server-Dateien</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Upload Limit Info */}
                  <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-300 text-sm">
                      <Upload className="w-4 h-4" />
                      <span>Maximale Upload-Größe: <strong>10 GB</strong> pro Datei</span>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mb-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">Upload läuft...</span>
                        <span className="text-green-400 text-sm font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Breadcrumb Navigation */}
                  <div className="mb-4 flex items-center gap-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <Home className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-2 text-sm overflow-x-auto">
                      {getBreadcrumbs().map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {index > 0 && <span className="text-gray-600">/</span>}
                          <button
                            onClick={() => setCurrentPath(crumb.path)}
                            className={`hover:text-green-400 transition-colors ${
                              crumb.path === currentPath ? 'text-green-500 font-semibold' : 'text-gray-400'
                            }`}
                          >
                            {crumb.name}
                          </button>
                        </div>
                      ))}
                    </div>
                    {currentPath !== '/' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={navigateUp}
                        className="ml-auto text-gray-400 hover:text-green-400"
                        title="Zurück"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Zurück
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {getCurrentFiles().length === 0 ? (
                      <div className="text-center py-12 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-700">
                        <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Keine Dateien in diesem Verzeichnis</p>
                        <p className="text-gray-600 text-xs mt-1">Ordner erstellen oder Dateien hochladen</p>
                      </div>
                    ) : (
                      getCurrentFiles().map((file, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-3 bg-gray-900 rounded-lg border transition-all group ${
                            file.uploading 
                              ? 'border-green-500 cursor-wait opacity-75' 
                              : 'border-gray-700 hover:border-green-600 cursor-pointer'
                          }`}
                          onDoubleClick={() => !file.uploading && file.type === 'folder' && navigateToFolder(file.name)}
                        >
                          <div className="flex items-center gap-3 flex-1" onClick={() => !file.uploading && file.type === 'folder' && navigateToFolder(file.name)}>
                            {file.type === 'folder' ? (
                              <Folder className={`w-5 h-5 ${file.uploading ? 'text-green-400 animate-pulse' : 'text-blue-500'}`} />
                            ) : (
                              <File className={`w-5 h-5 ${file.uploading ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
                            )}
                            <div className="flex-1">
                              <p className={`text-white font-medium ${file.uploading ? 'animate-pulse' : ''}`}>
                                {file.name}
                                {file.uploading && <span className="ml-2 text-green-400 text-xs">Hochladen...</span>}
                              </p>
                              <p className="text-xs text-gray-400">{file.size} • {file.modified}</p>
                              {file.uploading && file.uploadProgress !== undefined && (
                                <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300 ease-out"
                                    style={{ width: `${file.uploadProgress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!file.uploading && file.type === 'folder' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-950"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToFolder(file.name);
                                }}
                                title="Öffnen"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            )}
                            {!file.uploading && file.type === 'file' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-950"
                                onClick={() => handleFileDownload(file)}
                                title="Herunterladen"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            {!file.uploading && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-gray-400 hover:text-red-500 hover:bg-red-950"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileDelete(file.name, file.size);
                                }}
                                title="Löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            {file.uploading && (
                              <div className="text-green-400 text-sm font-medium px-2">
                                {file.uploadProgress}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <input
                      type="file"
                      ref={folderInputRef}
                      onChange={handleFolderUpload}
                      className="hidden"
                      disabled={isUploading}
                      {...({ webkitdirectory: "", directory: "" } as any)}
                    />
                    <Button 
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Upload läuft...' : 'Datei hochladen'}
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => folderInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      Ordner hochladen
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => setShowCreateFolderDialog(true)}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      Ordner erstellen
                    </Button>
                  </div>

                  {/* Create Folder Dialog */}
                  {showCreateFolderDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Neuen Ordner erstellen</h3>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-300 mb-2">Ordnername</Label>
                            <Input
                              type="text"
                              placeholder="Mein Ordner..."
                              value={newFolderName}
                              onChange={(e) => {
                                // Filter out invalid characters in real-time
                                const value = e.target.value;
                                const invalidChars = /[\/\\:*?"<>|]/g;
                                const sanitized = value.replace(invalidChars, '');
                                if (value !== sanitized) {
                                  toast.error('Sonderzeichen wie / \\ : * ? " < > | sind nicht erlaubt', {
                                    duration: 2000,
                                  });
                                }
                                setNewFolderName(sanitized.slice(0, 255));
                              }}
                              onPaste={(e) => {
                                // Prevent pasting invalid characters
                                e.preventDefault();
                                const pastedText = e.clipboardData.getData('text');
                                const invalidChars = /[\/\\:*?"<>|]/g;
                                const sanitized = pastedText.replace(invalidChars, '').slice(0, 255);
                                if (pastedText !== sanitized) {
                                  toast.error('Ungültige Zeichen wurden entfernt', {
                                    duration: 2000,
                                  });
                                }
                                setNewFolderName(prev => (prev + sanitized).slice(0, 255));
                              }}
                              className="bg-gray-900 border-gray-600 text-white mt-2"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleCreateFolder();
                                }
                              }}
                              autoFocus
                              maxLength={255}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Keine Sonderzeichen: / \ : * ? " &lt; &gt; | • Max. 255 Zeichen
                            </p>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              onClick={() => {
                                setShowCreateFolderDialog(false);
                                setNewFolderName('');
                              }}
                            >
                              Abbrechen
                            </Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={handleCreateFolder}
                            >
                              <Folder className="w-4 h-4 mr-2" />
                              Erstellen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Server Einstellungen
                  </CardTitle>
                  <CardDescription>Konfigurieren Sie Ihren Server</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Currency Selection */}
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Währung auswählen
                      </Label>
                      <button
                        type="button"
                        onClick={fetchExchangeRates}
                        disabled={isLoadingRates}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                        title="Wechselkurse aktualisieren"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
                        <span>Aktualisieren</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrency('CHF')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currency === 'CHF'
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold ${currency === 'CHF' ? 'text-green-500' : 'text-gray-400'}`}>CHF</div>
                        <div className="text-xs text-gray-500 mt-1">Schweizer Franken</div>
                        <div className="text-xs text-gray-600 mt-1">1.00</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currency === 'USD'
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold ${currency === 'USD' ? 'text-green-500' : 'text-gray-400'}`}>USD</div>
                        <div className="text-xs text-gray-500 mt-1">US Dollar</div>
                        <div className="text-xs text-gray-600 mt-1">{currencyRates.USD.toFixed(4)}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('EUR')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currency === 'EUR'
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold ${currency === 'EUR' ? 'text-green-500' : 'text-gray-400'}`}>EUR</div>
                        <div className="text-xs text-gray-500 mt-1">Euro</div>
                        <div className="text-xs text-gray-600 mt-1">{currencyRates.EUR.toFixed(4)}</div>
                      </button>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500">
                        {currency === 'CHF' && '🇨🇭 Originalwährung - Keine Umrechnungsgebühren'}
                        {currency === 'USD' && `🇺🇸 Live-Kurs: 1 CHF = ${currencyRates.USD.toFixed(4)} USD`}
                        {currency === 'EUR' && `🇪🇺 Live-Kurs: 1 CHF = ${currencyRates.EUR.toFixed(4)} EUR`}
                      </p>
                      {lastUpdated && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <span>📊</span>
                          <span>Zuletzt aktualisiert: {lastUpdated.toLocaleString('de-CH', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Plan Management Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg shadow-green-500/50">
                          <Server className="w-5 h-5 text-white" />
                        </div>
                        Hosting-Plan
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Basic Plan */}
                        <div className={`relative border-2 rounded-xl p-6 transition-all transform hover:scale-105 ${
                          currentPlan === 'basic' 
                            ? 'border-green-500 bg-gradient-to-br from-green-900/30 to-emerald-900/20 shadow-2xl shadow-green-500/30' 
                            : 'border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-600 hover:shadow-xl'
                        }`}>
                          {currentPlan === 'basic' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 px-4 py-1">Aktueller Plan</Badge>
                            </div>
                          )}
                          <div className="text-center mb-6">
                            <h4 className="text-white font-bold text-xl">Basic</h4>
                            <p className="text-green-400 text-3xl font-bold mt-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              {isPrivileged ? (
                                <>
                                  <span className="line-through text-gray-500 text-xl mr-2">{formatCurrency(planInfo.basic.price)}</span>
                                  {formatCurrency(0)}
                                </>
                              ) : (
                                formatCurrency(planInfo.basic.price)
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">/Monat {isPrivileged && <span className={`font-semibold ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`}>(GRATIS)</span>}</p>
                          </div>
                          <ul className="space-y-3 mb-6">
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-green-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="font-medium">2 GB RAM</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-green-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="font-medium">{planInfo.basic.cpu} CPU Core{planInfo.basic.cpu > 1 ? 's' : ''}</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-green-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="font-medium">10 GB Storage</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-green-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="font-medium">{planInfo.basic.backups} Backups</span>
                            </li>
                          </ul>
                          {currentPlan !== 'basic' && (
                            <Button
                              onClick={() => handlePlanChange('basic')}
                              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            >
                              Zu Basic wechseln
                            </Button>
                          )}
                        </div>

                        {/* Pro Plan */}
                        <div className={`relative border-2 rounded-xl p-6 transition-all transform hover:scale-105 ${
                          currentPlan === 'pro' 
                            ? 'border-green-500 bg-gradient-to-br from-green-900/30 to-emerald-900/20 shadow-2xl shadow-green-500/30' 
                            : 'border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-600 hover:shadow-xl'
                        }`}>
                          {currentPlan === 'pro' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 px-4 py-1">Aktueller Plan</Badge>
                            </div>
                          )}
                          <div className="text-center mb-6">
                            <h4 className="text-white font-bold text-xl">Pro</h4>
                            <p className="text-blue-400 text-3xl font-bold mt-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                              {isPrivileged ? (
                                <>
                                  <span className="line-through text-gray-500 text-xl mr-2">{formatCurrency(planInfo.pro.price)}</span>
                                  {formatCurrency(0)}
                                </>
                              ) : (
                                formatCurrency(planInfo.pro.price)
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">/Monat {isPrivileged && <span className={`font-semibold ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`}>(GRATIS)</span>}</p>
                          </div>
                          <ul className="space-y-3 mb-6">
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-blue-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="font-medium">4 GB RAM</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-blue-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="font-medium">{planInfo.pro.cpu} CPU Cores</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-blue-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="font-medium">25 GB Storage</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-blue-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="font-medium">{planInfo.pro.backups} Backups</span>
                            </li>
                          </ul>
                          {currentPlan !== 'pro' && (
                            <Button
                              onClick={() => handlePlanChange('pro')}
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30"
                            >
                              {planInfo[currentPlan].price < planInfo.pro.price ? 'Zu Pro upgraden' : 'Zu Pro wechseln'}
                            </Button>
                          )}
                        </div>

                        {/* Premium Plan */}
                        <div className={`relative border-2 rounded-xl p-6 transition-all transform hover:scale-105 ${
                          currentPlan === 'premium' 
                            ? 'border-green-500 bg-gradient-to-br from-green-900/30 to-emerald-900/20 shadow-2xl shadow-green-500/30' 
                            : 'border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-600 hover:shadow-xl'
                        }`}>
                          {currentPlan === 'premium' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 px-4 py-1">Aktueller Plan</Badge>
                            </div>
                          )}
                          <div className="text-center mb-6">
                            <h4 className="text-white font-bold text-xl">Premium</h4>
                            <p className="text-purple-400 text-3xl font-bold mt-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {isPrivileged ? (
                                <>
                                  <span className="line-through text-gray-500 text-xl mr-2">{formatCurrency(planInfo.premium.price)}</span>
                                  {formatCurrency(0)}
                                </>
                              ) : (
                                formatCurrency(planInfo.premium.price)
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">/Monat {isPrivileged && <span className={`font-semibold ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`}>(GRATIS)</span>}</p>
                          </div>
                          <ul className="space-y-3 mb-6">
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">8 GB RAM</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">6 CPU Cores</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">50 GB Storage</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">{planInfo.premium.backups} Backups</span>
                            </li>
                          </ul>
                          {currentPlan !== 'premium' && (
                            <Button
                              onClick={() => handlePlanChange('premium')}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30"
                            >
                              Zu Premium upgraden
                            </Button>
                          )}
                        </div>

                        {/* Enterprise Plan with Sliders */}
                        <div className={`relative border-2 rounded-xl p-6 transition-all transform hover:scale-105 ${
                          currentPlan === 'enterprise' 
                            ? 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-violet-900/20 shadow-2xl shadow-purple-500/30' 
                            : 'border-gray-700 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-gray-600 hover:shadow-xl'
                        }`}>
                          {currentPlan === 'enterprise' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/50 px-4 py-1">Aktueller Plan</Badge>
                            </div>
                          )}
                          <div className="text-center mb-6">
                            <h4 className="text-white font-bold text-xl">Enterprise</h4>
                            <p className="text-purple-400 text-3xl font-bold mt-3 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                              {isPrivileged ? (
                                <>
                                  <span className="line-through text-gray-500 text-xl mr-2">{formatCurrency(Math.round(tempEnterpriseRam * 1.5 + tempEnterpriseCpu * 1.5 + tempEnterpriseStorage * 0.1))}</span>
                                  {formatCurrency(0)}
                                </>
                              ) : (
                                formatCurrency(Math.round(tempEnterpriseRam * 1.5 + tempEnterpriseCpu * 1.5 + tempEnterpriseStorage * 0.1))
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">/Monat {isPrivileged && <span className={`font-semibold ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`}>(GRATIS)</span>}</p>
                          </div>

                          {/* RAM Slider */}
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center">
                              <label className="text-sm text-gray-300">RAM</label>
                              <span className="text-sm text-purple-500">{tempEnterpriseRam}GB</span>
                            </div>
                            <Slider
                              value={[tempEnterpriseRam]}
                              onValueChange={(value) => {
                                if (currentPlan === 'enterprise') {
                                  setTempEnterpriseRam(value[0]);
                                }
                              }}
                              min={2}
                              max={12}
                              step={1}
                              className="w-full enterprise-slider"
                              disabled={currentPlan !== 'enterprise'}
                            />
                          </div>

                          {/* CPU Slider */}
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center">
                              <label className="text-sm text-gray-300">CPU Cores</label>
                              <span className="text-sm text-purple-500">{tempEnterpriseCpu} Core{tempEnterpriseCpu > 1 ? 's' : ''}</span>
                            </div>
                            <Slider
                              value={[tempEnterpriseCpu]}
                              onValueChange={(value) => {
                                if (currentPlan === 'enterprise') {
                                  setTempEnterpriseCpu(value[0]);
                                }
                              }}
                              min={2}
                              max={6}
                              step={1}
                              className="w-full enterprise-slider"
                              disabled={currentPlan !== 'enterprise'}
                            />
                          </div>

                          {/* Storage Slider */}
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between items-center">
                              <label className="text-sm text-gray-300">Storage</label>
                              <span className="text-sm text-purple-500">{tempEnterpriseStorage}GB</span>
                            </div>
                            <Slider
                              value={[tempEnterpriseStorage]}
                              onValueChange={(value) => {
                                if (currentPlan === 'enterprise') {
                                  setTempEnterpriseStorage(value[0]);
                                }
                              }}
                              min={15}
                              max={50}
                              step={5}
                              className="w-full enterprise-slider"
                              disabled={currentPlan !== 'enterprise'}
                            />
                          </div>

                          <ul className="space-y-3 mb-6">
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">{tempEnterpriseRam} GB RAM</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">{tempEnterpriseCpu} Core{tempEnterpriseCpu > 1 ? 's' : ''}</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">{tempEnterpriseStorage} GB Storage</span>
                            </li>
                            <li className="text-gray-200 flex items-center gap-2">
                              <div className="p-1 bg-purple-500/20 rounded">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-medium">{calculateEnterpriseBackups(tempEnterpriseRam, tempEnterpriseCpu, tempEnterpriseStorage)} Backups</span>
                            </li>
                          </ul>
                          
                          {currentPlan === 'enterprise' && (tempEnterpriseRam !== enterpriseRam || tempEnterpriseCpu !== enterpriseCpu || tempEnterpriseStorage !== enterpriseStorage) && (
                            <Button
                              onClick={() => setShowEnterpriseConfigDialog(true)}
                              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/30 mb-3"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Änderungen übernehmen
                            </Button>
                          )}
                          
                          {currentPlan !== 'enterprise' && (
                            <Button
                              onClick={() => handlePlanChange('enterprise')}
                              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/30"
                            >
                              Zu Enterprise upgraden
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6"></div>

                  {/* Server Connection Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg shadow-blue-500/50">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      Server-Verbindung
                    </h3>
                    
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-2 border-blue-500/50 rounded-xl p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Server className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">Server-Adresse (für Spieler)</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Teile diese Adresse mit deinen Spielern, damit sie sich verbinden können:
                          </p>
                          <div className="bg-gray-900/80 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <p className="text-green-400 font-mono text-lg font-bold">{serverIp}</p>
                              <p className="text-gray-400 text-sm mt-1">Port: {serverPort} (Standard)</p>
                            </div>
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(serverIp);
                                toast.success('Server-Adresse kopiert!');
                                addConsoleLog(`Server-Adresse in Zwischenablage kopiert: ${serverIp}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Kopieren
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Terminal className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">RCON-Verbindung (für Remote-Konsole)</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            Verbinde dein Tool (z.B. RCON CLI, mcrcon) mit diesen Daten:
                          </p>
                          <div className="space-y-2">
                            <div className="bg-gray-900/80 border border-purple-500/30 rounded-lg p-3">
                              <p className="text-gray-400 text-sm mb-1">Host:</p>
                              <p className="text-purple-400 font-mono">{serverIp}</p>
                            </div>
                            <div className="bg-gray-900/80 border border-purple-500/30 rounded-lg p-3">
                              <p className="text-gray-400 text-sm mb-1">Port:</p>
                              <p className="text-purple-400 font-mono">{rconPort}</p>
                            </div>
                            <div className="bg-gray-900/80 border border-purple-500/30 rounded-lg p-3">
                              <p className="text-gray-400 text-sm mb-1">Passwort:</p>
                              <div className="flex items-center justify-between">
                                <p className="text-purple-400 font-mono">••••••••••••</p>
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(rconPassword);
                                    toast.success('RCON-Passwort kopiert!');
                                    addConsoleLog('RCON-Passwort in Zwischenablage kopiert');
                                  }}
                                  className="bg-purple-600 hover:bg-purple-700"
                                  size="sm"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Kopieren
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-300 space-y-2">
                            <p className="font-semibold text-blue-400">Anleitung für Spieler:</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-400">
                              <li>Minecraft öffnen und auf "Multiplayer" klicken</li>
                              <li>Auf "Server hinzufügen" klicken</li>
                              <li>Server-Adresse eingeben: <span className="text-green-400 font-mono">{serverIp}</span></li>
                              <li>Server speichern und verbinden!</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6"></div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Server Name</Label>
                      <Input
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">MOTD (Message of the Day)</Label>
                      <Input
                        value={motd}
                        onChange={(e) => setMotd(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white mt-2"
                      />
                    </div>
                    
                    {/* Minecraft Version Selection */}
                    <div>
                      <Label className="text-gray-300">{t('dashboard.settings.version')}</Label>
                      <select
                        className="w-full mt-2 bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={minecraftVersion}
                        onChange={(e) => {
                          setMinecraftVersion(e.target.value);
                          toast.success(t('toast.versionChanged').replace('{version}', e.target.value));
                        }}
                        disabled={autoUpdate}
                      >
                        {minecraftVersions.map(version => (
                          <option key={version} value={version}>Minecraft {version}</option>
                        ))}
                      </select>
                      {autoUpdate && (
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Auto-Update aktiviert - Verwendet immer die neueste Version
                        </p>
                      )}
                    </div>

                    {/* Auto Update Toggle */}
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{t('dashboard.settings.autoUpdate')}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {t('dashboard.settings.autoUpdateDesc')}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={autoUpdate}
                            onChange={(e) => {
                              setAutoUpdate(e.target.checked);
                              toast.success(e.target.checked ? t('toast.autoUpdateEnabled') : t('toast.autoUpdateDisabled'));
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                      {autoUpdate && (
                        <div className="mt-3 p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-green-400 font-medium">
                                {t('dashboard.settings.autoUpdateActive')}
                              </p>
                              <p className="text-xs text-green-400/70 mt-1">
                                Aktuelle Version: Minecraft {minecraftVersion}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Server Type Selection */}
                    <div>
                      <Label className="text-gray-300">{t('dashboard.settings.serverType')}</Label>
                      <p className="text-sm text-gray-400 mt-1 mb-3">
                        {t('dashboard.settings.serverTypeDesc')}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(Object.keys(serverTypeInfo) as Array<keyof typeof serverTypeInfo>).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleServerTypeChange(type)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              serverType === type
                                ? `border-green-600 ${serverTypeInfo[type].color}/20`
                                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{serverTypeInfo[type].icon}</span>
                              <span className="text-white font-medium">{serverTypeInfo[type].name}</span>
                            </div>
                            <p className="text-xs text-gray-400">{serverTypeInfo[type].description}</p>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 p-3 bg-gray-900 border border-gray-700 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{serverTypeInfo[serverType].icon}</span>
                          <div>
                            <p className="text-sm text-white font-medium">{serverTypeInfo[serverType].name} ausgewählt</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {serverTypeInfo[serverType].description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Spielmodus</Label>
                        <select
                          className="w-full mt-2 bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
                          value={gameMode}
                          onChange={(e) => handleGameModeChange(e.target.value as typeof gameMode)}
                        >
                          <option value="survival">Survival</option>
                          <option value="creative">Creative</option>
                          <option value="adventure">Adventure</option>
                          <option value="spectator">Spectator</option>
                          <option value="hardcore">Hardcore</option>
                        </select>
                        {gameMode === 'hardcore' && (
                          <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Hardcore: Permadeath aktiviert
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-300">Schwierigkeit</Label>
                        <select
                          className="w-full mt-2 bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          value={difficulty}
                          onChange={(e) => handleDifficultyChange(e.target.value as typeof difficulty)}
                          disabled={gameMode === 'hardcore'}
                        >
                          <option value="peaceful">Peaceful</option>
                          <option value="easy">Easy</option>
                          <option value="normal">Normal</option>
                          <option value="hard">Hard</option>
                        </select>
                        {gameMode === 'hardcore' && (
                          <p className="text-xs text-gray-400 mt-1">
                            Bei Hardcore immer auf Hard gesetzt
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="pvp" className="rounded" defaultChecked />
                      <label htmlFor="pvp" className="text-gray-300">PvP aktivieren</label>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="whitelist" 
                          className="rounded" 
                          checked={whitelist}
                          onChange={(e) => setWhitelist(e.target.checked)}
                        />
                        <label htmlFor="whitelist" className="text-gray-300">Whitelist aktivieren</label>
                      </div>
                      
                      {/* Whitelist Player List */}
                      {whitelist && (
                        <div className="ml-6 p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-medium text-sm flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-500" />
                              Whitelistete Spieler ({whitelistedPlayers.length}/{maxPlayers})
                            </h4>
                          </div>
                          
                          {/* Whitelist Limit Warning */}
                          {whitelistedPlayers.length >= maxPlayers && (
                            <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-yellow-500 text-xs font-medium">
                                  Whitelist-Limit erreicht!
                                </p>
                                <p className="text-yellow-400/80 text-xs mt-1">
                                  Du kannst maximal {maxPlayers} Spieler zur Whitelist hinzufügen. Erhöhe die maximale Spieleranzahl, um mehr Spieler hinzuzufügen.
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Add Player Form */}
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Spielername..."
                              value={newPlayerName}
                              onChange={(e) => setNewPlayerName(e.target.value)}
                              className="bg-gray-800 border-gray-600 text-white flex-1"
                              disabled={whitelistedPlayers.length >= maxPlayers}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && newPlayerName.trim()) {
                                  if (whitelistedPlayers.length >= maxPlayers) {
                                    toast.error(`Whitelist-Limit erreicht! Maximal ${maxPlayers} Spieler erlaubt.`);
                                    return;
                                  }
                                  if (!whitelistedPlayers.includes(newPlayerName.trim())) {
                                    setWhitelistedPlayers([...whitelistedPlayers, newPlayerName.trim()]);
                                    addConsoleLog(`Spieler hinzugefügt zur Whitelist: ${newPlayerName.trim()}`);
                                    setNewPlayerName('');
                                    toast.success(`${newPlayerName} zur Whitelist hinzugefügt!`);
                                    if (whitelistedPlayers.length + 1 >= maxPlayers) {
                                      toast.warning('Whitelist-Limit erreicht!');
                                    }
                                  } else {
                                    toast.error('Spieler ist bereits auf der Whitelist');
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={whitelistedPlayers.length >= maxPlayers}
                              onClick={() => {
                                if (newPlayerName.trim()) {
                                  if (whitelistedPlayers.length >= maxPlayers) {
                                    toast.error(`Whitelist-Limit erreicht! Maximal ${maxPlayers} Spieler erlaubt.`);
                                    return;
                                  }
                                  if (!whitelistedPlayers.includes(newPlayerName.trim())) {
                                    setWhitelistedPlayers([...whitelistedPlayers, newPlayerName.trim()]);
                                    addConsoleLog(`Spieler hinzugefügt zur Whitelist: ${newPlayerName.trim()}`);
                                    setNewPlayerName('');
                                    toast.success(`${newPlayerName} zur Whitelist hinzugefügt!`);
                                    if (whitelistedPlayers.length + 1 >= maxPlayers) {
                                      toast.warning('Whitelist-Limit erreicht!');
                                    }
                                  } else {
                                    toast.error('Spieler ist bereits auf der Whitelist');
                                  }
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Player List */}
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {whitelistedPlayers.length === 0 ? (
                              <p className="text-gray-400 text-sm text-center py-4">
                                Noch keine Spieler auf der Whitelist
                              </p>
                            ) : (
                              whitelistedPlayers.map((player, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-800 rounded hover:bg-gray-750 group"
                                >
                                  <span className="text-gray-300 text-sm flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                      {player.charAt(0).toUpperCase()}
                                    </div>
                                    {player}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setWhitelistedPlayers(whitelistedPlayers.filter((_, i) => i !== index));
                                      addConsoleLog(`Spieler entfernt von Whitelist: ${player}`);
                                      toast.success(`${player} von der Whitelist entfernt`);
                                    }}
                                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Server Configuration Section */}
                    <div className="border-t border-gray-700 pt-6 mt-6">
                      <h3 className="text-white font-medium text-lg mb-4">Server-Konfiguration</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Max Players */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-500" />
                            Maximale Spieleranzahl
                          </Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Input
                                type="number"
                                min="1"
                                max="1000"
                                value={maxPlayers}
                                onChange={(e) => {
                                  const value = Math.max(1, Math.min(1000, Number(e.target.value)));
                                  setMaxPlayers(value);
                                }}
                                className="bg-gray-900 border-gray-700 text-white w-24"
                              />
                              <input
                                type="range"
                                min="1"
                                max="1000"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                              />
                            </div>
                            <p className="text-xs text-gray-400">
                              Aktuell: {serverData.currentPlayers} / {maxPlayers} Spieler online
                            </p>
                            {maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance) && (
                              <p className="text-xs text-yellow-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Performance-Warnung: Bei {serverData.cpu} Core{serverData.cpu > 1 ? 's' : ''} und {renderDistance} Chunks werden max. {getMaxPlayersThreshold(serverData.cpu, renderDistance)} Spieler empfohlen
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Render Distance */}
                        <div className="space-y-2">
                          <Label className="text-gray-300 flex items-center gap-2">
                            <Server className="w-4 h-4 text-blue-500" />
                            Render-Distanz (Chunks)
                          </Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Input
                                type="number"
                                min="2"
                                max="64"
                                value={renderDistance}
                                onChange={(e) => {
                                  const value = Math.max(2, Math.min(64, Number(e.target.value)));
                                  setRenderDistance(value);
                                }}
                                className="bg-gray-900 border-gray-700 text-white w-24"
                              />
                              <input
                                type="range"
                                min="2"
                                max="64"
                                value={renderDistance}
                                onChange={(e) => setRenderDistance(Number(e.target.value))}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                            <p className="text-xs text-gray-400">
                              {renderDistance} Chunks = ca. {renderDistance * 16} Blöcke Sichtweite
                            </p>
                            {renderDistance > getRenderDistanceThreshold(serverData.cpu) && (
                              <p className="text-xs text-yellow-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Performance-Warnung: Für {serverData.cpu} CPU Core{serverData.cpu > 1 ? 's' : ''} wird max. {getRenderDistanceThreshold(serverData.cpu)} Chunks empfohlen
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Info Boxes */}
                      <div className="mt-6 space-y-3">
                        {/* Player Recommendation */}
                        <div className={`p-4 border rounded-lg ${
                          maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance)
                            ? 'bg-yellow-600/10 border-yellow-600/20'
                            : 'bg-green-600/10 border-green-600/20'
                        }`}>
                          <div className="flex items-start gap-2">
                            <Users className={`w-5 h-5 mt-0.5 ${
                              maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance)
                                ? 'text-yellow-400'
                                : 'text-green-400'
                            }`} />
                            <div>
                              <p className={`font-medium text-sm ${
                                maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance)
                                  ? 'text-yellow-400'
                                  : 'text-green-400'
                              }`}>
                                {maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance)
                                  ? '⚠️ Spieleranzahl-Warnung'
                                  : '✓ Spieleranzahl optimal'}
                              </p>
                              <p className={`text-xs mt-1 ${
                                maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance)
                                  ? 'text-yellow-400/80'
                                  : 'text-green-400/80'
                              }`}>
                                Mit {serverData.cpu} CPU Core{serverData.cpu > 1 ? 's' : ''} und {renderDistance} Chunks Render-Distanz empfehlen wir maximal {getMaxPlayersThreshold(serverData.cpu, renderDistance)} Spieler.
                                {maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance) && (
                                  <> Eine höhere Spieleranzahl kann zu Performance-Problemen führen.</>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Render Distance Recommendation */}
                        <div className={`p-4 border rounded-lg ${
                          renderDistance > getRenderDistanceThreshold(serverData.cpu)
                            ? 'bg-yellow-600/10 border-yellow-600/20'
                            : 'bg-blue-600/10 border-blue-600/20'
                        }`}>
                          <div className="flex items-start gap-2">
                            <Server className={`w-5 h-5 mt-0.5 ${
                              renderDistance > getRenderDistanceThreshold(serverData.cpu)
                                ? 'text-yellow-400'
                                : 'text-blue-400'
                            }`} />
                            <div>
                              <p className={`font-medium text-sm ${
                                renderDistance > getRenderDistanceThreshold(serverData.cpu)
                                  ? 'text-yellow-400'
                                  : 'text-blue-400'
                              }`}>
                                {renderDistance > getRenderDistanceThreshold(serverData.cpu)
                                  ? '⚠️ Render-Distanz-Warnung'
                                  : '✓ Render-Distanz optimal'}
                              </p>
                              <p className={`text-xs mt-1 ${
                                renderDistance > getRenderDistanceThreshold(serverData.cpu)
                                  ? 'text-yellow-400/80'
                                  : 'text-blue-400/80'
                              }`}>
                                Bei {serverData.cpu} CPU Core{serverData.cpu > 1 ? 's' : ''} empfehlen wir maximal {getRenderDistanceThreshold(serverData.cpu)} Chunks.
                                {renderDistance > getRenderDistanceThreshold(serverData.cpu) && (
                                  <> Höhere Werte erhöhen die CPU-Auslastung und reduzieren die maximale Spieleranzahl.</>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const timestamp = new Date().toLocaleTimeString();
                      
                      // Save settings to localStorage
                      saveDashboardData('maxPlayers', maxPlayers);
                      saveDashboardData('renderDistance', renderDistance);
                      
                      // Add to server console log
                      setConsoleLog(prev => [
                        ...prev,
                        `[${timestamp}] ═══════════════════════════════════════`,
                        `[${timestamp}] 💾 EINSTELLUNGEN GESPEICHERT`,
                        `[${timestamp}] ═══════════════════════════════════════`,
                        `[${timestamp}] 👥 Max. Spieler: ${maxPlayers} (Empfohlen: ${getMaxPlayersThreshold(serverData.cpu, renderDistance)})`,
                        `[${timestamp}] 🗺️ Render-Distanz: ${renderDistance} Chunks (${renderDistance * 16} Blöcke)`,
                        maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance) 
                          ? `[${timestamp}] ⚠️ Warnung: Spieleranzahl über Empfehlung!` 
                          : `[${timestamp}] ✓ Spieleranzahl optimal`,
                        renderDistance > getRenderDistanceThreshold(serverData.cpu)
                          ? `[${timestamp}] ⚠️ Warnung: Render-Distanz über Empfehlung!`
                          : `[${timestamp}] ✓ Render-Distanz optimal`,
                        `[${timestamp}] ✓ Konfiguration erfolgreich aktualisiert`,
                        `[${timestamp}] ═══════════════════════════════════════`,
                      ]);
                      
                      // Log complete server configuration to browser console
                      console.log('═══════════════════════════════════════════════════════════');
                      console.log('SERVER-KONFIGURATION GESPEICHERT');
                      console.log('═══════════════════════════════════════════════════════════');
                      console.log('');
                      console.log('SERVER DETAILS:');
                      console.log('  Servername:', serverData.name);
                      console.log('  Plan:', serverData.plan);
                      console.log('  RAM:', serverData.ram, 'GB');
                      console.log('  CPU Cores:', serverData.cpu);
                      console.log('  Storage:', serverData.storage, 'GB');
                      console.log('  IP-Adresse:', serverData.ip);
                      console.log('  Port:', serverData.port);
                      console.log('  Version:', serverData.version);
                      console.log('  Standort:', serverData.location);
                      console.log('');
                      console.log('SPIELER-EINSTELLUNGEN:');
                      console.log('  Maximale Spieleranzahl:', maxPlayers);
                      console.log('  Aktuell online:', serverData.currentPlayers);
                      console.log('  Empfohlenes Maximum:', getMaxPlayersThreshold(serverData.cpu, renderDistance));
                      console.log('  Status:', maxPlayers > getMaxPlayersThreshold(serverData.cpu, renderDistance) ? '⚠️ Warnung - Über Empfehlung' : '✓ Optimal');
                      console.log('');
                      console.log('RENDER-EINSTELLUNGEN:');
                      console.log('  Render-Distanz:', renderDistance, 'Chunks');
                      console.log('  Sichtweite:', renderDistance * 16, 'Blöcke');
                      console.log('  Empfohlenes Maximum:', getRenderDistanceThreshold(serverData.cpu), 'Chunks');
                      console.log('  Status:', renderDistance > getRenderDistanceThreshold(serverData.cpu) ? '⚠️ Warnung - Über Empfehlung' : '✓ Optimal');
                      console.log('');
                      console.log('PERFORMANCE-ANALYSE:');
                      console.log('  CPU Auslastung:', stats.cpu, '%');
                      console.log('  RAM Auslastung:', stats.ram, '%', `(${(serverData.ram * stats.ram / 100).toFixed(1)}GB / ${serverData.ram}GB)`);
                      console.log('  Storage Auslastung:', getStoragePercentage().toFixed(1), '%', `(${stats.storage.toFixed(2)}GB / ${serverData.storage}GB)`);
                      console.log('  Server Status:', serverStatus);
                      console.log('  Uptime:', serverData.uptime);
                      console.log('');
                      console.log('BACKUP-KONFIGURATION:');
                      console.log('  Frequenz:', backupConfig.frequency);
                      console.log('  Maximale Backups:', backupConfig.maxBackups);
                      console.log('  Aktuelle Backups:', backups.length);
                      console.log('  Extra Backup-Slots:', extraBackupSlots);
                      console.log('  Aufbewahrung:', backupConfig.retention);
                      console.log('');
                      console.log('ZUSÄTZLICHE SERVICES:');
                      console.log('  DDoS-Schutz: TCPShield');
                      console.log('  Priority Support:', hasPrioritySupport ? 'Aktiv' : prioritySupportPending ? 'Geplant' : 'Nicht aktiv');
                      console.log('');
                      console.log('═══════════════════════════════════════════════════════════');
                      console.log('Timestamp:', new Date().toLocaleString('de-CH'));
                      console.log('═══════════════════════════════════════════════════════════');
                      
                      toast.success('💾 Einstellungen gespeichert!');
                    }}
                  >
                    Einstellungen speichern
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'backups' && (
              <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Database className="w-5 h-5 text-purple-400" />
                        </div>
                        Backups ({backups.length}/{backupConfig.maxBackups})
                      </CardTitle>
                      <CardDescription>
                        Verwalten Sie Ihre Server-Backups • {backupConfig.frequency} • Max. {backupConfig.maxBackups} Backups • Ältestes wird automatisch gelöscht
                      </CardDescription>
                    </div>
                    {backupConfig.canCreateManual ? (
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => toast.success(t('toast.backupCreating'))}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('dashboard.backups.new')}
                      </Button>
                    ) : (
                      <Button 
                        className="bg-gray-600 cursor-not-allowed"
                        disabled
                        title={t('dashboard.backups.notAvailable')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('dashboard.backups.new')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <div key={backup.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${backup.auto ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                            <Database className={`w-5 h-5 ${backup.auto ? 'text-blue-400' : 'text-purple-400'}`} />
                          </div>
                          <div>
                            <p className="text-white font-semibold flex items-center gap-2">
                              {backup.name}
                              {backup.auto && <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30 text-xs">Auto</Badge>}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              {backup.date} • {backup.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                            onClick={() => toast.success(t('toast.backupRestoring'))}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {t('dashboard.backups.restore')}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30"
                            onClick={() => toast.success(t('toast.backupDownloading'))}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {!backup.auto && (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/30"
                              onClick={() => handleDeleteBackup(backup.id, backup.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Extra Backup Slots Purchase */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-600/30 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Plus className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">Zusätzliche Backup-Slots</p>
                          <p className="text-sm text-gray-400">
                            {extraBackupSlots > 0 
                              ? `${extraBackupSlots} zusätzliche Slots aktiv (${backupConfig.baseMaxBackups} + ${extraBackupSlots} = ${backupConfig.maxBackups} Gesamt)`
                              : `Erweitern Sie Ihr Backup-Limit über ${backupConfig.baseMaxBackups} Backups hinaus`
                            }
                          </p>
                        </div>
                      </div>
                      {isPrivileged && extraBackupSlots > 0 && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Gratis
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-600/20 border-red-600/30 hover:bg-red-600/30 text-white"
                        onClick={() => {
                          if (extraBackupSlots > 0) {
                            setExtraBackupSlots(prev => prev - 1);
                            if (!isPrivileged) {
                              toast.success(`✅ 1 Backup-Slot entfernt. Neue Kosten: CHF ${(extraBackupSlots - 1) * 0.20}/Monat`);
                            } else {
                              toast.success(`👑 ${user?.isOwner ? 'Owner' : 'Admin'}: 1 Backup-Slot entfernt - Kostenlos!`);
                            }
                          }
                        }}
                        disabled={extraBackupSlots === 0}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Entfernen
                      </Button>
                      <div className="flex-1 text-center">
                        <p className="text-2xl font-bold text-white">{extraBackupSlots}</p>
                        <p className="text-xs text-gray-400">
                          {isPrivileged ? (
                            <span className="text-amber-400 flex items-center justify-center gap-1">
                              <Crown className="w-3 h-3" />
                              Kostenlos
                            </span>
                          ) : (
                            `CHF ${(extraBackupSlots * 0.20).toFixed(2)}/Monat`
                          )}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                        onClick={() => {
                          setExtraBackupSlots(prev => prev + 1);
                          if (!isPrivileged) {
                            toast.success(`🚀 1 zusätzlicher Backup-Slot hinzugefügt! Kosten: CHF 0.20/Monat (Total: CHF ${((extraBackupSlots + 1) * 0.20).toFixed(2)}/Monat)`);
                          } else {
                            toast.success(`👑 ${user?.isOwner ? 'Owner' : 'Admin'}: 1 zusätzlicher Backup-Slot hinzugefügt - Kostenlos!`);
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Hinzufügen
                      </Button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-600/20">
                      <p className="text-xs text-gray-400 text-center">
                        💰 Jeder zusätzliche Slot kostet <strong className="text-purple-400">CHF 0.20/Monat</strong> • 
                        Geht direkt auf die Rechnung
                      </p>
                    </div>
                  </div>
                  
                  {/* Plan-specific Info */}
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-lg border ${
                      serverData.plan === 'Basic'
                        ? 'bg-blue-600/10 border-blue-600/20'
                        : serverData.plan === 'Pro'
                        ? 'bg-purple-600/10 border-purple-600/20'
                        : 'bg-green-600/10 border-green-600/20'
                    }`}>
                      <div className="flex items-start gap-2">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${
                          serverData.plan === 'Basic'
                            ? 'text-blue-400'
                            : serverData.plan === 'Pro'
                            ? 'text-purple-400'
                            : 'text-green-400'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            serverData.plan === 'Basic'
                              ? 'text-blue-400'
                              : serverData.plan === 'Pro'
                              ? 'text-purple-400'
                              : 'text-green-400'
                          }`}>
                            {backupConfig.frequency}
                          </p>
                          <p className={`text-sm mt-1 ${
                            serverData.plan === 'Basic'
                              ? 'text-blue-400/80'
                              : serverData.plan === 'Pro'
                              ? 'text-purple-400/80'
                              : 'text-green-400/80'
                          }`}>
                            {backupConfig.description}
                          </p>
                          <p className={`text-sm mt-2 ${
                            serverData.plan === 'Basic'
                              ? 'text-blue-400/80'
                              : serverData.plan === 'Pro'
                              ? 'text-purple-400/80'
                              : 'text-green-400/80'
                          }`}>
                            📦 <strong>Max. {backupConfig.maxBackups} Backups</strong> • 🗑️ Ältestes Backup wird <strong>automatisch gelöscht</strong> wenn Limit erreicht
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade Notice for Basic */}
                    {!backupConfig.canCreateManual && (
                      <div className="p-4 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 border border-yellow-600/30 rounded-xl shadow-lg">
                        <div className="flex items-start gap-2">
                          <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-yellow-400 font-semibold">Manuelle Backups nicht verfügbar</p>
                            <p className="text-sm text-gray-300 mt-1">
                              Upgraden Sie auf den <strong>Pro Plan (7 Backups, 10 Tage Aufbewahrung)</strong> für stündliche Backups und manuelle Backup-Erstellung, 
                              oder auf den <strong>Premium Plan (10 Backups, 14 Tage Aufbewahrung)</strong> für Echtzeit-Backups und erweiterte Funktionen.
                            </p>
                            <Button 
                              size="sm" 
                              className="mt-3 bg-green-600 hover:bg-green-700"
                              onClick={() => toast.info(t('toast.planUpgrade'))}
                            >
                              <ChevronRight className="w-4 h-4 mr-1" />
                              {t('dashboard.backups.upgrade')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <CreditCard className="w-5 h-5 text-green-400" />
                      </div>
                      Aktueller Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {serverData.plan} Plan
                          {isPrivileged && (
                            <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30">
                              <Crown className="w-3 h-3 mr-1" />
                              {user?.isOwner ? 'Owner' : 'Admin'}
                            </Badge>
                          )}
                        </p>
                        <p className="text-gray-400 mt-1">
                          {isPrivileged ? (
                            <span className="text-amber-400 flex items-center gap-2">
                              <Crown className="w-4 h-4" />
                              CHF 0.00/Monat (Kostenlos) + 8.1% MwSt.
                            </span>
                          ) : (
                            <>
                              CHF {calculateTotalMonthlyCost().toFixed(2)}/Monat + 8.1% MwSt.
                              {extraBackupSlots > 0 && (
                                <span className="text-purple-400 text-sm ml-2">
                                  (inkl. {extraBackupSlots} Backup-Slots: CHF {(extraBackupSlots * 0.20).toFixed(2)})
                                </span>
                              )}
                            </>
                          )}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-300">{serverData.ram}GB RAM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-300">{serverData.storage}GB Storage</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-300">{serverData.maxPlayers} Spieler</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Plan ändern
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enterprise Priority Support Add-on */}
                {serverData.plan === 'Enterprise' && (
                  <>
                    {/* Calculate Enterprise price */}
                    {(() => {
                      const enterprisePrice = enterpriseRam * 1.5 + enterpriseCpu * 1.5 + enterpriseStorage * 0.1;
                      const isPriorityActive = enterprisePrice > 15 || hasPrioritySupport;
                      const isPriorityPending = prioritySupportPending && !hasPrioritySupport;
                      
                      if (isPriorityPending) {
                        // Priority Support pending activation (next month)
                        const activationDateFormatted = prioritySupportActivationDate?.toLocaleDateString('de-DE', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        });
                        
                        return (
                          <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-xl border-blue-700/50 shadow-2xl">
                            <CardHeader>
                              <CardTitle className="text-white flex items-center gap-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                  <Shield className="w-5 h-5 text-blue-400" />
                                </div>
                                Enterprise Priority Support
                              </CardTitle>
                              <CardDescription>
                                🕐 Ab {activationDateFormatted} aktiv (nächster Abrechnungszeitraum)
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="p-6 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-xl border border-blue-700/30">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <Shield className="w-8 h-8 text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-xl font-bold text-blue-400 mb-2">Priority Support geplant</h4>
                                    <p className="text-gray-300 text-sm mb-4">
                                      Sie haben Priority Support erfolgreich hinzugefügt. Die Aktivierung erfolgt ab dem nächsten Abrechnungszeitraum ({activationDateFormatted}):
                                    </p>
                                    <ul className="space-y-2 mb-4">
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span>Dedizierter Support-Manager 24/7</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span>Garantierte Antwortzeit unter 15 Minuten</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span>Kostenlose Server-Optimierung & Beratung</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        <span>Priorität bei Server-Wartungen</span>
                                      </li>
                                    </ul>
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-700/30">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                                          <Clock className="w-3 h-3 mr-1" />
                                          Ab {activationDateFormatted}
                                        </Badge>
                                        <p className="text-sm text-gray-400">
                                          CHF 15.00/Monat zusätzlich
                                        </p>
                                      </div>
                                      <Button 
                                        variant="outline"
                                        size="sm"
                                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                                        onClick={() => {
                                          setPrioritySupportPending(false);
                                          setPrioritySupportActivationDate(null);
                                          toast.success('Priority Support wurde storniert.');
                                        }}
                                      >
                                        Stornieren
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else if (isPriorityActive) {
                        // Priority Support included or purchased
                        return (
                          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl border-green-700/50 shadow-2xl">
                            <CardHeader>
                              <CardTitle className="text-white flex items-center gap-2">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                  <Shield className="w-5 h-5 text-green-400" />
                                </div>
                                Enterprise Priority Support
                              </CardTitle>
                              <CardDescription>
                                ✅ {enterprisePrice > 15 ? 'In Ihrem Plan inkludiert' : 'Aktiv (Zusatzleistung)'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="p-6 bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-xl border border-green-700/30">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-green-500/20 rounded-lg">
                                    <Shield className="w-8 h-8 text-green-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-xl font-bold text-green-400 mb-2">Priority Support Aktiv</h4>
                                    <p className="text-gray-300 text-sm mb-4">
                                      {enterprisePrice > 15 
                                        ? 'Da Ihr Enterprise-Plan über CHF 15.00 kostet, ist Priority Support bereits in Ihrem Plan enthalten:'
                                        : 'Sie haben Priority Support erfolgreich zu Ihrem Plan hinzugefügt:'}
                                    </p>
                                    <ul className="space-y-2 mb-4">
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Dedizierter Support-Manager 24/7</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Garantierte Antwortzeit unter 15 Minuten</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Kostenlose Server-Optimierung & Beratung</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Priorität bei Server-Wartungen</span>
                                      </li>
                                    </ul>
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-700/30">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          Aktiv
                                        </Badge>
                                        <p className="text-sm text-gray-400">
                                          {enterprisePrice > 15 
                                            ? 'Bereits in Ihrem Enterprise-Plan enthalten'
                                            : 'CHF 15.00/Monat zusätzlich'}
                                        </p>
                                      </div>
                                      {hasPrioritySupport && enterprisePrice <= 15 && (
                                        <Button 
                                          variant="outline"
                                          size="sm"
                                          className="border-red-600 text-red-400 hover:bg-red-900/20"
                                          onClick={() => {
                                            setHasPrioritySupport(false);
                                            toast.success('Priority Support wurde erfolgreich gekündigt. Die Änderung wird zum nächsten Abrechnungszyklus wirksam.');
                                          }}
                                        >
                                          Kündigen
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } else {
                        // Priority Support as paid add-on
                        return (
                          <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-xl border-amber-700/50 shadow-2xl">
                            <CardHeader>
                              <CardTitle className="text-white flex items-center gap-2">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                  <Shield className="w-5 h-5 text-amber-400" />
                                </div>
                                Enterprise Priority Support
                              </CardTitle>
                              <CardDescription>Exklusiver Premium-Support für Enterprise-Kunden</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="p-6 bg-gradient-to-br from-amber-950/50 to-orange-950/50 rounded-xl border border-amber-700/30">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-amber-500/20 rounded-lg">
                                    <Shield className="w-8 h-8 text-amber-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-xl font-bold text-amber-400 mb-2">Priority Support Upgrade</h4>
                                    <p className="text-gray-300 text-sm mb-4">
                                      Erweitern Sie Ihren Enterprise-Plan mit unserem exklusiven Priority Support und erhalten Sie:
                                    </p>
                                    <ul className="space-y-2 mb-4">
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Dedizierter Support-Manager 24/7</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Garantierte Antwortzeit unter 15 Minuten</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Kostenlose Server-Optimierung & Beratung</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Priorität bei Server-Wartungen</span>
                                      </li>
                                    </ul>
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-700/30">
                                      <div>
                                        <p className="text-3xl font-bold text-amber-400">
                                          {isPrivileged ? (
                                            <>
                                              <span className="line-through text-gray-500 text-xl mr-2">CHF 15.00</span>
                                              CHF 0.00
                                            </>
                                          ) : (
                                            'CHF 15.00'
                                          )}
                                        </p>
                                        <p className="text-sm text-gray-400">/Monat (zusätzlich) {isPrivileged && <span className={`font-semibold ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`}>(GRATIS)</span>}</p>
                                      </div>
                                      <Button 
                                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/30"
                                        onClick={() => {
                                          // Set activation date to next payment date (next month)
                                          const activationDate = user?.nextPaymentDate ? new Date(user.nextPaymentDate) : new Date();
                                          if (!user?.nextPaymentDate) {
                                            activationDate.setMonth(activationDate.getMonth() + 1);
                                          }
                                          setPrioritySupportPending(true);
                                          setPrioritySupportActivationDate(activationDate);
                                          
                                          const formattedDate = activationDate.toLocaleDateString('de-DE', { 
                                            day: '2-digit', 
                                            month: '2-digit', 
                                            year: 'numeric' 
                                          });
                                          
                                          if (isPrivileged) {
                                            toast.success(`👑 ${user?.isOwner ? 'Owner' : 'Admin'}: Priority Support wurde kostenlos hinzugefügt und wird ab dem ${formattedDate} (nächster Abrechnungszeitraum) aktiviert!`);
                                          } else {
                                            toast.success(`Priority Support wurde erfolgreich hinzugefügt und wird ab dem ${formattedDate} (nächster Abrechnungszeitraum) aktiviert!`);
                                          }
                                        }}
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Priority Support hinzufügen
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    })()}
                  </>
                )}

                <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      Rechnungen
                    </CardTitle>
                    <CardDescription>Laden Sie Ihre Rechnungen als Textdatei herunter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-900/90 to-black/90 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">Rechnung {invoice.id}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {invoice.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-white font-bold text-lg">CHF {invoice.amount.toFixed(2)}</p>
                              {invoice.status === 'paid' ? (
                                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30 mt-1">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Bezahlt ✓
                                </Badge>
                              ) : (
                                <Badge className="bg-gradient-to-r from-yellow-600 to-amber-600 shadow-lg shadow-yellow-500/30 mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Ausstehend
                                </Badge>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30"
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Change Confirmation Dialog */}
      {showPlanChangeDialog && selectedNewPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border-2 border-gray-700 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-semibold flex items-center gap-2">
                <Server className="w-6 h-6 text-green-500" />
                Plan ändern
              </h3>
              <button
                onClick={() => {
                  setShowPlanChangeDialog(false);
                  setSelectedNewPlan(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Aktueller Plan:</span>
                  <span className="text-white font-semibold">{planInfo[currentPlan].name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Aktueller Preis:</span>
                  <span className={`font-semibold ${isPrivileged ? 'text-green-500' : 'text-white'}`}>
                    {isPrivileged ? 'CHF 0.00/Monat (GRATIS)' : `CHF ${planInfo[currentPlan].price.toFixed(2)}/Monat`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-green-500" />
              </div>

              <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/50">
                {isPrivileged && (
                  <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-500 font-medium text-sm">
                      <Crown className="w-4 h-4" />
                      <span>{user?.isOwner ? 'OWNER' : 'ADMIN'} - 100% KOSTENLOS</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Neuer Plan:</span>
                  <span className="text-white font-semibold">{planInfo[selectedNewPlan].name}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Neuer Preis:</span>
                  <span className={`font-semibold ${isPrivileged ? 'text-green-500' : 'text-green-400'}`}>
                    {isPrivileged ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">CHF {planInfo[selectedNewPlan].price.toFixed(2)}</span>
                        CHF 0.00/Monat
                      </>
                    ) : (
                      `CHF ${planInfo[selectedNewPlan].price.toFixed(2)}/Monat`
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-green-600/30">
                  <p className="text-sm text-gray-300 mb-2 font-medium">Neue Ressourcen:</p>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {planInfo[selectedNewPlan].ram} GB RAM
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {planInfo[selectedNewPlan].cpu} CPU Cores
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {planInfo[selectedNewPlan].storage} GB Storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {planInfo[selectedNewPlan].backups} Backups
                    </li>
                  </ul>
                </div>
              </div>

              {planInfo[selectedNewPlan].price > planInfo[currentPlan].price ? (
                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
                  <p className="text-sm text-blue-300">
                    ℹ️ Bei einem Upgrade stehen die neuen Ressourcen sofort zur Verfügung. Der Preisunterschied wird anteilig für den aktuellen Monat berechnet.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                  <p className="text-sm text-yellow-300">
                    ⚠️ Bei einem Downgrade wird die Änderung ab der nächsten Abrechnungsperiode wirksam. Sie behalten bis dahin alle aktuellen Ressourcen.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowPlanChangeDialog(false);
                    setSelectedNewPlan(null);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={confirmPlanChange}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Plan ändern
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Configuration Confirmation Dialog */}
      {showEnterpriseConfigDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border-2 border-purple-600/50 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-semibold flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-500" />
                Enterprise-Konfiguration ändern
              </h3>
              <button
                onClick={() => {
                  setShowEnterpriseConfigDialog(false);
                  setTempEnterpriseRam(enterpriseRam);
                  setTempEnterpriseCpu(enterpriseCpu);
                  setTempEnterpriseStorage(enterpriseStorage);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 mb-3 font-medium">Aktuelle Konfiguration:</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">RAM:</span>
                    <span className="text-white font-semibold">{enterpriseRam} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">CPU:</span>
                    <span className="text-white font-semibold">{enterpriseCpu} Core{enterpriseCpu > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Storage:</span>
                    <span className="text-white font-semibold">{enterpriseStorage} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Backups:</span>
                    <span className="text-white font-semibold">{calculateEnterpriseBackups(enterpriseRam, enterpriseCpu, enterpriseStorage)} Backups</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-gray-400">Aktueller Preis:</span>
                    <span className="text-white font-semibold">CHF {(enterpriseRam * 1.5 + enterpriseCpu * 1.5 + enterpriseStorage * 0.1).toFixed(2)}/Monat</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-purple-500" />
              </div>

              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/50">
                <p className="text-gray-300 mb-3 font-medium">Neue Konfiguration:</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">RAM:</span>
                    <span className="text-purple-400 font-semibold">{tempEnterpriseRam} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">CPU:</span>
                    <span className="text-purple-400 font-semibold">{tempEnterpriseCpu} Core{tempEnterpriseCpu > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Storage:</span>
                    <span className="text-purple-400 font-semibold">{tempEnterpriseStorage} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Backups:</span>
                    <span className="text-purple-400 font-semibold">{calculateEnterpriseBackups(tempEnterpriseRam, tempEnterpriseCpu, tempEnterpriseStorage)} Backups</span>
                  </div>
                  <div className="pt-2 border-t border-purple-600/30 flex justify-between items-center">
                    <span className="text-gray-300">Neuer Preis:</span>
                    <span className="text-purple-400 font-semibold">CHF {(tempEnterpriseRam * 1.5 + tempEnterpriseCpu * 1.5 + tempEnterpriseStorage * 0.1).toFixed(2)}/Monat</span>
                  </div>
                </div>
              </div>

              {(() => {
                const currentPrice = enterpriseRam * 1.5 + enterpriseCpu * 1.5 + enterpriseStorage * 0.1;
                const newPrice = tempEnterpriseRam * 1.5 + tempEnterpriseCpu * 1.5 + tempEnterpriseStorage * 0.1;
                const priceDiff = newPrice - currentPrice;
                
                return (
                  <div className={`rounded-lg p-3 border ${priceDiff > 0 ? 'bg-blue-900/20 border-blue-600/30' : priceDiff < 0 ? 'bg-green-900/20 border-green-600/30' : 'bg-gray-900/20 border-gray-600/30'}`}>
                    <p className={`text-sm ${priceDiff > 0 ? 'text-blue-300' : priceDiff < 0 ? 'text-green-300' : 'text-gray-300'}`}>
                      {priceDiff > 0 ? (
                        <>ℹ️ Preiserhöhung um CHF {priceDiff.toFixed(2)}/Monat. Die Änderung wird sofort wirksam und der Unterschied anteilig berechnet.</>
                      ) : priceDiff < 0 ? (
                        <>✅ Preissenkung um CHF {Math.abs(priceDiff).toFixed(2)}/Monat. Die Änderung wird ab der nächsten Abrechnungsperiode wirksam.</>
                      ) : (
                        <>Keine Preisänderung.</>
                      )}
                    </p>
                  </div>
                );
              })()}

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowEnterpriseConfigDialog(false);
                    setTempEnterpriseRam(enterpriseRam);
                    setTempEnterpriseCpu(enterpriseCpu);
                    setTempEnterpriseStorage(enterpriseStorage);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={() => {
                    setEnterpriseRam(tempEnterpriseRam);
                    setEnterpriseCpu(tempEnterpriseCpu);
                    setEnterpriseStorage(tempEnterpriseStorage);
                    setShowEnterpriseConfigDialog(false);
                    
                    // Update user's plan in UserContext when Enterprise config changes
                    updateUserPlan('Enterprise');
                    
                    toast.success('Enterprise-Konfiguration wurde erfolgreich aktualisiert!');
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/30"
                >
                  Bestätigen
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}