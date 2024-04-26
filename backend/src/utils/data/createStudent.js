const fs = require('fs');
const removeDiacritics = require('./diacriticsRemoval');

function generateVietnameseData(numSamples) {
  const vietnameseFirstNames = [
    'Vy',
    'Hương',
    'Minh',
    'Linh',
    'Nam',
    'Trang',
    'Mai',
    'Linh',
    'Chi',
    'Bình',
    'Duy',
    'Hiền',
    'Quang',
    'Loan',
    'Hòa',
    'Hạnh',
    'Phương',
    'Thảo',
    'Dũng',
    'Kiên',
    'Huyền',
    'Hưng',
    'Bách',
    'Tú',
    'Nghĩa',
    'Thắng',
    'Hiếu',
    'Ly',
    'Hà',
    'Dương',
    'Ngọc',
    'Nhi',
    'Tâm',
    'Bình',
    'Dũng',
    'Hạnh',
    'Hưng',
    'Long',
    'Lan',
    'Điệp',
    'Bích',
    'Dũng',
    'Dương',
    'Hiền',
    'Huy',
    'Kiên',
    'Liên',
    'Loan',
    'Long',
    'Nghĩa',
    'Phong',
    'Phú',
    'Phúc',
    'Tài',
    'Nhân',
  ];
  const vietnameseLastNames = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Đặng',
    'Vũ',
    'Hoàng',
    'Bạch',
    'Đỗ',
    'Hà',
    'Bùi',
    'Cao',
    'Dương',
    'Đinh',
    'Phạm',
    'Lê',
    'Võ',
    'Đặng',
    'Phan',
    'Huỳnh',
    'Lưu',
    'Bùi',
    'Võ',
    'Dương',
    'Đinh',
    'Lê',
    'Nguyễn',
    'Trần',
    'Phan',
    'Đặng',
    'Võ',
    'Bùi',
    'Cao',
    'Dương',
    'Đinh',
    'Lê',
    'Nguyễn',
    'Trần',
    'Phan',
    'Đặng',
    'Võ',
    'Bùi',
    'Cao',
    'Dương',
    'Đinh',
    'Lê',
    'Nguyễn',
    'Trần',
    'Phan',
    'Đặng',
  ];
  const middleNames = [
    'Thị',
    'Văn',
    'Ngọc',
    'Thi',
    'Công',
    'Quốc',
    'Kim',
    'Trọng',
    'Thanh',
    'Thúy',
    'Mỹ',
    'Đức',
    'Liên',
    'Dũng',
    'Diệp',
    'Hương',
    'Loan',
    'Hòa',
    'Hiền',
    'Hạnh',
    'Dương',
    'Minh',
    'Nghĩa',
    'Liên',
    'Tuyết',
    'Hưng',
    'Dũng',
    'Hiếu',
    'Linh',
    'Dương',
    'Hạnh',
    'Hiền',
    'Liên',
    'Quang',
    'Dũng',
    'Minh',
    'Nghĩa',
    'Liên',
    'Tuyết',
    'Hưng',
    'Dũng',
    'Hiếu',
    'Linh',
    'Dương',
    'Hạnh',
    'Hiền',
    'Liên',
    'Quang',
    'Dũng',
    'Minh',
  ];

  const data = [];
  for (let i = 0; i < numSamples; i++) {
    const firstName =
      vietnameseFirstNames[
        Math.floor(Math.random() * vietnameseFirstNames.length)
      ];
    const lastName =
      vietnameseLastNames[
        Math.floor(Math.random() * vietnameseLastNames.length)
      ];
    const middleName =
      middleNames[Math.floor(Math.random() * middleNames.length)];
    const surname = lastName + ' ' + middleName;

    // Generate random date of birth in 2008
    const minDate = new Date(2006, 0, 1); // Jan 1, 2006
    const maxDate = new Date(2008, 11, 31); // Dec 31, 2008
    const randomDate = new Date(
      minDate.getTime() +
        Math.random() * (maxDate.getTime() - minDate.getTime())
    );

    // Generate random Vietnamese address (replace with your address generation logic)
    const street = `${i + 1}`; // Replace with Vietnamese street name generation
    const ward = 'phường Cái Khế'; // Replace with Vietnamese ward name generation
    const district = 'quận Ninh Kiều'; // Replace with Vietnamese district name generation
    const city = 'Cần Thơ'; // Or any other Vietnamese city
    const address = street + ', ' + ward + ', ' + district + ', ' + city;

    // Generate random Vietnamese phone number
    const phoneNumber = '0' + Math.floor(Math.random() * 1000000000); // Replace with Vietnamese phone number format
    const sequence = 'S' + String(i + 1).padStart(5, '0');

    const email = removeDiacritics(
      `${firstName}${sequence}@student.hc.edu.vn`
    ).toLowerCase();

    data.push({
      id: i + 1,
      firstName: firstName,
      lastName: surname,
      dateOfBirth: randomDate.toISOString().slice(0, 10), // Format date as YYYY-MM-DD
      address,
      email,
      phoneNumber: phoneNumber,
      password: phoneNumber,
    });
  }
  return data;
}

// Example usage: Generate 100 samples
const jsonData = generateVietnameseData(200);

fs.writeFile(
  './backend/src/utils/data/student.json',
  JSON.stringify(jsonData, null, 2),
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('done student');
    }
  }
);
