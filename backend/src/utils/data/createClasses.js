const classes = [];

for (k = 1; k <= 3; k++) {
  for (i = 1; i <= 3; i++) {
    for (j = 1; j <= 12; j++) {
      classes.push({
        yearId: k,
        gradeId: i,
        order: j,
      });
    }
  }
}

module.exports = classes;
