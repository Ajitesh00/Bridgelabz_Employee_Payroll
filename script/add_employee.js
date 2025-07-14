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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // --- Populate year dropdown (2000–2030) ---
  for (let y = 2000; y <= 2030; y++) {
    $year.append(`<option value="${y}">${y}</option>`);
  }

  // --- Populate month dropdown ---
  months.forEach((m, i) => {
    $month.append(`<option value="${i + 1}">${m}</option>`);
  });

  // --- Update days when month or year is changed ---
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

  // --- Check if editing ---
  const editId = localStorage.getItem('editEmployeeId');

  if (editId) {
    $.ajax({
      url: `http://localhost:3000/employees/${editId}`,
      type: 'GET',
      success: function (emp) {
        $('#inputName').val(emp.name);
        $(`input[name="profileImageOptions"][value="${emp.profileImage}"]`).prop('checked', true);
        $(`input[name="genderRadioOptions"][value="${emp.gender}"]`).prop('checked', true);

        emp.departments.forEach(dep => {
          $(`input[name="departmentOptions"][value="${dep}"]`).prop('checked', true);
        });

        $('#salaryRange').val(emp.salary);

        const [day, monthName, year] = emp.startDate.split('-');
        const monthIndex = months.indexOf(monthName) + 1;

        $('#year').val(year);
        $('#month').val(monthIndex);
        updateDays(); // Important before setting day
        $('#date').val(day);

        $('#Textarea1').val(emp.notes);
      },
      error: function () {
        // ID not found, remove it
        localStorage.removeItem('editEmployeeId');
        console.warn('Edit ID not found. Switching to add mode.');
      }
    });
  }

  // --- Cancel Button ---
  $('#cancelBtn').on('click', function () {
    localStorage.removeItem('editEmployeeId');
    window.location.href = '../pages/home.html';
  });

  // --- Form Submission ---
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

    // --- Validation ---
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

    // --- Check for duplicate before saving ---
    $.get('http://localhost:3000/employees', function (existingEmployees) {
      const isDuplicate = existingEmployees.some(emp =>
        emp.name === name &&
        emp.gender === gender &&
        emp.startDate === startDate &&
        (!editId || emp.id != editId) // skip self when editing
      );

      if (isDuplicate) {
        alert("Duplicate employee entry.");
        return;
      }

      const url = editId
        ? `http://localhost:3000/employees/${editId}`
        : `http://localhost:3000/employees`;

      const method = editId ? 'PUT' : 'POST';

      $.ajax({
        url,
        type: method,
        data: JSON.stringify(employee),
        contentType: 'application/json',
        success: function () {
          localStorage.removeItem('editEmployeeId');
          window.location.href = '../pages/home.html';
        },
        error: function (err) {
          console.error('Error saving employee:', err);
        }
      });
    });
  });
});