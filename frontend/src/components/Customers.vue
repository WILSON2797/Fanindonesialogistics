<template>
  <div>
    <!-- Banner -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <h1 data-aos="fade-up">Our Customers</h1>
        <p data-aos="fade-up" data-aos-delay="100">Trusted by hundreds of leading companies across Indonesia</p>
      </div>
    </section>

    <section class="pv-customers">
      <div class="container">
        <div class="pv-sec-hdr" data-aos="fade-up">
          <div class="pv-sec-label">
            <i class="fa-solid fa-handshake-angle label-icon-spacing"></i> CUSTOMERS
          </div>
          <h2 class="pv-sec-title">OUR <span>CUSTOMERS</span></h2>
          <p class="pv-sec-sub">Trusted by leading companies in Indonesia</p>
        </div>

        <!-- Marquee Scroll -->
        <div class="pv-cust-track-wrap" v-if="customers.length" data-aos="fade-up" data-aos-delay="100">
          <div class="pv-cust-track">
            <div
              class="pv-cust-card"
              v-for="(c, i) in scrollList"
              :key="'c'+i"
            >
              <div class="pv-cust-logo">
                <img
                  v-if="c.logo_path"
                  :src="getLogoUrl(c.logo_path)"
                  :alt="c.name"
                  class="pv-cust-logo-img loaded"
                >
                <span v-else class="pv-cust-initials">{{ getInitials(c.name) }}</span>
              </div>
              <div class="pv-cust-name">{{ c.name }}</div>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div class="pv-cust-track-wrap" v-else-if="loading">
          <div class="pv-cust-track loading-track">
            <div class="pv-cust-card" v-for="n in 6" :key="'sk'+n">
              <div class="pv-cust-logo skeleton-logo"></div>
              <div class="pv-cust-name skeleton-text">Loading</div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-customers" v-if="!loading && customers.length === 0">
          <i class="bi bi-people"></i>
          <h3>No customer data available yet</h3>
          <p>Customer data will be added soon</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" v-if="!hideBanner">
      <div class="container" data-aos="zoom-in">
        <h2>Join Hundreds of Other Companies</h2>
        <p>Trust your business logistics needs to us and experience proven professional service.</p>
        <div class="cta-buttons">
          <router-link to="/quote" class="btn btn-white"><i class="bi bi-send-fill"></i> Request a Quote</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'Customers',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      customers: [],
      loading: true
    };
  },
  computed: {
    // Duplicate the list so the marquee loops seamlessly
    scrollList() {
      return [...this.customers, ...this.customers];
    }
  },
  async mounted() {
    try {
      const r = await api.getCustomers();
      this.customers = r.data || [];
    } catch (e) {
      console.warn('Failed to load customers:', e);
    }
    this.loading = false;

    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  },
  methods: {
    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(w => w.charAt(0)).slice(0, 2).join('').toUpperCase();
    },
    getLogoUrl(path) {
      const base = window.BASE_DIR || '';
      return base + '/' + path;
    }
  }
};
</script>

<style scoped>
.label-icon-spacing {
  margin-right: 8px;
  color: var(--primary-color, #00b4d8);
}
.pv-cust-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
.pv-cust-initials {
  font-size: 18px;
  font-weight: 900;
  color: var(--text-light, #f8f9fa);
}
.loading-track {
  animation: none !important;
}
.skeleton-logo {
  background: #202b3c !important;
  border-radius: 8px;
}
.skeleton-text {
  color: transparent !important;
  background: #202b3c !important;
  border-radius: 4px;
}
</style>
