// Stubbed out — shadcn Sidebar removed to prevent @radix-ui/react-slot
// from crashing Base44's module evaluator (i.hasOwnProperty is not a function).
// Layout.jsx now uses a plain div-based sidebar instead.
import React from "react";

export const SidebarProvider = ({ children }) => React.createElement(React.Fragment, null, children);
export const Sidebar = ({ children, className }) => React.createElement("div", { className }, children);
export const SidebarContent = ({ children, className }) => React.createElement("div", { className }, children);
export const SidebarHeader = ({ children, className }) => React.createElement("div", { className }, children);
export const SidebarFooter = ({ children, className }) => React.createElement("div", { className }, children);
export const SidebarGroup = ({ children }) => React.createElement(React.Fragment, null, children);
export const SidebarGroupContent = ({ children }) => React.createElement(React.Fragment, null, children);
export const SidebarGroupLabel = ({ children, className }) => React.createElement("div", { className }, children);
export const SidebarMenu = ({ children }) => React.createElement("ul", null, children);
export const SidebarMenuItem = ({ children }) => React.createElement("li", null, children);
export const SidebarMenuButton = ({ children, className }) => React.createElement("div", { className }, children);
export const SidebarTrigger = ({ children, className }) => React.createElement("button", { className }, children);
export const SidebarSeparator = () => React.createElement("hr", null);
export const SidebarInset = ({ children }) => React.createElement("div", null, children);
export const SidebarInput = (props) => React.createElement("input", props);
export const SidebarRail = () => null;
export const useSidebar = () => ({ open: true, setOpen: () => {}, isMobile: false });
