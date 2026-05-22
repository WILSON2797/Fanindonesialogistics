// Clients Component
const Clients = {
  template: `
    <div>
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">Klien Kami</h1>
          <p data-aos="fade-up" data-aos-delay="100">Testimoni dari klien yang telah mempercayakan logistik mereka kepada kami</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="section-header" data-aos="fade-up">
            <div class="section-badge"><i class="bi bi-people-fill"></i> Testimonials</div>
            <h2 class="section-title">Apa Kata <span>Klien Kami</span></h2>
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
  `,
  props: { hideBanner: { type: Boolean, default: false } },
  data() { return { clients: [] }; },
  async mounted() {
    try { const r = await api.getClients(); this.clients = r.data || []; } catch(e) {}
    this.$nextTick(() => { if(window.AOS) AOS.refresh(); });
  }
};
