import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token') || '',
    isAuthenticated: !!localStorage.getItem('token'),
    currentUser: localStorage.getItem('user') || '',
    currentRole: localStorage.getItem('r') || '',
    id: localStorage.getItem('id') || '',
  },

  mutations: {
    setUser(state, { user, role, token, id }) {
      state.currentUser = user;
      state.currentRole = role;
      state.token = token;
      state.id = id;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.currentUser = '';
      state.currentRole = '';
      state.token = '';
      state.id = '';
      state.isAuthenticated = false;
    }
  },

  actions: {
    async signin({ commit }, userData) {
      try {
        const response = await axios.post('http://192.168.7.5:3000/api/login', userData);
        const { username, role, id, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        localStorage.setItem('r', role);
        localStorage.setItem('id', id);

        commit('setUser', { user: username, role, token, id });

        return response;
      } catch (error) {
        throw new Error('Signin failed');
      }
    },
    async signup({ commit }, userData) {
      try {
        const response = await axios.post('http://192.168.7.5:3000/user/profile', userData);
        const { user, role, token, id } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        localStorage.setItem('r', role);
        localStorage.setItem('id', id);

        commit('setUser', { user, role, token, id });

        return response.data;
      } catch (error) {
        throw new Error('Signup failed');
      }
    },
    async signout({ commit }) {
      localStorage.clear();
      commit('clearUser');
    },
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.currentUser,
    currentRole: state => state.currentRole,
    token: state => state.token,
    id: state => state.id,
  },
});
