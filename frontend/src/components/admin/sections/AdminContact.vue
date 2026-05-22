<template>
  <div>
    <div class="admin-card alert-card-contact">
      <div class="admin-card-body alert-card-body">
        <div class="alert-info-icon-box bg-blue">
          <i class="fa-solid fa-circle-info white-text"></i>
        </div>
        <div>
          <p class="alert-card-title blue-text">Halaman Contact Us</p>
          <p class="alert-card-tip blue-text">
            Perubahan akan langsung tampil di halaman <strong>#/contact</strong> pada website.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Edit Informasi Kontak</h3>
      </div>
      <div class="admin-card-body">
        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-image"></i> Banner Halaman
        </h4>
        <div class="form-row">
          <div class="form-group">
            <label>Judul Halaman</label>
            <input class="form-control" v-model="contactData.page_title" placeholder="Hubungi Kami" />
          </div>
          <div class="form-group">
            <label>Subtitle</label>
            <input
              class="form-control"
              v-model="contactData.page_subtitle"
              placeholder="Kami siap membantu kebutuhan logistik Anda"
            />
          </div>
        </div>

        <hr class="admin-divider-large" />

        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-address-book"></i> Detail Kontak
        </h4>
        <div class="form-group">
          <label>
            <i class="fa-solid fa-location-dot red-icon-margin"></i> Alamat Lengkap <span class="req-star">*</span>
          </label>
          <textarea
            class="form-control"
            v-model="contactData.address"
            rows="2"
            placeholder="Jl. Raya Industri No. 123, Jakarta Timur"
          ></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fa-solid fa-phone green-icon-margin"></i> Telepon Utama</label>
            <input class="form-control" v-model="contactData.phone" placeholder="+62 21 1234 5678" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-mobile-screen green-icon-margin"></i> Telepon / WhatsApp (opsional)</label>
            <input class="form-control" v-model="contactData.mobile" placeholder="+62 812 xxxx xxxx" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fa-solid fa-envelope blue-icon-margin"></i> Email <span class="req-star">*</span></label>
            <input class="form-control" type="email" v-model="contactData.email" placeholder="info@perusahaan.com" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-clock orange-icon-margin"></i> Jam Operasional</label>
            <input class="form-control" v-model="contactData.hours" placeholder="Sen - Jum: 08:00 - 17:00 WIB" />
          </div>
        </div>

        <hr class="admin-divider-large" />

        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-map-location-dot"></i> Google Maps Embed
        </h4>
        <p class="section-tip">
          Buka <strong>Google Maps</strong> → cari lokasi → klik <em>Share</em> → <em>Embed a map</em> → salin hanya URL dari <code>src="..."</code>.
        </p>
        <div class="form-group">
          <label>URL Embed Maps (src dari iframe)</label>
          <input
            class="form-control"
            v-model="contactData.map_embed"
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </div>

        <!-- Maps preview -->
        <div v-if="contactData.map_embed" class="maps-preview-card">
          <iframe
            :src="contactData.map_embed"
            width="100%"
            height="280"
            class="maps-preview-iframe"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div v-else class="maps-empty-state">
          <i class="fa-solid fa-map maps-empty-icon"></i>
          Preview peta akan muncul setelah URL diisi
        </div>

        <div class="btn-group-actions">
          <button class="btn btn-primary" @click="saveContact">
            <i class="fa-solid fa-check"></i> Simpan Contact
          </button>
          <button class="btn btn-reset" @click="fetchContact">
            <i class="fa-solid fa-rotate-left"></i> Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';
import { swal } from '../swal.js';

export default {
  name: 'AdminContact',
  data() {
    return {
      contactData: {
        page_title: '',
        page_subtitle: '',
        address: '',
        phone: '',
        mobile: '',
        email: '',
        hours: '',
        map_embed: ''
      }
    };
  },
  async mounted() {
    await this.fetchContact();
  },
  methods: {
    async fetchContact() {
      try {
        const r = await api.getContent('contact');
        if (r.data) this.contactData = { ...this.contactData, ...r.data };
      } catch (e) {
        console.error('Gagal mengambil data contact info:', e);
      }
    },
    async saveContact() {
      if (!this.contactData.address || !this.contactData.address.trim()) {
        await swal.error('Validasi Gagal!', 'Alamat tidak boleh kosong.');
        return;
      }
      if (!this.contactData.email || !this.contactData.email.trim()) {
        await swal.error('Validasi Gagal!', 'Email tidak boleh kosong.');
        return;
      }
      try {
        await api.updateContent('contact', this.contactData);
        await swal.success('Contact Berhasil Diperbarui!', 'Informasi kontak telah disimpan ke database.');
      } catch (e) {
        await swal.error('Gagal Menyimpan Contact!', e.message || 'Terjadi kesalahan pada server.');
      }
    }
  }
};
</script>
