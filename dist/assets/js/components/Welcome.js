const Welcome = {
  template: `
    <div v-if="show" class="welcome-screen" :class="{ 'fade-out': exiting }">
      <div class="welcome-container">
        <div class="welcome-intro">Welcome to</div>
        <div class="welcome-logo-box">
          <img src="assets/img/logo-fis.png" class="welcome-logo" alt="FIS Logistics">
        </div>
        <div class="welcome-content">
          <h1 class="welcome-title">
            <span class="w-word">PT. FAN</span>
            <span class="w-word">INDONESIA</span>
            <span class="w-word">SEJAHTERA</span>
          </h1>
          <div class="welcome-tagline">FASTER IN SERVICE</div>
          <div class="welcome-line"></div>
          <p class="welcome-subtitle">YOUR TRUSTED LOGISTICS PARTNER</p>
        </div>
        <div class="welcome-loader">
          <div class="welcome-progress"></div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      show: true,
      exiting: false
    }
  },
  mounted() {
    // Start exit sequence after 3.2 seconds
    setTimeout(() => {
      this.exiting = true;
      // Start revealing the home page content slightly before the splash is fully gone
      this.$emit('finished');
      
      setTimeout(() => {
        this.show = false;
      }, 1000); // Wait for CSS screen-exit animation to finish
    }, 3200);
  }
};
