<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Edit Hero Banner</h3>
      </div>
      <div class="admin-card-body">
        <div class="form-group">
          <label>Judul</label>
          <input class="form-control" v-model="hero.title" />
        </div>
        <div class="form-group">
          <label>Subtitle</label>
          <textarea class="form-control" v-model="hero.subtitle" rows="3"></textarea>
        </div>
        <h4 class="section-title">Statistik</h4>
        <div v-for="(s, i) in hero.stats" :key="i" class="form-row form-row-stat">
          <div class="form-group">
            <label>Value</label>
            <input class="form-control" v-model="s.value" />
          </div>
          <div class="form-group">
            <label>Label</label>
            <input class="form-control" v-model="s.label" />
          </div>
        </div>

        <div class="form-group upload-section">
          <label class="upload-label">
            <i class="fa-solid fa-image primary-icon"></i>
            Background Image Banner
          </label>
          <p class="upload-tip">
            Rekomendasi: Ukuran 1920x1080px, format JPG/WebP, max 10MB.
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
            <div v-if="hero.bg_image || hero._preview" class="image-preview-box">
              <img
                :src="hero._preview || ($baseDir + '/' + hero.bg_image)"
                class="preview-img-fit"
              />
              <button @click="removeHeroBg" class="btn-sm btn-delete preview-del-btn">
                <i class="fa-solid fa-circle-xmark"></i> Hapus
              </button>
            </div>
          </div>
        </div>

        <hr class="my-4">
        <h4 class="section-title">Visual Card (Sebelah Kanan)</h4>
        
        <div class="admin-card-inner mb-4 p-3 border rounded">
          <h5>Card Utama</h5>
          <div class="form-group">
            <label>Judul Card</label>
            <input class="form-control" v-model="hero.visual.card_title" placeholder="Contoh: Complete Fleet" />
          </div>
          <div class="form-group">
            <label>Sub-Judul Card</label>
            <input class="form-control" v-model="hero.visual.card_subtitle" placeholder="Contoh: PICKUP • CDE • CDD • FUSO • WINGBOX" />
          </div>
          <div class="form-group">
            <label>Label Pills (pisahkan dengan koma)</label>
            <input class="form-control" v-model="hero.visual.card_pills" placeholder="Contoh: PICKUP,CDE,CDD,FUSO,WINGBOX" />
          </div>
        </div>

        <div class="admin-card-inner mb-4 p-3 border rounded">
          <h5>Floating Badge 1 (Atas)</h5>
          <div class="form-group">
            <label>Judul Badge 1</label>
            <input class="form-control" v-model="hero.visual.badge1_title" placeholder="Contoh: On-Time Delivery" />
          </div>
          <div class="form-group">
            <label>Teks Bawah Badge 1</label>
            <input class="form-control" v-model="hero.visual.badge1_subtitle" placeholder="Contoh: 98.5% Rate" />
          </div>
        </div>

        <div class="admin-card-inner mb-4 p-3 border rounded">
          <h5>Floating Badge 2 (Bawah)</h5>
          <div class="form-group">
            <label>Judul Badge 2</label>
            <input class="form-control" v-model="hero.visual.badge2_title" placeholder="Contoh: GPS Tracking" />
          </div>
          <div class="form-group">
            <label>Teks Bawah Badge 2</label>
            <input class="form-control" v-model="hero.visual.badge2_subtitle" placeholder="Contoh: Real-time Monitor" />
          </div>
        </div>

        <button class="btn btn-primary submit-btn-margin" @click="saveHero">
          <i class="fa-solid fa-check"></i> Simpan Banner
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';
import { swal } from '../swal.js';

export default {
  name: 'AdminHero',
  data() {
    return {
      hero: { 
        title: '', subtitle: '', stats: [], bg_image: '', _preview: '',
        visual: {
          card_title: 'Complete Fleet',
          card_subtitle: 'PICKUP • CDE • CDD • FUSO • WINGBOX',
          card_pills: 'PICKUP,CDE,CDD,FUSO,WINGBOX',
          badge1_title: 'On-Time Delivery',
          badge1_subtitle: '98.5% Rate',
          badge2_title: 'GPS Tracking',
          badge2_subtitle: 'Real-time Monitor'
        }
      },
      heroFile: null
    };
  },
  async mounted() {
    await this.fetchHero();
  },
  methods: {
    async fetchHero() {
      try {
        const r = await api.getContent('hero');
        if (r.data) {
          this.hero = { 
            ...r.data, 
            _preview: '',
            visual: r.data.visual || this.hero.visual
          };
        }
      } catch (e) {
        console.error('Gagal mengambil data hero:', e);
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

      this.heroFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.hero._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeHeroBg() {
      this.hero.bg_image = '';
      this.hero._preview = '';
      this.heroFile = null;
    },
    async saveHero() {
      swal.loading('Menyimpan Hero...', 'Gambar sedang diproses dan diunggah.');
      try {
        const fd = new FormData();
        const payload = { ...this.hero };
        delete payload._preview;

        fd.append('data', JSON.stringify(payload));
        if (this.heroFile) {
          fd.append('image', this.heroFile);
        }
        fd.append('_method', 'PUT');

        const r = await api.updateContentWithImage('hero', fd);
        if (r.success) {
          this.hero = { ...r.data, _preview: '' };
          this.heroFile = null;
          await swal.success('Hero Banner Berhasil Disimpan!', 'Perubahan telah diterapkan ke website.');
        }
      } catch (e) {
        await swal.error('Gagal Menyimpan Hero!', e.message || 'Terjadi kesalahan pada server.');
      }
    }
  }
};
</script>
