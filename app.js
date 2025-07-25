// Translation data
const translations = {
    en: {
        title: "Yoga Asanas",
        subtitle: "Explore 80 traditional yoga poses for mind and body wellness.",
        searchPlaceholder: "Search for yoga poses...",
        filterLabel: "Filter by difficulty",
        allLevels: "All Levels",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        favorites: "Favorites",
        showFavorites: "Show Favorites Only",
        timeLabel: "Time:",
        difficultyLabel: "Difficulty:",
        completionLabel: "Time to Complete:",
        viewInstructions: "View Instructions",
        instructionsTitle: "Instructions",
        addToFavorites: "Add to Favorites",
        removeFromFavorites: "Remove from Favorites",
        healthBenefits: "Health Benefits",
        breathingTitle: "Breathing Technique",
        contraindicationsTitle: "Contraindications",
        recommendedForTitle: "Recommended For",
        closeModal: "Close",
        noResults: "No poses found. Try adjusting your search or filters.",
        loading: "Loading Poses...",
        language: "മലയാളം"
    },
    ml: {
        title: "യോഗാസനങ്ങൾ",
        subtitle: "ശരീരത്തിനും മനസ്സിനും ആരോഗ്യമേകുന്ന 80 പരമ്പരാഗത യോഗാസനങ്ങൾ.",
        searchPlaceholder: "യോഗാസനങ്ങൾ തിരയുക...",
        filterLabel: "ബുദ്ധിമുട്ട് അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക",
        allLevels: "എല്ലാ തലങ്ങളും",
        beginner: "തുടക്കക്കാരൻ",
        intermediate: "ഇടത്തരം",
        advanced: "വിദഗ്ദ്ധൻ",
        favorites: "പ്രിയങ്കരങ്ങൾ",
        showFavorites: "പ്രിയങ്കരങ്ങൾ മാത്രം കാണിക്കുക",
        timeLabel: "സമയം:",
        difficultyLabel: "ബുദ്ധിമുട്ട്:",
        completionLabel: "പൂർത്തിയാക്കാൻ വേണ്ട സമയം:",
        viewInstructions: "നിർദ്ദേശങ്ങൾ കാണുക",
        instructionsTitle: "നിർദ്ദേശങ്ങൾ",
        addToFavorites: "പ്രിയങ്കരങ്ങളിലേക്ക് ചേർക്കുക",
        removeFromFavorites: "പ്രിയങ്കരങ്ങളിൽ നിന്ന് നീക്കം ചെയ്യുക",
        healthBenefits: "ആരോഗ്യ ഗുണങ്ങൾ",
        breathingTitle: "ശ്വസന സാങ്കേതികത",
        contraindicationsTitle: "ഒഴിവാക്കേണ്ടവ",
        recommendedForTitle: "ശുപാർശ ചെയ്യുന്നത്",
        closeModal: "അടയ്ക്കുക",
        noResults: "ആസനങ്ങളൊന്നും കണ്ടെത്തിയില്ല. നിങ്ങളുടെ തിരയൽ മാറ്റം വരുത്തുക.",
        loading: "ആസനങ്ങൾ ലോഡ് ചെയ്യുന്നു...",
        language: "English"
    }
};

// Application state
let poses = [];
let filteredPoses = [];
let favorites = [];
let currentLanguage = 'en';
let searchTerm = '';
let selectedDifficulty = 'All';
let showFavoritesOnly = false;
let selectedPose = null;

// DOM elements
const elements = {
    loadingScreen: null,
    appContainer: null,
    searchInput: null,
    difficultySelect: null,
    favoritesBtn: null,
    posesGrid: null,
    noResults: null,
    modal: null,
    languageToggle: null
};

// Utility functions
function $(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found!`);
    }
    return element;
}

function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}

function getDifficultyTranslation(difficulty) {
    const difficultyMap = {
        'Beginner': currentLanguage === 'en' ? 'Beginner' : 'തുടക്കക്കാരൻ',
        'Intermediate': currentLanguage === 'en' ? 'Intermediate' : 'ഇടത്തരം',
        'Advanced': currentLanguage === 'en' ? 'Advanced' : 'വിദഗ്ദ്ധൻ'
    };
    return difficultyMap[difficulty] || difficulty;
}

function getDifficultyClass(difficulty) {
    const classMap = {
        'Beginner': 'bg-green-500',
        'Intermediate': 'bg-orange-500',
        'Advanced': 'bg-red-500'
    };
    return classMap[difficulty] || 'bg-green-500';
}

// Instruction parsing
function parseInstructions(instructionsText) {
    const groups = [];
    let currentGroup = null;
    
    const lines = instructionsText.split('\n').filter(line => line.trim() !== '');
    
    lines.forEach(line => {
        const isSubStep = line.trim().startsWith('•');
        let content = line.replace(/^[0-9]+\.\s*|•\s*/, '').trim();
        
        // Remove markdown formatting
        content = content.replace(/\*\*(.*?)\*\*/g, '$1');
        
        if (!isSubStep) {
            if (currentGroup) {
                groups.push(currentGroup);
            }
            currentGroup = { main: content, subs: [] };
        } else {
            if (currentGroup) {
                currentGroup.subs.push(content);
            }
        }
    });
    
    if (currentGroup) {
        groups.push(currentGroup);
    }
    
    return groups;
}

// Local storage functions
function loadFavorites() {
    try {
        const saved = localStorage.getItem('yoga-favorites');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        return [];
    }
}

function saveFavorites() {
    try {
        localStorage.setItem('yoga-favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

function toggleFavorite(poseId) {
    const index = favorites.indexOf(poseId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(poseId);
    }
    saveFavorites();
    updateUI();
}

// UI update functions
function updateTranslations() {
    const t = translations[currentLanguage];
    
    // Update main UI
    $('main-title').textContent = t.title;
    $('main-subtitle').textContent = t.subtitle;
    $('language-text').textContent = t.language;
    $('search-input').placeholder = t.searchPlaceholder;
    $('favorites-text').textContent = t.favorites;
    $('favorites-label').textContent = t.favorites;
    $('beginner-label').textContent = t.beginner;
    $('advanced-label').textContent = t.advanced;
    $('loading-text').textContent = t.loading;
    $('no-results-text').textContent = t.noResults;
    
    // Update difficulty filter options
    const difficultySelect = $('difficulty-select');
    if (difficultySelect) {
        const currentValue = difficultySelect.value; // Preserve current selection
        difficultySelect.options[0].textContent = t.allLevels;
        difficultySelect.options[1].textContent = t.beginner;
        difficultySelect.options[2].textContent = t.intermediate;
        difficultySelect.options[3].textContent = t.advanced;
        difficultySelect.value = currentValue; // Restore selection
    }
    
    // Update modal translations
    $('modal-time-label').textContent = t.timeLabel;
    $('modal-difficulty-label').textContent = t.difficultyLabel;
    $('modal-completion-label').textContent = t.completionLabel;
    $('modal-instructions-heading').textContent = t.instructionsTitle;
    $('modal-health-benefits-heading').textContent = t.healthBenefits;
    $('modal-breathing-heading').textContent = t.breathingTitle;
    $('modal-recommended-heading').textContent = t.recommendedForTitle;
    $('modal-contraindications-heading').textContent = t.contraindicationsTitle;
}

function updateStats() {
    console.log('Updating stats, poses length:', poses.length);
    $('total-poses').textContent = poses.length;
    $('favorites-count').textContent = favorites.length;
    $('beginner-count').textContent = poses.filter(p => p.difficulty === 'Beginner').length;
    $('advanced-count').textContent = poses.filter(p => p.difficulty === 'Advanced').length;
    
    const favoritesBadge = $('favorites-badge');
    if (favorites.length > 0) {
        favoritesBadge.textContent = favorites.length;
        favoritesBadge.style.display = 'flex';
    } else {
        favoritesBadge.style.display = 'none';
    }
}

function filterPoses() {
    console.log('Filtering poses, total poses:', poses.length);
    console.log('selectedDifficulty:', selectedDifficulty);
    console.log('searchTerm:', searchTerm);
    console.log('showFavoritesOnly:', showFavoritesOnly);
    
    filteredPoses = poses.filter(pose => {
        console.log('Checking pose:', pose.englishName, 'difficulty:', pose.difficulty);
        
        // Difficulty filter
        if (selectedDifficulty !== 'All' && pose.difficulty !== selectedDifficulty) {
            console.log('Filtered out by difficulty:', pose.englishName);
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                pose.englishName.toLowerCase().includes(searchLower) ||
                pose.malayalamName.toLowerCase().includes(searchLower) ||
                (pose.sanskritName && pose.sanskritName.toLowerCase().includes(searchLower)) ||
                (pose.recommendedFor && pose.recommendedFor.english && pose.recommendedFor.english.toLowerCase().includes(searchLower)) ||
                (pose.recommendedFor && pose.recommendedFor.malayalam && pose.recommendedFor.malayalam.toLowerCase().includes(searchLower));
            
            if (!matchesSearch) {
                console.log('Filtered out by search:', pose.englishName);
                return false;
            }
        }
        
        // Favorites filter
        if (showFavoritesOnly && !favorites.includes(pose.id)) {
            console.log('Filtered out by favorites:', pose.englishName);
            return false;
        }
        
        return true;
    });
    
    console.log('Filtered poses count:', filteredPoses.length);
}

function createPoseCard(pose, index) {
    try {
        console.log('Creating card for pose:', pose.englishName);
        
        const isFavorited = favorites.includes(pose.id);
        const difficultyClass = getDifficultyClass(pose.difficulty);
        const displayName = currentLanguage === 'ml' ? pose.malayalamName : pose.englishName;
        const displaySubtitle = currentLanguage === 'ml' ? pose.englishName : (pose.sanskritName || pose.malayalamName);
        const recommendedForData = pose.recommendedFor ? pose.recommendedFor[currentLanguage === 'en' ? 'english' : 'malayalam'] : '';
        const recommendedText = Array.isArray(recommendedForData) ? recommendedForData.join(' ') : recommendedForData;
        
        // Check for enhanced high-resolution image
        const enhancedImage = window.getEnhancedPoseImage ? window.getEnhancedPoseImage(pose.id) : null;
        const imageUrl = enhancedImage ? enhancedImage.url : pose.imageUrl;
        
        return `
            <div class="pose-card" onclick="openModal('${pose.id}')">
                <div class="pose-image-container">
                    <div class="pose-card-number">${index + 1}</div>
                    <img 
                        loading="lazy" 
                        class="pose-image" 
                        src="${imageUrl}" 
                        alt="${pose.englishName}"
                        onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'; this.onerror=null;"
                    />
                    <div class="difficulty-badge ${difficultyClass}">
                        ${getDifficultyTranslation(pose.difficulty)}
                    </div>
                    <button 
                        class="card-favorite-btn ${isFavorited ? 'favorited' : ''}"
                        onclick="event.stopPropagation(); toggleFavorite('${pose.id}')"
                        title="${isFavorited ? getTranslation('removeFromFavorites') : getTranslation('addToFavorites')}"
                    >
                        <i class="material-icons">${isFavorited ? 'favorite' : 'favorite_border'}</i>
                    </button>
                </div>
                <div class="pose-details">
                    <h3 class="pose-title">${displayName}</h3>
                    <p class="pose-subtitle">${displaySubtitle}</p>
                    <div class="pose-info-grid">
                        <div class="pose-info-item">
                            <i class="material-icons">schedule</i>
                            <span>${getTranslation('timeLabel')}</span>
                            <strong>${pose.time}</strong>
                        </div>
                        <div class="pose-info-item">
                            <i class="material-icons">trending_up</i>
                            <span>${getTranslation('difficultyLabel')}</span>
                            <strong>${getDifficultyTranslation(pose.difficulty)}</strong>
                        </div>
                        <div class="pose-info-item">
                            <i class="material-icons">event</i>
                            <span>${getTranslation('completionLabel')}</span>
                            <strong>${pose.timeToComplete}</strong>
                        </div>
                    </div>
                    <div class="pose-preview">
                        <p class="pose-recommended">
                            <i class="material-icons">star</i>
                            ${recommendedText ? recommendedText.substring(0, 150) + '...' : ''}
                        </p>
                    </div>
                    <div class="instructions-container">
                        <button class="instructions-toggle" onclick="event.stopPropagation(); openModal('${pose.id}')">
                            <span>${getTranslation('viewInstructions')}</span>
                            <i class="material-icons">arrow_forward</i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating pose card:', error);
        return `<div class="pose-card"><p>Error loading pose: ${pose.englishName}</p></div>`;
    }
}

function renderPoses() {
    console.log('Rendering poses, filteredPoses count:', filteredPoses.length);
    const posesGrid = $('poses-grid');
    const noResults = $('no-results');
    
    if (!posesGrid) {
        console.error('poses-grid element not found!');
        return;
    }
    
    if (filteredPoses.length === 0) {
        posesGrid.innerHTML = '';
        noResults.style.display = 'block';
        console.log('No poses to display');
    } else {
        noResults.style.display = 'none';
        console.log('Rendering', filteredPoses.length, 'poses');
        
        try {
            const html = filteredPoses.map((pose, index) => {
                console.log('Creating card for pose:', pose.englishName);
                return createPoseCard(pose, index);
            }).join('');
            
            posesGrid.innerHTML = html;
            console.log('Successfully rendered poses to grid');
        } catch (error) {
            console.error('Error rendering poses:', error);
        }
    }
}

function updateUI() {
    console.log('updateUI called, poses length:', poses.length);
    filterPoses();
    renderPoses();
    updateStats();
    updateFavoritesButton();
    console.log('updateUI completed');
}

function updateFavoritesButton() {
    const favoritesBtn = $('favorites-btn');
    if (showFavoritesOnly) {
        favoritesBtn.classList.add('active');
    } else {
        favoritesBtn.classList.remove('active');
    }
}

// Step navigation functions for enhanced images
function createStepNavigation(poseId, steps) {
    const modalImageContainer = $('modal-image').parentElement;
    
    // Remove existing step navigation
    const existingNav = modalImageContainer.querySelector('.step-navigation');
    if (existingNav) {
        existingNav.remove();
    }
    
    // Create step navigation
    const stepNav = document.createElement('div');
    stepNav.className = 'step-navigation';
    stepNav.innerHTML = `
        <div class="step-controls">
            <button class="step-btn prev-step" onclick="changeStep('${poseId}', -1)">
                <i class="material-icons">chevron_left</i>
                Previous
            </button>
            <div class="step-indicators">
                ${steps.map((step, index) => `
                    <button class="step-indicator ${index === 0 ? 'active' : ''}" 
                            onclick="goToStep('${poseId}', ${index})"
                            title="${step.title}">
                        ${index + 1}
                    </button>
                `).join('')}
            </div>
            <button class="step-btn next-step" onclick="changeStep('${poseId}', 1)">
                Next
                <i class="material-icons">chevron_right</i>
            </button>
        </div>
        <div class="step-description">
            <h4 id="current-step-title">${steps[0].title}</h4>
            <p id="current-step-description">${steps[0].description}</p>
        </div>
    `;
    
    modalImageContainer.appendChild(stepNav);
    
    // Store current step
    window.currentStep = 0;
    window.currentPoseSteps = steps;
}

function removeStepNavigation() {
    const modalImageContainer = $('modal-image').parentElement;
    const existingNav = modalImageContainer.querySelector('.step-navigation');
    if (existingNav) {
        existingNav.remove();
    }
}

function changeStep(poseId, direction) {
    if (!window.currentPoseSteps) return;
    
    const newStep = Math.max(0, Math.min(window.currentPoseSteps.length - 1, window.currentStep + direction));
    goToStep(poseId, newStep);
}

function goToStep(poseId, stepIndex) {
    if (!window.currentPoseSteps || !window.currentPoseSteps[stepIndex]) return;
    
    const step = window.currentPoseSteps[stepIndex];
    
    // Update image
    $('modal-image').src = step.url;
    
    // Update step info
    const titleEl = document.getElementById('current-step-title');
    const descEl = document.getElementById('current-step-description');
    if (titleEl) titleEl.textContent = step.title;
    if (descEl) descEl.textContent = step.description;
    
    // Update indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === stepIndex);
    });
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-step');
    const nextBtn = document.querySelector('.next-step');
    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) nextBtn.disabled = stepIndex === window.currentPoseSteps.length - 1;
    
    window.currentStep = stepIndex;
}

// Modal functions
function openModal(poseId) {
    const pose = poses.find(p => p.id === poseId);
    if (!pose) return;
    
    selectedPose = pose;
    const modal = $('pose-modal');
    const isFavorited = favorites.includes(pose.id);
    
    // Update modal content
    const displayName = currentLanguage === 'ml' ? pose.malayalamName : pose.englishName;
    const displaySubtitle = currentLanguage === 'ml' ? pose.englishName : (pose.sanskritName || pose.malayalamName);
    
    $('modal-title').textContent = displayName;
    $('modal-subtitle').textContent = displaySubtitle;
    
    // Use enhanced high-resolution image if available
    const enhancedImage = window.getEnhancedPoseImage ? window.getEnhancedPoseImage(pose.id) : null;
    const imageUrl = enhancedImage ? enhancedImage.url : pose.imageUrl;
    
    $('modal-image').src = imageUrl;
    $('modal-image').alt = pose.englishName;
    $('modal-image').onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        this.onerror = null;
    };
    
    // Add step-by-step navigation if enhanced images exist
    const poseImages = window.ENHANCED_POSES_IMAGES && window.ENHANCED_POSES_IMAGES[pose.id];
    if (poseImages && poseImages.steps && poseImages.steps.length > 1) {
        createStepNavigation(pose.id, poseImages.steps);
    } else {
        removeStepNavigation();
    }
    
    $('modal-time').textContent = pose.time;
    $('modal-difficulty').textContent = getDifficultyTranslation(pose.difficulty);
    $('modal-completion').textContent = pose.timeToComplete;
    
    // Update favorite button
    const modalFavoriteBtn = $('modal-favorite-btn');
    modalFavoriteBtn.className = `favorite-btn ${isFavorited ? 'favorited' : ''}`;
    modalFavoriteBtn.innerHTML = `<i class="material-icons">${isFavorited ? 'favorite' : 'favorite_border'}</i>`;
    modalFavoriteBtn.title = isFavorited ? getTranslation('removeFromFavorites') : getTranslation('addToFavorites');
    
    // Update instructions
    const instructionsContainer = $('modal-instructions');
    const instructionsText = pose.instructions ? pose.instructions[currentLanguage === 'en' ? 'english' : 'malayalam'] : '';
    const instructionGroups = parseInstructions(instructionsText);
    
    instructionsContainer.innerHTML = instructionGroups.map((group, index) => {
        let html = `<li><strong>${group.main}</strong>`;
        if (group.subs.length > 0) {
            html += `<ul class="sub-instructions-list">`;
            html += group.subs.map(sub => `<li>${sub}</li>`).join('');
            html += `</ul>`;
        }
        html += `</li>`;
        return html;
    }).join('');
    
    // Update health benefits
    const healthBenefitsContainer = $('modal-health-benefits');
    const healthBenefits = pose.healthBenefits ? pose.healthBenefits[currentLanguage === 'en' ? 'english' : 'malayalam'] : [];
    healthBenefitsContainer.innerHTML = Array.isArray(healthBenefits) 
        ? healthBenefits.map(benefit => `<li>${benefit}</li>`).join('')
        : (healthBenefits ? `<li>${healthBenefits}</li>` : '');
    
    // Update breathing
    const breathingText = pose.breathing ? pose.breathing[currentLanguage === 'en' ? 'english' : 'malayalam'] : '';
    $('modal-breathing').textContent = breathingText;
    
    // Update recommended for
    const recommendedForData = pose.recommendedFor ? pose.recommendedFor[currentLanguage === 'en' ? 'english' : 'malayalam'] : [];
    const recommendedText = Array.isArray(recommendedForData) 
        ? recommendedForData.join('. ') + (recommendedForData.length > 0 ? '.' : '')
        : (recommendedForData || '');
    $('modal-recommended').textContent = recommendedText;
    
    // Update contraindications
    const contraindicationsData = pose.contraindications ? pose.contraindications[currentLanguage === 'en' ? 'english' : 'malayalam'] : [];
    const contraindicationsText = Array.isArray(contraindicationsData) 
        ? contraindicationsData.join('. ') + (contraindicationsData.length > 0 ? '.' : '')
        : (contraindicationsData || '');
    $('modal-contraindications').textContent = contraindicationsText;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = $('pose-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedPose = null;
}

// Event handlers
function handleLanguageToggle() {
    currentLanguage = currentLanguage === 'en' ? 'ml' : 'en';
    updateTranslations();
    updateUI();
}

function handleSearch(event) {
    searchTerm = event.target.value.trim();
    updateUI();
}

function handleDifficultyChange(event) {
    selectedDifficulty = event.target.value;
    console.log('Difficulty changed to:', selectedDifficulty);
    updateUI();
}

function handleFavoritesToggle() {
    showFavoritesOnly = !showFavoritesOnly;
    updateUI();
}

function handleModalFavoriteToggle() {
    if (selectedPose) {
        toggleFavorite(selectedPose.id);
        // Update modal favorite button
        openModal(selectedPose.id);
    }
}

// Initialize DOM elements
function initializeElements() {
    elements.loadingScreen = $('loading-screen');
    elements.appContainer = $('app-container');
    elements.searchInput = $('search-input');
    elements.difficultySelect = $('difficulty-select');
    elements.favoritesBtn = $('favorites-btn');
    elements.posesGrid = $('poses-grid');
    elements.noResults = $('no-results');
    elements.modal = $('pose-modal');
    elements.languageToggle = $('language-toggle');
}

// Event listeners setup
function setupEventListeners() {
    // Language toggle
    $('language-toggle').addEventListener('click', handleLanguageToggle);
    
    // Search
    $('search-input').addEventListener('input', handleSearch);
    
    // Difficulty filter
    const difficultySelect = $('difficulty-select');
    console.log('Difficulty select initial value:', difficultySelect ? difficultySelect.value : 'not found');
    selectedDifficulty = difficultySelect ? difficultySelect.value : 'All';
    difficultySelect.addEventListener('change', handleDifficultyChange);
    
    // Favorites toggle
    $('favorites-btn').addEventListener('click', handleFavoritesToggle);
    
    // Modal close
    $('modal-close').addEventListener('click', closeModal);
    $('modal-favorite-btn').addEventListener('click', handleModalFavoriteToggle);
    
    // Modal backdrop click
    $('pose-modal').addEventListener('click', (event) => {
        if (event.target === $('pose-modal')) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && selectedPose) {
            closeModal();
        }
    });
}

// Data loading
async function loadPoses() {
    console.log('Starting to load poses...');
    
    try {
        // Use embedded data if available
        if (typeof YOGA_POSES_DATA !== 'undefined') {
            console.log('Using embedded data...');
            poses = YOGA_POSES_DATA;
            console.log('Data loaded successfully, poses count:', poses.length);
            
            // Check for encoding issues and log sample data
            if (poses.length > 0) {
                console.log('Sample pose Malayalam name:', poses[0].malayalamName);
                console.log('Sample pose English name:', poses[0].englishName);
            }
        } else {
            // If no embedded data, show clear error message
            throw new Error('Data not available. Please either:\n1. Use a local server: run "python server.py" and access http://localhost:8081/\n2. Or keep the poses-data.js file for direct file access');
        }
        
        // Validate data structure
        if (!Array.isArray(poses) || poses.length === 0) {
            throw new Error('Invalid data structure: poses should be a non-empty array');
        }
        
        console.log('First pose:', poses[0]);
        
        // Hide loading, show app
        $('loading-screen').style.display = 'none';
        $('app-container').style.display = 'block';
        
        // Wait a moment for DOM to be ready, then initialize UI
        setTimeout(() => {
            console.log('Delayed initialization...');
            updateTranslations();
            updateUI();
            console.log('App initialized successfully');
        }, 100);
        
    } catch (error) {
        console.error('Error loading poses:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Update loading text with more specific error
        const loadingText = $('loading-text');
        loadingText.innerHTML = `
            <div style="text-align: center; max-width: 400px; margin: 0 auto;">
                <h3 style="color: #ff6b6b; margin-bottom: 1rem;">⚠️ Data Loading Error</h3>
                <p style="color: #ff6b6b; margin-bottom: 1rem;">${error.message}</p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; font-size: 0.9rem; text-align: left;">
                    <strong>Solutions:</strong><br>
                    • Use local server: Run <code>python server.py</code><br>
                    • Access via <code>http://localhost:8081/</code><br>
                    • Or keep <code>poses-data.js</code> file for direct access
                </div>
            </div>
        `;
    }
}

// Initialize application
function initializeApp() {
    try {
        console.log('Initializing app...');
        
        // Load favorites from localStorage
        favorites = loadFavorites();
        console.log('Loaded favorites:', favorites);
        
        // Initialize DOM elements
        initializeElements();
        console.log('DOM elements initialized');
        
        // Setup event listeners
        setupEventListeners();
        console.log('Event listeners setup');
        
        // Load poses data
        loadPoses();
        console.log('Loading poses...');
        
    } catch (error) {
        console.error('Error initializing app:', error);
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = 'Error initializing app: ' + error.message;
            loadingText.style.color = '#ff6b6b';
        }
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    console.error('Stack:', e.error ? e.error.stack : 'No stack trace');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Global functions for inline event handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleFavorite = toggleFavorite;
