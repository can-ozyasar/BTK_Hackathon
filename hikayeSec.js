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
        const centerX = parseFloat(animal.style.left);
        const centerY = parseFloat(animal.style.top);
        const radius = Math.random() * 100 + 410;
        const speed = (Math.random() * 0.4) + 0.1;
        let angle = Math.random() * 360;

        function rotate() {
            angle += speed;
            const radians = angle * Math.PI / 180;

            const newX = centerX + radius * Math.cos(radians);
            const newY = centerY + radius * Math.sin(radians);

            animal.style.left = `${newX}px`;
            animal.style.top = `${newY}px`;
            
            requestAnimationFrame(rotate);
        }

        rotate();
    }

    // 15 adet hareketli hayvan ekle
    for (let i = 0; i < 15; i++) {
        createAnimal();
    }
    loadCategories();
});

// ===== API ENTEGRASYON KODU =====

const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// Gelişmiş kategori konfigürasyonu - herhangi bir kategori için uyumlu
const categoryConfig = {
  // === Hayvanlar/Canlılar ===
    'hayvanlar': { color: 'color-pink', icon: 'cat' },
    'hayvan': { color: 'color-pink', icon: 'cat' },
    'canlılar': { color: 'color-pink', icon: 'cat' },
    'hayvan dostları': { color: 'color-pink', icon: 'cat' },
    'sevimli hayvanlar': { color: 'color-pink', icon: 'cat' },
    'orman hayvanları': { color: 'color-pink', icon: 'cat' },
    'çiftlik hayvanları': { color: 'color-pink', icon: 'cat' },
    
    // === Uzay/Bilim ===
    'uzay': { color: 'color-light-blue', icon: 'rocket' },
    'gezegen': { color: 'color-light-blue', icon: 'rocket' },
    'astronot': { color: 'color-light-blue', icon: 'rocket' },
    'bilim': { color: 'color-light-blue', icon: 'rocket' },
    'keşif': { color: 'color-light-blue', icon: 'rocket' },
    'teknoloji': { color: 'color-light-blue', icon: 'rocket' },
    'robot': { color: 'color-light-blue', icon: 'rocket' },
    'gelecek': { color: 'color-light-blue', icon: 'rocket' },
    'uzay macerası': { color: 'color-light-blue', icon: 'rocket' },
    
    // === Sihir/Masal ===
    'sihir': { color: 'color-purple', icon: 'wand' },
    'masal': { color: 'color-purple', icon: 'wand' },
    'peri': { color: 'color-purple', icon: 'wand' },
    'büyü': { color: 'color-purple', icon: 'wand' },
    'prenses': { color: 'color-purple', icon: 'wand' },
    'prens': { color: 'color-purple', icon: 'wand' },
    'ejderha': { color: 'color-purple', icon: 'wand' },
    'şato': { color: 'color-purple', icon: 'wand' },
    'krallık': { color: 'color-purple', icon: 'wand' },
    'fantastik': { color: 'color-purple', icon: 'wand' },
    'masallar': { color: 'color-purple', icon: 'wand' },
    
    // === Macera/Aksiyon ===
    'macera': { color: 'color-yellow', icon: 'swords' },
    'kahraman': { color: 'color-yellow', icon: 'swords' },
    'cesur': { color: 'color-yellow', icon: 'swords' },
    'hazine': { color: 'color-yellow', icon: 'swords' },
    'korsan': { color: 'color-yellow', icon: 'swords' },
    'yolculuk': { color: 'color-yellow', icon: 'swords' },
    'serüven': { color: 'color-yellow', icon: 'swords' },
    'gizli ada': { color: 'color-yellow', icon: 'swords' },
    'hazine avı': { color: 'color-yellow', icon: 'swords' },
    'maceracı': { color: 'color-yellow', icon: 'swords' },
    
    // === Arkadaşlık/Dostluk ===
    'arkadaşlık': { color: 'color-green', icon: 'handshake' },
    'arkadaş': { color: 'color-green', icon: 'handshake' },
    'dostluk': { color: 'color-green', icon: 'handshake' },
    'sevgi': { color: 'color-green', icon: 'handshake' },
    'iyilik': { color: 'color-green', icon: 'handshake' },
    'yardım': { color: 'color-green', icon: 'handshake' },
    'paylaşmak': { color: 'color-green', icon: 'handshake' },
    'aile': { color: 'color-green', icon: 'handshake' },
    'kardeş': { color: 'color-green', icon: 'handshake' },
    'birlikte': { color: 'color-green', icon: 'handshake' },
    'dostlar': { color: 'color-green', icon: 'handshake' },
    
    // === Doğa/Çevre ===
    'doğa': { color: 'color-cyan', icon: 'tree-palm' },
    'orman': { color: 'color-cyan', icon: 'tree-palm' },
    'ağaç': { color: 'color-cyan', icon: 'tree-palm' },
    'çiçek': { color: 'color-cyan', icon: 'tree-palm' },
    'bahçe': { color: 'color-cyan', icon: 'tree-palm' },
    'deniz': { color: 'color-cyan', icon: 'tree-palm' },
    'nehir': { color: 'color-cyan', icon: 'tree-palm' },
    'göl': { color: 'color-cyan', icon: 'tree-palm' },
    'dağ': { color: 'color-cyan', icon: 'tree-palm' },
    'çevre': { color: 'color-cyan', icon: 'tree-palm' },
    'yeşil dünya': { color: 'color-cyan', icon: 'tree-palm' },
    'mevsimler': { color: 'color-cyan', icon: 'tree-palm' }
};

// Kategori türü tespiti için anahtar kelimeler
const categoryKeywords = {
   'color-pink': ['hayvan', 'kedi', 'köpek', 'kuş', 'balık', 'tavşan', 'ayı', 'sevimli', 'yavru', 'patili'],
    'color-light-blue': ['uzay', 'gezegen', 'yıldız', 'roket', 'astronot', 'bilim', 'keşif', 'teknoloji', 'robot'],
    'color-purple': ['sihir', 'masal', 'peri', 'büyü', 'prens', 'prenses', 'ejderha', 'şato', 'krallık', 'cadı'],
    'color-yellow': ['macera', 'kahraman', 'cesur', 'hazine', 'korsan', 'yolculuk', 'serüven', 'gizli', 'harita'],
    'color-green': ['arkadaş', 'dostluk', 'sevgi', 'iyilik', 'yardım', 'paylaşmak', 'aile', 'birlikte', 'mutlu'],
    'color-cyan': ['doğa', 'orman', 'ağaç', 'çiçek', 'bahçe', 'deniz', 'nehir', 'yeşil', 'çevre', 'mevsim']
};

// Mevcut tasarımınızdaki ikonlar
const iconTemplates = {
    'cat': `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-cat-icon lucide-cat">
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
            <path d="M8 14v.5" />
            <path d="M16 14v.5" />
            <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
            </svg>`,
    
    'rocket': `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-rocket-icon lucide-rocket">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>`,
    
    'wand': `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
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
            </svg>`,
    
    'swords': `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
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
            </svg>`,
    
    'handshake': `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-handshake-icon lucide-handshake">
            <path d="m11 17 2 2a1 1 0 1 0 3-3" />
            <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
            <path d="m21 3 1 11h-2" />
            <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
            <path d="M3 4h8" />
            </svg>`,
    
    'tree-palm': `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-tree-palm-icon lucide-tree-palm">
            <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
            <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
            <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
            <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
            </svg>`
};

// Varsayılan kategoriler (fallback) - mevcut tasarımınızla aynı
const defaultCategories = [
    { id: 1, name: 'Hayvanlar', slug: 'hayvanlar' },
    { id: 2, name: 'Uzay', slug: 'uzay' },
    { id: 3, name: 'Sihir', slug: 'sihir' },
    { id: 4, name: 'Macera', slug: 'macera' },
    { id: 5, name: 'Arkadaşlık', slug: 'arkadaşlık' },
    { id: 6, name: 'Doğa', slug: 'doğa' }
];

// Gelişmiş kategori için renk ve ikon belirleme fonksiyonu


// Gelişmiş kategori için renk ve ikon belirleme fonksiyonu
function getCategoryStyle(category, index) {
    const categoryName = (category.name || '').toLowerCase().trim();
    const categorySlug = (category.slug || '').toLowerCase().trim();
    
    // 1. Direkt eşleşme kontrolü
    let config = categoryConfig[categoryName] || categoryConfig[categorySlug];
    
    if (config) {
        if (DEBUG_MODE) console.log(`✅ Direkt eşleşme bulundu: ${categoryName} → ${config.color}`);
        return config;
    }
    
    // 2. Anahtar kelime bazlı eşleşme
    for (const [colorClass, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (categoryName.includes(keyword) || categorySlug.includes(keyword)) {
                const iconMap = {
                    'color-pink': 'cat',
                    'color-light-blue': 'rocket',
                    'color-purple': 'wand',
                    'color-yellow': 'swords',
                    'color-green': 'handshake',
                    'color-cyan': 'tree-palm'
                };
                
                config = { color: colorClass, icon: iconMap[colorClass] };
                if (DEBUG_MODE) console.log(`🔍 Anahtar kelime eşleşmesi: ${categoryName} (${keyword}) → ${config.color}`);
                return config;
            }
        }
    }
    
    // 3. Kategori içeriği analizi (daha detaylı)
    const analysisResult = analyzeCategoryContent(categoryName);
    if (analysisResult) {
        if (DEBUG_MODE) console.log(`🧠 İçerik analizi: ${categoryName} → ${analysisResult.color}`);
        return analysisResult;
    }
    
    // 4. Sıralı renk ataması (index bazlı)
    const colors = ['color-pink', 'color-light-blue', 'color-purple', 'color-yellow', 'color-green', 'color-cyan'];
    const icons = ['cat', 'rocket', 'wand', 'swords', 'handshake', 'tree-palm'];
    const selectedIndex = index % 6;
    
    config = {
        color: colors[selectedIndex],
        icon: icons[selectedIndex]
    };
    
    if (DEBUG_MODE) console.log(`🎲 Index bazlı atama: ${categoryName} → ${config.color} (index: ${selectedIndex})`);
    return config;
}

// Kategori içeriği analizi fonksiyonu
function analyzeCategoryContent(categoryName) {
   const analysisPatterns = {
    // Uzay, bilim ve keşif temaları
    'color-light-blue': [
        'uzay', 'roket', 'gezegen', 'yıldız', 'bilim', 'icat', 'deney', 
        'keşif', 'astronot', 'gökyüzü', 'teleskop', 'robot', 'teknoloji',
        'gelecek', 'fen', 'mucit'
    ],
    
    // Sihir, masal ve hayal gücü temaları
    'color-purple': [
        'sihir', 'masal', 'peri', 'büyü', 'prens', 'prenses', 'dev', 
        'cüce', 'ejderha', 'şato', 'krallık', 'sihirli', 'gizem',
        'fantastik', 'cadı', 'kahraman', 'büyücü', 
    ],
    
    // Sevimli hayvanlar ve dostları temaları
    'color-pink': [
        'hayvan', 'kedi', 'köpek', 'sevimli', 'yavru', 'tavşan', 
        'ayıcık', 'kuş', 'çiftlik', 'orman', 'patili', 'konuşan',
        'dost', 'canlılar', 'hayvan dostları', 'evcil'
    ],
    
    // Macera, kahramanlık ve heyecan temaları
    'color-yellow': [
        'macera', 'kahraman', 'cesur', 'hazine', 'gemi', 'korsan', 
        'ada', 'yolculuk', 'gizli', 'görev', 'harita', 'kaşif',
        'aksiyon', 'savaşçı', 'güçlü', 'serüven'
    ],
    
    // Arkadaşlık, aile ve duygular temaları
    'color-green': [
        'arkadaş', 'dostluk', 'sevgi', 'iyilik', 'yardım', 'paylaşmak', 
        'oyun', 'birlikte', 'aile', 'mutlu', 'kalp', 'güven',
        'kardeş', 'annelik', 'babalık', 'saygı'
    ],
    
    // Doğa, çevre ve mevsimler temaları
    'color-cyan': [
        'doğa', 'ağaç', 'çiçek', 'orman', 'deniz', 'nehir', 'bahçe', 
        'yeşil', 'yaprak', 'toprak', 'bulut', 'güneş', 'yağmur',
        'mevsim', 'çevre', 'ekoloji', 'bitki'
    ]
};
    
    for (const [colorClass, patterns] of Object.entries(analysisPatterns)) {
        for (const pattern of patterns) {
            if (categoryName.includes(pattern)) {
                const iconMap = {
                    'color-pink': 'cat',
                    'color-light-blue': 'rocket',
                    'color-purple': 'wand',
                    'color-yellow': 'swords',
                    'color-green': 'handshake',
                    'color-cyan': 'tree-palm'
                };
                
                return { color: colorClass, icon: iconMap[colorClass] };
            }
        }
    }
    
    return null;
}
// Kategori kartı oluşturma - mevcut HTML yapınızı koruyor
function createCategoryCard(category, index) {
    const style = getCategoryStyle(category, index);
    const icon = iconTemplates[style.icon] || iconTemplates['cat'];
    
    return `
        <a href="icerikDetaylandir.html?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}" 
           class="category-card ${style.color}" 
           data-category-id="${category.id}">
            <div class="icon-container">
                ${icon}
            </div>
            <span>${category.name}</span>
        </a>
    `;
}

// Loading gösterimi - mevcut tasarım stilinizle uyumlu
function showLoading() {
    const categoryGrid = document.getElementById('category-grid');
    categoryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div style="
                width: 50px; 
                height: 50px; 
                border: 3px solid rgba(255, 255, 255, 0.3); 
                border-top: 3px solid #fff; 
                border-radius: 50%; 
                animation: spin 1s linear infinite; 
                margin: 0 auto 1.5rem;
            "></div>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1rem; font-weight: 600;">
                Kategoriler yükleniyor...
            </p>
        </div>
    `;
    
    // CSS animasyonu ekle
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

// Backend'den kategorileri alma
async function fetchCategories() {
    try {
        if (DEBUG_MODE) console.log('📡 API\'den kategoriler alınıyor...');
        
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
        if (DEBUG_MODE) console.log('📦 API\'den gelen ham veri:', data);
        
        // Farklı API response formatlarını destekle
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
        if (DEBUG_MODE) console.log('⚠️ API hatası:', error.message);
        throw error;
    }
}

// Kategorileri sayfaya render etme
function renderCategories(categories) {
    const categoryGrid = document.getElementById('category-grid');
    
    if (!categories || categories.length === 0) {
        if (DEBUG_MODE) console.log('❌ Kategoriler boş, default kategoriler kullanılacak');
        categories = defaultCategories;
    }

    if (DEBUG_MODE) console.log('🎨 Kategoriler render ediliyor:', categories);

    const categoryCards = categories.map((category, index) => 
        createCategoryCard(category, index)
    ).join('');
    
    categoryGrid.innerHTML = categoryCards;

    // Kategori seçimi için event listener
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const categoryId = this.getAttribute('data-category-id');
            const categoryName = this.querySelector('span').textContent;
            
            if (DEBUG_MODE) console.log('🔄 Kategori seçildi:', { id: categoryId, name: categoryName });
            
            // LocalStorage'a kaydet (isteğe bağlı)
            try {
                localStorage.setItem('selectedCategory', JSON.stringify({
                    id: categoryId,
                    name: categoryName
                }));
                localStorage.setItem('selectedCategoryId', categoryId);
                localStorage.setItem('selectedCategoryName', categoryName);
            } catch (e) {
                if (DEBUG_MODE) console.log('ℹ️ LocalStorage kullanılamıyor');
            }
        });
    });

    if (DEBUG_MODE) console.log('✅ Kategoriler başarıyla render edildi');
}

// Ana yükleme fonksiyonu
// Ana yükleme fonksiyonu (DÜZELTİLMİŞ VERSİYON)
async function loadCategories() {
    showLoading();
    
    try {
        // Önce localStorage'dan veriyi çekmeye çalış
        const cachedCategories = localStorage.getItem('cachedCategories');
        
        if (cachedCategories) {
            // Eğer veri varsa, onu kullan
            const categories = JSON.parse(cachedCategories);
            if (DEBUG_MODE) console.log('✅ Kategoriler localStorage\'dan başarıyla yüklendi.');
            renderCategories(categories);
        } else {
            // Eğer localStorage boşsa, API'den yeni veriyi çek
            const categories = await fetchCategories();
            renderCategories(categories);
            if (DEBUG_MODE) console.log('🎉 Kategoriler API\'den başarıyla yüklendi.');
        }

    } catch (error) {
        if (DEBUG_MODE) console.error('❌ Veri yüklenirken bir hata oluştu. Varsayılan kategoriler kullanılıyor.');
        renderCategories(defaultCategories);
    }
}

// Backend sağlık kontrolü
async function checkBackendHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Sayfa yüklendiğinde kategorileri getir
document.addEventListener('DOMContentLoaded', function() {
    if (DEBUG_MODE) console.log('🚀 Sayfa yüklendi, kategoriler getiriliyor...');
    
    // Kategorileri yükle
    loadCategories();
    
    // Backend sağlık kontrolü (opsiyonel)
    if (DEBUG_MODE) {
        checkBackendHealth().then(isHealthy => {
            console.log(isHealthy ? '✅ Backend erişilebilir' : 'ℹ️ Backend erişilemez durumda');
        });
    }
});

// Test fonksiyonları (debugging için)
window.loadCategories = loadCategories;

// Gelişmiş test fonksiyonu - rastgele kategori örnekleriyle
window.testAPI = async function() {
    try {
        const categories = await fetchCategories();
        console.log('🧪 Test sonucu - Kategoriler:', categories);
        return categories;
    } catch (error) {
        console.log('🧪 Test sonucu - Hata:', error);
        return null;
    }
};

// Kategori stil testi - herhangi bir kategori ismini test edebilirsiniz
window.testCategoryStyle = function(categoryName, index = 0) {
    const mockCategory = { name: categoryName, id: 1 };
    const style = getCategoryStyle(mockCategory, index);
    console.log(`🎨 Kategori: "${categoryName}" → Renk: ${style.color}, İkon: ${style.icon}`);
    return style;
};

// Toplu test - çeşitli kategori örnekleri
window.testAllCategories = function() {
    const testCategories = [
        'Teknoloji', 'Technology', 'Bilim', 'Science',
        'Spor', 'Sports', 'Müzik', 'Music',
        'Tarih', 'History', 'Coğrafya', 'Geography',
        'Matematik', 'Math', 'Sanat', 'Art',
        'Yemek', 'Food', 'Seyahat', 'Travel',
        'Eğitim', 'Education', 'Sağlık', 'Health'
    ];
    
    console.log('🧪 Toplu kategori testi başlıyor...');
    testCategories.forEach((category, index) => {
        window.testCategoryStyle(category, index);
    });
    console.log('✅ Toplu test tamamlandı!');
};