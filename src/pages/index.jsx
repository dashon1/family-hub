import Layout from "./Layout.jsx";

import FamilyCalendar from "./FamilyCalendar";

import GroceryLists from "./GroceryLists";

import FamilyTasks from "./FamilyTasks";

import Dashboard from "./Dashboard";

import MealPlanner from "./MealPlanner";

import FamilyNotes from "./FamilyNotes";

import FamilyPhotos from "./FamilyPhotos";

import Settings from "./Settings";

import HouseholdManagement from "./HouseholdManagement";

import HelpCenter from "./HelpCenter";

import Admin from "./Admin";

import Landing from "./Landing";

import RSVP from "./RSVP";

import Connections from "./Connections";

import Notifications from "./Notifications";

import BudgetTracker from "./BudgetTracker";

import ActivityFeed from "./ActivityFeed";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Login from './Login';

const PAGES = {
    
    FamilyCalendar: FamilyCalendar,
    
    GroceryLists: GroceryLists,
    
    FamilyTasks: FamilyTasks,
    
    Dashboard: Dashboard,
    
    MealPlanner: MealPlanner,
    
    FamilyNotes: FamilyNotes,
    
    FamilyPhotos: FamilyPhotos,
    
    Settings: Settings,
    
    HouseholdManagement: HouseholdManagement,
    
    HelpCenter: HelpCenter,
    
    Admin: Admin,
    
    Landing: Landing,
    
    RSVP: RSVP,
    
    Connections: Connections,
    
    Notifications: Notifications,
    
    BudgetTracker: BudgetTracker,
    
    ActivityFeed: ActivityFeed,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    if (/\/login$/i.test(location.pathname)) {
        return <Routes><Route path="/login" element={<Login />} /><Route path="/Login" element={<Login />} /></Routes>;
    }

    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<FamilyCalendar />} />
                
                
                <Route path="/FamilyCalendar" element={<FamilyCalendar />} />
                
                <Route path="/GroceryLists" element={<GroceryLists />} />
                
                <Route path="/FamilyTasks" element={<FamilyTasks />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/MealPlanner" element={<MealPlanner />} />
                
                <Route path="/FamilyNotes" element={<FamilyNotes />} />
                
                <Route path="/FamilyPhotos" element={<FamilyPhotos />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/HouseholdManagement" element={<HouseholdManagement />} />
                
                <Route path="/HelpCenter" element={<HelpCenter />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/RSVP" element={<RSVP />} />
                
                <Route path="/Connections" element={<Connections />} />
                
                <Route path="/Notifications" element={<Notifications />} />
                
                <Route path="/BudgetTracker" element={<BudgetTracker />} />
                
                <Route path="/ActivityFeed" element={<ActivityFeed />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}