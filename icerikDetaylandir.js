
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
   