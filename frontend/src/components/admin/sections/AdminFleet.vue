<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Kelola Armada</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah
        </button>
      </div>
      <div class="admin-card-body">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Tipe</th>
                <th>Kapasitas</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in fleetList" :key="f.id">
                <td><strong>{{ f.name }}</strong></td>
                <td>{{ f.type }}</td>
                <td>{{ f.capacity }}</td>
                <td class="table-desc-col-fleet">{{ (f.description || '').substring(0, 60) }}...</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editItem(f)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteItem(f.id)">
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

    <!-- LOCAL MODAL FOR FLEET FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Armada</label>
            <input class="form-control" v-model="modal.data.name" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Tipe</label>
              <input class="form-control" v-model="modal.data.type" />
            </div>
            <div class="form-group">
              <label>Kapasitas</label>
              <input class="form-control" v-model="modal.data.capacity" />
            </div>
          </div>
          <div class="form-group">
            <label>Deskripsi</label>
            <textarea class="form-control" v-model="modal.data.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Urutan</label>
            <input class="form-control" type="number" v-model="modal.data.sort_order" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-image form-icon-pad"></i> Foto Armada</label>
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
              <button class="btn btn-danger btn-circle-del" @click="removeFleetPhoto" title="Hapus Foto">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveFleet">
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
  name: 'AdminFleet',
  data() {
    return {
      fleetList: [],
      fleetFile: null,
      modal: {
        show: false,
        title: '',
        data: { name: '', type: '', capacity: '', description: '', sort_order: 0 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchFleet();
  },
  methods: {
    async fetchFleet() {
      try {
        const r = await api.getFleet();
        this.fleetList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data armada:', e);
      }
    },
    openModal(data = null) {
      this.fleetFile = null;
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Armada',
          data: { ...data, _preview: '', _remove: false },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Armada',
          data: { name: '', type: '', capacity: '', description: '', sort_order: 0, _preview: '', _remove: false },
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
        await api.deleteFleet(id);
        await swal.success('Berhasil Dihapus!', 'Data telah dihapus dari sistem.');
        await this.fetchFleet();
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

      this.fleetFile = file;
      this.modal.data._remove = false;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modal.data._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeFleetPhoto() {
      this.modal.data.image_path = '';
      this.modal.data._preview = '';
      this.modal.data._remove = true;
      this.fleetFile = null;
    },
    async saveFleet() {
      const d = this.modal.data;
      if (!d.name || !d.name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama armada tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Armada...', 'Memproses data dan gambar armada.');
      const fd = new FormData();
      // Remove preview since it's client-side only
      const payload = { ...d };
      delete payload._preview;

      fd.append('data', JSON.stringify(payload));
      if (this.fleetFile) {
        fd.append('image', this.fleetFile);
      }
      if (d._remove) {
        fd.append('remove_image', '1');
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateFleet(this.modal.editId, fd);
        } else {
          await api.createFleet(fd);
        }
        this.modal.show = false;
        this.fleetFile = null;
        await swal.success('Armada Disimpan!', 'Data armada berhasil disimpan.');
        await this.fetchFleet();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
