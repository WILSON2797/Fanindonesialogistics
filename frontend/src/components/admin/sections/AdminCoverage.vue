<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Kelola Area Jangkauan</h3>
        <button class="btn btn-primary btn-sm" @click="openModal()">
          <i class="fa-solid fa-plus"></i> Tambah
        </button>
      </div>
      <div class="admin-card-body">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Kota</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in coverageList" :key="a.id">
                <td><strong>{{ a.region }}</strong></td>
                <td class="table-desc-col-coverage">{{ a.cities }}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-sm btn-edit" @click="editItem(a)">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-sm btn-delete" @click="deleteItem(a.id)">
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

    <!-- LOCAL MODAL FOR COVERAGE FORM -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Region</label>
            <input class="form-control" v-model="modal.data.region" />
          </div>
          <div class="form-group">
            <label>Kota (pisahkan dengan koma)</label>
            <textarea class="form-control" v-model="modal.data.cities" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Urutan</label>
            <input class="form-control" type="number" v-model="modal.data.sort_order" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="modal.show = false">Batal</button>
          <button class="btn btn-primary btn-sm" @click="saveCoverage">
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
  name: 'AdminCoverage',
  data() {
    return {
      coverageList: [],
      modal: {
        show: false,
        title: '',
        data: { region: '', cities: '', sort_order: 0 },
        editId: null
      }
    };
  },
  async mounted() {
    await this.fetchCoverage();
  },
  methods: {
    async fetchCoverage() {
      try {
        const r = await api.getCoverage();
        this.coverageList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data jangkauan:', e);
      }
    },
    openModal(data = null) {
      if (data) {
        this.modal = {
          show: true,
          title: 'Edit Area Jangkauan',
          data: { ...data },
          editId: data.id
        };
      } else {
        this.modal = {
          show: true,
          title: 'Tambah Area Jangkauan',
          data: { region: '', cities: '', sort_order: 0 },
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
        await api.deleteCoverage(id);
        await swal.success('Berhasil Dihapus!', 'Data telah dihapus dari sistem.');
        await this.fetchCoverage();
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan pada server.');
      }
    },
    async saveCoverage() {
      const d = this.modal.data;
      if (!d.region || !d.region.trim()) {
        await swal.error('Validasi Gagal!', 'Nama region tidak boleh kosong.');
        return;
      }
      if (!d.cities || !d.cities.trim()) {
        await swal.error('Validasi Gagal!', 'Daftar kota tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan...', 'Sedang menyimpan data area jangkauan.');
      try {
        if (this.modal.editId) {
          await api.updateCoverage(this.modal.editId, d);
        } else {
          await api.createCoverage(d);
        }
        this.modal.show = false;
        await swal.success('Data Berhasil Disimpan!', 'Area jangkauan telah diperbarui.');
        await this.fetchCoverage();
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    }
  }
};
</script>
