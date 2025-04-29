document.addEventListener("DOMContentLoaded", () => {
    // --- DATA ---
    // Updated based on your provided file structure and names.
    // ****** IMPORTANT: You MUST manually update "durationSeconds" for each track! ******
    const audiobooksData = [
        // Introduction
        { id: "introducao", module: "Introdução", title: "Introdução", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/INTRODUÇÃO.mp3" },

        // Module 1
        { id: "mod1_nc1", module: "Módulo 1", title: "Módulo 1 NC1", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD1 NC1.mp3" },
        { id: "mod1_nc2", module: "Módulo 1", title: "Módulo 1 NC2", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD1 NC2.mp3" },
        { id: "mod1_nc3", module: "Módulo 1", title: "Módulo 1 NC3", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD1 NC3.mp3" },
        { id: "mod1_nc4", module: "Módulo 1", title: "Módulo 1 NC4", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD1 NC4.mp3" },

        // Module 2
        { id: "mod2_nc1", module: "Módulo 2", title: "Módulo 2 NC1", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD2 NC1.mp3" },
        { id: "mod2_nc2", module: "Módulo 2", title: "Módulo 2 NC2", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD2 NC2.mp3" },
        { id: "mod2_nc3", module: "Módulo 2", title: "Módulo 2 NC3", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD2 NC3.mp3" },
        { id: "mod2_nc4", module: "Módulo 2", title: "Módulo 2 NC4", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD2 NC4.mp3" },

        // Module 3
        { id: "mod3_nc1", module: "Módulo 3", title: "Módulo 3 NC1", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD3 NC1.mp3" },
        { id: "mod3_nc2", module: "Módulo 3", title: "Módulo 3 NC2", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD3 NC2.mp3" },
        { id: "mod3_nc3", module: "Módulo 3", title: "Módulo 3 NC3", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD3 NC3.mp3" },

        // Module 4
        { id: "mod4_nc1", module: "Módulo 4", title: "Módulo 4 NC1", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD4 NC1.mp3" },
        { id: "mod4_nc2", module: "Módulo 4", title: "Módulo 4 NC2", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD4 NC2.mp3" },
        { id: "mod4_nc3", module: "Módulo 4", title: "Módulo 4 NC3", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD4 NC3.mp3" },
        { id: "mod4_nc4", module: "Módulo 4", title: "Módulo 4 NC4", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD4 NC4.mp3" },
        { id: "mod4_nc5", module: "Módulo 4", title: "Módulo 4 NC5", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD4 NC5.mp3" },
        { id: "mod4_nc6", module: "Módulo 4", title: "Módulo 4 NC6", durationSeconds: 0, imgSrc: "Imgs/estudio.png", audioSrc: "Audios/MOD4 NC6.mp3" },
        // Add Module 5, 6 etc. here following the same pattern if needed
    ];

    // --- DOM Elements ---
    const audioPlayer = document.getElementById("audio-player");
    const nowPlayingSection = document.getElementById("now-playing-section");
    const playerImage = document.getElementById("player-image");
    const playerTitle = document.getElementById("player-title");
    const playerModule = document.getElementById("player-module");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playPauseIcon = playPauseBtn.querySelector("i");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const repeatBtn = document.getElementById("repeat-btn");
    const shuffleBtn = document.getElementById("shuffle-btn");
    const progressBar = document.getElementById("progress-bar");
    const progress = document.getElementById("progress");
    const currentTimeEl = document.getElementById("current-time");
    const totalDurationEl = document.getElementById("total-duration");
    const volumeBtn = document.getElementById("volume-btn");
    const volumeIcon = volumeBtn.querySelector("i");
    const volumeBar = document.getElementById("volume-bar");
    const volumeLevel = document.getElementById("volume-level");
    const moduleNav = document.querySelector(".module-nav");
    const audiobooksContainer = document.getElementById("audiobooks-container");
    const currentYearEl = document.getElementById("current-year");
    const playerToggleBtn = document.getElementById("player-toggle-btn"); // Added toggle button
    const playerToggleIcon = playerToggleBtn?.querySelector("i"); // Added toggle icon

    // --- Player State ---
    let currentAudiobook = null;
    let currentPlaylist = []; // Holds the IDs of audiobooks in the current view/module
    let currentIndex = -1;
    let isPlaying = false;
    let isRepeat = false;
    let isShuffle = false;
    let currentVolume = 0.7;
    let isSeeking = false;
    let isPlayerExpanded = false; // State for mobile player collapse/expand
    let resizeTimeout; // For debouncing resize events

    // --- Helper Functions ---
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds <= 0) return "--:--";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    function getAudiobookById(id) {
        return audiobooksData.find(book => book.id === id);
    }

    // --- UI Rendering ---
    function createAudiobookCard(audiobook) {
        const card = document.createElement("div");
        card.className = "audiobook-card";
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
        card.addEventListener("click", (event) => {
            // Prevent click from propagating if play button was clicked
            if (event.target.closest(".play-btn-card")) {
                 event.stopPropagation(); // Stop card click if button is clicked
            }
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

        // Add listener specifically to the play button within the card
        const playButton = card.querySelector(".play-btn-card");
        if (playButton) {
            playButton.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent card click listener from firing
                currentIndex = currentPlaylist.indexOf(audiobook.id);
                 if (currentIndex === -1) {
                    console.warn(`Audiobook ${audiobook.id} not found in current playlist. Resetting playlist.`);
                    currentPlaylist = audiobooksData.map(b => b.id); // Reset to all
                    currentIndex = currentPlaylist.indexOf(audiobook.id);
                }

                if (currentIndex !== -1) {
                    // If this card is already the current one, toggle play/pause
                    if (currentAudiobook?.id === audiobook.id) {
                        togglePlayPause();
                    } else {
                        // Otherwise, load and play this audiobook
                        loadAudiobook(audiobook.id);
                    }
                } else {
                     console.error(`Could not find index for ${audiobook.id} even after reset.`);
                }
            });
        }

        return card;
    }

     function renderAudiobooks(filterModule = "all") {
        const currentScrollY = window.scrollY; // Store scroll position
        audiobooksContainer.innerHTML = "";
        moduleNav.innerHTML = ""; // Clear existing buttons

        const allBtn = document.createElement("button");
        allBtn.className = "module-btn";
        allBtn.textContent = "Todos";
        allBtn.dataset.module = "all";
        if (filterModule === "all") allBtn.classList.add("active");
        allBtn.addEventListener("click", () => renderAudiobooks("all"));
        moduleNav.appendChild(allBtn);

        const modules = [...new Set(audiobooksData.map(book => book.module))].sort((a, b) => {
            if (a === "Introdução") return -1;
            if (b === "Introdução") return 1;
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
        });

        const filteredData = (filterModule === "all")
            ? audiobooksData
            : audiobooksData.filter(book => book.module === filterModule);

        currentPlaylist = filteredData.map(book => book.id);

        modules.forEach(mod => {
            const btn = document.createElement("button");
            btn.className = "module-btn";
            btn.textContent = mod;
            btn.dataset.module = mod;
            if (mod === filterModule) btn.classList.add("active");
            btn.addEventListener("click", () => renderAudiobooks(mod));
            moduleNav.appendChild(btn);
        });

        const groupedByModule = filteredData.reduce((acc, book) => {
            acc[book.module] = acc[book.module] || [];
            acc[book.module].push(book);
            return acc;
        }, {});

        modules.forEach(mod => {
            if (!groupedByModule[mod]) return;

            const section = document.createElement("section");
            section.className = "audiobooks-section";
            section.dataset.moduleId = mod;

            const sectionTitle = document.createElement("h2"); // Create title element
            sectionTitle.className = "section-title";
            sectionTitle.textContent = mod;
            section.appendChild(sectionTitle); // Add title first

            const carouselContainer = document.createElement("div");
            carouselContainer.className = "carousel-container";

            const carousel = document.createElement("div");
            carousel.className = "carousel";

            // Populate the carousel with cards (and their listeners)
            groupedByModule[mod].forEach(book => {
                carousel.appendChild(createAudiobookCard(book));
            });

            carouselContainer.appendChild(carousel);
            section.appendChild(carouselContainer);
            audiobooksContainer.appendChild(section);
        });

        updateCarouselButtonsVisibility(); // Update buttons after rendering
        updatePlayingCardStyle();
        window.scrollTo(0, currentScrollY); // Restore scroll position
    }

    // Function to calculate how many cards are visible in a carousel
    function calculateVisibleCards(carousel) {
        if (!carousel) return 1;
        const containerWidth = carousel.offsetWidth;
        const cardElement = carousel.querySelector(".audiobook-card");
        if (!cardElement) return 1;
        const cardStyle = window.getComputedStyle(cardElement);
        const cardWidth = parseFloat(cardStyle.width) || 220;
        const cardGap = parseFloat(window.getComputedStyle(carousel).gap) || 20;
        return Math.max(1, Math.floor(containerWidth / (cardWidth + cardGap)));
    }

    // Function to show/hide carousel buttons based on visibility
    function updateCarouselButtonsVisibility() {
        document.querySelectorAll(".carousel-container").forEach(container => {
            const carousel = container.querySelector(".carousel");
            const cards = carousel.querySelectorAll(".audiobook-card");
            const visibleCards = calculateVisibleCards(carousel);
            const needsButtons = cards.length > visibleCards;

            let prevBtn = container.querySelector(".carousel-btn.prev");
            let nextBtn = container.querySelector(".carousel-btn.next");

            if (needsButtons) {
                if (!prevBtn) {
                    prevBtn = document.createElement("button");
                    prevBtn.className = "carousel-btn prev";
                    prevBtn.setAttribute("aria-label", "Anterior");
                    prevBtn.innerHTML = "❮";
                    const scrollAmount = (carousel.querySelector(".audiobook-card")?.offsetWidth + parseFloat(window.getComputedStyle(carousel).gap || 20)) * Math.floor(visibleCards * 0.8) || 500;
                    prevBtn.addEventListener("click", () => carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
                    container.insertBefore(prevBtn, carousel);
                }
                if (!nextBtn) {
                    nextBtn = document.createElement("button");
                    nextBtn.className = "carousel-btn next";
                    nextBtn.setAttribute("aria-label", "Próximo");
                    nextBtn.innerHTML = "❯";
                    const scrollAmount = (carousel.querySelector(".audiobook-card")?.offsetWidth + parseFloat(window.getComputedStyle(carousel).gap || 20)) * Math.floor(visibleCards * 0.8) || 500;
                    nextBtn.addEventListener("click", () => carousel.scrollBy({ left: scrollAmount, behavior: "smooth" }));
                    container.appendChild(nextBtn);
                }
                prevBtn.style.display = "flex";
                nextBtn.style.display = "flex";
            } else {
                if (prevBtn) prevBtn.style.display = "none";
                if (nextBtn) nextBtn.style.display = "none";
            }
        });
    }

    // --- Audio Playback Logic ---
    function loadAudiobook(id) {
        const audiobook = getAudiobookById(id);
        if (!audiobook) {
            console.error("Audiobook not found:", id);
            return;
        }

        // If clicking the currently loaded track and it's paused, just play
        if (currentAudiobook?.id === id && !isPlaying) {
            playAudio();
            return;
        }
        // If clicking the currently playing track, do nothing (handled by card's play button listener)
        if (currentAudiobook?.id === id && isPlaying) {
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
        progress.style.width = "0%";

        audioPlayer.currentTime = 0;
        playAudio(); // Start playing the new track

        nowPlayingSection.style.display = "flex";
        // Ensure player starts collapsed on mobile if not already expanded
        if (window.innerWidth <= 768 && !isPlayerExpanded) {
            collapsePlayer();
        } else {
            expandPlayer(); // Ensure expanded on desktop or if already set
        }
        updatePlayingCardStyle();
    }

    function playAudio() {
        if (!currentAudiobook) return;
        const playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                playPauseIcon.classList.replace("fa-play", "fa-pause");
                playPauseBtn.setAttribute("aria-label", "Pausar");
                updatePlayingCardStyle();
            }).catch(error => {
                console.error("Playback failed (Browser restriction? File exists?):", error);
                // Don't automatically pause if it fails, let user retry?
                // isPlaying = false;
                // playPauseIcon.classList.replace("fa-pause", "fa-play");
                // playPauseBtn.setAttribute("aria-label", "Reproduzir");
                // updatePlayingCardStyle();
            });
        }
    }

    function pauseAudio() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.classList.replace("fa-pause", "fa-play");
        playPauseBtn.setAttribute("aria-label", "Reproduzir");
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
             // If seeking, update progress bar visually but don't change audio time here
             if (isSeeking && duration > 0) {
                 const percentage = (audioPlayer.currentTime / duration) * 100;
                 progress.style.width = `${percentage}%`;
             }
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

        // Update visually immediately
        progress.style.width = `${percentage * 100}%`;
        currentTimeEl.textContent = formatTime(seekTime);

        // Update audio player time only if duration is valid
        if(audioPlayer.duration && isFinite(audioPlayer.duration)) {
            audioPlayer.currentTime = seekTime;
        }
    }

     function handleSeekStart(event) {
        const duration = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : currentAudiobook?.durationSeconds || 0;
        if (!currentAudiobook || duration <= 0) return;
        isSeeking = true;
        seek(event); // Seek immediately on press
        // Add move/end listeners
        document.addEventListener("mousemove", handleSeeking);
        document.addEventListener("touchmove", handleSeeking);
        document.addEventListener("mouseup", handleSeekEnd);
        document.addEventListener("touchend", handleSeekEnd);
    }

    function handleSeeking(event) {
        if (!isSeeking) return;
        seek(event);
    }

    function handleSeekEnd() {
        if (!isSeeking) return;
        isSeeking = false;
        // Remove move/end listeners
        document.removeEventListener("mousemove", handleSeeking);
        document.removeEventListener("touchmove", handleSeeking);
        document.removeEventListener("mouseup", handleSeekEnd);
        document.removeEventListener("touchend", handleSeekEnd);
        // Final check to ensure audio time matches progress bar if needed
        const duration = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : currentAudiobook?.durationSeconds || 0;
        if (duration > 0) {
             const percentage = parseFloat(progress.style.width) / 100;
             const expectedTime = percentage * duration;
             // Small tolerance to avoid unnecessary seeks due to rounding
             if (Math.abs(audioPlayer.currentTime - expectedTime) > 0.5) {
                 audioPlayer.currentTime = expectedTime;
             }
        }
    }

    function setVolume(event) {
        const volumeBarRect = volumeBar.getBoundingClientRect();
        const clickX = (event.touches ? event.touches[0].clientX : event.clientX) - volumeBarRect.left;
        const width = volumeBarRect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));
        currentVolume = percentage;
        audioPlayer.volume = currentVolume;
        volumeLevel.style.width = `${percentage * 100}%`;
        updateVolumeIcon();
    }

    function handleVolumeDragStart(event) {
        setVolume(event); // Set volume immediately
        document.addEventListener("mousemove", setVolume);
        document.addEventListener("touchmove", setVolume);
        document.addEventListener("mouseup", handleVolumeDragEnd);
        document.addEventListener("touchend", handleVolumeDragEnd);
    }

    function handleVolumeDragEnd() {
        document.removeEventListener("mousemove", setVolume);
        document.removeEventListener("touchmove", setVolume);
        document.removeEventListener("mouseup", handleVolumeDragEnd);
        document.removeEventListener("touchend", handleVolumeDragEnd);
    }

    function toggleMute() {
        if (audioPlayer.volume > 0) {
            audioPlayer.volume = 0;
            volumeLevel.style.width = "0%";
            updateVolumeIcon();
        } else {
            // Restore to previous non-zero volume, or default if it was 0
            const restoreVolume = currentVolume > 0 ? currentVolume : 0.7;
            audioPlayer.volume = restoreVolume;
            volumeLevel.style.width = `${restoreVolume * 100}%`;
            // Update currentVolume only if restoring from mute
            if (currentVolume === 0) currentVolume = restoreVolume;
            updateVolumeIcon();
        }
    }

    function updateVolumeIcon() {
        if (!volumeIcon) return;
        if (audioPlayer.volume === 0) {
            volumeIcon.className = "fas fa-volume-xmark"; // Use consistent assignment
        } else if (audioPlayer.volume < 0.5) {
            volumeIcon.className = "fas fa-volume-low";
        } else {
            volumeIcon.className = "fas fa-volume-high";
        }
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle("active", isRepeat);
        audioPlayer.loop = isRepeat;
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active", isShuffle);
    }

    function playNext() {
        if (!currentAudiobook || currentPlaylist.length === 0) return;
        let nextIndex;
        if (isShuffle) {
            // Simple shuffle: pick a random index different from current
            if (currentPlaylist.length <= 1) {
                 // If only one track, restart if not repeating
                 if (!isRepeat) audioPlayer.currentTime = 0;
                 playAudio(); // Re-play or continue loop
                 return;
            }
            do {
                nextIndex = Math.floor(Math.random() * currentPlaylist.length);
            } while (nextIndex === currentIndex);
        } else {
            nextIndex = (currentIndex + 1) % currentPlaylist.length;
        }
        currentIndex = nextIndex;
        loadAudiobook(currentPlaylist[currentIndex]);
    }

    function playPrev() {
        if (!currentAudiobook || currentPlaylist.length === 0) return;
        // If played for more than 3 seconds, restart current track, otherwise go to previous
        if (audioPlayer.currentTime > 3 && !isShuffle) { // Restart only works well without shuffle
            audioPlayer.currentTime = 0;
            playAudio();
            return;
        }

        let prevIndex;
        if (isShuffle) {
             // Simple shuffle: pick a random index different from current
            if (currentPlaylist.length <= 1) {
                 if (!isRepeat) audioPlayer.currentTime = 0;
                 playAudio();
                 return;
            }
            do {
                prevIndex = Math.floor(Math.random() * currentPlaylist.length);
            } while (prevIndex === currentIndex);
        } else {
            prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        }
        currentIndex = prevIndex;
        loadAudiobook(currentPlaylist[currentIndex]);
    }

    function handleAudioEnd() {
        if (!isRepeat) {
            playNext();
        } else {
            // If repeat is on, the browser loop attribute handles it, but we reset visually
            audioPlayer.currentTime = 0;
            playAudio();
        }
    }

    function updatePlayingCardStyle() {
        document.querySelectorAll(".audiobook-card").forEach(card => {
            const playIcon = card.querySelector(".play-btn-card i");
            if (card.dataset.id === currentAudiobook?.id) {
                card.classList.add("playing");
                if (playIcon) {
                    playIcon.className = isPlaying ? "fas fa-pause" : "fas fa-play";
                }
            } else {
                card.classList.remove("playing");
                 if (playIcon) {
                    playIcon.className = "fas fa-play";
                }
            }
        });
    }

    // --- Player Collapse/Expand Logic (Mobile) ---
    function collapsePlayer() {
        if (!nowPlayingSection || !playerToggleBtn || !playerToggleIcon) return;
        nowPlayingSection.classList.remove("expanded");
        nowPlayingSection.classList.add("collapsed");
        playerToggleIcon.classList.replace("fa-chevron-down", "fa-chevron-up");
        playerToggleBtn.setAttribute("aria-label", "Expandir player");
        document.body.classList.remove("player-expanded");
        isPlayerExpanded = false;
    }

    function expandPlayer() {
        if (!nowPlayingSection || !playerToggleBtn || !playerToggleIcon) return;
        nowPlayingSection.classList.remove("collapsed");
        nowPlayingSection.classList.add("expanded");
        playerToggleIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
        playerToggleBtn.setAttribute("aria-label", "Recolher player");
        document.body.classList.add("player-expanded");
        isPlayerExpanded = true;
    }

    function togglePlayerView() {
        if (isPlayerExpanded) {
            collapsePlayer();
        } else {
            expandPlayer();
        }
    }

    // --- Event Listeners ---
    playPauseBtn.addEventListener("click", togglePlayPause);
    prevBtn.addEventListener("click", playPrev);
    nextBtn.addEventListener("click", playNext);
    repeatBtn.addEventListener("click", toggleRepeat);
    shuffleBtn.addEventListener("click", toggleShuffle);
    audioPlayer.addEventListener("timeupdate", updateProgress);
    audioPlayer.addEventListener("ended", handleAudioEnd);
    audioPlayer.addEventListener("loadedmetadata", () => {
        // Update duration from metadata if available and more accurate
        const duration = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : currentAudiobook?.durationSeconds || 0;
        totalDurationEl.textContent = formatTime(duration);
        // Update duration in original data if it was 0
        if (currentAudiobook && currentAudiobook.durationSeconds === 0 && duration > 0) {
            currentAudiobook.durationSeconds = duration;
            // Optionally re-render card to show duration, or update directly
            const cardDurationEl = document.querySelector(`.audiobook-card[data-id="${currentAudiobook.id}"] .audiobook-duration span`);
            if (cardDurationEl) cardDurationEl.textContent = formatTime(duration);
        }
    });

    // Progress bar seeking
    progressBar.addEventListener("mousedown", handleSeekStart);
    progressBar.addEventListener("touchstart", handleSeekStart, { passive: true });

    // Volume control
    volumeBtn.addEventListener("click", toggleMute);
    volumeBar.addEventListener("mousedown", handleVolumeDragStart);
    volumeBar.addEventListener("touchstart", handleVolumeDragStart, { passive: true });

    // Player toggle button (Mobile)
    if (playerToggleBtn) {
        playerToggleBtn.addEventListener("click", togglePlayerView);
    }

    // Initial setup
    audioPlayer.volume = currentVolume;
    volumeLevel.style.width = `${currentVolume * 100}%`;
    updateVolumeIcon();
    renderAudiobooks(); // Initial render with all modules
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Set initial player state based on screen size
    if (window.innerWidth <= 768) {
        collapsePlayer();
    } else {
        expandPlayer(); // Default to expanded on larger screens
    }

    // Debounced resize handler
    function handleResize() {
        // Adjust player state immediately
         if (window.innerWidth > 768) {
            expandPlayer(); // Ensure expanded on desktop
        } else {
            // On mobile, retain current state unless forced
            // This logic seems okay, maybe simplify?
             if (isPlayerExpanded) {
                expandPlayer();
            } else {
                collapsePlayer();
            }
        }
        // Update carousel buttons visibility without full re-render
        updateCarouselButtonsVisibility();
    }

    // Add resize listener with debounce
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150); // Debounce resize events (150ms delay)
    });

});

