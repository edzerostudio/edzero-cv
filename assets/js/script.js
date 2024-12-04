
/* ---------------------------------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------------------------------- */

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
            applyTranslations(data); // Apply translations
        })
        .catch(error => {
            console.error("Error loading translations:", error);
        });
}

// Recursive function to resolve translation keys
function resolveTranslationKey(obj, keyPath) {
    return keyPath.split('.').reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
}

// Apply translations to elements
// Utility function to check if an array is an array of objects
function isArrayOfObjects(array) {
    return Array.isArray(array) && array.every(item => typeof item === 'object' && !Array.isArray(item));
}

// Apply translations to elements
function applyTranslations(translations) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach(el => {
        const key = el.getAttribute("data-translate");
        const translation = resolveTranslationKey(translations, key);
        if (translation) {
            el.textContent = translation; // Default text update for elements with data-translate
        }
    });

    // Helper function to clear and populate a list
    function renderList(containerSelector, items, createItemCallback) {
        const container = document.querySelector(containerSelector);
        if (!container) return; // Ensure the container exists

        if (!Array.isArray(items)) {
            console.warn(`Expected an array for ${containerSelector}, but got:`, items);
            return;
        }

        container.innerHTML = ""; // Clear previous content
        items.forEach((item, index, arr) => container.appendChild(createItemCallback(item, index, arr)));
    }

    // Render tech stack
    const techstackData = resolveTranslationKey(translations, "techstack.items");
    if (Array.isArray(techstackData)) {
        renderList(".techstack-list", techstackData, item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        });
    }

    // Render education section
    const educationData = resolveTranslationKey(translations, "education.schools");
    if (Array.isArray(educationData)) {
        renderList(".education-section", educationData, school => {
            const card = document.createElement("div");
            card.className = "card education-card";

            const schoolName = document.createElement("h4");
            schoolName.className = "education-school";
            schoolName.textContent = school.name;

            const major = document.createElement("p");
            major.className = "education-major";
            major.textContent = school.major;

            card.appendChild(schoolName);
            card.appendChild(major);

            if (Array.isArray(school.activities)) {
                const activityList = document.createElement("ul");
                school.activities.forEach(activity => {
                    const listItem = document.createElement("li");
                    listItem.textContent = activity;
                    activityList.appendChild(listItem);
                });
                card.appendChild(activityList);
            }
            return card;
        });
    }

    // Render work experiences
    const workData = resolveTranslationKey(translations, "work.jobs");
    if (Array.isArray(workData)) {
        renderList(".work-section", workData, job => {
            const card = document.createElement("div");
            card.className = "card work-card";

            const jobRole = document.createElement("h4");
            jobRole.className = "work-job";
            jobRole.textContent = job.role;

            const company = document.createElement("p");
            company.className = "work-company";
            company.textContent = job.company;

            card.appendChild(jobRole);
            card.appendChild(company);

            if (Array.isArray(job.details)) {
                const detailsList = document.createElement("ul");
                job.details.forEach(detail => {
                    const listItem = document.createElement("li");
                    listItem.textContent = detail;
                    detailsList.appendChild(listItem);
                });
                card.appendChild(detailsList);
            }
            return card;
        });
    }

    // Render achievements
    const achievementsData = resolveTranslationKey(translations, "achievements.items");
    if (Array.isArray(achievementsData)) {
        renderList(".achievements-list", achievementsData, item => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            return listItem;
        });
    }

    // Render portfolio
    const portfolioData = resolveTranslationKey(translations, "portfolio.projects");
    if (Array.isArray(portfolioData)) {
        const portfolioContainer = document.querySelector(".portfolio-section");
        if (!portfolioContainer) return;

        portfolioContainer.innerHTML = ""; // Clear previous content

        portfolioData.forEach((project, index) => {
            const card = document.createElement("div");
            card.className = "card portfolio-card";

            const img = document.createElement("img");
            img.className = "portfolio-preview";
            img.src = project.image;

            const descriptionContainer = document.createElement("div");
            descriptionContainer.className = "portfolio-description";

            const title = document.createElement("h3");
            if (project.link) {
                title.innerHTML = `${project.title} - <a href="${project.link}" target="_blank">${project.link}</a>`;
            } else {
                title.textContent = project.title;
            }

            const description = document.createElement("p");
            description.textContent = project.description;

            descriptionContainer.appendChild(title);
            descriptionContainer.appendChild(description);

            card.appendChild(img);
            card.appendChild(descriptionContainer);
            portfolioContainer.appendChild(card);

            // Add <hr> between cards (except after the last one)
            if (index < portfolioData.length - 1) {
                const hr = document.createElement("hr");
                portfolioContainer.appendChild(hr);
            }
        });
    }
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

/* ---------------------------------------------------------------------------------------------------- */