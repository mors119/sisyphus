import { PATHS } from '@/app/router/paths.constants';
import { UserRoles } from '@/features/auth/auth.types';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  SquarePen,
  LucideProps,
  CircleGauge,
  ClipboardPlus,
  Tag,
  Folder,
  CircleAlert,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface SidenavItem {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  roles: UserRoles[];
}

// Sidenav Menu
export const SIDENAV_ITEMS: SidenavItem[] = [
  {
    title: 'item.home',
    url: PATHS.HOME,
    icon: Home,
    roles: ['ALL', 'USER', 'ADMIN'],
  },
  {
    title: 'item.quick',
    url: '/' + PATHS.QUICKEDIT,
    icon: LayoutDashboard,
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'item.add',
    url: '/' + PATHS.ADD,
    icon: ClipboardPlus,
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'item.view',
    url: '/' + PATHS.VIEW,
    icon: BookOpen,
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'item.category',
    url: '/' + PATHS.CATEGORY,
    icon: Folder,
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'item.tag',
    url: '/' + PATHS.TAG,
    icon: Tag,
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'item.require',
    url: '/' + PATHS.REQUIRE,
    icon: SquarePen,
    roles: ['ADMIN'],
  },
  {
    title: 'item.notice',
    url: '/' + PATHS.NOTICE,
    icon: CircleAlert,
    roles: ['ADMIN'],
  },
  {
    title: 'item.dashboard',
    url: '/' + PATHS.DASHBOARD,
    icon: CircleGauge,
    roles: ['ADMIN'], // 관리자 전용
  },
];
// TODO: Require(user) notice(all, user) 권한 주기
