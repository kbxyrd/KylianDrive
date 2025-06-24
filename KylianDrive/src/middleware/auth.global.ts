export default defineNuxtRouteMiddleware((to) => {
    const session = useCookie('session')
    if (!session.value && to.path === '/me') {
        return navigateTo('/login')
    }
})
