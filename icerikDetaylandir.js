// icerikDetaylandir.js
// ====== HİKAYE OLUŞTURMA SAYFASI JS KODU (LOCALSTORAGE CACHE SİSTEMİ) ======

// API URL'i ve Debug Modu
const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// Cache ayarları
const CACHE_EXPIRY_HOURS = 24; // 24 saat cache süresi
const CACHE_KEY_PREFIX = 'questions_cache_';

// State ve DOM Elementleri
let selectedChoices = {};
let totalQuestions = 0;
let currentQuestionIndex = 0;
const createButton = document.getElementById('createStory');
const questionContainer = document.getElementById('questions-container');

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    if (DEBUG_MODE) console.log('🚀 Hikaye oluşturma sayfası yüklendi.');
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
        showError('Lütfen önce bir kategori seçin.');
        setTimeout(() => { window.location.href = 'index.html'; }, 3000);
        return;
    }
    if (DEBUG_MODE) console.log('✅ Seçilen Kategori:', selectedCategory);
    showLoading();
    loadQuestions(selectedCategory.id);
});

// Seçilen kategoriyi LocalStorage'dan alan fonksiyon
function getSelectedCategory() {
    try {
        const categoryId = localStorage.getItem('selectedCategoryId');
        const categoryName = localStorage.getItem('selectedCategoryName');
        return (categoryId && categoryName) ? { id: categoryId, name: categoryName } : null;
    } catch (e) {
        if (DEBUG_MODE) console.error('LocalStorage okuma hatası:', e);
        return null;
    }
}

// Cache'den veri okuma fonksiyonu
function getCachedQuestions(categoryId) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + categoryId;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (!cachedData) {
            if (DEBUG_MODE) console.log('📦 Cache\'de veri bulunamadı');
            return null;
        }
        
        const parsedData = JSON.parse(cachedData);
        const now = new Date().getTime();
        const cacheTime = parsedData.timestamp;
        const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // milliseconds
        
        // Cache süresi dolmuş mu kontrol et
        if (now - cacheTime > expiryTime) {
            if (DEBUG_MODE) console.log('⏰ Cache süresi dolmuş, siliniyor...');
            localStorage.removeItem(cacheKey);
            return null;
        }
        
        if (DEBUG_MODE) console.log('✅ Cache\'den veri okundu:', parsedData.questions.length + ' soru');
        return parsedData.questions;
        
    } catch (e) {
        if (DEBUG_MODE) console.error('Cache okuma hatası:', e);
        return null;
    }
}

// Cache'e veri yazma fonksiyonu
function setCachedQuestions(categoryId, questions) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + categoryId;
        const cacheData = {
            timestamp: new Date().getTime(),
            questions: questions,
            categoryId: categoryId
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        if (DEBUG_MODE) console.log('💾 Veriler cache\'e kaydedildi:', questions.length + ' soru');
        
    } catch (e) {
        if (DEBUG_MODE) console.error('Cache yazma hatası:', e);
        // Cache yazamazsa devam et, kritik hata değil
    }
}

// Cache temizleme fonksiyonu (isteğe bağlı)
function clearExpiredCache() {
    try {
        const keys = Object.keys(localStorage);
        const now = new Date().getTime();
        const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
        
        keys.forEach(key => {
            if (key.startsWith(CACHE_KEY_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (now - data.timestamp > expiryTime) {
                        localStorage.removeItem(key);
                        if (DEBUG_MODE) console.log('🗑️ Süresi dolmuş cache silindi:', key);
                    }
                } catch (e) {
                    // Hatalı cache verisini sil
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (e) {
        if (DEBUG_MODE) console.error('Cache temizleme hatası:', e);
    }
}

// Ana soru yükleme fonksiyonu (Cache-First yaklaşımı)
async function loadQuestions(categoryId) {
    try {
        // Önce süresi dolmuş cache'leri temizle
        clearExpiredCache();
        
        // Cache'den veri okumaya çalış
        const cachedQuestions = getCachedQuestions(categoryId);
        
        if (cachedQuestions && cachedQuestions.length > 0) {
            // Cache'de veri var, direkt kullan
            if (DEBUG_MODE) console.log('🎯 Cache\'den sorular yüklendi');
            processQuestions(cachedQuestions);
            return;
        }
        
        // Cache'de veri yok, API'den çek
        if (DEBUG_MODE) console.log('📡 Cache\'de veri yok, API\'den çekiliyor...');
        await fetchQuestionsFromAPI(categoryId);
        
    } catch (error) {
        if (DEBUG_MODE) console.error('❌ Soru yükleme hatası:', error);
        showError('Sorular yüklenirken bir sorun oluştu. Sayfa yenileniyor...');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

// Backend'den soruları çeken fonksiyon
async function fetchQuestionsFromAPI(categoryId) {
    try {
        if (DEBUG_MODE) console.log(`📡 Kategori ID'si ${categoryId} için API'den sorular çekiliyor...`);
        
        const response = await fetch(`${API_BASE_URL}/api/stories/questions/${categoryId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (DEBUG_MODE) console.log('📦 API\'den gelen sorular:', data);
        
        const questions = data.data.questions || [];
        
        if (questions.length === 0) {
            showError('Bu kategori için soru bulunamadı.');
            return;
        }
        
        // API'den gelen veriyi cache'e kaydet
        setCachedQuestions(categoryId, questions);
        
        // Soruları işle
        processQuestions(questions);
        
    } catch (error) {
        if (DEBUG_MODE) console.error('⚠️ API hatası:', error);
        
        // API hatası durumunda cache'de eski veri var mı kontrol et
        const oldCachedQuestions = getCachedQuestionsIgnoreExpiry(categoryId);
        if (oldCachedQuestions && oldCachedQuestions.length > 0) {
            if (DEBUG_MODE) console.log('🔄 API hatası, eski cache verisi kullanılıyor');
            showWarning('İnternet bağlantısı sorunlu, eski veriler gösteriliyor.');
            processQuestions(oldCachedQuestions);
            return;
        }
        
        showError('Sorular yüklenirken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin.');
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    }
}

// Süresi dolmuş olsa bile cache'den veri okuma (fallback için)
function getCachedQuestionsIgnoreExpiry(categoryId) {
    try {
        const cacheKey = CACHE_KEY_PREFIX + categoryId;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (!cachedData) return null;
        
        const parsedData = JSON.parse(cachedData);
        return parsedData.questions;
        
    } catch (e) {
        if (DEBUG_MODE) console.error('Fallback cache okuma hatası:', e);
        return null;
    }
}

// Soruları işleyen ortak fonksiyon
function processQuestions(questions) {
    totalQuestions = questions.length;
    if (DEBUG_MODE) console.log(`✅ ${totalQuestions} soru işleniyor...`);
    renderQuestions(questions);
}

// Soruları sayfaya ekleyen fonksiyon
function renderQuestions(questions) {
    questionContainer.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question${index + 1}`;
        
        // İlk soruyu görünür yap, diğerlerini gizle
        if (index === 0) {
            questionDiv.classList.add('visible');
            questionDiv.style.display = 'block';
        } else {
            questionDiv.style.display = 'none';
        }
        
        let questionContentHtml = '';
        
        // Debug için soru bilgisini logla
        if (DEBUG_MODE) console.log(`🔍 Soru ${index + 1}:`, question);
        
        if (question.type === 'textarea') {
            questionContentHtml = `
                <h2 style="color: #2d3748; font-size: 1.5em; margin-bottom: 2rem; text-align: center;">
                    ${question.question || 'Soru metni bulunamadı'}
                </h2>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <input type="text" 
                           class="name-input hero-name-input" 
                           placeholder="${question.placeholder || 'İsminizi girin'}" 
                           maxlength="20"
                           style="width: 100%; max-width: 300px; padding: 15px 20px; border: 2px solid #e2e8f0; border-radius: 25px; font-size: 1.1em; text-align: center;">
                </div>
            `;
        } else if (question.type === 'select' && Array.isArray(question.options)) {
            const optionsHtml = question.options.map(option => `
                <div class="option" 
                     data-choice="${option}"
                     style="margin-bottom: 0.3rem; width: 100%; padding: 15px 20px; border: 2px solid #e2e8f0; border-radius: 12px; background: white; cursor: pointer; transition: all 0.3s ease; text-align: center; font-weight: 500; display: flex; align-items: center; justify-content: center; min-height: 60px;">
                    ${option}
                </div>
            `).join('');
            
            questionContentHtml = `
                <h2 style="color: #2d3748; font-size: 1.5em; margin-bottom: 2rem; text-align: center;">
                    ${question.question || 'Soru metni bulunamadı'}
                </h2>
                <div class="options-container" 
                     style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 3rem;">
                    ${optionsHtml}
                </div>
            `;
        } else {
            // Bilinmeyen soru tipi için fallback
            questionContentHtml = `
                <h2 style="color: #2d3748; font-size: 1.5em; margin-bottom: 2rem; text-align: center;">
                    ${question.question || 'Soru metni bulunamadı'}
                </h2>
                <p style="text-align: center; color: #666;">
                    Bu soru tipi desteklenmiyor: ${question.type}
                </p>
            `;
        }
        
        questionDiv.innerHTML = questionContentHtml;
        questionContainer.appendChild(questionDiv);
        
        // Debug için element kontrolü
        if (DEBUG_MODE) {
            console.log(`✅ Soru ${index + 1} DOM'a eklendi:`, questionDiv);
        }
    });

    // DOM güncellemesi tamamlandıktan sonra event listener'ları kur
    setTimeout(() => {
        setupEventListeners();
        checkIfComplete();
        if (DEBUG_MODE) console.log('🎯 Tüm sorular render edildi ve event listener\'lar kuruldu');
    }, 100);
}

// Loading ekranı gösterimi
function showLoading() {
    questionContainer.innerHTML = `
        <div class="loading-container" style="text-align: center; padding: 40px;">
            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="color: #666; font-size: 1.2em;">Sorular yükleniyor...</p>
        </div>
    `;
}

// Hata mesajı gösterimi
function showError(message) {
    questionContainer.innerHTML = `
        <div class="error-container" style="text-align: center; padding: 40px; color: #e53e3e;">
            <p style="font-size: 1.2em;">${message}</p>
            <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                Sayfayı Yenile
            </button>
        </div>
    `;
    if (DEBUG_MODE) console.error('Hata:', message);
}

// Uyarı mesajı gösterimi
function showWarning(message) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fbbf24;
        color: #92400e;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
        font-size: 14px;
    `;
    warningDiv.textContent = message;
    document.body.appendChild(warningDiv);
    
    // 5 saniye sonra uyarıyı kaldır
    setTimeout(() => {
        if (warningDiv.parentNode) {
            warningDiv.parentNode.removeChild(warningDiv);
        }
    }, 5000);
}

// Event listener'ları kuran fonksiyon
function setupEventListeners() {
    const options = document.querySelectorAll('.option');
    if (DEBUG_MODE) console.log(`🎯 ${options.length} seçenek bulundu`);
    
    options.forEach((option, index) => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (DEBUG_MODE) console.log('🖱️ Seçenek tıklandı:', this.textContent);
            
            const questionDiv = this.closest('.question');
            const questionId = questionDiv.id;
            const choice = this.dataset.choice;
            
            // Diğer seçeneklerin seçimini kaldır
            questionDiv.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
                opt.style.background = 'white';
                opt.style.color = '#333';
                opt.style.borderColor = '#e2e8f0';
            });
            
            // Bu seçeneği seçili yap
            this.classList.add('selected');
            this.style.background = '#667eea';
            this.style.color = 'white';
            this.style.borderColor = '#667eea';
            
            selectedChoices[questionId] = choice;
            
            if (DEBUG_MODE) console.log('✅ Seçim kaydedildi:', { questionId, choice });

            setTimeout(() => {
                showNextQuestion();
                checkIfComplete();
            }, 300);
        });
        
        // Hover efektleri
        option.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.borderColor = '#667eea';
                this.style.background = '#f7fafc';
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        option.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.borderColor = '#e2e8f0';
                this.style.background = 'white';
                this.style.transform = 'translateY(0)';
            }
        });
    });

    const heroNameInput = document.querySelector('.hero-name-input');
    if (heroNameInput) {
        if (DEBUG_MODE) console.log('📝 İsim input alanı bulundu');
        
        heroNameInput.addEventListener('input', function() {
            const questionDiv = this.closest('.question');
            const questionId = questionDiv.id;
            const inputValue = this.value.trim();
            
            selectedChoices[questionId] = inputValue;
            
            if (DEBUG_MODE) console.log('✏️ İsim güncellendi:', { questionId, value: inputValue });

            if (inputValue !== '') {
                setTimeout(() => {
                    showNextQuestion();
                    checkIfComplete();
                }, 500);
            }
        });
        
        // Focus efektleri
        heroNameInput.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 5px rgba(102, 126, 234, 0.1)';
            this.style.transform = 'scale(1.03)';
        });
        
        heroNameInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
            this.style.transform = 'scale(1)';
        });
    }

    createButton.addEventListener('click', function() {
        if (this.classList.contains('enabled')) {
            generateStory();
        } else {
            alert('Lütfen tüm alanları doldurun.');
        }
    });
}

// Bir sonraki soruyu göstermek için fonksiyon
function showNextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
        const nextQuestion = document.getElementById(`question${currentQuestionIndex + 2}`);
        if (nextQuestion) {
            if (DEBUG_MODE) console.log(`👁️ Sonraki soru gösteriliyor: question${currentQuestionIndex + 2}`);
            
            setTimeout(() => {
                nextQuestion.style.display = 'block';
                nextQuestion.classList.add('visible');
                currentQuestionIndex++;
                
                // Smooth scroll to next question
                nextQuestion.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                checkIfComplete();
            }, 500);
        }
    }
}

// Form tamamlanma kontrolü
function checkIfComplete() {
    const completedAnswers = Object.keys(selectedChoices).length;
    const allAnswersValid = Object.values(selectedChoices).every(answer => 
        answer !== null && answer !== undefined && answer.toString().trim() !== ''
    );
    
    if (DEBUG_MODE) {
        console.log('🔍 Tamamlanma kontrolü:', {
            completedAnswers,
            totalQuestions,
            allAnswersValid,
            selectedChoices
        });
    }
    
    if (completedAnswers === totalQuestions && allAnswersValid) {
        createButton.classList.add('enabled');
        createButton.style.opacity = '1';
        createButton.style.pointerEvents = 'auto';
        if (DEBUG_MODE) console.log('✅ Tüm sorular tamamlandı, buton aktif edildi');
    } else {
        createButton.classList.remove('enabled');
        createButton.style.opacity = '0.5';
        createButton.style.pointerEvents = 'none';
    }
}

// Hikaye oluşturma fonksiyonu
async function generateStory() {
    if (DEBUG_MODE) console.log('📖 Hikaye oluşturma başlatılıyor...');
    
    const finalAnswers = { ...selectedChoices };
    
    localStorage.setItem('storyCreationAnswers', JSON.stringify(finalAnswers));
    if (DEBUG_MODE) console.log('✅ Cevaplar localStorage\'a kaydedildi:', finalAnswers);

    window.location.href = 'loading.html';
}

// Cache yönetimi için ek fonksiyonlar
window.clearQuestionsCache = function() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(CACHE_KEY_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        console.log('🗑️ Tüm sorular cache\'i temizlendi');
        window.location.reload();
    } catch (e) {
        console.error('Cache temizleme hatası:', e);
    }
};

// CSS animasyonu ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .question {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
    }
    
    .question.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 600px) {
        .options-container {
            grid-template-columns: 1fr !important;
        }
    }
`;
document.head.appendChild(style);