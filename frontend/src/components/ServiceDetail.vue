<template>
  <div class="svd-page">
    <!-- Loading State -->
    <div v-if="loading" class="svd-loading">
      <div class="loader-spinner"></div>
    </div>

    <div v-else-if="service">
      <!-- Clean Full-Width Executive Hero (No Overlapping Cards Poking Into Hero) -->
      <section
        class="svd-header"
        :style="heroBackgroundStyle"
      >
        <div class="svd-photo-overlay"></div>

        <div class="container svd-header-inner">
          <!-- Top Breadcrumb & Back Bar -->
          <div class="svd-topbar" data-aos="fade-down">
            <router-link to="/services" class="svd-back-link">
              <i class="bi bi-arrow-left"></i>
              <span>Back to Services</span>
            </router-link>
            <div class="svd-breadcrumb-trail">
              <router-link to="/">Home</router-link>
              <span>/</span>
              <router-link to="/services">Services</router-link>
              <span>/</span>
              <span class="svd-curr">{{ service.title }}</span>
            </div>
          </div>

          <!-- Split Hero Layout: Title & Lead on Left, Key Operational Specs on Right -->
          <div class="svd-hero-split" data-aos="fade-up">
            <div class="svd-header-content">
              <div class="svd-kicker-row">
                <span class="svd-kicker-code">{{ currentServiceIndex }}</span>
                <span class="svd-kicker-sep">/</span>
                <span class="svd-kicker-cat">{{ getCategoryTag(service) }}</span>
              </div>

              <h1 class="svd-title">{{ service.title }}</h1>

              <p class="svd-lead" v-if="cleanLead">
                {{ cleanLead }}
              </p>
            </div>

            <div class="svd-hero-meta-box">
              <div class="svd-hmeta-item">
                <span class="svd-hmeta-lbl">DIVISION CLASSIFICATION</span>
                <strong class="svd-hmeta-val">{{ getCategoryTag(service) }}</strong>
              </div>
              <div class="svd-hmeta-item">
                <span class="svd-hmeta-lbl">OPERATIONAL COVERAGE</span>
                <strong class="svd-hmeta-val">34 Provinces Nationwide</strong>
              </div>
              <div class="svd-hmeta-item">
                <span class="svd-hmeta-lbl">COMPLIANCE &amp; SAFETY</span>
                <strong class="svd-hmeta-val">ISO &amp; K3 (QHSE) Certified</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Specification & Sidebar (Clean Vertical Rhythm, Flush Top Alignment) -->
      <section class="svd-body-section">
        <div class="container">
          <div class="svd-main-grid">
            <!-- Left Column: Structured Dossier -->
            <div class="svd-primary-col" data-aos="fade-up" data-aos-delay="50">
              <!-- Block 1: Executive Overview -->
              <div class="svd-panel">
                <div class="svd-panel-head">
                  <div>
                    <span class="svd-panel-eyebrow">01 // EXECUTIVE OVERVIEW</span>
                    <h2 class="svd-panel-title">Service Profile &amp; Operational Description</h2>
                  </div>
                  <div class="svd-panel-icon">
                    <i :class="getIconClass(service.icon)"></i>
                  </div>
                </div>

                <div class="svd-prose" v-if="parsedContent.paragraphs.length > 0">
                  <p
                    v-for="(p, pIdx) in parsedContent.paragraphs"
                    :key="pIdx"
                    :class="{ 'svd-prose-lead': pIdx === 0 }"
                  >
                    {{ p }}
                  </p>
                </div>
                <div class="svd-prose" v-else-if="cleanLead">
                  <p class="svd-prose-lead">{{ cleanLead }}</p>
                </div>

                <!-- Fallback if content is completely empty -->
                <div v-if="!service.content && !cleanLead" class="svd-empty-note">
                  <i class="bi bi-file-earmark-text"></i>
                  <div>
                    <strong>Detailed scope available upon request</strong>
                    <p>Contact our operations desk for complete technical specifications, coverage, and rate cards regarding {{ service.title }}.</p>
                  </div>
                </div>
              </div>

              <!-- Block 2: Scope of Work & Deliverables -->
              <div class="svd-panel" v-if="parsedContent.items.length > 0">
                <div class="svd-panel-head">
                  <div>
                    <span class="svd-panel-eyebrow">02 // SCOPE OF WORK</span>
                    <h2 class="svd-panel-title">{{ parsedContent.sectionTitle || 'Key Deliverables & Technical Scope' }}</h2>
                  </div>
                  <span class="svd-panel-badge">{{ parsedContent.items.length }} Deliverables</span>
                </div>

                <div class="svd-scope-grid">
                  <div
                    class="svd-scope-item"
                    v-for="(item, idx) in parsedContent.items"
                    :key="idx"
                  >
                    <div class="svd-scope-top">
                      <span class="svd-scope-num">{{ String(idx + 1).padStart(2, '0') }}</span>
                      <h3 class="svd-scope-name" v-if="item.title">{{ item.title }}</h3>
                    </div>
                    <p class="svd-scope-text" v-if="item.text">{{ item.text }}</p>
                  </div>
                </div>
              </div>

              <!-- Block 3: Execution & Quality Assurance Standards -->
              <div class="svd-panel">
                <div class="svd-panel-head">
                  <div>
                    <span class="svd-panel-eyebrow">03 // EXECUTION STANDARDS</span>
                    <h2 class="svd-panel-title">Quality Assurance &amp; Governance</h2>
                  </div>
                </div>

                <div class="svd-standards-grid">
                  <div class="svd-std-card">
                    <div class="svd-std-icon"><i class="bi bi-shield-check"></i></div>
                    <div>
                      <strong>Standardized SOP &amp; K3</strong>
                      <p>Strict adherence to occupational health, safety (QHSE), and technical compliance standards.</p>
                    </div>
                  </div>
                  <div class="svd-std-card">
                    <div class="svd-std-icon"><i class="bi bi-geo-alt"></i></div>
                    <div>
                      <strong>Nationwide Deployment</strong>
                      <p>Supported by regional hubs, dedicated fleet assets, and field teams across 34 provinces.</p>
                    </div>
                  </div>
                  <div class="svd-std-card">
                    <div class="svd-std-icon"><i class="bi bi-activity"></i></div>
                    <div>
                      <strong>SLA &amp; Milestone Tracking</strong>
                      <p>Transparent progress documentation, real-time monitoring, and dedicated account supervision.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Sticky Commercial Desk & Directory -->
            <aside class="svd-sidebar" data-aos="fade-up" data-aos-delay="100">
              <!-- Direct Inquiry Panel -->
              <div class="svd-action-panel">
                <div class="svd-action-top">
                  <span class="svd-panel-kicker">COMMERCIAL DESK</span>
                  <span class="svd-online-badge"><span class="svd-online-dot"></span> Active</span>
                </div>
                <h4>Inquire About {{ service.title }}</h4>
                <p>
                  Request an official quotation, technical scope review, or dedicated contract proposal from our team.
                </p>

                <div class="svd-action-meta">
                  <div class="svd-ameta-row">
                    <span>Response SLA</span>
                    <strong>&lt; 24 Business Hours</strong>
                  </div>
                  <div class="svd-ameta-row">
                    <span>Consultation</span>
                    <strong>Custom Scope &amp; Survey</strong>
                  </div>
                </div>

                <div class="svd-action-btns">
                  <router-link to="/quote" class="svd-btn-quote">
                    <span>Request Official Quote</span>
                    <i class="bi bi-arrow-up-right"></i>
                  </router-link>
                  <a
                    href="https://wa.me/6281252206828"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="svd-btn-wa"
                  >
                    <i class="bi bi-whatsapp"></i>
                    <span>Consult via WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- Service Portfolio Switcher -->
              <div class="svd-directory-panel" v-if="allServices.length > 1">
                <div class="svd-dir-header">
                  <span>All Business Divisions</span>
                  <span class="svd-dir-count">{{ allServices.length }}</span>
                </div>
                <nav class="svd-dir-nav">
                  <router-link
                    v-for="(item, idx) in allServices"
                    :key="item.id"
                    :to="'/services/' + item.id"
                    class="svd-dir-link"
                    :class="{ active: String(item.id) === String(service.id) }"
                  >
                    <span class="svd-dir-idx">{{ String(idx + 1).padStart(2, '0') }}</span>
                    <span class="svd-dir-name">{{ item.title }}</span>
                    <i class="bi bi-arrow-right"></i>
                  </router-link>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="svd-not-found">
      <div class="container">
        <div class="svd-nf-box">
          <span class="svd-nf-code">404</span>
          <h2>Service Not Found</h2>
          <p>The requested service record could not be found or is no longer active.</p>
          <router-link to="/services" class="svd-btn-back">
            <i class="bi bi-arrow-left"></i> Return to Services
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  name: 'ServiceDetail',
  data() {
    return {
      service: null,
      allServices: [],
      loading: true
    };
  },
  computed: {
    currentServiceIndex() {
      if (!this.service || !this.allServices.length) return '01';
      const idx = this.allServices.findIndex(s => String(s.id) === String(this.service.id));
      return String(idx >= 0 ? idx + 1 : 1).padStart(2, '0');
    },
    heroBackgroundStyle() {
      const imgUrl = this.getHeroImage(this.service);
      if (imgUrl) {
        return {
          backgroundImage: `url('${imgUrl}')`
        };
      }
      return {};
    },
    cleanLead() {
      if (!this.service) return '';
      const desc = (this.service.description || '').trim();
      if (desc.length <= 5 && this.service.content) {
        const firstLine = this.service.content
          .split(/\r?\n/)
          .map(l => l.trim())
          .find(l => l.length > 25);
        return firstLine ? firstLine.replace(/^[-•]\s*/, '') : '';
      }
      return desc;
    },
    parsedContent() {
      const result = {
        sectionTitle: '',
        paragraphs: [],
        items: []
      };
      if (!this.service || !this.service.content) return result;

      const lines = this.service.content
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);

      let pendingSubheading = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1] || '';

        if (line.startsWith('-') || line.startsWith('•')) {
          const body = line.replace(/^[-•]\s*/, '').trim();
          const colonIdx = body.indexOf(':');

          if (pendingSubheading) {
            result.items.push({
              title: pendingSubheading,
              text: body
            });
            pendingSubheading = '';
          } else if (colonIdx > 1 && colonIdx <= 42) {
            result.items.push({
              title: body.slice(0, colonIdx).trim(),
              text: body.slice(colonIdx + 1).trim()
            });
          } else {
            result.items.push({
              title: body,
              text: ''
            });
          }
          continue;
        }

        const isNextBullet = nextLine.startsWith('-') || nextLine.startsWith('•');
        if (line.endsWith(':')) {
          result.sectionTitle = line.replace(/:$/, '').trim();
          continue;
        }

        if (isNextBullet && line.length <= 55 && !line.endsWith('.')) {
          pendingSubheading = line;
          continue;
        }

        if (line.length <= 40 && !line.endsWith('.') && !result.sectionTitle) {
          result.sectionTitle = line;
          continue;
        }

        result.paragraphs.push(line);
      }

      // Smart Prose Scope Extractor:
      // When content was entered as plain paragraphs (no '-' bullets), extract structured deliverables
      // from clauses like "Lingkup pekerjaan meliputi a, b, c, serta d."
      if (result.items.length === 0 && result.paragraphs.length > 0) {
        for (const p of result.paragraphs) {
          const match = p.match(/(?:meliputi|mencakup|terdiri dari|antara lain)\s+([^.]+)/i);
          if (match && match[1]) {
            const rawParts = match[1]
              .replace(/,\s*(?:pendirian\s+)?([^,]+),\s*([^,]+),\s*atau\s+([^,]+)/i, ', $1 / $2 / $3')
              .split(/,\s*(?:serta\s+|dan\s+)?|\s+serta\s+/i)
              .map(s => s.trim())
              .filter(s => s.length > 2);

            if (rawParts.length >= 2) {
              result.sectionTitle = 'Lingkup Pekerjaan & Spesifikasi Teknis';
              rawParts.forEach(part => {
                const formatted = part.charAt(0).toUpperCase() + part.slice(1);
                result.items.push({
                  title: formatted,
                  text: 'Pelaksanaan sesuai standar teknis, spesifikasi engineering, dan kepatuhan K3.'
                });
              });
            }
          } else if (/kami juga melayani\s+([^.]+)/i.test(p)) {
            const extra = p.match(/kami juga melayani\s+([^.]+)/i)[1].trim();
            const title = extra.split(/\s+untuk\s+/i)[0].trim();
            result.items.push({
              title: title.charAt(0).toUpperCase() + title.slice(1),
              text: p
            });
          }
        }
      }

      return result;
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadService();
      }
    }
  },
  async mounted() {
    await this.loadService();
  },
  methods: {
    async loadService() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        const [detailRes, listRes] = await Promise.all([
          api.getServiceById(id),
          this.allServices.length ? Promise.resolve({ data: this.allServices }) : api.getServices()
        ]);
        if (detailRes && detailRes.success) {
          this.service = detailRes.data;
        } else {
          this.service = null;
        }
        if (listRes && listRes.data) {
          this.allServices = listRes.data;
        }
      } catch (e) {
        console.error('Failed to load service detail:', e);
      } finally {
        this.loading = false;
      }
      this.$nextTick(() => {
        if (window.AOS) AOS.refresh();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    getImageUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return (this.$baseDir || '') + '/' + path.replace(/^\/+/, '');
    },
    getHeroImage(service) {
      if (!service) return '';
      if (service.image_path && service.image_path.trim() !== '') {
        return this.getImageUrl(service.image_path);
      }
      const t = ((service.title || '') + ' ' + (service.description || '')).toLowerCase();
      if (t.includes('air') || t.includes('udara')) {
        return this.getImageUrl('uploads/services/10919db93a7a7cd8c1ba.jpg');
      }
      if (t.includes('pack') || t.includes('kemas')) {
        return this.getImageUrl('uploads/services/90a6680584b5c2d3fd19.jpg');
      }
      if (t.includes('last mile') || t.includes('distribusi')) {
        return this.getImageUrl('uploads/services/c1de306c13a31ad9a501.jpg');
      }
      if (t.includes('tms') || t.includes('system') || t.includes('management')) {
        return this.getImageUrl('uploads/services/2f231a051f89ce74e3bb.jpeg');
      }
      if (t.includes('warehouse') || t.includes('pergudangan') || t.includes('gudang')) {
        return this.getImageUrl('uploads/services/feed12b0996405f98ac0.jpg');
      }
      // For Telecom/CME or general infrastructure without uploaded photo, use wide industrial hero backdrop
      return this.getImageUrl('assets/img/hero-bg.png');
    },
    getIconClass(icon) {
      if (!icon) return 'bi bi-box-seam';
      const clean = icon.trim();
      if (clean.startsWith('fa-solid') || clean.startsWith('fa-regular') || clean.startsWith('fa-brands')) {
        return clean;
      }
      if (clean.startsWith('fa-')) {
        return 'fa-solid ' + clean;
      }
      if (clean.startsWith('bi-')) {
        return 'bi ' + clean;
      }
      return clean;
    },
    getCategoryTag(service) {
      if (!service) return 'OPERATIONS';
      const t = ((service.title || '') + ' ' + (service.description || '')).toLowerCase();
      if (
        t.includes('telekomunikasi') ||
        t.includes('telecom') ||
        t.includes('menara') ||
        t.includes('tower') ||
        t.includes('konstruksi') ||
        t.includes('construction') ||
        t.includes('mechanical') ||
        t.includes('mekanikal') ||
        t.includes('electrical') ||
        t.includes('elektrikal') ||
        t.includes('cme')
      ) {
        return 'TELECOMMUNICATION & CME';
      }
      if (t.includes('warehouse') || t.includes('pergudangan') || t.includes('gudang')) {
        return 'STORAGE & WMS';
      }
      if (t.includes('air') || t.includes('udara')) {
        return 'AIR CARGO';
      }
      if (t.includes('tms') || t.includes('system') || t.includes('management')) {
        return 'DIGITAL LOGISTICS';
      }
      if (t.includes('pack') || t.includes('kemas')) {
        return 'CARGO PROTECTION';
      }
      if (t.includes('last mile') || t.includes('distribusi')) {
        return 'DISTRIBUTION';
      }
      return 'FREIGHT & TRANSPORT';
    }
  }
};
</script>
