<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Kelola Klien</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah
        </button>
      </div>
      <div class="admin-card-body">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Perusahaan</th>
                <th>Nama</th>
                <th>Posisi</th>
                <th>Rating</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in clientsList" :key="c.id">
                <td><strong>{{ c.company_name }}</strong></td>
                <td>{{ c.client_name }}</td>
                <td>{{ c.client_position }}</td>
                <td>{{ c.rating }}/5</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editItem(c)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteItem(c.id)">
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

    <!-- LOCAL MODAL FOR CLIENT FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nama Perusahaan</label>
            <input class="form-control" v-model="modal.data.company_name" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nama Klien</label>
              <input class="form-control" v-model="modal.data.client_name" />
            </div>
            <div class="form-group">
              <label>Posisi</label>
              <input class="form-control" v-model="modal.data.client_position" />
            </div>
          </div>
          <div class="form-group">
            <label>Testimoni</label>
            <textarea class="form-control" v-model="modal.data.testimonial" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Rating (1-5)</label>
            <input class="form-control" type="number" v-model="modal.data.rating" min="1" max="5" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveClient">
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
  name: 'AdminClients',
  data() {
    return {
      clientsList: [],
      modal: {
        show: false,
        title: '',
        data: { company_name: '', client_name: '', client_position: '', testimonial: '', rating: 5 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchClients();
  },
  methods: {
    async fetchClients() {
      try {
        const r = await api.getClients();
        this.clientsList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data klien:', e);
      }
    },
    openModal(data = null) {
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Klien',
          data: { ...data },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Klien',
          data: { company_name: '', client_name: '', client_position: '', testimonial: '', rating: 5 },
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
        await api.deleteClient(id);
        await swal.success('Berhasil Dihapus!', 'Data telah dihapus dari sistem.');
        await this.fetchClients();
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan pada server.');
      }
    },
    async saveClient() {
      const d = this.modal.data;
      if (!d.company_name || !d.company_name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama perusahaan tidak boleh kosong.');
        return;
      }
      if (!d.client_name || !d.client_name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama klien tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan...', 'Sedang menyimpan data klien.');
      try {
        if (this.modal.editId) {
          await api.updateClient(this.modal.editId, d);
        } else {
          await api.createClient(d);
        }
        this.modal.show = false;
        await swal.success('Data Berhasil Disimpan!', 'Data klien telah diperbarui.');
        await this.fetchClients();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
