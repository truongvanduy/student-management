const students = require('./student');

const grade10Students = students.filter(
  (student) => student.dateOfBirth.slice(0, 4) === '2008'
);
const grade11Students = students.filter(
  (student) => student.dateOfBirth.slice(0, 4) === '2007'
);
const grade12Students = students.filter(
  (student) => student.dateOfBirth.slice(0, 4) === '2006'
);

const stu = {
  grade10Students,
  grade11Students,
  grade12Students,
};

const studentClass = [];

const numOfStudents = [];
for (i = 0; i <= 2; i++) {
  numOfStudents.push([]);
  for (j = 0; j <= 2; j++) {
    numOfStudents[i].push([]);
    for (k = 0; k <= 12; k++) {
      numOfStudents[i][j].push(0);
    }
  }
}

for (year = 0; year <= 2; year++) {
  for (grade = 0; grade <= year; grade++) {
    stu[`grade1${grade}Students`].forEach((student) => {
      for (order = 0; order <= 11; order++) {
        if (numOfStudents[year][grade][order] < 40) {
          studentClass.push({
            yearId: 3 - year,
            gradeId: grade + 1,
            classOrder: order + 1,
            userId: user.id,
          });
          numOfStudents[year][grade][order]++;
          break;
        }
      }
    });
  }
}

// for (grade = 1; grade <= 3; grade++) {
//   stu[`grade1${grade - 1}Students`].forEach((student) => {
//     studentClass.push({
//       yearId: 3,
//       gradeId: grade,
//       classOrder: 1,
//       userId: user.id,
//     });
//   });
// }
// for (grade = 1; grade <= 2; grade++) {
//   stu[`grade1${grade}Students`].forEach((student) => {
//     studentClass.push({
//       yearId: 2,
//       gradeId: grade,
//       classOrder: 1,
//       userId: user.id,
//     });
//   });
// }
// for (grade = 1; grade <= 1; grade++) {
//   stu[`grade1${grade + 1}Students`].forEach((student) => {
//     studentClass.push({
//       yearId: 1,
//       gradeId: grade,
//       classOrder: 1,
//       userId: user.id,
//     });
//   });
// }

module.exports = studentClass;
