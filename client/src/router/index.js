import AddItem from '@/views/AddItem.vue';
import Dashbord from '@/views/Dashbord.vue';
import DynamicObj from '@/views/DynamicObj.vue';
import Leads from '@/views/Leads.vue';
import Objects from '@/views/Objects.vue';
import UpdateItem from '@/views/UpdateItem.vue';
import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashbord
        },
        {
            path: '/leads',
            name: 'leads',
            component: Leads
        },
        {
            path: '/objects',
            name: 'objects' ,
            component: Objects
        },
        {
            path: '/view/:tableName',
            name: 'view',
            component: DynamicObj
        },
        {
            path: '/add/:tableName',
            name: 'add',
            component: AddItem
        },
        {
            path: '/update/:tableName/:id',
            name: 'update',
            component: UpdateItem
        },
    ]
});

export default router;