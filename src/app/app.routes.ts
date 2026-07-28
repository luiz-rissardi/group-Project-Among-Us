import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Users } from './pages/users/users';
import { Master } from './pages/master/master';
import { Show } from './pages/show/show';

export const routes: Routes = [
    {
        path:"home",
        component:Home 
    },
    {
        path:"show",
        component:Show 
    },
    {
        path:"home",
        component:Home 
    },
    {
        path:"users",
        component:Users 
    },
    {
        path:"master",
        component:Master 
    },
    {
        path:"**",
        component:Home
    }
];
