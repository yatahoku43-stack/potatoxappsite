import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  ThumbsUp, 
  Users, 
  Play, 
  Menu, 
  LogOut,
  ShieldCheck,
  PlusCircle,
  Database,
  Trash2,
  X,
  ChevronLeft,
  ExternalLink,
  Info,
  Loader2,
  Lock,
  CheckCircle2,
  Wallet,
  UserPlus,
  Coins,
  Check,
  Ban,
  ShoppingBag,
  UserCheck,
  Heart,
  Key,
  Gift,
  FileJson,
  Download,
  Upload,
  Copy,
  Crown,
  Sparkles,
  Zap,
  AlertTriangle,
  Skull,
  Power,
  RefreshCcw,
  Megaphone,
  Unlock,
  CheckSquare,
  ArrowRight,
  ArrowUp,
  Shield,
  Briefcase,
  MessageSquare,
  Send,
  MessageCircle,
  Eye,
  Aperture,
  Star,
  Palette,
  Layout,
  BarChart3,
  PenTool,
  Layers,
  Rocket,
  WifiOff,
  Wifi,
  Calendar,
  Image as ImageIcon,
  Music,
  Video,
  PartyPopper,
  Bomb,
  Terminal,
  Moon,
  MapPin,
  Monitor,
  Clock
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  deleteDoc,
  addDoc,
  updateDoc,
  increment,
  where
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

// --- Firebase Configuration ---
// ご自身のAPIキー
const firebaseConfig = {
  apiKey: "AIzaSyB2901UqScS9nH7_C3a2zNOf-0xIlo9tvY",
  authDomain: "potatoxapp.firebaseapp.com",
  projectId: "potatoxapp",
  storageBucket: "potatoxapp.firebasestorage.app",
  messagingSenderId: "345400459865",
  appId: "1:345400459865:web:d0f22e2a728133fe23e748"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'potatox-app-id';

// --- OFFLINE MOCK DATA ---
const MOCK_GAMES = [
  { id: 'mock1', title: 'POTATO RUNNER 2077', category: 'アクション', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', url: '#', likes: 999, active: 120, author: 'OfflineDev' },
  { id: 'mock2', title: 'SKY FORTRESS', category: 'サバイバル', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=800&q=80', url: '#', likes: 450, active: 80, author: 'Guest' },
  { id: 'mock3', title: 'CYBER DUEL', category: '格闘と戦闘', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', url: '#', likes: 300, active: 45, author: 'System' }
];

const MOCK_SHOP = [
  { id: 's1', title: 'Speed Hack', price: 500, discount: 0, seller: 'System', description: '移動速度が2倍になる幻のコード。', secret: 'SPEED_UP_2X', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
  { id: 's2', title: 'Infinite Jump', price: 1500, discount: 20, seller: 'System', description: '空中で何度でもジャンプ可能に。', secret: 'JUMP_INF', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80' },
  { id: 's3', title: 'God Mode (Fake)', price: 9999, discount: 0, seller: 'System', description: '無敵になれる気がするだけのプラシーボ効果。', secret: 'GOD_MODE_ON', img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=400&q=80' }
];

const MOCK_CHAT = [
  { id: 'c1', text: 'ようこそオフラインモードへ！ここは君だけの箱庭だ。', username: 'System', role: 'admin', timestamp: new Date().toISOString() },
  { id: 'c2', text: 'ここでは通信制限を気にせず遊べるぞ！', username: 'Bot_01', role: 'mod', timestamp: new Date(Date.now() - 60000).toISOString() }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // Data States
  const [games, setGames] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [shopItems, setShopItems] = useState([]); 
  const [myInventory, setMyInventory] = useState([]); 
  const [calendarEvents, setCalendarEvents] = useState([]); // NEW: Calendar State
  
  // Chat States
  const [globalChat, setGlobalChat] = useState([]);
  const [staffChat, setStaffChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [staffChatInput, setStaffChatInput] = useState('');

  // Requests States
  const [potexRequests, setPotexRequests] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  
  // System State
  const [systemStatus, setSystemStatus] = useState('active'); 
  const [announcement, setAnnouncement] = useState(null); 
  const [isOfflineMode, setIsOfflineMode] = useState(false); // NEW: Offline Mode State
  const [globalLogboEnabled, setGlobalLogboEnabled] = useState(false); 
  
  // NEW SYSTEM STATES
  const [globalChatLocked, setGlobalChatLocked] = useState(false);
  const [chatImageEnabled, setChatImageEnabled] = useState(false);
  const [multiAnnouncements, setMultiAnnouncements] = useState({ red: null, blue: null, green: null });
  const [terminationReason, setTerminationReason] = useState('');
  const [mediaEvent, setMediaEvent] = useState(null);
  const [visualEvent, setVisualEvent] = useState(null);

  // UI States
  const [view, setView] = useState('home'); 
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [selectedShopItem, setSelectedShopItem] = useState(null); 
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', password: '' });
  const [profileEditForm, setProfileEditForm] = useState({ displayName: '', profileImg: '', bio: '' }); 
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Backup & Admin UI State
  const [backupData, setBackupData] = useState('');
  const [importJson, setImportJson] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSlider, setRestoreSlider] = useState(0); 
  const [announcementInput, setAnnouncementInput] = useState('');
  const [promoteName, setPromoteName] = useState(''); 
  const [overseerLoading, setOverseerLoading] = useState(false);
  const [selectedUserForPreview, setSelectedUserForPreview] = useState(null); // NEW
  
  // NEW UI STATES (MALL & BASE64)
  const [chatImgUpload, setChatImgUpload] = useState('');
  const [termReason, setTermReason] = useState('');
  const [activeVisual, setActiveVisual] = useState(null);
  const [announceColor, setAnnounceColor] = useState('blue');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState('audio');
  const [newCalEvent, setNewCalEvent] = useState({ title: '', date: '', location: '' });
  const [base64Result, setBase64Result] = useState('');
  const [mallBgmInput, setMallBgmInput] = useState('');
  const [base64MediaInput, setBase64MediaInput] = useState('');
  const [mallBgm, setMallBgm] = useState(null);
  
  // MALL ITEM EDITING
  const [editingMallItem, setEditingMallItem] = useState(null);
  const [showEditMallModal, setShowEditMallModal] = useState(false);

  // --- NEW STATES FOR FINAL UPDATE ---
  const [chatNotifications, setChatNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [botSchedules, setBotSchedules] = useState([]);
  const [nightBotConfig, setNightBotConfig] = useState({ enabled: false, name: 'NightBot', message: '夜の巡回ご苦労様です。', intervalHours: 4, lastRun: 0 });
  const [newBotSchedule, setNewBotSchedule] = useState({ name: 'SystemBot', message: '', time: '', target: 'global', role: 'admin' });
  const prevGlobalChatRef = React.useRef([]);
  const prevStaffChatRef = React.useRef([]);
  const isInitialMount = React.useRef(true);

  // --- DELETE MODAL STATE ---
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, data: null });
  const [deleteSlider, setDeleteSlider] = useState(0);

  // --- EDIT MODAL STATE ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  // --- 5-STEP TERMINATION STATE ---
  const [termStep1, setTermStep1] = useState(''); 
  const [termStep2, setTermStep2] = useState({ check1: false, check2: false, check3: false }); 
  const [termStep3, setTermStep3] = useState(0); 
  const [termStep4, setTermStep4] = useState(0); 
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCreatorUploadModal, setShowCreatorUploadModal] = useState(false); 
  const [purchaseAmount, setPurchaseAmount] = useState(100);

  // Forms
  const [newGame, setNewGame] = useState({
    title: '', category: 'アクション', img: '', url: '', likes: '0', active: '0'
  });
  const [newItem, setNewItem] = useState({
    title: '', price: 100, description: '', secret: '', img: ''
  });

  const isUserOnline = (lastActive) => {
    if (!lastActive) return false;
    return (Date.now() - new Date(lastActive).getTime()) < 60000;
  };

  // 1. Auth & Admin Setup
  useEffect(() => {
    if (isOfflineMode) return; // Skip auth in offline mode

    const initAuth = async () => {
      setLoading(true);
      try {
        // キャンバス提供のトークンではなく、自身のプロジェクトへの匿名ログインのみを実行する
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Authentication failed:", err);
        
        // 独自プロジェクトでAuthenticationが無効な場合のエラー処理
        let customMessage = err.message || '通信エラーが発生しました。';
        if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
            customMessage = '⚠️ Firebaseコンソールで「Authentication（認証）」を始め、Sign-in methodで「匿名 (Anonymous)」を有効にしてください！';
        }

        setConnectionError({
          code: err.code || 'unknown_error',
          message: customMessage
        });
        setLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const expiry = localStorage.getItem('potatox_session_expiry');
          const savedUsername = localStorage.getItem('potatox_username');
          
          if (expiry && savedUsername && Date.now() <= parseInt(expiry, 10)) {
             const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', savedUsername);
             onSnapshot(userDocRef, (snap) => {
                if (snap.exists()) {
                   setProfile(snap.data());
                   setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sessions', u.uid), { username: snap.data().username, role: snap.data().role });
                }
             }, (err) => console.log("User profile sync error:", err));
          } else if (expiry && Date.now() > parseInt(expiry, 10)) {
             await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sessions', u.uid));
             localStorage.removeItem('potatox_session_expiry');
             localStorage.removeItem('potatox_username');
             setLoading(false);
             return;
          } else {
             const sessionRef = doc(db, 'artifacts', appId, 'public', 'data', 'sessions', u.uid);
             const sessionSnap = await getDoc(sessionRef);
             if (sessionSnap.exists()) {
                const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', sessionSnap.data().username);
                onSnapshot(userDocRef, (snap) => {
                  if (snap.exists()) setProfile(snap.data());
                }, (err) => console.log("User profile sync error:", err));
             }
          }
        } catch (e) {
          console.log("Session check skipped");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isOfflineMode]);

  // 2. Real-time Data Fetching (or Mock Loading)
  useEffect(() => {
    // --- OFFLINE MODE HANDLER ---
    if (isOfflineMode) {
      setGames(MOCK_GAMES);
      setShopItems(MOCK_SHOP);
      setGlobalChat(MOCK_CHAT);
      setAllUsers([{ username: 'Guest', role: 'guest', isPremium: false }]);
      // Initialize guest profile
      setProfile({ username: 'Guest', role: 'guest', potex: 10000, isPremium: false });
      setUser({ uid: 'guest-uid', isAnonymous: true });
      setLoading(false);
      return; 
    }

    if (!user || !profile) return;

    try {
      // Global Chat Listener
      const unsubGlobalChat = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'global_chat'), (snap) => {
        const msgs = snap.docs.map(d => ({id: d.id, ...d.data()}));
        msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setGlobalChat(msgs);
      }, (err) => console.log("Global chat error:", err));

      // Staff Chat Listener
      let unsubStaffChat = () => {};
      if (profile.role === 'admin' || profile.role === 'mod' || profile.role === 'op' || profile.role === 'owner') {
         unsubStaffChat = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'staff_chat'), (snap) => {
          const msgs = snap.docs.map(d => ({id: d.id, ...d.data()}));
          msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setStaffChat(msgs);
        }, (err) => console.log("Staff chat error:", err));
      }

      // Online status updater
      let onlineInterval;
      if (!isOfflineMode) {
        updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), { lastActive: new Date().toISOString() }).catch(()=>{});
        onlineInterval = setInterval(() => {
          updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), { lastActive: new Date().toISOString() }).catch(()=>{});
        }, 30000);
      }

      const unsubSystem = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSystemStatus(data.serviceStatus || 'active');
          setAnnouncement(data.announcement || null);
          setMultiAnnouncements(data.multiAnnouncements || { red: null, blue: null, green: null });
          setGlobalLogboEnabled(data.globalLogboEnabled || false);
          setGlobalChatLocked(data.globalChatLocked || false);
          setChatImageEnabled(data.chatImageEnabled || false);
          setTerminationReason(data.terminationReason || '');
          if ('mallBgm' in data) setMallBgm(data.mallBgm);
          if ('mediaEvent' in data) setMediaEvent(data.mediaEvent);
          if ('visualEvent' in data) setVisualEvent(data.visualEvent);
        } else {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { serviceStatus: 'active', globalLogboEnabled: false });
        }
      }, (err) => console.log("System config error:", err));

      const unsubCalendar = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'calendar'), (s) => {
        const evs = s.docs.map(d => ({id: d.id, ...d.data()}));
        evs.sort((a, b) => new Date(a.date) - new Date(b.date));
        setCalendarEvents(evs);
      }, (err) => console.log("Calendar error:", err));

      const unsubGames = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'games'), (s) => setGames(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Games error:", err));
      const unsubUsers = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'users'), (s) => setAllUsers(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Users error:", err));
      const unsubShop = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'shop_items'), (s) => setShopItems(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Shop items error:", err));
      const unsubReqs = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'friend_requests'), (s) => setFriendRequests(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Friend reqs error:", err));
      const unsubFriends = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'friends'), (s) => setMyFriends(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Friends error:", err));
      const unsubInventory = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'inventory'), (s) => setMyInventory(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Inventory error:", err));

      let unsubPotex = () => {};
      if (profile.role === 'admin' || profile.role === 'owner') {
        unsubPotex = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'potex_requests'), (s) => setPotexRequests(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Potex reqs error:", err));
      }

      const unsubBotSchedules = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'bot_schedules'), (s) => setBotSchedules(s.docs.map(d => ({id: d.id, ...d.data()}))), (err) => console.log("Bot schedules error:", err));
      const unsubNightBot = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'night_bot'), (snap) => {
        if (snap.exists()) setNightBotConfig(snap.data());
      }, (err) => console.log("Night bot config error:", err));

      return () => { 
        unsubGlobalChat(); unsubStaffChat(); unsubSystem(); unsubGames(); unsubUsers(); unsubReqs(); unsubFriends(); unsubInventory(); unsubShop(); unsubCalendar();
        unsubBotSchedules(); unsubNightBot();
        if (profile.role === 'admin' || profile.role === 'owner') unsubPotex();
        if (onlineInterval) clearInterval(onlineInterval);
      };
    } catch (e) {
      console.error("Data fetching error:", e);
    }
  }, [user, profile, isOfflineMode]);

  // Visual Effect Hook
  useEffect(() => {
    if (visualEvent && visualEvent.timestamp > Date.now() - 10000 && !isOfflineMode) {
       setActiveVisual(visualEvent.type);
       const t = setTimeout(() => setActiveVisual(null), 5000);
       return () => clearTimeout(t);
    }
  }, [visualEvent, isOfflineMode]);

  // --- 動向監視フック ---
  useEffect(() => {
    if (!isOfflineMode && profile && user) {
      updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), {
         currentView: view
      }).catch(()=>{});
    }
  }, [view, isOfflineMode, profile, user]);

  // --- チャット入力監視フック ---
  useEffect(() => {
    if (!isOfflineMode && profile && user && view === 'chat') {
      const timeoutId = setTimeout(() => {
        updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), {
           typingInChat: chatInput
        }).catch(()=>{});
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (!isOfflineMode && profile && user && view !== 'chat') {
      updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), {
         typingInChat: ''
      }).catch(()=>{});
    }
  }, [chatInput, isOfflineMode, profile, user, view]);

  // --- FINAL UPDATE HOOKS (Popup & Bots) ---
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevGlobalChatRef.current = globalChat;
      prevStaffChatRef.current = staffChat;
      return;
    }
    const checkNewMessages = (currentChat, prevChat, isStaff) => {
      if (currentChat.length > 0 && currentChat.length > prevChat.length) {
         const newMsg = currentChat[0];
         if (newMsg.username !== profile?.username) {
            const notifId = Date.now() + Math.random();
            setChatNotifications(prev => [...prev, { ...newMsg, notifId, isStaff }]);
            setTimeout(() => {
               setChatNotifications(prev => prev.filter(n => n.notifId !== notifId));
            }, 3000);
         }
      }
    };
    checkNewMessages(globalChat, prevGlobalChatRef.current, false);
    checkNewMessages(staffChat, prevStaffChatRef.current, true);
    
    prevGlobalChatRef.current = globalChat;
    prevStaffChatRef.current = staffChat;
  }, [globalChat, staffChat, profile]);

  useEffect(() => {
    if (isOfflineMode || !profile || (profile.role !== 'owner' && profile.role !== 'admin')) return;
    
    const botInterval = setInterval(async () => {
      const now = Date.now();
      
      // Scheduler
      for (const schedule of botSchedules) {
         const scheduleTime = new Date(schedule.time).getTime();
         if (scheduleTime <= now && !schedule.executed) {
            try {
               await addDoc(collection(db, 'artifacts', appId, 'public', 'data', schedule.target === 'staff' ? 'staff_chat' : 'global_chat'), {
                 text: schedule.message,
                 username: schedule.name,
                 role: schedule.role,
                 timestamp: new Date().toISOString()
               });
               await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bot_schedules', schedule.id));
            } catch(e) {}
         }
      }
      
      // Night Bot
      if (nightBotConfig.enabled && nightBotConfig.intervalHours > 0) {
         const intervalMs = nightBotConfig.intervalHours * 60 * 60 * 1000;
         if (now - (nightBotConfig.lastRun || 0) >= intervalMs) {
            try {
               await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'global_chat'), {
                 text: nightBotConfig.message,
                 username: nightBotConfig.name,
                 role: 'op',
                 timestamp: new Date().toISOString()
               });
               await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'night_bot'), { ...nightBotConfig, lastRun: now }, { merge: true });
            } catch(e) {}
         }
      }
    }, 60000); // Check every minute
    return () => clearInterval(botInterval);
  }, [botSchedules, nightBotConfig, isOfflineMode, profile]);

  // Actions
  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) return setMsg("画像サイズは500KB以下にしてください。"); // Firestore制限回避
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isOfflineMode) {
      setMsg("オフラインモード中はゲストとしてログイン中です。");
      return;
    }
    try {
      const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', loginForm.username);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().password === loginForm.password) {
        const userData = userDoc.data();
        setProfile(userData);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sessions', auth.currentUser.uid), { username: userData.username, role: userData.role });
        localStorage.setItem('potatox_session_expiry', Date.now() + 86400000);
        localStorage.setItem('potatox_username', userData.username);
        
        if (userData.role === 'owner') {
           setMsg(`降臨なされた… ${userData.displayName || userData.username}様、世界は貴方のものです。👁️`);
           setView('owner_console');
        } else {
           setMsg(`${userData.displayName || userData.username}様、ログインいたしました。`);
           setView('home');
        }
      } else {
        setMsg('ユーザー名またはパスワードが正しくありません。');
      }
    } catch (e) { setMsg('エラーが発生しました。'); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isOfflineMode) return setMsg("オフラインモードでは新規登録できません。");
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', signupForm.username);
      if ((await getDoc(userRef)).exists()) return setMsg('そのユーザー名は既に使用されています。');
      const userData = { username: signupForm.username, password: signupForm.password, role: 'user', potex: 0, uid: auth.currentUser.uid, createdAt: new Date().toISOString() };
      await setDoc(userRef, userData);
      setProfile(userData);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sessions', auth.currentUser.uid), { username: userData.username, role: userData.role });
      localStorage.setItem('potatox_session_expiry', Date.now() + 86400000);
      localStorage.setItem('potatox_username', userData.username);
      setView('home');
      setMsg('登録が完了しました。');
    } catch (e) { setMsg('エラーが発生しました。'); }
  };

  const enableOfflineMode = () => {
    setConnectionError(null);
    setIsOfflineMode(true);
    setMsg("オフラインモードで起動しました。一部機能（セーブ・共有）は無効です。");
  };

  // --- DELETE LOGIC ---
  const openDeleteModal = (type, id, data = null) => {
    setDeleteModal({ isOpen: true, type, id, data });
    setDeleteSlider(0);
  };

  const executeDelete = async () => {
    if (deleteSlider < 100) return;
    const { type, id } = deleteModal;
    
    if (isOfflineMode) {
      if (type === 'chat') setGlobalChat(prev => prev.filter(m => m.id !== id));
      if (type === 'game') setGames(prev => prev.filter(g => g.id !== id));
      setMsg("ローカルデータを削除しました。");
      setDeleteModal({ isOpen: false, type: null, id: null, data: null });
      setDeleteSlider(0);
      return;
    }

    try {
       if (type === 'chat') {
           const collectionName = deleteModal.data?.isStaff ? 'staff_chat' : 'global_chat';
           await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
           setMsg('メッセージを完全消去しました。');
       } else if (type === 'game') {
           await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'games', id));
           setMsg('アセットを完全に削除しました。');
       } else if (type === 'item') {
           await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'shop_items', id));
           setMsg('商品を削除しました。');
       }
    } catch (e) {
       setMsg('削除に失敗しました。');
    }
    
    setDeleteModal({ isOpen: false, type: null, id: null, data: null });
    setDeleteSlider(0);
  };

  // --- UPDATE GAME LOGIC ---
  const handleUpdateGame = async (e) => {
    e.preventDefault();
    if (!editingGame) return;
    if (isOfflineMode) {
      setGames(prev => prev.map(g => g.id === editingGame.id ? { ...editingGame, updatedAt: new Date().toISOString() } : g));
      setShowEditModal(false);
      setEditingGame(null);
      setMsg("ローカルプロジェクトを更新しました。");
      return;
    }
    try {
      const gameRef = doc(db, 'artifacts', appId, 'public', 'data', 'games', editingGame.id);
      await updateDoc(gameRef, {
        title: editingGame.title,
        category: editingGame.category,
        img: editingGame.img,
        url: editingGame.url,
        updatedAt: new Date().toISOString()
      });
      setShowEditModal(false);
      setEditingGame(null);
      setMsg('プロジェクトをリニューアルしました！✨ カバー画像もバッチリや！');
    } catch (e) {
      setMsg('更新に失敗しました...');
    }
  };

  // --- VIEW GAME & INCREASE ACTIVE COUNT ---
  const handleViewGame = async (game) => {
    setSelectedGame(game);
    setView('details');
    if (!isOfflineMode) {
      try {
        const gameRef = doc(db, 'artifacts', appId, 'public', 'data', 'games', game.id);
        const gameDoc = await getDoc(gameRef);
        if (gameDoc.exists()) {
           const currentActive = parseInt(gameDoc.data().active) || 0;
           await updateDoc(gameRef, { active: currentActive + 1 });
        }
      } catch (e) {}
    } else {
       setGames(prev => prev.map(g => g.id === game.id ? { ...g, active: (parseInt(g.active) || 0) + 1 } : g));
       setSelectedGame(prev => ({...prev, active: (parseInt(prev.active) || 0) + 1}));
    }
  };

  // --- CHAT ACTIONS ---
  const handleSendGlobalChat = async (e) => {
    e.preventDefault();
    if (globalChatLocked && profile?.role !== 'owner') return setMsg('グローバルチャットは現在ロックされています。');
    if (!chatInput.trim() && !chatImgUpload) return;
    if (isOfflineMode) {
      const newMsg = {
        id: `local_${Date.now()}`,
        text: chatInput,
        img: chatImgUpload,
        username: 'Guest',
        role: 'guest',
        isPremium: false,
        timestamp: new Date().toISOString()
      };
      setGlobalChat(prev => [newMsg, ...prev]);
      setChatInput(''); setChatImgUpload('');
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'global_chat'), {
        text: chatInput,
        img: chatImgUpload,
        username: profile.username,
        role: profile.role,
        isPremium: profile.isPremium || false,
        isSupporter: profile.isSupporter || false, // For green badge
        timestamp: new Date().toISOString()
      });
      if (!isOfflineMode && profile) {
         await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), {
            lastChatTime: new Date().toISOString()
         }).catch(()=>{});
      }
      setChatInput(''); setChatImgUpload('');
    } catch (e) { setMsg('メッセージの送信に失敗しました。'); }
  };

  const handleSendStaffChat = async (e) => {
    e.preventDefault();
    if (!staffChatInput.trim()) return;
    if (isOfflineMode) return setMsg("オフラインモードではスタッフチャットは使用できません。");
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'staff_chat'), {
        text: staffChatInput,
        username: profile.username,
        role: profile.role,
        timestamp: new Date().toISOString()
      });
      setStaffChatInput('');
    } catch (e) { setMsg('メッセージの送信に失敗しました。'); }
  };

  // --- ADMIN ACTIONS ---
  const handleOwnerGodMode = async () => {
     if (profile?.role !== 'owner') return;
     try {
       await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), {
          potex: 999999999
       });
       setMsg("神の力を行使しました。無限の富を手に入れました。👁️");
     } catch(e) { setMsg("神の力の発動に失敗しました。"); }
  };

  const fireVisualEvent = async (type) => {
    if (isOfflineMode) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { 
      visualEvent: { type, timestamp: Date.now() } 
    }, { merge: true });
    setMsg("エフェクトを発射しました！💥");
  };

  const fireMediaEvent = async () => {
    if (isOfflineMode) return;
    if (!mediaUrlInput) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { 
      mediaEvent: { type: mediaTypeInput, url: mediaUrlInput, timestamp: Date.now() } 
    }, { merge: true });
    setMsg("強制メディア再生を送信しました！🎵");
  };

  const clearMediaEvent = async () => {
    if (isOfflineMode) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { 
      mediaEvent: null 
    }, { merge: true });
    setMsg("強制メディア再生を全画面で停止しました！⏹️");
  };

  const handlePromoteToMod = async (targetRole) => {
    if (isOfflineMode) return setMsg("オフラインでは権限操作は無効です。");
    if (!promoteName) return setMsg("ユーザー名を入力してや！");
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', promoteName);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return setMsg("そんなユーザーはおらへんで！");
      
      const currentRole = userSnap.data().role;
      if (currentRole === 'owner') return setMsg("創造主を操作することは不可能です。");
      if (currentRole === 'admin' && profile.role !== 'owner') return setMsg("管理者を降格させる気か！？それは無理や！");
      
      const newRole = currentRole === targetRole ? 'user' : targetRole;
      await updateDoc(userRef, { role: newRole });
      
      setMsg(`${promoteName} の役職を【${newRole.toUpperCase()}】に変更したで！🛡️`);
      setPromoteName('');
    } catch (e) {
      setMsg("任命に失敗したわ…");
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (isOfflineMode) {
      setGames(prev => [{ ...newGame, id: `local_g_${Date.now()}`, author: 'Guest', likes: 0, active: 0, createdAt: new Date().toISOString() }, ...prev]);
      setShowAddModal(false);
      setShowCreatorUploadModal(false);
      setNewGame({ title: '', category: 'アクション', img: '', url: '', likes: '0', active: '0' });
      setMsg('ローカル環境にゲームを公開しました。リロードすると消えます。');
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'games'), { 
        ...newGame, 
        author: profile.username, // Add author name
        createdAt: new Date().toISOString() 
      });
      setShowAddModal(false);
      setShowCreatorUploadModal(false);
      setNewGame({ title: '', category: 'アクション', img: '', url: '', likes: '0', active: '0' });
      setMsg('新しいゲームを公開しました。');
    } catch (e) { setMsg('公開に失敗しました。'); }
  };

  // --- MALL ITEM ACTIONS ---
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (isOfflineMode) return setMsg("オフラインではモールの管理はできません。");
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'shop_items'), { 
        ...newItem, 
        price: parseInt(newItem.price), 
        discount: 0,
        seller: profile.username,
        createdAt: new Date().toISOString() 
      });
      setShowAddItemModal(false);
      setNewItem({ title: '', price: 100, description: '', secret: '', img: '' });
      setMsg('モールに新商品を出品しました！💰');
    } catch (e) { setMsg('商品の追加に失敗しました。'); }
  };

  const handleUpdateMallItem = async (e) => {
    e.preventDefault();
    if (isOfflineMode || !editingMallItem) return;
    try {
       await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'shop_items', editingMallItem.id), {
          price: parseInt(editingMallItem.price),
          discount: parseInt(editingMallItem.discount) || 0
       });
       setShowEditMallModal(false);
       setEditingMallItem(null);
       setMsg('商品の設定を更新したで！');
    } catch (e) {
       setMsg('更新に失敗しました。');
    }
  };

  const handlePurchase = async () => {
    if (!selectedShopItem || !profile) return;
    
    const actualPrice = Math.floor(selectedShopItem.price * (1 - (selectedShopItem.discount || 0) / 100));

    if (profile.potex < actualPrice) {
      setMsg('資金が足りません！ポテックスを購入してください。');
      return;
    }
    if (isOfflineMode) {
      setProfile(prev => ({ ...prev, potex: prev.potex - actualPrice }));
      setMyInventory(prev => [...prev, {
        id: `local_inv_${Date.now()}`,
        itemId: selectedShopItem.id, title: selectedShopItem.title, description: selectedShopItem.description, secret: selectedShopItem.secret, img: selectedShopItem.img, purchasedAt: new Date().toISOString()
      }]);
      setSelectedShopItem(null);
      setMsg(`(ローカル)「${selectedShopItem.title}」を購入しました！`);
      return;
    }
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username);
      await updateDoc(userRef, { potex: increment(-actualPrice) });
      setProfile(prev => ({ ...prev, potex: prev.potex - actualPrice }));
      
      // 出品者への報酬とオーナーへの手数料
      if (selectedShopItem.seller && selectedShopItem.seller !== 'System') {
         const sellerReward = Math.floor(actualPrice * 0.95);
         const ownerFee = actualPrice - sellerReward;
         
         const sellerRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', selectedShopItem.seller);
         await updateDoc(sellerRef, { potex: increment(sellerReward) }).catch(()=>{});
         
         const owners = allUsers.filter(u => u.role === 'owner');
         if (owners.length > 0) {
             const ownerRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', owners[0].username);
             await updateDoc(ownerRef, { potex: increment(ownerFee) }).catch(()=>{});
         }
      }

      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'inventory'), {
        itemId: selectedShopItem.id, title: selectedShopItem.title, description: selectedShopItem.description, secret: selectedShopItem.secret, img: selectedShopItem.img, purchasedAt: new Date().toISOString()
      });
      setSelectedShopItem(null);
      setMsg(`「${selectedShopItem.title}」を購入しました！`);
    } catch (e) { setMsg('購入処理に失敗しました。'); }
  };

  const requestPotex = async () => {
    if (isOfflineMode) return setMsg("オフラインでは申請できません。");
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'potex_requests'), {
      username: profile.username, amount: purchaseAmount, status: 'pending', timestamp: new Date().toISOString()
    });
    setShowPurchaseModal(false);
    setMsg('申請を送信しました。承認をお待ちください。');
  };

  const handleApprovePotex = async (reqId, username, amount) => {
    if (isOfflineMode) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', username), {
         potex: increment(amount)
      });
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'potex_requests', reqId), {
         status: 'approved'
      });
      setMsg(`${username} に ${amount} Pを付与しました！`);
    } catch(e) { setMsg('承認に失敗しました。'); }
  };

  const handleRejectPotex = async (reqId) => {
    if (isOfflineMode) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'potex_requests', reqId), {
         status: 'rejected'
      });
      setMsg('申請を拒否しました。');
    } catch(e) { setMsg('拒否に失敗しました。'); }
  };

  const handleJoinPremium = async () => {
    if (!profile) return;
    if (isOfflineMode) return setMsg("オフラインモードではプレミアムに加入できません。");
    // ... (rest of premium logic)
    if (profile.isPremium) {
      setMsg('すでにお得なプレミアム会員です！おおきに！');
      return;
    }
    if (profile.potex < 1500) {
      setMsg('資金が足りません！1500P必要です。ポテックスを購入してください。');
      return;
    }
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username);
      await updateDoc(userRef, { 
        potex: increment(-1500),
        isPremium: true,
        premiumSince: new Date().toISOString()
      });
      setShowPremiumModal(false);
      setMsg('祝！ポテトックス プレミアムに加入しました！🔥 世界が変わるで！');
    } catch (e) {
      setMsg('加入処理に失敗しました。');
    }
  };

  const handleAddCalendarEvent = async (e) => {
    e.preventDefault();
    if (isOfflineMode) return setMsg("オフラインではカレンダーにピン留めできません。");
    try {
       await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'calendar'), {
          ...newCalEvent, username: profile.username, timestamp: new Date().toISOString()
       });
       setNewCalEvent({ title: '', date: '', location: '' });
       setMsg("カレンダーに予定をピン留めしました！📅");
    } catch(e) { setMsg("追加に失敗しました。"); }
  };

  // --- ANNOUNCEMENT ---
  const handlePublishMultiAnnouncement = async (color) => {
    if (isOfflineMode) return;
    if (!announcementInput) return setMsg("お知らせ内容を入力してください。");
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { 
      multiAnnouncements: { ...multiAnnouncements, [color]: { text: announcementInput, active: true, updatedAt: new Date().toISOString() } } 
    }, { merge: true });
    setMsg(`${color}色のお知らせを配信しました！📢`);
    setAnnouncementInput("");
  };

  const handleClearMultiAnnouncement = async (color) => {
    if (isOfflineMode) return;
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { 
      multiAnnouncements: { ...multiAnnouncements, [color]: { active: false } } 
    }, { merge: true });
  };

  // --- BOT ACTIONS ---
  const handleAddBotSchedule = async (e) => {
    e.preventDefault();
    if (isOfflineMode) return setMsg("オフラインでは設定できません。");
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bot_schedules'), {
         ...newBotSchedule,
         executed: false,
         createdAt: new Date().toISOString()
      });
      setNewBotSchedule({ name: 'SystemBot', message: '', time: '', target: 'global', role: 'admin' });
      setMsg("ボットの送信スケジュールを予約しました！🤖");
    } catch(e) { setMsg("予約に失敗しました。"); }
  };

  const handleSaveNightBot = async () => {
    if (isOfflineMode) return setMsg("オフラインでは設定できません。");
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'night_bot'), nightBotConfig, { merge: true });
      setMsg("夜間巡回ボットの設定を保存しました！🌙");
    } catch(e) { setMsg("保存に失敗しました。"); }
  };

  // --- PROFILE LOGIC ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isOfflineMode) return setMsg("オフラインではプロフィールの更新はできません。");
    try {
       const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username);
       await updateDoc(userRef, {
          displayName: profileEditForm.displayName,
          profileImg: profileEditForm.profileImg,
          bio: profileEditForm.bio || ''
       });
       setProfile(prev => ({ ...prev, displayName: profileEditForm.displayName, profileImg: profileEditForm.profileImg, bio: profileEditForm.bio || '' }));
       setMsg('プロフィールを完璧にアップデートしたで！！✨');
    } catch(e) {
       setMsg('プロフィールの更新に失敗しました。');
    }
  };

  const handleClaimLogbo = async () => {
    if (!globalLogboEnabled) return setMsg('現在、ログボ機能は停止中です。');
    if (!profile) return;
    
    const lastClaim = profile.lastLogboClaim || 0;
    const now = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;
    
    if (now - lastClaim < sixHours) {
       const remain = Math.ceil((sixHours - (now - lastClaim)) / (60 * 1000));
       return setMsg(`まだ受け取れません！あと ${Math.floor(remain / 60)}時間${remain % 60}分 待ってな！`);
    }

    try {
       const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username);
       const bonusAmount = 500;
       await updateDoc(userRef, { 
          potex: increment(bonusAmount),
          lastLogboClaim: now
       });
       setProfile(prev => ({ ...prev, potex: prev.potex + bonusAmount, lastLogboClaim: now }));
       setMsg(`ログインボーナス ${bonusAmount} P ゲットしたで！！🔥🔥`);
    } catch(e) {
       setMsg('ログボの受け取りに失敗しました。');
    }
  };

  // --- DATA EXPORT/IMPORT ---
  const handleExportData = () => {
    const dataToExport = { version: "1.0", exportedAt: new Date().toISOString(), games: games, shopItems: shopItems };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    setBackupData(jsonString);
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(jsonString).then(() => {
          setMsg("全データをコード化してコピーしました！🔥");
        }).catch(err => {
           setMsg("クリップボードへのコピーに失敗しました。手動でコピーしてください。");
        });
      } else {
        setMsg("このブラウザでは自動コピーが制限されています。手動でコピーしてください。");
      }
    } catch (e) {
      setMsg("コピーツールがブロックされています。");
    }
  };

  const handleImportData = async () => {
    if (isOfflineMode) {
      // Local import simulation
      try {
        const data = JSON.parse(importJson);
        if (data.games) setGames(prev => [...prev, ...data.games]);
        if (data.shopItems) setShopItems(prev => [...prev, ...data.shopItems]);
        setMsg("ローカル環境にデータをインポートしました！");
        setImportJson('');
        setRestoreSlider(0);
        setIsRestoring(false);
      } catch(e) { setMsg("JSONパースエラー"); }
      return;
    }
    // ... (Regular import logic)
    if (!importJson) {
      setMsg("⚠️ 復旧用のコードを貼り付けてや！空っぽやで！");
      return;
    }
    if (restoreSlider < 100) {
      setMsg("⚠️ スライドバーを右まで動かしてロックを解除してな！");
      return;
    }

    setIsRestoring(true); 
    
    setTimeout(async () => {
      try {
        let parsed;
        try {
          parsed = JSON.parse(importJson);
        } catch (e) {
          throw new Error("JSON形式がおかしいで！コードが途中で切れてへんか？");
        }

        const data = parsed;
        if (!data.games || !Array.isArray(data.games)) throw new Error("ゲームデータが見つからへん！");
        if (!data.shopItems || !Array.isArray(data.shopItems)) throw new Error("ショップデータが見つからへん！");

        let successCount = 0;
        let errorCount = 0;

        for (const g of data.games) {
          try {
            const docId = g.id || doc(collection(db, 'artifacts', appId, 'public', 'data', 'games')).id;
            if (g.active === undefined) g.active = 0;
            if (g.likes === undefined) g.likes = 0;
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'games', docId), g, { merge: true });
            successCount++;
          } catch (err) { errorCount++; }
        }

        for (const i of data.shopItems) {
          try {
            const docId = i.id || doc(collection(db, 'artifacts', appId, 'public', 'data', 'shop_items')).id;
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'shop_items', docId), i, { merge: true });
            successCount++;
          } catch (err) { errorCount++; }
        }

        setMsg(`復旧完了や！🔥 成功: ${successCount}件 / 失敗: ${errorCount}件`);
        setImportJson('');
        setRestoreSlider(0); 
      } catch (e) {
        console.error(e);
        setMsg(`復旧失敗...😭: ${e.message}`);
      } finally {
        setIsRestoring(false);
      }
    }, 100);
  };

  const handleTerminateService = async () => {
    if (isOfflineMode) return setMsg("オフラインでは実行できません。");
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { serviceStatus: 'terminated', terminationReason: termReason }, { merge: true });
      setMsg("サービスを終了しました...。ポテトックスは伝説になりました。");
    } catch (e) {
      setMsg("サ終に失敗しました。まだ生きろってことか...！");
    }
  };

  const handleRestoreService = async () => {
    if (isOfflineMode) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { serviceStatus: 'active' }, { merge: true });
      setMsg("サービスを再開しました！！不死鳥のごとく復活や！！🔥🔥");
      
      setTermStep1('');
      setTermStep2({ check1: false, check2: false, check3: false });
      setTermStep3(0);
      setTermStep4(0);
    } catch (e) {
      setMsg("再開に失敗しました...");
    }
  };

  const logout = async () => {
    if (isOfflineMode) {
      setIsOfflineMode(false);
      setUser(null);
      setProfile(null);
      setView('home');
      setLoading(true);
      // Try to reconnect? Or just reset state.
      setTimeout(() => window.location.reload(), 500);
      return;
    }
    if (auth.currentUser) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sessions', auth.currentUser.uid));
    localStorage.removeItem('potatox_session_expiry');
    localStorage.removeItem('potatox_username');
    setProfile(null); setUser(null); setView('home'); setMsg('ログアウトしました。');
  };

  // Helper to render badges
  const renderBadges = (u) => {
    const badges = [];
    if (u.role === 'owner') {
       badges.push(<Aperture key="owner" size={16} className="text-red-600 fill-red-100 animate-spin-slow" />); 
       badges.push(<CheckCircle2 key="admin" size={16} className="text-orange-500 fill-orange-50" />); 
       badges.push(<Moon key="op" size={16} className="text-pink-500 fill-pink-100" />); 
       badges.push(<Shield key="mod" size={16} className="text-cyan-500 fill-cyan-50" />); 
       badges.push(<Crown key="prem" size={16} className="text-yellow-500 fill-yellow-500" />); 
       badges.push(<Heart key="supp" size={16} className="text-green-500 fill-green-100" />); 
    } else {
      if (u.role === 'admin') badges.push(<CheckCircle2 key="admin" size={16} className="text-orange-500 fill-orange-50" />);
      if (u.role === 'op') badges.push(<Moon key="op" size={16} className="text-pink-500 fill-pink-100" />);
      if (u.role === 'mod') badges.push(<Shield key="mod" size={16} className="text-cyan-500 fill-cyan-50" />);
      if (u.isPremium) badges.push(<Crown key="prem" size={16} className="text-yellow-500 fill-yellow-500" />);
      if (u.isSupporter) badges.push(<Heart key="supp" size={16} className="text-green-500 fill-green-100" />);
    }
    return <div className="flex gap-1 items-center">{badges}</div>;
  };

  const filteredGames = games.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = allUsers.filter(u => (u.displayName || u.username).toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredShopItems = shopItems.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.description.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Filter for Creator Hub
  const myGames = games.filter(g => g.author === profile?.username);

  // 5-Step Logic Checks
  const isStep1Valid = termStep1 === '37564';
  const isStep2Valid = termStep2.check1 && termStep2.check2 && termStep2.check3;
  const isStep3Valid = termStep3 === 100;
  const isStep4Valid = termStep4 === 100;
  const isAllValid = isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid && termReason.trim() !== '';

  // --- ERROR SCREEN FOR BLOCKED CONNECTION ---
  if (connectionError && !isOfflineMode) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="relative z-10 max-w-2xl bg-gray-900 border border-red-900 p-12 rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-in zoom-in-95">
           <WifiOff size={80} className="mx-auto text-red-600 mb-6 animate-pulse" />
           <h1 className="text-4xl md:text-5xl font-black text-red-600 uppercase italic tracking-tighter mb-4">CONNECTION BLOCKED</h1>
           <p className="text-xl font-bold text-gray-300 mb-2">学校や組織のネットワークに弾かれとるで！😱</p>
           <p className="text-sm text-gray-500 font-mono mb-8">Error Code: {connectionError.code}</p>
           
           <div className="bg-black/50 p-6 rounded-2xl text-left space-y-2 mb-8 border border-gray-800">
             <p className="text-red-400 font-bold text-sm">💡 エラー詳細 / 対処法:</p>
             <p className="text-gray-300 text-sm font-bold">{connectionError.message}</p>
           </div>
           
           <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-gray-600"><RefreshCcw size={20}/> 再試行</button>
              <button onClick={enableOfflineMode} className="bg-red-600 hover:bg-red-500 text-white font-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2"><WifiOff size={20}/> オフラインで強制起動する</button>
           </div>
           <p className="mt-6 text-xs text-gray-600">※ゲストモードで起動します。データは保存されません。</p>
         </div>
      </div>
    );
  }

  // --- TERMINATED SCREEN ---
  if (systemStatus === 'terminated' && !isOfflineMode) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="z-10 text-center space-y-8 animate-in zoom-in duration-1000">
          <Skull size={120} className="mx-auto text-red-600 animate-pulse" />
          <h1 className="text-6xl md:text-8xl font-black text-red-600 tracking-tighter uppercase italic">SERVICE<br/>TERMINATED</h1>
          <p className="text-gray-400 font-mono text-xl">Potatox Project has been shut down permanently.</p>
          <div className="border-t border-gray-800 w-full max-w-md mx-auto pt-8">
            <p className="text-gray-600 text-sm mb-4">Thank you for playing.</p>
            {terminationReason && (
               <div className="bg-red-950/50 p-6 rounded-2xl border border-red-900/50">
                  <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-2">Message from Overlord</p>
                  <p className="text-white font-bold whitespace-pre-wrap">{terminationReason}</p>
               </div>
            )}
          </div>
          
          {(profile?.role === 'admin' || profile?.role === 'owner') && (
            <div className="mt-20 border border-red-900/30 p-8 rounded-2xl bg-red-950/20 backdrop-blur-sm">
              <p className="text-red-500 font-bold mb-4 flex items-center justify-center gap-2"><ShieldCheck/> Admin Override Active</p>
              <button onClick={handleRestoreService} className="bg-green-600 hover:bg-green-500 text-white font-black px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center gap-2 mx-auto animate-bounce"><RefreshCcw size={20} /> サービスを再開する (復活)</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-orange-500" size={48} /></div>;

  return (
    <div className={`min-h-screen text-gray-900 font-sans selection:bg-orange-100 pb-20 pt-16 ${view === 'creator_hub' || view === 'overseer_console' ? 'bg-gray-900' : 'bg-[#F2F4F5]'}`}>
      
      {/* --- VISUAL EFFECTS OVERLAYS --- */}
      {activeVisual === 'confetti' && (
         <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="text-6xl animate-bounce">🎉🎊✨🎊🎉✨</div>
         </div>
      )}
      {activeVisual === 'explosion' && (
         <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-white/20">
            <div className="text-9xl animate-ping text-orange-500 flex items-center justify-center w-full h-full drop-shadow-[0_0_100px_red]">💥🔥💥</div>
         </div>
      )}

      {/* --- MEDIA PLAYER OVERLAY --- */}
      {mediaEvent && mediaEvent.timestamp > Date.now() - 600000 && !isOfflineMode && (
         <div className="fixed bottom-4 right-4 z-[9998] bg-black p-4 rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.5)] border border-gray-700 animate-in slide-in-from-bottom text-white max-w-sm w-full">
            <div className="flex justify-between items-center mb-2">
               <span className="font-black text-xs text-orange-500 uppercase flex items-center gap-1"><Zap size={12}/> Owner Override Event</span>
               <button onClick={() => setMediaEvent(null)} className="text-gray-400 hover:text-white"><X size={16}/></button>
            </div>
            {mediaEvent.type === 'audio' ? (
               <audio src={mediaEvent.url} autoPlay controls className="w-full h-10 rounded" />
            ) : (
               <video src={mediaEvent.url} autoPlay controls className="w-full aspect-video rounded bg-gray-900" />
            )}
         </div>
      )}

      {/* --- MALL BGM OVERLAY --- */}
      {view === 'shop' && mallBgm && !isOfflineMode && (
         <audio src={mallBgm} autoPlay loop hidden />
      )}

      {/* --- CHAT POPUP TOASTS --- */}
      <div className="fixed top-20 right-4 z-[250] flex flex-col gap-2 pointer-events-none">
         {chatNotifications.map(notif => (
            <div key={notif.notifId} className={`w-72 p-3 rounded-2xl shadow-xl flex items-start gap-3 animate-in slide-in-from-right fade-in duration-300 pointer-events-auto border ${notif.isStaff ? 'bg-cyan-900/90 border-cyan-500 text-white' : 'bg-white/95 border-gray-200 text-gray-800'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${notif.isStaff ? 'bg-cyan-700' : 'bg-gray-200'}`}><User size={16} className={notif.isStaff ? 'text-white' : 'text-gray-500'}/></div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                     <span className={`font-black text-xs truncate ${notif.isStaff ? 'text-cyan-300' : 'text-gray-900'}`}>{notif.username}</span>
                     {notif.isStaff && <span className="text-[8px] bg-cyan-500 text-white px-1.5 py-0.5 rounded-full font-black">STAFF</span>}
                  </div>
                  <p className={`text-xs font-medium truncate ${notif.isStaff ? 'text-cyan-100' : 'text-gray-600'}`}>{notif.text}</p>
               </div>
            </div>
         ))}
      </div>

      {/* --- OFFLINE BANNER --- */}
      {isOfflineMode && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gray-800 text-gray-300 py-1 px-4 shadow-md text-xs font-bold text-center border-b border-gray-700">
          <span className="flex items-center justify-center gap-2"><WifiOff size={12} className="text-red-400"/> オフライン・ゲストモードで動作中。データは保存されません。</span>
        </div>
      )}

      {/* --- Fixed Toast Notification --- */}
      {msg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] w-full max-w-md px-4 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-gray-700">
            <span className="font-bold text-sm flex items-center gap-3"><Info size={20} className="text-orange-500" />{msg}</span>
            <button onClick={() => setMsg('')} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={14}/></button>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b h-16 flex items-center px-4 justify-between shadow-sm transition-colors ${view === 'creator_hub' || view === 'overseer_console' ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setView('home'); setSearchTerm('');}}>
            <div className={`p-2 rounded-lg text-white font-black text-2xl italic tracking-tighter shadow-md ${profile?.role === 'owner' ? 'bg-red-600' : 'bg-orange-500'}`}>P</div>
            <span className={`font-black text-2xl hidden md:block tracking-tighter uppercase italic ${profile?.role === 'owner' ? 'text-red-600' : (view === 'creator_hub' || view === 'overseer_console' ? 'text-white' : '')}`}>POTATOX</span>
          </div>
          <div className={`hidden lg:flex items-center gap-6 text-sm font-bold ${view === 'creator_hub' || view === 'overseer_console' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span onClick={() => setView('home')} className={`cursor-pointer transition-colors hover:text-orange-500 ${view === 'home' ? 'text-black border-b-2 border-orange-500 pb-1' : ''}`}>発見</span>
            <span onClick={() => setView('calendar')} className={`cursor-pointer transition-colors hover:text-orange-500 flex items-center gap-1 ${view === 'calendar' ? 'text-black border-b-2 border-orange-500 pb-1' : ''}`}><Calendar size={14}/> カレンダー</span>
            <span onClick={() => setView('chat')} className={`cursor-pointer transition-colors hover:text-orange-500 ${view === 'chat' ? 'text-black border-b-2 border-orange-500 pb-1' : ''}`}>チャット</span>
            <span onClick={() => setView('shop')} className={`cursor-pointer transition-colors hover:text-orange-500 ${view === 'shop' ? 'text-black border-b-2 border-orange-500 pb-1' : ''}`}>モール</span>
            <span onClick={() => setView('friends')} className={`cursor-pointer transition-colors hover:text-orange-500 ${view === 'friends' ? 'text-black border-b-2 border-orange-500 pb-1' : ''}`}>フレンド</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md px-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={view === 'friends' ? "ユーザーを探す" : (view === 'shop' ? "商品を検索" : "ゲームを探す")} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl py-2 pl-4 pr-10 text-xs font-bold focus:outline-none transition-all shadow-inner ${view === 'creator_hub' || view === 'overseer_console' ? 'bg-gray-800 border-gray-700 text-white focus:border-cyan-500' : 'bg-gray-100 border-transparent focus:bg-white focus:border-orange-300'}`}
            />
            <Search className={`absolute right-4 top-2.5 ${view === 'creator_hub' || view === 'overseer_console' ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {profile ? (
            <>
              {/* Wallet Button */}
              <div 
                onClick={() => setShowPurchaseModal(true)}
                className={`flex items-center gap-2 text-white px-4 py-2 rounded-full cursor-pointer transition-all shadow-lg active:scale-95 group ${profile.role === 'owner' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                <Coins size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="text-xs font-black tracking-tighter">{profile.potex?.toLocaleString() || 0} P</span>
                <PlusCircle size={14} className="opacity-70" />
              </div>

              {/* Notifications */}
              <div className="relative group">
                <div onClick={() => setShowNotifMenu(!showNotifMenu)} className={`cursor-pointer p-2 rounded-full transition-colors ${view === 'creator_hub' || view === 'overseer_console' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Bell size={20} className={view === 'creator_hub' || view === 'overseer_console' ? 'text-gray-400' : 'text-gray-500'} />
                  {friendRequests.length > 0 && <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>}
                </div>
                
                {/* Notification Dropdown */}
                {showNotifMenu && (
                   <div className="absolute right-0 mt-3 w-80 bg-white border shadow-2xl rounded-2xl py-3 animate-in fade-in slide-in-from-top-3 duration-200 z-50 text-gray-900 max-h-96 overflow-y-auto">
                      <div className="px-5 py-2 border-b"><h4 className="font-black text-sm">システム通知</h4></div>
                      {friendRequests.length > 0 ? (
                         friendRequests.map(req => (
                            <div key={req.id} className="px-5 py-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                               <p className="text-xs font-bold"><span className="text-blue-600">{req.fromUsername}</span> からフレンドリクエスト</p>
                            </div>
                         ))
                      ) : (
                         <div className="px-5 py-8 text-center text-gray-400 text-xs font-bold">新しい通知はありません</div>
                      )}
                      {(profile.role === 'admin' || profile.role === 'owner') && potexRequests.filter(r => r.status === 'pending').length > 0 && (
                         <div onClick={() => {setView('admin'); setShowNotifMenu(false);}} className="px-5 py-3 border-t bg-orange-50 hover:bg-orange-100 cursor-pointer flex justify-between items-center">
                            <p className="text-xs font-black text-orange-600">未承認のPotex申請があります ({potexRequests.filter(r => r.status === 'pending').length}件)</p>
                         </div>
                      )}
                   </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <div className={`w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 transition-all ${profile.role === 'owner' ? 'border-red-600 ring-2 ring-red-300' : (profile.isPremium ? 'border-yellow-400 ring-2 ring-yellow-100' : (profile.role === 'mod' ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-transparent group-hover:border-orange-400'))} bg-gray-200`}>
                  {profile.profileImg ? <img src={profile.profileImg} className="w-full h-full object-cover" /> : <User size={40} className={`mt-1 ${profile.role === 'owner' ? 'text-red-900' : 'text-gray-400'}`} />}
                </div>
                <div className="absolute right-0 mt-3 w-64 bg-white border shadow-2xl rounded-2xl py-3 hidden group-hover:block animate-in fade-in slide-in-from-top-3 duration-200 z-50 text-gray-900 max-h-[80vh] overflow-y-auto">
                  <div className={`px-5 py-4 border-b mb-2 ${profile.role === 'owner' ? 'bg-red-50' : (profile.isPremium ? 'bg-yellow-50/50' : (profile.role === 'mod' || profile.role === 'op' ? 'bg-cyan-50/50' : ''))}`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className={`font-black ${profile.role === 'owner' ? 'text-red-700' : (profile.isPremium ? 'text-yellow-700' : (profile.role === 'mod' || profile.role === 'op' ? 'text-cyan-700' : 'text-gray-800'))}`}>{profile.displayName || profile.username}</p>
                      {renderBadges(profile)}
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{profile.role === 'owner' ? 'OVERLORD (OWNER)' : (profile.isPremium ? 'PREMIUM MEMBER' : (profile.role === 'admin' ? '管理者' : (profile.role === 'op' ? 'OPERATOR' : (profile.role === 'mod' ? 'MODERATOR' : (isOfflineMode ? 'GUEST USER' : 'ポテト市民')))))}</p>
                  </div>
                  {/* MOBILE/ALL-DEVICE SHORTCUTS */}
                  <div className="border-b mb-1 pb-1">
                     <button onClick={() => setView('calendar')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3"><Calendar size={18} className="text-gray-400" /> 共有カレンダー</button>
                     <button onClick={() => setView('chat')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3"><MessageCircle size={18} className="text-gray-400" /> グローバルチャット</button>
                     <button onClick={() => setView('friends')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3"><Users size={18} className="text-gray-400" /> フレンド検索</button>
                     <button onClick={() => setView('shop')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3"><ShoppingBag size={18} className="text-gray-400" /> モール</button>
                  </div>

                  <button onClick={() => setView('creator_hub')} className="w-full text-left px-5 py-3 text-sm font-black hover:bg-gray-900 hover:text-white flex items-center gap-3 transition-colors bg-gray-100 mb-1"><Palette size={18} /> クリエイターハブ</button>

                  <button onClick={() => { setView('my_profile'); setProfileEditForm({ displayName: profile.displayName || profile.username, profileImg: profile.profileImg || '', bio: profile.bio || '' }); }} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3"><User size={18} className="text-gray-400" /> プロフィール</button>
                  <button onClick={() => setView('inventory')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3"><ShoppingBag size={18} className="text-gray-400" /> 持ち物 (コード)</button>
                  {!profile.isPremium && !isOfflineMode && (
                    <button onClick={() => setShowPremiumModal(true)} className="w-full text-left px-5 py-3 text-sm font-black hover:bg-yellow-50 text-yellow-600 flex items-center gap-3"><Crown size={18} /> Premiumに加入</button>
                  )}
                  {/* STAFF ACCESS */}
                  {(profile.role === 'admin' || profile.role === 'mod' || profile.role === 'op' || profile.role === 'owner') && (
                    <button onClick={() => setView('staff_room')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-cyan-50 text-cyan-600 flex items-center gap-3 border-t mt-1"><Megaphone size={18} /> スタッフルーム</button>
                  )}
                  {/* ADMIN CONSOLE */}
                  {profile.role === 'admin' && (
                    <button onClick={() => setView('admin')} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-red-50 text-red-600 flex items-center gap-3 mt-1"><ShieldCheck size={18} /> 管理者コンソール</button>
                  )}
                  {/* OWNER CONSOLE */}
                  {profile.role === 'owner' && (
                    <>
                       <button onClick={() => setView('owner_console')} className="w-full text-left px-5 py-3 text-sm font-black hover:bg-red-100 text-red-700 flex items-center gap-3 mt-1 animate-pulse"><Aperture size={18} className="animate-spin-slow" /> OWNER CONSOLE</button>
                       <button onClick={() => { setOverseerLoading(true); setView('overseer_console'); setTimeout(() => setOverseerLoading(false), 1500); }} className="w-full text-left px-5 py-3 text-sm font-black hover:bg-green-100/10 text-green-500 flex items-center gap-3 mt-1 bg-black/5"><Eye size={18} className="animate-pulse" /> OVERSEER CONSOLE</button>
                    </>
                  )}
                  <button onClick={logout} className="w-full text-left px-5 py-3 text-sm font-bold hover:bg-gray-50 text-gray-400 flex items-center gap-3 border-t mt-1"><LogOut size={18} /> ログアウト</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setView('login')} className="px-6 py-2 text-sm font-bold border rounded-xl hover:bg-gray-50">ログイン</button>
              <button onClick={() => setView('signup')} className="px-6 py-2 text-sm font-bold bg-white border rounded-xl shadow-sm">新規登録</button>
            </div>
          )}
        </div>
      </nav>

      {/* --- GLOBAL ANNOUNCEMENT BANNER (MULTI-COLOR) --- */}
      <div className="fixed top-16 left-0 right-0 z-40 flex flex-col pointer-events-none">
        {multiAnnouncements?.red?.active && (
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 shadow-lg flex justify-center items-center gap-2 text-sm font-black pointer-events-auto"><AlertTriangle size={16} className="animate-pulse"/> {multiAnnouncements.red.text}</div>
        )}
        {multiAnnouncements?.blue?.active && (
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 shadow-lg flex justify-center items-center gap-2 text-sm font-black pointer-events-auto"><Megaphone size={16}/> {multiAnnouncements.blue.text}</div>
        )}
        {multiAnnouncements?.green?.active && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 shadow-lg flex justify-center items-center gap-2 text-sm font-black pointer-events-auto"><PartyPopper size={16} className="animate-bounce"/> {multiAnnouncements.green.text}</div>
        )}
        {announcement?.active && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 shadow-lg flex justify-center items-center gap-2 text-sm font-black pointer-events-auto"><Megaphone size={16}/> {announcement.text}</div>
        )}
      </div>

      {/* --- Main Content --- */}
      <main className={`max-w-7xl mx-auto px-4 py-8 mt-12`}>
        
        {/* View: Creator Hub (DARK MODE) */}
        {view === 'creator_hub' && (
          <div className="space-y-12 animate-in fade-in duration-500 min-h-screen text-white">
            <header className="flex items-center justify-between border-b border-gray-700 pb-8">
               <div>
                  <h1 className="text-6xl font-black tracking-tighter uppercase italic flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                    <Palette size={64} className="text-cyan-500" /> Creator Hub
                  </h1>
                  <p className="text-gray-400 font-bold text-lg">世界に君の作品を届けよう。ここは君のスタジオだ。</p>
               </div>
               <button onClick={() => setShowCreatorUploadModal(true)} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all flex items-center gap-3 text-2xl uppercase italic tracking-tighter group">
                  <Rocket size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/> Publish New
               </button>
            </header>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-gray-800 p-8 rounded-[2rem] border border-gray-700 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Layout size={100} /></div>
                  <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm mb-2">Total Projects</h3>
                  <p className="text-6xl font-black tracking-tighter">{myGames.length}</p>
               </div>
               <div className="bg-gray-800 p-8 rounded-[2rem] border border-gray-700 shadow-xl relative overflow-hidden group hover:border-pink-500/50 transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Heart size={100} /></div>
                  <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm mb-2">Total Likes</h3>
                  <p className="text-6xl font-black tracking-tighter">{myGames.reduce((acc, g) => acc + (parseInt(g.likes) || 0), 0)}</p>
               </div>
               <div className="bg-gray-800 p-8 rounded-[2rem] border border-gray-700 shadow-xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={100} /></div>
                  <h3 className="text-gray-400 font-black uppercase tracking-widest text-sm mb-2">Total Plays</h3>
                  <p className="text-6xl font-black tracking-tighter">{myGames.reduce((acc, g) => acc + (parseInt(g.active) || 0), 0)}</p>
               </div>
            </div>

            {/* My Projects */}
            <section>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3"><Layers className="text-cyan-500"/> My Projects</h2>
              {myGames.length === 0 ? (
                 <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-[3rem] p-20 text-center">
                    <PenTool size={64} className="mx-auto text-gray-600 mb-6" />
                    <h3 className="text-2xl font-black text-gray-500 uppercase italic tracking-tighter">No Projects Yet</h3>
                    <p className="text-gray-600 font-bold mt-2">さあ、最初の傑作を作り出そう。</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {myGames.map(game => (
                      <div key={game.id} className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-cyan-500 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all group">
                         <div className="aspect-video relative overflow-hidden">
                           <img src={game.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                           <div className="absolute bottom-4 left-4 right-4">
                             <h3 className="text-2xl font-black uppercase italic tracking-tighter truncate">{game.title}</h3>
                           </div>
                         </div>
                         <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                              <span className="bg-cyan-900/50 text-cyan-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-cyan-500/30">{game.category}</span>
                              <div className="flex gap-4 text-sm font-bold text-gray-400">
                                 <span className="flex items-center gap-1"><Heart size={14} className="text-pink-500"/> {game.likes}</span>
                                 <span className="flex items-center gap-1"><Eye size={14} className="text-green-500"/> {game.active}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => openDeleteModal('game', game.id)} className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-500 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><Trash2 size={16}/> Delete</button>
                               <button onClick={() => { setEditingGame(game); setShowEditModal(true); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><Settings size={16}/> Edit</button>
                            </div>
                         </div>
                      </div>
                   ))}
                 </div>
              )}
            </section>
          </div>
        )}

        {/* View: Home */}
        {view === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <header className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden ring-4 ring-orange-50">
                <User size={60} className="text-gray-200 mt-2" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic">Home</h1>
                <p className="text-gray-400 font-bold italic mt-1">{isOfflineMode ? 'Potatox - Guest Mode' : 'ポテトックスの世界へようこそ。'}</p>
              </div>
            </header>
            {!profile?.isPremium && !isOfflineMode && (
              <div onClick={() => setShowPremiumModal(true)} className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-[2rem] p-8 text-white shadow-xl cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Crown size={200} fill="currentColor" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter mb-2">POTATOX PREMIUM 🔥</h3>
                    <p className="font-bold text-yellow-100">お得でビッグでバーゲンな要素が盛りだくさん！今すぐ加入や！</p>
                  </div>
                  <button className="bg-white text-yellow-600 px-6 py-3 rounded-xl font-black shadow-lg">詳細を見る</button>
                </div>
              </div>
            )}
            {filteredGames.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                <Database size={64} className="mx-auto text-gray-100 mb-6" />
                <h3 className="text-2xl font-black text-gray-200 uppercase tracking-tighter italic">No Assets Found</h3>
              </div>
            ) : (
              ['アクション', 'サバイバル', '格闘と戦闘'].map(category => {
                const categoryGames = filteredGames.filter(g => g.category === category);
                if (categoryGames.length === 0) return null;
                return (
                  <section key={category}>
                    <div className="flex justify-between items-end mb-8">
                      <h2 className="text-3xl font-black border-l-8 border-orange-500 pl-4 uppercase italic tracking-tighter">{category}</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                      {categoryGames.map(game => (
                        <div key={game.id} onClick={() => handleViewGame(game)} className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group border border-gray-50">
                          <div className="aspect-square bg-gray-50 relative overflow-hidden">
                            <img src={game.img || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            {/* Author tag if available */}
                            {game.author && <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold">by {game.author}</div>}
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm font-black truncate text-gray-800 uppercase tracking-tighter">{game.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              <div className="flex items-center gap-1.5"><ThumbsUp size={12} className="text-green-500" />{game.likes}</div>
                              <div className="flex items-center gap-1.5"><Users size={12} className="text-blue-500" />{game.active}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        )}

        {/* View: CALENDAR */}
        {view === 'calendar' && (
           <div className="space-y-12 animate-in slide-in-from-right duration-500">
             <header>
               <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-4">
                 <Calendar className="text-orange-500" size={40} /> Global Calendar
               </h1>
               <p className="text-gray-400 font-bold mt-2">みんなの予定や居場所を共有しよう。</p>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 h-fit">
                   <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2"><MapPin size={20}/> ピン留めする</h3>
                   <form onSubmit={handleAddCalendarEvent} className="space-y-4">
                      <div><label className="text-xs font-bold text-gray-500">タイトル/予定</label><input type="text" value={newCalEvent.title} onChange={e=>setNewCalEvent({...newCalEvent, title: e.target.value})} className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border outline-none focus:border-orange-500" required /></div>
                      <div><label className="text-xs font-bold text-gray-500">日時</label><input type="datetime-local" value={newCalEvent.date} onChange={e=>setNewCalEvent({...newCalEvent, date: e.target.value})} className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border outline-none focus:border-orange-500" required /></div>
                      <div><label className="text-xs font-bold text-gray-500">場所/ゲーム名など</label><input type="text" value={newCalEvent.location} onChange={e=>setNewCalEvent({...newCalEvent, location: e.target.value})} className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold border outline-none focus:border-orange-500" /></div>
                      <button type="submit" className="w-full bg-orange-500 text-white font-black py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all text-sm">予定を追加</button>
                   </form>
                </div>
                <div className="md:col-span-2 space-y-4">
                   {calendarEvents.length === 0 ? (
                      <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-[2.5rem] border border-gray-100">まだ予定がありません。</div>
                   ) : (
                      calendarEvents.map(ev => (
                         <div key={ev.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                               <span className="text-xs font-black uppercase">{new Date(ev.date).toLocaleDateString('en-US', {month: 'short'})}</span>
                               <span className="text-2xl font-black leading-none">{new Date(ev.date).getDate()}</span>
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-gray-800 tracking-tighter italic">{ev.title}</h4>
                               <p className="text-sm text-gray-500 font-bold mb-2 flex items-center gap-2"><User size={14}/> {ev.username} <span className="text-gray-300">|</span> {new Date(ev.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                               {ev.location && <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border">{ev.location}</span>}
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
           </div>
        )}

        {view === 'my_profile' && profile && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500 max-w-2xl mx-auto">
             <header className="text-center mb-8">
               <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center justify-center gap-4">
                 <UserCheck className="text-blue-500" size={40} /> My Profile
               </h1>
             </header>

             <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-32 relative"></div>
                <div className="px-8 pb-8 relative">
                   <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl mx-auto -mt-16 overflow-hidden flex items-center justify-center relative z-10 bg-gray-50">
                      {profile.profileImg ? (
                         <img src={profile.profileImg} className="w-full h-full object-cover" />
                      ) : (
                         <User size={64} className="text-gray-300" />
                      )}
                   </div>
                   <div className="text-center mt-4 mb-8">
                      <h2 className="text-3xl font-black italic tracking-tighter text-gray-800 flex items-center justify-center gap-2">
                        {profile.displayName || profile.username}
                        {renderBadges(profile)}
                      </h2>
                      <p className="text-gray-400 font-bold">@{profile.username}</p>
                      {profile.bio && <p className="mt-4 text-gray-700 font-bold bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-block text-left whitespace-pre-wrap max-w-full break-words">{profile.bio}</p>}
                   </div>
                   
                   {/* ログボボタン */}
                   <div className="bg-orange-50 rounded-2xl p-6 mb-8 text-center border-2 border-orange-100 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-orange-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <div className="relative z-10">
                         <h3 className="font-black text-orange-600 mb-2 flex items-center justify-center gap-2"><Sparkles/> 6時間ごとのボーナス <Sparkles/></h3>
                         <button 
                            onClick={handleClaimLogbo}
                            className={`px-8 py-4 rounded-xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto ${globalLogboEnabled ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                         >
                            <Gift size={24} /> {globalLogboEnabled ? 'ログボを受け取る (500 P)' : '現在休止中'}
                         </button>
                      </div>
                   </div>

                   <form onSubmit={handleUpdateProfile} className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                      <h3 className="font-black text-gray-700 uppercase tracking-widest text-sm mb-4 border-b pb-2">Edit Profile</h3>
                      <div>
                         <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">表示名 (Display Name)</label>
                         <input type="text" value={profileEditForm.displayName} onChange={(e) => setProfileEditForm({...profileEditForm, displayName: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-xl p-4 font-bold outline-none transition-colors shadow-sm" placeholder="表示名を入力..." />
                      </div>
                      <div>
                         <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block flex items-center gap-2">プロフィール画像 <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px]">NEW</span></label>
                         <div className="flex gap-4 items-center">
                            <input type="url" value={profileEditForm.profileImg} onChange={(e) => setProfileEditForm({...profileEditForm, profileImg: e.target.value})} className="flex-1 bg-white border-2 border-transparent focus:border-blue-500 rounded-xl p-4 font-bold outline-none transition-colors shadow-sm" placeholder="URLを入力するか右のボタンでファイル選択..." />
                            <label className="bg-blue-50 text-blue-600 font-bold px-4 py-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors shadow-sm border border-blue-200">
                               ファイルから <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (res) => setProfileEditForm({...profileEditForm, profileImg: res}))} />
                            </label>
                         </div>
                      </div>
                      <div>
                         <label className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 block">一言 (Bio)</label>
                         <textarea value={profileEditForm.bio} onChange={(e) => setProfileEditForm({...profileEditForm, bio: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-xl p-4 font-bold outline-none transition-colors shadow-sm resize-none h-24" placeholder="一言メッセージを入力..." />
                      </div>
                      <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl shadow-lg transition-all uppercase italic text-lg mt-4">Save Changes</button>
                   </form>
                </div>
             </div>
          </div>
        )}

        {view === 'details' && selectedGame && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold transition-colors mb-4">
              <ChevronLeft size={20} /> 戻る
            </button>
            <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="aspect-video relative bg-gray-900">
                <img src={selectedGame.img || 'https://via.placeholder.com/800x400'} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 sm:p-12">
                  <div className="text-white w-full">
                    <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-lg">{selectedGame.category}</span>
                    <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-2">{selectedGame.title}</h1>
                    <p className="text-gray-300 font-bold flex items-center gap-2"><User size={16} /> Created by {selectedGame.author || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 sm:p-12 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="flex gap-8 text-gray-500">
                   <div className="flex flex-col items-center gap-1"><Heart size={28} className="text-pink-500"/><span className="font-black text-xl">{selectedGame.likes}</span><span className="text-[10px] font-bold uppercase">Likes</span></div>
                   <div className="flex flex-col items-center gap-1"><Users size={28} className="text-blue-500"/><span className="font-black text-xl">{selectedGame.active}</span><span className="text-[10px] font-bold uppercase">Active</span></div>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                  <button onClick={() => {
                     if (!isOfflineMode && profile) {
                        updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', profile.username), {
                           lastGame: selectedGame.title
                        }).catch(()=>{});
                     }
                     window.open(selectedGame.url, '_blank');
                  }} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition-all text-2xl italic tracking-tighter flex items-center justify-center gap-3">
                    <Play size={28} className="fill-current" /> PLAY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === 'chat' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500 h-[calc(100vh-140px)] flex flex-col">
            <header className="flex-shrink-0 mb-2">
              <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-4">
                <MessageCircle className="text-orange-500" size={40} /> Global Chat
              </h1>
              <div className="flex items-center gap-4 mt-2">
                 <p className="text-gray-400 font-bold">全ユーザーが参加できる公開掲示板です。</p>
                 {globalChatLocked && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><Lock size={12}/> LOCKED</span>}
              </div>
            </header>
            
            <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
               <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col-reverse">
                 {globalChat.map(msg => (
                   <div key={msg.id} className="flex gap-4 group hover:bg-gray-50 p-2 rounded-xl transition-colors">
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${msg.role === 'owner' ? 'bg-red-100 text-red-600 border border-red-200' : (msg.role === 'admin' ? 'bg-orange-100 text-orange-600' : (msg.role === 'op' ? 'bg-pink-100 text-pink-600' : (msg.role === 'mod' ? 'bg-cyan-100 text-cyan-600' : (msg.isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'))))}`}>
                          <User size={20} />
                        </div>
                        {(() => {
                           const chatUser = allUsers.find(u => u.username === msg.username);
                           const isOnline = chatUser ? isUserOnline(chatUser.lastActive) : false;
                           return <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white z-10 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-baseline gap-2 mb-1">
                           <span className={`font-black text-sm ${msg.role === 'owner' ? 'text-red-600' : (msg.role === 'admin' ? 'text-orange-600' : (msg.role === 'op' ? 'text-pink-600' : (msg.role === 'mod' ? 'text-cyan-600' : (msg.isPremium ? 'text-yellow-600' : 'text-gray-800'))))}`}>
                             {msg.username}
                           </span>
                           {/* Badges in Chat */}
                           {msg.role === 'owner' && (
                             <>
                               <Aperture size={12} className="text-red-600 fill-red-100 animate-spin-slow" />
                               <CheckCircle2 size={12} className="text-orange-500 fill-orange-50" />
                               <Moon size={12} className="text-pink-500 fill-pink-100" />
                               <Shield size={12} className="text-cyan-500 fill-cyan-50" />
                               <Crown size={12} className="text-yellow-500 fill-yellow-500" />
                               <Heart size={12} className="text-green-500 fill-green-100" />
                             </>
                           )}
                           {msg.role === 'admin' && <CheckCircle2 size={12} className="text-orange-500 fill-orange-50" />}
                           {msg.role === 'op' && <Moon size={12} className="text-pink-500 fill-pink-100" />}
                           {msg.role === 'mod' && <Shield size={12} className="text-cyan-500 fill-cyan-50" />}
                           {msg.isPremium && <Crown size={12} className="text-yellow-500 fill-yellow-500" />}
                           {msg.isSupporter && <Heart size={12} className="text-green-500 fill-green-100" />}
                           <span className="text-[10px] text-gray-300 font-bold">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                         </div>
                         <p className={`font-medium text-sm break-words leading-relaxed ${msg.role === 'owner' ? 'text-red-900 font-bold' : 'text-gray-700'}`}>{msg.text}</p>
                         {msg.img && <img src={msg.img} className="max-w-xs rounded-xl mt-2 border border-gray-200" alt="chat" />}
                      </div>
                      {/* Delete Button for Admin/Mod/Owner OR Offline Mode */}
                      {((profile?.role === 'admin' || profile?.role === 'mod' || profile?.role === 'op' || profile?.role === 'owner') || isOfflineMode) && (
                        <button onClick={() => openDeleteModal('chat', msg.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 transition-all"><Trash2 size={16}/></button>
                      )}
                   </div>
                 ))}
                 {globalChat.length === 0 && <div className="text-center text-gray-300 font-bold py-10">まだメッセージはありません。一番乗りを目指せ！🚀</div>}
               </div>
               
               {/* Input Area */}
               <div className="p-4 bg-gray-50 border-t border-gray-100">
                 {profile ? (
                   <form onSubmit={handleSendGlobalChat} className="flex flex-col gap-2">
                     {chatImgUpload && (
                        <div className="relative inline-block w-fit">
                           <img src={chatImgUpload} className="h-20 rounded-lg border shadow-sm" alt="upload preview"/>
                           <button type="button" onClick={() => setChatImgUpload('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                        </div>
                     )}
                     <div className="flex gap-3">
                        {chatImageEnabled && (
                           <label className="bg-white border-2 border-transparent text-gray-400 hover:text-orange-500 rounded-xl px-4 flex items-center justify-center cursor-pointer shadow-sm transition-all">
                              <ImageIcon size={20} />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setChatImgUpload)} disabled={globalChatLocked && profile.role !== 'owner'} />
                           </label>
                        )}
                        <input 
                          type="text" 
                          value={chatInput} 
                          onChange={(e) => setChatInput(e.target.value)} 
                          placeholder={globalChatLocked && profile.role !== 'owner' ? "現在チャットはロックされています" : "メッセージを送信..."}
                          disabled={globalChatLocked && profile.role !== 'owner'}
                          className={`flex-1 bg-white border-2 border-transparent focus:border-orange-400 rounded-xl px-4 py-3 font-bold outline-none shadow-sm transition-all ${globalChatLocked && profile.role !== 'owner' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                        />
                        <button type="submit" disabled={globalChatLocked && profile.role !== 'owner'} className={`text-white p-3 rounded-xl shadow-lg transition-all ${globalChatLocked && profile.role !== 'owner' ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-95'}`}><Send size={20} /></button>
                     </div>
                   </form>
                 ) : (
                   <div className="text-center py-2 text-gray-400 font-bold text-sm">チャットに参加するにはログインしてください。</div>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* View: Mall (formerly Shop) */}
        {view === 'shop' && (
          <div className="space-y-12 animate-in slide-in-from-right duration-500">
            <header className="flex justify-between items-end">
               <div>
                  <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-4">
                    <ShoppingBag className="text-orange-500" size={40} /> Global Mall
                  </h1>
                  <p className="text-gray-400 font-bold mt-2">誰でも商品を出品・購入できる巨大マーケット！</p>
               </div>
               <button onClick={() => setShowAddItemModal(true)} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"><PlusCircle size={20}/> 出品する</button>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredShopItems.length === 0 ? (
                 <div className="col-span-full py-20 text-center text-gray-400 font-bold bg-white rounded-[2.5rem] border border-gray-100">商品が見つかりません。</div>
              ) : (
                filteredShopItems.map(item => {
                const actualPrice = Math.floor(item.price * (1 - (item.discount || 0) / 100));
                return (
                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-transparent hover:border-orange-400 hover:shadow-2xl transition-all flex flex-col group relative overflow-hidden">
                  <div onClick={() => setSelectedShopItem(item)} className="cursor-pointer">
                     <div className="aspect-video bg-gray-50 rounded-3xl overflow-hidden mb-4 border-2 border-gray-50 relative">
                       <img src={item.img || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                       <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><Key size={12} /> CODE</div>
                       {item.discount > 0 && <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse">{item.discount}% OFF!!</div>}
                     </div>
                     <div className="flex justify-between items-start mb-2"><p className="font-black text-xl text-gray-800 tracking-tighter italic">{item.title}</p></div>
                     <p className="text-[10px] text-gray-500 font-bold mb-2 flex items-center gap-1"><User size={12}/> 出品者: {item.seller || 'System'}</p>
                     <p className="text-xs text-gray-400 font-bold mb-4 line-clamp-2">{item.description}</p>
                     <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                           {item.discount > 0 && <span className="text-gray-400 line-through text-xs font-bold">{item.price} P</span>}
                           <p className="text-2xl font-black text-orange-600 tracking-tighter flex items-center gap-1"><Coins size={20} className="fill-current" /> {actualPrice}</p>
                        </div>
                        <button className="bg-orange-500 text-white p-3 rounded-xl shadow-lg hover:scale-110 transition-transform"><ShoppingBag size={18} /></button>
                     </div>
                  </div>
                  {/* 自分が出品した商品なら編集可能 */}
                  {profile && item.seller === profile.username && (
                     <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <button onClick={() => {setEditingMallItem(item); setShowEditMallModal(true);}} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1"><Settings size={14}/> 設定変更</button>
                        <button onClick={() => openDeleteModal('item', item.id)} className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"><Trash2 size={14}/></button>
                     </div>
                  )}
                </div>
              );
              })
              )}
            </div>
          </div>
        )}

        {view === 'inventory' && (
          <div className="space-y-12 animate-in slide-in-from-right duration-500">
            <header>
              <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-4">
                <Gift className="text-blue-500" size={40} /> My Inventory
              </h1>
              <p className="text-gray-400 font-bold mt-2">購入したチートコードを確認できます。</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myInventory.length === 0 ? (
                <div className="col-span-2 py-20 text-center bg-white rounded-[3rem] border-2 border-dashed">
                  <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="font-black text-gray-300 italic">まだ何も購入していません。</p>
                </div>
              ) : (
                myInventory.map(item => (
                  <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex gap-6 items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.img} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-800 italic">{item.title}</h3>
                      <p className="text-xs text-gray-400 font-bold mt-1 mb-4">{new Date(item.purchasedAt).toLocaleDateString()} に購入</p>
                      <div className="bg-gray-900 p-4 rounded-xl relative group cursor-pointer overflow-hidden">
                        <p className="text-center text-white font-mono font-black text-lg tracking-widest relative z-10">{item.secret}</p>
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center group-hover:opacity-0 transition-opacity z-20">
                           <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2"><Lock size={12}/> Hover to reveal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {view === 'friends' && (
          <div className="space-y-12 animate-in slide-in-from-right duration-500">
            <header>
              <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic flex items-center gap-4">
                <Users className="text-orange-500" size={40} /> Discovery
              </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredUsers.map(u => (
                <div key={u.id} onClick={() => setSelectedUserProfile(u)} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center group ${u.role === 'owner' ? 'border-red-500 shadow-red-200 shadow-xl scale-105' : (u.isPremium ? 'border-yellow-200 shadow-yellow-100 shadow-lg' : (u.role === 'mod' || u.role === 'op' ? 'border-cyan-200 hover:border-cyan-400' : 'border-transparent hover:border-orange-400'))} hover:shadow-2xl`}>
                  <div className="relative mb-4 group-hover:scale-110 transition-transform">
                    <div className={`w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden border-2 ${u.role === 'owner' ? 'border-red-500 bg-red-50' : (u.isPremium ? 'border-yellow-400' : (u.role === 'mod' || u.role === 'op' ? 'border-cyan-400' : 'border-gray-50'))}`}>
                      {u.isPremium && <div className="absolute top-0 right-0 p-1"><Crown size={12} className="fill-yellow-500 text-yellow-500" /></div>}
                      {u.profileImg ? <img src={u.profileImg} className="w-full h-full object-cover" /> : <User size={48} className={u.role === 'owner' ? 'text-red-900' : 'text-gray-200 mt-2'} />}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-white z-10 ${isUserOnline(u.lastActive) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="flex items-center gap-2 mb-1 justify-center flex-wrap">
                    <p className={`font-black text-xl tracking-tighter italic ${u.role === 'owner' ? 'text-red-600' : (u.isPremium ? 'text-yellow-600' : (u.role === 'mod' ? 'text-cyan-600' : (u.role === 'op' ? 'text-pink-600' : 'text-gray-800')))}`}>{u.displayName || u.username}</p>
                    {renderBadges(u)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View: STAFF ROOM (Admin & OP & MOD & Owner) */}
        {view === 'staff_room' && (profile?.role === 'admin' || profile?.role === 'mod' || profile?.role === 'op' || profile?.role === 'owner') && (
           <div className="space-y-12 animate-in fade-in duration-500">
             <header className="flex items-center justify-between border-b-4 border-cyan-500 pb-4">
              <h2 className="text-5xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center gap-4">
                <Megaphone className="text-cyan-500" size={48} /> Staff Room
              </h2>
              <div className="bg-cyan-100 text-cyan-700 px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                 <Shield size={18}/> Authorized Personnel Only
              </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* STAFF CHAT */}
              <div className="bg-white rounded-[2.5rem] border border-cyan-200 shadow-xl overflow-hidden flex flex-col h-[500px]">
                 <div className="p-4 bg-cyan-50 border-b border-cyan-100 flex items-center gap-2">
                    <Shield size={20} className="text-cyan-600"/>
                    <h3 className="font-black text-cyan-900">Staff Only Chat (Secret)</h3>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col-reverse bg-slate-50">
                    {staffChat.map(msg => (
                      <div key={msg.id} className="flex flex-col items-start bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative">
                         <div className="flex items-center gap-2 mb-1">
                           {(() => {
                              const chatUser = allUsers.find(u => u.username === msg.username);
                              const isOnline = chatUser ? isUserOnline(chatUser.lastActive) : false;
                              return <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>;
                           })()}
                           <span className={`font-black text-xs ${msg.role === 'owner' ? 'text-red-600' : (msg.role === 'admin' ? 'text-orange-600' : (msg.role === 'op' ? 'text-pink-600' : 'text-cyan-600'))}`}>{msg.username}</span>
                           <span className="text-[10px] text-gray-300">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                         </div>
                         <p className="text-gray-700 text-sm font-medium">{msg.text}</p>
                         <button onClick={() => openDeleteModal('chat', msg.id, { isStaff: true })} className="text-[10px] text-red-300 hover:text-red-500 mt-1 self-end">削除</button>
                      </div>
                    ))}
                    {staffChat.length === 0 && <div className="text-center text-gray-300 text-sm py-10">機密情報はありません。</div>}
                 </div>
                 <form onSubmit={handleSendStaffChat} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input type="text" value={staffChatInput} onChange={(e) => setStaffChatInput(e.target.value)} placeholder="スタッフへの連絡..." className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:bg-cyan-50 transition-colors" />
                    <button type="submit" className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700"><Send size={16}/></button>
                 </form>
              </div>

              <div className="space-y-6">
                {/* ANNOUNCEMENT CONTROLS (Multi-Color) */}
                <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                  <Megaphone className="absolute top-4 right-4 text-white/10 rotate-12" size={120} />
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 relative z-10 flex items-center gap-3">Global Announcement <Megaphone size={24}/></h3>
                  <p className="text-white/60 text-sm font-bold mb-6 relative z-10">全ユーザーの画面上部にメッセージを配信します。</p>
                  
                  <div className="flex gap-2 mb-4 relative z-10">
                     <button onClick={() => setAnnounceColor('red')} className={`flex-1 py-2 rounded font-black text-xs transition-colors ${announceColor === 'red' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>🔴 重要</button>
                     <button onClick={() => setAnnounceColor('blue')} className={`flex-1 py-2 rounded font-black text-xs transition-colors ${announceColor === 'blue' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>🔵 通常</button>
                     <button onClick={() => setAnnounceColor('green')} className={`flex-1 py-2 rounded font-black text-xs transition-colors ${announceColor === 'green' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>🟢 おふざけ</button>
                  </div>

                  <div className="flex gap-4 relative z-10 flex-col sm:flex-row">
                    <input 
                      type="text" 
                      value={announcementInput} 
                      onChange={(e) => setAnnouncementInput(e.target.value)} 
                      placeholder="メッセージを入力..." 
                      className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 placeholder-white/50 font-bold focus:outline-none focus:bg-white/30"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handlePublishMultiAnnouncement(announceColor)} className={`px-6 py-3 rounded-xl font-black shadow-lg transition-all flex-1 text-white ${announceColor === 'red' ? 'bg-red-600 hover:bg-red-500' : (announceColor === 'blue' ? 'bg-blue-500 hover:bg-blue-400' : 'bg-green-500 hover:bg-green-400')}`}>配信</button>
                      <button onClick={() => handleClearMultiAnnouncement(announceColor)} className="bg-white/10 text-white px-4 py-3 rounded-xl font-black hover:bg-white/20 transition-all flex-shrink-0"><X size={20}/></button>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* OWNER EXCLUSIVE: BASE64 & MALL BGM */}
            {profile.role === 'owner' && (
               <section className="bg-black rounded-[2.5rem] p-8 text-white shadow-xl border border-green-500/50 relative overflow-hidden mt-8">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-green-400"><Music size={24} className="inline mr-2"/> Audio Base64 Encoder & Mall BGM</h3>
                  <div className="space-y-4">
                     <div className="bg-gray-900 p-4 rounded-xl border border-green-900/50">
                        <h4 className="font-bold text-sm text-green-500 mb-2">1. 音楽ファイルをBase64化</h4>
                        <input type="file" accept="audio/*" onChange={(e) => {
                           const file = e.target.files[0];
                           if (file) {
                              if (file.size > 1000000) return setMsg("1MB以下のファイルにしてください。");
                              const reader = new FileReader();
                              reader.onloadend = () => setBase64Result(reader.result);
                              reader.readAsDataURL(file);
                           }
                        }} className="w-full text-xs text-gray-400 mb-2"/>
                        {base64Result && (
                           <div className="relative">
                              <textarea readOnly value={base64Result} className="w-full h-20 bg-black text-green-500 text-[10px] font-mono p-2 rounded border border-green-800 break-all resize-none" />
                              <button onClick={() => {navigator.clipboard.writeText(base64Result); setMsg("コピーしたで！");}} className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">Copy</button>
                           </div>
                        )}
                     </div>
                     <div className="bg-gray-900 p-4 rounded-xl border border-green-900/50">
                        <h4 className="font-bold text-sm text-green-500 mb-2">2. モール強制BGM設定</h4>
                        <div className="flex gap-2">
                           <input type="text" value={mallBgmInput} onChange={(e)=>setMallBgmInput(e.target.value)} placeholder="Base64オーディオコードを入力..." className="flex-1 bg-black border border-green-800 rounded px-3 py-2 text-xs font-mono text-green-500"/>
                           <button onClick={async () => {
                              if(isOfflineMode) return;
                              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { mallBgm: mallBgmInput }, { merge: true });
                              setMsg("モールのBGMを設定・再生開始したで！");
                           }} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold text-xs">再生</button>
                           <button onClick={async () => {
                              if(isOfflineMode) return;
                              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { mallBgm: null }, { merge: true });
                              setMsg("モールのBGMを停止したで！");
                           }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold text-xs">停止</button>
                        </div>
                     </div>
                  </div>
               </section>
            )}
           </div>
        )}

        {/* --- VIEW: OVERSEER CONSOLE (OWNER ONLY) --- */}
        {view === 'overseer_console' && profile?.role === 'owner' && (
          <div className="space-y-8 animate-in fade-in duration-500 min-h-screen">
            <header className="flex items-center justify-between border-b-4 border-green-800 pb-4">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter flex items-center gap-4 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                <Eye className="animate-pulse" size={48} /> OVERSEER CONSOLE
              </h2>
            </header>

            {overseerLoading ? (
              <div className="bg-black rounded-[3rem] p-20 flex flex-col items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <Loader2 className="animate-spin text-green-500 mb-4" size={64} />
                <p className="text-green-500 font-mono font-black tracking-widest animate-pulse">CONNECTING TO NEURAL NETWORK...</p>
              </div>
            ) : (
              <div className="bg-black rounded-[3rem] p-8 shadow-[0_0_50px_rgba(34,197,94,0.2)] border border-green-500/50 relative overflow-hidden flex flex-col h-[700px]">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
                 <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 shadow-[0_0_10px_#22c55e]"></div>
                 
                 <h3 className="text-xl font-mono font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-green-400 relative z-10"><Terminal size={20}/> ALL USERS SURVEILLANCE DATA</h3>
                 
                 <div className="flex-1 overflow-auto border border-green-900/50 rounded-xl relative z-10 bg-black/80">
                    <table className="w-full text-left text-xs font-mono text-green-500 whitespace-nowrap">
                       <thead className="bg-green-950/50 sticky top-0 shadow-sm border-b border-green-900">
                          <tr>
                             <th className="p-3">TARGET</th>
                             <th className="p-3">STATUS</th>
                             <th className="p-3">LOCATION (VIEW)</th>
                             <th className="p-3">LAST PLAYED</th>
                             <th className="p-3">LAST ACTIVE</th>
                             <th className="p-3">POTEX</th>
                             <th className="p-3">PREMIUM</th>
                             <th className="p-3">ACTION</th>
                          </tr>
                       </thead>
                       <tbody>
                          {allUsers.slice().sort((a, b) => new Date(b.lastActive || 0) - new Date(a.lastActive || 0)).map(u => {
                             const online = isUserOnline(u.lastActive);
                             return (
                             <tr key={u.id} className="border-b border-green-900/30 hover:bg-green-900/20 transition-colors">
                                <td className="p-3 font-bold">{u.username} <span className="text-green-800 text-[10px]">[{u.role}]</span></td>
                                <td className="p-3">
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${online ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-green-900'}`}>{online ? 'ONLINE' : 'OFFLINE'}</span>
                                </td>
                                <td className="p-3">{u.currentView || 'UNKNOWN'}</td>
                                <td className="p-3 truncate max-w-[150px]">{u.lastGame || 'NONE'}</td>
                                <td className="p-3">{u.lastActive ? new Date(u.lastActive).toLocaleString() : 'N/A'}</td>
                                <td className="p-3 text-yellow-500">{u.potex || 0} P</td>
                                <td className="p-3">{u.isPremium ? 'YES' : 'NO'}</td>
                                <td className="p-3">
                                   <button onClick={() => setSelectedUserForPreview(u)} className="bg-green-900/50 hover:bg-green-500 text-green-400 hover:text-white px-3 py-1 rounded text-[10px] border border-green-500/50 transition-colors font-bold uppercase">Preview</button>
                                </td>
                             </tr>
                          )})}
                       </tbody>
                    </table>
                 </div>
                 {/* PREVIEW UI */}
                 {selectedUserForPreview && (
                    <div className="mt-6 border-t border-green-900/50 pt-6 relative z-10 animate-in slide-in-from-bottom flex-shrink-0">
                       <div className="flex justify-between items-center mb-4">
                          <h4 className="text-green-400 font-mono font-black tracking-widest flex items-center gap-2"><Monitor size={16}/> LIVE VIEW INTERCEPT: {selectedUserForPreview.username}</h4>
                          <button onClick={() => setSelectedUserForPreview(null)} className="text-green-600 hover:text-green-400"><X size={20}/></button>
                       </div>
                       <div className="bg-black border border-green-800 rounded-2xl h-48 overflow-hidden relative shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                          <div className="p-4 h-full flex flex-col relative z-10">
                             <div className="border-b border-green-900 pb-2 mb-2 flex items-center justify-between">
                                <span className="text-[10px] text-green-600 font-bold tracking-widest">POTATOX VIRTUAL DISPLAY PORT</span>
                                <span className="text-[10px] text-red-500 animate-pulse font-bold">● LIVE REC</span>
                             </div>
                             <div className="flex-1 flex items-center justify-center gap-8">
                                <div className="p-4 border border-red-500/30 rounded-xl bg-red-900/20">
                                   <MessageSquare size={40} className="text-red-500 animate-pulse"/>
                                </div>
                                <div className="flex-1 max-w-lg">
                                   <h5 className="text-lg font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">LIVE KEYSTROKE INTERCEPT</h5>
                                   <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 h-24 overflow-y-auto w-full">
                                      <p className="text-red-500 font-bold font-mono break-words">{selectedUserForPreview.typingInChat || '...'}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            )}
          </div>
        )}

        {/* View: Admin Console (Admin ONLY) & Owner Console (Owner ONLY) */}
        {(view === 'admin' && profile?.role === 'admin') || (view === 'owner_console' && profile?.role === 'owner') ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* ... (Console Header) ... */}
            <header className={`flex items-center justify-between border-b-4 ${profile.role === 'owner' ? 'border-red-800' : 'border-red-600'} pb-4`}>
              <h2 className={`text-5xl font-black uppercase italic tracking-tighter flex items-center gap-4 ${profile.role === 'owner' ? 'text-red-900' : 'text-gray-800'}`}>
                {profile.role === 'owner' ? <Aperture className="text-red-600 animate-spin-slow" size={48} /> : <ShieldCheck className="text-red-600" size={48} />} 
                {profile.role === 'owner' ? 'OVERLORD CONSOLE' : 'Console'}
              </h2>
              <div className="flex gap-4">
                 <button onClick={() => setShowAddItemModal(true)} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-orange-700 transition-all flex items-center gap-2 uppercase tracking-tighter italic"><PlusCircle size={20}/> New Item</button>
                 <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-tighter italic"><PlusCircle size={20}/> New Asset</button>
              </div>
            </header>

            {/* OWNER EXCLUSIVE: GOD MODE & EFFECTS */}
            {profile.role === 'owner' && (
               <section className="bg-gradient-to-r from-red-900 via-red-800 to-black rounded-[3rem] shadow-2xl overflow-hidden border-4 border-red-600 relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 animate-pulse pointer-events-none"></div>
                 <div className="p-8 border-b border-red-500/50 bg-black/50 text-white flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                       <Eye className="text-red-500 animate-pulse" />
                       <h3 className="font-black text-2xl uppercase italic tracking-tighter">God Mode (Overlord Only)</h3>
                    </div>
                    <button onClick={handleOwnerGodMode} className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all flex items-center gap-2 uppercase italic text-sm"><Zap size={16} /> Max Potex</button>
                 </div>
                 
                 <div className="p-10 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Media Override */}
                    <div className="bg-black/40 rounded-3xl p-6 border border-red-500/30">
                       <h4 className="text-red-400 font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-sm"><Music size={16}/> Media Override</h4>
                       <div className="flex gap-2 mb-4">
                          <button onClick={()=>setMediaTypeInput('audio')} className={`flex-1 py-2 font-bold text-xs rounded border ${mediaTypeInput === 'audio' ? 'bg-red-900 border-red-500 text-white' : 'border-gray-700 text-gray-400'}`}>AUDIO</button>
                          <button onClick={()=>setMediaTypeInput('video')} className={`flex-1 py-2 font-bold text-xs rounded border ${mediaTypeInput === 'video' ? 'bg-red-900 border-red-500 text-white' : 'border-gray-700 text-gray-400'}`}>VIDEO</button>
                       </div>
                       <input type="file" accept={mediaTypeInput === 'audio' ? 'audio/*' : 'video/*'} onChange={(e) => { const file = e.target.files[0]; if (file) { if (file.size > 700000) return setMsg("データベース制限のためファイルサイズは700KB以下にしてください。"); const reader = new FileReader(); reader.onloadend = () => setMediaUrlInput(reader.result); reader.readAsDataURL(file); } }} className="w-full bg-black border border-gray-700 text-white rounded p-3 text-xs outline-none mb-2" />
                       <p className="text-red-500 text-[10px] mt-2 mb-1">または Base64コードを直接入力 (Audio/Video共通):</p>
                       <input type="text" value={base64MediaInput} onChange={(e) => { setBase64MediaInput(e.target.value); setMediaUrlInput(e.target.value); }} placeholder="data:audio/mp3;base64,..." className="w-full bg-black border border-gray-700 text-white rounded p-3 text-xs font-mono outline-none mb-4" />
                       <div className="flex gap-2">
                           <button onClick={fireMediaEvent} className="flex-1 bg-red-600 text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_red]"><Play size={16}/> FORCED PLAY</button>
                           <button onClick={clearMediaEvent} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-600" title="全員の再生を強制停止"><Ban size={16}/> STOP ALL</button>
                       </div>
                    </div>

                    {/* Global Visual Effects */}
                    <div className="bg-black/40 rounded-3xl p-6 border border-red-500/30">
                       <h4 className="text-red-400 font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-sm"><Bomb size={16}/> Global Effects</h4>
                       <div className="grid grid-cols-2 gap-4 h-full pb-8">
                          <button onClick={()=>fireVisualEvent('confetti')} className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white font-black rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"><PartyPopper size={32}/> CONFETTI</button>
                          <button onClick={()=>fireVisualEvent('explosion')} className="bg-gradient-to-br from-red-600 to-red-900 text-white font-black rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_red]"><Bomb size={32}/> EXPLOSION</button>
                       </div>
                    </div>
                 </div>
               </section>
            )}

            {/* SYSTEM TOGGLES */}
            <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8 border-b bg-blue-900 text-white flex items-center gap-3">
                 <Settings className="text-blue-400" />
                 <h3 className="font-black text-2xl uppercase italic tracking-tighter">System Settings</h3>
              </div>
              <div className="p-10 space-y-4">
                 {/* Logbo Toggle */}
                 <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div>
                       <h4 className="font-black text-gray-800 text-lg">Global Login Bonus</h4>
                       <p className="text-xs text-gray-500 font-bold">全ユーザーの6時間ごとのポテトックス受取機能をON/OFFします。</p>
                    </div>
                    <button onClick={async () => { if(isOfflineMode) return; await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { globalLogboEnabled: !globalLogboEnabled }, { merge: true }); }} className={`px-6 py-3 rounded-xl font-black transition-all ${globalLogboEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>{globalLogboEnabled ? 'ON' : 'OFF'}</button>
                 </div>
                 
                 {/* Owner Only Toggles */}
                 {profile.role === 'owner' && (
                    <>
                       <div className="flex items-center justify-between bg-red-50 p-6 rounded-2xl border border-red-200">
                          <div>
                             <h4 className="font-black text-red-800 text-lg flex items-center gap-2"><Lock size={18}/> Global Chat Lock</h4>
                             <p className="text-xs text-red-600/80 font-bold">一般ユーザーのグローバルチャット送信を完全に禁止します。</p>
                          </div>
                          <button onClick={async () => { if(isOfflineMode) return; await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { globalChatLocked: !globalChatLocked }, { merge: true }); }} className={`px-6 py-3 rounded-xl font-black transition-all ${globalChatLocked ? 'bg-red-600 text-white shadow-[0_0_15px_red]' : 'bg-white border border-red-200 text-red-600'}`}>{globalChatLocked ? 'LOCKED' : 'UNLOCKED'}</button>
                       </div>
                       <div className="flex items-center justify-between bg-purple-50 p-6 rounded-2xl border border-purple-200">
                          <div>
                             <h4 className="font-black text-purple-800 text-lg flex items-center gap-2"><ImageIcon size={18}/> Chat Image Upload</h4>
                             <p className="text-xs text-purple-600/80 font-bold">チャットでの画像アップロード機能を許可/禁止します。</p>
                          </div>
                          <button onClick={async () => { if(isOfflineMode) return; await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'system_settings', 'config'), { chatImageEnabled: !chatImageEnabled }, { merge: true }); }} className={`px-6 py-3 rounded-xl font-black transition-all ${chatImageEnabled ? 'bg-purple-600 text-white' : 'bg-white border border-purple-200 text-purple-600'}`}>{chatImageEnabled ? 'ENABLED' : 'DISABLED'}</button>
                       </div>
                    </>
                 )}
              </div>
            </section>

            {/* BOT CONTROL SYSTEM (ADMIN / OWNER) */}
            <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200">
               <div className="p-8 border-b bg-indigo-900 text-white flex items-center gap-3">
                  <Terminal className="text-indigo-400" />
                  <h3 className="font-black text-2xl uppercase italic tracking-tighter">Bot Control System</h3>
               </div>
               <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 予約ボット */}
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                     <h4 className="font-black text-indigo-900 mb-4 flex items-center gap-2"><Clock size={18}/> Bot Scheduler</h4>
                     <form onSubmit={handleAddBotSchedule} className="space-y-3">
                        <input type="text" value={newBotSchedule.name} onChange={e=>setNewBotSchedule({...newBotSchedule, name: e.target.value})} placeholder="Bot Name" className="w-full bg-white rounded-lg p-2 text-xs font-bold border outline-none focus:border-indigo-500" required />
                        <input type="text" value={newBotSchedule.message} onChange={e=>setNewBotSchedule({...newBotSchedule, message: e.target.value})} placeholder="送信するメッセージ..." className="w-full bg-white rounded-lg p-2 text-xs font-bold border outline-none focus:border-indigo-500" required />
                        <div className="flex gap-2">
                           <input type="datetime-local" value={newBotSchedule.time} onChange={e=>setNewBotSchedule({...newBotSchedule, time: e.target.value})} className="flex-1 bg-white rounded-lg p-2 text-xs font-bold border outline-none focus:border-indigo-500" required />
                           <select value={newBotSchedule.target} onChange={e=>setNewBotSchedule({...newBotSchedule, target: e.target.value})} className="bg-white rounded-lg p-2 text-xs font-bold border outline-none focus:border-indigo-500"><option value="global">Global</option><option value="staff">Staff</option></select>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-indigo-700 transition-colors">予約セット</button>
                     </form>
                     <div className="mt-4 max-h-32 overflow-y-auto space-y-2">
                        {botSchedules.filter(s=>!s.executed).map(s => (
                           <div key={s.id} className="bg-white p-2 rounded border border-indigo-100 text-[10px] font-bold text-gray-600 flex justify-between items-center">
                              <div><span className="text-indigo-600">{s.name}</span>: {s.message}</div>
                              <span className="text-gray-400">{new Date(s.time).toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 夜間巡回ボット */}
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-white relative overflow-hidden">
                     <Moon className="absolute top-4 right-4 text-slate-700 rotate-12" size={64}/>
                     <h4 className="font-black text-slate-200 mb-4 flex items-center gap-2 relative z-10"><Moon size={18}/> Night Patrol Bot</h4>
                     <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-600">
                           <span className="text-xs font-bold">ボット稼働</span>
                           <button onClick={()=>setNightBotConfig({...nightBotConfig, enabled: !nightBotConfig.enabled})} className={`px-4 py-1 rounded text-xs font-black ${nightBotConfig.enabled ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'}`}>{nightBotConfig.enabled ? 'ON' : 'OFF'}</button>
                        </div>
                        <input type="text" value={nightBotConfig.name} onChange={e=>setNightBotConfig({...nightBotConfig, name: e.target.value})} placeholder="Bot Name" className="w-full bg-slate-900 rounded-lg p-2 text-xs font-bold border border-slate-600 text-white outline-none focus:border-slate-400" />
                        <input type="text" value={nightBotConfig.message} onChange={e=>setNightBotConfig({...nightBotConfig, message: e.target.value})} placeholder="定期送信メッセージ..." className="w-full bg-slate-900 rounded-lg p-2 text-xs font-bold border border-slate-600 text-white outline-none focus:border-slate-400" />
                        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-600">
                           <span className="text-xs font-bold text-slate-300 ml-1">実行間隔 (時間):</span>
                           <input type="number" min="1" max="24" value={nightBotConfig.intervalHours} onChange={e=>setNightBotConfig({...nightBotConfig, intervalHours: parseInt(e.target.value)})} className="flex-1 bg-transparent text-white text-xs font-bold outline-none pl-2" />
                        </div>
                        <button onClick={handleSaveNightBot} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded-lg text-xs transition-colors">設定を保存</button>
                     </div>
                  </div>
               </div>
            </section>

            {/* POTEX REQUESTS MANAGER */}
            <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8 border-b bg-green-900 text-white flex items-center gap-3">
                 <Wallet className="text-green-400" />
                 <h3 className="font-black text-2xl uppercase italic tracking-tighter">Potex Requests</h3>
              </div>
              <div className="p-8 h-96 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 gap-4">
                  {potexRequests.filter(req => req.status === 'pending').map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-gray-800">{req.username}</span>
                        <p className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="font-black text-orange-500 text-xl">{req.amount} P</span>
                         <div className="flex gap-2">
                           <button onClick={() => handleApprovePotex(req.id, req.username, req.amount)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-black text-xs hover:bg-green-600 transition-all">承認</button>
                           <button onClick={() => handleRejectPotex(req.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-black text-xs hover:bg-red-600 transition-all">拒否</button>
                         </div>
                      </div>
                    </div>
                  ))}
                  {potexRequests.filter(req => req.status === 'pending').length === 0 && <p className="text-gray-400 text-sm font-bold">現在、承認待ちの申請はありません。</p>}
                </div>
              </div>
            </section>

            {/* CHAT MANAGER */}
            <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8 border-b bg-orange-900 text-white flex items-center gap-3">
                 <MessageSquare className="text-orange-400" />
                 <h3 className="font-black text-2xl uppercase italic tracking-tighter">Global Chat Manager</h3>
              </div>
              <div className="p-8 h-96 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {globalChat.map(msg => (
                    <div key={msg.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-gray-800">{msg.username}</span>
                        <span className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-4 flex-1 break-words bg-gray-50 p-2 rounded-lg">{msg.text}</p>
                      {msg.img && <img src={msg.img} className="w-full rounded-lg mb-4" alt="chat" />}
                      <button 
                        onClick={() => openDeleteModal('chat', msg.id)} 
                        className="bg-red-50 text-red-600 text-xs font-black py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> 強制削除 (BAN)
                      </button>
                    </div>
                  ))}
                  {globalChat.length === 0 && <p className="text-gray-400 text-sm font-bold">メッセージ履歴はありません。</p>}
                </div>
              </div>
            </section>
            
            {/* HUMAN RESOURCES (Promote) */}
            <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8 border-b bg-cyan-900 text-white flex items-center gap-3">
                 <Briefcase className="text-cyan-400" />
                 <h3 className="font-black text-2xl uppercase italic tracking-tighter">Human Resources</h3>
              </div>
              <div className="p-10">
                 <h4 className="font-black text-gray-800 mb-2 flex items-center gap-2">Staff Assignment <Shield className="text-cyan-500" size={20}/></h4>
                 <p className="text-xs font-bold text-gray-400 mb-6">ユーザー名を入力して、OP（オペレーター）またはMOD（モデレーター）権限を付与・剥奪します。</p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      value={promoteName} 
                      onChange={(e) => setPromoteName(e.target.value)} 
                      placeholder="ユーザー名を入力..." 
                      className="flex-1 bg-gray-100 border-2 border-transparent focus:border-cyan-500 rounded-xl px-4 py-3 font-bold outline-none"
                    />
                    <div className="flex gap-2">
                       <button onClick={() => handlePromoteToMod('mod')} className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-cyan-700 transition-all uppercase italic whitespace-nowrap">MOD任命 🛡️</button>
                       <button onClick={() => handlePromoteToMod('op')} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-pink-600 transition-all uppercase italic whitespace-nowrap">OP任命 🌙</button>
                    </div>
                 </div>
              </div>
            </section>
            
            {/* Backup & Restore Section with SLIDE TO UNLOCK */}
            <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8 border-b bg-gray-900 text-white flex items-center gap-3">
                 <FileJson className="text-green-400" />
                 <h3 className="font-black text-2xl uppercase italic tracking-tighter">System Backup & Restore</h3>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-800 mb-2">
                    <Download size={24} className="text-blue-600" />
                    <h4 className="text-xl font-black uppercase tracking-widest">Export Data</h4>
                  </div>
                  <p className="text-xs font-bold text-gray-400">現在の全データ（ゲーム、ショップアイテム）をJSONコードとして出力します。</p>
                  <div className="bg-gray-100 p-4 rounded-2xl font-mono text-[10px] text-gray-600 h-32 overflow-y-auto break-all border border-gray-200">{backupData || "// データ出力待機中..."}</div>
                  <button onClick={handleExportData} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"><Copy size={18} /> コードを生成してコピー 🔥</button>
                </div>
                
                {/* SLIDE UNLOCK RESTORE */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-800 mb-2">
                    <Upload size={24} className="text-red-600" />
                    <h4 className="text-xl font-black uppercase tracking-widest">Import & Restore</h4>
                  </div>
                  <p className="text-xs font-bold text-gray-400">バックアップコードを貼り付け、スライドしてロックを解除してください。</p>
                  <textarea 
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-mono text-xs focus:border-red-500 outline-none h-32 resize-none"
                    placeholder='{"version": "1.0", "games": [...]}'
                  />
                  
                  {/* SLIDER UI */}
                  <div className="relative h-14 bg-gray-200 rounded-full overflow-hidden select-none cursor-pointer">
                    <div 
                      className={`h-full transition-all duration-75 flex items-center justify-end pr-4 ${restoreSlider >= 100 ? 'bg-red-500' : 'bg-gray-400'}`} 
                      style={{width: `${restoreSlider}%`}}
                    >
                      {restoreSlider >= 100 && <Unlock size={20} className="text-white animate-ping" />}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className={`font-black text-sm uppercase tracking-widest ${restoreSlider >= 100 ? 'text-white' : 'text-gray-500 mix-blend-multiply'}`}>
                        {restoreSlider >= 100 ? "UNLOCKED - READY" : "SLIDE TO UNLOCK RESTORE"}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={restoreSlider} 
                      onChange={(e) => setRestoreSlider(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                      disabled={isRestoring}
                    />
                  </div>

                  <button 
                    onClick={handleImportData} 
                    disabled={isRestoring || restoreSlider < 100}
                    className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${restoreSlider >= 100 ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {isRestoring ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                    {isRestoring ? "復旧中... ⏳" : "データ復旧を開始する ⚠️"}
                  </button>
                </div>
              </div>
            </section>
            
            {/* TERMINATE BUTTON (5-STEP AUTH) */}
            <section className="bg-red-950/5 border border-red-500/20 rounded-[3rem] p-10 mt-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
              
              <div className="flex flex-col items-center justify-center gap-6 relative z-10">
                <AlertTriangle size={64} className="text-red-600 animate-pulse" />
                <h3 className="text-4xl font-black text-red-600 uppercase italic tracking-tighter">Danger Zone (Level 5)</h3>
                <p className="text-red-400 font-bold max-w-md">サービスを完全停止するための五段階認証パネルです。<br/>手順に従ってロックを解除してください。</p>
                
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 w-full max-w-2xl space-y-8 mt-4">
                  
                  {/* STEP 0: MESSAGE */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-8 rounded-full flex items-center justify-center font-black bg-gray-200 text-gray-700">0</div>
                       <p className="font-bold text-gray-700">サ終理由（全ユーザーに表示されます）</p>
                    </div>
                    <textarea 
                      value={termReason} 
                      onChange={(e) => setTermReason(e.target.value)} 
                      placeholder="みんな、今までありがとう..." 
                      className="w-full bg-gray-100 border-2 border-transparent focus:border-red-500 rounded-xl p-3 font-bold text-sm outline-none resize-none h-20"
                    />
                  </div>

                  {/* STEP 1: CODE INPUT */}
                  <div className={`transition-all duration-300 ${isStep1Valid ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${isStep1Valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>1</div>
                       <p className="font-bold text-gray-700">終了コード入力</p>
                    </div>
                    <input 
                      type="text" 
                      value={termStep1} 
                      onChange={(e) => setTermStep1(e.target.value)} 
                      placeholder="コード: 37564" 
                      className="w-full bg-gray-100 border-2 border-transparent focus:border-red-500 rounded-xl p-3 font-mono text-center tracking-widest text-lg outline-none"
                      disabled={isStep1Valid}
                    />
                  </div>

                  {/* STEP 2: CHECKBOXES */}
                  <div className={`transition-all duration-300 ${!isStep1Valid ? 'opacity-30 pointer-events-none' : ''} ${isStep2Valid ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${isStep2Valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>2</div>
                       <p className="font-bold text-gray-700">最終確認</p>
                    </div>
                    <div className="space-y-2 text-left bg-gray-50 p-4 rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={termStep2.check1} onChange={(e) => setTermStep2({...termStep2, check1: e.target.checked})} className="w-5 h-5 accent-red-600" />
                        <span className="font-bold text-sm">全ユーザーデータの完全消去に同意する</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={termStep2.check2} onChange={(e) => setTermStep2({...termStep2, check2: e.target.checked})} className="w-5 h-5 accent-red-600" />
                        <span className="font-bold text-sm">返金対応は一切しないことを誓う</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={termStep2.check3} onChange={(e) => setTermStep2({...termStep2, check3: e.target.checked})} className="w-5 h-5 accent-red-600" />
                        <span className="font-bold text-sm">絶対に後悔しない</span>
                      </label>
                    </div>
                  </div>

                  {/* STEP 3 & 4: SLIDERS */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${!isStep2Valid ? 'opacity-30 pointer-events-none' : ''}`}>
                    {/* STEP 3: HORIZONTAL */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${isStep3Valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>3</div>
                         <p className="font-bold text-gray-700">右へスライド</p>
                      </div>
                      <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${isStep3Valid ? 'bg-red-500' : 'bg-gray-400'}`} style={{width: `${termStep3}%`}}></div>
                        <input type="range" min="0" max="100" value={termStep3} onChange={(e) => setTermStep3(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
                        <ArrowRight className={`absolute right-3 top-3 pointer-events-none ${isStep3Valid ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                    </div>

                    {/* STEP 4: VERTICAL */}
                    <div className={`${!isStep3Valid ? 'opacity-30 pointer-events-none' : ''}`}>
                      <div className="flex items-center gap-2 mb-2 justify-center">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${isStep4Valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>4</div>
                         <p className="font-bold text-gray-700">上へスライド</p>
                      </div>
                      <div className="relative w-12 h-32 bg-gray-200 rounded-full overflow-hidden mx-auto">
                        <div className={`w-full absolute bottom-0 transition-all ${isStep4Valid ? 'bg-red-500' : 'bg-gray-400'}`} style={{height: `${termStep4}%`}}></div>
                        <input 
                           type="range" min="0" max="100" value={termStep4} 
                           onChange={(e) => setTermStep4(parseInt(e.target.value))} 
                           className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize"
                           style={{transform: 'rotate(-90deg)', width: '128px', height: '48px', margin: '40px -40px'}} // Trick for vertical range
                        />
                        <ArrowUp className={`absolute top-3 left-3 pointer-events-none ${isStep4Valid ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  </div>

                  {/* STEP 5: BUTTON */}
                  <div className={`pt-4 ${!isAllValid ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-center gap-2 mb-4">
                       <div className="w-8 h-8 rounded-full flex items-center justify-center font-black bg-red-600 text-white animate-pulse">5</div>
                       <p className="font-black text-red-600 uppercase tracking-widest">FINAL STEP</p>
                    </div>
                    <button 
                      onClick={handleTerminateService}
                      disabled={!isAllValid}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-black px-12 py-6 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.8)] transition-all flex items-center justify-center gap-3 text-3xl uppercase italic tracking-tighter hover:scale-105"
                    >
                      <Power size={40} /> TERMINATE NOW
                    </button>
                  </div>
                  
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {view === 'login' && (
          <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border animate-in zoom-in-95 duration-300">
             <h2 className="text-4xl font-black text-center mb-12 tracking-tighter uppercase italic text-gray-800">Login</h2>
            <form onSubmit={handleLogin} className="space-y-8">
              <input type="text" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold" placeholder="Username" required />
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold" placeholder="Password" required />
              <button type="submit" className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all uppercase tracking-widest text-xl italic">Login Now 🔥</button>
            </form>
          </div>
        )}

        {view === 'signup' && (
          <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border animate-in zoom-in-95 duration-300">
             <h2 className="text-4xl font-black text-center mb-12 tracking-tighter uppercase italic text-gray-800">Sign Up</h2>
            <form onSubmit={handleSignup} className="space-y-8">
              <input type="text" value={signupForm.username} onChange={(e) => setSignupForm({...signupForm, username: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold" placeholder="Create Username" required />
              <input type="password" value={signupForm.password} onChange={(e) => setSignupForm({...signupForm, password: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold" placeholder="Set Password" required />
              <button type="submit" className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all uppercase tracking-widest text-xl italic">Create Account 🔥</button>
            </form>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#1a1a1a] rounded-[2.5rem] p-8 border border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.4)] text-white relative animate-in zoom-in-95">
             <div className="absolute -top-10 left-0 right-0 flex justify-center"><div className="bg-red-600 rounded-full p-4 border-4 border-[#1a1a1a]"><Trash2 size={32} className="text-white animate-bounce" /></div></div>
             <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24}/></button>
             
             <div className="mt-8 text-center space-y-4">
               <h3 className="text-2xl font-black italic tracking-tighter uppercase text-red-500">DELETE CONFIRMATION</h3>
               <p className="text-gray-400 font-bold text-sm">この操作は取り消せません。<br/>本当に削除してもよろしいですか？</p>
             </div>

             <div className="mt-8 space-y-4">
                <div className="relative h-14 bg-gray-800 rounded-full overflow-hidden select-none border border-gray-700">
                    <div 
                      className={`h-full transition-all duration-75 flex items-center justify-end pr-4 ${deleteSlider >= 100 ? 'bg-red-600' : 'bg-gray-700'}`} 
                      style={{width: `${deleteSlider}%`}}
                    >
                      {deleteSlider >= 100 && <Trash2 size={20} className="text-white animate-ping" />}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className={`font-black text-xs uppercase tracking-[0.2em] ${deleteSlider >= 100 ? 'text-white' : 'text-gray-500 mix-blend-plus-lighter'}`}>
                        {deleteSlider >= 100 ? "READY TO DELETE" : "SLIDE TO DELETE"}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={deleteSlider} 
                      onChange={(e) => setDeleteSlider(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                    />
                </div>
                
                <button 
                  onClick={executeDelete} 
                  disabled={deleteSlider < 100}
                  className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-tighter text-lg transition-all ${deleteSlider >= 100 ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 active:scale-95' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                >
                  DELETE NOW
                </button>
             </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (NEW) --- */}
      {showEditModal && editingGame && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
           <div className="w-full max-w-2xl bg-gray-900 rounded-[3rem] shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden border border-gray-700 animate-in zoom-in-95">
             <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-8 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3"><PenTool className="text-purple-500"/> Edit Project</h3>
                <button onClick={() => { setShowEditModal(false); setEditingGame(null); }} className="text-gray-400 hover:text-white"><X size={28}/></button>
             </div>
             <form onSubmit={handleUpdateGame} className="p-8 space-y-6">
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Project Title</label>
                   <input type="text" value={editingGame.title} onChange={(e) => setEditingGame({...editingGame, title: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-purple-500 outline-none transition-colors" placeholder="Enter title..." required />
                </div>
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Category</label>
                   <select value={editingGame.category} onChange={(e) => setEditingGame({...editingGame, category: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-purple-500 outline-none transition-colors appearance-none cursor-pointer"><option>アクション</option><option>サバイバル</option><option>格闘と戦闘</option></select>
                </div>
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Cover Image URL (New Look!)</label>
                   <div className="flex gap-4">
                     <div className="w-20 h-20 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex-shrink-0">
                        <img src={editingGame.img} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                     </div>
                     <input type="url" value={editingGame.img} onChange={(e) => setEditingGame({...editingGame, img: e.target.value})} className="flex-1 bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-purple-500 outline-none transition-colors" placeholder="https://..." required />
                   </div>
                </div>
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Project URL (Game Link)</label>
                   <input type="url" value={editingGame.url} onChange={(e) => setEditingGame({...editingGame, url: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-purple-500 outline-none transition-colors" placeholder="https://..." required />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-6 rounded-2xl shadow-lg transition-all uppercase italic text-xl tracking-tighter mt-4">Update Project 💾</button>
             </form>
           </div>
        </div>
      )}

      {/* --- MALL EDIT MODAL (NEW) --- */}
      {showEditMallModal && editingMallItem && (
         <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="bg-orange-500 p-6 text-white relative flex justify-between items-center">
                <h3 className="font-black uppercase italic tracking-tighter text-xl">商品設定の変更</h3>
                <button onClick={() => {setShowEditMallModal(false); setEditingMallItem(null);}}><X size={24}/></button>
             </div>
             <form onSubmit={handleUpdateMallItem} className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold text-gray-500 mb-1 block">販売価格 (P)</label>
                   <input type="number" value={editingMallItem.price} onChange={(e) => setEditingMallItem({...editingMallItem, price: e.target.value})} className="w-full bg-gray-50 rounded-xl p-3 font-bold outline-none border-2 border-transparent focus:border-orange-500" required />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 mb-1 block text-red-500">セール割引率 (%) <span className="text-[10px] text-gray-400 font-normal">0でオフ</span></label>
                   <input type="number" min="0" max="100" value={editingMallItem.discount || 0} onChange={(e) => setEditingMallItem({...editingMallItem, discount: e.target.value})} className="w-full bg-red-50 rounded-xl p-3 font-black text-red-600 outline-none border-2 border-transparent focus:border-red-500" required />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-orange-700 transition-all mt-2">更新する</button>
             </form>
           </div>
         </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           {/* ... (Premium Modal Content) ... */}
           <div className="w-full max-w-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-[3rem] shadow-[0_0_100px_rgba(234,179,8,0.3)] overflow-hidden border border-yellow-500/30 relative text-white animate-in zoom-in-95 duration-500">
             <button onClick={() => setShowPremiumModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white z-20"><X size={28} /></button>
             <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-yellow-500/20 to-transparent pointer-events-none"></div>
             <div className="p-12 text-center relative z-10">
               <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.5)] mb-8 animate-bounce"><Crown size={64} className="text-white drop-shadow-md" /></div>
               <h2 className="text-4xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200">POTATOX PREMIUM</h2>
               <p className="text-yellow-100/60 font-bold uppercase tracking-[0.3em] text-xs mb-10">The Ultimate Experience</p>
               <div className="space-y-4 mb-10 text-left bg-white/5 p-6 rounded-3xl border border-white/10">
                 <div className="flex items-center gap-3"><div className="p-2 bg-yellow-500/20 rounded-full"><Sparkles size={18} className="text-yellow-400" /></div><p className="font-bold text-sm">名前がゴールドに輝く！圧倒的優越感！</p></div>
                 <div className="flex items-center gap-3"><div className="p-2 bg-yellow-500/20 rounded-full"><Crown size={18} className="text-yellow-400" /></div><p className="font-bold text-sm">プロフィールに王冠バッジを表示！</p></div>
                 <div className="flex items-center gap-3"><div className="p-2 bg-yellow-500/20 rounded-full"><Zap size={18} className="text-yellow-400" /></div><p className="font-bold text-sm">お得でビッグでバーゲンな特典が盛りだくさん！</p></div>
               </div>
               <div className="text-center mb-6"><span className="text-5xl font-black text-white italic tracking-tighter">1,500</span><span className="text-xl text-yellow-500 font-bold ml-2">POTEX</span></div>
               <button onClick={handleJoinPremium} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-black py-6 rounded-2xl shadow-xl shadow-yellow-900/50 active:scale-95 transition-all text-xl italic tracking-tighter">プレミアムに加入する 🔥</button>
             </div>
           </div>
        </div>
      )}

      {selectedShopItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2B2D31] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700 animate-in zoom-in-95 text-white relative">
            <button onClick={() => setSelectedShopItem(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
            <div className="p-8 text-center">
              <p className="font-bold text-gray-300 mb-6">以下を買いますか？</p>
              <div className="w-32 h-32 bg-gray-800 rounded-2xl mx-auto mb-4 overflow-hidden border-2 border-gray-600"><img src={selectedShopItem.img} className="w-full h-full object-cover" /></div>
              <h3 className="text-2xl font-black italic tracking-tight mb-1">{selectedShopItem.title}</h3>
              <div className="flex items-center justify-center gap-2 mb-8 text-orange-400"><Coins size={20} fill="currentColor" /><span className="text-xl font-black">{Math.floor(selectedShopItem.price * (1 - (selectedShopItem.discount || 0) / 100))}</span></div>
              {profile?.potex >= Math.floor(selectedShopItem.price * (1 - (selectedShopItem.discount || 0) / 100)) ? (
                <button onClick={handlePurchase} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 transition-all mb-3 text-lg">購入する ({Math.floor(selectedShopItem.price * (1 - (selectedShopItem.discount || 0) / 100))} P)</button>
              ) : (
                <div className="space-y-3"><div className="bg-red-500/20 text-red-400 py-2 px-4 rounded-lg text-xs font-bold border border-red-500/50">資金が足りません (残高: {profile?.potex} P)</div><button onClick={() => {setSelectedShopItem(null); setShowPurchaseModal(true);}} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 transition-all text-lg">ポテックスを買う</button></div>
              )}
              <button onClick={() => setSelectedShopItem(null)} className="w-full text-gray-500 font-bold py-2 hover:text-white transition-colors">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATOR UPLOAD MODAL --- */}
      {showCreatorUploadModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
           <div className="w-full max-w-2xl bg-gray-900 rounded-[3rem] shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden border border-gray-700 animate-in zoom-in-95">
             <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3"><Rocket className="text-cyan-500"/> Publish Project</h3>
                <button onClick={() => setShowCreatorUploadModal(false)} className="text-gray-400 hover:text-white"><X size={28}/></button>
             </div>
             <form onSubmit={handleAddGame} className="p-8 space-y-6">
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Project Title</label>
                   <input type="text" value={newGame.title} onChange={(e) => setNewGame({...newGame, title: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="Enter title..." required />
                </div>
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Category</label>
                   <select value={newGame.category} onChange={(e) => setNewGame({...newGame, category: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors appearance-none cursor-pointer"><option>アクション</option><option>サバイバル</option><option>格闘と戦闘</option></select>
                </div>
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Cover Image URL</label>
                   <input type="url" value={newGame.img} onChange={(e) => setNewGame({...newGame, img: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="https://..." required />
                </div>
                <div>
                   <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 block">Project URL (Game Link)</label>
                   <input type="url" value={newGame.url} onChange={(e) => setNewGame({...newGame, url: e.target.value})} className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white font-bold focus:border-cyan-500 outline-none transition-colors" placeholder="https://..." required />
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-6 rounded-2xl shadow-lg transition-all uppercase italic text-xl tracking-tighter mt-4">Launch Project 🚀</button>
             </form>
           </div>
        </div>
      )}

      {showAddItemModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           {/* ... (Mall Item Modal) ... */}
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-orange-600 p-10 text-white relative"><h3 className="text-3xl font-black uppercase italic tracking-tighter">New Mall Item</h3><button onClick={() => setShowAddItemModal(false)} className="absolute top-10 right-10 text-white"><X size={32} /></button></div>
            <form onSubmit={handleAddItem} className="p-10 space-y-5 bg-white">
              <input type="text" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-orange-500" placeholder="Item Name (e.g. God Mode Code)" required />
              <div className="grid grid-cols-2 gap-4"><input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-orange-500" placeholder="Price (P)" required /><input type="text" value={newItem.secret} onChange={(e) => setNewItem({...newItem, secret: e.target.value})} className="w-full bg-orange-50 rounded-2xl p-5 font-black text-orange-600 outline-none border-2 border-transparent focus:border-orange-500" placeholder="Secret Code (Cheat)" required /></div>
              <input type="url" value={newItem.img} onChange={(e) => setNewItem({...newItem, img: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-orange-500" placeholder="Image URL" required />
              <textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-orange-500 h-32 resize-none" placeholder="Description" required />
              <button type="submit" className="w-full bg-orange-600 text-white font-black py-6 rounded-2xl shadow-xl hover:bg-orange-700 active:scale-95 transition-all uppercase italic text-2xl tracking-tighter">モールに出品！💰 (手数料5%)</button>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
         <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           {/* ... (Admin Asset Modal) ... */}
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-blue-600 p-10 text-white relative"><h3 className="text-3xl font-black uppercase italic tracking-tighter">Publish New Asset</h3><button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-white hover:scale-110 transition-transform"><X size={32} /></button></div>
            <form onSubmit={handleAddGame} className="p-10 space-y-5 bg-white">
              <input type="text" value={newGame.title} onChange={(e) => setNewGame({...newGame, title: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all" placeholder="Game Title" required />
              <input type="url" value={newGame.url} onChange={(e) => setNewGame({...newGame, url: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all" placeholder="Game Website URL" required />
              <input type="url" value={newGame.img} onChange={(e) => setNewGame({...newGame, img: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all" placeholder="Cover Image URL" required />
              <select value={newGame.category} onChange={(e) => setNewGame({...newGame, category: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 font-black outline-none border-2 border-transparent focus:border-blue-500 appearance-none cursor-pointer"><option>アクション</option><option>サバイバル</option><option>格闘と戦闘</option></select>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all uppercase italic text-2xl tracking-tighter">オンライン配信を開始！🚀</button>
            </form>
          </div>
        </div>
      )}

      {showPurchaseModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
           {/* ... (Potex Modal) ... */}
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-orange-500 p-10 text-white relative"><h3 className="text-4xl font-black italic tracking-tighter uppercase drop-shadow-2xl">Get Potex 🔥</h3><button onClick={() => setShowPurchaseModal(false)} className="absolute top-10 right-10 text-white hover:scale-110 transition-transform"><X size={32} /></button></div>
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-3 gap-4">{[100, 500, 1000, 5000, 10000, 50000].map(amt => (<button key={amt} onClick={() => setPurchaseAmount(amt)} className={`py-5 rounded-2xl font-black text-sm border-4 transition-all active:scale-90 ${purchaseAmount === amt ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>{amt.toLocaleString()}P</button>))}</div>
              <button onClick={requestPotex} className="w-full bg-orange-500 text-white font-black py-7 rounded-3xl shadow-2xl shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all text-2xl italic tracking-tighter">申請を送信する</button>
            </div>
          </div>
        </div>
      )}

      {selectedUserProfile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 relative">
            <button onClick={() => setSelectedUserProfile(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 z-10"><X size={24} /></button>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-24 relative"></div>
            <div className="px-8 pb-8 relative">
               <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-xl mx-auto -mt-12 overflow-hidden flex items-center justify-center relative z-10 bg-gray-50">
                  {selectedUserProfile.profileImg ? (
                     <img src={selectedUserProfile.profileImg} className="w-full h-full object-cover" />
                  ) : (
                     <User size={48} className="text-gray-300" />
                  )}
               </div>
               <div className="text-center mt-4 mb-6">
                  <h2 className="text-2xl font-black italic tracking-tighter text-gray-800 flex items-center justify-center gap-2">
                    {selectedUserProfile.displayName || selectedUserProfile.username}
                    {renderBadges(selectedUserProfile)}
                  </h2>
                  <p className="text-gray-400 font-bold text-sm">@{selectedUserProfile.username}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${isUserOnline(selectedUserProfile.lastActive) ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isUserOnline(selectedUserProfile.lastActive) ? '🟢 ONLINE' : '🔴 OFFLINE'}
                     </span>
                  </div>
               </div>
               {selectedUserProfile.bio && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                     <p className="text-sm font-bold text-gray-700 whitespace-pre-wrap">{selectedUserProfile.bio}</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

          
        
