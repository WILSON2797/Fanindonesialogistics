// Services Component
const Services = {
  template: `
    <div>
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">Layanan Kami</h1>
          <p data-aos="fade-up" data-aos-delay="100">Solusi logistik terintegrasi untuk kebutuhan bisnis Anda</p>
        </div>
      </section>
      <section class="svc-section">
        <div class="container">
          <div class="svc-header" data-aos="fade-up">
            <div class="svc-label"><span class="svc-label-icon">⚙️</span> LAYANAN KAMI</div>
            <h2 class="svc-title">SOLUSI <span>LENGKAP</span> UNTUK BISNIS ANDA</h2>
            <p class="svc-subtitle">Kami menyediakan berbagai layanan logistik untuk mendukung pertumbuhan bisnis Anda</p>
          </div>
          <div class="svc-grid" :class="{'svc-grid-page': !hideBanner}" data-aos="fade-up" data-aos-delay="100">
            <div class="svc-card" v-for="(s, i) in services" :key="s.id" data-aos="fade-up" :data-aos-delay="i*80">
              <div class="svc-img-wrap">
                <img v-if="s.image_path" :src="$baseDir + '/' + s.image_path" :alt="s.title" class="svc-img">
                <div v-else class="svc-img-placeholder"></div>
                <div class="svc-overlay"></div>
              </div>
              <div class="svc-content">
                <div class="svc-icon-badge">
                  <i :class="'bi ' + s.icon"></i>
                </div>
                <h3 class="svc-name">{{ s.title }}</h3>
                <p class="svc-desc">{{ s.description }}</p>
                <router-link :to="'/services/' + s.id" class="svc-link">
                  Lihat Detail <i class="bi bi-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="cta-section" v-if="!hideBanner">
        <div class="container" data-aos="zoom-in">
          <h2>Butuh Layanan Khusus?</h2>
          <p>Hubungi kami untuk mendiskusikan kebutuhan logistik spesifik bisnis Anda.</p>
          <div class="cta-buttons">
            <router-link to="/quote" class="btn btn-white"><i class="bi bi-send-fill"></i> Minta Penawaran</router-link>
          </div>
        </div>
      </section>
    </div>
  `,
  props: { hideBanner: { type: Boolean, default: false } },
  data() { return { services: [] }; },
  async mounted() {
    try { const r = await api.getServices(); this.services = r.data || []; } catch (e) { }
    this.$nextTick(() => { if (window.AOS) AOS.refresh(); });
  },
  methods: {
    getEmoji(s) {
      // Map common bootstrap icons or keywords to emojis for fallback display
      const iconMap = {
        'bi-truck': '🚛',
        'bi-building': '🏭',
        'bi-box-seam': '📦',
        'bi-water': '🚢',
        'bi-snow2': '❄️',
        'bi-geo-alt': '📡',
        'bi-broadcast': '📡',
        'bi-shield-check': '🛡️',
        'bi-clock': '⏱️',
        'bi-graph-up': '📈',
        'bi-people': '👥',
        'bi-globe': '🌐',
      };
      if (s.icon && iconMap[s.icon]) return iconMap[s.icon];
      // Try matching by title keyword
      const title = (s.title || '').toLowerCase();
      if (title.includes('transport') || title.includes('darat')) return '🚛';
      if (title.includes('warehouse') || title.includes('gudang')) return '🏭';
      if (title.includes('distribu')) return '📦';
      if (title.includes('laut') || title.includes('ekspedisi')) return '🚢';
      if (title.includes('cold') || title.includes('dingin')) return '❄️';
      if (title.includes('gps') || title.includes('track')) return '📡';
      return '📋';
    }
  }
};
