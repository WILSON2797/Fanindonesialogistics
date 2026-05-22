<template>
  <div>
    <section class="page-banner" v-if="!hideBanner">
      <div class="container">
        <h1 data-aos="fade-up">About Us</h1>
        <p data-aos="fade-up" data-aos-delay="100">Getting closer to PT. Fan Indonesia Sejahtera</p>
      </div>
    </section>
    <section class="pv-about">
      <div class="container">
        <div class="pv-sec-hdr" data-aos="fade-up">
          <div class="pv-sec-label"><i class="fa-solid fa-building pv-about-hdr-icon"></i> About US</div>
          <h2 class="pv-sec-title">PT. FAN INDONESIA <span>SEJAHTERA (FIS LOGISTICS)</span></h2>
        </div>
        <div class="pv-about-grid">
          <div class="pv-about-visual" data-aos="fade-right">
            <div class="pv-about-main">
              <img :src="aboutBgImage" alt="PT. Fan Indonesia Sejahtera">
            </div>
            <div class="pv-about-badge-card">
              <div class="pv-abc-num">{{ about && about.founded_year ? about.founded_year : '2009' }}</div>
              <div class="pv-abc-lbl">{{ about && about.founded_label ? about.founded_label : 'ESTABLISHED SINCE' }}</div>
            </div>
          </div>
          <div class="pv-about-content" data-aos="fade-left">
            <h2>TRUSTED <span>LOGISTICS PARTNER</span></h2>
            <p v-if="about">{{ about.description }}</p>
            <p v-else>PT. Fan Indonesia Sejahtera (PT. FIS Logistics) is a logistics and transportation company with more than 15 years of experience.</p>
            <div class="pv-vm-grid">
              <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="100">
                <div class="pv-vm-title"><i class="fa-solid fa-bullseye pv-card-icon-fa"></i> VISION</div>
                <div class="pv-vm-text" v-if="about && about.vision">{{ about.vision }}</div>
                <div class="pv-vm-text" v-else>To be the leading and most trusted logistics company in Indonesia by 2030</div>
              </div>
              <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="150">
                <div class="pv-vm-title"><i class="fa-solid fa-lightbulb pv-card-icon-fa"></i> MISSION</div>
                <div class="pv-vm-text" v-if="about && about.mission">{{ Array.isArray(about.mission) ?
                  about.mission.join('. ') : about.mission }}</div>
                <div class="pv-vm-text" v-else>Providing high quality logistics services with modern technology and professional human resources</div>
              </div>
              <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="200">
                <div class="pv-vm-title"><i class="fa-solid fa-trophy pv-card-icon-fa"></i> VALUES</div>
                <div class="pv-vm-text" v-if="about && about.values">{{ Array.isArray(about.values) ?
                  about.values.join(', ') : (about.values_text || about.values) }}</div>
                <div class="pv-vm-text" v-else>Integrity, Innovation, Timeliness, and Customer satisfaction</div>
              </div>
              <div class="pv-vm-card" data-aos="fade-up" data-aos-delay="250">
                <div class="pv-vm-title"><i class="fa-solid fa-file-contract pv-card-icon-fa"></i> LEGALITY</div>
                <div class="pv-vm-text" v-if="about && about.legality">{{ about.legality }}</div>
                <div class="pv-vm-text" v-else>Officially licensed, certified, and registered with the Ministry of Transportation of the Republic of Indonesia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  name: 'AboutUs',
  props: {
    hideBanner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      about: null
    };
  },
  computed: {
    aboutBgImage() {
      if (this.about && this.about.bg_image) {
        return this.about.bg_image.startsWith('http')
          ? this.about.bg_image
          : (this.$baseDir || '') + '/' + this.about.bg_image;
      }
      return (this.$baseDir || '') + '/assets/img/about-company.png';
    }
  },
  async mounted() {
    try {
      const r = await api.getContent('about');
      this.about = r.data;
    } catch (e) {
      console.warn('Failed to load about data:', e);
    }
    this.$nextTick(() => {
      if (window.AOS) AOS.refresh();
    });
  }
};
</script>
