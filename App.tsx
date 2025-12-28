
import React, { useState, useEffect } from 'react';
import { User, Company, Task, UserStatus, FinanceEntry, UserRole, TaskStatus } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Users from './pages/Users';
import TaskModal from './components/TaskModal';
import UserModal from './components/UserModal';
import { MOCK_TASKS, MOCK_USERS, MOCK_FINANCE_ENTRIES } from './constants';

type AppState = 'login' | 'onboarding' | 'dashboard' | 'tasks' | 'users' | 'analytics' | 'settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('dashboard');
  const [user, setUser] = useState<User | null>(MOCK_USERS[0]);
  const [company, setCompany] = useState<Company | null>({ 
    name: 'Impulz Innovations', 
    industry: 'SaaS', 
    size: '1-10' 
  });
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(MOCK_FINANCE_ENTRIES);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  
  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          setSession(session);
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error("Session init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        fetchUserProfile(session.user.id);
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  // Real-time Data Sync
  useEffect(() => {
    const fetchInitialData = async () => {
      const usingSupabase = isSupabaseConfigured && supabase && session;

      if (!usingSupabase) {
        setTasks(MOCK_TASKS);
        setUsersList(MOCK_USERS);
        // Financial entries remain mocked for this demo if no DB
        return;
      }

      try {
        const { data: tasksData, error: taskError } = await supabase!.from('tasks').select('*').order('created_at', { ascending: false });
        if (taskError) throw taskError;
        if (tasksData) setTasks(tasksData);

        const { data: usersData, error: userError } = await supabase!.from('profiles').select('*');
        if (userError) throw userError;
        if (usersData) setUsersList(usersData);
      } catch (err) {
        console.error("Initial data fetch failed, using mocks:", err);
        setTasks(MOCK_TASKS);
        setUsersList(MOCK_USERS);
      }
    };

    fetchInitialData();

    if (!supabase || !session) return;

    const tasksChannel = supabase.channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.eventType === 'INSERT') setTasks(prev => [payload.new as Task, ...prev]);
        if (payload.eventType === 'UPDATE') setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new as Task : t));
        if (payload.eventType === 'DELETE') setTasks(prev => prev.filter(t => t.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [session]);

  const handleLogout = async () => {
    if (supabase && session) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setCurrentPage('login');
  };

  const handleSaveFinanceEntry = (entry: Omit<FinanceEntry, 'id'> & { id?: string }) => {
    if (entry.id) {
      setFinanceEntries(prev => prev.map(e => e.id === entry.id ? { ...e, ...entry } as FinanceEntry : e));
    } else {
      const entryWithId: FinanceEntry = {
        ...entry,
        id: Math.random().toString(36).substr(2, 9)
      } as FinanceEntry;
      setFinanceEntries(prev => [...prev, entryWithId]);
    }
  };

  const handleDeleteFinanceEntry = (id: string) => {
    setFinanceEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt'> & { id?: string }) => {
    if (supabase && session) {
      if (taskData.id) {
        await supabase.from('tasks').update(taskData).eq('id', taskData.id);
      } else {
        await supabase.from('tasks').insert([{ ...taskData, created_by: user?.id }]);
      }
    } else {
      if (taskData.id) {
        setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t));
      } else {
        const newTask = { ...taskData, id: Math.random().toString(), createdAt: new Date().toISOString() } as Task;
        setTasks(prev => [newTask, ...prev]);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (supabase && session) {
      await supabase.from('tasks').delete().eq('id', id);
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateTaskStatus = async (id: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const { createdAt, ...taskWithoutCreatedAt } = task;
      await handleSaveTask({ ...taskWithoutCreatedAt, status });
    }
  };

  const handleUpdateUserStatus = async (id: string, status: UserStatus) => {
    if (supabase && session) {
      await supabase.from('profiles').update({ status }).eq('id', id);
    } else {
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, status } as User : u));
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id'> & { id?: string }) => {
    if (supabase && session) {
      if (userData.id) {
        await supabase.from('profiles').update(userData).eq('id', userData.id);
      }
    } else {
      if (userData.id) {
        setUsersList(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } as User : u));
      } else {
        const newUser = { ...userData, id: Math.random().toString() } as User;
        setUsersList(prev => [...prev, newUser]);
      }
    }
  };

  if (loading && isSupabaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Initializing Impulz Desk...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'login' || !user) {
    return <Login onLogin={(u) => { 
        const loginUser = u || MOCK_USERS[0];
        setUser(loginUser);
        setCurrentPage('dashboard');
    }} />;
  }

  if (currentPage === 'onboarding') {
    return <Onboarding user={user!} onComplete={(c) => { setCompany(c); setCurrentPage('dashboard'); }} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard tasks={tasks} financeEntries={financeEntries} onSaveFinanceEntry={handleSaveFinanceEntry} onCreateTask={() => setTaskModalOpen(true)} />;
      case 'tasks': 
        return (
          <Tasks 
            tasks={tasks} 
            onEditTask={(t) => { setEditingTask(t); setTaskModalOpen(true); }}
            onCreateTask={() => { setEditingTask(null); setTaskModalOpen(true); }}
            onUpdateStatus={handleUpdateTaskStatus}
          />
        );
      case 'users':
        return (
          <Users
            users={usersList}
            onAddUser={() => { setEditingUser(null); setUserModalOpen(true); }}
            onEditUser={(u) => { setEditingUser(u); setUserModalOpen(true); }}
            onUpdateStatus={handleUpdateUserStatus}
          />
        );
      case 'analytics':
        return <Analytics entries={financeEntries} onSaveEntry={handleSaveFinanceEntry} onDeleteEntry={handleDeleteFinanceEntry} />;
      case 'settings':
        return <Settings user={user!} onUpdateUser={(u) => handleSaveUser({ ...user!, ...u })} />;
      default:
        return <Dashboard tasks={tasks} financeEntries={financeEntries} onSaveFinanceEntry={handleSaveFinanceEntry} onCreateTask={() => setTaskModalOpen(true)} />;
    }
  };

  return (
    <Layout 
      user={user!} 
      company={company!} 
      activePage={currentPage} 
      onNavigate={(page) => setCurrentPage(page)} 
      onLogout={handleLogout}
    >
      {renderPage()}
      
      <TaskModal 
        isOpen={taskModalOpen} 
        onClose={() => setTaskModalOpen(false)} 
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        editingTask={editingTask}
        currentUserRole={user?.role || 'Staff'}
      />

      <UserModal 
        isOpen={userModalOpen} 
        onClose={() => setUserModalOpen(false)} 
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </Layout>
  );
};

export default App;
