<template>
  <div>
    <!-- Banner -->
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <h1 data-aos="fade-up">{{ info.page_title || 'Contact Us' }}</h1>
        <p data-aos="fade-up" data-aos-delay="100">
          {{ info.page_subtitle || 'We are ready to support your logistics needs' }}
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="contact-grid">

          <!-- ── Kolom kiri: Informasi Kontak ── -->
          <div data-aos="fade-right">
            <h2 class="info-heading">
              Contact Information
            </h2>
            <p class="info-subtext">
              Feel free to contact us anytime.
            </p>

            <div class="contact-info">
              <!-- Alamat -->
              <div class="contact-item" v-if="info.address">
                <div class="contact-icon"><i class="bi bi-geo-alt-fill"></i></div>
                <div>
                  <h4>Address</h4>
                  <p>{{ info.address }}</p>
                </div>
              </div>

              <!-- Telepon -->
              <div class="contact-item" v-if="info.phone || info.mobile">
                <div class="contact-icon"><i class="bi bi-telephone-fill"></i></div>
                <div>
                  <h4>Phone</h4>
                  <p v-if="info.phone">{{ info.phone }}</p>
                  <p v-if="info.mobile">
                    <a :href="'https://wa.me/'+waNumber" target="_blank" rel="noopener" class="contact-link">
                      <i class="bi bi-whatsapp whatsapp-icon"></i>
                      {{ info.mobile }}
                    </a>
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div class="contact-item" v-if="info.email">
                <div class="contact-icon"><i class="bi bi-envelope-fill"></i></div>
                <div>
                  <h4>Email</h4>
                  <p>
                    <a :href="'mailto:'+info.email" class="contact-link">
                      {{ info.email }}
                    </a>
                  </p>
                </div>
              </div>

              <!-- Jam Operasional -->
              <div class="contact-item" v-if="info.hours">
                <div class="contact-icon"><i class="bi bi-clock-fill"></i></div>
                <div>
                  <h4>Operational Hours</h4>
                  <p>{{ info.hours }}</p>
                </div>
              </div>
            </div>

            <!-- Google Maps embed (opsional) -->
            <div v-if="info.map_embed" class="map-wrapper">
              <iframe
                :src="info.map_embed"
                width="100%" height="220"
                class="map-iframe"
                allowfullscreen loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          <!-- ── Kolom kanan: Form Kirim Pesan ── -->
          <div data-aos="fade-left">
            <div class="form-card">
              <h3>Send Message</h3>

              <form @submit.prevent="submit">
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name *</label>
                    <input class="form-control" v-model="form.name" required placeholder="Your Name">
                  </div>
                  <div class="form-group">
                    <label>Email *</label>
                    <input class="form-control" type="email" v-model="form.email" required placeholder="email@example.com">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Phone</label>
                    <input class="form-control" v-model="form.phone" placeholder="e.g., +62812xxxxxx">
                  </div>
                  <div class="form-group">
                    <label>Subject</label>
                    <input class="form-control" v-model="form.subject" placeholder="Message subject">
                  </div>
                </div>
                <div class="form-group">
                  <label>Message *</label>
                  <textarea class="form-control" v-model="form.message" required
                            placeholder="Write your message..." rows="4"></textarea>
                </div>
                <button class="btn btn-primary form-submit" type="submit" :disabled="loading">
                  <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-send-fill'"></i>
                  {{ loading ? 'Sending...' : 'Send Message' }}
                </button>
              </form>
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
  name: 'ContactUs',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      info: {
        page_title: 'Contact Us',
        page_subtitle: 'We are ready to support your logistics needs',
        address: 'Jl. Raya Industri No. 123, Jakarta Timur',
        phone: '+62 21 1234 5678',
        mobile: '',
        email: 'oficial@fanindonesialogistics.com',
        hours: 'Monday - Friday: 08:00 - 17:00 WIB',
        map_embed: ''
      },
      form: { name: '', email: '', phone: '', subject: '', message: '' },
      loading: false
    };
  },
  computed: {
    waNumber() {
      return (this.info.mobile || '').replace(/[\s\-\(\)]/g, '').replace(/^0/, '62');
    }
  },
  async mounted() {
    try {
      const r = await api.getContent('contact');
      if (r && r.data) {
        this.info = { ...this.info, ...r.data };
      }
    } catch (e) {
      console.warn('ContactUs: failed to load CMS data, using default data.', e);
    }
    this.$nextTick(() => { if (window.AOS) window.AOS.refresh(); });
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const r = await api.submitContact(this.form);
        if (window.Swal) {
          await window.Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: r.message || 'Thank you, we will contact you shortly.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          alert(r.message || 'Message sent successfully!');
        }
        this.form = { name: '', email: '', phone: '', subject: '', message: '' };
      } catch (e) {
        if (window.Swal) {
          await window.Swal.fire({
            icon: 'error',
            title: 'Failed to Send!',
            text: e.message || 'An error occurred. Please try again.',
            confirmButtonText: 'Close'
          });
        } else {
          alert(e.message || 'Failed to send message.');
        }
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.info-heading {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--secondary, #0b132b);
  margin-bottom: 8px;
}
.info-subtext {
  color: var(--text-light, #a0aec0);
  margin-bottom: 32px;
}
.contact-link {
  color: var(--primary, #00b4d8);
  text-decoration: none;
}
.contact-link:hover {
  text-decoration: underline;
}
.whatsapp-icon {
  color: #25d366;
  margin-right: 4px;
}
.map-wrapper {
  margin-top: 32px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.10);
}
.map-iframe {
  border: 0;
  display: block;
}
</style>
