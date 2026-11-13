// Vérification de connexion et récupération de la galerie
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    if (token) {
        document.querySelector('.bandeauEdition').style.display = 'flex';
        document.querySelector('#login-link').textContent = 'logout';
        document.querySelector('#login-link').addEventListener('click', logout);
        
        document.querySelector('.boutonEdition a').style.display = 'flex';

        document.querySelector('.galleryFiltre').style.display = 'none';
    } else {
        document.querySelector('.bandeauEdition').style.display = 'none';
        document.querySelector('#login-link').textContent = 'login';

        document.querySelector('.boutonEdition a').style.display = 'none';

        document.querySelector('.galleryFiltre').style.display = 'flex';
    }

    filtreButtonGenerator();
    galleryUpdate("");
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

// Récupération des catégorie pour crée les bouton de filtre de gallerie
async function filtreButtonGenerator() {
    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categoriesData = await categoriesResponse.json();

    filtreButton = document.createElement('a');
    filtreButton.textContent = "Tous";
    filtreButton.id = `buttonFiltre`;
    filtreButton.href = `javascript:galleryUpdate("")`;

    document.querySelector(".galleryFiltre").appendChild(filtreButton);

    categoriesData.forEach(category => {
        filtreButton = document.createElement('a');
        filtreButton.textContent = category.name;
        filtreButton.id = `buttonFiltre${category.id}`;
        filtreButton.href= `javascript:galleryUpdate("${category.id}")`;

        document.querySelector(".galleryFiltre").appendChild(filtreButton);
    });
}

// Mise à jour de la galerie
async function galleryUpdate(filtre) {
    galleryData = await getGallery();
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    // Gestion de buttonActive pour les filtre
    for(const child of document.querySelector(".galleryFiltre").children){
        child.classList.remove("buttonActive");
    }
    document.getElementById(`buttonFiltre${filtre}`).classList.add("buttonActive");

    galleryData.forEach(work => {
        if(filtre == "" || filtre == work.categoryId){
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        }
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

    // Supprésion de bouton retour a l'édition de la gallery car on y est déja
    returnEditGalleryButton = document.getElementById('returnEditGalleryButton');
    if(returnEditGalleryButton){
        returnEditGalleryButton.remove();
        document.querySelector(".modal-navbar ul").setAttribute('style', "justify-content: end");
    }

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
                    galleryUpdate("");
                } else {
                    console.error('Erreur lors de la suppression dans la galerie');
                }
            }
        });

        span.appendChild(deleteButton);
        modalBodyGallery.appendChild(span);
    });

    modalBody.appendChild(document.createElement('span'));

    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter une photo';
    addButton.addEventListener('click', modalAddGallery);
    modalBody.appendChild(addButton);
}

// Modal d'ajout dans la galerie
async function modalAddGallery() {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';

    const modalNavbar = document.querySelector('.modal-navbar ul');
    modalNavbar.insertAdjacentHTML("afterbegin", `<li id="returnEditGalleryButton">
                                <a href="javascript:modalEditGallery()">
                                    <i class="fa-solid fa-arrow-left"></i>
                                </a>
                            </li>`);
    modalNavbar.setAttribute('style', "justify-content: space-between");


    const h3 = document.createElement('h3');
    h3.textContent = 'Ajout photo';
    modalBody.appendChild(h3);

    // Formulaire d'ajout
    const form = document.createElement('form');
    form.classList.add('addPhotoFormulaire');

    const fileInputContainer = document.createElement("div");
    fileInputContainer.classList.add("fileInputContainer");

    fileInputContainer.innerHTML = '<i class="fa-regular fa-image"></i>';

    const fileInputButton = document.createElement('button');
    fileInputButton.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter photo';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'image';
    fileInput.id = 'image';
    fileInput.accept = 'image/*';
    fileInput.classList.add('fileInput');
    fileInputButton.appendChild(fileInput);

    fileInputContainer.appendChild(fileInputButton);

    const fileDescription = document.createElement('p');
    fileDescription.textContent = 'jpg, png : 4mo max';
    fileInputContainer.appendChild(fileDescription);

    modalBody.appendChild(fileInputContainer);

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';
    form.appendChild(titleLabel);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.id = 'title';
    form.appendChild(titleInput);

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    form.appendChild(categoryLabel);

    const categorySelect = document.createElement('select');
    categorySelect.name = 'category';
    categorySelect.id = 'category';

    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categoriesData = await categoriesResponse.json();

    categoriesData.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    form.appendChild(categorySelect);
    modalBody.appendChild(form);

    modalBody.appendChild(document.createElement('span'));

    const addButton = document.createElement('button');
    addButton.textContent = 'Valider';
    modalBody.appendChild(addButton);

    addButton.addEventListener('click', async () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            getFileInput = document.getElementById("image");
            getTitleInput = document.getElementById("title");
            getCategoryInput = document.getElementById("category");

            const response = await fetch(`http://localhost:5678/api/works`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    image: getFileInput.files[0].name,
                    title: getTitleInput.value,
                    category: getCategoryInput.value
                })
            });
            if (response.ok) {
                getFileInput.value("");
                getTitleInput.value("");
                getCategoryInput.value("");

                galleryUpdate("");
            } else {
                console.error('Erreur lors de l\'ajout dans la galerie');
            }
        }
    });
}