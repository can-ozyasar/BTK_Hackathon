
  

        const API_BASE_URL = 'https://btk-proje-backend.onrender.com';
        const DEBUG_MODE = true;

        // DOM elemanlarını seçme
        const bookContainer = document.querySelector('.book');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageNumberSpan = document.getElementById('pageNumber');

        let currentPages = [];
        let currentPageIndex = 0;

        /**
         * Loading ekranını gösterir.
         */
        function showLoading() {
            bookContainer.innerHTML = `
                <div class="page is-active loading-page">
                    <div class="loader"></div>
                    <p>Hikayen yükleniyor...</p>
                </div>
            `;
            nextBtn.disabled = true;
            prevBtn.disabled = true;
            pageNumberSpan.textContent = "Yükleniyor";
        }

        function getStoryFromLocalStorage() {
            const urlParams = new URLSearchParams(window.location.search);
            const storyId = urlParams.get('storyId');
            
            if (!storyId) {
                if (DEBUG_MODE) console.error('❌ storyId URL parametresinde bulunamadı.');
                return null;
            }
            
            try {
                const cachedStory = localStorage.getItem(`story-${storyId}`);
                if (cachedStory) {
                    if (DEBUG_MODE) console.log('✅ Hikaye verisi localStorage\'dan yüklendi.');
                    return JSON.parse(cachedStory);
                }
            } catch (e) {
                if (DEBUG_MODE) console.error('⚠️ localStorage okuma hatası:', e);
            }
            return null;
        }

        /**
         * Test hikayesi oluşturur (localStorage'da veri yoksa)
         */
        function createTestStory() {
            return {
                title: "Test Hikayesi",
                summary: "Bu bir test hikayesidir. Gerçek bir hikaye yüklenemediği için örnek içerik gösteriliyor.",
                backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGE5MGUyIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjN2JiM2YwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2E4ZDBmZiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjUwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykiLz4KICA8Y2lyY2xlIGN4PSI0NTAiIGN5PSIzMDAiIHI9IjcwIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMikiLz4KICA8dGV4dCB4PSIzMDAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkNvcm1vcmFudCBHYXJhbW9uZCwgc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4+H8J+MuCBIaWtheWUgQXJrYXBsYW7EsW7EsSA8L3RleHQ+Cjwvc3ZnPgo=",
                sections: [
                    { text: "Bir zamanlar uzak bir ülkede, küçük bir köyde yaşayan genç bir kız vardı. Adı Luna'ydı ve her gece gökyüzündeki yıldızları izlemeyi çok severdi." },
                    { text: "Bir gece Luna, gökyüzünde alışılmadık parlak bir yıldız fark etti. Bu yıldız diğerlerinden farklıydı - sanki ona doğru dans ediyordu." },
                    { text: "Meraklı Luna, yıldızı takip etmeye karar verdi. Evden çıkıp ormana doğru yürüdü. Yıldız onu daha derinlere çekiyordu." },
                    { text: "Ormanın derinliklerinde Luna, büyülü bir açıklık buldu. Burada yıldızlar çok daha parlak görünüyordu ve havada büyülü bir enerji vardı." },
                    { text: "Ve o gece Luna, yıldızlarla konuşmayı öğrendi. Artık her gece bu büyülü yere gelip yıldızlardan hikayeler dinliyordu. Sonsuza kadar mutlu yaşadı." }
                ]
            };
        }

        /**
         * Dinamik olarak hikaye sayfalarını oluşturur.
         * @param {object} story Hikaye verisi.
         */
        function renderStory(story) {
            if (!story || !story.sections || story.sections.length === 0) {
                if (DEBUG_MODE) console.error('❌ Render edilecek hikaye verisi eksik veya hatalı.');
                bookContainer.innerHTML = `<div class="page is-active error-page"><p>Hikaye bulunamadı veya hatalı. 😔</p></div>`;
                return;
            }
            
            currentPages = [];
            bookContainer.innerHTML = '';

            // Kapak sayfası oluşturma
            const coverPage = createPageElement('cover-page', story.backgroundImage, story.title, story.summary, true);
            coverPage.classList.add('is-active');
            bookContainer.appendChild(coverPage);
            currentPages.push(coverPage);

            // Hikaye bölümlerini sayfalara dönüştürme
            story.sections.forEach((section, index) => {
                const pageElement = createPageElement(
                    `page-${index + 1}`,
                    story.backgroundImage,
                    null,
                    section.text,
                    false
                );
                bookContainer.appendChild(pageElement);
                currentPages.push(pageElement);
            });

            // Kontrol düğmelerini ve sayfa numarasını güncelle
            currentPageIndex = 0;
            updatePage();
        }

        /**
         * Tek bir sayfa div'i oluşturur.
         * @param {string} id Sayfa kimliği.
         * @param {string} imageUrl Sayfa resmi URL'si.
         * @param {string} title Sayfa başlığı (kapak için).
         * @param {string} text Sayfa metni.
         * @param {boolean} isCover Kapak sayfası mı?
         * @returns {HTMLElement} Oluşturulmuş sayfa elemanı.
         */
        function createPageElement(id, imageUrl, title, text, isCover = false) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            if (isCover) pageDiv.classList.add('cover-page');
            pageDiv.id = id;

            // Sayfa tıklama eventi ekle
            pageDiv.addEventListener('click', nextPage);

            // Resim
            const img = document.createElement('img');
            img.src = imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGE5MGUyIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IaWtheWUgUmVzbWk8L3RleHQ+Cjwvc3ZnPgo=';
            img.alt = title || 'Hikaye Sayfası';
            pageDiv.appendChild(img);

            // Metin alanı
            const textDiv = document.createElement('div');
            textDiv.className = 'story-text';

            if (title) {
                const h2 = document.createElement('h2');
                h2.textContent = title;
                textDiv.appendChild(h2);
            }
            
            const p = document.createElement('p');
            p.textContent = text;
            textDiv.appendChild(p);

            pageDiv.appendChild(textDiv);

            return pageDiv;
        }

        /**
         * Sayfa geçişlerini yönetir ve kontrol düğmelerini günceller.
         */
        function updatePage() {
            if (currentPages.length === 0) return;

            // Aktif sayfayı ayarla
            currentPages.forEach((page, index) => {
                if (index === currentPageIndex) {
                    page.classList.add('is-active');
                    page.classList.add('page-transition');
                    setTimeout(() => page.classList.remove('page-transition'), 600);
                } else {
                    page.classList.remove('is-active');
                }
            });

            // Buton durumlarını güncelle
            prevBtn.disabled = currentPageIndex === 0;
            nextBtn.disabled = currentPageIndex === currentPages.length - 1;

            // Sayfa numarasını güncelle
            if (currentPageIndex === 0) {
                pageNumberSpan.textContent = "Kapak";
                nextBtn.textContent = "Başla";
            } else if (currentPageIndex === currentPages.length - 1) {
                pageNumberSpan.textContent = `Son Sayfa`;
                nextBtn.textContent = "Başa Dön";
            } else {
                pageNumberSpan.textContent = `Sayfa ${currentPageIndex}`;
                nextBtn.textContent = "İleri";
            }
        }

        /**
         * Sayfayı bir sonraki sayfaya geçirir.
         */
        function nextPage() {
            if (currentPageIndex < currentPages.length - 1) {
                currentPageIndex++;
                updatePage();
            } else if (currentPageIndex === currentPages.length - 1) {
                currentPageIndex = 0;
                updatePage();
            }
        }

        /**
        * Sayfayı bir önceki sayfaya geçirir.
        */
        function prevPage() {
            if (currentPageIndex > 0) {
                currentPageIndex--;
                updatePage();
            }
        }

        // Olay dinleyicilerini ekle
        nextBtn.addEventListener('click', nextPage);
        prevBtn.addEventListener('click', prevPage);

        // Sayfa yüklendiğinde hikayeyi getir
        document.addEventListener('DOMContentLoaded', async () => {
            if (DEBUG_MODE) console.log('📖 Hikaye okuma sayfası yüklendi.');
            
            let story = getStoryFromLocalStorage();
            
            // Eğer localStorage'da hikaye yoksa test hikayesi kullan
            if (!story) {
                if (DEBUG_MODE) console.log('⚠️ localStorage\'da hikaye bulunamadı, test hikayesi yükleniyor.');
                story = createTestStory();
            }
            
            if (story) {
                renderStory(story);
            } else {
                bookContainer.innerHTML = `<div class="page is-active error-page"><p>Üzgünüm, hikaye yüklenemedi. Lütfen tekrar deneyin. 😞</p></div>`;
            }
        });
   