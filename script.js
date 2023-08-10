async function controller(action, method, body) {
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };

    const params = {
        method: method,
        headers,
    };

    if (body) params.body = JSON.stringify(body);

    try {
        const response = await fetch(action, params);
        const data = await response.json();

        return data;
    } catch (err) {
        console.log(err);
    }
}

const wrapp = document.querySelector('.wrapp');
const randomhBtn = document.querySelector('#random-btn');
const searchBtn = document.querySelector('#search-btn');
const userInput = document.querySelector('#search-text');
const cardContainer = document.createElement('div');
const errContainer = document.createElement('div');

searchBtn.addEventListener('click', async () => {
    let data = null;
    if (!isValidGitHubUsername(userInput.value)) {
        showErrMssg('Invalid username');
        return;
    } else {
        data = await controller(`https://api.github.com/users/${userInput.value}`, 'GET');
    }

    if (data.message === 'Not Found') {
        showErrMssg('Oops! There is no account with this username yet.');
    } else {
        createUserCard(data);
    }
});

async function createUserCard(user) {
    cardContainer.innerHTML = '';
    errContainer.remove();

    const avatar = document.createElement('img');
    const username = document.createElement('h3');
    const bio = document.createElement('p');
    const followers = document.createElement('p');
    const location = document.createElement('p');
    const avatarContainer = document.createElement('div');
    const repoCard = document.createElement('div');
    const headline = document.createElement('h3');

    headline.innerText = 'Repositories :';
    headline.classList.add('repo-headline');

    repoCard.append(headline);

    const repos = await getUserRepos(user.login);
    repos.forEach(repo => {
        if (repo) {
            const name = document.createElement('h4');
            const description = document.createElement('p');

            repoCard.classList.add('repo-card');
            name.classList.add('repo-name');
            description.classList.add('repo-description');

            name.innerText = repo.name ? repo.name : '';
            description.innerText = repo.description ? repo.description : '';

            repoCard.append(name, description);
        }
    });

    cardContainer.classList.add('card-container');
    avatarContainer.classList.add('avatar-container');

    avatar.src = user.avatar_url;
    username.innerText = user.login;
    bio.innerText = user.bio ? `Bio : ${user.bio}` : '';
    followers.innerText = `Followers: ${user.followers}`;
    location.innerText = user.location ? `Location : ${user.location}` : '';

    avatarContainer.append(avatar, username)
    cardContainer.append(avatarContainer, bio, followers, location, repoCard);
    wrapp.append(cardContainer);
}

function showErrMssg(err) {
    errContainer.innerHTML = '';
    cardContainer.remove();

    const errMssg = document.createElement('p');

    errMssg.innerText = err;

    errContainer.classList.add('error-container');
    errMssg.classList.add('error-mssg');

    errContainer.append(errMssg);
    wrapp.append(errContainer);
}

randomhBtn.addEventListener('click', async () => {
    const randomUserId = Math.floor(Math.random() * 1000000);
    const data = await controller(`https://api.github.com/user/${randomUserId}`, 'GET');

    if (data.message === 'Not Found') {
        showErrMssg(`User with id : ${randomUserId} was not found, please try again.`);
    } else {
        createUserCard(data);
    }
});

function isValidGitHubUsername(username) {
    const pattern = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}[a-zA-Z\d]$/;

    return pattern.test(username);
}

async function getUserRepos(user) {
    const data = await controller(`https://api.github.com/users/${user}/repos`, 'GET');
    let repos = [];
    for (let i = 0; i < 4; i++) {
        repos.push(data[i]);
    }
    return repos;
}