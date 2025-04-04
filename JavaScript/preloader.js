document.addEventListener('DOMContentLoaded', function () {
    // Ensure the preloader is visible even if page loads quickly
    const preloader = document.querySelector('.preloader');
    const body = document.body;

    // Prevent scrolling while preloader is active
    body.style.overflow = 'hidden';

    // Detect if device is mobile or has slow connection
    const isMobile = window.innerWidth <= 768;
    const isSlowConnection = navigator.connection ?
        (navigator.connection.saveData ||
            navigator.connection.effectiveType.includes('2g') ||
            navigator.connection.effectiveType.includes('slow')) : false;

    // Adjust timing based on device and connection
    const minDisplayTime = isMobile ? 1500 : 2000;
    const maxDisplayTime = (isMobile || isSlowConnection) ? 3000 : 4000;

    // Get all images on the page to track loading progress
    const images = document.querySelectorAll('img');
    const totalImages = images.length;
    let loadedImages = 0;

    // Progress bar update
    const progressBar = document.querySelector('.progress-bar');

    // Update progress as images load
    const updateProgress = () => {
        loadedImages++;
        const percentLoaded = Math.min((loadedImages / totalImages) * 100, 100);

        if (progressBar) {
            progressBar.style.width = percentLoaded + '%';
        }

        // If all content is loaded, prep for hiding
        if (percentLoaded >= 100) {
            setTimeout(hidePreloader, 500); // Give extra time to see the completed progress
        }
    };

    // Loop through all images and check/track loading
    if (totalImages > 0) {
        images.forEach(img => {
            // If image is already loaded
            if (img.complete) {
                updateProgress();
            } else {
                // If not yet loaded, add event listener
                img.addEventListener('load', updateProgress);
                img.addEventListener('error', updateProgress); // Count errors as loaded
            }
        });
    } else {
        // If no images, hide preloader after minimum display time
        setTimeout(hidePreloader, minDisplayTime);
    }

    // Minimum display time for preloader
    setTimeout(() => {
        if (loadedImages >= totalImages) {
            hidePreloader();
        }
    }, minDisplayTime);

    // Hide preloader in any case after maximum wait time
    setTimeout(hidePreloader, maxDisplayTime);

    // Function to hide the preloader with a fade effect
    function hidePreloader() {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');

            // Restore scrolling after preloader is hidden
            setTimeout(() => {
                body.style.overflow = '';

                // After the fade-out animation completes, remove from DOM
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }

                // Add a smooth transition to the body content
                // Use querySelectorAll and loop through elements to apply animation
                // to handle cases where the Contact-section might not exist on some pages
                const mainElements = document.querySelectorAll('.Contact-section, .Nav-Section, main, header');
                mainElements.forEach(element => {
                    if (element) {
                        element.style.animation = 'fadeIn 0.5s ease-out';
                    }
                });
            }, 500);
        }
    }

    // Add resize handler to adjust preloader size on orientation change
    window.addEventListener('resize', function () {
        if (preloader && !preloader.classList.contains('fade-out')) {
            // This triggers a repaint, applying any media query changes immediately
            preloader.style.display = 'none';
            preloader.offsetHeight; // Force a repaint
            preloader.style.display = 'flex';
        }
    });

    // Prevent the preloader from showing if page is loaded from cache
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            hidePreloader();
        }
    });
}); 