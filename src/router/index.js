import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuizView from '../views/QuizView.vue';
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/quiz',
        name: 'QuizView',
        component: QuizView,
        props: route => ({
            userName: route.query.userName,
            SelectRandom: route.query.SelectRandom,
            selectType: route.query.selectType,
            selectCount: route.query.selectCount
        })
        //홈뷰가 강의실  통신 쿼리 안에 있는 유저네임을 밖으로 쏴서(쏘는 애) 5층에서 인덱스.ts는 보내겠다는 뜻 그니까 호출하는겨 (타입스크립트 기준으로 )
    }
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
export default router;
//# sourceMappingURL=index.js.map