// hikayeOku.js - Düzeltilmiş Kapak ve Başlık Sistemi
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
}

function getStoryFromLocalStorage() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('storyId');
    
    if (!storyId) {
        if (DEBUG_MODE) console.error('❌ storyId URL parametresinde bulunamadı.');
        return null;
    }
    
    try {
        const cachedStory = localStorage.getItem(`story-${storyId}`);
        if (cachedStory) {
            if (DEBUG_MODE) console.log('✅ Hikaye verisi localStorage\'dan yüklendi.');
            return JSON.parse(cachedStory);
        }
    } catch (e) {
        if (DEBUG_MODE) console.error('⚠️ localStorage okuma hatası:', e);
    }
    return null;
}

/**
 * Hikaye başlığını dinamik olarak oluşturur
 */
function generateStoryTitle(story) {
    // Öncelikle localStorage'dan alınan cevapları kontrol et
    try {
        const cachedAnswers = localStorage.getItem('storyCreationAnswers');
        if (cachedAnswers) {
            const answers = JSON.parse(cachedAnswers);
            
            // Kahramanın ismini bul
            let heroName = '';
            for (const [key, value] of Object.entries(answers)) {
                if (typeof value === 'string' && value.length > 0 && value.length <= 20) {
                    // Muhtemelen isim alanı (kısa string)
                    heroName = value;
                    break;
                }
            }
            
            if (heroName) {
                // Kategori adını da al
                const categoryName = story.originalCategory || story.metadata?.originalCategoryName || 'Macera';
                return `${heroName}'nin ${categoryName} Hikayesi`;
            }
        }
    } catch (e) {
        if (DEBUG_MODE) console.warn('Cevaplar okunurken hata:', e);
    }
    
    // Fallback: Kategori adından başlık oluştur
    const categoryName = story.originalCategory || story.metadata?.originalCategoryName || 'Büyülü';
    const storyTitles = {
        'aile': 'Aile Sıcaklığı',
        'buyulu': 'Büyülü Macera',
        'dostluk': 'Dostluk Hikayesi',
        'hayvanlar': 'Hayvan Dostları',
        'macera': 'Büyük Macera',
        'okul': 'Okul Günleri',
        'uzay': 'Uzay Yolculuğu',
        'diger': 'Harika Hikaye'
    };
    
    return storyTitles[categoryName.toLowerCase()] || `${categoryName} Hikayesi`;
}

/**
 * Kapak sayfası için özet metin oluşturur
 */
function generateCoverSummary(story) {
    // Kapak için özel özet metinleri
    const summaryTexts = {
        'aile': 'Sevgi dolu bir aile hikayesi seni bekliyor...',
        'buyulu': 'Büyülü bir dünyada unutulmaz bir macera...',
        'dostluk': 'Arkadaşlık ve dostluk üzerine özel bir hikaye...',
        'hayvanlar': 'Sevimli hayvan dostlarıyla dolu bir macera...',
        'macera': 'Heyecan verici bir macera seni bekliyor...',
        'okul': 'Okul yaşamından eğlenceli bir hikaye...',
        'uzay': 'Uzayın derinliklerinde geçen muhteşem bir yolculuk...',
        'diger': 'Seni büyüleyecek özel bir hikaye...'
    };
    
    // Kategoriyi tespit et
    const category = story.detectedCategory || story.originalCategory || 'diger';
    let summary = summaryTexts[category.toLowerCase()] || summaryTexts['diger'];
    
    // Kahramanın ismini ekle
    try {
        const cachedAnswers = localStorage.getItem('storyCreationAnswers');
        if (cachedAnswers) {
            const answers = JSON.parse(cachedAnswers);
            let heroName = '';
            
            for (const [key, value] of Object.entries(answers)) {
                if (typeof value === 'string' && value.length > 0 && value.length <= 20) {
                    heroName = value;
                    break;
                }
            }
            
            if (heroName) {
                summary = `${heroName}'nin ${summary.charAt(0).toLowerCase() + summary.slice(1)}`;
            }
        }
    } catch (e) {
        if (DEBUG_MODE) console.warn('Kahraman ismi tespit edilemedi:', e);
    }
    
    return summary;
}

/**
 * Test hikayesi oluşturur (localStorage'da veri yoksa)
 */
function createTestStory() {
    return {
        title: "Test Hikayesi",
        summary: "Bu bir test hikayesidir.",
        backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGE5MGUyIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjN2JiM2YwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2E4ZDBmZiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykiLz4KICA8Y2lyY2xlIGN4PSI0NTAiIGN5PSIzMDAiIHI9IjcwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMikiLz4KICA8dGV4dCB4PSIzMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkNvcm1vcmFudCBHYXJhbW9uZCwgc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4+H8J+MuCBIaWtheWUgQXJrYXBsYW7EsW7EsSA8L3RleHQ+Cjwvc3ZnPgo=",
        detectedCategory: 'macera',
        originalCategory: 'Macera',
        sections: [
            { text: "Bir zamanlar uzak bir ülkede, küçük bir köyde yaşayan genç bir kız vardı. Adı Luna'ydı ve her gece gökyüzündeki yıldızları izlemeyi çok severdi." },
            { text: "Bir gece Luna, gökyüzünde alışılmadık parlak bir yıldız fark etti. Bu yıldız diğerlerinden farklıydı - sanki ona doğru dans ediyordu." },
            { text: "Meraklı Luna, yıldızı takip etmeye karar verdi. Evden çıkıp ormana doğru yürüdü. Yıldız onu daha derinlere çekiyordu." },
            { text: "Ormanın derinliklerinde Luna, büyülü bir açıklık buldu. Burada yıldızlar çok daha parlak görünüyordu ve havada büyülü bir enerji vardı." },
            { text: "Ve o gece Luna, yıldızlarla konuşmayı öğrendi. Artık her gece bu büyülü yere gelip yıldızlardan hikayeler dinliyordu. Sonsuza kadar mutlu yaşadı." }
        ]
    };
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
    
    currentPages = [];
    bookContainer.innerHTML = '';

    // Dinamik başlık ve özet oluştur
    const storyTitle = generateStoryTitle(story);
    const coverSummary = generateCoverSummary(story);
    
    if (DEBUG_MODE) {
        console.log('📖 Hikaye bilgileri:', {
            originalTitle: story.title,
            generatedTitle: storyTitle,
            originalSummary: story.summary,
            generatedSummary: coverSummary,
            sectionsCount: story.sections.length
        });
    }

    // Kapak sayfası oluşturma
    const coverPage = createPageElement(
        'cover-page', 
        story.backgroundImage, 
        storyTitle, 
        coverSummary, 
        true
    );
    coverPage.classList.add('is-active');
    bookContainer.appendChild(coverPage);
    currentPages.push(coverPage);

    // Hikaye bölümlerini sayfalara dönüştürme
    story.sections.forEach((section, index) => {
        const pageElement = createPageElement(
            `page-${index + 1}`,
            story.backgroundImage,
            null,
            section.text,
            false
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
 * @param {boolean} isCover Kapak sayfası mı?
 * @returns {HTMLElement} Oluşturulmuş sayfa elemanı.
 */
function createPageElement(id, imageUrl, title, text, isCover = false) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    if (isCover) pageDiv.classList.add('cover-page');
    pageDiv.id = id;

    // Sayfa tıklama eventi ekle
    pageDiv.addEventListener('click', nextPage);

    // Resim
    const img = document.createElement('img');
    img.src = imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGE5MGUyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IaWtheWUgUmVzbWk8L3RleHQ+Cjwvc3ZnPgo=';
    img.alt = title || 'Hikaye Sayfası';
    
    // Resim yükleme hatası durumunda fallback
    img.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGE5MGUyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IaWtheWUgUmVzbWk8L3RleHQ+Cjwvc3ZnPgo=';
    };
    
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
            page.classList.add('page-transition');
            setTimeout(() => page.classList.remove('page-transition'), 600);
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
        nextBtn.textContent = "Başla ▶";
    } else if (currentPageIndex === currentPages.length - 1) {
        pageNumberSpan.textContent = `Son Sayfa`;
        nextBtn.textContent = "🏠 Ana Sayfa";
    } else {
        pageNumberSpan.textContent = `Sayfa ${currentPageIndex}`;
        nextBtn.textContent = "İleri ▶";
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
        // Son sayfadaysa ana sayfaya dön
        if (confirm('Hikaye bitti! Ana sayfaya dönmek istiyor musunuz?')) {
            window.location.href = 'index.html';
        }
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

// Klavye kontrolleri ekle
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ': // Space tuşu
            e.preventDefault();
            nextPage();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevPage();
            break;
        case 'Home':
            e.preventDefault();
            currentPageIndex = 0;
            updatePage();
            break;
        case 'End':
            e.preventDefault();
            currentPageIndex = currentPages.length - 1;
            updatePage();
            break;
    }
});

// Olay dinleyicilerini ekle
nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);

// Sayfa yüklendiğinde hikayeyi getir
document.addEventListener('DOMContentLoaded', async () => {
    if (DEBUG_MODE) console.log('📖 Hikaye okuma sayfası yüklendi.');
    
    let story = getStoryFromLocalStorage();
    
    // Eğer localStorage'da hikaye yoksa test hikayesi kullan
    if (!story) {
        if (DEBUG_MODE) console.log('⚠️ localStorage\'da hikaye bulunamadı, test hikayesi yükleniyor.');
        story = createTestStory();
    }
    
    if (story) {
        renderStory(story);
    } else {
        bookContainer.innerHTML = `
            <div class="page is-active error-page">
                <p>Üzgünüm, hikaye yüklenemedi. 😞</p>
                <button onclick="window.location.href='index.html'" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Ana Sayfaya Dön
                </button>
            </div>
        `;
    }
});