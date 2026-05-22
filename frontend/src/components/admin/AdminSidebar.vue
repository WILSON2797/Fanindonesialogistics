<template>
  <!-- Sidebar -->
  <aside class="admin-sidebar" :class="{ open: sidebarOpen, collapsed: sidebarCollapsed }">
    <div class="sidebar-brand">
      <i class="fa-solid fa-truck-moving"></i>
      <span>Fis Logistics</span>
    </div>
    <nav class="sidebar-nav">
      <a
        v-for="m in menus"
        :key="m.key"
        :class="{ active: page === m.key }"
        @click="$emit('change-page', m.key)"
      >
        <i :class="'fa-solid fa-' + m.icon"></i>
        <span>{{ m.label }}</span>
      </a>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: {
    page: {
      type: String,
      required: true
    },
    sidebarOpen: {
      type: Boolean,
      required: true
    },
    sidebarCollapsed: {
      type: Boolean,
      required: true
    },
    menus: {
      type: Array,
      required: true
    }
  },
  emits: ['change-page']
};
</script>
