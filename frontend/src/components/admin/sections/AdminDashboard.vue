<template>
  <div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon blue"><i class="fa-solid fa-paper-plane"></i></div>
        <div class="stat-card-info">
          <h3>{{ stats.quotes || 0 }}</h3>
          <p>Total Quotes</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon orange"><i class="fa-solid fa-clock"></i></div>
        <div class="stat-card-info">
          <h3>{{ stats.newQ || 0 }}</h3>
          <p>Quote Baru</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon green"><i class="fa-solid fa-comments"></i></div>
        <div class="stat-card-info">
          <h3>{{ stats.messages || 0 }}</h3>
          <p>Total Pesan</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon red"><i class="fa-solid fa-envelope"></i></div>
        <div class="stat-card-info">
          <h3>{{ stats.unread || 0 }}</h3>
          <p>Pesan Belum Dibaca</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api.js';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: { quotes: 0, messages: 0, unread: 0, newQ: 0 }
    };
  },
  async mounted() {
    await this.fetchStats();
  },
  methods: {
    async fetchStats() {
      try {
        const r = await api.getStats();
        this.stats = r.data || {};
      } catch (e) {
        console.error('Gagal mengambil data statistik:', e);
      }
    }
  }
};
</script>
