import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'basic',
    loadChildren: () =>
      import('./features/basic/basic.module').then((m) => m.BasicModule),
  },
  {
    path: 'classic-techniques',
    loadChildren: () =>
      import('./features/classic-techniques/classic-techniques.module').then(
        (m) => m.ClassicTechniquesModule
      ),
  },

  {
    path: '',
    redirectTo: '/basic',
    pathMatch: 'full',
  },
];
