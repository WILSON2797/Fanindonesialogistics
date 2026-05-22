<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Kelola Warehouse</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah
        </button>
      </div>
      <div class="admin-card-body">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama</th>
                <th>Luas</th>
                <th>Tipe</th>
                <th>Region</th>
                <th>Project</th>
                <th>Highlights</th>
                <th>Gallery</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in warehouseList" :key="w.id">
                <td>
                  <div class="gallery-preview-thumbnail">
                    <img
                      v-if="w.image_path"
                      :src="$baseDir + '/' + w.image_path"
                      class="img-preview-inside-table-cover"
                    />
                    <i v-else class="fa-solid fa-warehouse icon-placeholder-inside-table"></i>
                  </div>
                </td>
                <td><strong>{{ w.name }}</strong></td>
                <td>{{ w.area || '-' }}</td>
                <td>{{ w.type || '-' }}</td>
                <td>{{ w.region || '-' }}</td>
                <td>{{ w.project || '-' }}</td>
                <td>
                  <button class="btn-sm btn-edit" style="background:#8b5cf6;" @click="openHighlightsModal(w)" title="Kelola Highlights">
                    <i class="fa-solid fa-list-check"></i>
                  </button>
                </td>
                <td>
                  <button class="btn-sm btn-edit" @click="openGalleryModal(w)" title="Kelola Gallery">
                    <i class="fa-solid fa-images"></i>
                  </button>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editItem(w)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteItem(w.id)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="warehouseList.length === 0">
                <td colspan="8" style="text-align:center; color:#94a3b8; padding:30px;">
                  <i class="fa-solid fa-warehouse" style="font-size:1.5rem; margin-bottom:8px; display:block; opacity:0.3;"></i>
                  Belum ada data warehouse.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL FORM WAREHOUSE -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Warehouse <span class="req-star">*</span></label>
            <input class="form-control" v-model="modal.data.name" placeholder="Contoh: Warehouse Cibitung" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Luas Area</label>
              <input class="form-control" v-model="modal.data.area" placeholder="Contoh: 5.000 m²" />
            </div>
            <div class="form-group">
              <label>Tipe Warehouse</label>
              <input class="form-control" v-model="modal.data.type" placeholder="Contoh: Dry Storage" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Region</label>
              <input class="form-control" v-model="modal.data.region" placeholder="Contoh: Jawa Barat" />
            </div>
            <div class="form-group">
              <label>Project</label>
              <input class="form-control" v-model="modal.data.project" placeholder="Contoh: PT. XYZ Distribution" />
            </div>
          </div>
          <div class="form-group">
            <label>Deskripsi</label>
            <textarea class="form-control" v-model="modal.data.description" rows="3" placeholder="Deskripsi singkat warehouse..."></textarea>
          </div>
          <div class="form-group">
            <label>Urutan</label>
            <input class="form-control" type="number" v-model="modal.data.sort_order" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-image form-icon-pad"></i> Foto Utama Warehouse</label>
            <input
              type="file"
              class="form-control file-input-inner"
              accept="image/*"
              @change="handleFileSelect($event)"
            />
            <div v-if="modal.data.image_path || modal.data._preview" class="form-image-preview-wrapper-fleet">
              <div class="form-image-preview-card-fleet">
                <img
                  :src="modal.data._preview || ($baseDir + '/' + modal.data.image_path)"
                  class="form-preview-img"
                />
              </div>
              <button class="btn btn-danger btn-circle-del" @click="removePhoto" title="Hapus Foto">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveWarehouse">
            <i class="fa-solid fa-check"></i> Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL HIGHLIGHTS WAREHOUSE -->
    <div class="modal-overlay" v-if="highlightsModal.show" @click.self="highlightsModal.show = false">
      <div class="modal" style="max-width:700px;">
        <div class="modal-header">
          <h3><i class="fa-solid fa-list-check" style="margin-right:8px;"></i> Highlights — {{ highlightsModal.warehouseName }}</h3>
          <button class="modal-close" @click="highlightsModal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <!-- Add New -->
          <div class="form-group">
            <label><i class="fa-solid fa-plus form-icon-pad"></i> Tambah Highlight</label>
            <div class="form-row" style="align-items:flex-end;">
              <div class="form-group" style="flex:1;">
                <input class="form-control" v-model="highlightForm.text" placeholder="Teks Highlight (cth: Keamanan 24 Jam)" @keyup.enter="addHighlight" />
              </div>
              <div class="form-group" style="flex:0;">
                <button class="btn btn-primary btn-sm" @click="addHighlight" :disabled="!highlightForm.text">
                  <i class="fa-solid fa-plus"></i> Tambah
                </button>
              </div>
            </div>
          </div>

          <hr class="admin-divider">

          <!-- Highlights List -->
          <div class="table-responsive" v-if="highlights.length > 0">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Highlight</th>
                  <th style="width:60px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="h in highlights" :key="h.id">
                  <td><i class="bi bi-check2-circle" style="color:var(--primary); margin-right:8px; font-weight:bold;"></i> {{ h.text }}</td>
                  <td>
                    <button class="btn-sm btn-delete" @click="deleteHighlight(h.id)" title="Hapus">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else style="text-align:center; padding:30px; color:#94a3b8;">
            <i class="fa-solid fa-list-check" style="font-size:2rem; opacity:0.2; display:block; margin-bottom:8px;"></i>
            Belum ada highlight untuk warehouse ini.
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL GALLERY WAREHOUSE -->
    <div class="modal-overlay" v-if="galleryModal.show" @click.self="galleryModal.show = false">
      <div class="modal" style="max-width:700px;">
        <div class="modal-header">
          <h3><i class="fa-solid fa-images" style="margin-right:8px;"></i> Gallery — {{ galleryModal.warehouseName }}</h3>
          <button class="modal-close" @click="galleryModal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <!-- Upload New -->
          <div class="form-group">
            <label><i class="fa-solid fa-upload form-icon-pad"></i> Tambah Foto Gallery</label>
            <div class="form-row" style="align-items:flex-end;">
              <div class="form-group" style="flex:2;">
                <input
                  type="file"
                  class="form-control file-input-inner"
                  accept="image/*"
                  ref="galleryFileInput"
                  @change="handleGalleryFileSelect($event)"
                />
              </div>
              <div class="form-group" style="flex:2;">
                <input class="form-control" v-model="galleryCaption" placeholder="Caption (opsional)" />
              </div>
              <div class="form-group" style="flex:0;">
                <button class="btn btn-primary btn-sm" @click="uploadGalleryImage" :disabled="!galleryFile">
                  <i class="fa-solid fa-upload"></i> Upload
                </button>
              </div>
            </div>
          </div>

          <hr class="admin-divider">

          <!-- Gallery List -->
          <div class="admin-gallery-grid" v-if="galleryImages.length > 0">
            <div class="admin-gallery-item" v-for="img in galleryImages" :key="img.id">
              <div class="admin-gallery-img-wrap">
                <img :src="$baseDir + '/' + img.image_path" class="admin-gallery-img" />
                <button class="admin-gallery-del-btn" @click="deleteGalleryImage(img.id)" title="Hapus">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
              <div class="admin-gallery-caption" v-if="img.caption">{{ img.caption }}</div>
            </div>
          </div>

          <div v-else style="text-align:center; padding:30px; color:#94a3b8;">
            <i class="fa-solid fa-images" style="font-size:2rem; opacity:0.2; display:block; margin-bottom:8px;"></i>
            Belum ada foto gallery untuk warehouse ini.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';
import { swal } from '../swal.js';

export default {
  name: 'AdminWarehouse',
  data() {
    return {
      warehouseList: [],
      warehouseFile: null,
      modal: {
        show: false,
        title: '',
        data: { name: '', area: '', type: '', region: '', project: '', description: '', sort_order: 0 },
        editId: null
      },
      // Gallery modal
      galleryModal: {
        show: false,
        warehouseId: null,
        warehouseName: ''
      },
      galleryImages: [],
      galleryFile: null,
      galleryCaption: '',
      // Highlights modal
      highlightsModal: {
        show: false,
        warehouseId: null,
        warehouseName: ''
      },
      highlights: [],
      highlightForm: { icon: '', text: '' }
    };
  },
  async mounted() {
    await this.fetchWarehouses();
  },
  methods: {
    async fetchWarehouses() {
      try {
        const r = await api.getWarehouses();
        this.warehouseList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data warehouse:', e);
      }
    },
    openModal(data = null) {
      this.warehouseFile = null;
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Warehouse',
          data: { ...data, _preview: '', _remove: false },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Warehouse',
          data: { name: '', area: '', type: '', region: '', project: '', description: '', sort_order: 0, _preview: '', _remove: false },
          editId: null
        };
      }
    },
    editItem(item) {
      this.openModal(item);
    },
    async deleteItem(id) {
      const result = await swal.confirm('Hapus Warehouse?', 'Data warehouse beserta semua foto gallery akan dihapus permanen.');
      if (!result.isConfirmed) return;

      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteWarehouse(id);
        await swal.success('Berhasil Dihapus!', 'Data warehouse telah dihapus.');
        await this.fetchWarehouses();
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan pada server.');
      }
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        swal.error('File Terlalu Besar!', 'Maksimal ukuran gambar adalah 10MB.');
        event.target.value = '';
        return;
      }

      this.warehouseFile = file;
      this.modal.data._remove = false;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modal.data._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removePhoto() {
      this.modal.data.image_path = '';
      this.modal.data._preview = '';
      this.modal.data._remove = true;
      this.warehouseFile = null;
    },
    async saveWarehouse() {
      const d = this.modal.data;
      if (!d.name || !d.name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama warehouse tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Warehouse...', 'Memproses data dan gambar warehouse.');
      const fd = new FormData();
      const payload = { ...d };
      delete payload._preview;

      fd.append('data', JSON.stringify(payload));
      if (this.warehouseFile) {
        fd.append('image', this.warehouseFile);
      }
      if (d._remove) {
        fd.append('remove_image', '1');
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateWarehouse(this.modal.editId, fd);
        } else {
          await api.createWarehouse(fd);
        }
        this.modal.show = false;
        this.warehouseFile = null;
        await swal.success('Warehouse Disimpan!', 'Data warehouse berhasil disimpan.');
        await this.fetchWarehouses();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    },

    // ═══════════════ Highlights Management ═══════════════
    async openHighlightsModal(warehouse) {
      this.highlightsModal = {
        show: true,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name
      };
      this.highlightForm = { icon: '', text: '' };
      await this.fetchHighlights(warehouse.id);
    },
    async fetchHighlights(warehouseId) {
      try {
        const r = await api.getWarehouseHighlights(warehouseId);
        this.highlights = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil highlights:', e);
        this.highlights = [];
      }
    },
    async addHighlight() {
      if (!this.highlightForm.text.trim()) return;

      swal.loading('Menyimpan...', 'Mohon tunggu.');
      try {
        const payload = {
          icon: this.highlightForm.icon || 'bi-check-circle',
          text: this.highlightForm.text
        };
        await api.addWarehouseHighlight(this.highlightsModal.warehouseId, payload);
        this.highlightForm = { icon: '', text: '' };
        await swal.success('Ditambahkan!', 'Highlight berhasil ditambahkan.');
        await this.fetchHighlights(this.highlightsModal.warehouseId);
      } catch (e) {
        await swal.error('Gagal!', e.message || 'Terjadi kesalahan.');
      }
    },
    async deleteHighlight(highlightId) {
      const result = await swal.confirm('Hapus Highlight?', 'Highlight ini akan dihapus permanen.');
      if (!result.isConfirmed) return;

      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteWarehouseHighlight(highlightId);
        await swal.success('Dihapus!', 'Highlight telah dihapus.');
        await this.fetchHighlights(this.highlightsModal.warehouseId);
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan.');
      }
    },

    // ═══════════════ Gallery Management ═══════════════
    async openGalleryModal(warehouse) {
      this.galleryModal = {
        show: true,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name
      };
      this.galleryFile = null;
      this.galleryCaption = '';
      await this.fetchGalleryImages(warehouse.id);
    },
    async fetchGalleryImages(warehouseId) {
      try {
        const r = await api.getWarehouseGallery(warehouseId);
        this.galleryImages = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil gallery:', e);
        this.galleryImages = [];
      }
    },
    handleGalleryFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        swal.error('File Terlalu Besar!', 'Maksimal ukuran gambar adalah 10MB.');
        event.target.value = '';
        return;
      }
      this.galleryFile = file;
    },
    async uploadGalleryImage() {
      if (!this.galleryFile) return;

      swal.loading('Mengupload...', 'Memproses gambar gallery.');
      const fd = new FormData();
      fd.append('image', this.galleryFile);
      fd.append('data', JSON.stringify({ caption: this.galleryCaption }));

      try {
        await api.addWarehouseGallery(this.galleryModal.warehouseId, fd);
        this.galleryFile = null;
        this.galleryCaption = '';
        if (this.$refs.galleryFileInput) this.$refs.galleryFileInput.value = '';
        await swal.success('Foto Ditambahkan!', 'Foto gallery berhasil diupload.');
        await this.fetchGalleryImages(this.galleryModal.warehouseId);
      } catch (e) {
        await swal.error('Gagal Upload!', e.message || 'Terjadi kesalahan.');
      }
    },
    async deleteGalleryImage(galleryId) {
      const result = await swal.confirm('Hapus Foto?', 'Foto gallery ini akan dihapus permanen.');
      if (!result.isConfirmed) return;

      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteWarehouseGallery(galleryId);
        await swal.success('Foto Dihapus!', 'Foto gallery telah dihapus.');
        await this.fetchGalleryImages(this.galleryModal.warehouseId);
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>

<style scoped>
.admin-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.admin-gallery-item {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border, #e2e8f0);
  background: #f8fafc;
}

.admin-gallery-img-wrap {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #0f172a;
}

.admin-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-gallery-del-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.admin-gallery-img-wrap:hover .admin-gallery-del-btn {
  opacity: 1;
}

.admin-gallery-caption {
  padding: 6px 10px;
  font-size: 0.78rem;
  color: var(--text-light, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
