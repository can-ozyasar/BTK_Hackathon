
const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

/**
 * Backend'den en güncel kategorileri çeker ve localStorage'a kaydeder.
 * Butonun durumunu günceller ve sayfa yönlendirmesi yapar.
 */
async function fetchAndCacheCategories() {
  const ctaButton = document.querySelector('.cta-button');

  if (ctaButton) {
    ctaButton.disabled = true;
    ctaButton.textContent = 'Yükleniyor...';
    ctaButton.classList.add('loading');
  }

  try {
    if (DEBUG_MODE) console.log('📡 API\'den en güncel kategoriler alınıyor...');

    const response = await fetch(`${API_BASE_URL}/api/stories/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Gelen veriyi işleyip categories array'ini döndürme
    let categories;
    if (data.success && Array.isArray(data.data)) {
      categories = data.data;
    } else if (data.success && data.data && Array.isArray(data.data.categories)) {
      categories = data.data.categories;
    } else if (Array.isArray(data)) {
      categories = data;
    } else if (data.categories && Array.isArray(data.categories)) {
      categories = data.categories;
    } else {
      throw new Error('Beklenmeyen API response formatı');
    }

    // Veriyi localStorage'a kaydet 
    localStorage.setItem('cachedCategories', JSON.stringify(categories));
    if (DEBUG_MODE) console.log('✅ localStorage en güncel verilerle güncellendi.');

    // Yönlendirme yap
    window.location.href = 'hikayeSec.html';

  } catch (error) {
    if (DEBUG_MODE) console.error('⚠️ Kategori yükleme hatası:', error.message);
    alert('Kategoriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    if (ctaButton) {
      ctaButton.disabled = false;
      ctaButton.textContent = 'Başla';
      ctaButton.classList.remove('loading');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ctaButton = document.querySelector('.cta-button');

  const style = document.createElement('style');
  style.textContent = `
    .cta-button.loading { cursor: not-allowed; opacity: 0.8; transition: opacity 0.3s; }
    .cta-button.loading::after {
      content: ''; position: absolute; top: 50%; left: 50%; width: 20px; height: 20px;
      margin: -10px 0 0 -10px; border: 2px solid rgba(255, 255, 255, 0.5);
      border-right-color: #fff; border-radius: 50%; animation: spinner 0.8s linear infinite;
    }
    .cta-button.loading span { visibility: hidden; }
    @keyframes spinner { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  if (ctaButton) {
    ctaButton.addEventListener('click', async (e) => {
      e.preventDefault();
      fetchAndCacheCategories();
    });
  }
});