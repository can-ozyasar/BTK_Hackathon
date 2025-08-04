// ===== HİKAYE OKUMA KODU =====

const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// DOM elemanlarını seçme
const bookContainer = document.querySelector('.book');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumberSpan = document.getElementById('pageNumber');

let currentPages = [];
let currentPageIndex = 0;

/**
 * Loading ekranını gösterir.
 */
function showLoading() {
    bookContainer.innerHTML = `
        <div class="page is-active loading-page">
            <div class="loader"></div>
            <p>Hikayen yükleniyor...</p>
        </div>
    `;
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    pageNumberSpan.textContent = "Yükleniyor";

    const style = document.createElement('style');
    style.textContent = `
        .loading-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 100%;
            background-color: var(--page-background-color, #fdf8e8);
            border: 2px solid var(--page-border-color, #c8a2c8);
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            color: #6a0578;
        }
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #6a0578;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Ana hikaye verisini API'den veya localStorage'dan çeker.
 * @returns {Promise<object|null>} Hikaye nesnesi veya hata durumunda null.
 */
async function fetchStoryData() {
    // URL'den storyId'yi al
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('storyId');
    if (!storyId) {
        if (DEBUG_MODE) console.error('❌ storyId URL parametresinde bulunamadı.');
        return null;
    }

    // Önce localStorage'ı kontrol et
    try {
        const cachedStory = localStorage.getItem(`story-${storyId}`);
        if (cachedStory) {
            if (DEBUG_MODE) console.log('✅ Hikaye verisi localStorage\'dan yüklendi.');
            return JSON.parse(cachedStory);
        }
    } catch (e) {
        if (DEBUG_MODE) console.error('⚠️ localStorage okuma hatası:', e);
    }
    
    // localStorage'da yoksa API'den çek
    try {
        if (DEBUG_MODE) console.log(`📡 Hikaye (${storyId}) API'den çekiliyor...`);
        const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (DEBUG_MODE) console.log('📦 API\'den gelen ham hikaye verisi:', data);
        
        const storyData = data.data || data;
        
        // Gelen veriyi localStorage'a kaydet
        try {
            localStorage.setItem(`story-${storyId}`, JSON.stringify(storyData));
            if (DEBUG_MODE) console.log('✅ Hikaye verisi localStorage\'a kaydedildi.');
        } catch (e) {
            if (DEBUG_MODE) console.error('⚠️ localStorage yazma hatası:', e);
        }

        return storyData;

    } catch (error) {
        if (DEBUG_MODE) console.error('❌ Hikaye yükleme hatası:', error);
        return null;
    }
}

/**
 * Dinamik olarak hikaye sayfalarını oluşturur.
 * @param {object} story Hikaye verisi.
 */
function renderStory(story) {
    if (!story || !story.sections || story.sections.length === 0) {
        if (DEBUG_MODE) console.error('❌ Render edilecek hikaye verisi eksik veya hatalı.');
        bookContainer.innerHTML = `<div class="page is-active error-page"><p>Hikaye bulunamadı veya hatalı. 😔</p></div>`;
        return;
    }
    
    // Mevcut sayfaları temizle
    bookContainer.innerHTML = '';
    currentPages = [];

    // Kapak sayfası oluşturma
    const coverPage = createPageElement('cover-page', story.image, story.title, story.summary);
    coverPage.classList.add('is-active');
    bookContainer.appendChild(coverPage);
    currentPages.push(coverPage);

    // Hikaye bölümlerini sayfalara dönüştürme
    story.sections.forEach((section, index) => {
        const pageElement = createPageElement(
            `page-${index + 1}`,
            section.image,
            null, // Başlık her bölümde olmayabilir
            section.text
        );
        bookContainer.appendChild(pageElement);
        currentPages.push(pageElement);
    });

    // Kontrol düğmelerini ve sayfa numarasını güncelle
    currentPageIndex = 0;
    updatePage();
}

/**
 * Tek bir sayfa div'i oluşturur.
 * @param {string} id Sayfa kimliği.
 * @param {string} imageUrl Sayfa resmi URL'si.
 * @param {string} title Sayfa başlığı (kapak için).
 * @param {string} text Sayfa metni.
 * @returns {HTMLElement} Oluşturulmuş sayfa elemanı.
 */
function createPageElement(id, imageUrl, title, text) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.id = id;

    // Resim
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title || 'Hikaye Sayfası';
    pageDiv.appendChild(img);

    // Metin alanı
    const textDiv = document.createElement('div');
    textDiv.className = 'story-text';

    if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title;
        textDiv.appendChild(h2);
    }
    
    const p = document.createElement('p');
    p.textContent = text;
    textDiv.appendChild(p);

    pageDiv.appendChild(textDiv);

    return pageDiv;
}

/**
 * Sayfa geçişlerini yönetir ve kontrol düğmelerini günceller.
 */
function updatePage() {
    if (currentPages.length === 0) return;

    // Aktif sayfayı ayarla
    currentPages.forEach((page, index) => {
        if (index === currentPageIndex) {
            page.classList.add('is-active');
        } else {
            page.classList.remove('is-active');
        }
    });

    // Buton durumlarını güncelle
    prevBtn.disabled = currentPageIndex === 0;
    nextBtn.disabled = currentPageIndex === currentPages.length - 1;

    // Sayfa numarasını güncelle
    if (currentPageIndex === 0) {
        pageNumberSpan.textContent = "Kapak";
        nextBtn.textContent = "Başla";
    } else if (currentPageIndex === currentPages.length - 1) {
        pageNumberSpan.textContent = `Son Sayfa`;
        nextBtn.textContent = "Başa Dön";
    } else {
        pageNumberSpan.textContent = `Sayfa ${currentPageIndex}`;
        nextBtn.textContent = "İleri";
    }
}

/**
 * Sayfayı bir sonraki sayfaya geçirir.
 */
function nextPage() {
    if (currentPageIndex < currentPages.length - 1) {
        currentPageIndex++;
        updatePage();
    } else if (currentPageIndex === currentPages.length - 1) {
        // Son sayfadan sonra başa dön
        currentPageIndex = 0;
        updatePage();
    }
}

/**
 * Sayfayı bir önceki sayfaya geçirir.
 */
function prevPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updatePage();
    }
}

// Olay dinleyicilerini ekle
nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);

// Sayfa yüklendiğinde hikayeyi getir
document.addEventListener('DOMContentLoaded', async () => {
    if (DEBUG_MODE) console.log('📖 Hikaye okuma sayfası yüklendi.');
    showLoading();
    const story = await fetchStoryData();
    if (story) {
        renderStory(story);
    } else {
        bookContainer.innerHTML = `<div class="page is-active error-page"><p>Üzgünüm, hikaye yüklenemedi. 😞</p></div>`;
    }
});