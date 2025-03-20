document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/habits');
    const habits = await response.json();
    const habitList = document.getElementById('habit-list');
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.textContent = `${habit.name} - ${habit.description}`;
        habitList.appendChild(li);
    });
});