<template>
  <div>
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <h1 data-aos="fade-up">Our Clients</h1>
        <p data-aos="fade-up" data-aos-delay="100">Testimonials from clients who have trusted their logistics to us</p>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <div class="section-badge"><i class="bi bi-people-fill"></i> Testimonials</div>
          <h2 class="section-title">What <span>Our Clients</span> Say</h2>
        </div>
        <div class="testimonial-grid">
          <div class="testimonial-card" v-for="(c, i) in clients" :key="c.id" data-aos="fade-up" :data-aos-delay="i*100">
            <div class="testimonial-stars">
              <i class="bi bi-star-fill" v-for="n in (c.rating||5)" :key="n"></i>
            </div>
            <p class="testimonial-text">"{{ c.testimonial }}"</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">{{ (c.client_name||c.company_name).charAt(0) }}</div>
              <div class="testimonial-info">
                <h4>{{ c.client_name || c.company_name }}</h4>
                <p>{{ c.client_position }} — {{ c.company_name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'Clients',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      clients: []
    };
  },
  async mounted() {
    try {
      const r = await api.getClients();
      this.clients = r.data || [];
    } catch (e) {
      console.error('Failed to load clients:', e);
    }
    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  }
};
</script>
