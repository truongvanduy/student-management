const { sequelize } = require('../utils/db.util');
// const _associations = require('../models/associations');
const Student = require('../models/student.model');
const Course = require('../models/course.model');

module.exports = async function initData(_req, _res, next) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const studentData = require('../utils/data/student');
    // const datas = await Student.bulkCreate(studentData);
    // await datas.save();
    console.log('Student data has been initialized successfully.');
    // await sequelize.sync({ alter: true });

    // await Course.bulkCreate([
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
    // ]);
    await sequelize.sync({ alter: true });
    console.log('Course data has been initialized successfully.');

    const Class = require('../models/class.model');
    const StudentClass = require('../models/student_class.model');

    return next();
  } catch (error) {
    console.error('Database connection error. ' + error);
  }
};
