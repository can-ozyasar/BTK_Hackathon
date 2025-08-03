// --- Ana Sayfa (1. Sayfa) İçin Yeni Kod ---

const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// Backend'den kategorileri çeken fonksiyon
async function fetchCategories() {
    try {
        if (DEBUG_MODE) console.log('📡 Ana sayfadan API\'den kategoriler alınıyor...');
        
        const response = await fetch(`${API_BASE_URL}/api/stories/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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

        if (DEBUG_MODE) console.log('✅ İşlenmiş kategoriler:', categories);
        return categories;

    } catch (error) {
        if (DEBUG_MODE) console.error('⚠️ API hatası:', error.message);
        return null; // Hata durumunda null döndür
    }
}

// Butona tıklanma olayını dinleme
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Butonun tıklanmasını engelle
            ctaButton.disabled = true;
            ctaButton.textContent = 'Yükleniyor...'; // Yükleniyor mesajı göster
            ctaButton.classList.add('loading');
            
            try {
                // Kategorileri çek
                const categories = await fetchCategories();

                // Çekilen veriyi localStorage'a kaydet
                if (categories) {
                    localStorage.setItem('cachedCategories', JSON.stringify(categories));
                    if (DEBUG_MODE) console.log('✅ Kategoriler başarıyla localStorage\'a kaydedildi.');
                }
                
                // Yönlendirme yap
                window.location.href = 'hikayeSec.html'; // 2. sayfanızın URL'sini buraya yazın
            } catch (error) {
                if (DEBUG_MODE) console.error('❌ Kategori yükleme hatası:', error);
                alert('Kategoriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
                ctaButton.disabled = false;
                ctaButton.textContent = 'Başla'; // Veya butonun orijinal metni
                ctaButton.classList.remove('loading');
            }
        });
    }
});

// Loading animasyonu için CSS (isteğe bağlı ama önerilir)
const style = document.createElement('style');
style.textContent = `
    .cta-button.loading {
        cursor: not-allowed;
        opacity: 0.8;
        transition: opacity 0.3s;
    }
    /* Loading animasyonu için daha sofistike bir CSS */
    .cta-button.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-right-color: #fff;
        border-radius: 50%;
        animation: spinner 0.8s linear infinite;
    }
    .cta-button.loading span {
        visibility: hidden;
    }
    @keyframes spinner {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);