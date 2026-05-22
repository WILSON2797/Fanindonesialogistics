<template>
  <div id="root-admin">
    <!-- Ready state checked -->
    <div v-if="ready">
      
      <!-- LOGIN PAGE (If not logged in) -->
      <div v-if="!isLoggedIn" class="login-page">
        <div class="login-card">
          <div class="login-brand">
            <i class="fa-solid fa-truck-moving"></i>
          </div>
          <h2>Admin CMS</h2>
          <p>PT. Fis Logistics</p>
          
          <div class="alert alert-error login-alert-error" v-if="loginError">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ loginError }}
          </div>

          <form @submit.prevent="login">
            <div class="form-group">
              <label>Username</label>
              <input class="form-control" v-model="username" required placeholder="admin" autofocus>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input class="form-control" type="password" v-model="password" required placeholder="••••••••">
            </div>
            <button class="btn btn-primary btn-login-submit" type="submit" :disabled="loginLoading">
              <i class="fa-solid" :class="loginLoading ? 'fa-spinner fa-spin' : 'fa-right-to-bracket'"></i>
              <span>{{ loginLoading ? 'Loading...' : 'Login' }}</span>
            </button>
          </form>
          <p class="login-back-to-web">
            <a href="../" class="btn-back-link"><i class="fa-solid fa-arrow-left"></i> Kembali ke Website</a>
          </p>
        </div>
      </div>

      <!-- MAIN CMS DASHBOARD (If logged in) -->
      <div v-else class="admin-layout" :class="{'sidebar-collapsed': sidebarCollapsed}">
        <!-- Mobile Backdrop -->
        <div class="sidebar-backdrop" :class="{show: sidebarOpen}" @click="sidebarOpen=false"></div>

        <!-- Sidebar Navigation Component -->
        <AdminSidebar
          :page="page"
          :sidebar-open="sidebarOpen"
          :sidebar-collapsed="sidebarCollapsed"
          :menus="menus"
          @change-page="page = $event; sidebarOpen = false"
        />

        <!-- Main Workspace -->
        <div class="admin-main">
          <!-- Header Area Component -->
          <AdminHeader
            :current-menu="currentMenu"
            :sidebar-collapsed="sidebarCollapsed"
            :sidebar-open="sidebarOpen"
            :admin-name="adminName"
            @toggle-sidebar-collapsed="sidebarCollapsed = !sidebarCollapsed"
            @open-sidebar-mobile="sidebarOpen = true"
            @open-password-modal="openPasswordModal"
            @logout="logout"
          />

          <div class="admin-body">
            <!-- Dynamic Modular CMS Sections -->
            <AdminDashboard v-if="page === 'dashboard'" />
            <AdminHero v-if="page === 'hero'" />
            <AdminAbout v-if="page === 'about'" />
            <AdminServices v-if="page === 'services'" />
            <AdminFleet v-if="page === 'fleet'" />
            <AdminWarehouse v-if="page === 'warehouse'" />
            <AdminClients v-if="page === 'clients'" />
            <AdminCustomers v-if="page === 'customers'" />
            <AdminGallery v-if="page === 'gallery'" />
            <AdminCoverage v-if="page === 'coverage'" />
            <AdminCertificates v-if="page === 'certificates'" />
            <AdminQuotes v-if="page === 'quotes'" />
            <AdminMessages v-if="page === 'messages'" />
            <AdminContact v-if="page === 'contact'" />
            <AdminFooter v-if="page === 'footer'" />
          </div>
        </div>
      </div>

      <!-- MODAL GANTI PASSWORD -->
      <div v-if="passwordModal" class="modal-overlay display-flex-modal">
        <div class="modal modal-max-width-400">
          <div class="modal-header">
            <h3><i class="fa-solid fa-key"></i> Ganti Password</h3>
            <button class="modal-close" @click="passwordModal=false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Password Saat Ini</label>
              <input type="password" class="form-control" v-model="passwordForm.current_password">
            </div>
            <div class="form-group">
              <label>Password Baru</label>
              <input type="password" class="form-control" v-model="passwordForm.new_password">
            </div>
            <div class="form-group">
              <label>Konfirmasi Password Baru</label>
              <input type="password" class="form-control" v-model="passwordForm.confirm_password">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="passwordModal=false">Batal</button>
            <button class="btn btn-primary btn-sm" @click="changePassword">
              <i class="fa-solid fa-check"></i> Update Password
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { api } from './api.js';
import AdminSidebar from './components/admin/AdminSidebar.vue';
import AdminHeader from './components/admin/AdminHeader.vue';
import AdminDashboard from './components/admin/sections/AdminDashboard.vue';
import AdminHero from './components/admin/sections/AdminHero.vue';
import AdminAbout from './components/admin/sections/AdminAbout.vue';
import AdminServices from './components/admin/sections/AdminServices.vue';
import AdminFleet from './components/admin/sections/AdminFleet.vue';
import AdminWarehouse from './components/admin/sections/AdminWarehouse.vue';
import AdminClients from './components/admin/sections/AdminClients.vue';
import AdminCustomers from './components/admin/sections/AdminCustomers.vue';
import AdminGallery from './components/admin/sections/AdminGallery.vue';
import AdminCoverage from './components/admin/sections/AdminCoverage.vue';
import AdminCertificates from './components/admin/sections/AdminCertificates.vue';
import AdminQuotes from './components/admin/sections/AdminQuotes.vue';
import AdminMessages from './components/admin/sections/AdminMessages.vue';
import AdminContact from './components/admin/sections/AdminContact.vue';
import AdminFooter from './components/admin/sections/AdminFooter.vue';

export default {
  name: 'AppAdmin',
  components: {
    AdminSidebar,
    AdminHeader,
    AdminDashboard,
    AdminHero,
    AdminAbout,
    AdminServices,
    AdminFleet,
    AdminWarehouse,
    AdminClients,
    AdminCustomers,
    AdminGallery,
    AdminCoverage,
    AdminCertificates,
    AdminQuotes,
    AdminMessages,
    AdminContact,
    AdminFooter
  },
  data() {
    return {
      ready: false,
      isLoggedIn: false,
      username: '',
      password: '',
      loginLoading: false,
      loginError: '',
      
      adminName: '',
      sidebarOpen: false,
      sidebarCollapsed: false,
      page: 'dashboard',
      passwordModal: false,
      passwordForm: { current_password: '', new_password: '', confirm_password: '' },
      menus: [
        { key: 'dashboard', icon: 'gauge', label: 'Dashboard' },
        { key: 'hero', icon: 'image', label: 'Hero Banner' },
        { key: 'about', icon: 'building', label: 'About Us' },
        { key: 'services', icon: 'cubes', label: 'Services' },
        { key: 'fleet', icon: 'truck', label: 'Fleet' },
        { key: 'warehouse', icon: 'warehouse', label: 'Warehouse' },
        { key: 'clients', icon: 'users', label: 'Clients' },
        { key: 'customers', icon: 'handshake', label: 'Customers' },
        { key: 'gallery', icon: 'images', label: 'Gallery' },
        { key: 'coverage', icon: 'map-location-dot', label: 'Coverage' },
        { key: 'certificates', icon: 'award', label: 'Sertifikat' },
        { key: 'quotes', icon: 'paper-plane', label: 'Quote Requests' },
        { key: 'messages', icon: 'comments', label: 'Messages' },
        { key: 'contact', icon: 'address-book', label: 'Contact Info' },
        { key: 'footer', icon: 'table-columns', label: 'Footer' },
      ]
    };
  },

  computed: {
    currentMenu() {
      return this.menus.find(m => m.key === this.page) || this.menus[0];
    }
  },

  async mounted() {
    try {
      const auth = await api.checkAuth();
      if (auth.logged_in) {
        this.adminName = auth.name || 'Admin';
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    } catch (e) {
      this.isLoggedIn = false;
    }
    this.ready = true;
  },

  methods: {
    // ── Login method ───────────────────────────
    async login() {
      this.loginLoading = true;
      this.loginError = '';
      try {
        await api.login(this.username, this.password);
        const auth = await api.checkAuth();
        this.adminName = auth.name || 'Admin';
        this.isLoggedIn = true;
      } catch (e) {
        this.loginError = e.message || 'Login gagal. Periksa username dan password Anda.';
      }
      this.loginLoading = false;
    },

    // ── Change Password and Logout ──────────────
    openPasswordModal() {
      this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
      this.passwordModal = true;
    },
    async changePassword() {
      if (!this.passwordForm.current_password || !this.passwordForm.new_password) {
        return window.Swal.fire('Error', 'Semua kolom wajib diisi', 'error');
      }
      if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
        return window.Swal.fire('Error', 'Konfirmasi password tidak cocok', 'error');
      }

      try {
        const res = await api.changePassword(this.passwordForm);
        if (res.success) {
          this.passwordModal = false;
          window.Swal.fire('Berhasil', 'Password Anda telah diperbarui', 'success');
        }
      } catch (err) {
        window.Swal.fire('Gagal', err.message || 'Gagal ganti password', 'error');
      }
    },
    async logout() {
      await api.logout();
      this.isLoggedIn = false;
    }
  }
};
</script>

<style>
/* ========================================================
   Modern Refined CSS for CMS Admin Dashboard (Shared)
   ======================================================== */

/* Login Page and Card */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.login-brand {
  width: 72px;
  height: 72px;
  background: var(--primary, #2563eb);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  margin: 0 auto 24px;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
}

.login-card h2 {
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
  font-size: 1.6rem;
}

.login-card p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.login-alert-error {
  margin-bottom: 20px;
  padding: 14px 18px;
  border-radius: 14px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #fee2e2;
  text-align: left;
}

.btn-login-submit {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--primary, #2563eb);
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transition: all 0.2s ease;
}

.btn-login-submit:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.login-back-to-web {
  text-align: center;
  margin-top: 24px;
  font-size: 0.85rem;
}

.btn-back-link {
  color: var(--primary, #2563eb);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}

.btn-back-link:hover {
  opacity: 0.8;
}

/* Sidebar structure and styling */
.admin-sidebar {
  font-family: 'Inter', sans-serif;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Statistics Grid cards color variants */
.stat-card-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}
.stat-card-icon.orange {
  background: #fff7ed;
  color: #ea580c;
}
.stat-card-icon.green {
  background: #f0fdf4;
  color: #16a34a;
}
.stat-card-icon.red {
  background: #fef2f2;
  color: #dc2626;
}

/* CMS Page Forms extracted helper styling */
.section-title {
  margin: 20px 0 12px;
  font-weight: 700;
  font-size: 1.1rem;
}

.section-title-bold {
  margin: 0 0 8px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.section-title-bold-primary {
  margin: 0 0 14px;
  font-weight: 700;
  color: var(--primary, #2563eb);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-tip {
  font-size: 0.83rem;
  color: var(--text-light, #64748b);
  margin-bottom: 12px;
}

.form-row-stat {
  margin-bottom: 12px;
}

.upload-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border, #e2e8f0);
}

.upload-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.primary-icon {
  color: var(--primary, #2563eb);
}

.primary-icon-margin {
  color: var(--primary, #2563eb);
  margin-right: 4px;
}

.accent-icon-margin {
  color: var(--accent, #e11d48);
  margin-right: 4px;
}

.red-icon-margin {
  color: #ef4444;
  margin-right: 4px;
}

.green-icon-margin {
  color: #22c55e;
  margin-right: 4px;
}

.blue-icon-margin {
  color: #3b82f6;
  margin-right: 4px;
}

.orange-icon-margin {
  color: #f59e0b;
  margin-right: 4px;
}

.accent-icon-footer {
  color: var(--accent, #ea580c);
}

.req-star {
  color: #ef4444;
}

.upload-tip {
  font-size: 0.8rem;
  color: var(--text-light, #64748b);
  margin-bottom: 12px;
}

.upload-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.upload-input-wrap {
  flex: 1;
}

.file-input-pad {
  padding: 10px;
}

.image-preview-box {
  position: relative;
  width: 180px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img-fit {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-del-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 4px 8px;
  font-size: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.image-preview-box-about {
  position: relative;
  width: 150px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-del-btn-about {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 4px 8px;
  font-size: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.submit-btn-margin {
  margin-top: 24px;
}

.admin-divider {
  margin: 20px 0;
  border-color: var(--border, #e2e8f0);
}

.admin-divider-large {
  margin: 24px 0;
  border-color: var(--border, #e2e8f0);
}

/* Service Detail and Fleets CMS Cards & tables styles */
.table-service-icon {
  font-size: 1.2rem;
  color: var(--primary, #2563eb);
}

.table-desc-col {
  max-width: 300px;
}

.table-desc-col-fleet {
  max-width: 250px;
}

.table-desc-col-coverage {
  max-width: 400px;
}

/* Extracted Alert Info Cards styling for customers/gallery/contact */
.alert-card-customers {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 1.5px solid #bbf7d0;
}

.alert-card-gallery {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fdf4ff, #fae8ff);
  border: 1.5px solid #e9d5ff;
}

.alert-card-certificates {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fefce8, #fef9c3);
  border: 1.5px solid #fde68a;
}

.alert-card-contact {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1.5px solid #bfdbfe;
}

.alert-card-body {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.alert-info-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-info-icon-box.bg-green {
  background: #16a34a;
}
.alert-info-icon-box.bg-purple {
  background: #9333ea;
}
.alert-info-icon-box.bg-orange {
  background: #d97706;
}
.alert-info-icon-box.bg-blue {
  background: #2563eb;
}

.white-text {
  color: #fff;
  font-size: 1.2rem;
}

.green-text {
  color: #166534;
}

.purple-text {
  color: #6b21a8;
}

.orange-text {
  color: #92400e;
}

.blue-text {
  color: #1e40af;
}

.alert-card-title {
  margin: 0;
  font-weight: 600;
}

.alert-card-tip {
  margin: 0;
  font-size: 0.83rem;
}

/* Customer list logo formatting */
.col-width-80 {
  width: 80px;
}

.col-width-100 {
  width: 100px;
}

.logo-preview-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
}

.img-preview-inside-table {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.text-placeholder-avatar {
  font-weight: 700;
  font-size: 0.8rem;
  color: #94a3b8;
}

.text-placeholder-dash {
  color: var(--text-light, #64748b);
}

.text-placeholder-small {
  color: var(--text-light, #64748b);
}

.primary-link-sm {
  color: var(--primary, #2563eb);
  font-size: 0.85rem;
  text-decoration: none;
}

/* Gallery inside table */
.gallery-preview-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
}

.img-preview-inside-table-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-preview-inside-table-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.icon-placeholder-inside-table {
  color: #94a3b8;
  font-size: 1.2rem;
}

.category-badge-admin {
  padding: 3px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #eff6ff;
  color: #2563eb;
  text-transform: capitalize;
}

.select-status-table {
  padding: 6px 10px;
  font-size: 0.8rem;
  width: auto;
}

/* Maps section components and layout */
.maps-preview-card {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
}

.maps-preview-iframe {
  border: 0;
  display: block;
}

.maps-empty-state {
  margin-top: 12px;
  background: var(--bg, #f8fafc);
  border: 2px dashed var(--border, #e2e8f0);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  color: var(--text-light, #64748b);
}

.maps-empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 8px;
}

.btn-group-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}

.btn-reset {
  background: var(--border, #e2e8f0);
  color: var(--text, #0f172a);
}

/* Footer services lists elements */
.footer-service-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.service-input-row {
  flex: 1;
}

.delete-service-row-btn {
  padding: 6px 10px;
}

.add-service-row-btn {
  margin-top: 8px;
}

/* Header utility buttons */
.btn-logout {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.btn-key {
  margin-right: 8px;
  background: var(--primary, #2563eb);
  color: white;
}

.btn-exit {
  background: #f1f5f9;
  color: #64748b;
}

.btn-key:hover {
  background: #1d4ed8;
}

.btn-exit:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Form details and inner files components */
.file-input-inner {
  padding: 8px;
}

.form-icon-pad {
  margin-right: 4px;
}

.form-image-preview-wrapper {
  margin-top: 10px;
  position: relative;
  display: inline-block;
}

.form-image-preview-card {
  width: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
}

.form-preview-img {
  width: 100%;
  display: block;
}

.form-image-preview-wrapper-fleet {
  margin-top: 10px;
  position: relative;
  display: inline-block;
}

.form-image-preview-card-fleet {
  width: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
}

.btn-circle-del {
  position: absolute;
  top: -10px;
  right: -10px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-customer-logo-preview-box {
  margin-top: 10px;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-preview-img-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.form-image-preview-wrapper-gallery {
  margin-top: 10px;
  max-width: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
}

.form-preview-img-cover {
  width: 100%;
  display: block;
  object-fit: cover;
}

.form-image-preview-wrapper-certificate {
  margin-top: 10px;
  max-width: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--border, #e2e8f0);
}

.form-divider-message {
  margin: 16px 0;
  border-color: var(--border, #e2e8f0);
}

.form-message-body-text {
  white-space: pre-wrap;
}

.display-flex-modal {
  display: flex;
}

.modal-max-width-400 {
  max-width: 400px;
}
</style>
