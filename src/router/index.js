import { createRouter, createWebHashHistory } from 'vue-router'

let router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Online",
            component: () => import("../views/online.vue")
        },
        {
            path: "/md",
            name: "Md",
            component: () => import("../views/md.vue")
        },
        {
            path: "/addQuestion",
            name: "AddQuestion",
            component: () => import("../views/addQuestion.vue")
        },
        {
            path: "/question/:id",
            name: "Question",
            component: () => import("../views/question.vue")
        },
        {
            path: "/leetcode",
            name: "Leetcode",
            component: () => import("../views/leetcode.vue")
        }, 
        { 
            path: '/:pathMatch(.*)*', 
            name: 'NotFound', 
            component: ()=> import("../views/NotFound.vue") 
        },
    ],
    scrollBehavior() {
        // 滚动滑动到左上角
        return {
            left: 0,
            top: 0
        }
    }
});
export default router;
