// 📦 Zugriff auf Kalender-Element im HTML
const calender = document.getElementById('calender');

// 📅 Aktuelles Datum
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// 📚 Aufgaben-Datenstruktur (aus localStorage laden oder leeren Start)
const savedTasks = localStorage.getItem("tasks");
const tasksByDate = savedTasks ? JSON.parse(savedTasks) : {};

// 📆 Monatsnamen
const monthNamesArray = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];


// 🔁 Funktion: Kalender für gegebenes Jahr & Monat zeichnen
function renderCalender(year, month) {
  const calender = document.getElementById('calender');
  const monthLabel = document.getElementById('month-label');

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDay = new Date(year, month, 1).getDay();
  startDay = (startDay + 6) % 7;

  // 🏷 Monatsüberschrift setzen
  monthLabel.textContent = `${monthNamesArray[month]} ${year}`;

  // 🧼 Kalender leeren
  calender.innerHTML = '';

  // ➕ Leere Felder vor dem 1. Tag einfügen
  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('calender-day');
    emptyCell.style.opacity = '0';
    calender.appendChild(emptyCell);
  }

  // 📅 Tageszellen einfügen
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calender-day');
    dayCell.textContent = day;

    // 🌟 Heutigen Tag hervorheben
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) {
      dayCell.classList.add('today');
    }

    // 🖱 Klick auf Tag → Aufgabe hinzufügen
    dayCell.addEventListener('click', () => {
      const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const task = prompt(`Aufgabe für den ${day}.${month + 1}.${year} eingeben:`);

      if (task) {
        if (!tasksByDate[selectedDate]) {
          tasksByDate[selectedDate] = [];
        }
        tasksByDate[selectedDate].push(task);

        renderTaskList(); // 👈 Aufgabenliste neu aufbauen
        localStorage.setItem("tasks", JSON.stringify(tasksByDate)); // 💾 Speichern
      }
    });

    calender.appendChild(dayCell);
  }
}


// 📝 Funktion: Zeigt alle gespeicherten Aufgaben in der linken Task-Liste an
function renderTaskList () {
    const taskList = document.getElementById('task-list');
    const doneList = document.getElementById('done-list');
    taskList.innerHTML = '';
    doneList.innerHTML = '';
  
    for (const date in tasksByDate) {
      // ✅ Normale Aufgaben (alle außer "done")
      if (date !== 'done') {
        tasksByDate[date].forEach((task, index) => {
          const li = document.createElement('li');
          li.classList.add('task');
  
          const span = document.createElement('span');
          span.classList.add('task-text');
          span.textContent = `${date === 'unspecified' ? 'Allgemein' : date}: ${task}`;
  
          const actions = document.createElement('div');
          actions.classList.add('task-actions');
  
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
  
          const editBtn = document.createElement('button');
          editBtn.classList.add('edit');
          editBtn.textContent = '✏️';
  
          const deleteBtn = document.createElement('button');
          deleteBtn.classList.add('delete');
          deleteBtn.textContent = '🗑️';
  
          // ✅ Abhaken – verschieben in "done"
          checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
              if (!tasksByDate['done']) tasksByDate['done'] = [];
              tasksByDate['done'].push(task);
              tasksByDate[date].splice(index, 1);
              if (tasksByDate[date].length === 0) delete tasksByDate[date];
              localStorage.setItem('tasks', JSON.stringify(tasksByDate));
              renderTaskList();
            }
          });
  
          // 🗑️ Löschen
          deleteBtn.addEventListener('click', () => {
            tasksByDate[date].splice(index, 1);
            if (tasksByDate[date].length === 0) delete tasksByDate[date];
            localStorage.setItem('tasks', JSON.stringify(tasksByDate));
            renderTaskList();
          });
  
          // ✏️ Bearbeiten
          editBtn.addEventListener('click', () => {
            const newTask = prompt('Neue Aufgabenbeschreibung:', task);
            if (newTask) {
              tasksByDate[date][index] = newTask;
              localStorage.setItem('tasks', JSON.stringify(tasksByDate));
              renderTaskList();
            }
          });
  
          actions.appendChild(checkbox);
          actions.appendChild(editBtn);
          actions.appendChild(deleteBtn);
  
          li.appendChild(span);
          li.appendChild(actions);
          taskList.appendChild(li);
        });
      }
  
      // ✅ Erledigte Aufgaben separat rendern
      else {
        tasksByDate['done'].forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.add('task');
          
            const span = document.createElement('span');
            span.textContent = `✔️ ${task}`;
          
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.classList.add('delete');
          
            deleteBtn.addEventListener('click', () => {
              tasksByDate['done'].splice(index, 1);
              if (tasksByDate['done'].length === 0) delete tasksByDate['done'];
              localStorage.setItem('tasks', JSON.stringify(tasksByDate));
              renderTaskList();
            });
          
            const actions = document.createElement('div');
            actions.classList.add('task-actions');
            actions.appendChild(deleteBtn);
          
            li.appendChild(span);
            li.appendChild(actions);
            doneList.appendChild(li);
          });
      }
    }
  }
  


// ⬅ Monatsnavigation zurück
document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalender(currentYear, currentMonth);
});


// ➡ Monatsnavigation vor
document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalender(currentYear, currentMonth);
});


// ⌨ EventListener für allgemeinen „Add Task“-Button oben
document.getElementById("add-task").addEventListener("click", () => {
  const input = document.getElementById("task-input");
  const task = input.value.trim();

  if (task) {
    if (!tasksByDate["unspecified"]) {
      tasksByDate["unspecified"] = [];
    }
    tasksByDate["unspecified"].push(task);
    input.value = "";

    renderTaskList(); // 👈 Aufgabenliste aktualisieren
    localStorage.setItem("tasks", JSON.stringify(tasksByDate)); // 💾 speichern
  }
});

//darkmode
document.querySelector('.darkmode').addEventListener('click', () => {
    document.body.classList.toggle('dark');

});

// ▶ Initial: Kalender und Aufgabenliste anzeigen
renderCalender(currentYear, currentMonth);
renderTaskList();
