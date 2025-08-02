
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
