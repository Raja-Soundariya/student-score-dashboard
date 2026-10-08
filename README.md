# Student Score Dashboard

A small responsive web application for managing student records.

## Features

- Add students using name, email, and score
- Display all students in a sortable-by-score view
- Automatically show the top 5 students
- Detect and highlight duplicate names or email addresses
- Display total students, duplicate records, and highest score
- Delete individual student records
- Export student records to a CSV file
- Responsive design for desktop and mobile
- No backend or installation required

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)

## Project Structure

```text
student-score-dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

### Option 1: Open directly

Double-click `index.html` and open it in a modern web browser.

### Option 2: VS Code

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Use Live Server if installed, or open the file directly in your browser.

## How It Works

### Top 5

Students are sorted by score in descending order. The first five records are displayed in the Top 5 section.

### Duplicate Detection

A record is highlighted when another student has the same name or the same email address. Duplicate records are marked with a red `Duplicate` badge.

### CSV Export

Click **Export CSV** to download the current student list as `students.csv`.

## Sample Data

The application starts with sample students so the evaluator can immediately test the Top 5 and duplicate detection features.

## Testing Checklist

- Add a student with a score between 0 and 100.
- Add another student with the same email and verify duplicate highlighting.
- Add a student with a score above the current top 5 and verify the ranking changes.
- Delete a student.
- Click Export CSV and open the downloaded file.

## Author

Raja Soundariya R
