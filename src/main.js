import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VueHighcharts from 'vue-highcharts'
import Vuex from 'vuex'
import './stylus/main.styl'
import axios from 'axios'
import Highcharts from  "highcharts";
import highchartsMore from 'highcharts/highcharts-more';
import loadStock from 'highcharts/modules/stock';

import Login from '@/pages/Login'
import SiteList from '@/pages/SiteList'
import HomeReporting from '@/pages/HomeReporting'
import HomeSettings from '@/pages/HomeSettings' 

import SiteReporting from '@/pages/site/Reporting'
import SiteSettings from '@/pages/site/Settings' 

import ZoneReporting from '@/pages/zone/Reporting'
import ZoneSettings from '@/pages/zone/Settings' 
import ZoneNotifications from '@/pages/zone/Notifications' 

import ViewAll from '@/pages/ViewAll'
import Zone from '@/pages/Zone'
import Site from '@/pages/Site'
import Sensor from '@/pages/Sensor'
import Dashboard from '@/pages/Dashboard'
import SensorList from '@/pages/SensorList'
import Report from '@/pages/Report'
import AlarmRules from '@/pages/AlarmRules'
import Settings from '@/pages/Settings'
// import BootstrapVue from 'bootstrap-vue'

import { ZONES_API, ZONE_INFO_API } from '@/global'
import auth from '@/auth'

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(Vuex)
// Vue.use(BootstrapVue)


Highcharts.setOptions({
	global: {
	  useUTC: false
	},
	lang: {
			loading: '로딩 중...',
			months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			weekdays: ['월', '화', '수', '목', '금', '토', '일'],
			shortMonths: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	}
});
loadStock(Highcharts);
highchartsMore(Highcharts);
Vue.use(VueHighcharts, { Highcharts })

const routes = [
	{ path: '/', component: SiteList },
	{ path: '/view-all', component: ViewAll },
	{ path: '/home-reporting', component: HomeReporting },
	{ path: '/home-settings', component: HomeSettings },
	{ path: '/site-reporting', component: SiteReporting },
	{ path: '/site-settings', component: SiteSettings },
	{ path: '/zone-reporting', component: ZoneReporting },
	{ path: '/zone-settings', component: ZoneSettings },
	{ path: '/zone-notifications', component: ZoneNotifications },
	{ path: '/login', component: Login },
	{ path: '/dashboard', component: Dashboard },
	{ path: '/site/:zoneid', component: Site },
	{ path: '/site', component: Site },
	{ path: '/zone', component: Zone },
	{ path: '/zone/:id', component: Zone, props: true },
	{ path: '/sensor', component: Sensor },
	{ path: '/dashboard/:zoneid', component: Dashboard, props: true },
	{ path: '/sensor-list', component: SensorList },
	{ path: '/sensor-list/:zoneid', component: SensorList, props: true },
	{ path: '/sensor-list/:zoneid/:id', component: SensorList, props: true },
	{ path: '/report', component: Report },
	{ path: '/report/:zoneid', component: Report, props: true },
	{ path: '/alarmrules', component: AlarmRules },
	{ path: '/alarmrules/:zoneid', component: AlarmRules, props: true },
	{ path: '/settings', component: Settings },
	{ path: '/settings/:zoneid', component: Settings, props: true },
]
export const router = new VueRouter({ routes })
router.beforeEach((to, from, next) => {
	if (to.path !== '/login' && !auth.user.authenticated) {
		next('/login')
	} else { next () }
})

export const store = new Vuex.Store({
	state: { zones: [], zoneid: null, zone: null, token: null, menu:true, menuItems:[], detail_zone:[]},
	mutations: {
		setZones (state, zones) { state.zones = zones },
		setZoneId (state, zoneid) { state.zoneid = zoneid },
		setZone (state, zone) { state.zone = zone },
		setToken (state, token) { state.token = token },
		setMenuItems (state, menus) {state.menuItems = menus}
	},
	getters: {
    isAuthenticated: state => {
      return !!state.token
		},
		zoneid: state => {
      return state.zoneid
    },
	hasMenu : state => {
		return state.menu
	}
  },
	actions: {
		loadZone ({ commit, dispatch }, shouldSetZone) {
			axios.get(ZONES_API).then(res => {
				commit('setZones', res.data)
				if (res.data.length && shouldSetZone) {
					
					var zoneId = localStorage.getItem('zoneid')
					if (!zoneId)
						zoneId = store.getters.zoneid ? store.getters.zoneid : res.data[0].id,
					dispatch('setZone', { zoneId: zoneId, shouldClear: false })
				}
			})
		},
		setZone ({ commit }, { zoneId, shouldClear }) {
			if (shouldClear) { commit('setZone', null) }
			axios.get(ZONE_INFO_API + zoneId).then(res => {
				commit('setZone', res.data)
			})
		}
	}
})
auth.checkAuth()

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
