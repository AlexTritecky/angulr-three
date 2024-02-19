import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'basic',
    loadChildren: () =>
      import('./features/basic/basic.module').then((m) => m.BasicModule),
  },
];
