<template>
  <div id="root">
    <Welcome v-if="!welcomeFinished" @finished="welcomeFinished = true" />

    <Navbar v-if="welcomeFinished" />

    <div class="site-content" :class="{ 'revealed': welcomeFinished }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <Footer />
    </div>
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Welcome,
    Navbar,
    Footer
  },
  data() {
    return {
      welcomeFinished: false
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
