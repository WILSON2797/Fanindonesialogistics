<template>
  <div class="svd-page">
    <!-- Loading -->
    <div v-if="loading" class="svd-loading">
      <div class="loader-spinner"></div>
    </div>

    <!-- Main Content (Unified Executive Dossier Layout Matching ServiceDetail) -->
    <div v-else-if="warehouse">
      <!-- Executive Split Hero Header -->
      <section class="svd-header" :style="heroStyle">
        <div class="svd-photo-overlay"></div>

        <div class="container svd-header-inner">
          <div class="svd-topbar" data-aos="fade-down">
            <router-link to="/warehouse" class="svd-back-link">
              <i class="bi bi-arrow-left"></i>
              <span>Back to Warehouses</span>
            </router-link>
            <div class="svd-breadcrumb-trail">
              <router-link to="/">Home</router-link>
              <span>/</span>
              <router-link to="/warehouse">Our Warehouse</router-link>
              <span>/</span>
              <span class="svd-curr">{{ warehouse.name }}</span>
            </div>
          </div>

          <div class="svd-hero-split" data-aos="fade-up">
            <div class="svd-header-content">
              <div class="svd-kicker-row">
                <span class="svd-kicker-code">{{ warehouse.type || 'FACILITY' }}</span>
                <span class="svd-kicker-sep">/</span>
                <span class="svd-kicker-cat">{{ formatRegion(warehouse.region) }}</span>
              </div>

              <h1 class="svd-title">{{ warehouse.name }}</h1>

              <p class="svd-lead">
                {{ cleanDescription }}
              </p>
            </div>

            <div class="svd-hero-meta-box">
              <div class="svd-hmeta-item" v-if="warehouse.area">
                <span class="svd-hmeta-lbl">STORAGE CAPACITY</span>
                <strong class="svd-hmeta-val">{{ formatArea(warehouse.area) }}</strong>
              </div>
              <div class="svd-hmeta-item" v-if="warehouse.region">
                <span class="svd-hmeta-lbl">REGIONAL CORRIDOR</span>
                <strong class="svd-hmeta-val">{{ formatRegion(warehouse.region) }}</strong>
              </div>
              <div class="svd-hmeta-item" v-if="warehouse.project">
                <span class="svd-hmeta-lbl">DEDICATED PROJECT</span>
                <strong class="svd-hmeta-val">{{ warehouse.project }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Body Section -->
      <section class="svd-body-section">
        <div class="container">
          <div class="svd-main-grid">
            <!-- Left Column -->
            <div class="svd-primary-col" data-aos="fade-up" data-aos-delay="50">
              <!-- Panel 1: Facility Technical Specifications -->
              <div class="svd-panel">
                <div class="svd-panel-head">
                  <div>
                    <span class="svd-panel-eyebrow">01 // FACILITY SPECIFICATIONS</span>
                    <h2 class="svd-panel-title">Technical Profile &amp; Parameters</h2>
                  </div>
                  <div class="svd-panel-icon">
                    <i class="bi bi-building"></i>
                  </div>
                </div>

                <div class="svd-prose">
                  <p class="svd-prose-lead">{{ cleanDescription }}</p>
                </div>

                <div class="svd-scope-grid" style="margin-top: 20px;">
                  <div class="svd-scope-item" v-if="warehouse.area">
                    <div class="svd-scope-top">
                      <span class="svd-scope-num">01</span>
                      <h3 class="svd-scope-name">Warehouse Floor Area</h3>
                    </div>
                    <p class="svd-scope-text">Kapasitas ruang penyimpanan aktif seluas <strong>{{ formatArea(warehouse.area) }}</strong> dengan tata letak racking &amp; staging terstruktur.</p>
                  </div>

                  <div class="svd-scope-item" v-if="warehouse.type">
                    <div class="svd-scope-top">
                      <span class="svd-scope-num">02</span>
                      <h3 class="svd-scope-name">Facility Classification ({{ warehouse.type }})</h3>
                    </div>
                    <p class="svd-scope-text">Beroperasi sebagai <strong>{{ warehouse.type }}</strong> dengan standar penerimaan, penyimpanan, dan pengeluaran material yang terukur.</p>
                  </div>

                  <div class="svd-scope-item" v-if="warehouse.region">
                    <div class="svd-scope-top">
                      <span class="svd-scope-num">03</span>
                      <h3 class="svd-scope-name">Regional Hub ({{ formatRegion(warehouse.region) }})</h3>
                    </div>
                    <p class="svd-scope-text">Lokasi strategis dengan akses langsung ke jalur distribusi darat dan pelabuhan/bandara regional.</p>
                  </div>

                  <div class="svd-scope-item" v-if="warehouse.project">
                    <div class="svd-scope-top">
                      <span class="svd-scope-num">04</span>
                      <h3 class="svd-scope-name">Project Handling ({{ warehouse.project }})</h3>
                    </div>
                    <p class="svd-scope-text">Pengelolaan perangkat dan material khusus untuk mendukung operasional proyek <strong>{{ warehouse.project }}</strong>.</p>
                  </div>
                </div>
              </div>

              <!-- Panel 2: Facility Highlights (Dynamic or Standard) -->
              <div class="svd-panel">
                <div class="svd-panel-head">
                  <div>
                    <span class="svd-panel-eyebrow">02 // OPERATIONAL CAPABILITIES</span>
                    <h2 class="svd-panel-title">Warehouse Highlights &amp; Security</h2>
                  </div>
                </div>

                <div class="svd-standards-grid" v-if="highlights.length > 0">
                  <div class="svd-std-card" v-for="h in highlights" :key="h.id">
                    <div class="svd-std-icon"><i :class="'bi ' + (h.icon || 'bi-check2-circle')"></i></div>
                    <div>
                      <strong>{{ h.text }}</strong>
                      <p>Standar operasional terverifikasi untuk keamanan dan akurasi inventori.</p>
                    </div>
                  </div>
                </div>
                <div class="svd-standards-grid" v-else>
                  <div class="svd-std-card">
                    <div class="svd-std-icon"><i class="bi bi-shield-check"></i></div>
                    <div>
                      <strong>24/7 Security &amp; CCTV</strong>
                      <p>Pengawasan keamanan penuh 24 jam, akses terbatas, dan sistem proteksi kebakaran.</p>
                    </div>
                  </div>
                  <div class="svd-std-card">
                    <div class="svd-std-icon"><i class="bi bi-boxes"></i></div>
                    <div>
                      <strong>WMS Inventory Control</strong>
                      <p>Pencatatan stok masuk/keluar secara real-time dengan tingkat akurasi tinggi.</p>
                    </div>
                  </div>
                  <div class="svd-std-card">
                    <div class="svd-std-icon"><i class="bi bi-truck-flatbed"></i></div>
                    <div>
                      <strong>Loading &amp; Cross-Docking</strong>
                      <p>Area bongkar muat memadai untuk mempercepat siklus distribusi ke site tujuan.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Panel 3: Facility Gallery (If images exist) -->
              <div class="svd-panel" v-if="gallery.length > 0">
                <div class="svd-panel-head">
                  <div>
                    <span class="svd-panel-eyebrow">03 // VISUAL DOCUMENTATION</span>
                    <h2 class="svd-panel-title">Facility Photo Gallery</h2>
                  </div>
                  <span class="svd-panel-badge">{{ gallery.length }} Photos</span>
                </div>

                <div class="whd-clean-gallery">
                  <div
                    class="whd-gal-card"
                    v-for="(g, gIdx) in gallery"
                    :key="g.id || gIdx"
                    @click="openLightbox(gIdx)"
                  >
                    <img :src="getImageUrl(g.image_path)" :alt="g.caption || warehouse.name" loading="lazy" />
                    <div class="whd-gal-overlay">
                      <i class="bi bi-arrows-fullscreen"></i>
                      <span v-if="g.caption">{{ g.caption }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Sticky Sidebar -->
            <aside class="svd-sidebar" data-aos="fade-up" data-aos-delay="100">
              <div class="svd-action-panel">
                <div class="svd-action-top">
                  <span class="svd-panel-kicker">WAREHOUSE DESK</span>
                  <span class="svd-online-badge"><span class="svd-online-dot"></span> Active</span>
                </div>
                <h4>Inquire About {{ warehouse.name }}</h4>
                <p>
                  Get a tailored storage quotation, dedicated DOP space allocation, or WMS fulfillment proposal.
                </p>

                <div class="svd-action-meta">
                  <div class="svd-ameta-row" v-if="warehouse.area">
                    <span>Total Area</span>
                    <strong>{{ formatArea(warehouse.area) }}</strong>
                  </div>
                  <div class="svd-ameta-row" v-if="warehouse.region">
                    <span>Region</span>
                    <strong>{{ formatRegion(warehouse.region) }}</strong>
                  </div>
                </div>

                <div class="svd-action-btns">
                  <router-link to="/quote" class="svd-btn-quote">
                    <span>Request Storage Quote</span>
                    <i class="bi bi-arrow-up-right"></i>
                  </router-link>
                  <a
                    href="https://wa.me/6281252206828"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="svd-btn-wa"
                  >
                    <i class="bi bi-whatsapp"></i>
                    <span>Consult via WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- All Warehouses Directory Switcher -->
              <div class="svd-directory-panel" v-if="allWarehouses.length > 1">
                <div class="svd-dir-header">
                  <span>All Warehouse Locations</span>
                  <span class="svd-dir-count">{{ allWarehouses.length }}</span>
                </div>
                <nav class="svd-dir-nav">
                  <router-link
                    v-for="(item, idx) in allWarehouses"
                    :key="item.id"
                    :to="'/warehouse/' + item.id"
                    class="svd-dir-link"
                    :class="{ active: String(item.id) === String(warehouse.id) }"
                  >
                    <span class="svd-dir-idx">{{ String(idx + 1).padStart(2, '0') }}</span>
                    <span class="svd-dir-name">{{ item.name }}</span>
                    <i class="bi bi-arrow-right"></i>
                  </router-link>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="svd-not-found">
      <div class="container">
        <div class="svd-nf-box">
          <span class="svd-nf-code">404</span>
          <h2>Warehouse Not Found</h2>
          <p>Sorry, the warehouse facility you are looking for is not available.</p>
          <router-link to="/warehouse" class="svd-btn-back">
            <i class="bi bi-arrow-left"></i> View All Warehouses
          </router-link>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <teleport to="body">
      <div class="lightbox-overlay" v-if="lightbox.show" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
        <button class="lightbox-nav lightbox-prev" @click.stop="prevImage" v-if="gallery.length > 1">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="lightbox-content" v-if="currentLightboxImage">
          <img :src="getImageUrl(currentLightboxImage.image_path)" :alt="currentLightboxImage.caption || warehouse.name" class="lightbox-img" />
          <div class="lightbox-info" v-if="currentLightboxImage.caption">
            <p>{{ currentLightboxImage.caption }}</p>
          </div>
        </div>
        <button class="lightbox-nav lightbox-next" @click.stop="nextImage" v-if="gallery.length > 1">
          <i class="bi bi-chevron-right"></i>
        </button>
        <div class="lightbox-counter">{{ lightbox.index + 1 }} / {{ gallery.length }}</div>
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
      allWarehouses: [],
      gallery: [],
      highlights: [],
      loading: true,
      lightbox: {
        show: false,
        index: 0
      }
    };
  },
  computed: {
    heroStyle() {
      const url = this.getHeroImage(this.warehouse);
      return url ? { backgroundImage: `url('${url}')` } : {};
    },
    cleanDescription() {
      if (!this.warehouse) return '';
      const w = this.warehouse;
      const desc = (w.description || '').trim();
      if (!desc || desc.length <= 28) {
        const proj = w.project ? `Project ${w.project}` : 'enterprise supply chain';
        const reg = this.formatRegion(w.region);
        return `Fasilitas ${w.type || 'Gudang'} terstandarisasi seluas ${this.formatArea(w.area)} di wilayah ${reg} untuk mendukung penyimpanan, manajemen inventori WMS, dan distribusi ${proj}.`;
      }
      return desc;
    },
    currentLightboxImage() {
      return this.gallery[this.lightbox.index] || null;
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadWarehouse();
      }
    }
  },
  async mounted() {
    await this.loadWarehouse();
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
  },
  methods: {
    async loadWarehouse() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        const [wRes, gRes, hRes, listRes] = await Promise.all([
          api.getWarehouseById(id),
          api.getWarehouseGallery(id),
          api.getWarehouseHighlights(id),
          this.allWarehouses.length ? Promise.resolve({ data: this.allWarehouses }) : api.getWarehouses()
        ]);
        this.warehouse = wRes && wRes.success ? wRes.data : null;
        this.gallery = (gRes && gRes.data) || [];
        this.highlights = (hRes && hRes.data) || [];
        if (listRes && listRes.data) {
          this.allWarehouses = listRes.data;
        }
      } catch (e) {
        console.error('Failed to load warehouse detail:', e);
      } finally {
        this.loading = false;
      }
      this.$nextTick(() => {
        if (window.AOS) window.AOS.refresh();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    formatRegion(region) {
      if (!region) return 'INDONESIA';
      return region.replace(/NORT\s+/i, 'NORTH ').toUpperCase();
    },
    formatArea(area) {
      if (!area) return 'Standard';
      const str = String(area).trim();
      if (/^\d+(\.\d+)?$/.test(str)) {
        return `${str} m²`;
      }
      return str;
    },
    getImageUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const base = this.$baseDir || window.BASE_DIR || '';
      return base + '/' + path.replace(/^\/+/, '');
    },
    getHeroImage(w) {
      if (!w) return '';
      if (w.image_path && w.image_path.trim() !== '') {
        return this.getImageUrl(w.image_path);
      }
      return this.getImageUrl('uploads/services/feed12b0996405f98ac0.jpg');
    },
    openLightbox(idx) {
      this.lightbox.index = idx;
      this.lightbox.show = true;
      document.body.style.overflow = 'hidden';
    },
    closeLightbox() {
      this.lightbox.show = false;
      document.body.style.overflow = '';
    },
    prevImage() {
      if (!this.gallery.length) return;
      this.lightbox.index = (this.lightbox.index - 1 + this.gallery.length) % this.gallery.length;
    },
    nextImage() {
      if (!this.gallery.length) return;
      this.lightbox.index = (this.lightbox.index + 1) % this.gallery.length;
    },
    handleKeydown(e) {
      if (!this.lightbox.show) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    }
  }
};
</script>
