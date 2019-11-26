import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueRouter from 'vue-router'
import bugsnag from '@bugsnag/js'
import bugsnagVue from '@bugsnag/plugin-vue'

import "./registerServiceWorker";
const bugsnagClient = bugsnag('aff7268a49b5b5038c4f52394cd3e0c8')
// bugsnagClient.use(bugsnagVue, Vue)

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
    path: '/week/:weeknum'
  },{
    path: '/',
    redirect: '/week/13'
  },
  {
    path: '*',
    redirect: '/week/13'
  }],
  mode: 'history'
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");