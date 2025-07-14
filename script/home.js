// function loadEmployees() {
//   const employees = JSON.parse(localStorage.getItem("employees")) || [];
//   const tableBody = document.getElementById("employee-table-body");
//   tableBody.innerHTML = "";

//   employees.forEach((emp, index) => {
//     const row = document.createElement("tr");

//     // Name & Profile
//     const nameCell = document.createElement("td");
//     nameCell.innerHTML = `
// 			<div class="emp-name-cell">
//       <img class="profile-img" src="${emp.profileImage}" alt="Profile">
//       <span>${emp.name}</span>
// 			</div>
//     `;
//     row.appendChild(nameCell);

//     // Gender
//     const genderCell = document.createElement("td");
//     genderCell.textContent = emp.gender;
//     row.appendChild(genderCell);

//     // Department (as badges)
//     const deptCell = document.createElement("td");
//     emp.departments.forEach(dep => {
//       const badge = document.createElement("span");
//       badge.className = "badge";
//       badge.textContent = dep;
//       deptCell.appendChild(badge);
//     });
//     row.appendChild(deptCell);

//     // Salary
//     const salaryCell = document.createElement("td");
//     salaryCell.textContent = emp.salary;
//     row.appendChild(salaryCell);

//     // Start Date
//     const dateCell = document.createElement("td");
//     dateCell.textContent = emp.startDate;
//     row.appendChild(dateCell);

//     // Actions (Delete)
//     const actionCell = document.createElement("td");
//     const deleteBtn = document.createElement("button");
//     deleteBtn.className = "delete-btn";
//     deleteBtn.title = "Delete";
//     deleteBtn.addEventListener("click", () => deleteEmployee(index));
//     actionCell.appendChild(deleteBtn);
//     row.appendChild(actionCell);

//     tableBody.appendChild(row);
//   });
// }

// function deleteEmployee(index) {
//   const data = JSON.parse(localStorage.getItem("employees")) || [];
//   data.splice(index, 1);
//   localStorage.setItem("employees", JSON.stringify(data));
//   loadEmployees();
// }

// window.onload = loadEmployees;


$(document).ready(function () {
  getStoredUsers();

  function getStoredUsers() {
    $.ajax({
      url: 'http://localhost:3000/employees',
      type: 'GET',
      success: function (employees) {
        const $tbody = $('#employee-table-body');
        $tbody.empty();

        employees.forEach(emp => {
          const departments = emp.departments.map(dep => `<span class="badge">${dep}</span>`).join('');

          const row = `
            <tr>
              <td>
                <div class="emp-name-cell">
                  <img class="profile-img" src="${emp.profileImage}" alt="Profile">
                  <span>${emp.name}</span>
                </div>
              </td>
              <td>${emp.gender}</td>
              <td>${departments}</td>
              <td>${emp.salary}</td>
              <td>${emp.startDate}</td>
              <td>
                <button class="edit-btn" data-id="${emp.id}" title="Edit"></button>
                <button class="delete-btn" data-id="${emp.id}" title="Delete"></button>
              </td>
            </tr>
          `;
          $tbody.append(row);
        });
      },
      error: function (err) {
        console.error("Error fetching employees:", err);
      }
    });
  }

  // Delete handler using delegation
  $('#employee-table-body').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `http://localhost:3000/employees/${id}`,
      type: 'DELETE',
      success: function () {
        getStoredUsers();
      },
      error: function (err) {
        console.error("Error deleting employee:", err);
      }
    });
  });

  $('#employee-table-body').on('click', '.edit-btn', function () {
  const id = $(this).data('id');
  localStorage.setItem('editEmployeeId', id);
  window.location.href = '../pages/add_employee.html';
});

});