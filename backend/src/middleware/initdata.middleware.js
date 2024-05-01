const { sequelize } = require('../utils/db.util');
// const _associations = require('../models/associations');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const { where } = require('sequelize');
const TeacherClass = require('../models/teacher_class.model');
const Homeroom = require('../models/homeroom.model');

module.exports = async function initData(_req, _res, next) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Create admin
    // const admin = User.create({
    //   firstName: 'Trực',
    //   lastName: 'Nguyễn Trung',
    //   dateOfBirth: '1999-01-01',
    //   address: 'Cần Thơ',
    //   phoneNumber: '0774925508',
    //   role: 'admin',
    //   password: 'admin',
    // });

    // Create sample teacher
    // const admin = User.create({
    //   firstName: 'Thức',
    //   lastName: 'Võ Trí',
    //   dateOfBirth: '1981-08-21',
    //   address: 'Cần Thơ',
    //   phoneNumber: '0744321555',
    //   role: 'teacher',
    //   password: 'teacher',
    // });

    // const studentData = require('../utils/data/student');
    // const datas = await User.bulkCreate(studentData);
    // await User.sync();
    // console.log('Student data has been initialized successfully.');

    // const courseData = [
    //   { name: 'Toán' },
    //   { name: 'Ngữ văn' },
    //   { name: 'Tiếng Anh' },
    //   { name: 'Vật lý' },
    //   { name: 'Hóa học' },
    //   { name: 'Sinh học' },
    //   { name: 'Lịch sử' },
    //   { name: 'Địa lý' },
    //   { name: 'Giáo dục công dân' },
    //   { name: 'Công nghệ' },
    //   { name: 'Tin học' },
    //   { name: 'Giáo dục quốc phòng và an ninh' },
    //   { name: 'Thể dục' },
    // ];
    // await Course.bulkCreate(courseData);
    // await Course.sync({ alter: true });
    // console.log('Course data has been initialized successfully.');

    // const Year = require('../models/year.model');
    // Year.bulkCreate([
    //   {
    //     year: '2022-2022',
    //     startDate: '2021-08-01',
    //     endDate: '2022-05-28',
    //   },
    //   {
    //     year: '2022-2023',
    //     startDate: '2022-08-01',
    //     endDate: '2023-05-28',
    //   },
    //   {
    //     year: '2023-2024',
    //     startDate: '2022-08-01',
    //     endDate: '2023-05-28',
    //   },
    // ]);
    // Year.sync();

    // const Semester = require('../models/semester.model');
    // Semester.bulkCreate([{ semester: 1 }, { semester: 2 }]);
    // Semester.sync();

    // const Grade = require('../models/grade.model');
    // Grade.bulkCreate([
    //   { gradeLevel: '10' },
    //   { gradeLevel: '11' },
    //   { gradeLevel: '12' },
    // ]);
    // Grade.sync();
    // console.log('Grade data has been initialized successfully.');

    // const Class = require('../models/class.model');
    // const classData = require('../utils/data/createClasses');
    // Class.bulkCreate(classData);
    // Class.sync();
    // console.log('Class data has been initialized successfully.');

    // const StudentClass = require('../models/student_class.model');
    // const stdClassData = require('../utils/data/assignClass');
    // StudentClass.bulkCreate(stdClassData);
    // StudentClass.sync();
    // console.log('Student-Class data has been initialized successfully.');

    // const Score = require('../models/score.model');
    // const scoreData = require('../utils/data/assignScores');
    // Score.bulkCreate(scoreData);
    // Score.sync();
    // console.log('Score data has been initialized successfully.');

    await User.update(
      {
        role: 'student',
      },
      {
        where: {
          role: null,
        },
      }
    );

    // const teacher = await User.findOne({
    //   where: {
    //     role: 'teacher',
    //   },
    // });

    // await Homeroom.create({
    //   gradeId: 3,
    //   yearId: 3,
    //   classOrder: 1,
    //   teacherId: teacher.id,
    // });

    return next();
  } catch (error) {
    console.error('Database connection error. ' + error);
  }
};
