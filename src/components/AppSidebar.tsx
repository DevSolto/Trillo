'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Building2,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  ListTodo,
  Users2,
  type LucideIcon,
} from 'lucide-react';

import type {
  NavigationItem,
  NavigationTeam,
  NavigationUser,
} from '@/config/navigation';
import { NavMain } from '@/components/NavMain';
import { NavUser } from '@/components/NavUser';
import { TeamSwitcher } from '@/components/TeamSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/Sidebar';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  items: NavigationItem[];
  user: NavigationUser;
  teams?: NavigationTeam[];
};

type NavigationIconName = NonNullable<NavigationItem['icon']>;

const navigationIcons: Record<NavigationIconName, LucideIcon> = {
  LayoutDashboard,
  Building2,
  ListTodo,
  Users2,
};

const teamLogos: Record<NavigationTeam['logo'], LucideIcon> = {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
};

export function AppSidebar({ items, user, teams, ...props }: AppSidebarProps) {
  const sidebarItems = React.useMemo<
    React.ComponentProps<typeof NavMain>['items']
  >(
    () =>
      items.map((item) => ({
        ...item,
        icon: item.icon ? navigationIcons[item.icon] : undefined,
      })),
    [items]
  );

  const sidebarTeams = React.useMemo<
    React.ComponentProps<typeof TeamSwitcher>['teams']
  >(
    () =>
      (teams ?? []).map((team) => ({
        ...team,
        logo: teamLogos[team.logo],
      })),
    [teams]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {sidebarTeams.length > 0 ? (
          <TeamSwitcher teams={sidebarTeams} />
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Econtese</h1>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
