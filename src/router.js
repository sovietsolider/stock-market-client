import { createRouter, createWebHashHistory } from 'vue-router';
import loginService from "./services/loginService";
const routes = [
    { path: '/admin', name: 'admin', component: () => import('./components/Admin') },
    { path: '/exchange', name: 'Exchange', component: () => import('./components/Exchange') },
    { path: '/login', name: 'Login', component: () => import('./components/Login') }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to) => {
    console.log(loginService.methods.isLoggedIn())
    if(!loginService.methods.isLoggedIn() && to.name !== "Login") {
        console.log("INSIDE IF")
        return '/login'
    }
    return true

})

export default router
