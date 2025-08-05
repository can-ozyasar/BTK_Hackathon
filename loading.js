// icerikDetaylandir.js
// ====== HİKAYE OLUŞTURMA SAYFASI JS KODU (GÜNCELLENMİŞ) ======

const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

document.addEventListener('DOMContentLoaded', () => {
    const animalContainer = document.getElementById('animal-container');
    const animals = ['🐱', '🐶', '🐰', '🐼', '🦊', '🐻', '🐹'];
    const availableCategories = ['aile', 'buyulu', 'diger', 'dostluk', 'hayvanlar', 'macera', 'okul', 'uzay'];

    // Hayvanları kenarlardan oluşturan fonksiyon
    function createAnimal() {
        const animal = document.createElement('div');
        animal.classList.add('moving-animal');
        animal.textContent = animals[Math.floor(Math.random() * animals.length)];
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0:
                animal.style.left = `${Math.random() * 100}vw`;
                animal.style.top = `-10vh`;
                break;
            case 1:
                animal.style.left = `110vw`;
                animal.style.top = `${Math.random() * 100}vh`;
                break;
            case 2:
                animal.style.left = `${Math.random() * 100}vw`;
                animal.style.top = `110vh`;
                break;
            case 3:
                animal.style.left = `-10vw`;
                animal.style.top = `${Math.random() * 100}vh`;
                break;
        }
        animalContainer.appendChild(animal);
        animateAnimalRotation(animal);
    }

    // Hayvanları ortada dönen daire etrafında hareket ettiren fonksiyon
    function animateAnimalRotation(animal) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.random() * 190 + 290;
        const speed = (Math.random() * 0.005) + 0.005;
        let angle = Math.random() * 2 * Math.PI;

        function rotate() {
            angle += speed;
            const newX = centerX + radius * Math.cos(angle);
            const newY = centerY + radius * Math.sin(angle);
            animal.style.left = `${newX}px`;
            animal.style.top = `${newY}px`;
            requestAnimationFrame(rotate);
        }
        rotate();
    }

    for (let i = 0; i < 10; i++) {
        createAnimal();
    }

    // --- API entegrasyonu ve yönlendirme mantığı ---

    async function createAndCacheStory() {
        let answers = {};
        let categoryId = null;
        let categoryName = null;

        try {
            const cachedAnswers = localStorage.getItem('storyCreationAnswers');
            const cachedCategoryId = localStorage.getItem('selectedCategoryId');
            const cachedCategoryName = localStorage.getItem('selectedCategoryName');

            if (cachedAnswers && cachedCategoryId && cachedCategoryName) {
                answers = JSON.parse(cachedAnswers);
                categoryId = cachedCategoryId;
                categoryName = cachedCategoryName;
                if (DEBUG_MODE) console.log('✅ localStorage\'dan gelen veriler:', { answers, categoryId, categoryName });
            } else {
                throw new Error('Gerekli veriler localStorage\'da bulunamadı.');
            }
        } catch (e) {
            if (DEBUG_MODE) console.error('⚠️ Veriler okunurken hata oluştu:', e);
            return null;
        }

        const storyCreationData = {
            "categoryId": categoryId,
            "answers": answers,
            "categoryName": categoryName
        };

        try {
            if (DEBUG_MODE) console.log('📡 Hikaye oluşturma API\'sine POST isteği gönderiliyor...', storyCreationData);
            
            const response = await fetch(`${API_BASE_URL}/api/stories/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(storyCreationData),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            if (DEBUG_MODE) {
                console.log('📦 API\'den Gelen Ham Hikaye Metni:', result.data.story);
            }
            if (DEBUG_MODE) console.log('📦 API Yanıtı (JSON):', result);
            
            if (result && result.data && result.data.story) {
                const storyId = `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const sections = parseStoryText(result.data.story);

                // Eğer bölümler boşsa, bir hata fırlat
                if (sections.length === 0) {
                    throw new Error('API\'den gelen hikaye metni düzgün bölümlere ayrılamadı. Lütfen metin formatını kontrol edin.');
                }
                
                const storyTitle = `${categoryName} Hikayesi`;
                const summary = sections[0] ? sections[0].text.trim() : storyTitle;

                const finalStoryData = {
                    storyId: storyId,
                    title: storyTitle,
                    summary: summary,
                    sections: sections
                };
                
                const finalStoryDataWithImage = assignBackgroundImageToStory(finalStoryData, categoryName, availableCategories);

                localStorage.setItem(`story-${storyId}`, JSON.stringify(finalStoryDataWithImage));
                if (DEBUG_MODE) console.log('✅ Yeni hikaye verisi localStorage\'a kaydedildi:', storyId);
                return storyId;
            } else {
                throw new Error('API\'den beklenen hikaye verisi gelmedi.');
            }

        } catch (error) {
            if (DEBUG_MODE) console.error('❌ Hikaye oluşturma hatası:', error);
            return null;
        }
    }

    /**
     * API'den gelen tek parça metni, sayfa numaralarına göre bölümlere ayırır.
     * @param {string} storyText API'den gelen hikaye metni.
     * @returns {Array<object>} Her bölüm için {text: "...", image: "..."} içeren bir dizi.
     */
    function parseStoryText(storyText) {
        const sections = [];
        // Metni çift yeni satır karakteriyle böl.
        const pages = storyText.split('\n\n').map(page => page.trim()).filter(Boolean);
        
        if (DEBUG_MODE) {
            console.log('Parsed Pages:', pages);
        }

        pages.forEach((page, index) => {
            if (page) { // Boş stringleri atla
                sections.push({
                    text: page,
                    image: '' 
                });
            }
        });
        return sections;
    }

    /**
     * Gelen kategori adını anahtar kelimelerle kontrol eder ve arkaplan resmi atar.
     * @param {object} storyData API'den gelen hikaye nesnesi.
     * @param {string} categoryName API'den gelen hikaye kategori adı.
     * @param {Array<string>} availableCategories Resim klasörlerinin listesi.
     * @returns {object} Arkaplan resmi URL'si eklenmiş hikaye nesnesi.
     */
    function assignBackgroundImageToStory(storyData, categoryName, availableCategories) {
        if (DEBUG_MODE) console.log('🖼️ Hikayeye kategoriye özel arkaplan resmi atanıyor...');
        
        let selectedCategory = 'diger'; // Varsayılan olarak "diger"
        const normalizedCategoryName = categoryName.toLowerCase();

        const categoryKeywords = {
            'uzay': ['uzay', 'mekik', 'dünya', 'gezegen', 'roket', 'astronot'],
            'hayvanlar': ['hayvan', 'kedi', 'köpek', 'tavşan', 'ayı', 'tilki', 'panda', 'hamster'],
            'dostluk': ['dostluk', 'arkadaş', 'dost'],
            'macera': ['macera', 'keşif', 'korsan', 'hazine', 'orman', 'dağ'],
            'buyulu': ['büyülü', 'sihirli', 'peri', 'ejderha', 'canavar', 'cadı'],
            'okul': ['okul', 'öğrenci', 'öğretmen', 'sınıf', 'ders'],
            'aile': ['aile', 'anne', 'baba', 'kardeş', 'akraba']
        };

        for (const category in categoryKeywords) {
            const hasKeyword = categoryKeywords[category].some(keyword => normalizedCategoryName.includes(keyword));
            if (hasKeyword) {
                selectedCategory = category;
                if (DEBUG_MODE) console.log(`✅ Anahtar kelime eşleşmesi bulundu: "${normalizedCategoryName}" kelimesi "${category}" kategorisi ile ilgili.`);
                break;
            }
        }
        
        if (selectedCategory === 'diger') {
            if (availableCategories.includes(normalizedCategoryName)) {
                selectedCategory = normalizedCategoryName;
                if (DEBUG_MODE) console.log(`✅ Tam kategori adı eşleşmesi bulundu: ${normalizedCategoryName}`);
            } else {
                if (DEBUG_MODE) console.warn(`⚠️ Kategori eşleşmesi bulunamadı: ${normalizedCategoryName}. "diger" kategorisi kullanılıyor.`);
            }
        }
        
        const imagePath = `resimler/${selectedCategory}/background.jpg`;
        
        storyData.backgroundImage = imagePath;
        
        return storyData;
    }
    
    async function startLoadingProcess() {
        const storyId = await createAndCacheStory();

        const minimumWaitTime = 2000;
        const startTime = Date.now();
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minimumWaitTime - elapsedTime;

        if (storyId) {
            setTimeout(() => {
                window.location.href = `hikayeOku.html?storyId=${storyId}`;
            }, remainingTime > 0 ? remainingTime : 0);
        } else {
            setTimeout(() => {
                window.location.href = `index.html`;
            }, remainingTime > 0 ? remainingTime : 0);
        }
    }

    startLoadingProcess();
});