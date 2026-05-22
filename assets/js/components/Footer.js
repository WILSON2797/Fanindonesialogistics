// Footer Component — dynamic, data dari CMS Footer
const Footer = {
  data() {
    return {
      footer: {
        brand_name: 'Fan Indonesia Sejahtera',
        brand_desc: 'PT. Fan Indonesia Sejahtera — Mitra logistik terpercaya untuk bisnis Anda. Menghubungkan Nusantara dengan armada modern dan layanan profesional.',
        contact_address: 'Jl. Raya Industri No. 123, Jakarta Timur',
        contact_phone: '+62 21 1234 5678',
        contact_email: 'oficial@fanindonesialogistics.com',
        contact_hours: 'Sen - Jum: 08:00 - 17:00 WIB',
        services_list: ['Transportasi Darat', 'Pergudangan', 'Distribusi', 'Supply Chain'],
        copyright_text: 'PT. Fan Indonesia Sejahtera. All rights reserved.'
      }
    };
  },
  async created() {
    try {
      // Ambil data footer dari API CMS
      const r = await api.getContent('footer');
      if (r && r.data) {
        this.footer = {
          ...this.footer,
          ...r.data,
          // Normalkan services_list jadi array
          services_list: Array.isArray(r.data.services_list)
            ? r.data.services_list
            : (r.data.services_list
              ? r.data.services_list.split('\n').filter(Boolean)
              : this.footer.services_list)
        };
      }
    } catch (e) {
      // Fallback ke data default jika API gagal
      console.warn('Footer: gagal memuat data CMS, menggunakan data default.', e);
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">

          <!-- Kolom Brand -->
          <div>
            <h4>
              <i class="bi bi-truck" style="color:var(--accent);margin-right:8px"></i>
              {{ footer.brand_name }}
            </h4>
            <p>{{ footer.brand_desc }}</p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4>Quick Links</h4>
            <div class="footer-links">
              <router-link to="/">Home</router-link>
              <router-link to="/about">About Us</router-link>
              <router-link to="/services">Services</router-link>
              <router-link to="/fleet">Fleet</router-link>
              <router-link to="/coverage">Coverage Area</router-link>
            </div>
          </div>

          <!-- Layanan (dari CMS) -->
          <div>
            <h4>Layanan</h4>
            <div class="footer-links">
              <a
                v-for="(sv, i) in footer.services_list"
                :key="i"
                href="#"
                @click.prevent
              >{{ sv }}</a>
              <router-link to="/quote">Request Quote</router-link>
            </div>
          </div>

          <!-- Kontak (dari CMS) -->
          <div>
            <h4>Hubungi Kami</h4>
            <div class="footer-contact">
              <div class="footer-contact-item" v-if="footer.contact_address">
                <i class="bi bi-geo-alt-fill"></i>
                <span>{{ footer.contact_address }}</span>
              </div>
              <div class="footer-contact-item" v-if="footer.contact_phone">
                <i class="bi bi-telephone-fill"></i>
                <span>{{ footer.contact_phone }}</span>
              </div>
              <div class="footer-contact-item" v-if="footer.contact_email">
                <i class="bi bi-envelope-fill"></i>
                <span>{{ footer.contact_email }}</span>
              </div>
              <div class="footer-contact-item" v-if="footer.contact_hours">
                <i class="bi bi-clock-fill"></i>
                <span>{{ footer.contact_hours }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Copyright -->
        <div class="footer-bottom">
          &copy; {{ currentYear }} {{ footer.copyright_text }}
        </div>
      </div>
    </footer>
  `
};