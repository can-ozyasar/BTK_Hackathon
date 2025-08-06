

const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// Mevcut kategori klasörleri
const AVAILABLE_CATEGORIES = ['aile', 'buyulu', 'dostluk', 'hayvanlar', 'macera', 'okul', 'uzay', 'diger'];

// Gelişmiş kategori eşleme sistemi
const CATEGORY_MAPPING = {
    'aile': {
        priority: 10,
        keywords: ['aile', 'family', 'anne', 'baba', 'mom', 'dad', 'kardeş', 'sister', 'brother', 'akraba', 'relative', 'büyükanne', 'büyükbaba', 'teyze', 'amca', 'dayı', 'hala', 'çocuk', 'evlat', 'oğul', 'kız', 'ev', 'home', 'yuva'],
        fallbacks: ['dostluk', 'diger']
    },
    'buyulu': {
        priority: 10,
        keywords: ['büyülü', 'magic', 'magical', 'sihirli', 'peri', 'fairy', 'ejder', 'dragon', 'canavar', 'monster', 'cadı', 'witch', 'büyücü', 'wizard', 'sihir', 'fantastik', 'fantasy', 'mitoloji', 'efsane', 'legend', 'masai', 'tale', 'peri masalı', 'unicorn', 'tek boynuzlu at', 'phoenix', 'anka kuşu', 'büyü', 'spell'],
        fallbacks: ['macera', 'diger']
    },
    'dostluk': {
        priority: 10,
        keywords: ['dostluk', 'friendship', 'arkadaş', 'friend', 'dost', 'buddy', 'arkadaşlık', 'beraber', 'together', 'birlikte', 'paylaşmak', 'share', 'yardım', 'help', 'destek', 'support', 'sevgi', 'love', 'güven', 'trust', 'sadakat', 'loyalty'],
        fallbacks: ['aile', 'diger']
    },
    'hayvanlar': {
        priority: 10,
        keywords: ['hayvan', 'animal', 'kedi', 'cat', 'köpek', 'dog', 'tavşan', 'rabbit', 'ayı', 'bear', 'tilki', 'fox', 'panda', 'hamster', 'kuş', 'bird', 'balık', 'fish', 'aslan', 'lion', 'kaplan', 'tiger', 'fil', 'elephant', 'zürafa', 'giraffe', 'maymun', 'monkey', 'kaplumbağa', 'turtle', 'yılan', 'snake', 'kartal', 'eagle', 'papağan', 'parrot', 'at', 'horse', 'inek', 'cow', 'koyun', 'sheep', 'keçi', 'goat', 'tavuk', 'chicken', 'ördek', 'duck', 'kaz', 'goose', 'penguen', 'penguin', 'balina', 'whale', 'yunus', 'dolphin', 'köpekbalığı', 'shark', 'ahtapot', 'octopus', 'kelebek', 'butterfly', 'arı', 'bee', 'karınca', 'ant', 'böcek', 'insect', 'örümcek', 'spider', 'safari', 'zoo', 'orman', 'forest', 'çiftlik', 'farm', 'pet', 'evcil'],
        fallbacks: ['macera', 'dostluk', 'diger']
    },
    'macera': {
        priority: 10,
        keywords: ['macera', 'adventure', 'keşif', 'exploration', 'korsan', 'pirate', 'hazine', 'treasure', 'orman', 'forest', 'dağ', 'mountain', 'deniz', 'sea', 'okyanus', 'ocean', 'ada', 'island', 'mağara', 'cave', 'yolculuk', 'journey', 'seyahat', 'travel', 'kaşif', 'explorer', 'gemi', 'ship', 'tekne', 'boat', 'harita', 'map', 'pusula', 'compass', 'kamp', 'camping', 'doğa', 'nature', 'vahşi', 'wild', 'safari', 'jungle', 'çöl', 'desert', 'kutup', 'polar', 'buzul', 'glacier', 'volkan', 'volcano', 'nehir', 'river', 'göl', 'lake', 'şelale', 'waterfall', 'uçurum', 'cliff', 'kayık', 'canoe', 'raft', 'sal'],
        fallbacks: ['uzay', 'hayvanlar', 'diger']
    },
    'okul': {
        priority: 10,
        keywords: ['okul', 'school', 'öğrenci', 'student', 'öğretmen', 'teacher', 'sınıf', 'classroom', 'ders', 'lesson', 'kitap', 'book', 'kalem', 'pen', 'defter', 'notebook', 'sıra', 'desk', 'tahta', 'board', 'matematik', 'math', 'türkçe', 'turkish', 'fen', 'science', 'tarih', 'history', 'coğrafya', 'geography', 'sanat', 'art', 'müzik', 'music', 'beden', 'physical education', 'teneffüs', 'break', 'kantit', 'canteen', 'kütüphane', 'library', 'laboratuvar', 'laboratory', 'spor', 'sports', 'futbol', 'football', 'basketbol', 'basketball', 'voleybol', 'volleyball', 'koşu', 'running', 'yarış', 'race', 'olimpiyat', 'olympics', 'mezuniyet', 'graduation', 'diploma', 'sertifika', 'certificate', 'not', 'grade', 'sınav', 'exam', 'test', 'ödev', 'homework', 'proje', 'project'],
        fallbacks: ['dostluk', 'diger']
    },
    'uzay': {
        priority: 10,
        keywords: ['uzay', 'space', 'mekik', 'shuttle', 'dünya', 'earth', 'gezegen', 'planet', 'roket', 'rocket', 'astronot', 'astronaut', 'ay', 'moon', 'güneş', 'sun', 'yıldız', 'star', 'samanyolu', 'milky way', 'galaksi', 'galaxy', 'mars', 'venus', 'jüpiter', 'jupiter', 'satürn', 'saturn', 'neptün', 'neptune', 'uranüs', 'uranus', 'plüton', 'pluto', 'merkür', 'mercury', 'meteor', 'asteroid', 'kuyruklu yıldız', 'comet', 'ufo', 'uzaylı', 'alien', 'iss', 'uzay istasyonu', 'space station', 'satelit', 'satellite', 'teleskop', 'telescope', 'nasa', 'cosmos', 'evren', 'universe', 'kara delik', 'black hole', 'nebula', 'galaksi', 'solar system', 'güneş sistemi', 'aya yolculuk', 'moon landing', 'mars keşfi', 'mars exploration'],
        fallbacks: ['macera', 'buyulu', 'diger']
    }
};



// Türkçe karakter dönüşüm tablosu
const TURKISH_CHAR_MAP = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
};

document.addEventListener('DOMContentLoaded', () => {
    const animalContainer = document.getElementById('animal-container');
    const animals = ['🐱', '🐶', '🐰', '🐼', '🦊', '🐻', '🐹', '🦁', '🐯', '🐸', '🐙', '🦋', '🐦', '🐧', '🦆', '🐢'];

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

    // Daha fazla hayvan oluştur
    for (let i = 0; i < 15; i++) {
        createAnimal();
    }


    /**
     * Metni normalize eden fonksiyon (küçük harf, Türkçe karakter dönüşümü)
     */
    function normalizeText(text) {
        if (!text) return '';
        let normalized = text.toLowerCase().trim();
        // Türkçe karakterleri dönüştür
        for (const [turkish, latin] of Object.entries(TURKISH_CHAR_MAP)) {
            normalized = normalized.replace(new RegExp(turkish, 'g'), latin);
        }
        return normalized;
    }

    /**
     * İki metin arasındaki benzerlik skorunu hesaplar (Levenshtein distance tabanlı)
     */
    function calculateSimilarity(str1, str2) {
        const s1 = normalizeText(str1);
        const s2 = normalizeText(str2);

        if (s1 === s2) return 1.0;
        if (s1.length === 0 || s2.length === 0) return 0.0;

        // Substring kontrolü
        if (s1.includes(s2) || s2.includes(s1)) {
            return 0.8;
        }

        // Word-based similarity
        const words1 = s1.split(/\s+/);
        const words2 = s2.split(/\s+/);

        let commonWords = 0;
        for (const word1 of words1) {
            for (const word2 of words2) {
                if (word1 === word2 && word1.length > 2) { // 2 karakterden uzun kelimeler
                    commonWords++;
                }
            }
        }

        if (commonWords > 0) {
            return commonWords / Math.max(words1.length, words2.length);
        }

        return 0.0;
    }

    /**
     * Akıllı kategori eşleme fonksiyonu
     */
    function findBestCategoryMatch(categoryName, storyContent = '') {
        if (DEBUG_MODE) console.log('🔍 Kategori eşleme başlatılıyor:', { categoryName, storyContent: storyContent.substring(0, 100) + '...' });

        const normalizedCategory = normalizeText(categoryName);
        const normalizedContent = normalizeText(storyContent);
        const combinedText = `${normalizedCategory} ${normalizedContent}`;

        // Önce tam eşleşme kontrol et
        if (AVAILABLE_CATEGORIES.includes(normalizedCategory)) {
            if (DEBUG_MODE) console.log('✅ Tam kategori eşleşmesi bulundu:', normalizedCategory);
            return normalizedCategory;
        }

        // Kategori skorlarını hesapla
        const categoryScores = {};

        for (const [category, config] of Object.entries(CATEGORY_MAPPING)) {
            let score = 0;
            let matchDetails = [];

            // Anahtar kelime eşleşmelerini kontrol et
            for (const keyword of config.keywords) {
                const keywordSimilarity = calculateSimilarity(keyword, normalizedCategory);
                if (keywordSimilarity > 0.7) {
                    score += keywordSimilarity * config.priority;
                    matchDetails.push(`${keyword}(${keywordSimilarity.toFixed(2)})`);
                }

                // Hikaye içeriğinde de ara
                if (normalizedContent && normalizedContent.includes(normalizeText(keyword))) {
                    score += 0.5 * config.priority;
                    matchDetails.push(`content:${keyword}(0.5)`);
                }
            }

            // Direkt substring eşleşmesi
            for (const keyword of config.keywords) {
                if (combinedText.includes(normalizeText(keyword))) {
                    score += 1.0 * config.priority;
                    matchDetails.push(`substring:${keyword}(1.0)`);
                }
            }

            categoryScores[category] = { score, matchDetails };

            if (DEBUG_MODE && score > 0) {
                console.log(`📊 ${category}: ${score.toFixed(2)} [${matchDetails.join(', ')}]`);
            }
        }

        // En yüksek skora sahip kategoriyi bul
        let bestCategory = 'diger';
        let highestScore = 0;

        for (const [category, data] of Object.entries(categoryScores)) {
            if (data.score > highestScore) {
                highestScore = data.score;
                bestCategory = category;
            }
        }

        // Eğer hiç eşleşme yoksa fallback kategorileri dene
        if (highestScore === 0) {
            if (DEBUG_MODE) console.log('⚠️ Direkt eşleşme bulunamadı, fallback kategoriler deneniyor...');

            // En yakın string similarity'e göre kategoriye bak
            let bestSimilarity = 0;
            for (const availableCategory of AVAILABLE_CATEGORIES) {
                const similarity = calculateSimilarity(availableCategory, normalizedCategory);
                if (similarity > bestSimilarity && similarity > 0.3) {
                    bestSimilarity = similarity;
                    bestCategory = availableCategory;
                }
            }
        }

        if (DEBUG_MODE) {
            console.log(`✅ En iyi kategori eşleşmesi: ${bestCategory} (skor: ${highestScore.toFixed(2)})`);
        }

        return bestCategory;
    }

    /**
     * Hikaye için arkaplan resmi atar
     */
    function assignBackgroundImageToStory(storyData, categoryName, storyContent = '') {
        if (DEBUG_MODE) console.log('🖼️ Hikayeye kategoriye özel arkaplan resmi atanıyor...');

        const selectedCategory = findBestCategoryMatch(categoryName, storyContent);
        const imagePath = `resimler/${selectedCategory}/background.jpg`;

        storyData.backgroundImage = imagePath;
        storyData.detectedCategory = selectedCategory;
        storyData.originalCategory = categoryName;

        if (DEBUG_MODE) {
            console.log('🎨 Arkaplan resmi atandı:', {
                originalCategory: categoryName,
                detectedCategory: selectedCategory,
                imagePath: imagePath
            });
        }

        return storyData;
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
                    sections: sections,
                    createdAt: new Date().toISOString(),
                    metadata: {
                        originalCategoryId: categoryId,
                        originalCategoryName: categoryName,
                        answersCount: Object.keys(answers).length
                    }
                };

                // Gelişmiş kategori eşleme ile arkaplan resmi ata
                const finalStoryDataWithImage = assignBackgroundImageToStory(
                    finalStoryData,
                    categoryName,
                    result.data.story
                );

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
     */
    function parseStoryText(storyText) {
        const sections = [];

        // Metni farklı ayırıcılarla böl
        let pages = [];

        if (storyText.includes('\n\n')) {
            pages = storyText.split('\n\n').map(page => page.trim()).filter(Boolean);
        }
        // Sonra tek yeni satır ile dene
        else if (storyText.includes('\n')) {
            pages = storyText.split('\n').map(page => page.trim()).filter(Boolean);
        }
        // Son olarak nokta ile böl (uzun paragraflar için)
        else {
            pages = storyText.split('. ').map(page => page.trim()).filter(Boolean);
        }

        if (DEBUG_MODE) {
            console.log('📄 Hikaye bölümlere ayrıldı:', {
                originalLength: storyText.length,
                sectionsCount: pages.length,
                sections: pages.map((p, i) => `${i + 1}: ${p.substring(0, 50)}...`)
            });
        }

        pages.forEach((page, index) => {
            if (page && page.length > 10) { // Çok kısa bölümleri atla
                sections.push({
                    text: page,
                    image: '',
                    pageNumber: index + 1
                });
            }
        });

        // Eğer hiç bölüm yoksa, tüm metni tek bölüm yap
        if (sections.length === 0) {
            sections.push({
                text: storyText,
                image: '',
                pageNumber: 1
            });
        }

        return sections;
    }

    async function startLoadingProcess() {
        const storyId = await createAndCacheStory();

        const minimumWaitTime = 3000; // Biraz daha uzun bekleme süresi
        const startTime = Date.now();

        // Loading mesajı göster
        const loadingMessages = [
            'Hikaye oluşturuluyor...',
            'Karakterler canlanıyor...',
            'Macera başlıyor...',
            'Son dokunuşlar yapılıyor...'
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            const messageElement = document.querySelector('.loading-message');
            if (messageElement && messageIndex < loadingMessages.length) {
                messageElement.textContent = loadingMessages[messageIndex];
                messageIndex++;
            }
        }, 750);

        const elapsedTime = Date.now() - startTime;
        const remainingTime = minimumWaitTime - elapsedTime;

        setTimeout(() => {
            clearInterval(messageInterval);
            if (storyId) {
                window.location.href = `hikayeOku.html?storyId=${storyId}`;
            } else {
                alert('Hikaye oluşturulurken bir hata oluştu. Ana sayfaya yönlendiriliyorsunuz.');
                window.location.href = `index.html`;
            }
        }, remainingTime > 0 ? remainingTime : 0);
    }

    startLoadingProcess();
});