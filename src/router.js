import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('./views/Index'),
        meta: {
            title: '网易云音乐'
        },
    },
    {
        path: '/home/top',
        name: 'home-top',
        component: () => import('./views/Home/Top'),
        meta: {
            title: '排行榜 - 网易云音乐'
        },
    },
    {
        path: '/home/transceiver',
        name: 'home-transceiver',
        component: () => import('./views/Home/Transceiver'),
        meta: {
            title: '电台 - 网易云音乐'
        },
    },
    {
        path: '/home/mv',
        name: 'home-mv',
        component: () => import('./views/Home/Mv'),
        meta: {
            title: 'MV - 网易云音乐'
        },
    },
    {
        path: '/home/singers',
        name: 'home-singers',
        component: () => import('./views/Home/Singers'),
        meta: {
            title: '歌手 - 网易云音乐'
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./views/Login.vue'),
        meta: {
            title: '登录 - 网易云音乐'
        },
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('./views/About.vue'),
        meta: {
            title: '关于 - 网易云音乐'
        },
    },
    {
        path: '/song',
        name: 'song',
        component: () => import('./components/SongPlayer.vue'),
        meta: {
            title: '音乐 - 网易云音乐'
        },
    },
    {
        path: '/mv',
        name: 'mv',
        component: () => import('./components/MvPlayer.vue'),
        meta: {
            title: 'MV - 网易云音乐'
        },
    },
    {
        path: '/playlist',
        name: 'playlist',
        component: () => import('./components/Playlist/Index.vue'),
        meta: {
            title: '歌单 - 网易云音乐'
        },
    },
    {
        path: '/user/home/:id',
        name: 'user-home',
        component: () => import('./components/User/Index.vue'),
        meta: {
            title: '用户 - 网易云音乐'
        },
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('./components/Search/Index.vue'),
        meta: {
            title: '搜索 - 网易云音乐'
        },
    },
    {
        path: '/message',
        name: 'message',
        component: () => import('./components/Message/Index.vue'),
        meta: {
            title: '消息 - 网易云音乐'
        },
        redirect: '/message/private',
        children: [
            {
                path: 'private',
                name: 'message-private',
                component: () => import('./components/Message/Private.vue'),
                meta: {
                    title: '私信 - 消息 - 网易云音乐'
                },
            },
            {
                path: 'comments',
                name: 'message-comments',
                component: () => import('./components/Message/Comments.vue'),
                meta: {
                    title: '评论 - 消息 - 网易云音乐'
                },
            },
            {
                path: 'forwards',
                name: 'message-forwards',
                component: () => import('./components/Message/Forwards.vue'),
                meta: {
                    title: '@我 - 消息 - 网易云音乐'
                },
            },
            {
                path: 'notices',
                name: 'message-notices',
                component: () => import('./components/Message/Notices.vue'),
                meta: {
                    title: '通知 - 消息 - 网易云音乐'
                },
            },

        ]
    },
    {
        path: '/chat',
        name: 'message-chat',
        component: () => import('./components/Message/Chat.vue'),
        meta: {
            title: '聊天 - 网易云音乐'
        },
    },
    {
        path: '/404',
        name: 'error-404',
        component: () => import('./views/Error/404.vue'),
        meta: {
            title: '404NotFound - 网易云音乐'
        },
        hidden: true

    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
];

const router = new VueRouter({
    // mode: 'history',
    routes: routes,
    scrollBehavior(to, form, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});


router.beforeEach((to, from, next) => {

    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    const isLogin = window.localStorage.getItem('cookie');

    if (!isLogin && to.path != '/login') {
        next({
            path: '/login'
        })
    } else if (isLogin && to.path == '/login') {

        next({
            path: '/'
        })
    }

    if (isLogin) router.app.$options.store.state.cookie = window.localStorage.getItem('cookie');


    next();
})


export default router