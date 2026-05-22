// Navbar Component
const Navbar = {
  template: `
    <div>
      <div class="nav-overlay" :class="{active: menuOpen}" @click="menuOpen=false"></div>
      <nav class="navbar" :class="{scrolled: isScrolled}">
        <div class="container">
          <router-link to="/" class="nav-brand" @click="refreshAOS">
            <img src="assets/img/logo-fis.png" alt="FIS Logo" class="nav-brand-logo"> Fan Indonesia Sejahtera
          </router-link>
          <div class="nav-links" :class="{active: menuOpen}">
            <router-link to="/" @click="refreshAOS">Home</router-link>
            <router-link to="/about" @click="menuOpen=false">About</router-link>
            <router-link to="/services" @click="menuOpen=false">Services</router-link>
            <router-link to="/fleet" @click="menuOpen=false">Fleet</router-link>
            <router-link to="/coverage" @click="menuOpen=false">Coverage Area</router-link>
            <router-link to="/customers" @click="menuOpen=false">Customers</router-link>
            <router-link to="/clients" @click="menuOpen=false">Clients</router-link>
            <router-link to="/gallery" @click="menuOpen=false">Gallery</router-link>
            <router-link to="/certificates" @click="menuOpen=false">Sertifikat</router-link>
            <router-link to="/contact" @click="menuOpen=false">Contact</router-link>
            <router-link to="/quote" class="nav-cta" @click="menuOpen=false">
              <i class="bi bi-send-fill"></i> Quote
            </router-link>
          </div>
          <button class="nav-toggle" @click="menuOpen=!menuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </div>
  `,
  data() {
    return { isScrolled: false, menuOpen: false };
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
          AOS.refreshHard(); // refreshHard forces AOS to re-calculate everything
          AOS.refresh();
        }
      }, 100);
    }
  }
};
