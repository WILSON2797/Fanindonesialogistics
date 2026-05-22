<template>
  <div>
    <div class="nav-overlay" :class="{ active: menuOpen }" @click="menuOpen = false"></div>
    <nav class="navbar" :class="{ scrolled: isScrolled }">
      <div class="container">
        <router-link to="/" class="nav-brand" @click="refreshAOS">
          <img :src="logoSrc" alt="FIS Logo" class="nav-brand-logo"> Fan Indonesia Sejahtera
        </router-link>
        <div class="nav-links" :class="{ active: menuOpen }">
          <router-link to="/" @click="refreshAOS">Home</router-link>
          <router-link to="/about" @click="menuOpen = false">About</router-link>
          <router-link to="/services" @click="menuOpen = false">Services</router-link>
          <router-link to="/fleet" @click="menuOpen = false">Fleet</router-link>
          <router-link to="/warehouse" @click="menuOpen = false">Our Warehouse</router-link>
          <router-link to="/coverage" @click="menuOpen = false">Coverage Area</router-link>
          <router-link to="/customers" @click="menuOpen = false">Customers</router-link>
          <router-link to="/clients" @click="menuOpen = false">Clients</router-link>
          <router-link to="/gallery" @click="menuOpen = false">Gallery</router-link>
          <router-link to="/certificates" @click="menuOpen = false">Certificates</router-link>
          <router-link to="/contact" @click="menuOpen = false">Contact</router-link>
          <router-link to="/quote" class="nav-cta" @click="menuOpen = false">
            <i class="bi bi-send-fill"></i> Quote
          </router-link>
        </div>
        <button class="nav-toggle" @click="menuOpen = !menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isScrolled: false,
      menuOpen: false
    };
  },
  computed: {
    logoSrc() {
      return (this.$baseDir || '') + '/assets/img/logo-fis.png';
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 60;
    },
    refreshAOS() {
      this.menuOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        if (typeof AOS !== 'undefined') {
          AOS.refreshHard();
          AOS.refresh();
        }
      }, 100);
    }
  }
};
</script>
