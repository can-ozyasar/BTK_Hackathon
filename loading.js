 const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
        const DEBUG_MODE = true;

        document.addEventListener('DOMContentLoaded', () => {
            const animalContainer = document.getElementById('animal-container');
            const animals = ['🐱', '🐶', '🐰', '🐼', '🦊', '🐻', '🐹'];

            // Hayvanları kenarlardan oluşturan fonksiyon
            function createAnimal() {
                const animal = document.createElement('div');
                animal.classList.add('moving-animal');
                animal.textContent = animals[Math.floor(Math.random() * animals.length)];

                // Hayvanın başlangıç konumunu rastgele kenarlardan birinde belirle
                const edge = Math.floor(Math.random() * 4); // 0:üst, 1:sağ, 2:alt, 3:sol
                switch(edge) {
                    case 0: // Üstten
                        animal.style.left = `${Math.random() * 100}vw`;
                        animal.style.top = `-10vh`;
                        break;
                    case 1: // Sağdan
                        animal.style.left = `110vw`;
                        animal.style.top = `${Math.random() * 100}vh`;
                        break;
                    case 2: // Alttan
                        animal.style.left = `${Math.random() * 100}vw`;
                        animal.style.top = `110vh`;
                        break;
                    case 3: // Soldan
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

            // 10 adet hareketli hayvan ekle
            for (let i = 0; i < 10; i++) {
                createAnimal();
            }

            // --- API entegrasyonu ve yönlendirme mantığı ---
            
            /**
             * API'den hikaye verisini çeker ve localStorage'a kaydeder.
             * @returns {Promise<string|null>} storyId veya hata durumunda null.
             */
            async function fetchAndCacheStory() {
                const urlParams = new URLSearchParams(window.location.search);
                const storyId = urlParams.get('storyId');
                
                if (!storyId) {
                    if (DEBUG_MODE) console.error('❌ URL\'de hikaye kimliği (storyId) bulunamadı.');
                    return null;
                }

                try {
                    if (DEBUG_MODE) console.log(`📡 Hikaye (${storyId}) API'den çekiliyor...`);
                    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, { mode: 'cors' });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    const data = await response.json();
                    const storyData = data.data || data;

                    // Gelen veriyi localStorage'a kaydet
                    localStorage.setItem(`story-${storyId}`, JSON.stringify(storyData));
                    if (DEBUG_MODE) console.log('✅ Hikaye verisi localStorage\'a kaydedildi.');

                    return storyId;

                } catch (error) {
                    if (DEBUG_MODE) console.error('❌ Hikaye yükleme hatası:', error);
                    return null;
                }
            }

            // Ana işlem: Veriyi çek ve belirli bir süre sonra yönlendir
            async function startLoadingProcess() {
                const storyId = await fetchAndCacheStory();
                
                // En az 2 saniye bekleme süresi
                const minimumWaitTime = 2000;
                const startTime = Date.now();

                const elapsedTime = Date.now() - startTime;
                const remainingTime = minimumWaitTime - elapsedTime;
                
                if (DEBUG_MODE) console.log(`⏳ Minimum bekleme süresinden kalan süre: ${remainingTime}ms`);

                if (storyId) {
                    // Kalan süreyi bekle ve sonra yönlendir
                    setTimeout(() => {
                        window.location.href = `hikayeOku.html?storyId=${storyId}`;
                    }, remainingTime > 0 ? remainingTime : 0);
                } else {
                    // Hata durumunda da bir süre sonra yönlendirme yapabilir veya hata mesajı gösterebiliriz
                    setTimeout(() => {
                        window.location.href = `hikayeOku.html`; // Anasayfaya dönme
                    }, remainingTime > 0 ? remainingTime : 0);
                }
            }

            // Yükleme sürecini başlat
            startLoadingProcess();
        });