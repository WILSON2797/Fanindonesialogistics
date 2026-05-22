<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Edit Footer</h3>
      </div>
      <div class="admin-card-body">
        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-building"></i> Kolom Brand
        </h4>
        <div class="form-group">
          <label>Nama Perusahaan</label>
          <input
            class="form-control"
            v-model="footerData.brand_name"
            placeholder="PT. Fan Indonesia Sejahtera"
          />
        </div>
        <div class="form-group">
          <label>Deskripsi Singkat</label>
          <textarea
            class="form-control"
            v-model="footerData.brand_desc"
            rows="3"
            placeholder="Mitra logistik terpercaya..."
          ></textarea>
        </div>

        <hr class="admin-divider-large" />

        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-phone"></i> Informasi Kontak
        </h4>
        <div class="form-group">
          <label><i class="fa-solid fa-location-dot accent-icon-footer"></i> Alamat</label>
          <input
            class="form-control"
            v-model="footerData.contact_address"
            placeholder="Jl. Raya Industri No. 123, Jakarta Timur"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fa-solid fa-phone accent-icon-footer"></i> Telepon</label>
            <input class="form-control" v-model="footerData.contact_phone" placeholder="+62 21 1234 5678" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-envelope accent-icon-footer"></i> Email</label>
            <input class="form-control" v-model="footerData.contact_email" placeholder="info@perusahaan.com" />
          </div>
        </div>
        <div class="form-group">
          <label><i class="fa-solid fa-clock accent-icon-footer"></i> Jam Operasional</label>
          <input class="form-control" v-model="footerData.contact_hours" placeholder="Sen - Jum: 08:00 - 17:00 WIB" />
        </div>

        <hr class="admin-divider-large" />

        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-list-ul"></i> Daftar Layanan (Footer)
        </h4>
        <p class="section-tip">Satu item per baris. Contoh: <code>Transportasi Darat</code></p>
        <div v-for="(sv, i) in footerData.services_list" :key="'sv' + i" class="footer-service-row">
          <input
            class="form-control service-input-row"
            v-model="footerData.services_list[i]"
            :placeholder="'Layanan ' + (i + 1)"
          />
          <button class="btn-sm btn-delete delete-service-row-btn" @click="removeFooterService(i)" title="Hapus">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <button class="btn btn-primary btn-sm add-service-row-btn" @click="addFooterService">
          <i class="fa-solid fa-plus"></i> Tambah Layanan
        </button>

        <hr class="admin-divider-large" />

        <h4 class="section-title-bold-primary">
          <i class="fa-solid fa-copyright"></i> Teks Copyright
        </h4>
        <div class="form-group">
          <label>Copyright (tanpa tahun — tahun otomatis ditambahkan)</label>
          <input
            class="form-control"
            v-model="footerData.copyright_text"
            placeholder="PT. Fan Indonesia Sejahtera. All rights reserved."
          />
        </div>

        <div class="btn-group-actions">
          <button class="btn btn-primary" @click="saveFooter">
            <i class="fa-solid fa-check"></i> Simpan Footer
          </button>
          <button class="btn btn-reset" @click="fetchFooter">
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
  name: 'AdminFooter',
  data() {
    return {
      footerData: {
        brand_name: '',
        brand_desc: '',
        contact_address: '',
        contact_phone: '',
        contact_email: '',
        contact_hours: '',
        services_list: [],
        copyright_text: ''
      }
    };
  },
  async mounted() {
    await this.fetchFooter();
  },
  methods: {
    async fetchFooter() {
      try {
        const r = await api.getContent('footer');
        if (r.data) {
          this.footerData = {
            ...this.footerData,
            ...r.data,
            services_list: Array.isArray(r.data.services_list)
              ? r.data.services_list
              : r.data.services_list
              ? r.data.services_list.split('\n').filter(Boolean)
              : []
          };
        }
      } catch (e) {
        console.error('Gagal mengambil data footer:', e);
      }
    },
    addFooterService() {
      this.footerData.services_list.push('');
    },
    removeFooterService(index) {
      this.footerData.services_list.splice(index, 1);
    },
    async saveFooter() {
      if (!this.footerData.brand_name || !this.footerData.brand_name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama perusahaan tidak boleh kosong.');
        return;
      }
      if (!this.footerData.contact_email || !this.footerData.contact_email.trim()) {
        await swal.error('Validasi Gagal!', 'Email kontak tidak boleh kosong.');
        return;
      }

      try {
        const payload = {
          ...this.footerData,
          services_list: this.footerData.services_list.filter((s) => s.trim() !== '')
        };
        await api.updateContent('footer', payload);
        await swal.success('Footer Berhasil Diperbarui!', 'Perubahan footer telah disimpan ke database.');
        await this.fetchFooter();
      } catch (e) {
        await swal.error('Gagal Menyimpan Footer!', e.message || 'Terjadi kesalahan pada server.');
      }
    }
  }
};
</script>
