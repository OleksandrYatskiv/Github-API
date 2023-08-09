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
    const data = await controller(`https://api.github.com/users/${userInput.value}`, 'GET');
    console.log(data);
    if (data.message === 'Not Found') {
        showErrMssg();
    } else {
        createUserCard(data);
    }
});

function createUserCard(user) {
    cardContainer.innerHTML = '';
    errContainer.remove();

    const avatar = document.createElement('img');
    const username = document.createElement('h3');
    const bio = document.createElement('p');
    const followers = document.createElement('p');
    const location = document.createElement('p');
    const avatarContainer = document.createElement('div');

    cardContainer.classList.add('card-container');
    avatarContainer.classList.add('avatar-container');

    avatar.src = user.avatar_url;
    username.innerText = user.login;
    bio.innerText = user.bio ? `Bio : ${user.bio}` : '';
    followers.innerText = `Followers: ${user.followers}`;
    location.innerText = user.location ? `Location : ${user.location}` : '';

    avatarContainer.append(avatar, username)
    cardContainer.append(avatarContainer, bio, followers, location);
    wrapp.append(cardContainer);
}

function showErrMssg() {
    errContainer.innerHTML = '';
    cardContainer.remove();

    const errMssg = document.createElement('p');

    errMssg.innerText = 'User was not found. Please check the entered username'

    errContainer.classList.add('error-container');
    errMssg.classList.add('error-mssg');

    errContainer.append(errMssg);
    wrapp.append(errContainer);
}

randomhBtn.addEventListener('click', async () => {
    const randomUserId = Math.floor(Math.random() * 1000000);
    const data = await controller(`https://api.github.com/user/${randomUserId}`, 'GET');

    console.log(data);
    console.log(randomUserId);

    if (data.message === 'Not Found') {
        showErrMssg();
    } else {
        createUserCard(data);
    }
});