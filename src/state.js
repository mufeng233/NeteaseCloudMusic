import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        cookie: null,
        songs: [],
    },
    mutations: {
        addSong(state, obj) {
            state.songs.push(obj);
            window.localStorage.setItem('songs', JSON.stringify(state.songs))
        }
    },
    getters: {
        isLogin() {
            if (window.localStorage.getItem('cookie')) {
                return true;
            } else {
                return false;
            }
        },
        getLocalSongs(){
            return window.localStorage.getItem('songs');
        }
    }
})

export default store;