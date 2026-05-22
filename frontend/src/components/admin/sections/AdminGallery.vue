<template>
  <div>
    <div class="admin-card alert-card-gallery">
      <div class="admin-card-body alert-card-body">
        <div class="alert-info-icon-box bg-purple">
          <i class="fa-solid fa-circle-info white-text"></i>
        </div>
        <div>
          <p class="alert-card-title purple-text">Kelola Galeri</p>
          <p class="alert-card-tip purple-text">
            Upload foto kegiatan, armada, dan fasilitas. Halaman <strong>#/gallery</strong> akan menampilkan semua foto.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Daftar Galeri</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah Foto
        </button>
      </div>
      <div class="admin-card-body">
        <div class="empty-state" v-if="!galleryList.length">
          <i class="fa-solid fa-images"></i> Belum ada foto di galeri.
        </div>
        <div class="table-responsive" v-else>
          <table class="admin-table">
            <thead>
              <tr>
                <th class="col-width-100">Gambar</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in galleryList" :key="g.id">
                <td>
                  <div class="gallery-preview-thumbnail">
                    <img
                      v-if="g.image_path"
                      :src="$baseDir + '/' + g.image_path"
                      :alt="g.title"
                      class="img-preview-inside-table-cover"
                    />
                    <i v-else class="fa-solid fa-image icon-placeholder-inside-table"></i>
                  </div>
                </td>
                <td>
                  <strong>{{ g.title }}</strong>
                  <br />
                  <small class="text-placeholder-small">{{ (g.description || '').substring(0, 50) }}</small>
                </td>
                <td><span class="category-badge-admin">{{ g.category }}</span></td>
                <td>{{ g.sort_order }}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editGalleryItem(g)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteGalleryItem(g.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- LOCAL MODAL FOR GALLERY FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Judul Foto</label>
            <input class="form-control" v-model="modal.data.title" placeholder="Armada Truk Modern" />
          </div>
          <div class="form-group">
            <label>Deskripsi (opsional)</label>
            <textarea
              class="form-control"
              v-model="modal.data.description"
              rows="2"
              placeholder="Deskripsi singkat..."
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Kategori</label>
              <select class="form-control" v-model="modal.data.category">
                <option value="general">General</option>
                <option value="armada">Armada</option>
                <option value="fasilitas">Fasilitas</option>
                <option value="tim">Tim</option>
                <option value="operasional">Operasional</option>
              </select>
            </div>
            <div class="form-group">
              <label>Urutan</label>
              <input class="form-control" type="number" v-model="modal.data.sort_order" />
            </div>
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-image form-icon-pad"></i> Gambar</label>
            <input
              type="file"
              class="form-control file-input-inner"
              accept="image/*"
              @change="handleFileSelect($event)"
            />
            <div v-if="modal.data.image_path || modal.data._preview" class="form-image-preview-wrapper-gallery">
              <img
                :src="modal.data._preview || ($baseDir + '/' + modal.data.image_path)"
                class="form-preview-img-cover"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveGalleryItem">
            <i class="fa-solid fa-check"></i> Simpan
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
  name: 'AdminGallery',
  data() {
    return {
      galleryList: [],
      galleryFile: null,
      modal: {
        show: false,
        title: '',
        data: { title: '', description: '', category: 'general', sort_order: 0 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchGallery();
  },
  methods: {
    async fetchGallery() {
      try {
        const r = await api.getGallery();
        this.galleryList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data galeri:', e);
      }
    },
    openModal(data = null) {
      this.galleryFile = null;
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Foto Galeri',
          data: { ...data, _preview: '' },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Foto',
          data: { title: '', description: '', category: 'general', sort_order: 0, _preview: '' },
          editId: null
        };
      }
    },
    editGalleryItem(g) {
      this.openModal(g);
    },
    async deleteGalleryItem(id) {
      const result = await swal.confirm('Hapus Foto?', 'Foto akan dihapus permanen dari galeri.');
      if (!result.isConfirmed) return;
      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteGalleryItem(id);
        await swal.success('Foto Dihapus!', 'Foto berhasil dihapus dari galeri.');
        await this.fetchGallery();
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan.');
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

      this.galleryFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modal.data._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveGalleryItem() {
      const d = this.modal.data;
      if (!d.title || !d.title.trim()) {
        await swal.error('Validasi Gagal!', 'Judul foto tidak boleh kosong.');
        return;
      }

      swal.loading('Mengunggah Foto...', 'Sedang memproses dan mengompres gambar.');
      const fd = new FormData();
      fd.append('title', d.title);
      fd.append('description', d.description || '');
      fd.append('category', d.category || 'general');
      fd.append('sort_order', d.sort_order || 0);
      if (this.galleryFile) {
        fd.append('image', this.galleryFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateGalleryItem(this.modal.editId, fd);
        } else {
          await api.createGalleryItem(fd);
        }
        this.modal.show = false;
        this.galleryFile = null;
        await swal.success('Foto Disimpan!', 'Foto galeri berhasil disimpan.');
        await this.fetchGallery();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
