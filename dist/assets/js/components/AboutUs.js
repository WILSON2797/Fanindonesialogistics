// About Us Component
const AboutUs = {
  template: `
    <div>
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">Tentang Kami</h1>
          <p data-aos="fade-up" data-aos-delay="100">Mengenal lebih dekat PT. Fan Indonesia Sejahtera</p>
        </div>
      </section>
      <section class="pv-about">
        <div class="container">
          <div class="pv-sec-hdr" data-aos="fade-up">
            <div class="pv-sec-label"><i class="fa-solid fa-building pv-about-hdr-icon"></i> About US</div>
            <h2 class="pv-sec-title">PT. FAN INDONESIA <span>SEJAHTERA (FIS LOGISTICS)</span></h2>
          </div>
          <div class="pv-about-grid">
            <div class="pv-about-visual" data-aos="fade-right">
              <div class="pv-about-main">
                <img :src="about && about.bg_image ? about.bg_image : 'assets/img/about-company.png'" alt="PT. Fan Indonesia Sejahtera">
              </div>
              <div class="pv-about-badge-card">
                <div class="pv-abc-num">{{ about && about.founded_year ? about.founded_year : '2009' }}</div>
                <div class="pv-abc-lbl">{{ about && about.founded_label ? about.founded_label : 'BERDIRI SEJAK' }}</div>
              </div>
            </div>
            <div class="pv-about-content" data-aos="fade-left">
              <h2>MITRA LOGISTIK <span>TERPERCAYA</span></h2>
              <p v-if="about">{{ about.description }}</p>
              <p v-else>PT. Fan Indonesia Sejahtera (PT. FIS Logistics) adalah perusahaan logistik dan transportasi yang berpengalaman lebih dari 15 tahun.</p>
              <div class="pv-vm-grid">
                <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="100">
                  <div class="pv-vm-title"><i class="fa-solid fa-bullseye pv-card-icon-fa"></i> VISI</div>
                  <div class="pv-vm-text" v-if="about && about.vision">{{ about.vision }}</div>
                  <div class="pv-vm-text" v-else>Menjadi perusahaan logistik terdepan dan terpercaya di Indonesia pada 2030</div>
                </div>
                <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="150">
                  <div class="pv-vm-title"><i class="fa-solid fa-lightbulb pv-card-icon-fa"></i> MISI</div>
                  <div class="pv-vm-text" v-if="about && about.mission">{{ Array.isArray(about.mission) ? about.mission.join('. ') : about.mission }}</div>
                  <div class="pv-vm-text" v-else>Memberikan layanan logistik berkualitas tinggi dengan teknologi modern dan SDM profesional</div>
                </div>
                <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="200">
                  <div class="pv-vm-title"><i class="fa-solid fa-trophy pv-card-icon-fa"></i> NILAI</div>
                  <div class="pv-vm-text" v-if="about && about.values">{{ Array.isArray(about.values) ? about.values.join(', ') : (about.values_text || about.values) }}</div>
                  <div class="pv-vm-text" v-else>Integritas, Inovasi, Ketepatan waktu, dan Kepuasan pelanggan</div>
                </div>
                <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="250">
                  <div class="pv-vm-title"><i class="fa-solid fa-file-contract pv-card-icon-fa"></i> LEGALITAS</div>
                  <div class="pv-vm-text" v-if="about && about.legality">{{ about.legality }}</div>
                  <div class="pv-vm-text" v-else>Berizin resmi, bersertifikasi, dan terdaftar di Kementerian Perhubungan RI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  props: { hideBanner: { type: Boolean, default: false } },
  data() { return { about: null }; },
  async mounted() {
    try { const r = await api.getContent('about'); this.about = r.data; } catch (e) { }
    this.$nextTick(() => { if (window.AOS) AOS.refresh(); });
  }
};
