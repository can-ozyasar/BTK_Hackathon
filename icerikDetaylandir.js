
        let selectedChoices = {};
        let currentQuestion = 1;
        const totalQuestions = 4;

        // Kahraman adı input
        const heroNameInput = document.getElementById('heroName');
        
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
                if (currentQuestion < totalQuestions) {
                    setTimeout(() => {
                        const nextQuestion = document.getElementById(`question${currentQuestion + 1}`);
                        nextQuestion.classList.add('visible');
                        currentQuestion++;
                        checkIfComplete();
                    }, 500);
                } else {
                    checkIfComplete();
                }
            });
        });

        // Hikaye oluştur butonu
        document.getElementById('createStory').addEventListener('click', function() {
            if (heroNameInput.value.trim() && Object.keys(selectedChoices).length === totalQuestions) {
                generateStory();
            }
        });

        // Form tamamlanma kontrolü
        function checkIfComplete() {
            const createButton = document.getElementById('createStory');
            if (heroNameInput.value.trim() && Object.keys(selectedChoices).length === totalQuestions) {
                createButton.classList.add('enabled');
            }
        }

        // İsim input dinleyicisi
        heroNameInput.addEventListener('input', checkIfComplete);

        // Hikaye oluştur
        function generateStory() {
            const heroName = heroNameInput.value.trim();
            const character = selectedChoices.question1;
            const location = selectedChoices.question2;
            const interest = selectedChoices.question3;

            const storyTemplates = {
                cesur: {
                    orman: {
                        macera: `Bir zamanlar <span class="hero-name">${heroName}</span> adında cesur bir şövalye büyülü ormanda yaşıyordu. Her gün yeni maceralar peşinde koşar, ejderhalarla savaşır ve kayıp hazineler arardı.`,
                        kitap: `<span class="hero-name">${heroName}</span> cesur bir şövalyeydi ama savaşmaktan çok kitap okumayı severdi. Büyülü ormandaki ağaç evinde binlerce büyülü kitap vardı.`,
                        arkadas: `Şövalye <span class="hero-name">${heroName}</span> ormandaki tüm hayvanlarla arkadaştı. Onlarla birlikte büyük maceralara atılır, birbirlerine yardım ederlerdi.`,
                        buyu: `<span class="hero-name">${heroName}</span> hem şövalye hem de büyücüydü. Büyülü ormanında sihirli formüller öğrenir, iyilik için büyüler yapardı.`
                    },
                    kale: {
                        macera: `Kral <span class="hero-name">${heroName}</span> eski kalesinden çıkıp sürekli yeni topraklar keşfederdi. Her macera onu daha güçlü yapardı.`,
                        kitap: `Şövalye <span class="hero-name">${heroName}</span> kalesinin kütüphanesinde saatlerce kitap okur, eski hikayeleri öğrenirdi.`,
                        arkadas: `<span class="hero-name">${heroName}</span> kalesini tüm dostlarına açmıştı. Şövalyeler, çiftçiler, sanatçılar... Herkes orda mutluydu.`,
                        buyu: `Büyücü şövalye <span class="hero-name">${heroName}</span> kalesini sihirli güçlerle korur, kötülüklere karşı büyüler yapardı.`
                    }
                },
                merakli: {
                    orman: {
                        macera: `<span class="hero-name">${heroName}</span> büyülü ormanda her gün yeni şeyler keşfederdi. Gizli mağaralar, konuşan hayvanlar, sihirli çiçekler...`,
                        kitap: `Küçük keşif <span class="hero-name">${heroName}</span> ormandaki her ağacın altında kitap okur, doğanın sırlarını öğrenirdi.`,
                        arkadas: `<span class="hero-name">${heroName}</span> ormandaki tüm yaratıklarla arkadaş olmuştu. Onlardan öğrendiği şeylerle büyük keşifler yapardı.`,
                        buyu: `Meraklı <span class="hero-name">${heroName}</span> ormanda büyülü bitkiler keşfetti ve onlardan sihirli iksirler yapmayı öğrendi.`
                    }
                }
            };

            // Basit hikaye şablonu
            let story = `Bir zamanlar <span class="hero-name">${heroName}</span> adında `;
            
            switch(character) {
                case 'cesur':
                    story += 'cesur bir şövalye ';
                    break;
                case 'merakli':
                    story += 'meraklı bir keşif ';
                    break;
                case 'buyucu':
                    story += 'büyülü güçleri olan bir çocuk ';
                    break;
                case 'dost':
                    story += 'çok dostcul bir hayvan ';
                    break;
            }

            switch(location) {
                case 'orman':
                    story += 'büyülü bir ormanda ';
                    break;
                case 'kale':
                    story += 'eski bir kalede ';
                    break;
                case 'deniz':
                    story += 'deniz kenarında ';
                    break;
                case 'bulutlar':
                    story += 'bulutların üstünde ';
                    break;
            }

            story += 'yaşıyordu. ';

            switch(interest) {
                case 'macera':
                    story += `<span class="hero-name">${heroName}</span> her gün yeni maceralara atılır, büyük keşifler yapardı.`;
                    break;
                case 'kitap':
                    story += `Boş zamanlarında kitap okumayı çok severdi ve okudugu hikayelerden ilham alırdı.`;
                    break;
                case 'arkadas':
                    story += `En büyük mutluluğu yeni arkadaşlar edinmek ve onlarla güzel anılar biriktirmekti.`;
                    break;
                case 'buyu':
                    story += `Gizlice büyü öğrenir ve bu güçlerini iyilik için kullanırdı.`;
                    break;
            }

            story += ` Ve böylece <span class="hero-name">${heroName}</span>'in harika maceraları başlamış oldu! 🌟`;

            document.getElementById('storyText').innerHTML = story;
            document.getElementById('storyResult').style.display = 'block';
            
            // Hikaye bölümüne scroll
            document.getElementById('storyResult').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
   


        document.addEventListener('DOMContentLoaded', () => {
    // Backend API'sinin temel URL'si
    const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
    
    // HTML'den gerekli elementleri seç
    const mainContent = document.querySelector('.content');
    const heroNameInput = document.getElementById('heroName');
    const createStoryButton = document.getElementById('createStory');
    const storyResultDiv = document.getElementById('storyResult');
    const storyTextDiv = document.getElementById('storyText');

    // Kullanıcının cevaplarını saklamak için bir nesne
    let userChoices = {};
    let currentQuestions = [];
    let currentQuestionIndex = 0;

    // --- Fonksiyonlar ---

    /**
     * API'den soruları çeker ve ekrana basar.
     */
    const fetchQuestions = async () => {
        const categoryId = localStorage.getItem('selectedCategoryId');
        const categoryName = localStorage.getItem('selectedCategoryName');

        if (!categoryId) {
            mainContent.innerHTML = `<p style="color: red; font-weight: bold;">Lütfen önce bir kategori seçin.</p>`;
            return;
        }

        // Yükleme mesajı göster
        mainContent.innerHTML = `<p class="loading-message">Sorular yükleniyor...</p>`;

        try {
            const apiUrl = `${API_BASE_URL}/api/stories/questions/${categoryId}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API isteği başarısız oldu: ${response.status}`);
            }

            const data = await response.json();
            currentQuestions = data.questions;

            if (currentQuestions && currentQuestions.length > 0) {
                renderQuestion(currentQuestionIndex);
            } else {
                mainContent.innerHTML = `<p style="color: orange; font-weight: bold;">Bu kategoriye ait soru bulunamadı.</p>`;
            }

        } catch (error) {
            console.error('Sorular alınırken hata:', error);
            mainContent.innerHTML = `<p style="color: red; font-weight: bold;">Sorular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>`;
        }
    };

    /**
     * Belirtilen indeksteki soruyu ekrana basar.
     * @param {number} index Sorunun indeksi.
     */
    const renderQuestion = (index) => {
        if (index >= currentQuestions.length) {
            showCreateStoryButton();
            return;
        }

        const question = currentQuestions[index];
        const questionHtml = `
            <div class="question visible" id="question-${index}">
                <img src="${question.image}" alt="${question.title}" class="question-image">
                <h3>${question.text}</h3>
                <div class="options">
                    ${question.options.map(option => `
                        <div class="option" data-choice="${option.value}">${option.label}</div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Önceki soruyu kaldır ve yenisini ekle
        mainContent.innerHTML = questionHtml;
        
        // Yeni eklenen seçeneklere event listener ekle
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => handleOptionClick(option, index, question.key));
        });
    };

    /**
     * Seçeneğe tıklandığında çalışır.
     * @param {HTMLElement} selectedOption Tıklanan seçenek elementi.
     * @param {number} questionIndex Hangi sorunun seçildiğini belirler.
     * @param {string} questionKey Sorunun anahtar değeri.
     */
    const handleOptionClick = (selectedOption, questionIndex, questionKey) => {
        // Seçili seçeneği vurgula
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        selectedOption.classList.add('selected');
        
        // Cevabı kaydet
        userChoices[questionKey] = selectedOption.dataset.choice;

        // Bir sonraki soruya geç
        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        }, 500); // 0.5 saniye bekleme, geçiş hissi vermek için
    };

    /**
     * Tüm sorular yanıtlandığında hikaye oluşturma butonunu gösterir.
     */
    const showCreateStoryButton = () => {
        createStoryButton.style.display = 'block';
    };

    /**
     * Hikaye oluşturma butonuna tıklandığında API'ye istek gönderir.
     */
    createStoryButton.addEventListener('click', async () => {
        const heroName = heroNameInput.value.trim();

        if (!heroName) {
            alert('Lütfen kahramanınızın adını girin.');
            return;
        }

        // Butonu ve inputu gizle, yükleme mesajı göster
        createStoryButton.style.display = 'none';
        heroNameInput.style.display = 'none';
        mainContent.innerHTML = `<p class="loading-message">Hikayeniz oluşturuluyor... Lütfen bekleyin.</p>`;

        const payload = {
            heroName: heroName,
            categoryId: localStorage.getItem('selectedCategoryId'),
            answers: userChoices
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/stories/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Hikaye oluşturma başarısız: ${response.status}`);
            }

            const storyData = await response.json();
            
            // Sonucu göster
            storyResultDiv.style.display = 'block';
            storyTextDiv.innerHTML = `<p>${storyData.story}</p>`;

            // İleri adımı göster
            const nextStepIndicator = document.createElement('h1');
            nextStepIndicator.className = 'creation-step';
            nextStepIndicator.textContent = 'Adım 3/3';
            document.body.appendChild(nextStepIndicator);


        } catch (error) {
            console.error('Hikaye oluşturulurken hata:', error);
            mainContent.innerHTML = `<p style="color: red; font-weight: bold;">Hikayeniz oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.</p>`;
        }
    });

    // Sayfa yüklendiğinde soruları çekmeye başla
    fetchQuestions();
});
