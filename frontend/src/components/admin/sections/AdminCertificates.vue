<template>
  <div>
    <div class="admin-card alert-card-certificates">
      <div class="admin-card-body alert-card-body">
        <div class="alert-info-icon-box bg-orange">
          <i class="fa-solid fa-circle-info white-text"></i>
        </div>
        <div>
          <p class="alert-card-title orange-text">Kelola Sertifikat</p>
          <p class="alert-card-tip orange-text">
            Upload gambar sertifikat beserta nama. Halaman <strong>#/certificates</strong> akan menampilkan semua data ini.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Daftar Sertifikat</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah Sertifikat
        </button>
      </div>
      <div class="admin-card-body">
        <div class="empty-state" v-if="!certificatesList.length">
          <i class="fa-solid fa-file-signature"></i> Belum ada sertifikat.
        </div>
        <div class="table-responsive" v-else>
          <table class="admin-table">
            <thead>
              <tr>
                <th class="col-width-100">Gambar</th>
                <th>Nama</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in certificatesList" :key="c.id">
                <td>
                  <div class="gallery-preview-thumbnail">
                    <img
                      v-if="c.image_path"
                      :src="$baseDir + '/' + c.image_path"
                      :alt="c.name"
                      class="img-preview-inside-table-contain"
                    />
                    <i v-else class="fa-solid fa-file-lines icon-placeholder-inside-table"></i>
                  </div>
                </td>
                <td><strong>{{ c.name }}</strong></td>
                <td>{{ c.sort_order }}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editCertificate(c)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteCertificateItem(c.id)">
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

    <!-- LOCAL MODAL FOR CERTIFICATE FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Sertifikat</label>
            <input class="form-control" v-model="modal.data.name" placeholder="ISO 9001:2015" />
          </div>
          <div class="form-group">
            <label>Urutan</label>
            <input class="form-control" type="number" v-model="modal.data.sort_order" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-image form-icon-pad"></i> Gambar Sertifikat</label>
            <input
              type="file"
              class="form-control file-input-inner"
              accept="image/*"
              @change="handleFileSelect($event)"
            />
            <div v-if="modal.data.image_path || modal.data._preview" class="form-image-preview-wrapper-certificate">
              <img
                :src="modal.data._preview || ($baseDir + '/' + modal.data.image_path)"
                class="form-preview-img-contain"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveCertificate">
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
  name: 'AdminCertificates',
  data() {
    return {
      certificatesList: [],
      certificateFile: null,
      modal: {
        show: false,
        title: '',
        data: { name: '', sort_order: 0 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchCertificates();
  },
  methods: {
    async fetchCertificates() {
      try {
        const r = await api.getCertificates();
        this.certificatesList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data sertifikat:', e);
      }
    },
    openModal(data = null) {
      this.certificateFile = null;
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Sertifikat',
          data: { ...data, _preview: '' },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Sertifikat',
          data: { name: '', sort_order: 0, _preview: '' },
          editId: null
        };
      }
    },
    editCertificate(c) {
      this.openModal(c);
    },
    async deleteCertificateItem(id) {
      const result = await swal.confirm('Hapus Sertifikat?', 'Data sertifikat akan dihapus permanen.');
      if (!result.isConfirmed) return;
      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteCertificate(id);
        await swal.success('Sertifikat Dihapus!', 'Data berhasil dihapus.');
        await this.fetchCertificates();
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

      this.certificateFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modal.data._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveCertificate() {
      const d = this.modal.data;
      if (!d.name || !d.name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama sertifikat tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Sertifikat...', 'Sedang memproses gambar sertifikat.');
      const fd = new FormData();
      fd.append('name', d.name);
      fd.append('sort_order', d.sort_order || 0);
      if (this.certificateFile) {
        fd.append('image', this.certificateFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateCertificate(this.modal.editId, fd);
        } else {
          await api.createCertificate(fd);
        }
        this.modal.show = false;
        this.certificateFile = null;
        await swal.success('Sertifikat Disimpan!', 'Data sertifikat berhasil disimpan.');
        await this.fetchCertificates();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
