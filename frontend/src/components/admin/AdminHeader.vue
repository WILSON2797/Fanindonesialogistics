<template>
  <header class="admin-header">
    <div class="header-left">
      <button class="header-toggle d-none d-lg-flex" @click="$emit('toggle-sidebar-collapsed')">
        <i class="fa-solid" :class="sidebarCollapsed ? 'fa-indent' : 'fa-outdent'"></i>
      </button>
      <button class="header-toggle d-lg-none" @click="$emit('open-sidebar-mobile')">
        <i class="fa-solid fa-bars"></i>
      </button>
      <h2>{{ currentMenu.label }}</h2>
    </div>
    <div class="header-right">
      <div class="admin-user">
        <div class="admin-user-info">
          <span>{{ adminName }}</span>
          <small>Administrator</small>
        </div>
        <div class="admin-user-avatar">{{ (adminName || 'A').charAt(0) }}</div>
      </div>
      <button class="btn-logout btn-key" @click="$emit('open-password-modal')" title="Ganti Password">
        <i class="fa-solid fa-key"></i>
      </button>
      <button class="btn-logout btn-exit" @click="$emit('logout')" title="Logout">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AdminHeader',
  props: {
    currentMenu: {
      type: Object,
      required: true
    },
    sidebarCollapsed: {
      type: Boolean,
      required: true
    },
    sidebarOpen: {
      type: Boolean,
      required: true
    },
    adminName: {
      type: String,
      required: true
    }
  },
  emits: ['toggle-sidebar-collapsed', 'open-sidebar-mobile', 'open-password-modal', 'logout']
};
</script>
