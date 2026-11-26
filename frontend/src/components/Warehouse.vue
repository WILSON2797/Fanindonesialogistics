<template>
  <div class="warehouse-page" :class="{ 'wh-is-page': !hideBanner }">
    <!-- STANDALONE PAGE BANNER -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <div class="ent-banner-inner" data-aos="fade-up">
          <div class="ent-breadcrumb">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <span>Our Warehouse</span>
          </div>
          <h1>Strategic Warehouse &amp; DOP Facilities</h1>
          <p>
            Modern warehousing, Distribution Point (DOP) hubs, and WMS-integrated storage infrastructure across key Indonesian corridors.
          </p>
        </div>
      </div>
    </section>

    <!-- WAREHOUSE CATALOG SECTION -->
    <section class="wh-section">
      <div class="container">
        <!-- Editorial Header + Region Filter Tabs -->
        <div class="wh-top-hdr" data-aos="fade-up">
          <div class="wh-title-col">
            <span class="wh-kicker-mono">04 // STORAGE &amp; DOP INFRASTRUCTURE</span>
            <h2 class="wh-heading">Strategic Warehouse Locations</h2>
          </div>

          <!-- Region Filter Bar -->
          <div class="svc-filter-bar" v-if="warehouses.length > 0">
            <button
              v-for="tab in regionTabs"
              :key="tab.key"
              type="button"
              class="svc-filter-tab"
              :class="{ active: activeRegion === tab.key }"
              @click="activeRegion = tab.key"
            >
              <span>{{ tab.label }}</span>
              <span class="svc-filter-count">{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <!-- Warehouse Metrics Strip -->
        <div class="wh-summary-strip" v-if="warehouses.length > 0" data-aos="fade-up" data-aos-delay="40">
          <div class="wh-sstat">
            <span class="wh-sstat-val">{{ warehouses.length }}</span>
            <span class="wh-sstat-lbl">Active Facilities</span>
          </div>
          <div class="wh-sstat">
            <span class="wh-sstat-val">{{ totalAreaFormatted }}</span>
            <span class="wh-sstat-lbl">Combined Storage Space</span>
          </div>
          <div class="wh-sstat">
            <span class="wh-sstat-val">24/7</span>
            <span class="wh-sstat-lbl">CCTV &amp; Security SOP</span>
          </div>
          <div class="wh-sstat">
            <span class="wh-sstat-val">WMS</span>
            <span class="wh-sstat-lbl">Real-Time Stock System</span>
          </div>
        </div>

        <!-- Uniform Modern Warehouse Card Grid -->
        <div class="wh-modern-grid" v-if="filteredWarehouses.length > 0">
          <router-link
            v-for="(w, i) in filteredWarehouses"
            :key="w.id"
            :to="'/warehouse/' + w.id"
            class="wh-card"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 50"
          >
            <!-- Top Media Panel -->
            <div class="wh-card-media">
              <img :src="getWarehouseImage(w, i)" :alt="w.name" class="wh-card-img" loading="lazy" />
              <div class="wh-card-badges">
                <span class="wh-status-pill">
                  <span class="wh-status-dot"></span> Active Hub
                </span>
                <span class="wh-area-pill" v-if="w.area">
                  <i class="bi bi-arrows-fullscreen"></i> {{ formatArea(w.area) }}
                </span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="wh-card-body">
              <div class="wh-card-meta">
                <span class="wh-meta-idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="wh-meta-sep">/</span>
                <span class="wh-meta-region">{{ formatRegion(w.region) }}</span>
                <span class="wh-meta-icon">
                  <i class="bi bi-building"></i>
                </span>
              </div>

              <h3 class="wh-card-title">{{ w.name }}</h3>
              <p class="wh-card-desc">{{ getCleanDescription(w) }}</p>

              <!-- 2-Column Technical Specs Grid -->
              <div class="wh-card-specs">
                <div class="wh-spec-chip" v-if="w.area">
                  <i class="bi bi-check2"></i>
                  <span>Area: <strong>{{ formatArea(w.area) }}</strong></span>
                </div>
                <div class="wh-spec-chip" v-if="w.type">
                  <i class="bi bi-check2"></i>
                  <span>Type: <strong>{{ w.type }} Facility</strong></span>
                </div>
                <div class="wh-spec-chip" v-if="w.project">
                  <i class="bi bi-check2"></i>
                  <span>Project: <strong>{{ w.project }}</strong></span>
                </div>
                <div class="wh-spec-chip" v-if="w.region">
                  <i class="bi bi-check2"></i>
                  <span>{{ formatRegion(w.region) }}</span>
                </div>
              </div>

              <div class="wh-card-cta">
                <span>Inspect Facility Dossier</span>
                <span class="wh-card-arrow">
                  <i class="bi bi-arrow-up-right"></i>
                </span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-if="warehouses.length === 0 && !loading" class="svc-empty-box" data-aos="fade-up">
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
      loading: true,
      activeRegion: 'all'
    };
  },
  computed: {
    regionTabs() {
      const counts = {
        all: this.warehouses.length,
        kalimantan: 0,
        sumatera: 0,
        jawa: 0
      };
      this.warehouses.forEach(w => {
        const g = this.getRegionGroup(w.region);
        if (counts[g] !== undefined) counts[g]++;
      });
      return [
        { key: 'all', label: 'All Facilities', count: counts.all },
        { key: 'kalimantan', label: 'Kalimantan', count: counts.kalimantan },
        { key: 'sumatera', label: 'Sumatera', count: counts.sumatera },
        { key: 'jawa', label: 'Jawa & Others', count: counts.jawa }
      ].filter(t => t.key === 'all' || t.count > 0);
    },
    filteredWarehouses() {
      if (this.activeRegion === 'all') return this.warehouses;
      return this.warehouses.filter(w => this.getRegionGroup(w.region) === this.activeRegion);
    },
    totalAreaFormatted() {
      let sum = 0;
      this.warehouses.forEach(w => {
        const num = parseFloat(String(w.area || '0').replace(/[^\d.]/g, ''));
        if (!isNaN(num)) sum += num;
      });
      return sum > 0 ? `${sum.toLocaleString('id-ID')} m²` : '3,500+ m²';
    }
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
    getRegionGroup(region) {
      const r = (region || '').toLowerCase();
      if (r.includes('kalimantan')) return 'kalimantan';
      if (r.includes('sumatera') || r.includes('sumatra')) return 'sumatera';
      return 'jawa';
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
    getCleanDescription(w) {
      const desc = (w.description || '').trim();
      if (!desc || desc.length <= 28) {
        const proj = w.project ? `Project ${w.project}` : 'enterprise supply chain';
        const reg = this.formatRegion(w.region);
        return `Fasilitas ${w.type || 'Gudang'} terstandarisasi seluas ${this.formatArea(w.area)} di wilayah ${reg} untuk mendukung penyimpanan, manajemen inventori WMS, dan distribusi ${proj}.`;
      }
      return desc;
    },
    getWarehouseImage(w, idx = 0) {
      const base = this.$baseDir || window.BASE_DIR || '';
      if (w && w.image_path && w.image_path.trim() !== '') {
        return base + '/' + w.image_path.replace(/^\/+/, '');
      }
      const fallbacks = [
        'uploads/warehouse/81f679467ba0c3699544.jpeg',
        'uploads/services/69ef1c7dded60_1777278077.jpg',
        'uploads/services/feed12b0996405f98ac0.jpg',
        'uploads/services/c1de306c13a31ad9a501.jpg',
        'uploads/warehouse-gallery/75fea2f4c8ba098ab606.jpeg'
      ];
      return base + '/' + fallbacks[idx % fallbacks.length];
    }
  }
};
</script>
