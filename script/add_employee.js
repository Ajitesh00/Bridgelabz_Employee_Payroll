// // --- Populate Date Selectors ---
// const dateSelect = document.getElementById('date');
// const monthSelect = document.getElementById('month');
// const yearSelect = document.getElementById('year');

// // Populate years (2000-2030)
// for (let y = 2000; y <= 2030; y++) {
//   const opt = document.createElement('option');
//   opt.value = y;
//   opt.text = y;
//   yearSelect.appendChild(opt);
// }

// // Populate months
// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];
// monthNames.forEach((m, i) => {
//   const opt = document.createElement('option');
//   opt.value = i + 1;
//   opt.text = m;
//   monthSelect.appendChild(opt);
// });

// // Update days based on month/year
// function updateDays() {
//   const year = +yearSelect.value;
//   const month = +monthSelect.value;
//   const daysInMonth = new Date(year, month, 0).getDate();
//   dateSelect.innerHTML = '<option value="">Date</option>';
//   for (let i = 1; i <= daysInMonth; i++) {
//     const opt = document.createElement('option');
//     opt.value = i;
//     opt.text = i;
//     dateSelect.appendChild(opt);
//   }
// }

// yearSelect.addEventListener('change', updateDays);
// monthSelect.addEventListener('change', updateDays);

// // --- Form Submission ---
// function validateFormData() {
//   const name = document.getElementById('inputName').value.trim();
//   const profileImage = document.querySelector('input[name="profileImageOptions"]:checked');
//   const gender = document.querySelector('input[name="genderRadioOptions"]:checked');
//   const departments = document.querySelectorAll('input[name="departmentOptions"]:checked');
//   const salary = document.getElementById('salaryRange').value;
//   const date = dateSelect.value;
//   const month = monthSelect.value;
//   const year = yearSelect.value;
//   const notes = document.getElementById('Textarea1').value.trim();

//   if (!name || !profileImage || !gender || departments.length === 0 || !salary || !date || !month || !year) {
//     alert('Please fill in all required fields.');
//     return null;
//   }

//   const deptArray = Array.from(departments).map(d => d.value);

//   return {
//     name,
//     profileImage: profileImage.value,
//     gender: gender.value,
//     departments: deptArray,
//     salary,
//     startDate: `${date}-${monthNames[month - 1]}-${year}`,
//     notes
//   };
// }

// function saveToLocalStorage(empObj) {
//   const data = JSON.parse(localStorage.getItem('employees')) || [];

//   const isDuplicate = data.some(emp =>
//     emp.name === empObj.name &&
//     emp.gender === empObj.gender &&
//     emp.startDate === empObj.startDate
//   );

//   if (isDuplicate) {
//     alert("Duplicate employee entry.");
//     return;
//   }

//   data.push(empObj);
//   localStorage.setItem('employees', JSON.stringify(data));
//   window.location.href = '../pages/home.html';
// }

// // Event Listeners
// document.getElementById('payroll-form').addEventListener('submit', function (e) {
//   e.preventDefault();
//   const formData = validateFormData();
//   if (formData) {
//     saveToLocalStorage(formData);
//   }
// });

// document.getElementById('cancelBtn').addEventListener('click', () => {
//   window.location.href = '../pages/home.html';
// });


$(document).ready(function () {
  const $date = $('#date');
  const $month = $('#month');
  const $year = $('#year');

  // Populate year dropdown
  for (let y = 2000; y <= 2030; y++) {
    $year.append(`<option value="${y}">${y}</option>`);
  }

  // Populate month dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  months.forEach((m, i) => {
    $month.append(`<option value="${i + 1}">${m}</option>`);
  });

  // Update days based on selected month/year
  function updateDays() {
    const year = +$year.val();
    const month = +$month.val();
    if (!year || !month) return;

    const daysInMonth = new Date(year, month, 0).getDate();
    $date.empty().append('<option value="">Date</option>');
    for (let d = 1; d <= daysInMonth; d++) {
      $date.append(`<option value="${d}">${d}</option>`);
    }
  }

  $year.on('change', updateDays);
  $month.on('change', updateDays);

  // Cancel button
  $('#cancelBtn').on('click', function () {
    window.location.href = '../pages/home.html';
  });

  // Submit form
  $('#payroll-form').on('submit', function (e) {
    e.preventDefault();

    const name = $('#inputName').val().trim();
    const profileImage = $('input[name="profileImageOptions"]:checked').val();
    const gender = $('input[name="genderRadioOptions"]:checked').val();
    const departments = $('input[name="departmentOptions"]:checked').map(function () {
      return this.value;
    }).get();
    const salary = $('#salaryRange').val();
    const date = $('#date').val();
    const month = $('#month').val();
    const year = $('#year').val();
    const notes = $('#Textarea1').val().trim();

    if (!name || !profileImage || !gender || departments.length === 0 || !salary || !date || !month || !year) {
      alert('Please fill in all required fields.');
      return;
    }

    const startDate = `${date}-${months[month - 1]}-${year}`;

    const employee = {
      name,
      profileImage,
      gender,
      departments,
      salary,
      startDate,
      notes
    };

    // Duplicate check before saving
    $.get('http://localhost:3000/employees', function (existingEmployees) {
      const isDuplicate = existingEmployees.some(emp =>
        emp.name === name &&
        emp.gender === gender &&
        emp.startDate === startDate
      );

      if (isDuplicate) {
        alert("Duplicate employee entry.");
        return;
      }

      // Add to server if not duplicate
      $.ajax({
        url: 'http://localhost:3000/employees',
        type: 'POST',
        data: JSON.stringify(employee),
        contentType: 'application/json',
        success: function () {
          window.location.href = '../pages/home.html';
        },
        error: function (err) {
          console.error('Error saving employee:', err);
        }
      });
    });
  });
});
