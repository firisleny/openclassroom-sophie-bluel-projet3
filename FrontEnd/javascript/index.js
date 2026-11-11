// Vérification de connexion et récupération de la galerie
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    if (token) {
        document.querySelector('.modeEdition').style.display = 'flex';
        document.querySelector('#login-link').textContent = 'Logout';
        document.querySelector('#login-link').addEventListener('click', logout);
    } else {
        document.querySelector('.bandeauEdition').style.display = 'none';
        document.querySelector('#login-link').textContent = 'Login';
    }
    getWorksGallery();
});

// Déconnexion
function logout() {
    sessionStorage.removeItem('token');
    window.location.href = 'login.html'; // Peut être plutôt redirigé vers index
}

// Récupération de la galerie
function getWorksGallery() {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            const gallery = document.querySelector('.gallery');
            gallery.innerHTML = '';

            data.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;

                const figcaption = document.createElement('figcaption');
                figcaption.textContent = work.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                gallery.appendChild(figure);
            });
        })
        .catch(error => console.error('Erreur de récupération de la galerie depuis l\'api :', error));
}