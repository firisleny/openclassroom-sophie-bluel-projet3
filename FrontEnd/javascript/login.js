// Connexion
function login() {
    // récupération des champs du formulaire et vérification qu'ils ne sont pas vide
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    if (email === "" || password === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // envoie en post des valeur a l'api
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => { // Vérifiée si l'api a répondu avec succès
        if (!response.ok) {
            throw new Error('Erreur lors de la connexion');
        }
        return response.json();
    })
    .then(data => { // Si les identifiant sont correcte on redirige vers la page d'édition
        sessionStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    })
    .catch(error => { // Sinon on affiche un message d'erreur
        console.error('Erreur:', error);
        alert("Email ou mot de passe incorrect.");
    });
}