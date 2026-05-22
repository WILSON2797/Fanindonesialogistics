<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Kelola Layanan</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah
        </button>
      </div>
      <div class="admin-card-body">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in servicesList" :key="s.id">
                <td><i :class="'fa-solid ' + s.icon" class="table-service-icon"></i></td>
                <td><strong>{{ s.title }}</strong></td>
                <td class="table-desc-col">{{ (s.description || '').substring(0, 80) }}...</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editItem(s)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteItem(s.id)">
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

    <!-- LOCAL MODAL FOR SERVICE FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Icon (Font Awesome class)</label>
            <input class="form-control" v-model="modal.data.icon" placeholder="fa-truck" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-image form-icon-pad"></i> Gambar Layanan</label>
            <input
              type="file"
              class="form-control file-input-inner"
              accept="image/*"
              @change="handleFileSelect($event)"
            />
            <div v-if="modal.data.image_path || modal.data._preview" class="form-image-preview-wrapper">
              <div class="form-image-preview-card">
                <img
                  :src="modal.data._preview || ($baseDir + '/' + modal.data.image_path)"
                  class="form-preview-img"
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Judul</label>
            <input class="form-control" v-model="modal.data.title" />
          </div>
          <div class="form-group">
            <label>Deskripsi Singkat (Card)</label>
            <textarea class="form-control" v-model="modal.data.description" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Konten Detail (Halaman Detail)</label>
            <textarea
              class="form-control"
              v-model="modal.data.content"
              rows="6"
              placeholder="Jelaskan detail layanan di sini..."
            ></textarea>
            <small class="text-muted">Gunakan baris baru untuk memisahkan paragraf.</small>
          </div>
          <div class="form-group">
            <label>Urutan</label>
            <input class="form-control" type="number" v-model="modal.data.sort_order" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveService">
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
  name: 'AdminServices',
  data() {
    return {
      servicesList: [],
      serviceFile: null,
      modal: {
        show: false,
        title: '',
        data: { icon: 'fa-truck', title: '', description: '', content: '', sort_order: 0, is_active: 1 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchServices();
  },
  methods: {
    async fetchServices() {
      try {
        const r = await api.getServices();
        this.servicesList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data layanan:', e);
      }
    },
    openModal(data = null) {
      this.serviceFile = null;
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Layanan',
          data: { ...data, _preview: '' },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Layanan',
          data: { icon: 'fa-truck', title: '', description: '', content: '', sort_order: 0, is_active: 1, _preview: '' },
          editId: null
        };
      }
    },
    editItem(item) {
      this.openModal(item);
    },
    async deleteItem(id) {
      const result = await swal.confirm('Hapus Data?', 'Data yang dihapus tidak dapat dikembalikan.');
      if (!result.isConfirmed) return;

      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteService(id);
        await swal.success('Berhasil Dihapus!', 'Data telah dihapus dari sistem.');
        await this.fetchServices();
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan pada server.');
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

      this.serviceFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modal.data._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveService() {
      const d = this.modal.data;
      if (!d.title || !d.title.trim()) {
        await swal.error('Validasi Gagal!', 'Judul layanan tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Layanan...', 'Memproses data dan gambar.');
      const fd = new FormData();
      fd.append('title', d.title);
      fd.append('icon', d.icon || 'fa-truck');
      fd.append('description', d.description || '');
      fd.append('content', d.content || '');
      fd.append('sort_order', d.sort_order || 0);
      fd.append('is_active', d.is_active !== undefined ? d.is_active : 1);
      if (this.serviceFile) {
        fd.append('image', this.serviceFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateService(this.modal.editId, fd);
        } else {
          await api.createService(fd);
        }
        this.modal.show = false;
        this.serviceFile = null;
        await swal.success('Layanan Disimpan!', 'Data layanan berhasil disimpan.');
        await this.fetchServices();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
