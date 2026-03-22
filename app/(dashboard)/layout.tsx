import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { getCurrentUser, requireAuth } from '@/lib/actions/auth';
import { navigationItems } from '@/lib/navigation';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth();
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get('sidebar_state')?.value;
  const defaultOpen = sidebarState !== 'false';

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': '15rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar
        // navItems={navigationItems}
        user={user}
        appName='CardDisplay'
        variant='floating' // 'sidebar' | 'inset' | 'floating'
        collapsible='icon'
      />
      <SidebarInset>
        <AppHeader />
        <div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:pr-8 min-w-0 overflow-hidden'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
