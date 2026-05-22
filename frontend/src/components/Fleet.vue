<template>
  <div class="fleet-page">
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <h1 data-aos="fade-up">Our Fleet</h1>
        <p data-aos="fade-up" data-aos-delay="100">Complete transportation solutions with a modern, robust, and reliable
          fleet.</p>
      </div>
    </section>

    <section class="fleet-showcase">
      <div class="container">
        <div class="sec-header-center" data-aos="fade-up">
          <span class="sec-label">Our Fleet</span>
          <h2 class="sec-title">The Best <span>Fleet</span> Selection</h2>
          <p class="sec-desc">We provide various fleet types to ensure your shipments are safe and on time.</p>
        </div>

        <div class="fleet-grid">
          <div class="fleet-card" v-for="(f, i) in fleet" :key="f.id" :class="{ 'is-expanded': expandedId === f.id }"
            data-aos="fade-up" :data-aos-delay="i * 100">
            <div class="fleet-img-wrapper" @click="toggleExpand(f.id)">
              <img :src="getFleetImage(f)" :alt="f.name" class="fleet-img">
              <div class="fleet-overlay">
                <div class="fleet-badge">{{ f.type || 'Standard' }}</div>
              </div>
            </div>
            <div class="fleet-info">
              <h3 class="fleet-name">{{ f.name }}</h3>
              <div class="fleet-specs">
                <div class="f-spec-item">
                  <i class="bi bi-box-seam"></i>
                  <span><strong>Capacity:</strong> {{ f.capacity || 'N/A' }}</span>
                </div>

                <!-- Preview Description (Hidden when expanded) -->
                <div class="f-spec-item" v-if="expandedId !== f.id">
                  <i class="bi bi-info-circle"></i>
                  <span class="f-desc-preview">{{ truncate(f.description, 40) }}</span>
                </div>
              </div>

              <!-- Expanded Content -->
              <transition name="expand">
                <div class="fleet-expanded-content" v-if="expandedId === f.id">
                  <div class="f-expanded-inner">
                    <h4>Full Description</h4>
                    <p>{{ f.description || 'No additional description available.' }}</p>
                    <div class="f-expanded-action">
                      <router-link to="/quote" class="btn btn-primary btn-sm">Request a Quote</router-link>
                    </div>
                  </div>
                </div>
              </transition>

              <div class="fleet-footer">
                <button class="btn-detail" @click="toggleExpand(f.id)">
                  {{ expandedId === f.id ? 'Close Details' : 'View Details' }}
                  <i class="bi" :class="expandedId === f.id ? 'bi-chevron-up' : 'bi-arrow-right'"></i>
                </button>
                <span class="fleet-status"><span class="status-dot"></span> Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'Fleet',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fleet: [],
      expandedId: null
    };
  },
  async mounted() {
    try {
      const r = await api.getFleet();
      this.fleet = r.data || [];
    } catch (e) {
      console.error('Failed to load fleet:', e);
    }
    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  },
  methods: {
    getFleetImage(f) {
      if (!f) return '';
      if (f.image_path) {
        const base = window.BASE_DIR || '';
        return base + '/' + f.image_path;
      }

      const name = (f.name || '').toLowerCase();
      const path = 'assets/img/fleet/';

      if (name.includes('wingbox') || name.includes('tronton')) return path + 'wingbox.png';
      if (name.includes('fuso')) return path + 'fuso.png';
      if (name.includes('cdd')) return path + 'cdd.png';
      if (name.includes('cde')) return path + 'cde.png';
      if (name.includes('pickup') || name.includes('blind van')) return path + 'pickup.png';

      return path + 'fuso.png';
    },
    toggleExpand(id) {
      this.expandedId = this.expandedId === id ? null : id;
      // Small delay to let content expand then refresh AOS
      setTimeout(() => {
        if (window.AOS) window.AOS.refresh();
      }, 10);
    },
    truncate(str, len) {
      if (!str) return '';
      return str.length > len ? str.substring(0, len) + '…' : str;
    }
  }
};
</script>

<style scoped>
/* Transisi untuk expand/collapse */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
