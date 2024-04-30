const Course = require('../models/course.model');
const StudentClass = require('../models/student_class.model');
const Class = require('../models/class.model');

class ScoreService {
  _mainCourseIds = [1, 2, 3];
  _classification = [
    {
      avg: 8.0,
      minAvg: 6.5,
      requiredPassingPE: true,
      title: 'Học sinh Giỏi',
    },
    {
      avg: 6.5,
      minAvg: 5.0,
      requiredPassingPE: true,
      title: 'Học sinh Khá',
    },
    {
      avg: 5.0,
      minAvg: 3.5,
      requiredPassingPE: false,
      title: 'Học sinh Trung Bình',
    },
    {
      avg: 3.5,
      minAvg: 2.0,
      requiredPassingPE: false,
      title: 'Học sinh Yếu',
    },
    {
      avg: 0,
      minAvg: 0,
      requiredPassingPE: false,
      title: 'Học sinh Kém',
    },
  ];
  _scoreWeights = {
    regular: 1,
    midterm: 2,
    final: 3,
  };
  _semesterWeights = {
    first: 1,
    second: 2,
  };

  _parseScores(scores) {
    // Get raw value from scores instance
    scores = JSON.parse(JSON.stringify(scores));
    // Parse score to float from string
    return scores.map((score) => ({
      ...score,
      score: parseFloat(score.score),
    }));
  }

  async groupScoreByCourse(semesterScore) {
    const courses = await Course.findAll();
    const groupScores = Array.from({ length: courses.length }, () => ({
      regular: [],
    }));
    semesterScore = this._parseScores(semesterScore);
    semesterScore.forEach((score) => {
      if (score.type === 'regular') {
        groupScores[score.courseId - 1].regular.push(score);
      } else {
        groupScores[score.courseId - 1][score.type] = score;
      }
    });
    return groupScores;
  }

  calcAvgScores(groupScores) {
    return groupScores.map((group, index) => {
      if (!group.regular.length) return NaN;
      if (!group.midterm || !group.final) return NaN;

      const sumOfRegularScore = group.regular.reduce(
        (acc, cur) => acc + cur.score,
        0
      );
      const numOfRegularScore = group.regular.length;
      const midtermScore = group.midterm.score;
      const finalScore = group.final.score;

      const average = parseFloat(
        (
          (sumOfRegularScore * this._scoreWeights.regular +
            midtermScore * this._scoreWeights.midterm +
            finalScore * this._scoreWeights.final) /
          (numOfRegularScore * this._scoreWeights.regular +
            this._scoreWeights.midterm +
            this._scoreWeights.final)
        ).toFixed(1)
      );
      if (group.regular[0].courseId !== 12) return average;
      // Physical Education course calculation
      if (average >= 2 / 3 && finalScore >= 0.5) {
        return 1.0;
      }
      return 0.0;
    });
  }

  calcOverallAvgScores(firstSemesterAvgs, secondSemesterAvgs) {
    return firstSemesterAvgs.map((firstSemesterAvg, i) => {
      const secondSemesterAvg = secondSemesterAvgs[i];
      const avg = parseFloat(
        (
          (firstSemesterAvg * this._semesterWeights.first +
            secondSemesterAvg * this._semesterWeights.second) /
          (this._semesterWeights.first + this._semesterWeights.second)
        ).toFixed(1)
      );
      if (i !== 12) return avg;
      if (parseFloat(secondSemesterAvg) >= 0.67) return 1.0;
      return 0.0;
    });
  }

  calcClassOverallAvgScores(firstSemesterAvgs, secondSemesterAvgs) {
    return firstSemesterAvgs.map((firstSemesterAvg, i) => {
      const secondSemesterAvg = secondSemesterAvgs[i];
      const avg = parseFloat(
        (
          (firstSemesterAvg * this._semesterWeights.first +
            secondSemesterAvg * this._semesterWeights.second) /
          (this._semesterWeights.first + this._semesterWeights.second)
        ).toFixed(1)
      );
      return avg;
    });
  }

  calcSemseterAvg([...avgScores]) {
    avgScores.pop();
    return parseFloat(
      avgScores.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0) /
        avgScores.length
    ).toFixed(1);
  }

  calcFinalAvg(firstSemesterAvg, secondSemesterAvg) {
    return (
      (firstSemesterAvg * this._semesterWeights.first +
        secondSemesterAvg * this._semesterWeights.second) /
      (this._semesterWeights.first + this._semesterWeights.second)
    ).toFixed(1);
  }

  _resetReasons = () => ({
    // Is the average score lower than the good classification?
    failAvgScore: 0,
    // Main course ids that have lower score than the good classification
    failMainCourses: [],
    // Course ids that have lower score than the min good classification
    failCourses: [],
    failPE: 0,
  });

  getTitle([...avgScores]) {
    // Check if the student pass add requirements of each classification
    let qualified = true;
    // Store reasons of downgrading
    let reasons = {
      value: { ...this._resetReasons() },
      temp: { ...this._resetReasons() },
    };
    const avgScore = this.calcSemseterAvg(avgScores);
    const mainCourseScores = this._mainCourseIds.map((id) => avgScores[id - 1]);
    const passPE = avgScores.pop();
    // console.log('Avg scores: ', avgScores);
    // console.log('Main courses: ', mainCourseScores);

    /**========================
     * Start classification
     * =====================**/

    // Classify student from good to fail
    for (let i = 0; i < this._classification.length; i++) {
      // Reset condition checking variables
      qualified = true;
      // Use value to store the processed temp reasons
      reasons.value = {
        ...reasons.temp,
      };
      // Reset temp reasons for the on going classification
      reasons.temp = this._resetReasons();

      // Classification
      // Check if the student pass requirements of each classification
      if (avgScore < this._classification[i].avg) {
        qualified = false;
        reasons.temp.failAvgScore = 1;
      }
      mainCourseScores.forEach((score, index) => {
        if (score < this._classification[i].avg) {
          qualified = false;
          reasons.temp.failMainCourses.push(index + 1);
        }
      });
      avgScores.forEach((score, index) => {
        if (score < this._classification[i].minAvg) {
          qualified = false;
          reasons.temp.failCourses.push(index + 1);
        }
      });
      if (this._classification[i].requiredPassingPE && !passPE) {
        qualified = false;
        reasons.temp.failPE = 1;
      }

      if (qualified) {
        return {
          ...this._classification[i - 1 >= 0 ? i - 1 : 0],
          title: this._classification[i].title,
          nextTitle: this._classification[i - 1]?.title,
          reasons: reasons.value,
        };
        // Returned object template:
        // {
        //   avg,
        //   minAvg,
        //   title,
        //   nextTitle,
        //   reasons: {
        //     failAvgScore,
        //     failMainCourses,
        //     failCourses,
        // },
      }
    }
  }

  // Teacher
  groupScoreByStudent(scores, indexOf) {
    scores = this._parseScores(scores);

    const groupScores = [];

    scores.forEach((score) => {
      const index = indexOf.get(score.studentId);

      // Initialize groupScores[index] if it doesn't exist
      if (!groupScores[index]) {
        groupScores[index] = {
          studentId: score.studentId,
          regular: [],
        };
      }

      // Push score to the groupScores
      if (score.type === 'regular') {
        groupScores[index].regular.push(score);
      } else {
        groupScores[index][score.type] = score;
      }
    });

    indexOf.forEach((index, studentId) => {
      if (!groupScores[index]) {
        groupScores[index] = {
          studentId: studentId,
          regular: [],
        };
      }
    });

    return groupScores;
  }
}

module.exports = new ScoreService();
