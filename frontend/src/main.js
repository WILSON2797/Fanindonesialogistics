import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// Fix trailing slash BEFORE Vue/Router initializes
// Vite dev server redirects /about → /about/ (HTTP redirect) due to cached 'base' or old behavior
// This restores the clean URL immediately via history API, no round-trip needed
(function fixTrailingSlash() {
  const { pathname, search, hash } = window.location;
  if (pathname !== '/' && pathname.endsWith('/')) {
    const clean = pathname.slice(0, -1) + search + hash;
    window.history.replaceState(null, document.title, clean);
  }
})();

// Import components
import Home from './components/Home.vue';
import AboutUs from './components/AboutUs.vue';
import Services from './components/Services.vue';
import ServiceDetail from './components/ServiceDetail.vue';
import Fleet from './components/Fleet.vue';
import Warehouse from './components/Warehouse.vue';
import WarehouseDetail from './components/WarehouseDetail.vue';
import CoverageArea from './components/CoverageArea.vue';
import Clients from './components/Clients.vue';
import Customers from './components/Customers.vue';
import Gallery from './components/Gallery.vue';
import Certificates from './components/Certificates.vue';
import ContactUs from './components/ContactUs.vue';
import RequestQuote from './components/RequestQuote.vue';

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
    path: '/warehouse', component: Warehouse,
    meta: { title: 'Warehouse Kami', description: 'Fasilitas pergudangan modern di berbagai lokasi strategis Indonesia untuk solusi logistik terbaik.' }
  },
  {
    path: '/warehouse/:id', component: WarehouseDetail,
    meta: { title: 'Detail Warehouse', description: 'Informasi lengkap mengenai fasilitas pergudangan kami.' }
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

const router = createRouter({
  history: createWebHistory(window.BASE_DIR || '/'),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  scrollBehavior() { return { top: 0 }; }
});

// Strip trailing slash from all routes (fixes Vite dev server redirect behavior fallback)
router.beforeEach((to, from, next) => {
  if (to.path !== '/' && to.path.endsWith('/')) {
    return next({ path: to.path.slice(0, -1), query: to.query, hash: to.hash, replace: true });
  }
  next();
});

router.afterEach((to) => {
  const baseTitle = 'PT. Fan Indonesia Sejahtera (FIS Logistics)';
  const pageTitle = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
  document.title = pageTitle;

  const desc = to.meta.description || 'Layanan logistik dan transportasi profesional ke seluruh wilayah Indonesia.';
  const metaDesc = document.getElementById('meta-description');
  if (metaDesc) metaDesc.setAttribute('content', desc);
});

const app = createApp(App);
app.config.globalProperties.$baseDir = window.BASE_DIR || '';
app.use(router);
app.mount('#app');

// AOS Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: false,
      offset: 60
    });
  }
});
