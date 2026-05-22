// Request Quote Component
const RequestQuote = {
  template: `
    <div>
      <section class="page-banner">
        <div class="container">
          <h1 data-aos="fade-up">Request Quote</h1>
          <p data-aos="fade-up" data-aos-delay="100">Dapatkan penawaran harga terbaik untuk kebutuhan logistik Anda</p>
        </div>
      </section>
      <section class="section">
        <div class="container" style="max-width:800px">
          <div class="form-card" data-aos="fade-up">
            <h3><i class="bi bi-send-fill" style="color:var(--primary);margin-right:8px"></i> Form Permintaan Penawaran</h3>
            <p style="color:var(--text-light);margin-bottom:28px;font-size:.9rem">Isi form berikut dan tim kami akan menghubungi Anda dalam 1x24 jam.</p>
            <div class="alert alert-success" v-if="success"><i class="bi bi-check-circle-fill"></i> {{ success }}</div>
            <div class="alert alert-error" v-if="error"><i class="bi bi-exclamation-circle-fill"></i> {{ error }}</div>
            <form @submit.prevent="submit" v-if="!success">
              <div class="form-row">
                <div class="form-group">
                  <label>Nama Lengkap *</label>
                  <input class="form-control" v-model="form.name" required placeholder="Nama Anda">
                </div>
                <div class="form-group">
                  <label>Perusahaan</label>
                  <input class="form-control" v-model="form.company" placeholder="Nama perusahaan">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email *</label>
                  <input class="form-control" type="email" v-model="form.email" required placeholder="email@example.com">
                </div>
                <div class="form-group">
                  <label>Telepon *</label>
                  <input class="form-control" v-model="form.phone" required placeholder="08xx xxxx xxxx">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Kota Asal *</label>
                  <input class="form-control" v-model="form.origin" required placeholder="Kota asal pengiriman">
                </div>
                <div class="form-group">
                  <label>Kota Tujuan *</label>
                  <input class="form-control" v-model="form.destination" required placeholder="Kota tujuan pengiriman">
                </div>
              </div>
              <div class="form-group">
                <label>Jenis Barang *</label>
                <input class="form-control" v-model="form.cargo_type" required placeholder="Contoh: Elektronik, Material Konstruksi, dll">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Estimasi Berat</label>
                  <input class="form-control" v-model="form.weight" placeholder="Contoh: 5 Ton">
                </div>
                <div class="form-group">
                  <label>Estimasi Volume</label>
                  <input class="form-control" v-model="form.volume" placeholder="Contoh: 10 CBM">
                </div>
              </div>
              <div class="form-group">
                <label>Catatan Tambahan</label>
                <textarea class="form-control" v-model="form.notes" placeholder="Informasi tambahan..." rows="3"></textarea>
              </div>
              <button class="btn btn-primary form-submit" type="submit" :disabled="loading">
                <i class="bi" :class="loading?'bi-arrow-repeat':'bi-send-fill'"></i>
                {{ loading ? 'Mengirim...' : 'Kirim Permintaan' }}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  data() {
    return {
      form: { name: '', company: '', email: '', phone: '', origin: '', destination: '', cargo_type: '', weight: '', volume: '', notes: '' },
      loading: false, success: '', error: ''
    };
  },
  mounted() { this.$nextTick(() => { if (window.AOS) AOS.refresh(); }); },
  methods: {
    async submit() {
      this.loading = true; this.success = ''; this.error = '';
      try {
        const r = await api.submitQuote(this.form);
        this.success = r.message;
      } catch (e) { this.error = e.message || 'Gagal mengirim permintaan.'; }
      this.loading = false;
    }
  }
};
