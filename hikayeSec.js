
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




    // Kategorileri çeken ve ekrana basan kod APİ BAĞLANTISI    
document.addEventListener('DOMContentLoaded', () => {
    // API'den veri çekecek asenkron fonksiyon
    const fetchCategories = async () => {
        // HTML'de id="category-grid" olarak güncellediğimiz elementi alıyoruz
        const categoryGrid = document.getElementById('category-grid');
        
        if (!categoryGrid) {
            console.error('Kategori ızgarası elementi bulunamadı.');
            return;
        }

        // Yükleme mesajı ekleyelim
        categoryGrid.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; padding: 1rem;">
                <span style="font-size: 1.25rem; font-weight: 600; color: #6b7280;">Kategoriler yükleniyor...</span>
            </div>
        `;

        try {
            // Kategori API endpoint'i (Tam backend URL'si ile güncellendi)
            const apiUrl = 'https://btk-proje-backend.onrender.com/api/stories/categories';
            
            // fetch isteği (mode: 'cors' eklendi)
            const response = await fetch(apiUrl, { mode: 'cors' });

            // Hata kontrolü
            if (!response.ok) {
                throw new Error(`API isteği başarısız oldu: ${response.status}`);
            }

            const data = await response.json();
            let categories = data.categories || [];
            
            // Kategori ızgarasını temizle
            categoryGrid.innerHTML = '';
            
            // En az 6 kategori olduğundan emin ol
            if (categories.length < 6) {
                const placeholderCount = 6 - categories.length;
                for (let i = 0; i < placeholderCount; i++) {
                    categories.push({
                        id: `placeholder-${i}`,
                        name: 'Yakında',
                        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
                        color: 'color-gray' // CSS dosyanızdaki renklere uygun bir sınıf ekleyebilirsiniz.
                    });
                }
            }
            
            // Kategori kartlarını oluştur ve ekrana bas
            categories.forEach(category => {
                const card = document.createElement('a');
                // Mevcut CSS sınıflarınızı kullanıyoruz
                const colors = ['color-pink', 'color-light-blue', 'color-purple', 'color-yellow', 'color-green', 'color-cyan'];
                const randomColorClass = category.color || colors[Math.floor(Math.random() * colors.length)];

                card.className = `category-card ${randomColorClass}`;
                card.href = 'icerikDetaylandir.html'; // Yönlendirilecek sayfa
                card.dataset.categoryId = category.id;
                card.dataset.categoryName = category.name;

                card.onclick = (e) => {
                    e.preventDefault();
                    if (category.id.startsWith('placeholder')) {
                        // Placeholder kartlara tıklanmasını engelle
                        return;
                    }
                    localStorage.setItem('selectedCategoryId', category.id);
                    localStorage.setItem('selectedCategoryName', category.name);
                    window.location.href = card.href;
                };
                
                card.innerHTML = `
                    <div class="icon-container">
                        ${category.icon}
                    </div>
                    <span>${category.name}</span>
                `;
                
                categoryGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Kategoriler alınırken hata:', error);
            categoryGrid.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; width: 100%; padding: 1rem; text-align: center;">
                    <span style="font-size: 1.25rem; font-weight: 600; color: #dc2626;">
                        Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                    </span>
                </div>
            `;
        }
    };
    
    // Sayfa yüklendiğinde kategorileri çek
    fetchCategories();
});