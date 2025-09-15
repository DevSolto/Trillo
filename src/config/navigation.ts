export type NavigationIcon =
  | 'LayoutDashboard'
  | 'Building2'
  | 'ListTodo'
  | 'Users2';

export type NavigationTeamLogo =
  | 'GalleryVerticalEnd'
  | 'AudioWaveform'
  | 'Command';

export type NavigationItem = {
  title: string;
  url: string;
  icon?: NavigationIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

export type NavigationTeam = {
  name: string;
  logo: NavigationTeamLogo;
  plan: string;
};

export type NavigationUser = {
  name: string;
  email: string;
  avatar: string;
};

export const user = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/next.svg',
} satisfies NavigationUser;

export const teams = [
  {
    name: 'Acme Inc',
    logo: 'GalleryVerticalEnd',
    plan: 'Enterprise',
  },
  {
    name: 'Acme Corp.',
    logo: 'AudioWaveform',
    plan: 'Startup',
  },
  {
    name: 'Evil Corp.',
    logo: 'Command',
    plan: 'Free',
  },
] satisfies NavigationTeam[];

export const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Associações',
    url: '/dashboard/associacoes',
    icon: 'Building2',
  },
  {
    title: 'Tarefas',
    url: '/dashboard/tarefas',
    icon: 'ListTodo',
  },
  {
    title: 'Usuários',
    url: '/dashboard/usuarios',
    icon: 'Users2',
  },
] satisfies NavigationItem[];
