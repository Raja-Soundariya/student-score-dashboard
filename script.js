const initialStudents = [
  { id: 1, name: "Ananya Kumar", email: "ananya@gmail.com", score: 96 },
  { id: 2, name: "Rahul Sharma", email: "rahul@gmail.com", score: 91 },
  { id: 3, name: "Priya Nair", email: "priya@gmail.com", score: 88 },
  { id: 4, name: "Arjun Raj", email: "arjun@gmail.com", score: 84 },
  { id: 5, name: "Meena Devi", email: "meena@gmail.com", score: 81 },
  { id: 6, name: "Kavin Kumar", email: "kavin@gmail.com", score: 78 },
  { id: 7, name: "Arjun Raj", email: "arjun2@gmail.com", score: 84 }
];

let students = [...initialStudents];

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const scoreInput = document.getElementById("score");
const message = document.getElementById("formMessage");
const tableBody = document.getElementById("studentTableBody");
const topFiveContainer = document.getElementById("topFive");
const emptyState = document.getElementById("emptyState");
const exportBtn = document.getElementById("exportBtn");

function normalize(value) {
  return value.trim().toLowerCase();
}

function getDuplicateIds() {
  const nameCounts = {};
  const emailCounts = {};

  students.forEach(student => {
    const name = normalize(student.name);
    const email = normalize(student.email);

    nameCounts[name] = (nameCounts[name] || 0) + 1;
    emailCounts[email] = (emailCounts[email] || 0) + 1;
  });

  return new Set(
    students
      .filter(student =>
        nameCounts[normalize(student.name)] > 1 ||
        emailCounts[normalize(student.email)] > 1
      )
      .map(student => student.id)
  );
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

function render() {
  const duplicateIds = getDuplicateIds();

  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("duplicateCount").textContent = duplicateIds.size;

  const highest = students.length
    ? Math.max(...students.map(student => Number(student.score)))
    : null;

  document.getElementById("highestScore").textContent =
    highest === null ? "—" : `${highest}/100`;

  renderTopFive();
  renderTable(duplicateIds);
}

function renderTopFive() {
  const topFive = [...students]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (!topFive.length) {
    topFiveContainer.innerHTML =
      '<p class="empty-state">Add students to see the ranking.</p>';
    return;
  }

  topFiveContainer.innerHTML = topFive
    .map((student, index) => `
      <article class="top-card">
        <div class="rank">RANK ${index + 1}</div>
        <h3>${escapeHtml(student.name)}</h3>
        <p>${escapeHtml(student.email)}</p>
        <div class="score">${student.score}<small> / 100</small></div>
      </article>
    `)
    .join("");
}

function renderTable(duplicateIds) {
  emptyState.style.display = students.length ? "none" : "block";

  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  tableBody.innerHTML = sortedStudents
    .map((student, index) => {
      const duplicate = duplicateIds.has(student.id);

      return `
        <tr class="${duplicate ? "duplicate-row" : ""}">
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(student.name)}</strong></td>
          <td>${escapeHtml(student.email)}</td>
          <td><strong>${student.score}</strong></td>
          <td>
            <span class="badge ${duplicate ? "duplicate" : "unique"}">
              ${duplicate ? "Duplicate" : "Unique"}
            </span>
          </td>
          <td>
            <button class="delete-btn" onclick="deleteStudent(${student.id})">
              Delete
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const score = Number(scoreInput.value);

  if (!name || !email || scoreInput.value === "") {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  if (score < 0 || score > 100 || !Number.isFinite(score)) {
    showMessage("Score must be between 0 and 100.", "error");
    return;
  }

  const duplicateEmail = students.some(
    student => normalize(student.email) === email
  );

  students.push({
    id: Date.now(),
    name,
    email,
    score
  });

  form.reset();

  showMessage(
    duplicateEmail
      ? "Student added. Duplicate email detected and highlighted."
      : "Student added successfully.",
    duplicateEmail ? "error" : "success"
  );

  render();
  nameInput.focus();
});

function deleteStudent(id) {
  students = students.filter(student => student.id !== id);
  showMessage("Student removed.", "success");
  render();
}

function exportCSV() {
  if (!students.length) {
    showMessage("There are no students to export.", "error");
    return;
  }

  const headers = ["Name", "Email", "Score"];
  const rows = students.map(student => [
    csvEscape(student.name),
    csvEscape(student.email),
    student.score
  ]);

  const csv = [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "students.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showMessage("CSV exported successfully.", "success");
}

function csvEscape(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

exportBtn.addEventListener("click", exportCSV);

render();
