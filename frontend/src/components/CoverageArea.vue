<template>
  <div class="cva-page">
    <!-- Premium Hero -->
    <section class="cva-hero">
      <div class="cva-hero-bg"></div>
      <div class="container text-center cva-hero-content">
        <div class="cva-pill" data-aos="fade-down">
          <i class="bi bi-globe-americas"></i> NATIONWIDE NETWORK
        </div>
        <h1 data-aos="fade-up" data-aos-delay="100">
          Our Coverage <span>Area</span>
        </h1>
        <p data-aos="fade-up" data-aos-delay="200">
          Delivering excellence across all regions of Indonesia, from Sabang to Merauke.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="cva-body">
      <div class="container">
        
        <!-- Removed stats row per user request -->

        <div class="cva-section-title text-center" data-aos="fade-up" data-aos-delay="100">
          <h2>Regions We Cover</h2>
          <p>Explore our extensive logistics network organized by major regions</p>
        </div>

        <!-- Regions Grid -->
        <div class="cva-grid" v-if="areas.length">
          <div class="cva-region-card" v-for="(a, i) in areas" :key="a.id" data-aos="fade-up" :data-aos-delay="i * 100">
            <div class="cva-region-header">
              <div class="cva-region-icon">
                <i class="fa-solid" :class="getRegionIcon(a.region)"></i>
              </div>
              <h3 class="cva-region-name">{{ a.region }}</h3>
            </div>
            <div class="cva-city-list">
              <span class="cva-city-pill" v-for="city in getCities(a.cities)" :key="city">
                {{ city }}
              </span>
            </div>
          </div>
        </div>

        <!-- Fallback if API empty -->
        <div class="cva-grid" v-else>
          <div class="cva-region-card" v-for="i in 6" :key="i" data-aos="fade-up">
             <div class="cva-region-header">
                <div class="cva-region-icon"><i class="fa-solid fa-location-dot"></i></div>
                <h3 class="cva-region-name">Region {{ i }}</h3>
             </div>
             <div class="cva-city-list">
                <span class="cva-city-pill">City Example 1</span>
                <span class="cva-city-pill">City Example 2</span>
                <span class="cva-city-pill">City Example 3</span>
             </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  name: 'CoverageArea',
  data() {
    return {
      areas: []
    };
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },
  methods: {
    getCities(citiesStr) {
      if (!citiesStr) return [];
      return citiesStr.split(',').map(c => c.trim()).filter(c => c);
    },
    getRegionIcon(region) {
      const r = (region || '').toLowerCase();
      if (r.includes('jawa') || r.includes('bali')) return 'fa-umbrella-beach';
      if (r.includes('sumatera')) return 'fa-tree';
      if (r.includes('kalimantan')) return 'fa-leaf';
      if (r.includes('sulawesi')) return 'fa-mountain';
      if (r.includes('timur') || r.includes('papua')) return 'fa-map';
      return 'fa-location-dot';
    }
  }
};
</script>
