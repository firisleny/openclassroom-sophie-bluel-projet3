// Vérification de connexion et récupération de la galerie
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    if (token) {
        document.querySelector('.bandeauEdition').style.display = 'flex';
        document.querySelector('#login-link').textContent = 'Logout';
        document.querySelector('#login-link').addEventListener('click', logout);
        
        document.querySelector('.boutonEdition a').style.display = 'flex';
    } else {
        document.querySelector('.bandeauEdition').style.display = 'none';
        document.querySelector('#login-link').textContent = 'Login';

        document.querySelector('.boutonEdition a').style.display = 'none';
    }

    galleryUpdate();
});

// Déconnexion
function logout() {
    sessionStorage.removeItem('token');
    window.location.href = 'login.html'; // Peut être plutôt redirigé vers index
}

// Récupération de la galerie
async function getGallery() {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    return data;
}

// Mise à jour de la galerie
async function galleryUpdate() {
    galleryData = await getGallery();
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    galleryData.forEach(work => {
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
}

// Ouvrir le modal
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';

    // Bloqué le scroll quand on est dans le modal
    document.documentElement.style.overflow = 'hidden';

    // Affiché le contenu d'edition de la galerie
    modalEditGallery();
}

// Fermer le modal quand on clique sur la croix
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';

    document.documentElement.style.overflow = 'auto';
}

// Fermer le modal quand on clique en dehors du contenu
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }

    document.documentElement.style.overflow = 'auto';
});

// Modal de modification de la galerie
async function modalEditGallery() {
    var galleryData = await getGallery();

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';

    const h3 = document.createElement('h3');
    h3.textContent = 'Galerie photo';
    modalBody.appendChild(h3);

    const modalBodyGallery = document.createElement('div');
    modalBodyGallery.classList.add('modal-body-gallery');
    modalBody.appendChild(modalBodyGallery);

    galleryData.forEach(work => {
        const span = document.createElement('span');
        span.style.backgroundImage = `url(${work.imageUrl})`;
        span.style.backgroundSize = 'cover';

        const deleteButton = document.createElement('a');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        deleteButton.addEventListener('click', async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    span.remove();
                    galleryUpdate();
                } else {
                    console.error('Erreur lors de la suppression de l\'image');
                }
            }
        });

        span.appendChild(deleteButton);
        modalBodyGallery.appendChild(span);
    });

    modalBody.appendChild(document.createElement('span'));

    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter une photo';
    modalBody.appendChild(addButton);
}