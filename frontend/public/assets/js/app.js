// ============================================
// Vue 3 App — Main Entry
// ============================================
const { createApp, h } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Root layout
const App = {
  template: `
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
  `,
  components: { Navbar, Footer, Welcome, ServiceDetail },
  data() { 
    return { 
      welcomeFinished: false 
    }; 
  }
};

// Router
const routes = [
  {
    path: '/', component: Home, alias: '/home',
    meta: { title: 'Home', description: 'Solusi logistik dan transportasi terpercaya untuk bisnis Anda dengan jangkauan seluruh Nusantara.' }
  },
  {
    path: '/about', component: AboutUs,
    meta: { title: 'Tentang Kami', description: 'Mengenal PT Fan Indonesia Sejahtera, visi misi, sejarah, dan nilai-nilai perusahaan kami.' }
  },
  {
    path: '/services', component: Services,
    meta: { title: 'Layanan Kami', description: 'Layanan logistik lengkap mulai dari transportasi darat, pergudangan, hingga manajemen rantai pasok.' }
  },
  {
    path: '/services/:id', component: ServiceDetail,
    meta: { title: 'Detail Layanan', description: 'Informasi lengkap mengenai layanan logistik kami.' }
  },

  {
    path: '/fleet', component: Fleet,
    meta: { title: 'Armada Kami', description: 'Berbagai pilihan armada truk modern mulai dari Blind Van, CDE, CDD, hingga Tronton Wingbox.' }
  },
  {
    path: '/coverage', component: CoverageArea,
    meta: { title: 'Area Jangkauan', description: 'Jangkauan pengiriman kami mencakup seluruh wilayah Indonesia: Jawa, Bali, Sumatera, Kalimantan, dan Sulawesi.' }
  },
  {
    path: '/clients', component: Clients,
    meta: { title: 'Klien Kami', description: 'Apa kata mereka tentang layanan PT Fan Indonesia Sejahtera.' }
  },
  {
    path: '/customers', component: Customers,
    meta: { title: 'Daftar Pelanggan', description: 'Daftar perusahaan terkemuka yang telah mempercayakan logistiknya kepada kami.' }
  },
  {
    path: '/gallery', component: Gallery,
    meta: { title: 'Galeri Foto', description: 'Dokumentasi operasional, armada, dan fasilitas PT Fan Indonesia Sejahtera.' }
  },
  {
    path: '/certificates', component: Certificates,
    meta: { title: 'Sertifikat & Legalitas', description: 'Dokumen resmi, izin operasional, dan sertifikasi mutu yang kami miliki.' }
  },
  {
    path: '/contact', component: ContactUs,
    meta: { title: 'Kontak Kami', description: 'Hubungi kami untuk informasi lebih lanjut mengenai layanan logistik dan transportasi.' }
  },
  {
    path: '/quote', component: RequestQuote,
    meta: { title: 'Minta Penawaran', description: 'Dapatkan penawaran harga terbaik untuk kebutuhan pengiriman barang bisnis Anda.' }
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(window.BASE_DIR || ''),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  scrollBehavior() { return { top: 0 }; }
});

// SEO Dynamic Update
router.afterEach((to) => {
  const baseTitle = 'PT. Fan Indonesia Sejahtera (FIS Logistics)';
  const pageTitle = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
  document.title = pageTitle;

  const desc = to.meta.description || 'Layanan logistik dan transportasi profesional ke seluruh wilayah Indonesia.';
  const metaDesc = document.getElementById('meta-description');
  if (metaDesc) metaDesc.setAttribute('content', desc);
});

// Init
const app = Vue.createApp(App);
app.config.globalProperties.$baseDir = window.BASE_DIR || '';
app.use(router);
app.mount('#app');

// Init AOS after mount
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: false, // Set to false agar animasi bisa muncul lagi saat scroll balik
    offset: 60
  });
});
