const students = require('./student');

const grade11Students = students.filter(
  (student) => student.dateOfBirth.slice(0, 4) === '2007'
);
const grade12Students = students.filter(
  (student) => student.dateOfBirth.slice(0, 4) === '2006'
);

const students1 = students;
const students2 = grade11Students.concat(grade12Students);
const students3 = grade12Students;

const groupedStudents = [students1, students2, students3];

const scores = [];

const courses = Array.from({ length: 13 }, () => ({
  regular: Math.floor(3 + Math.random() * 3),
  midterm: 1,
  final: 1,
}));
const types = ['regular', 'midterm', 'final'];

const getRandomScore = () => Math.min(10, (3 + Math.random() * 9).toFixed(1));
const getRandomLetterGrade = () => Math.min(Math.random() * 5, 1).toFixed(0);

for (year = 1; year <= 3; year++) {
  for (semester = 1; semester <= 2; semester++) {
    groupedStudents[3 - year].forEach((student) => {
      for (course = 1; course <= 13; course++) {
        // 3 - 5 regular scores
        types.forEach((type) => {
          for (i = 1; i <= courses[course - 1][type]; i++) {
            scores.push({
              yearId: year,
              semesterId: semester,
              courseId: course,
              userId: user.id,
              score: course !== 13 ? getRandomScore() : getRandomLetterGrade(),
              type,
            });
          }
        });
      }
    });
  }
}

module.exports = scores;
