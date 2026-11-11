// Connexion
function login() {
    // récupération des champs du formulaire et vérification qu'ils ne sont pas vide
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    if (email === "" || password === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // envoie en post des valeur a l'api pour vérifié les identifiants, si valide redirection vers la page d'édition
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la connexion');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('token', data.token);
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert("Email ou mot de passe incorrect.");
    });
}