// Coverage Area Component
const CoverageArea = {
  template: `
    <div>
      <section class="page-banner">
        <div class="container">
          <h1 data-aos="fade-up">Area Jangkauan</h1>
          <p data-aos="fade-up" data-aos-delay="100">Menjangkau seluruh wilayah Indonesia</p>
        </div>
      </section>
      <section class="pv-coverage">
        <div class="container">
          <div class="pv-sec-hdr" data-aos="fade-up">
            <div class="pv-sec-label pv-sec-label-dark"><span>📍</span> AREA</div>
            <h2 class="pv-sec-title pv-sec-title-light">COVERAGE <span>AREA</span></h2>
            <p class="pv-sec-sub pv-sec-sub-light">Menjangkau seluruh wilayah Indonesia dari Sabang sampai Merauke</p>
          </div>
          <!-- Map Visual -->
          <div class="pv-map-placeholder" data-aos="fade-up" data-aos-delay="100">
            <div class="pv-map-img">
              <svg width="100%" height="220" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet">
                <rect width="600" height="160" fill="#0A1628"/>
                <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
                <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
                <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
                <line x1="150" y1="0" x2="150" y2="160" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
                <line x1="300" y1="0" x2="300" y2="160" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
                <line x1="450" y1="0" x2="450" y2="160" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
                <ellipse cx="160" cy="90" rx="80" ry="30" fill="rgba(30,58,95,.8)" stroke="rgba(0,180,216,.4)" stroke-width="1"/>
                <ellipse cx="300" cy="85" rx="60" ry="25" fill="rgba(30,58,95,.8)" stroke="rgba(0,180,216,.4)" stroke-width="1"/>
                <ellipse cx="410" cy="88" rx="70" ry="22" fill="rgba(30,58,95,.8)" stroke="rgba(0,180,216,.4)" stroke-width="1"/>
                <ellipse cx="520" cy="90" rx="55" ry="20" fill="rgba(30,58,95,.8)" stroke="rgba(0,180,216,.4)" stroke-width="1"/>
                <circle cx="130" cy="88" r="5" fill="#00B4D8"/><text x="130" y="76" fill="#fff" font-size="8" text-anchor="middle">Jakarta</text>
                <circle cx="165" cy="92" r="4" fill="#00B4D8"/><text x="165" y="107" fill="rgba(255,255,255,.7)" font-size="7" text-anchor="middle">Surabaya</text>
                <circle cx="290" cy="82" r="4" fill="#F4A012"/><text x="290" y="70" fill="rgba(255,255,255,.7)" font-size="7" text-anchor="middle">Medan</text>
                <circle cx="400" cy="85" r="4" fill="#F4A012"/><text x="400" y="100" fill="rgba(255,255,255,.7)" font-size="7" text-anchor="middle">Makassar</text>
                <circle cx="510" cy="88" r="4" fill="#F4A012"/><text x="510" y="76" fill="rgba(255,255,255,.7)" font-size="7" text-anchor="middle">Kalimantan</text>
                <line x1="130" y1="88" x2="165" y2="92" stroke="#00B4D8" stroke-width="1.5" stroke-dasharray="4,3"/>
                <line x1="165" y1="92" x2="290" y2="82" stroke="#00B4D8" stroke-width="1" stroke-dasharray="4,3"/>
                <line x1="290" y1="82" x2="400" y2="85" stroke="#00B4D8" stroke-width="1" stroke-dasharray="4,3"/>
                <line x1="400" y1="85" x2="510" y2="88" stroke="#00B4D8" stroke-width="1" stroke-dasharray="4,3"/>
              </svg>
            </div>
          </div>
          <!-- Region Groups from API -->
          <div class="pv-coverage-regions" v-if="areas.length">
            <div class="pv-region-group" v-for="(a, i) in areas" :key="a.id" data-aos="fade-up" :data-aos-delay="i*100">
              <div class="pv-region-title">
                <span class="pv-region-icon">{{ getRegionEmoji(a.region) }}</span>
                {{ a.region }}
              </div>
              <div class="pv-region-cities">
                <div class="pv-area-pill" v-for="city in getCities(a.cities)" :key="city">
                  <span class="pv-area-dot"></span>{{ city }}
                </div>
              </div>
            </div>
          </div>

          <!-- Fallback if no API data -->
          <div class="pv-areas-wrap" v-else>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>DKI Jakarta</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Jawa Barat</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Jawa Tengah</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Jawa Timur</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Sumatera Utara</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Kalimantan Timur</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Sulawesi Selatan</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Bali</div>
            <div class="pv-area-pill"><span class="pv-area-dot"></span>Papua</div>
          </div>
        </div>
      </section>
    </div>
  `,
  data() { return { areas: [] }; },
  async mounted() {
    try { const r = await api.getCoverage(); this.areas = r.data || []; } catch (e) { }
    this.$nextTick(() => { if (window.AOS) AOS.refresh(); });
  },
  methods: {
    getCities(citiesStr) {
      if (!citiesStr) return [];
      return citiesStr.split(',').map(c => c.trim()).filter(c => c);
    },
    getRegionEmoji(region) {
      const r = (region || '').toLowerCase();
      if (r.includes('jawa') || r.includes('bali')) return '🏝️';
      if (r.includes('sumatera')) return '🌴';
      if (r.includes('kalimantan')) return '🌿';
      if (r.includes('sulawesi')) return '⛰️';
      if (r.includes('timur') || r.includes('papua')) return '🗺️';
      return '📍';
    }
  }
};
