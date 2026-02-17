document.getElementById("hamburger").addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const menu = document.getElementById("mobileMenu");
    
    // Toggle the visual menu
    const isHidden = menu.classList.toggle("hidden");

    // Update Accessibility State
    // If hidden is true, aria-expanded is false.
    btn.setAttribute("aria-expanded", !isHidden);
    
    // Update the label so they know the button's NEW purpose
    btn.setAttribute("aria-label", isHidden ? "Open mobile menu" : "Close mobile menu");
});