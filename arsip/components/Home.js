// Home Page Component
const Home = {
  template: `
    <div>
      <!-- HERO -->
      <section class="hero" :style="heroStyle">
        <div class="hero-particles" ref="particles"></div>
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content" data-aos="fade-right">
              <div class="hero-badge-pill">
                <span class="hero-badge-dot"></span> TRUSTED LOGISTICS PARTNER
              </div>
              <h1 v-if="hero">{{ hero.title }}
                <span class="hero-sub-text">{{ typewriterText }}<span class="typewriter-cursor"></span></span>
              </h1>
              <h1 v-else>SOLUSI<span class="hero-highlight">LOGISTIK</span>
                <span class="hero-sub-text">{{ typewriterText }}<span class="typewriter-cursor"></span></span>
              </h1>
              <p v-if="hero">{{ hero.subtitle }}</p>
              <p v-else>Layanan transportasi dan distribusi terpercaya untuk seluruh wilayah Indonesia. Armada modern, sistem terintegrasi, dan tim profesional.</p>
              <div class="hero-btns">
                <router-link to="/quote" class="hero-btn-primary"><i class="fa-solid fa-paper-plane"></i> Request Quote</router-link>
                <router-link to="/services" class="hero-btn-ghost"><i class="fa-solid fa-clipboard-list"></i> Lihat Layanan</router-link>
              </div>
              <div class="hero-stats-row" v-if="hero && hero.stats">
                <div class="hero-stat" v-for="(s, i) in apiStats" :key="i">
                  <div class="hero-stat-num">{{ s.current }}<span v-html="formatStat(s.suffix)"></span></div>
                  <div class="hero-stat-lbl">{{ s.label }}</div>
                </div>
              </div>
              <div class="hero-stats-row" v-else>
                <div class="hero-stat">
                  <div class="hero-stat-num">{{ counters.fleet }}<span>+</span></div>
                  <div class="hero-stat-lbl">ARMADA AKTIF</div>
                </div>
                <div class="hero-stat">
                  <div class="hero-stat-num">{{ counters.experience }}<span>+</span></div>
                  <div class="hero-stat-lbl">TAHUN BERPENGALAMAN</div>
                </div>
                <div class="hero-stat">
                  <div class="hero-stat-num">{{ counters.provinces }}</div>
                  <div class="hero-stat-lbl">PROVINSI DIJANGKAU</div>
                </div>
              </div>
            </div>
            <div class="hero-visual" data-aos="fade-left" data-aos-delay="200">
              <div class="hero-truck-card">
                <div class="hero-truck-icon">
                  <i class="bi bi-truck"></i>
                </div>
                <div class="hero-truck-label">Armada Lengkap</div>
                <div class="hero-truck-sub">PICKUP • CDE • CDD • FUSO • WINGBOX</div>
                <div class="hero-fleet-pills">
                  <span class="hero-fpill">PICKUP</span>    
                  <span class="hero-fpill">CDE</span>    
                  <span class="hero-fpill">CDD</span>
                  <span class="hero-fpill">FUSO</span>
                  <span class="hero-fpill">WINGBOX</span>
                </div>
              </div>
              <div class="hero-floating-badge hero-fb-top">
                <div class="hero-fb-icon hero-fb-green">
                  <i class="fa-solid fa-circle-check hero-fb-green-icon"></i>
                </div>
                <div>
                  <div class="hero-fb-t1">On-Time Delivery</div>
                  <div class="hero-fb-t2">98.5% Rate</div>
                </div>
              </div>
              <div class="hero-floating-badge hero-fb-bot">
                <div class="hero-fb-icon hero-fb-blue">
                  <i class="fa-solid fa-satellite-dish hero-fb-blue-icon"></i>
                </div>
                <div>
                  <div class="hero-fb-t1">GPS Tracking</div>
                  <div class="hero-fb-t2">Real-time Monitor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ALL SECTIONS -->
      <AboutUs :hide-banner="true" />
      <Services :hide-banner="true" />
      <Fleet :hide-banner="true" />
      <CoverageArea :hide-banner="true" />
      <Customers :hide-banner="true" />
      <Clients :hide-banner="true" />
      <Certificates :hide-banner="true" />
      <ContactUs :hide-banner="true" />
    </div>
  `,
  components: { AboutUs, Services, Fleet, CoverageArea, Customers, Clients, Certificates, ContactUs },
  data() {
    return {
      hero: null,
      typewriterText: '',
      phrases: [
        'PT. FAN INDONESIA SEJAHTERA (FIS LOGISTICS)',
        'FASTER IN SERVICES',
        'YOUR TRUSTED LOGISTICS PARTNER'
      ],
      phraseIndex: 0,
      charIndex: 0,
      isDeleting: false,
      counters: { fleet: 0, experience: 0, provinces: 0 },
      apiStats: []
    };
  },
  async mounted() {
    try {
      const h = await api.getContent('hero');
      this.hero = h.data;
      if (this.hero && this.hero.stats) {
        this.apiStats = this.hero.stats.map(s => {
          const match = String(s.value).match(/^(\d+)(.*)$/);
          if (match) {
            return { label: s.label, num: parseInt(match[1], 10), suffix: match[2], current: 0 };
          }
          return { label: s.label, num: 0, suffix: s.value, current: 0 };
        });
      }
    } catch (e) { console.warn('API not ready, using defaults'); }

    this.typewriter();
    this.animateCounters();
    this.createParticles();
    this.$nextTick(() => { if (window.AOS) AOS.refresh(); });
  },
  computed: {
    heroStyle() {
      // Pastikan hero.bg_image ada dan tidak kosong
      if (this.hero && this.hero.bg_image && this.hero.bg_image.trim() !== '') {
        const url = this.hero.bg_image.startsWith('http') 
          ? this.hero.bg_image 
          : (this.$baseDir || '') + '/' + this.hero.bg_image;
        return { '--hero-bg': `url('${url}')` };
      }
      // Jika tidak ada data dari database, biarkan CSS (main.css) menggunakan default-nya
      return {}; 
    }
  },
  methods: {
    typewriter() {
      const currentPhrase = this.phrases[this.phraseIndex];

      if (this.isDeleting) {
        this.typewriterText = currentPhrase.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.typewriterText = currentPhrase.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let typeSpeed = this.isDeleting ? 30 : 80;

      if (!this.isDeleting && this.charIndex === currentPhrase.length) {
        typeSpeed = 2500;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        typeSpeed = 500;
      }

      setTimeout(this.typewriter, typeSpeed);
    },
    animateCounters() {
      const duration = 2500;
      const startTimestamp = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);

        this.counters.fleet = Math.floor(500 * ease);
        this.counters.experience = Math.floor(15 * ease);
        this.counters.provinces = Math.floor(34 * ease);

        if (this.apiStats && this.apiStats.length > 0) {
          this.apiStats.forEach(stat => {
            stat.current = Math.floor(stat.num * ease);
          });
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          this.counters.fleet = 500;
          this.counters.experience = 15;
          this.counters.provinces = 34;
          if (this.apiStats && this.apiStats.length > 0) {
            this.apiStats.forEach(stat => { stat.current = stat.num; });
          }
        }
      };

      window.requestAnimationFrame(step);
    },
    createParticles() {
      const el = this.$refs.particles;
      if (!el) return;
      for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDelay = Math.random() * 15 + 's';
        span.style.animationDuration = (10 + Math.random() * 20) + 's';
        span.style.width = span.style.height = (2 + Math.random() * 4) + 'px';
        el.appendChild(span);
      }
    },
    formatStat(val) {
      if (!val) return '';
      const str = String(val);
      return str.replace(/(\+)/g, '<span>$1</span>');
    }
  }
};
