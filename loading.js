

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

            // Hayvanı ortadaki daire etrafında döndürmek için yeni fonksiyonu çağır
            animateAnimalRotation(animal);
        }

        // Hayvanları ortada dönen daire etrafında hareket ettiren fonksiyon
        function animateAnimalRotation(animal) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radius = Math.random() * 190 + 290; // 100 ile 250 arasında rastgele bir yarıçap
            const speed = (Math.random() * 0.005) + 0.005; // 0.005 ile 0.01 arasında rastgele bir hız
            let angle = Math.random() * 2 * Math.PI; // Başlangıç açısı (radyan)

            function rotate() {
                // Açıyı her döngüde artır
                angle += speed;

                // Trigonometri kullanarak yeni X ve Y konumlarını hesapla
                const newX = centerX + radius * Math.cos(angle);
                const newY = centerY + radius * Math.sin(angle);

                // Hayvanın pozisyonunu güncelle
                animal.style.left = `${newX}px`;
                animal.style.top = `${newY}px`;
                
                requestAnimationFrame(rotate); // Animasyonu bir sonraki karede devam ettir
            }

            rotate(); // Animasyonu başlat
        }

        // 10 adet hareketli hayvan ekle
        for (let i = 0; i < 10; i++) {
            createAnimal();
        }
    });
