const Year = require('./year.model');
const Grade = require('./grade.model');
const Class = require('./class.model');
const Student = require('./student.model');
const Semester = require('./semester.model');
const Score = require('./score.model');
const Course = require('./course.model');
const Parent = require('./parent.model');
const StudentClass = require('./student_class.model');
const { sequelize } = require('../utils/db.util');

// Score associations

// Parent associations

// Student-Class associations

console.log('Associations have been initialized successfully.');

const associations = {};

module.exports = associations;
