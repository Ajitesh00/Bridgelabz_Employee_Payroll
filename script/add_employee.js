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