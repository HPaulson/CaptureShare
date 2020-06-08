import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({

  state: {

    user: null,

    currentPage: 0,

    foundFiles: []
  },

  mutations: {

    changeUser(state, user) {

      state.user = user
    },

    changePage(state, currentPage) {

      state.currentPage = currentPage
    },

    changeFiles(state, files) {

      state.foundFiles = files
    }
  },

  getters: {

    page: state => state.currentPage,

    user: state => state.user,

    uploads: state => state.foundFiles
  }
})
