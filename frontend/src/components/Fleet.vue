<template>
  <div class="fleet-page" :class="{ 'flt-is-page': !hideBanner }">
    <!-- STANDALONE PAGE BANNER -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <div class="ent-banner-inner" data-aos="fade-up">
          <div class="ent-breadcrumb">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <span>Our Fleet</span>
          </div>
          <h1>Fleet Assets &amp; Transport Specifications</h1>
          <p>
            Modern, GPS-equipped commercial vehicles ranging from agile urban pickups to heavy-duty tronton and wingbox units.
          </p>
        </div>
      </div>
    </section>

    <!-- FLEET CATALOG SECTION -->
    <section class="flt-section">
      <div class="container">
        <!-- Editorial Header + Category Filter Bar -->
        <div class="flt-top-hdr" data-aos="fade-up">
          <div class="flt-title-col">
            <span class="flt-kicker-mono">03 // FLEET &amp; TRANSPORT ASSETS</span>
            <h2 class="flt-heading">Commercial Fleet Lineup</h2>
          </div>

          <div class="svc-filter-bar" v-if="fleet.length > 0">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              type="button"
              class="svc-filter-tab"
              :class="{ active: activeFilter === tab.key }"
              @click="activeFilter = tab.key"
            >
              <span>{{ tab.label }}</span>
              <span class="svc-filter-count">{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <!-- Uniform Modern Fleet Grid (Matching Services Card Aesthetic) -->
        <div class="flt-modern-grid" v-if="filteredFleet.length > 0">
          <article
            class="flt-card"
            v-for="(f, i) in filteredFleet"
            :key="f.id"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 50"
            @click="openModal(f)"
          >
            <!-- Top Media Panel -->
            <div class="flt-card-media">
              <img :src="getFleetImage(f)" :alt="f.name" class="flt-card-img" loading="lazy" />
              <div class="flt-card-badges">
                <span class="flt-status-pill">
                  <span class="flt-status-dot"></span> GPS Ready
                </span>
                <span class="flt-cap-pill" v-if="f.capacity">
                  <i class="bi bi-box-seam"></i> {{ f.capacity }}
                </span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="flt-card-body">
              <div class="flt-card-meta">
                <span class="flt-meta-idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="flt-meta-sep">/</span>
                <span class="flt-meta-type">{{ f.type || 'Commercial Unit' }}</span>
                <span class="flt-meta-icon">
                  <i class="bi bi-truck"></i>
                </span>
              </div>

              <h3 class="flt-card-title">{{ f.name }}</h3>
              <p class="flt-card-desc">{{ f.description || getDefaultDescription(f) }}</p>

              <!-- 2-Column Technical Specs Checklist -->
              <div class="flt-card-specs">
                <div class="flt-spec-chip">
                  <i class="bi bi-check2"></i>
                  <span>Payload: <strong>{{ f.capacity || 'Standard' }}</strong></span>
                </div>
                <div class="flt-spec-chip">
                  <i class="bi bi-check2"></i>
                  <span>{{ getVehicleSpec(f).dimension }}</span>
                </div>
                <div class="flt-spec-chip">
                  <i class="bi bi-check2"></i>
                  <span>{{ getVehicleSpec(f).route }}</span>
                </div>
                <div class="flt-spec-chip">
                  <i class="bi bi-check2"></i>
                  <span>24/7 GPS Telemetry</span>
                </div>
              </div>

              <div class="flt-card-cta">
                <span>View Vehicle Specifications</span>
                <span class="flt-card-arrow">
                  <i class="bi bi-arrow-up-right"></i>
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div class="svc-empty-box" v-else>
          <i class="bi bi-truck"></i>
          <p>No fleet units found in this category.</p>
        </div>
      </div>
    </section>

    <!-- MODERN VEHICLE SPECIFICATION MODAL (Replaces Clumsy Inline Expand) -->
    <teleport to="body">
      <transition name="flt-modal-fade">
        <div class="flt-modal-backdrop" v-if="selectedFleet" @click.self="closeModal">
          <div class="flt-modal-dialog" role="dialog" aria-modal="true">
            <button class="flt-modal-close" @click="closeModal" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>

            <div class="flt-modal-grid">
              <!-- Left Column: Vehicle Visual & Quick Switcher -->
              <div class="flt-modal-visual">
                <div class="flt-modal-img-wrap">
                  <img :src="getFleetImage(selectedFleet)" :alt="selectedFleet.name" class="flt-modal-img" />
                  <div class="flt-modal-badges">
                    <span class="flt-status-pill">
                      <span class="flt-status-dot"></span> Operational &amp; Ready
                    </span>
                  </div>
                </div>

                <!-- Prev / Next Vehicle Switcher Bar -->
                <div class="flt-modal-switcher" v-if="fleet.length > 1">
                  <button type="button" class="flt-switch-btn" @click="stepFleet(-1)">
                    <i class="bi bi-arrow-left"></i>
                    <span>Previous Unit</span>
                  </button>
                  <span class="flt-switch-count">
                    {{ currentModalIndex + 1 }} / {{ fleet.length }}
                  </span>
                  <button type="button" class="flt-switch-btn" @click="stepFleet(1)">
                    <span>Next Unit</span>
                    <i class="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>

              <!-- Right Column: Detailed Technical Dossier -->
              <div class="flt-modal-info">
                <div class="flt-modal-kicker">
                  <span class="flt-meta-idx">{{ String(currentModalIndex + 1).padStart(2, '0') }}</span>
                  <span class="flt-meta-sep">/</span>
                  <span class="flt-meta-type">{{ selectedFleet.type || 'COMMERCIAL FLEET' }}</span>
                </div>

                <h2 class="flt-modal-title">{{ selectedFleet.name }}</h2>
                <p class="flt-modal-desc">
                  {{ selectedFleet.description || getDefaultDescription(selectedFleet) }}
                </p>

                <!-- 4-Card Technical Specification Grid -->
                <div class="flt-modal-spec-grid">
                  <div class="flt-mspec-box">
                    <span class="flt-mspec-lbl">MAX PAYLOAD CAPACITY</span>
                    <strong class="flt-mspec-val">{{ selectedFleet.capacity || 'Contact Desk' }}</strong>
                  </div>
                  <div class="flt-mspec-box">
                    <span class="flt-mspec-lbl">VEHICLE CLASS</span>
                    <strong class="flt-mspec-val">{{ selectedFleet.type || 'Standard Commercial' }}</strong>
                  </div>
                  <div class="flt-mspec-box">
                    <span class="flt-mspec-lbl">ESTIMATED LOAD PROFILE</span>
                    <strong class="flt-mspec-val">{{ getVehicleSpec(selectedFleet).dimension }}</strong>
                  </div>
                  <div class="flt-mspec-box">
                    <span class="flt-mspec-lbl">PRIMARY DEPLOYMENT</span>
                    <strong class="flt-mspec-val">{{ getVehicleSpec(selectedFleet).route }}</strong>
                  </div>
                </div>

                <!-- Standard Equipment & Safety -->
                <div class="flt-modal-features">
                  <h4>Standard Operational Equipment</h4>
                  <div class="flt-mfeat-list">
                    <span><i class="bi bi-check2-circle"></i> Real-Time GPS &amp; Route Telemetry</span>
                    <span><i class="bi bi-check2-circle"></i> Preventive Maintenance &amp; K3 Checked</span>
                    <span><i class="bi bi-check2-circle"></i> Certified Driver &amp; Cargo Securing Gear</span>
                    <span><i class="bi bi-check2-circle"></i> FTL, LTL &amp; Dedicated Contract Options</span>
                  </div>
                </div>

                <!-- Modal Conversion Actions -->
                <div class="flt-modal-actions">
                  <router-link to="/quote" class="flt-btn-primary" @click="closeModal">
                    <span>Request Quote for {{ selectedFleet.name }}</span>
                    <i class="bi bi-arrow-up-right"></i>
                  </router-link>
                  <a
                    :href="getWhatsAppLink(selectedFleet)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flt-btn-wa"
                  >
                    <i class="bi bi-whatsapp"></i>
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
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
      activeFilter: 'all',
      selectedFleet: null
    };
  },
  computed: {
    filterTabs() {
      const counts = {
        all: this.fleet.length,
        light: 0,
        medium: 0,
        heavy: 0
      };
      this.fleet.forEach(f => {
        const g = this.getFleetGroup(f);
        if (counts[g] !== undefined) counts[g]++;
      });
      return [
        { key: 'all', label: 'All Units', count: counts.all },
        { key: 'light', label: 'Light & Urban', count: counts.light },
        { key: 'medium', label: 'Medium & Box', count: counts.medium },
        { key: 'heavy', label: 'Heavy & Wingbox', count: counts.heavy }
      ].filter(t => t.key === 'all' || t.count > 0);
    },
    filteredFleet() {
      if (this.activeFilter === 'all') return this.fleet;
      return this.fleet.filter(f => this.getFleetGroup(f) === this.activeFilter);
    },
    currentModalIndex() {
      if (!this.selectedFleet || !this.fleet.length) return 0;
      const idx = this.fleet.findIndex(item => String(item.id) === String(this.selectedFleet.id));
      return idx >= 0 ? idx : 0;
    }
  },
  async mounted() {
    try {
      const r = await api.getFleet();
      this.fleet = r.data || [];
    } catch (e) {
      console.error('Failed to load fleet:', e);
    }
    document.addEventListener('keydown', this.handleKeydown);
    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
  },
  methods: {
    getFleetGroup(f) {
      const text = ((f.name || '') + ' ' + (f.type || '')).toLowerCase();
      if (text.includes('tronton') || text.includes('fuso') || text.includes('heavy') || text.includes('wing')) {
        return 'heavy';
      }
      if (text.includes('pickup') || text.includes('cde') || text.includes('light') || text.includes('van')) {
        return 'light';
      }
      return 'medium';
    },
    getFleetImage(f) {
      if (!f) return '';
      const base = this.$baseDir || window.BASE_DIR || '';
      if (f.image_path && f.image_path.trim() !== '') {
        return base + '/' + f.image_path.replace(/^\/+/, '');
      }

      const name = (f.name || '').toLowerCase();
      const path = base + '/assets/img/fleet/';

      if (name.includes('wing') || name.includes('tronton')) return path + 'wingbox.png';
      if (name.includes('fuso')) return path + 'fuso.png';
      if (name.includes('cdd')) return path + 'cdd.png';
      if (name.includes('cde')) return path + 'cde.png';
      if (name.includes('pickup') || name.includes('blind van')) return path + 'pickup.png';

      return path + 'fuso.png';
    },
    getVehicleSpec(f) {
      const name = ((f?.name || '') + ' ' + (f?.type || '')).toLowerCase();
      if (name.includes('tronton')) {
        return { dimension: '30–45 CBM Volume', route: 'Inter-Island & Heavy Cargo' };
      }
      if (name.includes('wing')) {
        return { dimension: 'Fast Side-Loading Wing', route: 'Palletized & Industrial' };
      }
      if (name.includes('fuso')) {
        return { dimension: '25–30 CBM Volume', route: 'Long-Haul Inter-Province' };
      }
      if (name.includes('cdd')) {
        return { dimension: '14–16 CBM / 6 Wheel', route: 'Regional & Inter-City' };
      }
      if (name.includes('cde')) {
        return { dimension: '7–9 CBM / 4 Wheel', route: 'Urban & Retail Access' };
      }
      if (name.includes('pickup')) {
        return { dimension: 'Agile Express Load', route: 'Last-Mile & Inner City' };
      }
      return { dimension: 'Standard Cargo Box', route: 'Nationwide Distribution' };
    },
    getDefaultDescription(f) {
      return `${f?.name || 'Armada'} dengan kapasitas ${f?.capacity || 'optimal'} untuk mendukung pengiriman bisnis yang aman, terjadwal, dan terpantau GPS.`;
    },
    openModal(f) {
      this.selectedFleet = f;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.selectedFleet = null;
      document.body.style.overflow = '';
    },
    stepFleet(dir) {
      if (!this.fleet.length) return;
      const nextIdx = (this.currentModalIndex + dir + this.fleet.length) % this.fleet.length;
      this.selectedFleet = this.fleet[nextIdx];
    },
    handleKeydown(e) {
      if (!this.selectedFleet) return;
      if (e.key === 'Escape') this.closeModal();
      if (e.key === 'ArrowLeft') this.stepFleet(-1);
      if (e.key === 'ArrowRight') this.stepFleet(1);
    },
    getWhatsAppLink(f) {
      const text = encodeURIComponent(`Halo FIS Logistics, saya ingin menanyakan ketersediaan dan penawaran armada ${f?.name || ''} (Kapasitas ${f?.capacity || ''}).`);
      return `https://wa.me/6281252206828?text=${text}`;
    }
  }
};
</script>
