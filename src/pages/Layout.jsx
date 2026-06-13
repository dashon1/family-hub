import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Calendar, ShoppingCart, CheckSquare, Home, Users, Menu, X,
  LayoutDashboard, FileText, UtensilsCrossed, Camera, Settings,
  Building2, HelpCircle, Mail, Heart, Bell, DollarSign, Activity
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Family Calendar", url: createPageUrl("FamilyCalendar"), icon: Calendar },
  { title: "You're Invited!", url: createPageUrl("RSVP"), icon: Mail, badge: "invites" },
  { title: "Notifications", url: createPageUrl("Notifications"), icon: Bell, badge: "notifications" },
  { title: "Grocery Lists", url: createPageUrl("GroceryLists"), icon: ShoppingCart },
  { title: "Family Tasks", url: createPageUrl("FamilyTasks"), icon: CheckSquare },
  { title: "Meal Planner", url: createPageUrl("MealPlanner"), icon: UtensilsCrossed },
  { title: "Budget Tracker", url: createPageUrl("BudgetTracker"), icon: DollarSign },
  { title: "Family Notes", url: createPageUrl("FamilyNotes"), icon: FileText },
  { title: "Family Photos", url: createPageUrl("FamilyPhotos"), icon: Camera },
  { title: "Activity Feed", url: createPageUrl("ActivityFeed"), icon: Activity },
  { title: "Households", url: createPageUrl("HouseholdManagement"), icon: Users },
  { title: "My Connections", url: createPageUrl("Connections"), icon: Heart },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
  { title: "Help Center", url: createPageUrl("HelpCenter"), icon: HelpCircle },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [householdName, setHouseholdName] = useState(null);
  const [invites, setInvites] = useState(0);
  const [notifs, setNotifs] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
        if (u.household_id) {
          const list = await base44.entities.Household.list();
          const h = list.find(x => x.id === u.household_id);
          if (h) setHouseholdName(h.name);
        }
        try {
          const inv = await base44.entities.EventInvite.list();
          setInvites(inv.filter(i => i.invitee_email === u.email && i.status === "pending").length);
        } catch {}
        try {
          const ns = await base44.entities.Notification.list();
          setNotifs(ns.filter(n => !n.is_read).length);
        } catch {}
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const isActive = (url) => location.pathname === url;

  const NavLinks = () => (
    <nav style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
      <div style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", padding: "8px 12px" }}>Navigation</div>
      {navItems.map(item => {
        const Icon = item.icon;
        const count = item.badge === "invites" ? invites : item.badge === "notifications" ? notifs : 0;
        const active = isActive(item.url);
        return (
          <Link
            key={item.title}
            to={item.url}
            onClick={() => setOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "12px", marginBottom: "4px",
              fontWeight: 500, textDecoration: "none", transition: "background 0.15s",
              background: active ? "#ffedd5" : "transparent",
              color: active ? "#c2410c" : "#374151",
            }}
          >
            <Icon size={20} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{item.title}</span>
            {count > 0 && (
              <span style={{
                background: item.badge === "invites" ? "#ef4444" : "#f97316",
                color: "#fff", borderRadius: "9999px", fontSize: "11px",
                padding: "1px 7px", fontWeight: 700
              }}>{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const Footer = () => (
    <div style={{ borderTop: "1px solid #fed7aa", padding: "16px" }}>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #f97316, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0
          }}>
            {(user.full_name || "U")[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.full_name}</div>
            <div style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );

  const sidebarStyle = {
    display: "flex", flexDirection: "column", width: 256,
    background: "#fff", borderRight: "1px solid #fed7aa", height: "100%"
  };

  const Header = () => (
    <div style={{ borderBottom: "1px solid #fed7aa", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "10px",
          background: "linear-gradient(135deg, #f97316, #ec4899)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Home size={22} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#111827" }}>FamilyHub</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Stay organized together</div>
        </div>
      </div>
      {householdName && (
        <div style={{ marginTop: 12, padding: "6px 10px", background: "#fff7ed", borderRadius: 8, fontSize: 12 }}>
          <span style={{ color: "#c2410c", fontWeight: 600 }}>{householdName}</span>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #fff7ed, #fdf2f8)" }}>
      {/* Desktop sidebar */}
      <aside style={{ ...sidebarStyle, display: "flex", flexShrink: 0 }} className="hidden md:flex">
        <Header />
        <NavLinks />
        <Footer />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      {/* Mobile sidebar */}
      <aside style={{
        ...sidebarStyle, position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.2s"
      }} className="md:hidden">
        <button
          onClick={() => setOpen(false)}
          style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8 }}
        >
          <X size={20} color="#6b7280" />
        </button>
        <Header />
        <NavLinks />
        <Footer />
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile top bar */}
        <header style={{ background: "rgba(255,255,255,0.8)", borderBottom: "1px solid #fed7aa", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }} className="md:hidden">
          <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8 }}>
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>FamilyHub</span>
        </header>
        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
