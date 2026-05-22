// ============================================
// Service Detail Page Component
// ============================================
const ServiceDetail = {
  template: `
    <div class="service-detail-page">
      <!-- Loading State -->
      <div v-if="loading" class="svc-detail-loading">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="service">
        <!-- Hero Header -->
        <section class="svc-detail-hero" :style="heroStyle">
          <div class="svc-detail-overlay"></div>
          <div class="container">
            <div class="svc-detail-header-content">
              <router-link to="/services" class="back-link">
                <i class="bi bi-arrow-left"></i> Kembali ke Layanan
              </router-link>
              <h1 data-aos="fade-up">{{ service.title }}</h1>
              <p data-aos="fade-up" data-aos-delay="100">{{ service.description }}</p>
            </div>
          </div>
        </section>

        <!-- Main Content -->
        <section class="svc-detail-body">
          <div class="container">
            <div class="svc-detail-grid">
              <!-- Left: Content -->
              <div class="svc-detail-main" data-aos="fade-right">
                <div class="svc-content-card">
                  <div class="svc-icon-badge">
                    <i :class="'bi ' + service.icon"></i>
                  </div>
                  <div class="svc-rich-text" v-html="formattedContent"></div>
                  
                  <!-- Fallback if content is empty -->
                  <div v-if="!service.content" class="svc-empty-content">
                    <p>Detail informasi untuk layanan ini sedang diperbarui. Silakan hubungi kami untuk informasi lebih lanjut mengenai {{ service.title }}.</p>
                  </div>
                </div>
              </div>

              <!-- Right: Sidebar -->
              <div class="svc-detail-sidebar" data-aos="fade-left">
                <!-- CTA Card -->
                <div class="svc-cta-card">
                  <h4>Butuh Layanan Ini?</h4>
                  <p>Dapatkan penawaran harga terbaik untuk kebutuhan {{ service.title }} Anda.</p>
                  <router-link to="/quote" class="btn btn-primary btn-block">
                    <i class="bi bi-send-fill"></i> Minta Penawaran
                  </router-link>
                  <a href="https://wa.me/6281252206828" target="_blank" class="btn btn-outline-success btn-block mt-3">
                    <i class="bi bi-whatsapp"></i> Chat via WhatsApp
                  </a>
                </div>

                <!-- Features List (Static Example or could be dynamic) -->
                <div class="svc-features-card mt-4">
                  <h4>Keunggulan Kami</h4>
                  <ul class="svc-features-list">
                    <li><i class="bi bi-check-circle-fill"></i> Tim Profesional & Berpengalaman</li>
                    <li><i class="bi bi-check-circle-fill"></i> Jangkauan Seluruh Indonesia</li>
                    <li><i class="bi bi-check-circle-fill"></i> Sistem Monitoring Real-time</li>
                    <li><i class="bi bi-check-circle-fill"></i> Harga Kompetitif & Transparan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Not Found -->
      <div v-else class="svc-not-found">
        <div class="container text-center">
          <i class="bi bi-exclamation-triangle" style="font-size: 4rem; color: var(--warning);"></i>
          <h2>Layanan Tidak Ditemukan</h2>
          <p>Maaf, informasi layanan yang Anda cari tidak tersedia atau telah dihapus.</p>
          <router-link to="/services" class="btn btn-primary mt-3">Lihat Semua Layanan</router-link>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      service: null,
      loading: true
    };
  },
  computed: {
    heroStyle() {
      if (this.service && this.service.image_path) {
        return {
          backgroundImage: `url('${this.$baseDir}/${this.service.image_path}')`
        };
      }
      return {
        background: 'var(--gradient-dark)'
      };
    },
    formattedContent() {
      if (!this.service || !this.service.content) return '';
      let text = this.service.content;
      // Convert lines starting with '- ' or '- ' to bullet points
      text = text.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
      // Wrap <li> groups in <ul>
      text = text.replace(/(<li>.*<\/li>)/gms, '<ul class="svc-content-list">$1</ul>');
      // Convert newlines to <br> for non-list text
      return text.replace(/\n/g, '<br>');
    }
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const r = await api.getServiceById(id);
      if (r.success) {
        this.service = r.data;
      }
    } catch (e) {
      console.error('Failed to load service detail:', e);
    }
    this.loading = false;
    this.$nextTick(() => {
      if (window.AOS) AOS.refresh();
      window.scrollTo(0, 0);
    });
  }
};
