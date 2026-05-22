// ============================================
// Gallery Page — Masonry Grid + Lightbox + Lazy Loading
// ============================================
const Gallery = {
  template: `
    <div>
      <!-- Banner -->
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">Galeri</h1>
          <p data-aos="fade-up" data-aos-delay="100">Dokumentasi kegiatan dan fasilitas kami</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header" data-aos="fade-up">
            <div class="section-badge"><i class="bi bi-images"></i> Photo Gallery</div>
            <h2 class="section-title">Dokumentasi <span>Kami</span></h2>
            <p class="section-subtitle">Lihat berbagai aktivitas, armada, dan fasilitas kami melalui galeri foto</p>
          </div>

          <!-- Category Filter -->
          <div class="gallery-filters" data-aos="fade-up" data-aos-delay="100">
            <button
              class="gallery-filter-btn"
              :class="{active: activeCategory === 'all'}"
              @click="filterCategory('all')"
            >
              <i class="bi bi-grid-3x3-gap-fill"></i> Semua
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              class="gallery-filter-btn"
              :class="{active: activeCategory === cat}"
              @click="filterCategory(cat)"
            >
              <i :class="getCategoryIcon(cat)"></i> {{ capitalize(cat) }}
            </button>
          </div>

          <!-- Skeleton Loading -->
          <div class="gallery-grid" v-if="loading">
            <div class="gallery-item skeleton-gallery" v-for="n in 6" :key="'sk'+n">
              <div class="skeleton-img"></div>
            </div>
          </div>

          <!-- Gallery Grid -->
          <div class="gallery-grid" v-else>
            <div
              class="gallery-item"
              v-for="(item, i) in filteredItems"
              :key="item.id"
              data-aos="fade-up"
              :data-aos-delay="(i % 3) * 100"
              @click="openLightbox(i)"
            >
              <div class="gallery-img-wrap">
                <img
                  v-if="item.image_path"
                  :data-src="$baseDir + '/' + item.image_path"
                  :alt="item.title"
                  class="gallery-img lazy-img"
                >
                <div class="gallery-placeholder" v-else>
                  <i class="bi bi-image"></i>
                </div>
                <div class="gallery-overlay">
                  <div class="gallery-overlay-content">
                    <i class="bi bi-arrows-fullscreen"></i>
                    <h4>{{ item.title }}</h4>
                    <span class="gallery-cat-tag">{{ capitalize(item.category) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-customers" v-if="!loading && filteredItems.length === 0">
            <i class="bi bi-images"></i>
            <h3>Belum ada foto di galeri</h3>
            <p>Foto-foto akan segera ditambahkan</p>
          </div>
        </div>
      </section>

      <!-- Lightbox Modal -->
      <teleport to="body">
        <div class="lightbox-overlay" v-if="lightbox.show" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
          <button class="lightbox-nav lightbox-prev" @click.stop="prevImage" v-if="filteredItems.length > 1">
            <i class="bi bi-chevron-left"></i>
          </button>
          <div class="lightbox-content">
            <img
              v-if="currentLightboxItem && currentLightboxItem.image_path"
              :src="$baseDir + '/' + currentLightboxItem.image_path"
              :alt="currentLightboxItem.title"
              class="lightbox-img"
            >
            <div class="lightbox-placeholder" v-else>
              <i class="bi bi-image" style="font-size:4rem;color:rgba(255,255,255,.3)"></i>
            </div>
            <div class="lightbox-info" v-if="currentLightboxItem">
              <h3>{{ currentLightboxItem.title }}</h3>
              <p v-if="currentLightboxItem.description">{{ currentLightboxItem.description }}</p>
              <span class="gallery-cat-tag">{{ capitalize(currentLightboxItem.category) }}</span>
            </div>
          </div>
          <button class="lightbox-nav lightbox-next" @click.stop="nextImage" v-if="filteredItems.length > 1">
            <i class="bi bi-chevron-right"></i>
          </button>
          <div class="lightbox-counter">{{ lightbox.index + 1 }} / {{ filteredItems.length }}</div>
        </div>
      </teleport>
    </div>
  `,
  props: { hideBanner: { type: Boolean, default: false } },
  data() {
    return {
      items: [],
      categories: [],
      activeCategory: 'all',
      loading: true,
      observer: null,
      lightbox: {
        show: false,
        index: 0
      }
    };
  },
  computed: {
    filteredItems() {
      if (this.activeCategory === 'all') return this.items;
      return this.items.filter(i => i.category === this.activeCategory);
    },
    currentLightboxItem() {
      return this.filteredItems[this.lightbox.index] || null;
    }
  },
  async mounted() {
    try {
      const [g, c] = await Promise.all([
        api.getGallery(),
        api.getGalleryCategories()
      ]);
      this.items = g.data || [];
      this.categories = c.data || [];
    } catch (e) {
      console.warn('Failed to load gallery:', e);
    }
    this.loading = false;

    this.$nextTick(() => {
      this.initLazyLoading();
      if (window.AOS) AOS.refresh();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    getCategoryIcon(cat) {
      const icons = {
        armada: 'bi bi-truck',
        fasilitas: 'bi bi-building',
        tim: 'bi bi-people-fill',
        operasional: 'bi bi-gear-fill',
        general: 'bi bi-image'
      };
      return icons[cat] || 'bi bi-tag-fill';
    },
    filterCategory(cat) {
      this.activeCategory = cat;
      this.$nextTick(() => {
        this.initLazyLoading();
        if (window.AOS) AOS.refresh();
      });
    },
    initLazyLoading() {
      if (this.observer) this.observer.disconnect();
      const imgs = document.querySelectorAll('.lazy-img:not(.loaded)');
      if (!imgs.length) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
            }
            this.observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px',
        threshold: 0.1
      });

      imgs.forEach(img => this.observer.observe(img));
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
      this.lightbox.index = (this.lightbox.index - 1 + this.filteredItems.length) % this.filteredItems.length;
    },
    nextImage() {
      this.lightbox.index = (this.lightbox.index + 1) % this.filteredItems.length;
    },
    handleKeydown(e) {
      if (!this.lightbox.show) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    }
  }
};
