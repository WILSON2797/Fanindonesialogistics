<template>
  <div>
    <div class="admin-card">
      <div class="admin-card-header">
        <h3>Pesan Masuk</h3>
      </div>
      <div class="admin-card-body">
        <div class="empty-state" v-if="!messagesList.length">
          <i class="fa-solid fa-envelope-open-text"></i> Belum ada pesan.
        </div>
        <div class="table-responsive" v-else>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Subjek</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in messagesList" :key="m.id">
                <td>{{ formatDate(m.created_at) }}</td>
                <td><strong>{{ m.name }}</strong></td>
                <td>{{ m.email }}</td>
                <td>{{ m.subject || '-' }}</td>
                <td>
                  <span
                    :class="
                      m.is_read === '1' || m.is_read === 1
                        ? 'badge badge-read'
                        : 'badge badge-unread'
                    "
                  >
                    {{ m.is_read === '1' || m.is_read === 1 ? 'Dibaca' : 'Baru' }}
                  </span>
                </td>
                <td>
                  <button class="btn-sm btn-edit" @click="readMessage(m)" title="Lihat">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- LOCAL MODAL FOR MESSAGE DETAIL -->
    <div class="modal-overlay" v-if="modal.show" @click.self="modal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="modal-close" @click="modal.show = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <p><strong>Dari:</strong> {{ modal.data.name }} ({{ modal.data.email }})</p>
          <p v-if="modal.data.phone"><strong>Telepon:</strong> {{ modal.data.phone }}</p>
          <p v-if="modal.data.subject"><strong>Subjek:</strong> {{ modal.data.subject }}</p>
          <hr class="form-divider-message" />
          <p class="form-message-body-text">{{ modal.data.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';

export default {
  name: 'AdminMessages',
  data() {
    return {
      messagesList: [],
      modal: {
        show: false,
        title: 'Detail Pesan',
        data: {}
      }
    };
  },
  async mounted() {
    await this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      try {
        const r = await api.getMessages();
        this.messagesList = r.data || [];
      } catch (e) {
        console.error('Gagal mengambil data pesan masuk:', e);
      }
    },
    async readMessage(m) {
      if (!m.is_read || m.is_read === '0' || m.is_read === 0) {
        try {
          await api.markRead(m.id);
        } catch (e) {
          console.error('Gagal menandai pesan telah dibaca:', e);
        }
      }
      this.modal = {
        show: true,
        title: 'Detail Pesan',
        data: m
      };
      await this.fetchMessages();
    },
    formatDate(d) {
      if (!d) return '-';
      const dt = new Date(d);
      return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
};
</script>
