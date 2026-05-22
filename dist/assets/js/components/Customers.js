// ============================================
// Customers Page — Marquee Scroll with Lazy Loading
// ============================================
const Customers = {
  template: `
    <div>
      <!-- Banner -->
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">Our Customers</h1>
          <p data-aos="fade-up" data-aos-delay="100">Dipercaya oleh ratusan perusahaan terkemuka di seluruh Indonesia</p>
        </div>
      </section>

      <section class="pv-customers">
        <div class="container">
          <div class="pv-sec-hdr" data-aos="fade-up">
            <div class="pv-sec-label"><span>🤝</span> PELANGGAN</div>
            <h2 class="pv-sec-title">CUSTOMER <span>KAMI</span></h2>
            <p class="pv-sec-sub">Dipercaya oleh perusahaan-perusahaan terkemuka di Indonesia</p>
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
                    :src="$baseDir + '/' + c.logo_path"
                    :alt="c.name"
                    class="pv-cust-logo-img loaded"
                    style="width:100%;height:100%;object-fit:contain;border-radius:8px;"
                  >
                  <span v-else style="font-size:18px;font-weight:900;color:var(--text-light);">{{ getInitials(c.name) }}</span>
                </div>
                <div class="pv-cust-name">{{ c.name }}</div>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div class="pv-cust-track-wrap" v-else-if="loading">
            <div class="pv-cust-track" style="animation:none;">
              <div class="pv-cust-card" v-for="n in 6" :key="'sk'+n">
                <div class="pv-cust-logo" style="background:#eee;"></div>
                <div class="pv-cust-name" style="color:transparent;background:#eee;border-radius:4px;">Loading</div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-customers" v-if="!loading && customers.length === 0">
            <i class="bi bi-people"></i>
            <h3>Belum ada data customer</h3>
            <p>Data customer akan segera ditambahkan</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section" v-if="!hideBanner">
        <div class="container" data-aos="zoom-in">
          <h2>Bergabunglah dengan Ratusan Perusahaan Lainnya</h2>
          <p>Percayakan kebutuhan logistik bisnis Anda kepada kami dan rasakan layanan profesional yang telah terbukti.</p>
          <div class="cta-buttons">
            <router-link to="/quote" class="btn btn-white"><i class="bi bi-send-fill"></i> Minta Penawaran</router-link>
          </div>
        </div>
      </section>
    </div>
  `,
  props: { hideBanner: { type: Boolean, default: false } },
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
      if (window.AOS) AOS.refresh();
    });
  },
  methods: {
    getInitials(name) {
      return name.split(' ').map(w => w.charAt(0)).slice(0, 2).join('').toUpperCase();
    }
  }
};
