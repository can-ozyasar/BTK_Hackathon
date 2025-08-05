// icerikDetaylandir.js
// ====== HİKAYE OLUŞTURMA SAYFASI JS KODU (GÜNCELLENMİŞ) ======

// API URL'i ve Debug Modu
const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
const DEBUG_MODE = true;

// State ve DOM Elementleri
let selectedChoices = {};
let totalQuestions = 0; // Toplam soru sayısı API'den gelecek
let currentQuestionIndex = 0; // Soruları izlemek için yeni bir indeks
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
    fetchQuestions(selectedCategory.id);
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

// Backend'den soruları çeken fonksiyon
async function fetchQuestions(categoryId) {
    try {
        if (DEBUG_MODE) console.log(`📡 Kategori ID'si ${categoryId} için sorular çekiliyor...`);
        const response = await fetch(`${API_BASE_URL}/api/stories/questions/${categoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (DEBUG_MODE) console.log('📦 Gelen sorular:', data);
        const questions = data.data.questions || [];
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
    questionContainer.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.id = `question${index + 1}`;
        if (index === 0) {
            questionDiv.classList.add('visible');
        }
        
        let questionContentHtml = '';
        if (question.type === 'textarea') {
            questionContentHtml = `
                <h2>${question.question}</h2>
                <input type="text" class="name-input hero-name-input" placeholder="${question.placeholder}" maxlength="20">
            `;
        } else if (question.type === 'select' && Array.isArray(question.options)) {
            const optionsHtml = question.options.map(option => `
                <div class="option" data-choice="${option}">
                    ${option}
                </div>
            `).join('');
            questionContentHtml = `
                <h2>${question.question}</h2>
                <div class="options-container">
                    ${optionsHtml}
                </div>
            `;
        }
        
        questionDiv.innerHTML = questionContentHtml;
        questionContainer.appendChild(questionDiv);
    });

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
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const questionDiv = this.closest('.question');
            const questionId = questionDiv.id;
            const choice = this.dataset.choice;
            
            questionDiv.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedChoices[questionId] = choice;

            showNextQuestion();
            checkIfComplete();
        });
    });

    const heroNameInput = document.querySelector('.hero-name-input');
    if (heroNameInput) {
        heroNameInput.addEventListener('input', function() {
            // İsim bilgisi her değiştiğinde `selectedChoices`'a kaydedilir.
            const questionDiv = this.closest('.question');
            const questionId = questionDiv.id;
            selectedChoices[questionId] = this.value.trim();

            if (this.value.trim() !== '') {
                showNextQuestion();
            }
            checkIfComplete();
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

// Bir sonraki soruyu göstermek için yeni fonksiyon
function showNextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
        const nextQuestion = document.getElementById(`question${currentQuestionIndex + 2}`);
        if (nextQuestion) {
            setTimeout(() => {
                nextQuestion.classList.add('visible');
                currentQuestionIndex++;
                checkIfComplete();
            }, 500);
        }
    }
}

// Form tamamlanma kontrolü
function checkIfComplete() {
    // Toplam soru sayısı kadar cevap gelmiş mi kontrol et.
    // Her bir sorunun bir cevabı olmalı, hem metin hem de seçim soruları dahil.
    if (Object.keys(selectedChoices).length === totalQuestions) {
        createButton.classList.add('enabled');
    } else {
        createButton.classList.remove('enabled');
    }
}

// Hikaye oluşturma fonksiyonu
async function generateStory() {
    // Tüm cevapları ve isim bilgisini tek bir nesnede toplayın
    const finalAnswers = {};
    const heroNameInput = document.querySelector('.hero-name-input');
    
    // API'nin beklediği formata göre cevapları yeniden düzenle
    // Örneğin, "question1" anahtarı yerine "heroName" gibi bir anahtar kullanabiliriz
    for (const key in selectedChoices) {
        // Burada, her bir questionId'ye karşılık gelen input veya seçenek değerini alıp API'nin beklediği formata dönüştürmeniz gerekir.
        // Bu örnek için, sadece anahtar-değer çiftlerini saklıyoruz.
        finalAnswers[key] = selectedChoices[key];
    }

    // Cevapları ve isim bilgisini bir JSON nesnesi olarak localStorage'a kaydedin
    localStorage.setItem('storyCreationAnswers', JSON.stringify(finalAnswers));
    if (DEBUG_MODE) console.log('✅ Cevaplar localStorage\'a kaydedildi:', finalAnswers);

    // Loading ekranına yönlendir
    window.location.href = 'loading.html';
}