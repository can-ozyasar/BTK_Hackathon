document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumberSpan = document.getElementById('pageNumber');

    let currentPageIndex = 0;
    const totalPages = pages.length;

    // Başlangıçta sadece ilk sayfayı (kapağı) göster
    pages.forEach((page, index) => {
        if (index !== 0) {
            page.style.display = 'none';
        }
    });

    // Sayfa durumunu güncelleme fonksiyonu
    function updatePage() {
        pageNumberSpan.textContent = `Sayfa ${currentPageIndex} / ${totalPages - 1}`;
        if (currentPageIndex === 0) {
            pageNumberSpan.textContent = 'Kapak';
        }

        prevBtn.disabled = currentPageIndex === 0;
        if (currentPageIndex === 0) {
            nextBtn.textContent = 'Başla';
        } else if (currentPageIndex === totalPages - 1) {
            nextBtn.textContent = 'Son';
            nextBtn.disabled = true;
        } else {
            nextBtn.textContent = 'Sonraki';
            nextBtn.disabled = false;
        }
    }

    // İleri Gitme Fonksiyonu
    function goForward() {
        if (currentPageIndex < totalPages - 1) {
            // Mevcut sayfayı "dönüş" animasyonu için işaretle
            pages[currentPageIndex].classList.add('is-turning');

            // Yeni sayfayı görünür yap ve animasyonu başlat
            pages[currentPageIndex + 1].style.display = 'flex';
            setTimeout(() => {
                pages[currentPageIndex].classList.add('is-flipped');
                pages[currentPageIndex + 1].classList.add('is-active');
            }, 50);

            // Animasyon tamamlandıktan sonra gereksiz sınıfları kaldır
            setTimeout(() => {
                pages[currentPageIndex].style.display = 'none';
                pages[currentPageIndex].classList.remove('is-turning', 'is-active');
                currentPageIndex++;
                updatePage();
            }, 800); // CSS geçiş süresi ile aynı olmalı
        }
    }
    
    // Geri Dönme Fonksiyonu
    function goBackward() {
        if (currentPageIndex > 0) {
            // Önceki sayfayı görünür yap ve animasyonu tersine çevir
            pages[currentPageIndex - 1].style.display = 'flex';
            pages[currentPageIndex - 1].classList.remove('is-flipped');
            pages[currentPageIndex - 1].classList.add('is-active', 'is-turning');

            // Animasyon tamamlandıktan sonra gereksiz sınıfları kaldır
            setTimeout(() => {
                pages[currentPageIndex].classList.remove('is-active');
                pages[currentPageIndex - 1].classList.remove('is-turning');
                currentPageIndex--;
                updatePage();
            }, 800);
        }
    }

    // Buton ve sayfa tıklama olayları
    nextBtn.addEventListener('click', goForward);
    prevBtn.addEventListener('click', goBackward);

    // Sayfa tıklaması ile de ilerleme (Kitap hissini artırır)
    pages.forEach(page => {
        page.addEventListener('click', goForward);
    });

    updatePage(); // Sayfa yüklendiğinde ilk sayfayı göster
});