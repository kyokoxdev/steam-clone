// Search functionality
document.getElementById('search').addEventListener('input', function (e) {
    const searchQuery = e.target.value.toLowerCase();
    const games = document.querySelectorAll('.game');

    games.forEach(game => {
        const gameName = game.dataset.name.toLowerCase();
        if (gameName.includes(searchQuery)) {
            game.style.display = 'block';
        } else {
            game.style.display = 'none';
        }
    });
});

// Buy Now button functionality
const buyButtons = document.querySelectorAll('.buy-btn');
buyButtons.forEach(button => {
    button.addEventListener('click', function () {
        const gameName = this.parentElement.querySelector('h3').textContent;
        alert(`Thank you for purchasing ${gameName}!`);
    });
});