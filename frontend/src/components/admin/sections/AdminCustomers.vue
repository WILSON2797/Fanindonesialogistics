<template>
  <div>
    <div class="admin-card alert-card-customers">
      <div class="admin-card-body alert-card-body">
        <div class="alert-info-icon-box bg-green">
          <i class="fa-solid fa-circle-info white-text"></i>
        </div>
        <div>
          <p class="alert-card-title green-text">Kelola Customer</p>
          <p class="alert-card-tip green-text">
            Upload logo customer beserta nama perusahaan. Halaman <strong>#/customers</strong> akan menampilkan semua data ini.
          </p>
        </div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Daftar Customer</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah Customer
        </button>
      </div>
      <div class="admin-card-body">
        <div class="empty-state" v-if="!customersList.length">
          <i class="fa-solid fa-folder-open"></i> Belum ada customer.
        </div>
        <div class="table-responsive" v-else>
          <table class="admin-table">
            <thead>
              <tr>
                <th class="col-width-80">Logo</th>
                <th>Nama</th>
                <th>Website</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in customersList" :key="c.id">
                <td>
                  <div class="logo-preview-thumbnail">
                    <img
                      v-if="c.logo_path"
                      :src="$baseDir + '/' + c.logo_path"
                      :alt="c.name"
                      class="img-preview-inside-table"
                    />
                    <span v-else class="text-placeholder-avatar">{{ (c.name || '?').charAt(0) }}</span>
                  </div>
                </td>
                <td><strong>{{ c.name }}</strong></td>
                <td>
                  <a v-if="c.website_url" :href="c.website_url" target="_blank" class="primary-link-sm">
                    {{ c.website_url }}
                  </a>
                  <span v-else class="text-placeholder-dash">-</span>
                </td>
                <td>{{ c.sort_order }}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editCustomer(c)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteCustomerItem(c.id)">
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

    <!-- LOCAL MODAL FOR CUSTOMER FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Perusahaan</label>
            <input class="form-control" v-model="modal.data.name" placeholder="PT. Nama Perusahaan" />
          </div>
          <div class="form-group">
            <label>Website URL (opsional)</label>
            <input class="form-control" v-model="modal.data.website_url" placeholder="https://example.com" />
          </div>
          <div class="form-group">
            <label>Urutan</label>
            <input class="form-control" type="number" v-model="modal.data.sort_order" />
          </div>
          <div class="form-group">
            <label><i class="fa-solid fa-image form-icon-pad"></i> Logo</label>
            <input
              type="file"
              class="form-control file-input-inner"
              accept="image/*"
              @change="handleFileSelect($event)"
            />
            <div v-if="modal.data.logo_path || modal.data._preview" class="form-customer-logo-preview-box">
              <img
                :src="modal.data._preview || ($baseDir + '/' + modal.data.logo_path)"
                class="form-preview-img-contain"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveCustomer">
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
  name: 'AdminCustomers',
  data() {
    return {
      customersList: [],
      customerFile: null,
      modal: {
        show: false,
        title: '',
        data: { name: '', website_url: '', sort_order: 0 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const r = await api.getCustomers();
        this.customersList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data customer:', e);
      }
    },
    openModal(data = null) {
      this.customerFile = null;
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Customer',
          data: { ...data, _preview: '' },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Customer',
          data: { name: '', website_url: '', sort_order: 0, _preview: '' },
          editId: null
        };
      }
    },
    editCustomer(c) {
      this.openModal(c);
    },
    async deleteCustomerItem(id) {
      const result = await swal.confirm('Hapus Customer?', 'Data customer akan dihapus permanen.');
      if (!result.isConfirmed) return;
      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteCustomer(id);
        await swal.success('Customer Dihapus!', 'Data berhasil dihapus.');
        await this.fetchCustomers();
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

      this.customerFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modal.data._preview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveCustomer() {
      const d = this.modal.data;
      if (!d.name || !d.name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama customer tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Customer...', 'Sedang memproses logo.');
      const fd = new FormData();
      fd.append('name', d.name);
      fd.append('website_url', d.website_url || '');
      fd.append('sort_order', d.sort_order || 0);
      if (this.customerFile) {
        fd.append('logo', this.customerFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateCustomer(this.modal.editId, fd);
        } else {
          await api.createCustomer(fd);
        }
        this.modal.show = false;
        this.customerFile = null;
        await swal.success('Customer Disimpan!', 'Data customer berhasil disimpan.');
        await this.fetchCustomers();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
