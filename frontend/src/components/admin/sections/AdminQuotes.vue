<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Permintaan Penawaran</h3>
      </div>
      <div class="admin-card-body">
        <div class="empty-state" v-if="!quotesList.length">
          <i class="fa-solid fa-inbox"></i> Belum ada permintaan.
        </div>
        <div class="table-responsive" v-else>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Rute</th>
                <th>Barang</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in quotesList" :key="q.id">
                <td>{{ formatDate(q.created_at) }}</td>
                <td>
                  <strong>{{ q.name }}</strong>
                  <br /><small class="text-placeholder-small">{{ q.company }}</small>
                </td>
                <td>{{ q.origin }} &rarr; {{ q.destination }}</td>
                <td>{{ q.cargo_type }}</td>
                <td><span :class="'badge badge-' + q.status">{{ q.status }}</span></td>
                <td>
                  <select
                    class="form-control select-status-table"
                    :value="q.status"
                    @change="updateQStatus(q.id, $event.target.value)"
                  >
                    <option value="new">New</option>
                    <option value="processing">Processing</option>
                    <option value="done">Done</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';
import { swal } from '../swal.js';

export default {
  name: 'AdminQuotes',
  data() {
    return {
      quotesList: []
    };
  },
  async mounted() {
    await this.fetchQuotes();
  },
  methods: {
    async fetchQuotes() {
      try {
        const r = await api.getQuotes();
        this.quotesList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data quote penawaran:', e);
      }
    },
    async updateQStatus(id, status) {
      try {
        await api.updateQuoteStatus(id, status);
        await this.fetchQuotes();
      } catch (e) {
        await swal.error('Gagal Update Status!', e.message || 'Terjadi kesalahan.');
      }
    },
    formatDate(d) {
      if (!d) return '-';
      const dt = new Date(d);
      return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
};
</script>
