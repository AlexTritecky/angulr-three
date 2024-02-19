export interface NavLink {
  path: string;
  label: string;
}
export const NAV_LINKS: NavLink[] = [
  { path: '', label: 'Home'},
  { path: '/basic', label: 'Basic' },
  { path: '/classic-techniques', label: 'Classic Techniques' },
  { path: '/advanced-techniques', label: 'Advanced Techniques' },
  { path: '/shaders', label: 'Shaders' },
  { path: '/extra', label: 'Extra' },
  { path: '/portal-scene', label: 'Portal Scene' },
  { path: '/angular-three-fiber', label: 'Angular Three Fiber' },
];
