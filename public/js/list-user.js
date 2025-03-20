document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/users');
    const users = await response.json();
    const userList = document.getElementById('user-list');
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} - ${user.email}`;
        userList.appendChild(li);
    });
});