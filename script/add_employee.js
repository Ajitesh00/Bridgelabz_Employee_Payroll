// --- Populate Date Selectors ---
const dateSelect = document.getElementById('date');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');

// Populate years (2000-2030)
for (let y = 2000; y <= 2030; y++) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.text = y;
  yearSelect.appendChild(opt);
}

// Populate months
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
monthNames.forEach((m, i) => {
  const opt = document.createElement('option');
  opt.value = i + 1;
  opt.text = m;
  monthSelect.appendChild(opt);
});

// Update days based on month/year
function updateDays() {
  const year = +yearSelect.value;
  const month = +monthSelect.value;
  const daysInMonth = new Date(year, month, 0).getDate();
  dateSelect.innerHTML = '<option value="">Date</option>';
  for (let i = 1; i <= daysInMonth; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.text = i;
    dateSelect.appendChild(opt);
  }
}

yearSelect.addEventListener('change', updateDays);
monthSelect.addEventListener('change', updateDays);

// --- Form Submission ---
function validateFormData() {
  const name = document.getElementById('inputName').value.trim();
  const profileImage = document.querySelector('input[name="profileImageOptions"]:checked');
  const gender = document.querySelector('input[name="genderRadioOptions"]:checked');
  const departments = document.querySelectorAll('input[name="departmentOptions"]:checked');
  const salary = document.getElementById('salaryRange').value;
  const date = dateSelect.value;
  const month = monthSelect.value;
  const year = yearSelect.value;
  const notes = document.getElementById('Textarea1').value.trim();

  if (!name || !profileImage || !gender || departments.length === 0 || !salary || !date || !month || !year) {
    alert('Please fill in all required fields.');
    return null;
  }

  const deptArray = Array.from(departments).map(d => d.value);

  return {
    name,
    profileImage: profileImage.value,
    gender: gender.value,
    departments: deptArray,
    salary,
    startDate: `${date}-${monthNames[month - 1]}-${year}`,
    notes
  };
}

function saveToLocalStorage(empObj) {
  const data = JSON.parse(localStorage.getItem('employees')) || [];

  const isDuplicate = data.some(emp =>
    emp.name === empObj.name &&
    emp.gender === empObj.gender &&
    emp.startDate === empObj.startDate
  );

  if (isDuplicate) {
    alert("Duplicate employee entry.");
    return;
  }

  data.push(empObj);
  localStorage.setItem('employees', JSON.stringify(data));
  window.location.href = '../pages/home.html';
}

// Event Listeners
document.getElementById('payroll-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = validateFormData();
  if (formData) {
    saveToLocalStorage(formData);
  }
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  window.location.href = '../pages/home.html';
});
