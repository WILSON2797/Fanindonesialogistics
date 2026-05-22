<template>
  <div class="whd-page">
    <!-- Loading -->
    <div v-if="loading" class="whd-loading">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="warehouse">
      <!-- Hero Section -->
      <section class="whd-hero" :style="heroStyle">
        <div class="whd-hero-overlay"></div>
        <div class="container whd-hero-container">
          <router-link to="/warehouse" class="whd-back-btn" data-aos="fade-right">
            <i class="bi bi-arrow-left"></i> Back to Warehouses
          </router-link>
          <div class="whd-hero-text" data-aos="fade-up" data-aos-delay="100">
            <div class="whd-badge-row">
              <span class="whd-type-badge" v-if="warehouse.type">{{ warehouse.type }}</span>
              <span class="whd-region-badge" v-if="warehouse.region"><i class="bi bi-geo-alt-fill"></i> {{
                warehouse.region }}</span>
            </div>
            <h1>{{ warehouse.name }}</h1>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="whd-content-section">
        <div class="container">
          <div class="whd-layout">
            <!-- Left: Specs + Description -->
            <div class="whd-main" data-aos="fade-up" data-aos-delay="200">
              <!-- Specifications Card -->
              <div class="whd-card">
                <div class="whd-card-icon">
                  <i class="bi bi-clipboard-data"></i>
                </div>
                <h3 class="whd-card-title">Specifications</h3>
                <div class="whd-specs-grid">
                  <div class="whd-spec-block" v-if="warehouse.area">
                    <div class="whd-spec-icon"><i class="bi bi-arrows-fullscreen"></i></div>
                    <div class="whd-spec-info">
                      <span class="whd-spec-label">Warehouse Space</span>
                      <span class="whd-spec-value">{{ warehouse.area }}</span>
                    </div>
                  </div>
                  <div class="whd-spec-block" v-if="warehouse.type">
                    <div class="whd-spec-icon"><i class="bi bi-building"></i></div>
                    <div class="whd-spec-info">
                      <span class="whd-spec-label">Type</span>
                      <span class="whd-spec-value">{{ warehouse.type }}</span>
                    </div>
                  </div>
                  <div class="whd-spec-block" v-if="warehouse.region">
                    <div class="whd-spec-icon"><i class="bi bi-geo-alt-fill"></i></div>
                    <div class="whd-spec-info">
                      <span class="whd-spec-label">Region</span>
                      <span class="whd-spec-value">{{ warehouse.region }}</span>
                    </div>
                  </div>
                  <div class="whd-spec-block" v-if="warehouse.project">
                    <div class="whd-spec-icon"><i class="bi bi-briefcase-fill"></i></div>
                    <div class="whd-spec-info">
                      <span class="whd-spec-label">Project</span>
                      <span class="whd-spec-value">{{ warehouse.project }}</span>
                    </div>
                  </div>
                </div>

                <div class="whd-description" v-if="warehouse.description">
                  <h4>About This Warehouse</h4>
                  <p>{{ warehouse.description }}</p>
                </div>
              </div>

              <!-- 3D Coverflow Gallery Section -->
              <div class="whd-card whd-gallery-card" v-if="gallery.length > 0" data-aos="fade-up" data-aos-delay="300">
                <h3 class="whd-card-title"><i class="bi bi-images"></i> Gallery Overview</h3>

                <div class="coverflow-carousel" v-if="coverflowItems.length > 1">
                  <div v-for="(c, i) in coverflowItems" :key="c.uid" :class="['coverflow-item', getCoverflowClass(i)]"
                    @click="handleCarouselClick(i, c.idx)">
                    <img :src="getImageUrl(c.item.image_path)" :alt="c.item.caption || warehouse.name">
                    <div class="coverflow-hover" v-if="getCoverflowClass(i) === 'active'">
                      <i class="bi bi-arrows-fullscreen"></i>
                    </div>
                    <div class="coverflow-caption" v-if="c.item.caption && getCoverflowClass(i) === 'active'">
                      {{ c.item.caption }}
                    </div>
                  </div>
                  <button class="carousel-nav prev" @click="prevCarousel"><i class="bi bi-chevron-left"></i></button>
                  <button class="carousel-nav next" @click="nextCarousel"><i class="bi bi-chevron-right"></i></button>
                </div>

                <!-- Fallback for single image -->
                <div class="whd-gallery-grid" v-else>
                  <div class="whd-gallery-item single-item" @click="openLightbox(0)">
                    <img :src="getImageUrl(gallery[0].image_path)" :alt="gallery[0].caption || warehouse.name"
                      class="whd-gallery-img">
                    <div class="whd-gallery-hover"><i class="bi bi-arrows-fullscreen"></i></div>
                    <div class="whd-gallery-caption" v-if="gallery[0].caption">{{ gallery[0].caption }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Sidebar -->
            <div class="whd-sidebar" data-aos="fade-up" data-aos-delay="300">
              <!-- CTA Widget -->
              <div class="whd-widget-dark">
                <div class="whd-widget-glow"></div>
                <h4>Interested in This Warehouse?</h4>
                <p>Get the best quote for <strong>{{ warehouse.name }}</strong> storage needs today.</p>
                <div class="whd-widget-actions">
                  <router-link to="/quote" class="whd-btn-primary">
                    <i class="bi bi-send-fill"></i> Request Quote
                  </router-link>
                  <a href="https://wa.me/6281252206828" target="_blank" class="whd-btn-whatsapp">
                    <i class="bi bi-whatsapp"></i> Chat via WhatsApp
                  </a>
                </div>
              </div>

              <!-- Highlights Widget (Dynamic) -->
              <div class="whd-widget-light" v-if="highlights.length > 0" data-aos="fade-up" data-aos-delay="400">
                <h4>Warehouse Highlights</h4>
                <ul class="whd-feature-list">
                  <li v-for="h in highlights" :key="h.id">
                    <div class="whd-feat-icon"><i class="bi bi-check2-circle"></i></div>
                    <div class="whd-feat-text">{{ h.text }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="whd-not-found" data-aos="zoom-in">
      <div class="container text-center">
        <div class="whd-error-circle">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h2>Warehouse Not Found</h2>
        <p>Sorry, the warehouse information you are looking for is not available.</p>
        <router-link to="/warehouse" class="whd-btn-outline">View All Warehouses</router-link>
      </div>
    </div>

    <!-- Lightbox -->
    <teleport to="body">
      <div class="whd-lightbox-overlay" v-if="lightbox.show" @click.self="closeLightbox">
        <button class="whd-lb-close" @click="closeLightbox" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
        <button class="whd-lb-nav whd-lb-prev" @click.stop="prevImage" v-if="gallery.length > 1">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="whd-lb-content">
          <img v-if="currentLightboxItem" :src="getImageUrl(currentLightboxItem.image_path)"
            :alt="currentLightboxItem.caption || 'Gallery'" class="whd-lb-img">
          <div class="whd-lb-info" v-if="currentLightboxItem && currentLightboxItem.caption">
            <p>{{ currentLightboxItem.caption }}</p>
          </div>
        </div>
        <button class="whd-lb-nav whd-lb-next" @click.stop="nextImage" v-if="gallery.length > 1">
          <i class="bi bi-chevron-right"></i>
        </button>
        <div class="whd-lb-counter">{{ lightbox.index + 1 }} / {{ gallery.length }}</div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'WarehouseDetail',
  data() {
    return {
      warehouse: null,
      gallery: [],
      highlights: [],
      loading: true,
      lightbox: {
        show: false,
        index: 0
      },
      carouselIndex: 0
    };
  },
  computed: {
    heroStyle() {
      if (this.warehouse && this.warehouse.image_path) {
        return {
          backgroundImage: `url('${this.$baseDir}/${this.warehouse.image_path}')`
        };
      }
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)'
      };
    },
    currentLightboxItem() {
      return this.gallery[this.lightbox.index] || null;
    },
    coverflowItems() {
      if (this.gallery.length === 0) return [];
      if (this.gallery.length === 1) return [{ item: this.gallery[0], idx: 0, uid: 0 }];
      if (this.gallery.length === 2) {
        return [
          { item: this.gallery[0], idx: 0, uid: 0 },
          { item: this.gallery[1], idx: 1, uid: 1 },
          { item: this.gallery[0], idx: 0, uid: 2 },
          { item: this.gallery[1], idx: 1, uid: 3 }
        ];
      }
      return this.gallery.map((g, i) => ({ item: g, idx: i, uid: i }));
    }
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const r = await api.getWarehouseById(id);
      if (r.success) {
        this.warehouse = r.data;
        this.gallery = r.data.gallery || [];
        this.highlights = r.data.highlights || [];
      }
    } catch (e) {
      console.error('Failed to load warehouse detail:', e);
    }
    this.loading = false;
    this.$nextTick(() => {
      if (window.AOS) AOS.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
  },
  methods: {
    getImageUrl(path) {
      const base = window.BASE_DIR || '';
      return base + '/' + path;
    },
    openLightbox(index) {
      this.lightbox.index = index;
      this.lightbox.show = true;
      document.body.style.overflow = 'hidden';
    },
    closeLightbox() {
      this.lightbox.show = false;
      document.body.style.overflow = '';
    },
    prevImage() {
      this.lightbox.index = (this.lightbox.index - 1 + this.gallery.length) % this.gallery.length;
    },
    nextImage() {
      this.lightbox.index = (this.lightbox.index + 1) % this.gallery.length;
    },
    handleKeydown(e) {
      if (this.lightbox.show) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'ArrowRight') this.nextImage();
      } else {
        if (e.key === 'ArrowLeft') this.prevCarousel();
        if (e.key === 'ArrowRight') this.nextCarousel();
      }
    },
    // --- Coverflow Logic ---
    getCoverflowClass(index) {
      const N = this.coverflowItems.length;
      if (N <= 1) return 'active';
      if (index === this.carouselIndex) return 'active';

      const prevIdx = (this.carouselIndex - 1 + N) % N;
      if (index === prevIdx) return 'prev';

      const nextIdx = (this.carouselIndex + 1) % N;
      if (index === nextIdx) return 'next';

      return 'hidden';
    },
    handleCarouselClick(uiIndex, originalIndex) {
      if (uiIndex === this.carouselIndex) {
        this.openLightbox(originalIndex);
      } else {
        this.carouselIndex = uiIndex;
      }
    },
    prevCarousel() {
      const N = this.coverflowItems.length;
      if (N > 1) {
        this.carouselIndex = (this.carouselIndex - 1 + N) % N;
      }
    },
    nextCarousel() {
      const N = this.coverflowItems.length;
      if (N > 1) {
        this.carouselIndex = (this.carouselIndex + 1) % N;
      }
    }
  }
};
</script>

<style scoped>
/* ===== Hero ===== */
.whd-hero {
  position: relative;
  min-height: 380px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
}

.whd-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.85) 100%);
}

.whd-hero-container {
  position: relative;
  z-index: 2;
  padding: 40px 0;
}

.whd-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.whd-back-btn:hover {
  color: #fff;
}

.whd-hero-text h1 {
  color: #fff;
  font-size: 2.4rem;
  font-weight: 800;
  margin: 12px 0 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.whd-badge-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.whd-type-badge {
  background: var(--primary, #2563eb);
  color: #fff;
  padding: 5px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.whd-region-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 5px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* ===== Content ===== */
.whd-content-section {
  padding: 50px 0 80px;
}

.whd-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 28px;
  align-items: flex-start;
}

.whd-card {
  background: var(--card-bg, #fff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.05));
  margin-bottom: 24px;
  position: relative;
}

.whd-card-icon {
  position: absolute;
  top: -18px;
  left: 28px;
  width: 44px;
  height: 44px;
  background: var(--primary, #2563eb);
  color: #fff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

.whd-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--heading, #0f172a);
  margin: 4px 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.whd-card-title i {
  color: var(--primary, #2563eb);
}

/* ===== Specs Grid ===== */
.whd-specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}

.whd-spec-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg, #f8fafc);
  border-radius: 12px;
  border: 1px solid var(--border, rgba(0, 0, 0, 0.04));
  transition: transform 0.2s, box-shadow 0.2s;
}

.whd-spec-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.whd-spec-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--primary, #2563eb), #3b82f6);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.whd-spec-info {
  display: flex;
  flex-direction: column;
}

.whd-spec-label {
  font-size: 0.7rem;
  color: var(--text-light, #64748b);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.whd-spec-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--heading, #0f172a);
  margin-top: 2px;
}

/* ===== Description ===== */
.whd-description {
  padding-top: 24px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.whd-description h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--heading, #0f172a);
  margin: 0 0 10px;
}

.whd-description p {
  font-size: 0.92rem;
  color: var(--text, #334155);
  line-height: 1.75;
  margin: 0;
}

/* ===== Gallery ===== */
.whd-gallery-card {
  position: relative;
  overflow: hidden;
  /* prevent 3D items from causing horizontal scroll */
}

.coverflow-carousel {
  position: relative;
  width: 100%;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  perspective: 1200px;
  overflow: hidden;
}

.coverflow-item {
  position: absolute;
  width: 460px;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  background: #0f172a;
  border: 2px solid #fff;
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;
}

.coverflow-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.coverflow-item.active {
  transform: translateX(0) scale(1) translateZ(0);
  z-index: 3;
  opacity: 1;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.coverflow-item.prev {
  transform: translateX(-40%) scale(0.85) translateZ(-100px);
  z-index: 2;
  opacity: 0.6;
}

.coverflow-item.next {
  transform: translateX(40%) scale(0.85) translateZ(-100px);
  z-index: 2;
  opacity: 0.6;
}

.coverflow-item.hidden {
  transform: translateX(0) scale(0.6) translateZ(-200px);
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}

.coverflow-hover {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.coverflow-item.active:hover .coverflow-hover {
  opacity: 1;
}

.coverflow-item.active:hover img {
  transform: scale(1.08);
}

.coverflow-hover i {
  color: #fff;
  font-size: 2.5rem;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.coverflow-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.3s forwards 0.3s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--border, #e2e8f0);
  color: var(--primary, #2563eb);
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.2s;
}

.carousel-nav:hover {
  background: var(--primary, #2563eb);
  color: #fff;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

.carousel-nav.prev {
  left: 10px;
}

.carousel-nav.next {
  right: 10px;
}

/* Responsive adjustments for Coverflow */
@media (max-width: 992px) {
  .coverflow-item {
    width: 400px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .coverflow-carousel {
    height: 280px;
  }

  .coverflow-item {
    width: 80%;
    height: 220px;
  }

  .coverflow-item.prev {
    transform: translateX(-35%) scale(0.8) translateZ(-50px);
  }

  .coverflow-item.next {
    transform: translateX(35%) scale(0.8) translateZ(-50px);
  }
}

/* Fallback Grid */
.whd-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.whd-gallery-item {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4/3;
  background: #0f172a;
}

.whd-gallery-item.single-item {
  max-width: 300px;
}

.whd-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.whd-gallery-item:hover .whd-gallery-img {
  transform: scale(1.08);
}

.whd-gallery-hover {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.whd-gallery-item:hover .whd-gallery-hover {
  opacity: 1;
}

.whd-gallery-hover i {
  color: #fff;
  font-size: 1.5rem;
}

.whd-gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  font-size: 0.78rem;
  font-weight: 500;
}

/* ===== Sidebar ===== */
.whd-widget-dark {
  background: linear-gradient(135deg, #0f172a, #1e3a5f);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.whd-widget-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.4), transparent);
  border-radius: 50%;
}

.whd-widget-dark h4 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 10px;
  position: relative;
}

.whd-widget-dark p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0 0 18px;
  position: relative;
}

.whd-widget-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.whd-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  background: var(--primary, #2563eb);
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.whd-btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.whd-btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  background: #25d366;
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}

.whd-btn-whatsapp:hover {
  background: #1fb855;
  transform: translateY(-2px);
}

.whd-widget-light {
  background: var(--card-bg, #fff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border, rgba(0, 0, 0, 0.05));
}

.whd-widget-light h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--heading, #0f172a);
  margin: 0 0 16px;
}

.whd-feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.whd-feature-list li {
  display: flex;
  align-items: center;
  gap: 14px;
}

.whd-feat-icon {
  width: 38px;
  height: 38px;
  background: #eff6ff;
  color: var(--primary, #2563eb);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.whd-feat-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text, #334155);
}

/* ===== Not Found ===== */
.whd-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.whd-error-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
}

.whd-not-found h2 {
  font-weight: 700;
  color: var(--heading, #0f172a);
  margin-bottom: 8px;
}

.whd-not-found p {
  color: var(--text-light, #64748b);
  margin-bottom: 20px;
}

.whd-btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid var(--primary, #2563eb);
  color: var(--primary, #2563eb);
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.whd-btn-outline:hover {
  background: var(--primary, #2563eb);
  color: #fff;
}

/* ===== Loading ===== */
.whd-loading {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== Lightbox ===== */
.whd-lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.whd-lb-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.whd-lb-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.whd-lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.whd-lb-prev {
  left: 20px;
}

.whd-lb-next {
  right: 20px;
}

.whd-lb-nav:hover {
  background: rgba(255, 255, 255, 0.25);
}

.whd-lb-content {
  max-width: 85vw;
  max-height: 85vh;
  text-align: center;
}

.whd-lb-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

.whd-lb-info {
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.whd-lb-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 500;
}

/* ===== Responsive ===== */
@media (max-width: 992px) {
  .whd-layout {
    grid-template-columns: 1fr;
  }

  .whd-hero-text h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .whd-hero {
    min-height: 280px;
  }

  .whd-specs-grid {
    grid-template-columns: 1fr;
  }

  .whd-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }

  .whd-card {
    padding: 24px;
  }
}
</style>
