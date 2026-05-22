<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Edit About Us</h3>
      </div>
      <div class="admin-card-body">
        <div class="form-group">
          <label>Judul</label>
          <input class="form-control" v-model="aboutData.title" />
        </div>
        <div class="form-group">
          <label>Deskripsi</label>
          <textarea class="form-control" v-model="aboutData.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Deskripsi 2</label>
          <textarea class="form-control" v-model="aboutData.description2" rows="2"></textarea>
        </div>

        <div class="form-group upload-section">
          <label class="upload-label">
            <i class="fa-solid fa-image primary-icon"></i>
            Gambar About Us
          </label>
          <p class="upload-tip">
            Default: assets/img/about-company.png. Rekomendasi: 800x600px, max 10MB.
          </p>
          <div class="upload-row">
            <div class="upload-input-wrap">
              <input
                type="file"
                class="form-control file-input-pad"
                accept="image/*"
                @change="handleFileSelect($event)"
              />
            </div>
            <div v-if="aboutData.bg_image || aboutData._preview" class="image-preview-box-about">
              <img
                :src="aboutData._preview || ($baseDir + '/' + aboutData.bg_image)"
                class="preview-img-fit"
              />
              <button @click="removeAboutImg" class="btn-sm btn-delete preview-del-btn-about">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>

        <hr class="admin-divider" />

        <div class="form-row">
          <div class="form-group">
            <label><i class="fa-solid fa-calendar-check primary-icon-margin"></i> Tahun Berdiri</label>
            <input class="form-control" v-model="aboutData.founded_year" placeholder="2009" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-heading primary-icon-margin"></i> Label Tahun</label>
            <input class="form-control" v-model="aboutData.founded_label" placeholder="BERDIRI SEJAK" />
          </div>
        </div>

        <hr class="admin-divider" />

        <div class="form-group">
          <label>Visi</label>
          <textarea class="form-control" v-model="aboutData.vision" rows="2"></textarea>
        </div>
        <h4 class="section-title">Misi</h4>
        <div v-for="(m, i) in aboutData.mission" :key="i" class="form-group">
          <input class="form-control" v-model="aboutData.mission[i]" :placeholder="'Misi ' + (i + 1)" />
        </div>

        <hr class="admin-divider" />

        <h4 class="section-title-bold">
          <i class="fa-solid fa-heart accent-icon-margin"></i> Nilai-Nilai Perusahaan
        </h4>
        <p class="section-tip">Pisahkan dengan koma. Contoh: Integritas, Inovasi, Keandalan</p>
        <div class="form-group">
          <textarea
            class="form-control"
            v-model="aboutData.values_text"
            rows="2"
            placeholder="Integritas, Profesionalisme, Inovasi, Keandalan, Kepuasan Pelanggan"
          ></textarea>
        </div>

        <hr class="admin-divider" />

        <h4 class="section-title-bold">
          <i class="fa-solid fa-file-contract primary-icon-margin"></i> Legalitas
        </h4>
        <div class="form-group">
          <textarea
            class="form-control"
            v-model="aboutData.legality"
            rows="2"
            placeholder="Berizin resmi, bersertifikasi, dan terdaftar di Kementerian Perhubungan RI"
          ></textarea>
        </div>

        <button class="btn btn-primary" @click="saveAboutData">
          <i class="fa-solid fa-check"></i> Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';
import { swal } from '../swal.js';

export default {
  name: 'AdminAbout',
  data() {
    return {
      aboutData: {
        title: '',
        description: '',
        description2: '',
        vision: '',
        mission: [],
        values: [],
        founded_year: '2009',
        founded_label: 'BERDIRI SEJAK',
        values_text: '',
        legality: '',
        bg_image: '',
        _preview: ''
      },
      aboutFile: null
    };
  },
  async mounted() {
    await this.fetchAbout();
  },
  methods: {
    async fetchAbout() {
      try {
        const r = await api.getContent('about');
        if (r.data) {
          this.aboutData = {
            ...this.aboutData,
            ...r.data,
            _preview: '',
            values_text: Array.isArray(r.data.values) ? r.data.values.join(', ') : (r.data.values_text || ''),
            founded_year: r.data.founded_year || '2009',
            founded_label: r.data.founded_label || 'BERDIRI SEJAK',
            legality: r.data.legality || ''
          };
          // Ensure mission has at least 3 elements if empty, or match existing
          if (!this.aboutData.mission || !this.aboutData.mission.length) {
            this.aboutData.mission = ['', '', ''];
          }
        }
      } catch (e) {
        console.error('Gagal mengambil data about:', e);
      }
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        swal.error('File Terlalu Besar!', 'Maksimal ukuran gambar adalah 10MB. Silakan kompres atau pilih gambar lain.');
        event.target.value = '';
        return;
      }

      this.aboutFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.aboutData._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeAboutImg() {
      this.aboutData.bg_image = '';
      this.aboutData._preview = '';
      this.aboutFile = null;
    },
    async saveAboutData() {
      swal.loading('Menyimpan About...', 'Memproses gambar dan data.');
      try {
        const payload = {
          ...this.aboutData,
          values: this.aboutData.values_text
            ? this.aboutData.values_text.split(',').map(v => v.trim()).filter(v => v)
            : this.aboutData.values || [],
          mission: this.aboutData.mission.filter(m => m.trim() !== '')
        };
        delete payload._preview;

        const fd = new FormData();
        fd.append('data', JSON.stringify(payload));
        if (this.aboutFile) {
          fd.append('image', this.aboutFile);
        }
        fd.append('_method', 'PUT');

        const r = await api.updateContentWithImage('about', fd);
        if (r.success) {
          this.aboutData = {
            ...this.aboutData,
            ...r.data,
            _preview: '',
            values_text: Array.isArray(r.data.values) ? r.data.values.join(', ') : (r.data.values_text || '')
          };
          this.aboutFile = null;
          await swal.success('About Us Berhasil Disimpan!', 'Konten about telah diperbarui.');
        }
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan pada server.');
      }
    }
  }
};
</script>
