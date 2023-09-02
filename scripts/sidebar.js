document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.sidebar-menu a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindert das Standardverhalten (Seite neuladen)
            const targetUrl = link.getAttribute('data-href'); // Ziel-URL aus dem data-href Attribut holen
            window.location.href = targetUrl; // Zur gewünschten Seite navigieren
        });
    });
});