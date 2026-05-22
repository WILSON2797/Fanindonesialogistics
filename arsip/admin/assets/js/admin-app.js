// ============================================
// Admin Dashboard — Vue App
// ============================================

// ── SweetAlert2 helpers ──────────────────────
const swal = {
  success(title = 'Berhasil!', text = '') {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: false,
      customClass: { popup: 'swal-popup' }
    });
  },
  error(title = 'Gagal!', text = '') {
    return Swal.fire({
      icon: 'error',
      title,
      text: text || 'Terjadi kesalahan. Silakan coba lagi.',
      confirmButtonText: 'Tutup',
      confirmButtonColor: 'var(--primary, #2563eb)',
      customClass: { popup: 'swal-popup' }
    });
  },
  confirm(title = 'Yakin?', text = 'Data akan dihapus secara permanen.') {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: 'var(--primary, #2563eb)',
      reverseButtons: true,
      customClass: { popup: 'swal-popup' }
    });
  },
  loading(title = 'Memproses...', text = 'Sedang mengunggah data, mohon tunggu.') {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: { popup: 'swal-popup' }
    });
  }
};

// ── Vue App ──────────────────────────────────
// Init
const app = Vue.createApp({
  data() {
    return {
      ready: false,
      adminName: '',
      sidebarOpen: false,
      sidebarCollapsed: false,
      page: 'dashboard',
      activeTab: 'stats',
      passwordModal: false,
      passwordForm: { current_password: '', new_password: '', confirm_password: '' },
      msg: '',
      stats: { quotes: 0, messages: 0, unread: 0, newQ: 0 },
      hero: { title: '', subtitle: '', stats: [] },
      aboutData: { title: '', description: '', description2: '', vision: '', mission: [], values: [], founded_year: '2009', founded_label: 'BERDIRI SEJAK', values_text: '', legality: '' },
      servicesList: [],
      fleetList: [],
      clientsList: [],
      coverageList: [],
      quotesList: [],
      messagesList: [],

      // ── Hero data ───────────────────────────
      _heroFile: null,

      // ── About data ───────────────────────────
      _aboutFile: null,

      // ── Customer data ─────────────────────────
      customersList: [],
      _customerFile: null,

      // ── Gallery data ──────────────────────────
      galleryList: [],
      _galleryFile: null,

      // ── Certificate data ───────────────────────
      certificatesList: [],
      _certificateFile: null,

      // ── Service data ──────────────────────────
      _serviceFile: null,

      // ── Contact data ─────────────────────────
      contactData: {
        page_title: '',
        page_subtitle: '',
        address: '',
        phone: '',
        mobile: '',
        email: '',
        hours: '',
        map_embed: ''
      },

      // ── Footer data ──────────────────────────
      footerData: {
        brand_name: '',
        brand_desc: '',
        contact_address: '',
        contact_phone: '',
        contact_email: '',
        contact_hours: '',
        services_list: [],
        copyright_text: ''
      },

      modal: { show: false, type: '', title: '', data: {}, editId: null },
      menus: [
        { key: 'dashboard', icon: 'speedometer2', label: 'Dashboard' },
        { key: 'hero', icon: 'image-fill', label: 'Hero Banner' },
        { key: 'about', icon: 'building', label: 'About Us' },
        { key: 'services', icon: 'grid-fill', label: 'Services' },
        { key: 'fleet', icon: 'truck-front-fill', label: 'Fleet' },
        { key: 'clients', icon: 'people-fill', label: 'Clients' },
        { key: 'customers', icon: 'award-fill', label: 'Customers' },
        { key: 'gallery', icon: 'images', label: 'Gallery' },
        { key: 'coverage', icon: 'geo-alt-fill', label: 'Coverage' },
        { key: 'certificates', icon: 'file-earmark-check-fill', label: 'Sertifikat' },
        { key: 'quotes', icon: 'send-fill', label: 'Quote Requests' },
        { key: 'messages', icon: 'chat-dots-fill', label: 'Messages' },
        { key: 'contact', icon: 'telephone-fill', label: 'Contact Info' },
        { key: 'footer', icon: 'layout-text-window-reverse', label: 'Footer' },
      ]
    };
  },

  computed: {
    currentMenu() {
      return this.menus.find(m => m.key === this.page) || this.menus[0];
    }
  },

  watch: {
    page(v) { this.msg = ''; this.loadPageData(v); }
  },

  async mounted() {
    try {
      const auth = await api.checkAuth();
      if (!auth.logged_in) { window.location.href = 'login.html'; return; }
      this.adminName = auth.name || 'Admin';
      this.ready = true;
      this.loadPageData('dashboard');
    } catch (e) {
      window.location.href = 'login.html';
    }
  },

  methods: {
    // ── Load page data ─────────────────────────
    async loadPageData(p) {
      try {
        if (p === 'dashboard') {
          const r = await api.getStats();
          this.stats = r.data || {};
        }
        if (p === 'hero') {
          const r = await api.getContent('hero');
          if (r.data) {
            this.hero = { ...r.data, _preview: '' };
          }
        }
        if (p === 'about') {
          const r = await api.getContent('about');
          if (r.data) {
            this.aboutData = {
              ...this.aboutData,
              ...r.data,
              _preview: '',
              values_text: Array.isArray(r.data.values) ? r.data.values.join(', ') : (r.data.values_text || ''),
              founded_year: r.data.founded_year || '2009',
              founded_label: r.data.founded_label || 'BERDIRI SEJAK',
              legality: r.data.legality || ''
            };
          }
        }
        if (p === 'services') {
          const r = await api.getServices();
          this.servicesList = r.data || [];
        }
        if (p === 'fleet') {
          const r = await api.getFleet();
          this.fleetList = r.data || [];
        }
        if (p === 'clients') {
          const r = await api.getClients();
          this.clientsList = r.data || [];
        }
        if (p === 'customers') {
          const r = await api.getCustomers();
          this.customersList = r.data || [];
        }
        if (p === 'gallery') {
          const r = await api.getGallery();
          this.galleryList = r.data || [];
        }
        if (p === 'certificates') {
          const r = await api.getCertificates();
          this.certificatesList = r.data || [];
        }
        if (p === 'coverage') {
          const r = await api.getCoverage();
          this.coverageList = r.data || [];
        }
        if (p === 'quotes') {
          const r = await api.getQuotes();
          this.quotesList = r.data || [];
        }
        if (p === 'messages') {
          const r = await api.getMessages();
          this.messagesList = r.data || [];
        }
        // ── Contact ─────────────────────────────
        if (p === 'contact') {
          const r = await api.getContent('contact');
          if (r.data) this.contactData = { ...this.contactData, ...r.data };
        }
        // ── Footer ──────────────────────────────
        if (p === 'footer') {
          const r = await api.getContent('footer');
          if (r.data) {
            // Pastikan services_list selalu array
            this.footerData = {
              ...this.footerData,
              ...r.data,
              services_list: Array.isArray(r.data.services_list)
                ? r.data.services_list
                : (r.data.services_list ? r.data.services_list.split('\n').filter(Boolean) : [])
            };
          }
        }
      } catch (e) { console.error(e); }
    },

    // ── Save generic content (hero, about) ────
    async saveContent(section, data) {
      swal.loading();
      try {
        await api.updateContent(section, data);
        await swal.success('Berhasil Disimpan!', `Konten ${section} telah diperbarui.`);
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan pada server.');
      }
    },

    async saveHero() {
      swal.loading('Menyimpan Hero...', 'Gambar sedang diproses dan diunggah.');
      try {
        const fd = new FormData();
        // Hapus field preview sebelum kirim
        const payload = { ...this.hero };
        delete payload._preview;

        fd.append('data', JSON.stringify(payload));
        if (this._heroFile) {
          fd.append('image', this._heroFile);
        }
        fd.append('_method', 'PUT');

        const r = await api.updateContentWithImage('hero', fd);
        if (r.success) {
          this.hero = { ...r.data, _preview: '' };
          this._heroFile = null;
          await swal.success('Hero Banner Berhasil Disimpan!', 'Perubahan telah diterapkan ke website.');
        }
      } catch (e) {
        await swal.error('Gagal Menyimpan Hero!', e.message || 'Terjadi kesalahan pada server.');
      }
    },
    removeHeroBg() {
      this.hero.bg_image = '';
      this.hero._preview = '';
      this._heroFile = null;
    },

    // ── Save About with new fields ─────────────
    async saveAboutData() {
      swal.loading('Menyimpan About...', 'Memproses gambar dan data.');
      try {
        const payload = {
          ...this.aboutData,
          values: this.aboutData.values_text
            ? this.aboutData.values_text.split(',').map(v => v.trim()).filter(v => v)
            : this.aboutData.values || []
        };
        // Hapus field preview sebelum kirim
        delete payload._preview;

        const fd = new FormData();
        fd.append('data', JSON.stringify(payload));
        if (this._aboutFile) {
          fd.append('image', this._aboutFile);
        }
        fd.append('_method', 'PUT');

        const r = await api.updateContentWithImage('about', fd);
        if (r.success) {
          this.aboutData = {
            ...this.aboutData,
            ...r.data,
            _preview: '',
            values_text: Array.isArray(r.data.values) ? r.data.values.join(', ') : (r.data.values_text || '')
          };
          this._aboutFile = null;
          await swal.success('About Us Berhasil Disimpan!', 'Konten about telah diperbarui.');
        }
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan pada server.');
      }
    },
    removeAboutImg() {
      this.aboutData.bg_image = '';
      this.aboutData._preview = '';
      this._aboutFile = null;
    },

    // ── Footer helpers ─────────────────────────
    addFooterService() {
      this.footerData.services_list.push('');
    },
    removeFooterService(index) {
      this.footerData.services_list.splice(index, 1);
    },

    // ── Save footer ────────────────────────────
    async saveFooter() {
      // Validasi minimal
      if (!this.footerData.brand_name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama perusahaan tidak boleh kosong.');
        return;
      }
      if (!this.footerData.contact_email.trim()) {
        await swal.error('Validasi Gagal!', 'Email kontak tidak boleh kosong.');
        return;
      }

      try {
        const payload = {
          ...this.footerData,
          // Kirim sebagai array, backend bisa sesuaikan
          services_list: this.footerData.services_list.filter(s => s.trim() !== '')
        };
        await api.updateContent('footer', payload);
        await swal.success('Footer Berhasil Diperbarui!', 'Perubahan footer telah disimpan ke database.');
      } catch (e) {
        await swal.error('Gagal Menyimpan Footer!', e.message || 'Terjadi kesalahan pada server.');
      }
    },

    // ── Save contact ───────────────────────────
    async saveContact() {
      if (!this.contactData.address.trim()) {
        await swal.error('Validasi Gagal!', 'Alamat tidak boleh kosong.');
        return;
      }
      if (!this.contactData.email.trim()) {
        await swal.error('Validasi Gagal!', 'Email tidak boleh kosong.');
        return;
      }
      try {
        await api.updateContent('contact', this.contactData);
        await swal.success('Contact Berhasil Diperbarui!', 'Informasi kontak telah disimpan ke database.');
      } catch (e) {
        await swal.error('Gagal Menyimpan Contact!', e.message || 'Terjadi kesalahan pada server.');
      }
    },

    // ── File select handler ────────────────────
    handleFileSelect(event, type) {
      const file = event.target.files[0];
      if (!file) return;

      // Validasi Ukuran File (Max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        swal.error('File Terlalu Besar!', 'Maksimal ukuran gambar adalah 10MB. Silakan kompres atau pilih gambar lain.');
        event.target.value = ''; // Reset input
        return;
      }
      if (type === 'customer_logo') {
        this._customerFile = file;
      } else if (type === 'gallery_image') {
        this._galleryFile = file;
      } else if (type === 'hero_bg') {
        this._heroFile = file;
      } else if (type === 'about_img') {
        this._aboutFile = file;
      } else if (type === 'fleet_image') {
        this._fleetFile = file;
      } else if (type === 'service_image') {
        this._serviceFile = file;
      } else if (type === 'certificate_image') {
        this._certificateFile = file;
      }
      
      // Show preview
      if (type === 'hero_bg') {
        const reader = new FileReader();
        reader.onload = (e) => { this.hero._preview = e.target.result; };
        reader.readAsDataURL(file);
        return;
      }
      if (type === 'about_img') {
        const reader = new FileReader();
        reader.onload = (e) => { this.aboutData._preview = e.target.result; };
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.modal && this.modal.data) {
          this.modal.data._preview = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },

    // ── Customer CRUD ──────────────────────────
    editCustomer(c) {
      this._customerFile = null;
      this.modal = {
        show: true,
        type: 'customer',
        title: 'Edit Customer',
        data: { ...c, _preview: '' },
        editId: c.id
      };
    },

    async deleteCustomerItem(id) {
      const result = await swal.confirm('Hapus Customer?', 'Data customer akan dihapus permanen.');
      if (!result.isConfirmed) return;
      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteCustomer(id);
        await swal.success('Customer Dihapus!', 'Data berhasil dihapus.');
        this.loadPageData('customers');
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan.');
      }
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
      if (this._customerFile) {
        fd.append('logo', this._customerFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateCustomer(this.modal.editId, fd);
        } else {
          await api.createCustomer(fd);
        }
        this.modal.show = false;
        this._customerFile = null;
        await swal.success('Customer Disimpan!', 'Data customer berhasil disimpan.');
        this.loadPageData('customers');
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    },

    // ── Gallery CRUD ───────────────────────────
    editGalleryItem(g) {
      this._galleryFile = null;
      this.modal = {
        show: true,
        type: 'gallery',
        title: 'Edit Foto Galeri',
        data: { ...g, _preview: '' },
        editId: g.id
      };
    },

    async deleteGalleryItem(id) {
      const result = await swal.confirm('Hapus Foto?', 'Foto akan dihapus permanen dari galeri.');
      if (!result.isConfirmed) return;
      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        await api.deleteGalleryItem(id);
        await swal.success('Foto Dihapus!', 'Foto berhasil dihapus dari galeri.');
        this.loadPageData('gallery');
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan.');
      }
    },

    async saveGalleryItem() {
      const d = this.modal.data;
      if (!d.title || !d.title.trim()) {
        await swal.error('Validasi Gagal!', 'Judul foto tidak boleh kosong.');
        return;
      }

      swal.loading('Mengunggah Foto...', 'Sedang memproses dan mengompres gambar.');
      const fd = new FormData();
      fd.append('title', d.title);
      fd.append('description', d.description || '');
      fd.append('category', d.category || 'general');
      fd.append('sort_order', d.sort_order || 0);
      if (this._galleryFile) {
        fd.append('image', this._galleryFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateGalleryItem(this.modal.editId, fd);
        } else {
          await api.createGalleryItem(fd);
        }
        this.modal.show = false;
        this._galleryFile = null;
        await swal.success('Foto Disimpan!', 'Foto galeri berhasil disimpan.');
        this.loadPageData('gallery');
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    },

    // ── Certificate CRUD ───────────────────────
    editCertificate(c) {
      this._certificateFile = null;
      this.modal = {
        show: true,
        type: 'certificate',
        title: 'Edit Sertifikat',
        data: { ...c, _preview: '' },
        editId: c.id
      };
    },

    async deleteCertificateItem(id) {
      const result = await swal.confirm('Hapus Sertifikat?', 'Data sertifikat akan dihapus permanen.');
      if (!result.isConfirmed) return;
      try {
        await api.deleteCertificate(id);
        await swal.success('Sertifikat Dihapus!', 'Data berhasil dihapus.');
        this.loadPageData('certificates');
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan.');
      }
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
      if (this._certificateFile) {
        fd.append('image', this._certificateFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateCertificate(this.modal.editId, fd);
        } else {
          await api.createCertificate(fd);
        }
        this.modal.show = false;
        this._certificateFile = null;
        await swal.success('Sertifikat Disimpan!', 'Data sertifikat berhasil disimpan.');
        this.loadPageData('certificates');
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    },

    // ── Modal open/edit/delete ─────────────────
    openModal(type, data, id) {
      const defaults = {
        service: { icon: 'bi-truck', title: '', description: '', content: '', sort_order: 0, is_active: 1 },
        fleet: { name: '', type: '', capacity: '', description: '', sort_order: 0 },
        client: { company_name: '', client_name: '', client_position: '', testimonial: '', rating: 5 },
        coverage: { region: '', cities: '', sort_order: 0 },
        customer: { name: '', website_url: '', sort_order: 0, logo_path: '', _preview: '' },
        gallery: { title: '', description: '', category: 'general', sort_order: 0, image_path: '', _preview: '' },
        certificate: { name: '', sort_order: 0, image_path: '', _preview: '' },
      };
      const titles = {
        service: 'Layanan', fleet: 'Armada', client: 'Klien',
        coverage: 'Area Jangkauan', customer: 'Customer', gallery: 'Foto Galeri',
        certificate: 'Sertifikat'
      };
      this._customerFile = null;
      this._galleryFile = null;
      this._certificateFile = null;
      this.modal = {
        show: true,
        type: type,
        title: (id ? 'Edit ' : 'Tambah ') + (titles[type] || ''),
        data: data ? { ...data } : { ...defaults[type] },
        editId: id || null
      };
    },

    editItem(type, item) {
      this.openModal(type, item, item.id);
    },

    async deleteItem(type, id) {
      const result = await swal.confirm(
        'Hapus Data?',
        'Data yang dihapus tidak dapat dikembalikan.'
      );
      if (!result.isConfirmed) return;

      swal.loading('Menghapus...', 'Mohon tunggu.');
      try {
        if (type === 'service') await api.deleteService(id);
        if (type === 'fleet') await api.deleteFleet(id);
        if (type === 'client') await api.deleteClient(id);
        if (type === 'coverage') await api.deleteCoverage(id);
        await swal.success('Berhasil Dihapus!', 'Data telah dihapus dari sistem.');
        this.loadPageData(this.page);
      } catch (e) {
        await swal.error('Gagal Menghapus!', e.message || 'Terjadi kesalahan pada server.');
      }
    },

    async saveModal() {
      // Route to specific save methods for customer/gallery
      if (this.modal.type === 'customer') {
        return this.saveCustomer();
      }
      if (this.modal.type === 'gallery') {
        return this.saveGalleryItem();
      }
      if (this.modal.type === 'fleet') {
        return this.saveFleet();
      }
      if (this.modal.type === 'certificate') {
        return this.saveCertificate();
      }
      if (this.modal.type === 'service') {
        return this.saveService();
      }

      const d = this.modal.data;
      const id = this.modal.editId;
      try {
        if (this.modal.type === 'client') {
          id ? await api.updateClient(id, d) : await api.createClient(d);
        }
        if (this.modal.type === 'coverage') {
          id ? await api.updateCoverage(id, d) : await api.createCoverage(d);
        }
        this.modal.show = false;
        await swal.success('Data Berhasil Disimpan!', `${this.modal.title || 'Data'} telah diperbarui.`);
        this.loadPageData(this.page);
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan pada server.');
      }
    },

    async saveService() {
      const d = this.modal.data;
      if (!d.title || !d.title.trim()) {
        await swal.error('Validasi Gagal!', 'Judul layanan tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Layanan...', 'Memproses data dan gambar.');
      const fd = new FormData();
      fd.append('title', d.title);
      fd.append('icon', d.icon || 'bi-truck');
      fd.append('description', d.description || '');
      fd.append('content', d.content || '');
      fd.append('sort_order', d.sort_order || 0);
      fd.append('is_active', d.is_active !== undefined ? d.is_active : 1);
      if (this._serviceFile) {
        fd.append('image', this._serviceFile);
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateService(this.modal.editId, fd);
        } else {
          await api.createService(fd);
        }
        this.modal.show = false;
        this._serviceFile = null;
        await swal.success('Layanan Disimpan!', 'Data layanan berhasil disimpan.');
        this.loadPageData('services');
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    },



    async updateQStatus(id, status) {
      try {
        await api.updateQuoteStatus(id, status);
        this.loadPageData('quotes');
      } catch (e) {
        await swal.error('Gagal Update Status!', e.message || 'Terjadi kesalahan.');
      }
    },

    async readMessage(m) {
      if (!m.is_read || m.is_read === '0' || m.is_read === 0) {
        try { await api.markRead(m.id); } catch (e) { }
      }
      this.modal = { show: true, type: 'message', title: 'Detail Pesan', data: m, editId: null };
      this.loadPageData('messages');
    },

    async saveFleet() {
      const d = this.modal.data;
      if (!d.name || !d.name.trim()) {
        await swal.error('Validasi Gagal!', 'Nama armada tidak boleh kosong.');
        return;
      }

      swal.loading('Menyimpan Armada...', 'Memproses data dan gambar armada.');
      const fd = new FormData();
      fd.append('data', JSON.stringify(d));
      if (this._fleetFile) {
        fd.append('image', this._fleetFile);
      }
      if (d._remove) {
        fd.append('remove_image', '1');
      }

      try {
        if (this.modal.editId) {
          fd.append('_method', 'PUT');
          await api.updateFleet(this.modal.editId, fd);
        } else {
          await api.createFleet(fd);
        }
        this.modal.show = false;
        this._fleetFile = null;
        await swal.success('Armada Disimpan!', 'Data armada berhasil disimpan.');
        this.loadPageData('fleet');
      } catch (e) {
        await swal.error('Gagal Menyimpan!', e.message || 'Terjadi kesalahan.');
      }
    },

    removeFleetPhoto() {
      this.modal.data.image_path = '';
      this.modal.data._preview = '';
      this.modal.data._remove = true;
      this._fleetFile = null;
    },

    openPasswordModal() {
      this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
      this.passwordModal = true;
    },
    async changePassword() {
      if (!this.passwordForm.current_password || !this.passwordForm.new_password) {
        return Swal.fire('Error', 'Semua kolom wajib diisi', 'error');
      }
      if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
        return Swal.fire('Error', 'Konfirmasi password tidak cocok', 'error');
      }

      try {
        const res = await api.changePassword(this.passwordForm);
        if (res.success) {
          this.passwordModal = false;
          Swal.fire('Berhasil', 'Password Anda telah diperbarui', 'success');
        }
      } catch (err) {
        Swal.fire('Gagal', err.message || 'Gagal ganti password', 'error');
      }
    },

    async logout() {
      await api.logout();
      window.location.href = 'login.html';
    },

    formatDate(d) {
      if (!d) return '-';
      const dt = new Date(d);
      return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
});
app.config.globalProperties.$baseDir = window.BASE_DIR || '';
app.mount('#app');