<template>
  <div>
    <section class="page-banner">
      <div class="container">
        <h1 data-aos="fade-up">Request Quote</h1>
        <p data-aos="fade-up" data-aos-delay="100">Get the best quote for your logistics needs</p>
      </div>
    </section>
    
    <section class="section">
      <div class="container quote-container">
        <div class="form-card" data-aos="fade-up">
          <h3><i class="bi bi-send-fill quote-icon"></i> Quote Request Form</h3>
          <p class="quote-instruction">Fill out the form below and our team will contact you within 24 hours.</p>
          <div class="alert alert-success" v-if="success"><i class="bi bi-check-circle-fill"></i> {{ success }}</div>
          <div class="alert alert-error" v-if="error"><i class="bi bi-exclamation-circle-fill"></i> {{ error }}</div>
          
          <form @submit.prevent="submit" v-if="!success">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name *</label>
                <input class="form-control" v-model="form.name" required placeholder="Your Name">
              </div>
              <div class="form-group">
                <label>Company</label>
                <input class="form-control" v-model="form.company" placeholder="Company Name">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email *</label>
                <input class="form-control" type="email" v-model="form.email" required placeholder="email@example.com">
              </div>
              <div class="form-group">
                <label>Phone *</label>
                <input class="form-control" v-model="form.phone" required placeholder="e.g., +62812xxxxxx">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Origin City *</label>
                <input class="form-control" v-model="form.origin" required placeholder="Shipping origin city">
              </div>
              <div class="form-group">
                <label>Destination City *</label>
                <input class="form-control" v-model="form.destination" required placeholder="Shipping destination city">
              </div>
            </div>
            <div class="form-group">
              <label>Cargo Type *</label>
              <input class="form-control" v-model="form.cargo_type" required placeholder="e.g., Electronics, Construction Materials, etc.">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Estimated Weight</label>
                <input class="form-control" v-model="form.weight" placeholder="e.g., 5 Tons">
              </div>
              <div class="form-group">
                <label>Estimated Volume</label>
                <input class="form-control" v-model="form.volume" placeholder="e.g., 10 CBM">
              </div>
            </div>
            <div class="form-group">
              <label>Additional Notes</label>
              <textarea class="form-control" v-model="form.notes" placeholder="Additional information..." rows="3"></textarea>
            </div>
            <button class="btn btn-primary form-submit" type="submit" :disabled="loading">
              <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-send-fill'"></i>
              {{ loading ? 'Sending...' : 'Send Request' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'RequestQuote',
  data() {
    return {
      form: {
        name: '',
        company: '',
        email: '',
        phone: '',
        origin: '',
        destination: '',
        cargo_type: '',
        weight: '',
        volume: '',
        notes: ''
      },
      loading: false,
      success: '',
      error: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (window.AOS) window.AOS.refresh();
    });
  },
  methods: {
    async submit() {
      this.loading = true;
      this.success = '';
      this.error = '';
      try {
        const r = await api.submitQuote(this.form);
        this.success = r.message || 'Quote request sent successfully!';
      } catch (e) {
        this.error = e.message || 'Failed to send request.';
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.quote-container {
  max-width: 800px;
}
.quote-icon {
  color: var(--primary, #00b4d8);
  margin-right: 8px;
}
.quote-instruction {
  color: var(--text-light, #a0aec0);
  margin-bottom: 28px;
  font-size: 0.9rem;
}
</style>
