<template>
  <div class="warehouse-page">
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <h1 data-aos="fade-up">Our Warehouse</h1>
        <p data-aos="fade-up" data-aos-delay="100">Modern warehousing solutions across Indonesia, tailored for your logistics needs.</p>
      </div>
    </section>

    <section class="warehouse-showcase">
      <div class="container">
        <div class="sec-header-center" data-aos="fade-up" style="text-align: center; max-width: 700px; margin: 0 auto;">
          <span class="sec-label">Our Warehouse</span>
          <h2 class="sec-title">Strategic <span>Warehouse</span> Locations</h2>
          <p class="sec-desc">Our warehouses are strategically located to ensure efficient storage and distribution across regions.</p>
        </div>

        <div class="warehouse-grid">
          <div
            class="warehouse-card"
            v-for="(w, i) in warehouses"
            :key="w.id"
            data-aos="fade-up"
            :data-aos-delay="i * 100"
          >
            <div class="warehouse-img-wrapper">
              <img :src="getWarehouseImage(w)" :alt="w.name" class="warehouse-img">
              <div class="warehouse-overlay">
                <div class="warehouse-badge">{{ w.type || 'General' }}</div>
              </div>
            </div>
            <div class="warehouse-info">
              <h3 class="warehouse-name">{{ w.name }}</h3>

              <div class="warehouse-specs">
                <div class="w-spec-item" v-if="w.area">
                  <i class="bi bi-arrows-fullscreen"></i>
                  <span><strong>Area:</strong> {{ w.area }}</span>
                </div>
                <div class="w-spec-item" v-if="w.type">
                  <i class="bi bi-building"></i>
                  <span><strong>Type:</strong> {{ w.type }}</span>
                </div>
                <div class="w-spec-item" v-if="w.region">
                  <i class="bi bi-geo-alt-fill"></i>
                  <span><strong>Region:</strong> {{ w.region }}</span>
                </div>
                <div class="w-spec-item" v-if="w.project">
                  <i class="bi bi-briefcase-fill"></i>
                  <span><strong>Project:</strong> {{ w.project }}</span>
                </div>
              </div>

              <p class="warehouse-desc" v-if="w.description">{{ w.description }}</p>

              <div class="warehouse-footer">
                <router-link :to="'/warehouse/' + w.id" class="btn-detail">
                  View Details <i class="bi bi-arrow-right"></i>
                </router-link>
                <span class="warehouse-status"><span class="status-dot"></span> Active</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="warehouses.length === 0 && !loading" class="warehouse-empty" data-aos="fade-up">
          <i class="bi bi-building"></i>
          <p>Warehouse data is being updated. Please check back soon.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'Warehouse',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      warehouses: [],
      loading: true
    };
  },
  async mounted() {
    try {
      const r = await api.getWarehouses();
      this.warehouses = r.data || [];
    } catch (e) {
      console.error('Failed to load warehouses:', e);
    }
    this.loading = false;
    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  },
  methods: {
    getWarehouseImage(w) {
      if (!w) return '';
      if (w.image_path) {
        const base = window.BASE_DIR || '';
        return base + '/' + w.image_path;
      }
      return '';
    }
  }
};
</script>

<style scoped>
.warehouse-showcase {
  padding-bottom: 100px;
}

.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
  margin-top: 50px;
}

.warehouse-card {
  background: var(--card-bg, #fff);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  transition: transform 0.35s cubic-bezier(.4,0,.2,1), box-shadow 0.35s ease;
  border: 1px solid var(--border, rgba(0,0,0,0.06));
}

.warehouse-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.13);
}

.warehouse-img-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #0f172a;
}

.warehouse-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.warehouse-card:hover .warehouse-img {
  transform: scale(1.06);
}

.warehouse-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%);
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.warehouse-badge {
  background: var(--primary, #2563eb);
  color: #fff;
  padding: 4px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.warehouse-info {
  padding: 18px 20px 18px;
}

.warehouse-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--heading, #0f172a);
  margin: 0 0 14px;
}

.warehouse-specs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.w-spec-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text, #334155);
}

.w-spec-item i {
  color: var(--primary, #2563eb);
  font-size: 0.95rem;
  flex-shrink: 0;
  width: 18px;
  text-align: center;
}

.warehouse-desc {
  font-size: 0.88rem;
  color: var(--text-light, #64748b);
  line-height: 1.6;
  margin-bottom: 16px;
}

.warehouse-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--border, rgba(0,0,0,0.06));
}

.warehouse-footer .btn-detail {
  color: var(--primary, #2563eb);
  font-weight: 600;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.warehouse-footer .btn-detail:hover {
  gap: 10px;
}

.warehouse-status {
  font-size: 0.8rem;
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.warehouse-status .status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.warehouse-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light, #64748b);
}

.warehouse-empty i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.3;
}

@media (max-width: 768px) {
  .warehouse-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .warehouse-img-wrapper {
    height: 180px;
  }
}
</style>
