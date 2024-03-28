const Course = require('../models/course.model');

class ScoreService {
  _mainCourseIds = [1, 2, 3];
  _classification = [
    {
      avg: 8.0,
      minAvg: 6.5,
      title: 'Học sinh Giỏi',
    },
    {
      avg: 6.5,
      minAvg: 5.0,
      title: 'Học sinh Khá',
    },
    {
      avg: 5.0,
      minAvg: 3.5,
      title: 'Học sinh Trung Bình',
    },
    {
      avg: 3.5,
      minAvg: 2.0,
      title: 'Học sinh Yếu',
    },
    {
      avg: 0,
      minAvg: 0,
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
    return groupScores.map((group) => {
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

      return average;
    });
  }

  calcSemseterAvg(avgScores) {
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
  });

  getTitle(avgScores) {
    // Check if the student pass add requirements of each classification
    let qualified = true;
    // Store reasons of downgrading
    let reasons = {
      value: { ...this._resetReasons() },
      temp: { ...this._resetReasons() },
    };
    const avgScore = this.calcSemseterAvg(avgScores);
    const mainCourseScores = this._mainCourseIds.map((id) => avgScores[id - 1]);
    console.log('Avg scores: ', avgScores);
    console.log('Main courses: ', mainCourseScores);

    /**========================
     * Start classification
     * =====================**/

    // Classify student from good to fail
    for (let i = 0; i < this._classification.length - 1; i++) {
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
}

module.exports = new ScoreService();
