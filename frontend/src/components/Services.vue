<template>
  <div class="svc-root" :class="{ 'svc-is-page': !hideBanner }">
    <!-- STANDALONE PAGE HEADER -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <div class="ent-banner-inner" data-aos="fade-up">
          <div class="ent-breadcrumb">
            <router-link to="/">Home</router-link>
            <span>/</span>
            <span>Services</span>
          </div>
          <h1>Capabilities &amp; Business Divisions</h1>
          <p>
            End-to-end logistics, multimodal freight, warehousing, and telecommunication infrastructure (CME) engineered for enterprise execution.
          </p>
        </div>
      </div>
    </section>

    <!-- SERVICES BENTO & INTERACTIVE CATALOG -->
    <section class="svc-bento-section">
      <div class="container">
        <!-- Editorial Header + Category Filter Tabs -->
        <div class="svc-bento-top" data-aos="fade-up">
          <div class="svc-bento-title-col">
            <span class="svc-kicker-mono">02 // CAPABILITIES &amp; DIVISIONS</span>
            <h2 class="svc-bento-heading">
              Integrated Logistics &amp; Technical Execution
            </h2>
          </div>

          <!-- Interactive Division Filter Tabs -->
          <div class="svc-filter-bar">
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

        <!-- Uniform Modern Card Grid -->
        <div class="svc-bento-grid" v-if="filteredServices.length > 0">
          <router-link
            v-for="(s, i) in filteredServices"
            :key="s.id"
            :to="'/services/' + s.id"
            class="svc-bento-item"
            data-aos="fade-up"
            :data-aos-delay="(i % 3) * 50"
          >
            <!-- Left / Text Column -->
            <div class="svc-bento-content">
              <div class="svc-bento-meta">
                <span class="svc-bento-idx">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="svc-bento-sep">/</span>
                <span class="svc-bento-cat">{{ getCategoryTag(s) }}</span>
                <span class="svc-bento-icon">
                  <i :class="getIconClass(s.icon)"></i>
                </span>
              </div>

              <h3 class="svc-bento-name">{{ s.title }}</h3>
              <p class="svc-bento-desc">{{ getCleanDescription(s) }}</p>

              <!-- Key Deliverables Checklist -->
              <div class="svc-bento-specs" v-if="extractHighlights(s).length > 0">
                <div
                  class="svc-bento-spec-row"
                  v-for="(pt, pIdx) in extractHighlights(s)"
                  :key="pIdx"
                >
                  <i class="bi bi-check2"></i>
                  <span>{{ pt }}</span>
                </div>
              </div>

              <div class="svc-bento-cta">
                <span>Inspect Division Scope</span>
                <span class="svc-bento-arrow">
                  <i class="bi bi-arrow-up-right"></i>
                </span>
              </div>
            </div>

            <!-- Right / Media Visual Column -->
            <div class="svc-bento-visual">
              <img
                :src="getServiceImage(s)"
                :alt="s.title"
                class="svc-bento-img"
                loading="lazy"
              />
            </div>
          </router-link>
        </div>

        <!-- Loading / Empty State -->
        <div class="svc-empty-box" v-else>
          <div class="svc-empty-spinner" v-if="loading"></div>
          <i class="bi bi-layers" v-else></i>
          <p>{{ loading ? 'Loading services...' : 'No services found in this category.' }}</p>
        </div>
      </div>
    </section>

    <!-- STANDALONE PAGE BOTTOM INQUIRY BAR -->
    <section class="svc-inquiry-section" v-if="!hideBanner">
      <div class="container">
        <div class="svc-inquiry-panel" data-aos="fade-up">
          <div class="svc-inquiry-copy">
            <span class="svc-inquiry-kicker">DIRECT CONSULTATION</span>
            <h2>Ready to deploy a dedicated logistics or CME project?</h2>
            <p>
              Connect with our engineering and operations desk for custom contract rates, site surveys, and SLA proposals.
            </p>
          </div>
          <div class="svc-inquiry-actions">
            <router-link to="/quote" class="btn btn-primary">
              <span>Request a Quote</span>
              <i class="bi bi-arrow-right"></i>
            </router-link>
            <router-link to="/contact" class="btn btn-outline-light">
              <i class="bi bi-telephone"></i>
              <span>Contact Operations</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  name: 'Services',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      services: [],
      loading: true,
      activeFilter: 'all'
    };
  },
  computed: {
    filterTabs() {
      const counts = {
        all: this.services.length,
        freight: 0,
        warehouse: 0,
        telecom: 0
      };
      this.services.forEach(s => {
        const group = this.getFilterGroup(s);
        if (counts[group] !== undefined) counts[group]++;
      });
      const tabs = [
        { key: 'all', label: 'All Divisions', count: counts.all },
        { key: 'freight', label: 'Freight & Distribution', count: counts.freight },
        { key: 'warehouse', label: 'Warehousing & Tech', count: counts.warehouse }
      ];
      if (counts.telecom > 0) {
        tabs.push({ key: 'telecom', label: 'Telecom & CME', count: counts.telecom });
      }
      return tabs;
    },
    filteredServices() {
      if (this.activeFilter === 'all') return this.services;
      return this.services.filter(s => this.getFilterGroup(s) === this.activeFilter);
    }
  },
  async mounted() {
    try {
      const r = await api.getServices();
      this.services = r.data || [];
    } catch (e) {
      console.warn('Failed to load services:', e);
    } finally {
      this.loading = false;
    }
    this.$nextTick(() => {
      if (window.AOS) AOS.refresh();
    });
  },
  methods: {
    getFilterGroup(service) {
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
        return 'telecom';
      }
      if (
        t.includes('warehouse') ||
        t.includes('pergudangan') ||
        t.includes('gudang') ||
        t.includes('tms') ||
        t.includes('system') ||
        t.includes('pack') ||
        t.includes('kemas')
      ) {
        return 'warehouse';
      }
      return 'freight';
    },
    getImageUrl(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return (this.$baseDir || '') + '/' + path.replace(/^\/+/, '');
    },
    getServiceImage(service) {
      if (service && service.image_path && service.image_path.trim() !== '') {
        return this.getImageUrl(service.image_path);
      }
      const t = ((service?.title || '') + ' ' + (service?.description || '')).toLowerCase();
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
      if (
        t.includes('telekomunikasi') ||
        t.includes('telecom') ||
        t.includes('menara') ||
        t.includes('konstruksi') ||
        t.includes('mechanical') ||
        t.includes('electrical')
      ) {
        return this.getImageUrl('uploads/gallery/cbe587569d7bd3979e46.jpeg');
      }
      if (t.includes('warehouse') || t.includes('pergudangan') || t.includes('gudang')) {
        return this.getImageUrl('uploads/services/feed12b0996405f98ac0.jpg');
      }
      return this.getImageUrl('uploads/services/69ef1b501766b_1777277776.jpeg');
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
        return 'TELECOM & CME';
      }
      if (t.includes('warehouse') || t.includes('pergudangan') || t.includes('gudang')) {
        return 'WAREHOUSING & WMS';
      }
      if (t.includes('air') || t.includes('udara')) {
        return 'AIR FREIGHT';
      }
      if (t.includes('tms') || t.includes('system') || t.includes('management')) {
        return 'DIGITAL TMS';
      }
      if (t.includes('pack') || t.includes('kemas')) {
        return 'INDUSTRIAL PACKAGING';
      }
      if (t.includes('last mile') || t.includes('distribusi')) {
        return 'LAST-MILE DISTRIBUTION';
      }
      return 'LAND TRANSPORT';
    },
    getCleanDescription(service) {
      const desc = (service.description || '').trim();
      if (desc.length <= 5 && service.content) {
        const lines = service.content
          .split(/\r?\n/)
          .map(l => l.trim())
          .filter(l => l.length > 25);
        if (lines.length > 0) {
          return lines[0].replace(/^-\s*/, '');
        }
      }
      return desc;
    },
    extractHighlights(service) {
      if (!service || !service.content) return [];
      const lines = service.content
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);

      const tags = [];

      for (const line of lines) {
        if (line.startsWith('-') || line.startsWith('•')) {
          const body = line.replace(/^[-•]\s*/, '').trim();
          const colonIdx = body.indexOf(':');
          if (colonIdx > 1 && colonIdx <= 38) {
            tags.push(body.slice(0, colonIdx).trim());
          }
        }
      }

      if (tags.length === 0) {
        for (let i = 0; i < lines.length - 1; i++) {
          const cur = lines[i];
          const next = lines[i + 1];
          if (
            !cur.startsWith('-') &&
            !cur.startsWith('•') &&
            !cur.endsWith(':') &&
            cur.length > 2 &&
            cur.length <= 42 &&
            (next.startsWith('-') || next.startsWith('•'))
          ) {
            tags.push(cur);
          }
        }
      }

      if (tags.length === 0) {
        for (const line of lines) {
          if (line.startsWith('-') || line.startsWith('•')) {
            const body = line.replace(/^[-•]\s*/, '').trim();
            if (body.length > 2 && body.length <= 38) {
              tags.push(body);
            }
          }
        }
      }

      // 4. Smart extraction from prose clauses ("meliputi a, b, c, serta d")
      if (tags.length === 0) {
        for (const line of lines) {
          const match = line.match(/(?:meliputi|mencakup|terdiri dari)\s+([^.]+)/i);
          if (match && match[1]) {
            const parts = match[1]
              .replace(/,\s*(?:pendirian\s+)?([^,]+),\s*([^,]+),\s*atau\s+([^,]+)/i, ', $1 / $2 / $3')
              .split(/,\s*(?:serta\s+|dan\s+)?|\s+serta\s+/i)
              .map(s => s.trim())
              .filter(s => s.length > 2 && s.length <= 36);
            parts.forEach(p => {
              tags.push(p.charAt(0).toUpperCase() + p.slice(1));
            });
          }
        }
      }

      return tags.slice(0, 4);
    }
  }
};
</script>
