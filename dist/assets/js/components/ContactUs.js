// Contact Us Component — fully dynamic dari CMS
const ContactUs = {
  template: `
    <div>
      <!-- Banner -->
      <section class="page-banner" v-if="!hideBanner">
        <div class="container">
          <h1 data-aos="fade-up">{{ info.page_title || 'Hubungi Kami' }}</h1>
          <p data-aos="fade-up" data-aos-delay="100">
            {{ info.page_subtitle || 'Kami siap membantu kebutuhan logistik Anda' }}
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="contact-grid">

            <!-- ── Kolom kiri: Informasi Kontak ── -->
            <div data-aos="fade-right">
              <h2 style="font-size:1.8rem;font-weight:800;color:var(--secondary);margin-bottom:8px">
                Informasi Kontak
              </h2>
              <p style="color:var(--text-light);margin-bottom:32px">
                Jangan ragu untuk menghubungi kami kapan saja.
              </p>

              <div class="contact-info">
                <!-- Alamat -->
                <div class="contact-item" v-if="info.address">
                  <div class="contact-icon"><i class="bi bi-geo-alt-fill"></i></div>
                  <div>
                    <h4>Alamat</h4>
                    <p>{{ info.address }}</p>
                  </div>
                </div>

                <!-- Telepon -->
                <div class="contact-item" v-if="info.phone || info.mobile">
                  <div class="contact-icon"><i class="bi bi-telephone-fill"></i></div>
                  <div>
                    <h4>Telepon</h4>
                    <p v-if="info.phone">{{ info.phone }}</p>
                    <p v-if="info.mobile">
                      <a :href="'https://wa.me/'+waNumber" target="_blank" rel="noopener"
                         style="color:var(--primary);text-decoration:none">
                        <i class="bi bi-whatsapp" style="color:#25d366;margin-right:4px"></i>
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
                      <a :href="'mailto:'+info.email" style="color:var(--primary);text-decoration:none">
                        {{ info.email }}
                      </a>
                    </p>
                  </div>
                </div>

                <!-- Jam Operasional -->
                <div class="contact-item" v-if="info.hours">
                  <div class="contact-icon"><i class="bi bi-clock-fill"></i></div>
                  <div>
                    <h4>Jam Operasional</h4>
                    <p>{{ info.hours }}</p>
                  </div>
                </div>
              </div>

              <!-- Google Maps embed (opsional) -->
              <div v-if="info.map_embed"
                   style="margin-top:32px;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.10)">
                <iframe
                  :src="info.map_embed"
                  width="100%" height="220"
                  style="border:0;display:block"
                  allowfullscreen loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>

            <!-- ── Kolom kanan: Form Kirim Pesan ── -->
            <div data-aos="fade-left">
              <div class="form-card">
                <h3>Kirim Pesan</h3>

                <form @submit.prevent="submit">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Nama Lengkap *</label>
                      <input class="form-control" v-model="form.name" required placeholder="Nama Anda">
                    </div>
                    <div class="form-group">
                      <label>Email *</label>
                      <input class="form-control" type="email" v-model="form.email" required placeholder="email@example.com">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Telepon</label>
                      <input class="form-control" v-model="form.phone" placeholder="08xx xxxx xxxx">
                    </div>
                    <div class="form-group">
                      <label>Subjek</label>
                      <input class="form-control" v-model="form.subject" placeholder="Perihal pesan">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Pesan *</label>
                    <textarea class="form-control" v-model="form.message" required
                              placeholder="Tulis pesan Anda..." rows="4"></textarea>
                  </div>
                  <button class="btn btn-primary form-submit" type="submit" :disabled="loading">
                    <i class="bi" :class="loading ? 'bi-arrow-repeat' : 'bi-send-fill'"></i>
                    {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  `,

  props: { hideBanner: { type: Boolean, default: false } },
  data() {
    return {
      // Default fallback — akan ditimpa data dari CMS
      info: {
        page_title: 'Hubungi Kami',
        page_subtitle: 'Kami siap membantu kebutuhan logistik Anda',
        address: 'Jl. Raya Industri No. 123, Jakarta Timur',
        phone: '+62 21 1234 5678',
        mobile: '',
        email: 'oficial@fanindonesialogistics.com',
        hours: 'Senin - Jumat: 08:00 - 17:00 WIB',
        map_embed: ''
      },
      form: { name: '', email: '', phone: '', subject: '', message: '' },
      loading: false
    };
  },

  computed: {
    // Bersihkan nomor WA untuk format link wa.me
    waNumber() {
      return (this.info.mobile || '').replace(/[\s\-\(\)]/g, '').replace(/^0/, '62');
    }
  },

  async mounted() {
    try {
      const r = await api.getContent('contact');
      if (r && r.data) {
        // Merge data CMS ke atas default, abaikan field yang null/kosong
        this.info = { ...this.info, ...r.data };
      }
    } catch (e) {
      console.warn('ContactUs: gagal memuat data CMS, menggunakan data default.', e);
    }
    this.$nextTick(() => { if (window.AOS) AOS.refresh(); });
  },

  methods: {
    async submit() {
      this.loading = true;
      try {
        const r = await api.submitContact(this.form);
        // Gunakan SweetAlert2 jika tersedia, fallback ke alert biasa
        if (window.Swal) {
          await Swal.fire({
            icon: 'success',
            title: 'Pesan Terkirim!',
            text: r.message || 'Terima kasih, kami akan segera menghubungi Anda.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          alert(r.message || 'Pesan berhasil dikirim!');
        }
        this.form = { name: '', email: '', phone: '', subject: '', message: '' };
      } catch (e) {
        if (window.Swal) {
          await Swal.fire({
            icon: 'error',
            title: 'Gagal Mengirim!',
            text: e.message || 'Terjadi kesalahan. Silakan coba lagi.',
            confirmButtonText: 'Tutup'
          });
        } else {
          alert(e.message || 'Gagal mengirim pesan.');
        }
      }
      this.loading = false;
    }
  }
};