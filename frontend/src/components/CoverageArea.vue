<template>
  <div class="cva-page" :class="{ 'cva-is-page': !hideBanner }">
    <!-- STANDALONE PAGE BANNER -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <div class="ent-banner-inner" data-aos="fade-up">
          <div class="ent-breadcrumb">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <span>Coverage Area</span>
          </div>
          <h1>Nationwide Distribution Network</h1>
          <p>
            Integrated land, sea, and air logistics corridors connecting industrial hubs, DOP warehouses, and project sites across all 34 provinces of Indonesia.
          </p>
        </div>
      </div>
    </section>

    <!-- MAIN COVERAGE SECTION -->
    <section class="cva-body">
      <div class="container">
        <!-- Editorial Header + Live City Search & Filter -->
        <div class="cva-top-hdr" data-aos="fade-up">
          <div class="cva-title-col">
            <span class="cva-kicker-mono">05 // NATIONWIDE COVERAGE NETWORK</span>
            <h2 class="cva-heading">Archipelago Distribution Corridors</h2>
          </div>

          <div class="cva-controls">
            <div class="cva-search-box">
              <i class="bi bi-search"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search city or regional hub..."
                aria-label="Search city or regional hub"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="cva-search-clear"
                @click="searchQuery = ''"
                aria-label="Clear search"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Interactive Archipelago Network Command Panel -->
        <div class="cva-command-panel" data-aos="fade-up" data-aos-delay="40">
          <!-- Left: Interactive Vector Corridor Map -->
          <div class="cva-map-stage">
            <div class="cva-map-topbar">
              <span class="cva-map-label">
                <span class="cva-live-dot"></span> ACTIVE LOGISTICS &amp; DOP CORRIDORS
              </span>
              <span class="cva-map-hint">Click a corridor node to filter</span>
            </div>

            <!-- Stylized Interactive SVG Network Map of Indonesia -->
            <div class="cva-svg-wrap">
              <svg viewBox="0 0 800 280" class="cva-network-svg" xmlns="http://www.w3.org/2000/svg">
                <!-- Background Subtle Grid Lines -->
                <g class="cva-svg-grid">
                  <line x1="0" y1="70" x2="800" y2="70" />
                  <line x1="0" y1="140" x2="800" y2="140" />
                  <line x1="0" y1="210" x2="800" y2="210" />
                  <line x1="160" y1="0" x2="160" y2="280" />
                  <line x1="320" y1="0" x2="320" y2="280" />
                  <line x1="480" y1="0" x2="480" y2="280" />
                  <line x1="640" y1="0" x2="640" y2="280" />
                </g>

                <!-- Stylized Island Silhouettes -->
                <g class="cva-svg-islands">
                  <!-- Sumatera -->
                  <path d="M55,65 L95,55 L185,145 L215,185 L185,200 L140,165 L65,90 Z" />
                  <!-- Jawa -->
                  <path d="M225,212 L365,216 L395,225 L370,236 L220,228 Z" />
                  <!-- Kalimantan -->
                  <path d="M275,75 L355,60 L405,95 L395,155 L325,168 L270,135 Z" />
                  <!-- Sulawesi -->
                  <path d="M445,95 L505,85 L495,120 L515,135 L485,178 L455,170 L460,130 Z" />
                  <!-- Bali & Nusa Tenggara -->
                  <path d="M410,226 L495,230 L490,238 L408,235 Z" />
                  <!-- Maluku & Papua -->
                  <path d="M565,115 L605,110 L615,145 L575,150 Z" />
                  <path d="M640,120 L755,105 L770,185 L705,195 L645,155 Z" />
                </g>

                <!-- Logistics Route Connection Arcs -->
                <g class="cva-svg-routes">
                  <!-- Jakarta Central Hub to Medan, Palembang, Pontianak, Balikpapan, Surabaya, Makassar -->
                  <path d="M250,218 Q170,170 110,95" />
                  <path d="M250,218 Q210,195 185,172" />
                  <path d="M250,218 Q255,165 288,125" />
                  <path d="M250,218 Q315,180 350,155" />
                  <path d="M250,218 Q325,175 385,125" />
                  <path d="M250,218 Q305,210 355,222" />
                  <path d="M355,222 Q415,195 468,165" />
                  <path d="M468,165 Q585,145 705,145" />
                </g>

                <!-- Interactive Hub Nodes -->
                <g
                  v-for="pin in mapPins"
                  :key="pin.id"
                  class="cva-svg-pin"
                  :class="{ active: activeRegion === pin.regionKey }"
                  @click="toggleRegionFilter(pin.regionKey)"
                >
                  <circle :cx="pin.x" :cy="pin.y" r="12" class="cva-pin-pulse" />
                  <circle :cx="pin.x" :cy="pin.y" r="5" class="cva-pin-core" />
                  <text :x="pin.x" :y="pin.y - 12" text-anchor="middle" class="cva-pin-lbl">
                    {{ pin.label }}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- Right: Network Telemetry & Quick Region Filter -->
          <div class="cva-telemetry-col">
            <div class="cva-tele-header">
              <span class="cva-tele-kicker">NETWORK TELEMETRY</span>
              <h3>34 Provinces Connected</h3>
              <p>Multimodal land, sea, and air routing backed by regional DOP warehouses.</p>
            </div>

            <div class="cva-tele-stats">
              <div class="cva-tstat">
                <strong>{{ displayAreas.length }}</strong>
                <span>Regional Corridors</span>
              </div>
              <div class="cva-tstat">
                <strong>{{ totalCitiesCount }}+</strong>
                <span>Active City Hubs</span>
              </div>
              <div class="cva-tstat">
                <strong>5 DOP</strong>
                <span>Regional Warehouses</span>
              </div>
              <div class="cva-tstat">
                <strong>24/7</strong>
                <span>Fleet Dispatch</span>
              </div>
            </div>

            <div class="cva-region-pills">
              <button
                type="button"
                class="cva-rpill"
                :class="{ active: activeRegion === 'all' }"
                @click="activeRegion = 'all'"
              >
                All Corridors ({{ displayAreas.length }})
              </button>
              <button
                v-for="a in displayAreas"
                :key="'tab-' + a.id"
                type="button"
                class="cva-rpill"
                :class="{ active: activeRegion === normalizeKey(a.region) }"
                @click="toggleRegionFilter(normalizeKey(a.region))"
              >
                {{ a.region }} ({{ getCities(a.cities).length }})
              </button>
            </div>
          </div>
        </div>

        <!-- Uniform Modern Regional Corridor Cards -->
        <div class="cva-corridor-grid" v-if="filteredAreas.length > 0">
          <article
            class="cva-corridor-card"
            v-for="(a, i) in filteredAreas"
            :key="a.id"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 50"
          >
            <div class="cva-cc-top">
              <div class="cva-cc-meta">
                <span class="cva-cc-idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="cva-cc-sep">/</span>
                <span class="cva-cc-tag">{{ getCorridorTag(a.region) }}</span>
              </div>
              <span class="cva-cc-count">
                {{ getCities(a.cities).length }} {{ getCities(a.cities).length === 1 ? 'Hub' : 'Hubs' }}
              </span>
            </div>

            <div class="cva-cc-heading">
              <div class="cva-cc-icon">
                <i class="fa-solid" :class="getRegionIcon(a.region)"></i>
              </div>
              <div>
                <h3 class="cva-cc-title">{{ a.region }} Corridor</h3>
                <p class="cva-cc-sub">{{ getCorridorSummary(a.region) }}</p>
              </div>
            </div>

            <!-- City Hubs List -->
            <div class="cva-cc-cities">
              <span
                class="cva-hub-chip"
                v-for="city in getCities(a.cities)"
                :key="city"
                :class="{ highlight: isCityMatched(city) }"
              >
                <i class="bi bi-geo-alt-fill"></i>
                <span>{{ city }}</span>
              </span>
            </div>

            <div class="cva-cc-foot">
              <router-link to="/quote" class="cva-cc-link">
                <span>Request Route Quotation</span>
                <span class="cva-cc-arrow"><i class="bi bi-arrow-up-right"></i></span>
              </router-link>
            </div>
          </article>
        </div>

        <!-- No Search Match -->
        <div class="svc-empty-box" v-else>
          <i class="bi bi-geo-alt"></i>
          <p>No regional hub matching "{{ searchQuery }}". Contact our operations desk for custom destination routing.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  name: 'CoverageArea',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      areas: [],
      searchQuery: '',
      activeRegion: 'all',
      mapPins: [
        { id: 'medan', label: 'Medan', x: 105, y: 90, regionKey: 'sumatera' },
        { id: 'palembang', label: 'Palembang', x: 182, y: 170, regionKey: 'sumatera' },
        { id: 'lampung', label: 'Lampung', x: 205, y: 196, regionKey: 'lampung' },
        { id: 'jakarta', label: 'Jakarta HQ', x: 250, y: 218, regionKey: 'jawa' },
        { id: 'surabaya', label: 'Surabaya', x: 355, y: 222, regionKey: 'jawa' },
        { id: 'pontianak', label: 'Pontianak DOP', x: 288, y: 122, regionKey: 'kalimantan' },
        { id: 'banjarmasin', label: 'Banjarmasin DOP', x: 350, y: 158, regionKey: 'kalimantan' },
        { id: 'balikpapan', label: 'Balikpapan DOP', x: 388, y: 122, regionKey: 'kalimantan' },
        { id: 'makassar', label: 'Makassar', x: 468, y: 165, regionKey: 'sulawesi' }
      ]
    };
  },
  computed: {
    displayAreas() {
      if (this.areas && this.areas.length > 0) return this.areas;
      return [
        { id: 1, region: 'Jawa', cities: 'Jakarta, Semarang, Surabaya' },
        { id: 2, region: 'Sumatera', cities: 'Medan, Palembang, Pekanbaru, Lampung, Batam' },
        { id: 3, region: 'Kalimantan', cities: 'Banjarmasin, Balikpapan, Pontianak' },
        { id: 4, region: 'Sulawesi', cities: 'Makassar, Palu' }
      ];
    },
    totalCitiesCount() {
      const set = new Set();
      this.displayAreas.forEach(a => {
        this.getCities(a.cities).forEach(c => set.add(c.toLowerCase()));
      });
      return set.size || 14;
    },
    filteredAreas() {
      const q = (this.searchQuery || '').trim().toLowerCase();
      return this.displayAreas.filter(a => {
        const regKey = this.normalizeKey(a.region);
        if (this.activeRegion !== 'all' && regKey !== this.activeRegion) {
          return false;
        }
        if (!q) return true;
        const inRegion = (a.region || '').toLowerCase().includes(q);
        const inCities = (a.cities || '').toLowerCase().includes(q);
        return inRegion || inCities;
      });
    }
  },
  async mounted() {
    try {
      const r = await api.getCoverage();
      if (r && r.data) {
        this.areas = r.data;
      }
    } catch (e) {
      console.error('Failed to load coverage areas:', e);
    }
    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  },
  methods: {
    normalizeKey(region) {
      const r = (region || '').toLowerCase().trim();
      if (r.includes('jawa')) return 'jawa';
      if (r.includes('sumatera') || r.includes('sumatra')) return 'sumatera';
      if (r.includes('kalimantan')) return 'kalimantan';
      if (r.includes('sulawesi')) return 'sulawesi';
      if (r.includes('lampung')) return 'lampung';
      return r;
    },
    toggleRegionFilter(key) {
      const hasKey = this.displayAreas.some(a => this.normalizeKey(a.region) === key);
      if (!hasKey) {
        this.activeRegion = 'all';
        return;
      }
      this.activeRegion = this.activeRegion === key ? 'all' : key;
    },
    isCityMatched(city) {
      const q = (this.searchQuery || '').trim().toLowerCase();
      if (!q) return false;
      return (city || '').toLowerCase().includes(q);
    },
    getCities(citiesStr) {
      if (!citiesStr) return [];
      return citiesStr.split(',').map(c => c.trim()).filter(Boolean);
    },
    getRegionIcon(region) {
      const r = (region || '').toLowerCase();
      if (r.includes('jawa') || r.includes('bali')) return 'fa-road';
      if (r.includes('sumatera') || r.includes('lampung')) return 'fa-truck-fast';
      if (r.includes('kalimantan')) return 'fa-warehouse';
      if (r.includes('sulawesi')) return 'fa-ship';
      if (r.includes('timur') || r.includes('papua')) return 'fa-plane-departure';
      return 'fa-location-dot';
    },
    getCorridorTag(region) {
      const r = (region || '').toLowerCase();
      if (r.includes('jawa')) return 'PRIMARY TRUNK CORRIDOR';
      if (r.includes('kalimantan')) return 'DOP & TELECOM HUBS';
      if (r.includes('sumatera')) return 'TRANS-SUMATERA NETWORK';
      if (r.includes('sulawesi')) return 'EASTERN GATEWAY';
      return 'REGIONAL DISTRIBUTION';
    },
    getCorridorSummary(region) {
      const r = (region || '').toLowerCase();
      if (r.includes('jawa')) {
        return 'High-frequency FTL/LTL trucking, distribution centers, and daily last-mile routes.';
      }
      if (r.includes('kalimantan')) {
        return 'Supported by dedicated DOP warehouses in Pontianak, Banjarmasin, and Balikpapan.';
      }
      if (r.includes('sumatera')) {
        return 'Integrated land transport and DOP storage facilities in Medan and Palembang.';
      }
      if (r.includes('sulawesi')) {
        return 'Multimodal sea/air freight and regional distribution serving Eastern Indonesia.';
      }
      return 'Scheduled freight transport and last-mile delivery connecting key commercial centers.';
    }
  }
};
</script>
