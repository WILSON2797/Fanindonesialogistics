// Fleet Component
const Fleet = {
  template: `
    <div class="fleet-page">
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">Armada Kami</h1>
          <p data-aos="fade-up" data-aos-delay="100">Solusi transportasi lengkap dengan armada modern, tangguh, dan terpercaya.</p>
        </div>
      </section>

      <section class="fleet-showcase">
        <div class="container">
          <div class="sec-header-center" data-aos="fade-up">
            <span class="sec-label">Our Fleet</span>
            <h2 class="sec-title">Pilihan <span>Armada</span> Terbaik</h2>
            <p class="sec-desc">Kami menyediakan berbagai tipe armada untuk memastikan pengiriman Anda aman dan tepat waktu.</p>
          </div>

          <div class="fleet-grid">
            <div class="fleet-card" v-for="(f, i) in fleet" :key="f.id" 
                 :class="{ 'is-expanded': expandedId === f.id }"
                 data-aos="fade-up" :data-aos-delay="i*100">
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
                    <span><strong>Kapasitas:</strong> {{ f.capacity || 'N/A' }}</span>
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
                      <h4>Deskripsi Lengkap</h4>
                      <p>{{ f.description || 'Tidak ada deskripsi tambahan.' }}</p>
                      <div class="f-expanded-action">
                        <router-link to="/quote" class="btn btn-primary btn-sm">Minta Penawaran</router-link>
                      </div>
                    </div>
                  </div>
                </transition>

                <div class="fleet-footer">
                  <button class="btn-detail" @click="toggleExpand(f.id)">
                    {{ expandedId === f.id ? 'Tutup Detail' : 'Lihat Detail' }} 
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
  `,
  props: { hideBanner: { type: Boolean, default: false } },
  data() { 
    return { 
      fleet: [],
      expandedId: null
    }; 
  },
  async mounted() {
    try { const r = await api.getFleet(); this.fleet = r.data || []; } catch(e) {}
    this.$nextTick(() => { if(window.AOS) AOS.refresh(); });
  },
  methods: {
    getFleetImage(f) {
      if (!f) return '';
      if (f.image_path) return this.$baseDir + '/' + f.image_path;
      
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
      setTimeout(() => { if(window.AOS) AOS.refresh(); }, 300);
    },
    truncate(str, len) {
      if (!str) return '';
      return str.length > len ? str.substring(0, len) + '…' : str;
    }
  }
};
