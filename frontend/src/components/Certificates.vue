<template>
  <div>
    <section class="page-banner">
      <div class="container">
        <h1 data-aos="fade-up">Certificates</h1>
        <p data-aos="fade-up" data-aos-delay="100">Our official legality and certifications</p>
      </div>
    </section>

    <section class="pv-certificates">
      <div class="container">
        <div class="pv-sec-hdr" data-aos="fade-up">
          <div class="pv-sec-label">
            <i class="fa-solid fa-file-signature label-icon-spacing"></i> CERTIFICATES
          </div>
          <h2 class="pv-sec-title">CERTIFICATION & <span>LEGALITY</span></h2>
          <p class="pv-sec-sub">Officially registered and certified to guarantee the security of our services</p>
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
                  :src="getCertImgUrl(c.image_path)"
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
              <div class="pv-cert-img-wrap skeleton-img-wrap"></div>
              <div class="pv-cert-name skeleton-text">Loading</div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="!loading && certificates.length === 0" class="empty-state">
          <i class="bi bi-file-earmark-x empty-state-icon"></i>
          <h3>No certificates available yet</h3>
          <p>Certificates will be added soon</p>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <teleport to="body">
      <div class="pv-lightbox" v-if="lightbox" @click.self="closeLightbox">
        <button class="pv-lightbox-close" @click="closeLightbox"><i class="bi bi-x-lg"></i></button>
        <button class="pv-lightbox-nav prev" @click.stop="navLightbox(-1)" v-if="validCertificates.length > 1"><i class="bi bi-chevron-left"></i></button>
        <div class="pv-lightbox-content">
          <img :src="getCertImgUrl(lightbox.image_path)" :alt="lightbox.name">
          <div class="pv-lightbox-caption">{{ lightbox.name }}</div>
        </div>
        <button class="pv-lightbox-nav next" @click.stop="navLightbox(1)" v-if="validCertificates.length > 1"><i class="bi bi-chevron-right"></i></button>
      </div>
    </teleport>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'Certificates',
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
    this.$nextTick(() => { if (window.AOS) window.AOS.refresh(); });
  },
  computed: {
    validCertificates() {
      return this.certificates.filter(c => c.image_path);
    }
  },
  beforeUnmount() {
    // Make sure to clean up scroll locking if unmounting while lightbox is open
    document.body.style.overflow = '';
  },
  methods: {
    getCertImgUrl(path) {
      const base = window.BASE_DIR || '';
      return base + '/' + path;
    },
    openLightbox(cert) {
      if (cert.image_path) {
        this.lightbox = cert;
        document.body.style.overflow = 'hidden';
      }
    },
    closeLightbox() {
      this.lightbox = null;
      document.body.style.overflow = '';
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
</script>

<style scoped>
.label-icon-spacing {
  margin-right: 8px;
  color: var(--primary-color, #00b4d8);
}
.skeleton-img-wrap {
  background: #202b3c !important;
  height: 200px;
}
.skeleton-text {
  color: transparent !important;
  background: #202b3c !important;
  border-radius: 4px;
}
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-light, #a0aec0);
}
.empty-state-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}
</style>
