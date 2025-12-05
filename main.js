document.addEventListener('DOMContentLoaded', () => {
    // --- COMMON INITIALIZATION ---
    // This function runs on every page.
    // Theme and Auth logic is now page-specific to avoid errors.
    if (!document.getElementById('settings-page-marker')) {
        // Apply saved theme class to body on all pages except the settings page
        // where the switcher logic handles it.
        if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
    }
    triggerPageAnimations();

    // --- PAGE-SPECIFIC INITIALIZATION ---
    // We detect which page we're on and run its specific logic.
    if (document.getElementById('home-page-marker')) {
        initializeHomePage();
    } else if (document.getElementById('sign-up-form')) {
        initializeSignUpPage();
    } else if (document.getElementById('sign-in-form')) {
        initializeSignInPage();
    } else if (document.getElementById('contact-form')) { // This also handles the settings page now
        initializeContactPage();
    } else if (document.getElementById('settings-page-marker')) {
        initializeSettingsPage();
    } else if (document.getElementById('profile-page-marker')) {
        initializeProfilePage();
    } else if (document.getElementById('chat-page-marker')) {
        initializeChatPage();
    } else if (document.querySelector('.category-page-marker')) {
        initializeCategoryPage();
    }
});

// --- COMMON FUNCTIONS (used on all pages) ---

/**
 * Sets up the theme switcher and loads the saved theme.
 */
function initializeThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
    }
}

/**
 * Sets up the Sign In/Log Out button in the settings panel.
 */
function initializeAuthButton() {
    const authButtonContainer = document.getElementById('auth-button-container');
    const profileLinkContainer = document.getElementById('profile-link-container');
    const dangerZoneContainer = document.getElementById('danger-zone-container');

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        authButtonContainer.innerHTML = `
            <button id="settings-logout-btn" class="w-full text-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">Log Out</button>
        `;
        document.getElementById('settings-logout-btn').addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'X-15-Website.html';
        });

        // Add Edit Profile link
        if (profileLinkContainer) {
            profileLinkContainer.classList.remove('hidden');
            profileLinkContainer.innerHTML = `
                <a href="profile.html" class="w-full text-center bg-[var(--tag-bg)] hover:bg-[var(--accent-color)] hover:text-[var(--header-text)] text-[var(--tag-text)] font-bold py-2 px-4 rounded transition-colors duration-200">
                    Edit Profile
                </a>`;
        }

        // Add Delete Account button and logic
        if (dangerZoneContainer) {
            dangerZoneContainer.innerHTML = `
                <div class="setting-item border-t-2 border-red-500/30 pt-4">
                    <button id="delete-account-btn" class="w-full text-center bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                        Delete Account
                    </button>
                </div>
            `;
            document.getElementById('delete-account-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
                    localStorage.removeItem('user_' + loggedInUser);
                    localStorage.removeItem('loggedInUser');
                    alert('Your account has been deleted.');
                    window.location.href = 'X-15-Website.html';
                }
            });
        }
    }
    // If not logged in, the default "Sign In" link in the HTML is used.
}

/**
 * Triggers the fade-in animations for elements on page load.
 */
function triggerPageAnimations() {
    document.body.classList.add('loaded');
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach((el, index) => {
        // Stagger card animations on pages that have them
        const isCard = el.classList.contains('language-card');
        const delay = isCard ? 400 + index * 100 : index * 100;
        el.style.transitionDelay = `${delay}ms`;
    });
}

// --- PAGE-SPECIFIC FUNCTIONS ---

/**
 * Initializes functionality for the Home Page.
 */
function initializeHomePage() {
    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top-btn');
    if (backToTopButton) {
        backToTopButton.style.display = "block";
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Authentication Check for Welcome Banner and Lock Icons
    const loggedInUser = localStorage.getItem('loggedInUser');
    const welcomeBanner = document.getElementById('welcome-banner');

    if (loggedInUser) {
        const userData = JSON.parse(localStorage.getItem('user_' + loggedInUser) || '{}');
        const pfpData = userData.pfp || 'https://via.placeholder.com/40'; // Default PFP

        if (welcomeBanner) {
        welcomeBanner.innerHTML = `
            <div class="flex items-center justify-center">
                <img src="${pfpData}" alt="pfp" class="w-8 h-8 rounded-full mr-3 object-cover">
                <span>Welcome, <strong>${loggedInUser}</strong>!</span>
                <button id="logout-btn" class="ml-4 text-sm underline hover:text-[var(--accent-light)]">Log Out</button>
            </div>
        `;
        welcomeBanner.classList.remove('hidden');
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.reload();
        });

        }
    } else {
        if (welcomeBanner) welcomeBanner.classList.add('hidden');
        const protectedLinks = ['database-languages.html', 'data-science.html', 'mobile-development.html', 'systems-development.html', 'cloud-devops.html', 'chat.html'];
        protectedLinks.forEach(link => {
            const icon = document.querySelector(`a[href="${link}"] .lock-icon`);
            if (icon) icon.classList.remove('hidden');
        });
    }
}

/**
 * Initializes functionality for the Sign-Up Page.
 */
function initializeSignUpPage() {
    const signUpForm = document.getElementById('sign-up-form');
    if (!signUpForm) return;

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !email || !password) {
            alert('Please fill out all fields.');
            return;
        }
        if (localStorage.getItem('user_' + username)) {
            alert('Username already exists. Please choose another one.');
            return;
        }

        const userData = { username, email, password };
        localStorage.setItem('user_' + username, JSON.stringify(userData));

        alert('Account created successfully! You can now sign in.');
        window.location.href = 'sign-in.html';
    });
}

/**
 * Initializes functionality for the Sign-In Page.
 */
function initializeSignInPage() {
    const signInForm = document.getElementById('sign-in-form');
    if (!signInForm) return;

    // CAPTCHA Logic
    const robotCheck = document.getElementById('robot-check');
    const captchaChallenge = document.getElementById('captcha-challenge');
    const captchaInput = document.getElementById('captcha-input');
    const verifyBtn = document.getElementById('verify-captcha-btn');
    const captchaWrapper = robotCheck.closest('.captcha-checkbox-wrapper');
    const captchaBox = captchaWrapper.closest('.captcha-box');
    let currentCaptchaText = '';

    const handleCaptchaCheck = () => {
        if (robotCheck.checked && !captchaBox.classList.contains('checked')) {
            captchaBox.classList.add('loading');
            captchaWrapper.style.pointerEvents = 'none';
            setTimeout(() => {
                captchaBox.classList.remove('loading');
                generateAndDisplayNewCaptcha();
            }, 1500);
        }
    };

    captchaWrapper.addEventListener('click', () => {
        if (!robotCheck.checked) {
            robotCheck.checked = true;
            handleCaptchaCheck();
        }
    });

    function generateCaptchaText(length = 5) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function generateAndDisplayNewCaptcha() {
        currentCaptchaText = generateCaptchaText();
        document.getElementById('captcha-svg-text').textContent = currentCaptchaText;
        captchaChallenge.classList.remove('hidden');
        captchaInput.value = '';
        captchaInput.focus();
    }

    verifyBtn.addEventListener('click', () => {
        if (captchaInput.value === currentCaptchaText) {
            captchaChallenge.classList.add('hidden');
            captchaBox.classList.add('checked');
        } else {
            alert('Incorrect CAPTCHA. A new challenge has been generated.');
            generateAndDisplayNewCaptcha();
        }
    });

    // Redirect Message Logic
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');
    const redirectMessage = document.getElementById('redirect-message');
    if (reason === 'protected' && redirectMessage) {
        redirectMessage.textContent = 'You must be signed in to view that page.';
        redirectMessage.classList.remove('hidden');
    }

    // Form Submission Logic
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!captchaBox.classList.contains('checked')) {
            alert('Please complete the "I\'m not a robot" check.');
            return;
        }

        const storedUserJSON = localStorage.getItem('user_' + username);
        if (!storedUserJSON) {
            alert('Invalid username or password.');
            triggerErrorAnimation();
            return;
        }

        const storedUser = JSON.parse(storedUserJSON);
        if (storedUser.password === password) {
            localStorage.setItem('loggedInUser', username);
            const redirectTarget = urlParams.get('redirect') || 'X-15-Website.html';
            window.location.href = redirectTarget;
        } else {
            alert('Invalid username or password.');
            triggerErrorAnimation();
        }
    });

    function triggerErrorAnimation() {
        const signInBtn = document.getElementById('sign-in-btn');
        if (signInBtn.classList.contains('shake-error')) return;
        signInBtn.classList.add('shake-error');
        setTimeout(() => signInBtn.classList.remove('shake-error'), 600);
    }
}

/**
 * Initializes functionality for the Contact Page.
 */
function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Pre-fill name if logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const contactNameInput = document.getElementById('contact-name');
        if (contactNameInput) contactNameInput.value = loggedInUser;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        const formStatus = document.getElementById('form-status');
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = '';

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });
            if (response.ok) {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = 'var(--accent-light)';
                contactForm.reset();
            } else {
                throw new Error('Server responded with an error.');
            }
        } catch (error) {
            formStatus.textContent = 'Failed to send message. Please try again later.';
            formStatus.style.color = '#ef4444';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Email';
        }
    });
}

/**
 * Initializes functionality for the new Settings Page.
 */
function initializeSettingsPage() {
    // These functions are now called ONLY on the settings page.
    initializeThemeSwitcher();
    initializeAuthButton();
}

/**
 * Initializes functionality for the new Profile Page.
 */
function initializeProfilePage() {
    // Access Control: Ensure user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'sign-in.html?reason=protected';
        return;
    }
    document.body.classList.remove('content-hidden');

    const currentUsernameEl = document.getElementById('current-username');
    const profileForm = document.getElementById('profile-form');
    const newUsernameInput = document.getElementById('new-username');
    const statusEl = document.getElementById('profile-status');
    const pfpUploadInput = document.getElementById('pfp-upload');
    const pfpPreview = document.getElementById('pfp-preview');
    const descriptionInput = document.getElementById('user-description');

    // Load existing user data
    let currentUserData = JSON.parse(localStorage.getItem('user_' + loggedInUser) || '{}');
    currentUsernameEl.textContent = loggedInUser;
    if (currentUserData.pfp) {
        pfpPreview.src = currentUserData.pfp;
    }
    if (currentUserData.description) {
        descriptionInput.value = currentUserData.description;
    }

    // Live preview for PFP upload
    pfpUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                pfpPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = newUsernameInput.value.trim();
        const newDescription = descriptionInput.value.trim();
        const newPfpFile = pfpUploadInput.files[0];

        statusEl.textContent = '';

        const processUpdate = (pfpData) => {
            let finalUsername = loggedInUser;
            // --- Handle Username Change ---
            if (newUsername && newUsername !== loggedInUser) {
                if (localStorage.getItem('user_' + newUsername)) {
                    statusEl.textContent = 'This username is already taken. Please choose another.';
                    statusEl.style.color = '#ef4444'; // Red
                    return;
                }
                finalUsername = newUsername;
            }

            // --- Update User Data Object ---
            currentUserData.username = finalUsername;
            currentUserData.description = newDescription;
            if (pfpData) {
                currentUserData.pfp = pfpData;
            }

            // --- Save to localStorage ---
            localStorage.setItem('user_' + finalUsername, JSON.stringify(currentUserData));
            // If username changed, remove old record and update session
            if (finalUsername !== loggedInUser) {
                localStorage.removeItem('user_' + loggedInUser);
                localStorage.setItem('loggedInUser', finalUsername);
            }

            statusEl.textContent = 'Profile updated successfully!';
            statusEl.style.color = 'var(--accent-light)';
            currentUsernameEl.textContent = finalUsername;
            newUsernameInput.value = '';
        };

        // If a new PFP was selected, read it as Base64, then process the update.
        if (newPfpFile) {
            const reader = new FileReader();
            reader.onload = (event) => processUpdate(event.target.result);
            reader.readAsDataURL(newPfpFile);
        } else {
            // Otherwise, process the update without changing the PFP.
            processUpdate(null);
        }
    });
}

/**
 * Initializes functionality for the new Chat Page.
 */
function initializeChatPage() {
    // Access Control: Ensure user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'sign-in.html?redirect=chat.html&reason=protected';
        return;
    }
    document.body.classList.remove('content-hidden');

    const messagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const currentUserData = JSON.parse(localStorage.getItem('user_' + loggedInUser) || '{}');

    const renderMessages = () => {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageEl = document.createElement('div');
            const isCurrentUser = msg.username === loggedInUser;
            
            messageEl.className = `flex items-start mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`;
            
            const pfp = msg.pfp || 'https://via.placeholder.com/40';
            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const messageContent = `
                <div class="flex items-end ${isCurrentUser ? 'flex-row-reverse' : ''}">
                    <img src="${pfp}" alt="${msg.username}" class="w-8 h-8 rounded-full object-cover ${isCurrentUser ? 'ml-3' : 'mr-3'}">
                    <div class="p-3 rounded-lg ${isCurrentUser ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--border-color)]'}">
                        <div class="font-bold text-sm">${msg.username}</div>
                        <p class="text-md">${msg.text}</p>
                        <div class="text-xs opacity-70 mt-1 text-right">${time}</div>
                    </div>
                </div>
            `;
            messageEl.innerHTML = messageContent;
            messagesContainer.appendChild(messageEl);
        });
        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        const newMessage = {
            username: loggedInUser,
            text: messageText,
            pfp: currentUserData.pfp,
            timestamp: new Date().toISOString(),
        };

        messages.push(newMessage);
        localStorage.setItem('chat_messages', JSON.stringify(messages));

        renderMessages();
        chatInput.value = '';
    });

    // Listen for changes from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'chat_messages') {
            renderMessages();
        }
    });

    // Initial render
    renderMessages();
}

/**
 * Initializes functionality for the Category Pages (Web Dev, Data Science, etc.).
 */
function initializeCategoryPage() {
    // Access Control
    const isUserLoggedIn = localStorage.getItem('loggedInUser');
    if (!isUserLoggedIn) {
        const currentPath = window.location.pathname.split('/').pop();
        window.location.href = `sign-in.html?redirect=${currentPath}&reason=protected`;
        return;
    } else {
        document.body.classList.remove('content-hidden');
    }

    // Example Toggle Logic
    document.querySelectorAll('.example-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const exampleDiv = toggle.nextElementSibling;
            const isVisible = exampleDiv.style.maxHeight && exampleDiv.style.maxHeight !== '0px';
            if (isVisible) {
                exampleDiv.style.maxHeight = '0';
                exampleDiv.style.padding = '0';
            } else {
                exampleDiv.style.maxHeight = exampleDiv.scrollHeight + 'px';
                exampleDiv.style.padding = '1rem';
            }
        });
    });

    // Copy Button Logic
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.nextElementSibling.querySelector('code');
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                btn.textContent = 'Copied!';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            }).catch(err => console.error('Failed to copy text: ', err));
        });
    });

    // Search and Filter Logic
    const searchBar = document.getElementById('search-bar');
    const languageCards = document.querySelectorAll('.language-card');
    const noResultsMessage = document.getElementById('no-results');
    const activeFilterContainer = document.getElementById('active-filter-container');

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let hasVisibleCards = false;
            languageCards.forEach(card => {
                const isMatch = card.textContent.toLowerCase().includes(searchTerm);
                card.classList.toggle('hidden-by-search', !isMatch);
                if (isMatch) hasVisibleCards = true;
            });
            noResultsMessage.classList.toggle('hidden', !hasVisibleCards);
        });
    }

    function applyTagFilter(tagText) {
        if (searchBar) searchBar.value = '';
        let hasVisibleCards = false;
        languageCards.forEach(card => {
            const cardTags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.trim());
            const isMatch = cardTags.some(t => t.toLowerCase().includes(tagText.toLowerCase()));
            card.classList.toggle('hidden-by-search', !isMatch);
            if (isMatch) hasVisibleCards = true;
        });
        noResultsMessage.classList.toggle('hidden', !hasVisibleCards);
        showActiveFilterBadge(tagText);
    }

    function clearTagFilter() {
        languageCards.forEach(card => card.classList.remove('hidden-by-search'));
        noResultsMessage.classList.add('hidden');
        if (activeFilterContainer) activeFilterContainer.innerHTML = '';
    }

    function showActiveFilterBadge(tagText) {
        if (!activeFilterContainer) return;
        activeFilterContainer.innerHTML = `
            <span id="active-filter-badge">
                ${tagText}
                <button id="clear-filter-btn" class="ml-2 text-lg leading-none">&times;</button>
            </span>
        `;
        document.getElementById('clear-filter-btn').addEventListener('click', clearTagFilter);
    }

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => applyTagFilter(tag.textContent.trim()));
    });

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top-btn');
    if (backToTopButton) {
        backToTopButton.style.display = "block";
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}