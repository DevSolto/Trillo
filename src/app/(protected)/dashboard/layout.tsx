import { AppSidebar } from '@/components/sideBar/AppSidebar';
import { navMain, teams, user } from '@/config/navigation';
import { DynamicBreadcrumb } from '@/components/DynamicBreadcrumb';
import { Separator } from '@/components/ui/Separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/Sidebar';
import { getMe } from '@/services/usuarios/users';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getMe();
  return (
    <SidebarProvider>
      <AppSidebar items={navMain} teams={teams} user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-white flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
