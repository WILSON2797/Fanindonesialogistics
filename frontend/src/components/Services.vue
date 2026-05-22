<template>
  <div>
    <!-- PAGE BANNER -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <div class="svc-banner-pill" data-aos="fade-down">
          <span class="svc-banner-pill-dot"></span>
          OUR SERVICES
        </div>
        <h1 data-aos="fade-up" data-aos-delay="80">
          Integrated <span class="svc-banner-hl">Logistics</span> Solutions
        </h1>

      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section class="svc-section">
      <div class="container">
        <!-- Section Header (only when embedded in Home) -->
        <div class="svc-header" data-aos="fade-up" v-if="hideBanner">
          <div class="svc-label">
            <i class="fa-solid fa-gears svc-label-icon"></i> OUR SERVICES
          </div>
          <h2 class="svc-title">COMPLETE <span>SOLUTIONS</span> FOR YOUR BUSINESS</h2>
          <p class="svc-subtitle">We provide various logistics services to support your business growth</p>
        </div>

        <!-- Services Grid -->
        <div class="svc-grid" :class="{ 'svc-grid-page': !hideBanner }" data-aos="fade-up" data-aos-delay="100">
          <div
            class="svc-card svc-card-rich"
            v-for="(s, i) in services"
            :key="s.id"
            data-aos="fade-up"
            :data-aos-delay="i * 80"
          >
            <!-- Image -->
            <div class="svc-img-wrap">
              <img
                v-if="s.image_path"
                :src="$baseDir + '/' + s.image_path"
                :alt="s.title"
                class="svc-img"
              />
              <div v-else class="svc-img-placeholder">
                <i :class="'bi ' + (s.icon || 'bi-box-seam')"></i>
              </div>
              <div class="svc-img-overlay"></div>
              <span class="svc-card-num">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>

            <!-- Content -->
            <div class="svc-card-body">
              <div class="svc-icon-badge">
                <i :class="'bi ' + (s.icon || 'bi-box-seam')"></i>
              </div>
              <h3 class="svc-name">{{ s.title }}</h3>
              <p class="svc-desc">{{ s.description }}</p>
              <router-link :to="'/services/' + s.id" class="svc-card-link">
                View Details <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="svc-empty" v-if="services.length === 0">
          <i class="bi bi-grid-3x3-gap"></i>
          <p>Loading services...</p>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta-section" v-if="!hideBanner">
      <div class="container" data-aos="zoom-in">
        <div class="svc-cta-icon">
          <i class="bi bi-headset"></i>
        </div>
        <h2>Need a Custom Service?</h2>
        <p>Contact us to discuss your specific business logistics requirements. Our experts are ready 24/7.</p>
        <div class="cta-buttons">
          <router-link to="/quote" class="btn btn-white">
            <i class="bi bi-send-fill"></i> Request a Quote
          </router-link>
          <router-link to="/contact" class="btn btn-outline">
            <i class="bi bi-telephone-fill"></i> Contact Us
          </router-link>
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
      services: []
    };
  },
  async mounted() {
    try {
      const r = await api.getServices();
      this.services = r.data || [];
    } catch (e) {
      console.warn('Failed to load services:', e);
    }
    this.$nextTick(() => {
      if (window.AOS) AOS.refresh();
    });
  }
};
</script>
