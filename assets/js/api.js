// ============================================
// API Wrapper — fetch helper for PHP backend
// ============================================
const basePath = window.location.pathname.indexOf('/website') === 0 ? '/website' : '';
const API_BASE = basePath + '/api';
window.BASE_DIR = basePath;

const api = {
  async request(endpoint, options = {}) {
    let url = API_BASE + endpoint;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...options
    };
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }
    // Remove Content-Type for FormData (browser sets it with boundary)
    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Cache buster for GET requests
    if (!config.method || config.method === 'GET') {
      url += (url.includes('?') ? '&' : '?') + '_t=' + new Date().getTime();
    }
    
    try {
      const res = await fetch(url, config);
      const data = await res.json();
      if (!res.ok) throw { status: res.status, ...data };
      return data;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw { success: false, message: 'Tidak dapat terhubung ke server.' };
      }
      throw err;
    }
  },
  get(endpoint) { return this.request(endpoint); },
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); },
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); },
  del(endpoint) { return this.request(endpoint, { method: 'DELETE' }); },

  // Upload (FormData)
  upload(endpoint, formData, method = 'POST') {
    return this.request(endpoint, { method, body: formData });
  },

  // Shortcuts
  getContent(section) { return this.get(`/content/${section}`); },
  updateContent(section, d) { return this.put(`/content/${section}`, { data: d }); },
  updateContentWithImage(section, fd) { return this.upload(`/content/${section}`, fd); },
  getServices() { return this.get('/services'); },
  getServiceById(id) { return this.get(`/services/${id}`); },
  createService(d) { return this.post('/services', d); },
  updateService(id, d) { 
    return (d instanceof FormData) ? this.upload(`/services/${id}`, d, 'POST') : this.put(`/services/${id}`, d); 
  },
  deleteService(id) { return this.del(`/services/${id}`); },
  getFleet() { return this.get('/fleet'); },
  createFleet(d) { 
    return (d instanceof FormData) ? this.upload('/fleet', d) : this.post('/fleet', d); 
  },
  updateFleet(id, d) { 
    return (d instanceof FormData) ? this.upload(`/fleet/${id}`, d, 'POST') : this.put(`/fleet/${id}`, d); 
  },
  deleteFleet(id) { return this.del(`/fleet/${id}`); },
  getClients() { return this.get('/clients'); },
  createClient(d) { return this.post('/clients', d); },
  updateClient(id, d) { return this.put(`/clients/${id}`, d); },
  deleteClient(id) { return this.del(`/clients/${id}`); },
  getCoverage() { return this.get('/coverage'); },
  createCoverage(d) { return this.post('/coverage', d); },
  updateCoverage(id, d) { return this.put(`/coverage/${id}`, d); },
  deleteCoverage(id) { return this.del(`/coverage/${id}`); },

  // Customers
  getCustomers() { return this.get('/customers'); },
  createCustomer(fd) { return this.upload('/customers', fd); },
  updateCustomer(id, fd) { return this.upload(`/customers/${id}`, fd, 'POST'); },
  deleteCustomer(id) { return this.del(`/customers/${id}`); },

  // Gallery
  getGallery(category) { return this.get('/gallery' + (category ? `?category=${category}` : '')); },
  getGalleryCategories() { return this.get('/gallery/categories'); },
  createGalleryItem(fd) { return this.upload('/gallery', fd); },
  updateGalleryItem(id, fd) { return this.upload(`/gallery/${id}`, fd, 'POST'); },
  deleteGalleryItem(id) { return this.del(`/gallery/${id}`); },

  // Certificates
  getCertificates() { return this.get('/certificates'); },
  createCertificate(fd) { return this.upload('/certificates', fd); },
  updateCertificate(id, fd) { return this.upload(`/certificates/${id}`, fd, 'POST'); },
  deleteCertificate(id) { return this.del(`/certificates/${id}`); },

  submitQuote(d) { return this.post('/quotes', d); },
  getQuotes() { return this.get('/quotes'); },
  updateQuoteStatus(id, s) { return this.put(`/quotes/${id}/status`, { status: s }); },
  submitContact(d) { return this.post('/contact', d); },
  getMessages() { return this.get('/contact'); },
  markRead(id) { return this.put(`/contact/${id}`, {}); },
  login(u, p) { return this.post('/auth/login', { username: u, password: p }); },
  logout() { return this.post('/auth/logout', {}); },
  checkAuth() { return this.get('/auth/check'); },
  changePassword(d) { return this.post('/auth/change-password', d); },
  getStats() { return this.get('/stats'); },
};
