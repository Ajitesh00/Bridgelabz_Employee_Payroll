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
          const departments = emp.departments.map(dep => `<span class="inline-block bg-lime-200 text-gray-800 px-2 py-1 rounded mr-1">${dep}</span>`).join('');

          const row = `
            <tr>
              <td>
                <div class="flex items-center gap-2">
                  <img class="w-8 h-8 rounded-full" src="${emp.profileImage}" alt="Profile">
                  <span>${emp.name}</span>
                </div>
              </td>
              <td>${emp.gender}</td>
              <td>${departments}</td>
              <td>${emp.salary}</td>
              <td>${emp.startDate}</td>
              <td>
                <button class="btn bg-transparent border-none p-0 m-0 w-8 h-8 bg-[url('/assets/edit.png')] bg-no-repeat bg-center bg-[length:20px_20px] hover:opacity-60" data-id="${emp.id}" title="Edit"></button>
                <button class="btn bg-transparent border-none p-0 m-0 w-8 h-8 bg-[url('/assets/delete.png')] bg-no-repeat bg-center bg-[length:20px_20px] hover:opacity-60 ms-2" data-id="${emp.id}" title="Delete"></button>
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
  $('#employee-table-body').on('click', '.btn[title="Delete"]', function () {
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

  $('#employee-table-body').on('click', '.btn[title="Edit"]', function () {
    const id = $(this).data('id');
    localStorage.setItem('editEmployeeId', id);
    window.location.href = '../pages/add_employee.html';
  });
});