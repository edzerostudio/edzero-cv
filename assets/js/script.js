/* Collapsible */
// Select all elements with the class 'collapsible'
const collapsibles = document.querySelectorAll(".collapsible");

collapsibles.forEach(collapsible => {
    collapsible.addEventListener("click", () => {
        // Toggle the active class
        collapsible.classList.toggle("active");
        
        // Get the next sibling element
        const content = collapsible.nextElementSibling;
        
        // Toggle the maxHeight style
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});

/* Translation */
// Function to fetch and apply translations
function loadTranslations(language) {
    const path = `assets/translations/${language}.json`;

    // Fetch the translation file
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${language}.json`);
            }
            return response.json();
        })
        .then(data => {
            applyTranslations(data);
        })
        .catch(error => {
            console.error("Error loading translations:", error);
        });
}

// Apply translations to elements
function applyTranslations(translations) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
}

// Set up event listener for the language dropdown
document.getElementById("language-select").addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    loadTranslations(selectedLanguage);
});

// Load the default language on page load
document.addEventListener("DOMContentLoaded", () => {
    loadTranslations("en"); // Default language
});
