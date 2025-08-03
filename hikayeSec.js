
    document.addEventListener('DOMContentLoaded', () => {
        const animalContainer = document.getElementById('animal-container');
        const animals = ['🫏','🐄','🐑','🐱', '🐶', '🦁', '🐼', '🦊', '🦝', '🐹','🦄','🐷','🐪','🐘','🦓'];

        // Rastgele bir hayvan oluşturan fonksiyon
        function createAnimal() {
            const animal = document.createElement('div');
            animal.classList.add('moving-animal');
            animal.textContent = animals[Math.floor(Math.random() * animals.length)];
            
            // Hayvanın başlangıç konumunu ayarla
            animal.style.left = `${Math.random() * 650+190}vw`;
            animal.style.top = `${Math.random() * 290}vh`;

            animalContainer.appendChild(animal);

            // Hayvanı döndürmek için yeni fonksiyonu çağır
            animateAnimalRotation(animal);
        }

        // Hayvanları daire şeklinde döndüren fonksiyon
        function animateAnimalRotation(animal) {
            const centerX = parseFloat(animal.style.left); // Hayvanın başlangıç X konumu
            const centerY = parseFloat(animal.style.top);  // Hayvanın başlangıç Y konumu
            const radius = Math.random() * 100 + 410;      // 50 ile 150 arasında rastgele bir yarıçap
            const speed = (Math.random() * 0.4) + 0.1;    // 0.5 ile 1 arasında rastgele bir hız
            let angle = Math.random() * 360;              // Başlangıç açısı

            function rotate() {
                // Açıyı her döngüde artır
                angle += speed;
                const radians = angle * Math.PI / 180;

                // Trigonometri kullanarak yeni X ve Y konumlarını hesapla
                const newX = centerX + radius * Math.cos(radians);
                const newY = centerY + radius * Math.sin(radians);

                // Hayvanın pozisyonunu güncelle
                animal.style.left = `${newX}px`;
                animal.style.top = `${newY}px`;
                
                requestAnimationFrame(rotate); // Animasyonu bir sonraki karede devam ettir
            }

            rotate(); // Animasyonu başlat
        }

        // 10 adet hareketli hayvan ekle
        for (let i = 0; i < 15; i++) {
            createAnimal();
        }
    });




//gelen verileri test etme 



















    document.addEventListener('DOMContentLoaded', () => {
        const animalContainer = document.getElementById('animal-container');
        const animals = ['🫏','🐄','🐑','🐱', '🐶', '🦁', '🐼', '🦊', '🦝', '🐹','🦄','🐷','🐪','🐘','🦓'];

        // Rastgele bir hayvan oluşturan fonksiyon
        function createAnimal() {
            const animal = document.createElement('div');
            animal.classList.add('moving-animal');
            animal.textContent = animals[Math.floor(Math.random() * animals.length)];
            
            // Hayvanın başlangıç konumunu ayarla
            animal.style.left = `${Math.random() * 650+190}vw`;
            animal.style.top = `${Math.random() * 290}vh`;

            animalContainer.appendChild(animal);

            // Hayvanı döndürmek için yeni fonksiyonu çağır
            animateAnimalRotation(animal);
        }

        // Hayvanları daire şeklinde döndüren fonksiyon
        function animateAnimalRotation(animal) {
            const centerX = parseFloat(animal.style.left); // Hayvanın başlangıç X konumu
            const centerY = parseFloat(animal.style.top);  // Hayvanın başlangıç Y konumu
            const radius = Math.random() * 100 + 410;      // 50 ile 150 arasında rastgele bir yarıçap
            const speed = (Math.random() * 0.4) + 0.1;    // 0.5 ile 1 arasında rastgele bir hız
            let angle = Math.random() * 360;              // Başlangıç açısı

            function rotate() {
                // Açıyı her döngüde artır
                angle += speed;
                const radians = angle * Math.PI / 180;

                // Trigonometri kullanarak yeni X ve Y konumlarını hesapla
                const newX = centerX + radius * Math.cos(radians);
                const newY = centerY + radius * Math.sin(radians);

                // Hayvanın pozisyonunu güncelle
                animal.style.left = `${newX}px`;
                animal.style.top = `${newY}px`;
                
                requestAnimationFrame(rotate); // Animasyonu bir sonraki karede devam ettir
            }

            rotate(); // Animasyonu başlat
        }

        // 10 adet hareketli hayvan ekle
        for (let i = 0; i < 15; i++) {
            createAnimal();
        }
    });





const API_BASE_URL = 'https://btk-proje-backend.onrender.com';

// CORS proxy for development (use only for testing)
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const USE_PROXY = false; // Set to false to connect directly to the backend

// Debug mode (set to false to disable console messages)
const DEBUG_MODE = true;

// Test function - for manual requests to the backend
async function testBackendConnection() {
    console.log('🔍 Backend bağlantısı test ediliyor...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/stories/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log("📦 Backend'den gelen veri ", data);
            return data;
        } else {
            console.error('❌ Backend hatası:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('❌ Bağlantı hatası:', error);
        return null;
    }
}

// Kategori renk ve ikon eşleştirmeleri
const categoryConfig = {
    'hayvanlar': {
        color: 'color-pink',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-cat-icon lucide-cat">
                <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
                <path d="M8 14v.5" />
                <path d="M16 14v.5" />
                <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
                </svg>`
    },
    'uzay': {
        color: 'color-light-blue',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-rocket-icon lucide-rocket">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>`
    },
    'sihir': {
        color: 'color-purple',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-wand-icon lucide-wand">
                <path d="M15 4V2" />
                <path d="M15 16v-2" />
                <path d="M8 9h2" />
                <path d="M20 9h2" />
                <path d="M17.8 11.8 19 13" />
                <path d="M15 9h.01" />
                <path d="M17.8 6.2 19 5" />
                <path d="m3 21 9-9" />
                <path d="M12.2 6.2 11 5" />
                </svg>`
    },
    'macera': {
        color: 'color-yellow',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-swords-icon lucide-swords">
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                <line x1="13" x2="19" y1="19" y2="13" />
                <line x1="16" x2="20" y1="16" y2="20" />
                <line x1="19" x2="21" y1="21" y2="19" />
                <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
                <line x1="5" x2="9" y1="14" y2="18" />
                <line x1="7" x2="4" y1="17" y2="20" />
                <line x1="3" x2="5" y1="19" y2="21" />
                </svg>`
    },
    'arkadaşlık': {
        color: 'color-green',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-handshake-icon lucide-handshake">
                <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                <path d="m21 3 1 11h-2" />
                <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                <path d="M3 4h8" />
                </svg>`
    },
    'doğa': {
        color: 'color-cyan',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-tree-palm-icon lucide-tree-palm">
                <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
                <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
                <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
                <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
                </svg>`
    }
};

// Fallback categories (if data cannot be fetched from the backend)
const fallbackCategories = [
    { id: 1, name: 'Hayvanlar', slug: 'hayvanlar' },
    { id: 2, name: 'Uzay', slug: 'uzay' },
    { id: 3, name: 'Sihir', slug: 'sihir' },
    { id: 4, name: 'Macera', slug: 'macera' },
    { id: 5, name: 'Arkadaşlık', slug: 'arkadaşlık' },
    { id: 6, name: 'Doğa', slug: 'doğa' }
];

// Show loading indicator
function showLoading() {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = `
        <div class="loading-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="loading-spinner" style="
                width: 40px; 
                height: 40px; 
                border: 4px solid #f3f3f3; 
                border-top: 4px solid #667eea; 
                border-radius: 50%; 
                animation: spin 1s linear infinite; 
                margin: 0 auto 1rem;
            "></div>
            <p style="color: #666; font-size: 1rem;">Kategoriler yükleniyor...</p>
        </div>
    `;
    
    // Add CSS animation
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show error message
function showError(message) {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = `
        <div class="error-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div style="color: #e53e3e; font-size: 1.2rem; margin-bottom: 1rem;">⚠️</div>
            <p style="color: #e53e3e; font-size: 1rem; margin-bottom: 1rem;">${message}</p>
            <button onclick="loadCategories()" style="
                background: #667eea; 
                color: white; 
                border: none; 
                padding: 0.5rem 1rem; 
                border-radius: 8px; 
                cursor: pointer;
                font-size: 0.9rem;
            ">Tekrar Dene</button>
        </div>
    `;
}

// Create a category card
function createCategoryCard(category) {
    const categorySlug = category.slug || category.name.toLowerCase();
    const config = categoryConfig[categorySlug] || {
        color: 'color-purple',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`
    };

    return `
        <a href="icerikDetaylandir.html?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}" 
           class="category-card ${config.color}" 
           data-category-id="${category.id}">
            <div class="icon-container">
                ${config.icon}
            </div>
            <span>${category.name}</span>
        </a>
    `;
}

// Fetch categories from the backend
async function fetchCategories() {
    try {
        const url = USE_PROXY ? 
            `${CORS_PROXY}${API_BASE_URL}/api/stories/categories` : 
            `${API_BASE_URL}/api/stories/categories`;
            
        console.log('📡 İstek gönderiliyor:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(USE_PROXY && { 'X-Requested-With': 'XMLHttpRequest' })
            }
        });

        console.log('📡 Response alındı:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📦 Ham veri:', data);
        
        // Gelen veri yapısını kontrol et ve kategorileri al
        let categories;
        if (data.success && Array.isArray(data.data)) {
            categories = data.data; // API'den gelen array
        } else if (data.success && data.data && Array.isArray(data.data.categories)) {
            categories = data.data.categories; // Gelen veride `data.data.categories` varsa
        } else if (Array.isArray(data)) {
            categories = data; // Dizi direkt olarak geldiyse
        }
        
        if (!categories) {
            throw new Error('Beklenmeyen veri formatı');
        }

        return categories;

    } catch (error) {
        // CORS or network error handling
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            if (DEBUG_MODE) console.log('CORS hatası veya network sorunu - fallback kategoriler kullanılacak');
        } else {
            if (DEBUG_MODE) console.error('Kategoriler alınırken hata:', error);
        }
        throw error;
    }
}

// Render categories to the page
function renderCategories(categories) {
    const categoryGrid = document.getElementById('category-grid');
    
    console.log('🎨 renderCategories çalışıyor, gelen kategoriler:', categories);
    
    if (!categories || categories.length === 0) {
        console.log('❌ Kategoriler boş veya undefined');
        showError('Kategoriler bulunamadı');
        return;
    }

    const categoryCards = categories.map(category => createCategoryCard(category)).join('');
    categoryGrid.innerHTML = categoryCards;
    
    console.log('✅ Kategoriler DOM\'a eklendi, toplam:', categories.length);

    // Add click event listener to the category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const categoryId = this.getAttribute('data-category-id');
            const categoryName = this.querySelector('span').textContent;
            
            // Save selected category to localStorage (optional)
            try {
                localStorage.setItem('selectedCategory', JSON.stringify({
                    id: categoryId,
                    name: categoryName
                }));
                // Also save id and name separately for easier access
                localStorage.setItem('selectedCategoryId', categoryId);
                localStorage.setItem('selectedCategoryName', categoryName);
            } catch (e) {
                console.log('LocalStorage kullanılamıyor, session verisi kaydedilmedi');
            }
        });
    });
}

// Main category loading function
async function loadCategories() {
    showLoading();
    
    console.log('🚀 loadCategories çalışıyor...');
    
    try {
        const categories = await fetchCategories();
        console.log('✅ Backend\'den kategoriler alındı:', categories);
        renderCategories(categories);
        if (DEBUG_MODE) console.log('✅ Kategoriler backend\'den başarıyla yüklendi');
    } catch (error) {
        console.log('⚠️ Backend\'den kategori alınamadı, fallback kullanılıyor');
        console.log('⚠️ Hata detayı:', error);
        
        // Use fallback categories in all cases
        console.log('📋 Fallback kategoriler:', fallbackCategories);
        renderCategories(fallbackCategories);
    }
}

// Check backend health (optional - might fail silently due to CORS)
async function checkBackendHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout
        
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            if (DEBUG_MODE) console.log('✅ Backend servisi çalışıyor');
            return true;
        } else {
            if (DEBUG_MODE) console.log('ℹ️  Backend servisi yanıt verdi ama sağlıklı değil');
            return false;
        }
    } catch (error) {
        // CORS error is expected, do not log as an error
        if (error.name === 'AbortError') {
            if (DEBUG_MODE) console.log('ℹ️  Backend sağlık kontrolü timeout oldu');
        } else if (error.name === 'TypeError') {
            if (DEBUG_MODE) console.log('ℹ️  Backend sağlık kontrolü CORS nedeniyle yapılamadı (normal)');
        } else {
            if (DEBUG_MODE) console.log('ℹ️  Backend sağlık kontrolü başarısız:', error.message);
        }
        return false;
    }
}

// Fetch categories when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (DEBUG_MODE) console.log('📄 Sayfa yüklendi, kategoriler getiriliyor...');
    loadCategories();
    
    // Check backend health (optional - might fail silently due to CORS)
    checkBackendHealth().then(isHealthy => {
        if (isHealthy && DEBUG_MODE) {
            console.log('✅ Backend servisi erişilebilir durumda');
        }
        // If not healthy, don't do anything, fallback categories are already loaded
    });
});

// Add global functions to the window object (for debugging)
window.loadCategories = loadCategories;
window.checkBackendHealth = checkBackendHealth;
window.testBackendConnection = testBackendConnection;


    // Kategorileri çeken ve ekrana basan kod APİ BAĞLANTISI    



// // Backend API base URL
// const API_BASE_URL = 'https://btk-proje-backend.onrender.com';

// // Kategori renk ve ikon eşleştirmeleri
// const categoryConfig = {
//     'hayvanlar': {
//         color: 'color-pink',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-cat-icon lucide-cat">
//                 <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
//                 <path d="M8 14v.5" />
//                 <path d="M16 14v.5" />
//                 <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
//                 </svg>`
//     },
//     'uzay': {
//         color: 'color-light-blue',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-rocket-icon lucide-rocket">
//                 <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
//                 <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
//                 <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
//                 <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
//                 </svg>`
//     },
//     'sihir': {
//         color: 'color-purple',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-wand-icon lucide-wand">
//                 <path d="M15 4V2" />
//                 <path d="M15 16v-2" />
//                 <path d="M8 9h2" />
//                 <path d="M20 9h2" />
//                 <path d="M17.8 11.8 19 13" />
//                 <path d="M15 9h.01" />
//                 <path d="M17.8 6.2 19 5" />
//                 <path d="m3 21 9-9" />
//                 <path d="M12.2 6.2 11 5" />
//                 </svg>`
//     },
//     'macera': {
//         color: 'color-yellow',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-swords-icon lucide-swords">
//                 <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
//                 <line x1="13" x2="19" y1="19" y2="13" />
//                 <line x1="16" x2="20" y1="16" y2="20" />
//                 <line x1="19" x2="21" y1="21" y2="19" />
//                 <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
//                 <line x1="5" x2="9" y1="14" y2="18" />
//                 <line x1="7" x2="4" y1="17" y2="20" />
//                 <line x1="3" x2="5" y1="19" y2="21" />
//                 </svg>`
//     },
//     'arkadaşlık': {
//         color: 'color-green',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-handshake-icon lucide-handshake">
//                 <path d="m11 17 2 2a1 1 0 1 0 3-3" />
//                 <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
//                 <path d="m21 3 1 11h-2" />
//                 <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
//                 <path d="M3 4h8" />
//                 </svg>`
//     },
//     'doğa': {
//         color: 'color-cyan',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-tree-palm-icon lucide-tree-palm">
//                 <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
//                 <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
//                 <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
//                 <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
//                 </svg>`
//     }
// };

// // Fallback kategoriler (backend'den veri gelemezse)
// const fallbackCategories = [
//     { id: 1, name: 'Hayvanlar', slug: 'hayvanlar' },
//     { id: 2, name: 'Uzay', slug: 'uzay' },
//     { id: 3, name: 'Sihir', slug: 'sihir' },
//     { id: 4, name: 'Macera', slug: 'macera' },
//     { id: 5, name: 'Arkadaşlık', slug: 'arkadaşlık' },
//     { id: 6, name: 'Doğa', slug: 'doğa' }
// ];

// // Loading indicator gösterme
// function showLoading() {
//     const categoryGrid = document.getElementById('category-grid');
//     categoryGrid.innerHTML = `
//         <div class="loading-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
//             <div class="loading-spinner" style="
//                 width: 40px; 
//                 height: 40px; 
//                 border: 4px solid #f3f3f3; 
//                 border-top: 4px solid #667eea; 
//                 border-radius: 50%; 
//                 animation: spin 1s linear infinite; 
//                 margin: 0 auto 1rem;
//             "></div>
//             <p style="color: #666; font-size: 1rem;">Kategoriler yükleniyor...</p>
//         </div>
//     `;
    
//     // CSS animasyonu ekle
//     if (!document.querySelector('#loading-styles')) {
//         const style = document.createElement('style');
//         style.id = 'loading-styles';
//         style.textContent = `
//             @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//             }
//         `;
//         document.head.appendChild(style);
//     }
// }

// // Hata mesajı gösterme
// function showError(message) {
//     const categoryGrid = document.getElementById('category-grid');
//     categoryGrid.innerHTML = `
//         <div class="error-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
//             <div style="color: #e53e3e; font-size: 1.2rem; margin-bottom: 1rem;">⚠️</div>
//             <p style="color: #e53e3e; font-size: 1rem; margin-bottom: 1rem;">${message}</p>
//             <button onclick="loadCategories()" style="
//                 background: #667eea; 
//                 color: white; 
//                 border: none; 
//                 padding: 0.5rem 1rem; 
//                 border-radius: 8px; 
//                 cursor: pointer;
//                 font-size: 0.9rem;
//             ">Tekrar Dene</button>
//         </div>
//     `;
// }

// // Kategori kartı oluşturma
// function createCategoryCard(category) {
//     const categorySlug = category.slug || category.name.toLowerCase();
//     const config = categoryConfig[categorySlug] || {
//         color: 'color-purple',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`
//     };

//     return `
//         <a href="icerikDetaylandir.html?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}" 
//            class="category-card ${config.color}" 
//            data-category-id="${category.id}">
//             <div class="icon-container">
//                 ${config.icon}
//             </div>
//             <span>${category.name}</span>
//         </a>
//     `;
// }

// // Backend'den kategorileri alma
// async function fetchCategories() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/stories/categories`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             mode: 'cors'
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();
        
//         // Backend response formatını kontrol et
//         if (data.success && Array.isArray(data.data)) {
//             return data.data;
//         } else if (Array.isArray(data)) {
//             return data;
//         } else {
//             throw new Error('Beklenmeyen veri formatı');
//         }
//     } catch (error) {
//         // CORS hatası veya network hatası için özel mesaj
//         if (error.name === 'TypeError' && error.message.includes('fetch')) {
//             console.log('CORS hatası veya network sorunu - fallback kategoriler kullanılacak');
//         } else {
//             console.error('Kategoriler alınırken hata:', error);
//         }
//         throw error;
//     }
// }

// // Kategorileri sayfaya render etme
// function renderCategories(categories) {
//     const categoryGrid = document.getElementById('category-grid');
    
//     if (!categories || categories.length === 0) {
//         showError('Kategoriler bulunamadı');
//         return;
//     }

//     const categoryCards = categories.map(category => createCategoryCard(category)).join('');
//     categoryGrid.innerHTML = categoryCards;

//     // Kategori seçimine tıklama event'i ekle
//     document.querySelectorAll('.category-card').forEach(card => {
//         card.addEventListener('click', function(e) {
//             const categoryId = this.getAttribute('data-category-id');
//             const categoryName = this.querySelector('span').textContent;
            
//             // Seçili kategoriyi localStorage'a kaydet (opsiyonel)
//             try {
//                 localStorage.setItem('selectedCategory', JSON.stringify({
//                     id: categoryId,
//                     name: categoryName
//                 }));
//             } catch (e) {
//                 console.log('LocalStorage kullanılamıyor, session verisi kaydedilmedi');
//             }
//         });
//     });
// }

// // Ana kategori yükleme fonksiyonu
// async function loadCategories() {
//     showLoading();
    
//     try {
//         const categories = await fetchCategories();
//         renderCategories(categories);
//         console.log('✅ Kategoriler backend\'den başarıyla yüklendi');
//     } catch (error) {
//         // CORS veya network hatası için daha sessiz handling
//         if (error.name === 'TypeError' && error.message.includes('fetch')) {
//             console.log('ℹ️  Backend\'e ulaşılamadı (CORS/Network), fallback kategoriler kullanılıyor');
//         } else {
//             console.warn('⚠️  Kategori yükleme hatası:', error.message);
//         }
        
//         // Her durumda fallback kategorileri kullan
//         renderCategories(fallbackCategories);
//     }
// }

// // Backend sağlık durumunu kontrol etme (opsiyonel - CORS nedeniyle çalışmayabilir)
// async function checkBackendHealth() {
//     try {
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 saniye timeout
        
//         const response = await fetch(`${API_BASE_URL}/health`, {
//             method: 'GET',
//             signal: controller.signal,
//             mode: 'cors'
//         });
        
//         clearTimeout(timeoutId);
        
//         if (response.ok) {
//             console.log('✅ Backend servisi çalışıyor');
//             return true;
//         } else {
//             console.log('ℹ️  Backend servisi yanıt verdi ama sağlıklı değil');
//             return false;
//         }
//     } catch (error) {
//         // CORS hatası beklenen bir durum, hata olarak loglanmasın
//         if (error.name === 'AbortError') {
//             console.log('ℹ️  Backend sağlık kontrolü timeout oldu');
//         } else if (error.name === 'TypeError') {
//             console.log('ℹ️  Backend sağlık kontrolü CORS nedeniyle yapılamadı (normal)');
//         } else {
//             console.log('ℹ️  Backend sağlık kontrolü başarısız:', error.message);
//         }
//         return false;
//     }
// }

// // Sayfa yüklendiğinde kategorileri getir
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('📄 Sayfa yüklendi, kategoriler getiriliyor...');
//     loadCategories();
    
//     // Backend sağlık durumunu kontrol et (opsiyonel - CORS nedeniyle sessizce başarısız olabilir)
//     checkBackendHealth().then(isHealthy => {
//         if (isHealthy) {
//             console.log('✅ Backend servisi erişilebilir durumda');
//         }
//         // Sağlıklı değilse bir şey yapma, zaten fallback kategoriler yüklendi
//     });
// });

// // Sayfa görünür olduğunda kategorileri yenile (opsiyonel)
// document.addEventListener('visibilitychange', function() {
//     if (!document.hidden) {
//         console.log('🔄 Sayfa tekrar görünür oldu');
//         // Sadece backend erişilebilirse yenile, yoksa mevcut kategorileri koru
//         loadCategories();
//     }
// });

// // Global fonksiyonları window objesine ekle (debugging için)
// window.loadCategories = loadCategories;
// window.checkBackendHealth = checkBackendHealth;

















//     // Kategorileri çeken ve ekrana basan kod APİ BAĞLANTISI    



// // Backend API base URL
// const API_BASE_URL = 'https://btk-proje-backend.onrender.com';

// // Kategori renk ve ikon eşleştirmeleri
// const categoryConfig = {
//     'hayvanlar': {
//         color: 'color-pink',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-cat-icon lucide-cat">
//                 <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
//                 <path d="M8 14v.5" />
//                 <path d="M16 14v.5" />
//                 <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
//                 </svg>`
//     },
//     'uzay': {
//         color: 'color-light-blue',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-rocket-icon lucide-rocket">
//                 <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
//                 <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
//                 <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
//                 <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
//                 </svg>`
//     },
//     'sihir': {
//         color: 'color-purple',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-wand-icon lucide-wand">
//                 <path d="M15 4V2" />
//                 <path d="M15 16v-2" />
//                 <path d="M8 9h2" />
//                 <path d="M20 9h2" />
//                 <path d="M17.8 11.8 19 13" />
//                 <path d="M15 9h.01" />
//                 <path d="M17.8 6.2 19 5" />
//                 <path d="m3 21 9-9" />
//                 <path d="M12.2 6.2 11 5" />
//                 </svg>`
//     },
//     'macera': {
//         color: 'color-yellow',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-swords-icon lucide-swords">
//                 <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
//                 <line x1="13" x2="19" y1="19" y2="13" />
//                 <line x1="16" x2="20" y1="16" y2="20" />
//                 <line x1="19" x2="21" y1="21" y2="19" />
//                 <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
//                 <line x1="5" x2="9" y1="14" y2="18" />
//                 <line x1="7" x2="4" y1="17" y2="20" />
//                 <line x1="3" x2="5" y1="19" y2="21" />
//                 </svg>`
//     },
//     'arkadaşlık': {
//         color: 'color-green',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-handshake-icon lucide-handshake">
//                 <path d="m11 17 2 2a1 1 0 1 0 3-3" />
//                 <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
//                 <path d="m21 3 1 11h-2" />
//                 <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
//                 <path d="M3 4h8" />
//                 </svg>`
//     },
//     'doğa': {
//         color: 'color-cyan',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
//                 stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
//                 class="lucide lucide-tree-palm-icon lucide-tree-palm">
//                 <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
//                 <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
//                 <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
//                 <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
//                 </svg>`
//     }
// };

// // Fallback kategoriler (backend'den veri gelemezse)
// const fallbackCategories = [
//     { id: 1, name: 'Hayvanlar', slug: 'hayvanlar' },
//     { id: 2, name: 'Uzay', slug: 'uzay' },
//     { id: 3, name: 'Sihir', slug: 'sihir' },
//     { id: 4, name: 'Macera', slug: 'macera' },
//     { id: 5, name: 'Arkadaşlık', slug: 'arkadaşlık' },
//     { id: 6, name: 'Doğa', slug: 'doğa' }
// ];

// // Loading indicator gösterme
// function showLoading() {
//     const categoryGrid = document.getElementById('category-grid');
//     categoryGrid.innerHTML = `
//         <div class="loading-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
//             <div class="loading-spinner" style="
//                 width: 40px; 
//                 height: 40px; 
//                 border: 4px solid #f3f3f3; 
//                 border-top: 4px solid #667eea; 
//                 border-radius: 50%; 
//                 animation: spin 1s linear infinite; 
//                 margin: 0 auto 1rem;
//             "></div>
//             <p style="color: #666; font-size: 1rem;">Kategoriler yükleniyor...</p>
//         </div>
//     `;
    
//     // CSS animasyonu ekle
//     if (!document.querySelector('#loading-styles')) {
//         const style = document.createElement('style');
//         style.id = 'loading-styles';
//         style.textContent = `
//             @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//             }
//         `;
//         document.head.appendChild(style);
//     }
// }

// // Hata mesajı gösterme
// function showError(message) {
//     const categoryGrid = document.getElementById('category-grid');
//     categoryGrid.innerHTML = `
//         <div class="error-container" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
//             <div style="color: #e53e3e; font-size: 1.2rem; margin-bottom: 1rem;">⚠️</div>
//             <p style="color: #e53e3e; font-size: 1rem; margin-bottom: 1rem;">${message}</p>
//             <button onclick="loadCategories()" style="
//                 background: #667eea; 
//                 color: white; 
//                 border: none; 
//                 padding: 0.5rem 1rem; 
//                 border-radius: 8px; 
//                 cursor: pointer;
//                 font-size: 0.9rem;
//             ">Tekrar Dene</button>
//         </div>
//     `;
// }

// // Kategori kartı oluşturma
// function createCategoryCard(category) {
//     const categorySlug = category.slug || category.name.toLowerCase();
//     const config = categoryConfig[categorySlug] || {
//         color: 'color-purple',
//         icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`
//     };

//     return `
//         <a href="icerikDetaylandir.html?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}" 
//            class="category-card ${config.color}" 
//            data-category-id="${category.id}">
//             <div class="icon-container">
//                 ${config.icon}
//             </div>
//             <span>${category.name}</span>
//         </a>
//     `;
// }

// // Backend'den kategorileri alma
// async function fetchCategories() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/api/stories/categories`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             mode: 'cors'
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();
        
//         // Backend response formatını kontrol et
//         if (data.success && Array.isArray(data.data)) {
//             return data.data;
//         } else if (Array.isArray(data)) {
//             return data;
//         } else {
//             throw new Error('Beklenmeyen veri formatı');
//         }
//     } catch (error) {
//         // CORS hatası veya network hatası için özel mesaj
//         if (error.name === 'TypeError' && error.message.includes('fetch')) {
//             console.log('CORS hatası veya network sorunu - fallback kategoriler kullanılacak');
//         } else {
//             console.error('Kategoriler alınırken hata:', error);
//         }
//         throw error;
//     }
// }

// // Kategorileri sayfaya render etme
// function renderCategories(categories) {
//     const categoryGrid = document.getElementById('category-grid');
    
//     if (!categories || categories.length === 0) {
//         showError('Kategoriler bulunamadı');
//         return;
//     }

//     const categoryCards = categories.map(category => createCategoryCard(category)).join('');
//     categoryGrid.innerHTML = categoryCards;

//     // Kategori seçimine tıklama event'i ekle
//     document.querySelectorAll('.category-card').forEach(card => {
//         card.addEventListener('click', function(e) {
//             const categoryId = this.getAttribute('data-category-id');
//             const categoryName = this.querySelector('span').textContent;
            
//             // Seçili kategoriyi localStorage'a kaydet (opsiyonel)
//             try {
//                 localStorage.setItem('selectedCategory', JSON.stringify({
//                     id: categoryId,
//                     name: categoryName
//                 }));
//             } catch (e) {
//                 console.log('LocalStorage kullanılamıyor, session verisi kaydedilmedi');
//             }
//         });
//     });
// }

// // Ana kategori yükleme fonksiyonu
// async function loadCategories() {
//     showLoading();
    
//     try {
//         const categories = await fetchCategories();
//         renderCategories(categories);
//         console.log('✅ Kategoriler backend\'den başarıyla yüklendi');
//     } catch (error) {
//         // CORS veya network hatası için daha sessiz handling
//         if (error.name === 'TypeError' && error.message.includes('fetch')) {
//             console.log('ℹ️  Backend\'e ulaşılamadı (CORS/Network), fallback kategoriler kullanılıyor');
//         } else {
//             console.warn('⚠️  Kategori yükleme hatası:', error.message);
//         }
        
//         // Her durumda fallback kategorileri kullan
//         renderCategories(fallbackCategories);
//     }
// }

// // Backend sağlık durumunu kontrol etme (opsiyonel - CORS nedeniyle çalışmayabilir)
// async function checkBackendHealth() {
//     try {
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 saniye timeout
        
//         const response = await fetch(`${API_BASE_URL}/health`, {
//             method: 'GET',
//             signal: controller.signal,
//             mode: 'cors'
//         });
        
//         clearTimeout(timeoutId);
        
//         if (response.ok) {
//             console.log('✅ Backend servisi çalışıyor');
//             return true;
//         } else {
//             console.log('ℹ️  Backend servisi yanıt verdi ama sağlıklı değil');
//             return false;
//         }
//     } catch (error) {
//         // CORS hatası beklenen bir durum, hata olarak loglanmasın
//         if (error.name === 'AbortError') {
//             console.log('ℹ️  Backend sağlık kontrolü timeout oldu');
//         } else if (error.name === 'TypeError') {
//             console.log('ℹ️  Backend sağlık kontrolü CORS nedeniyle yapılamadı (normal)');
//         } else {
//             console.log('ℹ️  Backend sağlık kontrolü başarısız:', error.message);
//         }
//         return false;
//     }
// }

// // Sayfa yüklendiğinde kategorileri getir
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('📄 Sayfa yüklendi, kategoriler getiriliyor...');
//     loadCategories();
    
//     // Backend sağlık durumunu kontrol et (opsiyonel - CORS nedeniyle sessizce başarısız olabilir)
//     checkBackendHealth().then(isHealthy => {
//         if (isHealthy) {
//             console.log('✅ Backend servisi erişilebilir durumda');
//         }
//         // Sağlıklı değilse bir şey yapma, zaten fallback kategoriler yüklendi
//     });
// });

// // Sayfa görünür olduğunda kategorileri yenile (opsiyonel)
// document.addEventListener('visibilitychange', function() {
//     if (!document.hidden) {
//         console.log('🔄 Sayfa tekrar görünür oldu');
//         // Sadece backend erişilebilirse yenile, yoksa mevcut kategorileri koru
//         loadCategories();
//     }
// });

// // Global fonksiyonları window objesine ekle (debugging için)
// window.loadCategories = loadCategories;
// window.checkBackendHealth = checkBackendHealth;