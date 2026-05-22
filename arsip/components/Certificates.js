// ============================================
// Certificates Page Component
// ============================================
const Certificates = {
  template: `
    <div>
      <section class="page-banner">
        <div class="container">
          <h1 data-aos="fade-up">Sertifikat</h1>
          <p data-aos="fade-up" data-aos-delay="100">Legalitas dan sertifikasi yang kami miliki</p>
        </div>
      </section>

      <section class="pv-certificates">
        <div class="container">
          <div class="pv-sec-hdr" data-aos="fade-up">
            <div class="pv-sec-label"><span>📜</span> SERTIFIKAT</div>
            <h2 class="pv-sec-title">SERTIFIKASI & <span>LEGALITAS</span></h2>
            <p class="pv-sec-sub">Terdaftar resmi dan bersertifikasi untuk menjamin keamanan layanan kami</p>
          </div>

          <!-- Certificate Grid -->
          <div class="pv-cert-slider-wrap" v-if="certificates.length">
            <button class="pv-cert-nav prev" @click="scrollCert('left')"><i class="bi bi-chevron-left"></i></button>
            <div class="pv-cert-grid" ref="certGrid">
              <div
              class="pv-cert-card"
              v-for="(c, i) in certificates"
              :key="c.id"
              data-aos="fade-up"
              :data-aos-delay="i * 80"
              @click="openLightbox(c)"
            >
              <div class="pv-cert-img-wrap">
                <img
                  v-if="c.image_path"
                  :src="$baseDir + '/' + c.image_path"
                  :alt="c.name"
                  class="pv-cert-img"
                  loading="lazy"
                >
                <div v-else class="pv-cert-placeholder">
                  <i class="bi bi-file-earmark-text"></i>
                </div>
                <div class="pv-cert-overlay">
                  <i class="bi bi-zoom-in"></i>
                </div>
              </div>
              <div class="pv-cert-name">{{ c.name }}</div>
            </div>
            </div>
            <button class="pv-cert-nav next" @click="scrollCert('right')"><i class="bi bi-chevron-right"></i></button>
          </div>

          <!-- Loading -->
          <div class="pv-cert-slider-wrap" v-else-if="loading">
            <div class="pv-cert-grid">
              <div class="pv-cert-card" v-for="n in 4" :key="'sk'+n">
                <div class="pv-cert-img-wrap" style="background:#eee;height:200px;"></div>
                <div class="pv-cert-name" style="color:transparent;background:#eee;border-radius:4px;">Loading</div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-if="!loading && certificates.length === 0" style="text-align:center;padding:60px 0;color:var(--text-light);">
            <i class="bi bi-file-earmark-x" style="font-size:3rem;display:block;margin-bottom:12px;"></i>
            <h3>Belum ada sertifikat</h3>
            <p>Sertifikat akan segera ditambahkan</p>
          </div>
        </div>
      </section>

      <!-- Lightbox -->
      <teleport to="body">
        <div class="pv-lightbox" v-if="lightbox" @click.self="lightbox=null">
          <button class="pv-lightbox-close" @click="lightbox=null"><i class="bi bi-x-lg"></i></button>
          <button class="pv-lightbox-nav prev" @click.stop="navLightbox(-1)" v-if="validCertificates.length > 1"><i class="bi bi-chevron-left"></i></button>
          <div class="pv-lightbox-content">
            <img :src="$baseDir + '/' + lightbox.image_path" :alt="lightbox.name">
            <div class="pv-lightbox-caption">{{ lightbox.name }}</div>
          </div>
          <button class="pv-lightbox-nav next" @click.stop="navLightbox(1)" v-if="validCertificates.length > 1"><i class="bi bi-chevron-right"></i></button>
        </div>
      </teleport>
    </div>
  `,
  data() {
    return {
      certificates: [],
      loading: true,
      lightbox: null
    };
  },
  async mounted() {
    try {
      const r = await api.getCertificates();
      this.certificates = r.data || [];
    } catch (e) {
      console.warn('Failed to load certificates:', e);
    }
    this.loading = false;
    this.$nextTick(() => { if (window.AOS) AOS.refresh(); });
  },
  computed: {
    validCertificates() {
      return this.certificates.filter(c => c.image_path);
    }
  },
  methods: {
    openLightbox(cert) {
      if (cert.image_path) this.lightbox = cert;
    },
    navLightbox(dir) {
      if (!this.validCertificates.length) return;
      let currentIndex = this.validCertificates.findIndex(c => c.id === this.lightbox.id);
      if (currentIndex === -1) currentIndex = 0;
      
      let nextIndex = currentIndex + dir;
      if (nextIndex < 0) nextIndex = this.validCertificates.length - 1;
      if (nextIndex >= this.validCertificates.length) nextIndex = 0;
      
      this.lightbox = this.validCertificates[nextIndex];
    },
    scrollCert(direction) {
      const grid = this.$refs.certGrid;
      if (!grid) return;
      const scrollAmount = 300;
      if (direction === 'left') {
        grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }
};
