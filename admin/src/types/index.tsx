import { Icons } from '@/components/ui/icons';

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export interface PieChartProps {
  name: string;
  date: string;
  data: {
    emotion: string;
    percentage: number;
    color: string;
  }[]; 
}

export interface RestrictUserProps {
  type: "WARN_CHILD" | "INFORM_PARENT_AND_BLOCK";
  email: string;
  child_name: string;
  parent_email?: string;
  id: string; 
}

export type ModelTypeProps = "warn" | "block" | "unblock";

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
