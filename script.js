document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    // Updated based on your provided file structure and names.
    // ****** IMPORTANT: You MUST manually update 'durationSeconds' for each track! ******
    const audiobooksData = [
        // Introduction
        { id: 'introducao', module: 'Introdução', title: 'Introdução', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/INTRODUÇÃO.mp3' },

        // Module 1
        { id: 'mod1_nc1', module: 'Módulo 1', title: 'Módulo 1 NC1', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD1 NC1.mp3' },
        { id: 'mod1_nc2', module: 'Módulo 1', title: 'Módulo 1 NC2', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD1 NC2.mp3' },
        { id: 'mod1_nc3', module: 'Módulo 1', title: 'Módulo 1 NC3', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD1 NC3.mp3' },
        { id: 'mod1_nc4', module: 'Módulo 1', title: 'Módulo 1 NC4', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD1 NC4.mp3' },

        // Module 2
        { id: 'mod2_nc1', module: 'Módulo 2', title: 'Módulo 2 NC1', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD2 NC1.mp3' },
        { id: 'mod2_nc2', module: 'Módulo 2', title: 'Módulo 2 NC2', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD2 NC2.mp3' },
        { id: 'mod2_nc3', module: 'Módulo 2', title: 'Módulo 2 NC3', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD2 NC3.mp3' },
        { id: 'mod2_nc4', module: 'Módulo 2', title: 'Módulo 2 NC4', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD2 NC4.mp3' },

        // Module 3
        { id: 'mod3_nc1', module: 'Módulo 3', title: 'Módulo 3 NC1', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD3 NC1.mp3' },
        { id: 'mod3_nc2', module: 'Módulo 3', title: 'Módulo 3 NC2', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD3 NC2.mp3' },
        { id: 'mod3_nc3', module: 'Módulo 3', title: 'Módulo 3 NC3', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD3 NC3.mp3' },

        // Module 4
        { id: 'mod4_nc1', module: 'Módulo 4', title: 'Módulo 4 NC1', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD4 NC1.mp3' },
        { id: 'mod4_nc2', module: 'Módulo 4', title: 'Módulo 4 NC2', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD4 NC2.mp3' },
        { id: 'mod4_nc3', module: 'Módulo 4', title: 'Módulo 4 NC3', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD4 NC3.mp3' },
        { id: 'mod4_nc4', module: 'Módulo 4', title: 'Módulo 4 NC4', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD4 NC4.mp3' },
        { id: 'mod4_nc5', module: 'Módulo 4', title: 'Módulo 4 NC5', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD4 NC5.mp3' },
        { id: 'mod4_nc6', module: 'Módulo 4', title: 'Módulo 4 NC6', durationSeconds: 0, imgSrc: 'Imgs/estudio.png', audioSrc: 'Audios/MOD4 NC6.mp3' },
        // Add Module 5, 6 etc. here following the same pattern if needed
    ];

    // --- DOM Elements ---
    const audioPlayer = document.getElementById('audio-player');
    const nowPlayingSection = document.getElementById('now-playing-section');
    const playerImage = document.getElementById('player-image');
    const playerTitle = document.getElementById('player-title');
    const playerModule = document.getElementById('player-module');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeIcon = volumeBtn.querySelector('i');
    const volumeBar = document.getElementById('volume-bar');
    const volumeLevel = document.getElementById('volume-level');
    const moduleNav = document.querySelector('.module-nav');
    const audiobooksContainer = document.getElementById('audiobooks-container');
    const currentYearEl = document.getElementById('current-year');

    // --- Player State ---
    let currentAudiobook = null;
    let currentPlaylist = []; // Holds the IDs of audiobooks in the current view/module
    let currentIndex = -1;
    let isPlaying = false;
    let isRepeat = false;
    let isShuffle = false;
    let currentVolume = 0.7;
    let isSeeking = false;

    // --- Helper Functions ---
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds <= 0) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function getAudiobookById(id) {
        return audiobooksData.find(book => book.id === id);
    }

    // --- UI Rendering ---
    function createAudiobookCard(audiobook) {
        const card = document.createElement('div');
        card.className = 'audiobook-card';
        card.dataset.id = audiobook.id;

        card.innerHTML = `
            <div class="audiobook-thumbnail">
                <img src="${audiobook.imgSrc}" alt="Capa de ${audiobook.title}" loading="lazy">
                <div class="play-overlay">
                    <button class="play-btn-card" aria-label="Reproduzir ${audiobook.title}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="audiobook-info">
                <h3 class="audiobook-title">${audiobook.title}</h3>
                <div class="audiobook-duration">
                    <span>${formatTime(audiobook.durationSeconds)}</span>
                </div>
            </div>
        `;

        // Attach listener to the CARD itself
        card.addEventListener('click', () => {
            currentIndex = currentPlaylist.indexOf(audiobook.id);
            if (currentIndex === -1) {
                 console.warn(`Audiobook ${audiobook.id} not found in current playlist. Resetting playlist.`);
                 currentPlaylist = audiobooksData.map(b => b.id); // Reset to all
                 currentIndex = currentPlaylist.indexOf(audiobook.id);
            }
            // Make sure we have a valid index before loading
            if (currentIndex !== -1) {
                loadAudiobook(audiobook.id);
            } else {
                console.error(`Could not find index for ${audiobook.id} even after reset.`);
            }
        });

        return card;
    }

     function renderAudiobooks(filterModule = 'all') {
        audiobooksContainer.innerHTML = '';
        moduleNav.innerHTML = ''; // Clear existing buttons

        const allBtn = document.createElement('button');
        allBtn.className = 'module-btn';
        allBtn.textContent = 'Todos';
        allBtn.dataset.module = 'all';
        if (filterModule === 'all') allBtn.classList.add('active');
        allBtn.addEventListener('click', () => renderAudiobooks('all'));
        moduleNav.appendChild(allBtn);

        const modules = [...new Set(audiobooksData.map(book => book.module))].sort((a, b) => {
            if (a === 'Introdução') return -1;
            if (b === 'Introdução') return 1;
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
        });

        const filteredData = (filterModule === 'all')
            ? audiobooksData
            : audiobooksData.filter(book => book.module === filterModule);

        currentPlaylist = filteredData.map(book => book.id);

        modules.forEach(mod => {
            const btn = document.createElement('button');
            btn.className = 'module-btn';
            btn.textContent = mod;
            btn.dataset.module = mod;
            if (mod === filterModule) btn.classList.add('active');
            btn.addEventListener('click', () => renderAudiobooks(mod));
            moduleNav.appendChild(btn);
        });

        const groupedByModule = filteredData.reduce((acc, book) => {
            acc[book.module] = acc[book.module] || [];
            acc[book.module].push(book);
            return acc;
        }, {});

        modules.forEach(mod => {
            if (!groupedByModule[mod]) return;

            const section = document.createElement('section');
            section.className = 'audiobooks-section';
            section.dataset.moduleId = mod;

            const sectionTitle = document.createElement('h2'); // Create title element
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = mod;
            section.appendChild(sectionTitle); // Add title first

            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'carousel-container';

            const carousel = document.createElement('div');
            carousel.className = 'carousel';

            // Populate the carousel with cards (and their listeners)
            groupedByModule[mod].forEach(book => {
                carousel.appendChild(createAudiobookCard(book));
            });

            // --- *** CORRECTED BUTTON LOGIC START *** ---
            carouselContainer.appendChild(carousel); // Append the original carousel WITH listeners

            const needsCarouselButtons = groupedByModule[mod].length > calculateVisibleCards();

            if (needsCarouselButtons) {
                // Create Prev Button
                const prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-btn prev';
                prevBtn.setAttribute('aria-label', 'Anterior');
                prevBtn.innerHTML = '❮'; // Left arrow

                // Create Next Button
                const nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-btn next';
                nextBtn.setAttribute('aria-label', 'Próximo');
                nextBtn.innerHTML = '❯'; // Right arrow

                // Calculate scroll amount (adjust multiplier as needed)
                const scrollAmount = carousel.querySelector('.audiobook-card')?.offsetWidth * 2 || 500;

                // Add listeners to the created buttons
                prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
                nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }));

                // Insert buttons into the container AROUND the carousel
                carouselContainer.insertBefore(prevBtn, carousel); // Add prev button before
                carouselContainer.appendChild(nextBtn);         // Add next button after
            }
            // --- *** CORRECTED BUTTON LOGIC END *** ---

            section.appendChild(carouselContainer); // Add container to section
            audiobooksContainer.appendChild(section); // Add section to main container
        });

        updatePlayingCardStyle();
    }


    function calculateVisibleCards() {
        const containerWidth = audiobooksContainer.offsetWidth || window.innerWidth;
        const cardElement = audiobooksContainer.querySelector('.audiobook-card');
        const cardStyle = cardElement ? window.getComputedStyle(cardElement) : null;
        const cardWidth = cardElement ? parseFloat(cardStyle?.width || 220) : 220;
        const cardGap = cardElement ? parseFloat(window.getComputedStyle(cardElement.parentElement)?.gap || 20) : 20;
        return Math.max(1, Math.floor(containerWidth / (cardWidth + cardGap)));
    }

    // --- Audio Playback Logic (No changes needed below this line for the fix) ---
    function loadAudiobook(id) {
        const audiobook = getAudiobookById(id);
        if (!audiobook) {
            console.error("Audiobook not found:", id);
            return;
        }

        if (currentAudiobook?.id === id && !isPlaying) {
            playAudio();
            return;
        }

        currentAudiobook = audiobook;
        audioPlayer.src = audiobook.audioSrc;
        playerTitle.textContent = audiobook.title;
        playerModule.textContent = audiobook.module;
        playerImage.src = audiobook.imgSrc;
        playerImage.alt = `Capa de ${audiobook.title}`;
        totalDurationEl.textContent = formatTime(audiobook.durationSeconds);
        currentTimeEl.textContent = formatTime(0);
        progress.style.width = '0%';

        audioPlayer.currentTime = 0;
        playAudio();

        nowPlayingSection.style.display = 'flex';
        updatePlayingCardStyle();
    }

    function playAudio() {
        if (!currentAudiobook) return;
        const playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                playPauseIcon.classList.replace('fa-play', 'fa-pause');
                playPauseBtn.setAttribute('aria-label', 'Pausar');
                updatePlayingCardStyle();
            }).catch(error => {
                console.error("Playback failed (Browser restriction? File exists?):", error);
                isPlaying = false;
                playPauseIcon.classList.replace('fa-pause', 'fa-play');
                playPauseBtn.setAttribute('aria-label', 'Reproduzir');
                updatePlayingCardStyle();
            });
        }
    }

    function pauseAudio() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.classList.replace('fa-pause', 'fa-play');
        playPauseBtn.setAttribute('aria-label', 'Reproduzir');
        updatePlayingCardStyle();
    }

    function togglePlayPause() {
        if (!currentAudiobook) return;
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    function updateProgress() {
        const duration = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : currentAudiobook?.durationSeconds || 0;
        if (!currentAudiobook || duration <= 0 || isSeeking) {
             currentTimeEl.textContent = formatTime(audioPlayer.currentTime || 0);
             return;
        }
        const percentage = (audioPlayer.currentTime / duration) * 100;
        progress.style.width = `${percentage}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        if (totalDurationEl.textContent !== formatTime(duration)) {
            totalDurationEl.textContent = formatTime(duration);
        }
    }

    function seek(event) {
        const duration = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : currentAudiobook?.durationSeconds || 0;
        if (!currentAudiobook || duration <= 0) return;

        const progressBarRect = progressBar.getBoundingClientRect();
        const clickX = (event.touches ? event.touches[0].clientX : event.clientX) - progressBarRect.left;
        const width = progressBarRect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));
        const seekTime = percentage * duration;

        if(audioPlayer.duration && isFinite(audioPlayer.duration)) {
            audioPlayer.currentTime = seekTime;
        }
        progress.style.width = `${percentage * 100}%`;
        currentTimeEl.textContent = formatTime(seekTime);
    }

     function handleSeekStart(event) {
        const duration = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : currentAudiobook?.durationSeconds || 0;
        if (!currentAudiobook || duration <= 0) return;
        isSeeking = true;
        seek(event);

        document.addEventListener('mousemove', handleSeeking);
        document.addEventListener('touchmove', handleSeeking);
        document.addEventListener('mouseup', handleSeekEnd);
        document.addEventListener('touchend', handleSeekEnd);
    }
     function handleSeeking(event) {
        if (!isSeeking) return;
        seek(event);
    }
    function handleSeekEnd() {
        if (isSeeking) {
             isSeeking = false;
             document.removeEventListener('mousemove', handleSeeking);
             document.removeEventListener('touchmove', handleSeeking);
             document.removeEventListener('mouseup', handleSeekEnd);
             document.removeEventListener('touchend', handleSeekEnd);
        }
    }

    function setVolume(event) {
        const volumeBarRect = volumeBar.getBoundingClientRect();
        const clickX = (event.touches ? event.touches[0].clientX : event.clientX) - volumeBarRect.left;
        const width = volumeBarRect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));

        currentVolume = percentage;
        audioPlayer.volume = currentVolume;
        audioPlayer.muted = false;
        volumeLevel.style.width = `${currentVolume * 100}%`;
        updateVolumeIcon();
    }

     function updateVolumeIcon() {
        if (audioPlayer.muted || currentVolume === 0) {
            volumeIcon.className = 'fas fa-volume-xmark';
            volumeBtn.setAttribute('aria-label', 'Ativar som');
        } else if (currentVolume < 0.5) {
            volumeIcon.className = 'fas fa-volume-low';
            volumeBtn.setAttribute('aria-label', 'Volume');
        } else {
            volumeIcon.className = 'fas fa-volume-high';
            volumeBtn.setAttribute('aria-label', 'Volume');
        }
    }

    function toggleMute() {
         audioPlayer.muted = !audioPlayer.muted;
         if (audioPlayer.muted) {
             volumeLevel.style.width = '0%';
         } else {
             volumeLevel.style.width = `${currentVolume * 100}%`;
         }
         updateVolumeIcon();
    }

     function playNext() {
        if (currentPlaylist.length === 0) return;
        let nextIndex = currentIndex;
        if (isShuffle) {
            do { nextIndex = Math.floor(Math.random() * currentPlaylist.length); }
            while (currentPlaylist.length > 1 && nextIndex === currentIndex);
        } else {
            nextIndex++;
            if (nextIndex >= currentPlaylist.length) nextIndex = 0;
        }
        currentIndex = nextIndex;
        loadAudiobook(currentPlaylist[currentIndex]);
    }

    function playPrevious() {
        if (currentPlaylist.length === 0) return;
        if (audioPlayer.currentTime > 3 && !isShuffle) {
             audioPlayer.currentTime = 0;
             playAudio();
             return;
        }
        let prevIndex = currentIndex;
        if (isShuffle) {
             do { prevIndex = Math.floor(Math.random() * currentPlaylist.length); }
             while (currentPlaylist.length > 1 && prevIndex === currentIndex);
        } else {
             prevIndex--;
             if (prevIndex < 0) prevIndex = currentPlaylist.length - 1;
        }
        currentIndex = prevIndex;
        loadAudiobook(currentPlaylist[currentIndex]);
    }

    function handleAudioEnd() {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            playAudio();
        } else {
            playNext();
        }
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    }

    function updatePlayingCardStyle() {
        document.querySelectorAll('.audiobook-card').forEach(card => {
            const cardPlayBtnIcon = card.querySelector('.play-btn-card i');
            if (!cardPlayBtnIcon) return;
            if (card.dataset.id === currentAudiobook?.id && isPlaying) {
                card.classList.add('playing');
                cardPlayBtnIcon.classList.replace('fa-play', 'fa-pause');
            } else {
                 card.classList.remove('playing');
                 cardPlayBtnIcon.classList.replace('fa-pause', 'fa-play');
            }
        });
    }

    // --- Event Listeners ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrevious);
    repeatBtn.addEventListener('click', toggleRepeat);
    shuffleBtn.addEventListener('click', toggleShuffle);
    volumeBtn.addEventListener('click', toggleMute);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleAudioEnd);
    audioPlayer.addEventListener('loadedmetadata', updateProgress);
    audioPlayer.addEventListener('volumechange', updateVolumeIcon);
    audioPlayer.addEventListener('play', updatePlayingCardStyle);
    audioPlayer.addEventListener('pause', updatePlayingCardStyle);
    audioPlayer.addEventListener('error', (e) => {
        console.error("Audio Player Error:", e);
        playerTitle.textContent = "Erro ao carregar áudio";
        totalDurationEl.textContent = "--:--";
        currentTimeEl.textContent = "--:--";
        pauseAudio();
    });

    progressBar.addEventListener('mousedown', handleSeekStart);
    progressBar.addEventListener('touchstart', handleSeekStart, { passive: true });

    volumeBar.addEventListener('click', setVolume);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const activeModuleButton = moduleNav.querySelector('.module-btn.active');
            const currentFilter = activeModuleButton ? activeModuleButton.dataset.module : 'all';
            renderAudiobooks(currentFilter); // Re-render to potentially adjust carousel buttons
        }, 250);
    });

    // --- Initialization ---
    function initialize() {
        audioPlayer.volume = currentVolume;
        volumeLevel.style.width = `${currentVolume * 100}%`;
        updateVolumeIcon();
        currentYearEl.textContent = new Date().getFullYear();
        renderAudiobooks('all');
        nowPlayingSection.style.display = 'none';
    }

    initialize();

}); // End DOMContentLoaded