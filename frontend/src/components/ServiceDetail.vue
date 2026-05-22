<template>
  <div class="svd-page-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="svd-loading">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="service">
      <!-- Premium Hero Header -->
      <section class="svd-hero" :style="heroStyle">
        <div class="svd-hero-overlay"></div>
        <div class="container svd-hero-container">
          <router-link to="/services" class="svd-back-btn" data-aos="fade-right">
            <i class="bi bi-arrow-left"></i> Back to Services
          </router-link>
          
          <div class="svd-hero-text" data-aos="fade-up" data-aos-delay="100">
            <h1>{{ service.title }}</h1>
            <p>{{ service.description }}</p>
          </div>
        </div>
      </section>

      <!-- Main Content Area overlapping Hero -->
      <section class="svd-content-section">
        <div class="container">
          <div class="svd-layout-grid">
            
            <!-- Left Main Content -->
            <div class="svd-main-col" data-aos="fade-up" data-aos-delay="200">
              <div class="svd-card-glass">
                <div class="svd-icon-float">
                  <i :class="'bi ' + service.icon"></i>
                </div>
                
                <h3 class="svd-content-title">Service Highlights</h3>
                <div class="svd-rich-text" v-html="formattedContent"></div>
                
                <!-- Fallback if content is empty -->
                <div v-if="!service.content" class="svd-empty-state">
                  <i class="bi bi-info-circle"></i>
                  <p>Detailed information for this service is currently being updated. Please contact us for more information regarding {{ service.title }}.</p>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="svd-sidebar-col" data-aos="fade-up" data-aos-delay="300">
              
              <!-- Premium CTA Widget -->
              <div class="svd-widget-dark">
                <div class="svd-widget-glow"></div>
                <h4>Need This Service?</h4>
                <p>Get the best quote for your <strong>{{ service.title }}</strong> needs today.</p>
                
                <div class="svd-widget-actions">
                  <router-link to="/quote" class="svd-btn-primary">
                    <i class="bi bi-send-fill"></i> Request Quote
                  </router-link>
                  <a href="https://wa.me/6281252206828" target="_blank" class="svd-btn-whatsapp">
                    <i class="bi bi-whatsapp"></i> Chat via WhatsApp
                  </a>
                </div>
              </div>

              <!-- Advantages Widget -->
              <div class="svd-widget-light">
                <h4>Our Advantages</h4>
                <ul class="svd-feature-list">
                  <li>
                    <div class="svd-feat-icon"><i class="bi bi-shield-check"></i></div>
                    <div class="svd-feat-text">Professional & Experienced Team</div>
                  </li>
                  <li>
                    <div class="svd-feat-icon"><i class="bi bi-geo-alt-fill"></i></div>
                    <div class="svd-feat-text">Nationwide Coverage</div>
                  </li>
                  <li>
                    <div class="svd-feat-icon"><i class="bi bi-display"></i></div>
                    <div class="svd-feat-text">Real-time Monitoring</div>
                  </li>
                  <li>
                    <div class="svd-feat-icon"><i class="bi bi-tags-fill"></i></div>
                    <div class="svd-feat-text">Competitive Pricing</div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="svd-not-found" data-aos="zoom-in">
      <div class="container text-center">
        <div class="svd-error-circle">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h2>Service Not Found</h2>
        <p>Sorry, the service information you are looking for is not available.</p>
        <router-link to="/services" class="svd-btn-outline mt-3">View All Services</router-link>
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
      loading: true
    };
  },
  computed: {
    heroStyle() {
      if (this.service && this.service.image_path) {
        return {
          backgroundImage: `url('${this.$baseDir}/${this.service.image_path}')`
        };
      }
      return {
        background: 'var(--gradient-dark)'
      };
    },
    formattedContent() {
      if (!this.service || !this.service.content) return '';
      let text = this.service.content;
      text = text.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
      text = text.replace(/(<li>.*<\/li>)/gms, '<ul class="svd-content-list">$1</ul>');
      return text.replace(/\n/g, '<br>');
    }
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const r = await api.getServiceById(id);
      if (r.success) {
        this.service = r.data;
      }
    } catch (e) {
      console.error('Failed to load service detail:', e);
    }
    this.loading = false;
    this.$nextTick(() => {
      if (window.AOS) AOS.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};
</script>
