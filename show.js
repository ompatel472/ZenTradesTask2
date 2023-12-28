document.addEventListener("DOMContentLoaded", async function () {
  const itemsPerPage = 15; // Set the number of items per page
  const maxVisiblePages = 3; // Set the maximum number of visible pages in the pagination
  var data = JSON.parse(localStorage.getItem("myData"));
  var fields = JSON.parse(localStorage.getItem("fields"));
  console.log(data);
  console.log(fields);

  // Display data in the table
  const displayData = (data, page, fieldsToDisplay) => {
    const tableBody = document.getElementById("tableBody");
    const tableHead = document.getElementById("tableHead");

    // Clear table body and head
    tableBody.innerHTML = "";
    tableHead.innerHTML = "";

    // Create table headings
    const headRow = document.createElement("tr");
    fieldsToDisplay.forEach((field) => {
      const th = document.createElement("th");
      th.textContent = field;
      headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const productsToDisplay = data.slice(startIndex, endIndex);

    productsToDisplay.forEach((product) => {
      const row = document.createElement("tr");

      // Loop through the fields array to generate HTML for each field
      fieldsToDisplay.forEach((field) => {
        const cell = document.createElement("td");
        cell.textContent = product[field];
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
  };

  // Generate pagination links with ellipsis
  const generatePagination = (totalPages, currentPage) => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - Math.floor(maxVisiblePages / 2) &&
          i <= currentPage + Math.floor(maxVisiblePages / 2))
      ) {
        const li = document.createElement("li");
        li.textContent = i;
        li.addEventListener("click", () => onPageClick(i));
        pagination.appendChild(li);
      } else if (pagination.lastChild.textContent !== "...") {
        const li = document.createElement("li");
        li.textContent = "...";
        pagination.appendChild(li);
      }
    }
  };

  // Handle pagination click event
  const onPageClick = (page) => {
    displayData(productsArray, page, fields);
    generatePagination(totalPages, page);
  };

  // Fetch and display data
  const rawData = data;
  const productsArray = Object.entries(rawData.products).map(
    ([key, value]) => ({ id: key, ...value })
  );
  productsArray.sort((a, b) => b.popularity - a.popularity);

  const totalPages = Math.ceil(productsArray.length / itemsPerPage);
  generatePagination(totalPages, 1);

  // Initial display on the first page
  displayData(productsArray, 1, fields);
});
