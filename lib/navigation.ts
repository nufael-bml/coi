// lib/navigation.ts

import {
  LayoutDashboard,
  BarChart,
  Users,
  Shield,
  Settings,
  Bell,
  CreditCard,
  Key,
  Database,
  Boxes,
  FileText,
  FilePlus,
  Clock,
  ShieldCheck,
  Code,
  TestTube,
  UserCheck,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bookmark,
  GitBranch,
  Link2,
  FileBox,
  TrendingUp,
  Mail,
  Scale,
  Briefcase,
  Target,
  Smile,
  GitPullRequest,
  Workflow,
  Bot,
  ScrollText,
  LockKeyhole,
  Wrench,
  Download,
  History,
  Zap,
  WalletCards,
  IdCard,
  FlaskConical,
  RectangleHorizontal,
  SquareDashedMousePointer
} from 'lucide-react';
import type { NavGroup } from '@/types/layout';

export const navigationItems: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
      {
        title: 'Group1',
        url: '/prefix',
        icon: WalletCards,
        items: [
          // { title: "All BRDs", url: "/BRDCR/all", icon: FileText },
          {
            title: 'Page1',
            url: '/404',
            icon: RectangleHorizontal,
          },
          {
            title: 'Page2',
            url: '/404',
            icon: SquareDashedMousePointer,
          }
        ],
      },
      {
        title: 'Group2',
        url: '/prefix2',
        icon: FlaskConical,
        items: [
          {
            title: 'Page1',
            url: '/404',
            icon: CreditCard,
          }
        ]
      }
    ],
  },
];
