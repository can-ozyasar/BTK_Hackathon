// ====== HİKAYE OLUŞTURMA SAYFASI JS KODU ======

// API URL'i ve Debug Modu
const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// State ve DOM Elementleri
let selectedChoices = {};
let totalQuestions = 0; // Toplam soru sayısı API'den gelecek
let currentQuestionIndex = 0;

const storyForm = document.getElementById('story-form');
const createButton = document.getElementById('createStory');
const heroNameInput = document.getElementById('heroName');
const questionContainer = document.getElementById('questions-container');

// Sayfa yüklendiğinde çalışacak ana fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    if (DEBUG_MODE) console.log('🚀 Hikaye oluşturma sayfası yüklendi.');

    // 1. LocalStorage'dan seçilen kategori bilgisini al
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
        // Kategori bulunamazsa kullanıcıyı anasayfaya yönlendir
        showError('Lütfen önce bir kategori seçin.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }

    if (DEBUG_MODE) console.log('✅ Seçilen Kategori:', selectedCategory);

    // 2. Loading ekranını göster
    showLoading();
    
    // 3. Kategoriye özel soruları backend'den çek
    fetchQuestions(selectedCategory.id);
});

// Seçilen kategoriyi LocalStorage'dan alan fonksiyon
function getSelectedCategory() {
    try {
        const categoryId = localStorage.getItem('selectedCategoryId');
        const categoryName = localStorage.getItem('selectedCategoryName');
        
        if (categoryId && categoryName) {
            return { id: categoryId, name: categoryName };
        }
    } catch (e) {
        if (DEBUG_MODE) console.error('LocalStorage okuma hatası:', e);
    }
    return null;
}

// Backend'den soruları çeken fonksiyon
async function fetchQuestions(categoryId) {
    try {
        if (DEBUG_MODE) console.log(`📡 Kategori ID'si ${categoryId} için sorular çekiliyor...`);
        
        // Doğru format
const response = await fetch(`${API_BASE_URL}/api/stories/questions/${categoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (DEBUG_MODE) console.log('📦 Gelen sorular:', data);

        const questions = data.data || []; // API cevabının formatına göre ayarlandı
        if (questions.length === 0) {
            showError('Bu kategori için soru bulunamadı.');
            return;
        }

        totalQuestions = questions.length;
        renderQuestions(questions);

    } catch (error) {
        if (DEBUG_MODE) console.error('⚠️ Soruları çekerken hata oluştu:', error);
        showError('Sorular yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    }
}

// Soruları sayfaya ekleyen fonksiyon
function renderQuestions(questions) {
    // Önce loading ekranını temizle
    questionContainer.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question${index + 1}`;

        if (index === 0) {
            questionDiv.classList.add('visible');
        }

        let optionsHtml = '';
        // API'den gelen cevap formatına göre dinamik seçenekleri oluştur
        if (Array.isArray(question.options)) {
            optionsHtml = question.options.map(option => `
                <div class="option" data-choice="${option.text}">
                    ${option.text}
                </div>
            `).join('');
        } else {
            // Alternatif bir format için
            optionsHtml = Object.values(question.options).map(option => `
                <div class="option" data-choice="${option}">
                    ${option}
                </div>
            `).join('');
        }
        
        questionDiv.innerHTML = `
            <h2>${question.text}</h2>
            <div class="options-container">
                ${optionsHtml}
            </div>
        `;
        questionContainer.appendChild(questionDiv);
    });

    // Yeni eklenen seçeneklere event listener'ları yeniden bağla
    setupEventListeners();
    checkIfComplete();
}

// Loading ekranı gösterimi
function showLoading() {
    questionContainer.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Sorular yükleniyor...</p>
        </div>
    `;
}

// Hata mesajı gösterimi
function showError(message) {
    questionContainer.innerHTML = `
        <div class="error-container">
            <p>${message}</p>
        </div>
    `;
    if (DEBUG_MODE) console.error('Hata:', message);
}

// Event listener'ları kuran fonksiyon
function setupEventListeners() {
    // Seçenekleri işle
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const questionDiv = this.closest('.question');
            const questionId = questionDiv.id;
            const choice = this.dataset.choice;

            // Aynı sorudaki diğer seçenekleri temizle
            questionDiv.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Bu seçeneği seç
            this.classList.add('selected');
            selectedChoices[questionId] = choice;
            
            // Sonraki soruyu göster
            if (currentQuestionIndex < totalQuestions - 1) {
                setTimeout(() => {
                    const nextQuestion = document.getElementById(`question${currentQuestionIndex + 2}`);
                    nextQuestion.classList.add('visible');
                    currentQuestionIndex++;
                    checkIfComplete();
                }, 500);
            } else {
                checkIfComplete();
            }
        });
    });

    // İsim input dinleyicisi
    heroNameInput.addEventListener('input', checkIfComplete);

    // Hikaye oluştur butonu
    createButton.addEventListener('click', function() {
        if (this.classList.contains('enabled')) {
            generateStory();
        } else {
            // Kullanıcıya uyarı ver
            alert('Lütfen tüm alanları doldurun.');
        }
    });
}

// Form tamamlanma kontrolü
function checkIfComplete() {
    const isNameEntered = heroNameInput.value.trim() !== '';
    const areAllQuestionsAnswered = Object.keys(selectedChoices).length === totalQuestions;
    
    if (isNameEntered && areAllQuestionsAnswered) {
        createButton.classList.add('enabled');
    } else {
        createButton.classList.remove('enabled');
    }
}

// Hikaye oluşturma fonksiyonu (bu kısım backend'e istek atacak)
function generateStory() {
    const heroName = heroNameInput.value.trim();
    const selectedCategory = getSelectedCategory();

    if (DEBUG_MODE) {
        console.log('✅ Hikaye oluşturma bilgileri hazır:');
        console.log('Kahraman Adı:', heroName);
        console.log('Seçilen Kategori:', selectedCategory.name);
        console.log('Seçilen Cevaplar:', selectedChoices);
    }

    // Backend'e POST isteği gönderebilirsiniz.
    // Örnek:
    // const payload = {
    //     heroName: heroName,
    //     categoryId: selectedCategory.id,
    //     choices: selectedChoices
    // };
    // fetch(`${API_BASE_URL}/api/story/generate`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload)
    // }).then(response => response.json())
    //   .then(data => console.log('Hikaye oluşturuldu:', data))
    //   .catch(error => console.error('Hikaye oluşturma hatası:', error));
}