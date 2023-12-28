document.addEventListener("DOMContentLoaded", function () {
  const fileTypeSelect = document.getElementById("fileType");
  const encodingSelect = document.getElementById("encoding");
  const delimiterInput = document.getElementById("delimiter");
  const hasHeaderCheckbox = document.getElementById("hasHeader");
  const fileInput = document.getElementById("fileInput");
  const displayFields = document.getElementById("displayFields");
  const selectedFields = document.getElementById("selectedFields");
  const addFieldsButton = document.getElementById("addFields");
  const removeFieldsButton = document.getElementById("removeFields");
  const nextButton = document.getElementById("nextButton");
  const displayHandling = document.getElementById("displayHandling");
  var fileData;

  addFieldsButton.addEventListener("click", function () {
    moveSelectedOptions(displayFields, selectedFields);
  });

  removeFieldsButton.addEventListener("click", function () {
    moveSelectedOptions(selectedFields, displayFields);
  });

  nextButton.addEventListener("click", function () {
    var selectOptions = extractOptions("selectedFields");
    console.log(selectOptions);
    console.log(fileData);
    if (fileTypeSelect.value === "csv") {
      fileData = csvToJson(fileData, delimiterInput.value);
    }
    console.log(fileData);

    localStorage.setItem("myData", JSON.stringify(fileData));
    localStorage.setItem("fields", JSON.stringify(selectOptions));
    window.location.href = "show.html";
  });

  displayHandling.addEventListener("change", function () {
    if (displayHandling.checked == 1) {
    
      const file = fileInput.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const data = e.target.result;
          const fields = getFieldsFromData(
            data,
            fileTypeSelect.value,
            delimiterInput.value,
            hasHeaderCheckbox.checked
          );

          populateSelectOptions(displayFields, fields);
          populateSelectOptions(selectedFields, []);
        };

        if (fileTypeSelect.value === "json") {
          reader.readAsText(file, encodingSelect.value);
        } else if (fileTypeSelect.value === "csv") {
          reader.readAsText(file, encodingSelect.value);
        }
      }
    }
  });

  function getFieldsFromData(data, fileType, delimiter, hasHeader) {
    
    console.log(delimiter);
    if (fileType === "json") {
      const jsonData = JSON.parse(data);
      fileData = jsonData;
      const firstProduct = Object.values(jsonData.products)[0];
      return Object.keys(firstProduct);
    } else if (fileType === "csv") {
      const lines = data.split("\n");
      fileData = data;
      const header = hasHeader ? lines[0] : lines[1];
      console.log(header.split(delimiter));
      return header.split(delimiter);
    }
    return [];
  }

  function populateSelectOptions(selectElement, options) {
    selectElement.innerHTML = "";
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
  }

  function moveSelectedOptions(sourceSelect, destinationSelect) {
    const selectedOptions = getSelectedOptions(sourceSelect);
    removeOptions(sourceSelect, selectedOptions);
    addOptions(destinationSelect, selectedOptions);
  }

  function getSelectedOptions(selectElement) {
    return Array.from(selectElement.selectedOptions);
  }

  function getSelectedOptionsValues(selectElement) {
    return getSelectedOptions(selectElement).map((option) => option.value);
  }

  function removeOptions(selectElement, options) {
    options.forEach((option) => {
      selectElement.remove(option.index);
    });
  }

  function addOptions(selectElement, options) {
    options.forEach((option) => {
      const newOption = document.createElement("option");
      newOption.value = option.value;
      newOption.textContent = option.textContent;
      selectElement.add(newOption);
    });
  }

  function extractOptions(selectId) {
    
    var selectElement = document.getElementById(selectId);

    
    if (selectElement) {
      var options = selectElement.options;
      var optionsArray = [];
      for (var i = 0; i < options.length; i++) {
        optionsArray.push(options[i].value);
      }

      return optionsArray;
    } else {
      console.error("Select element with id " + selectId + " not found.");
      return null;
    }
  }

  function csvToJson(csvData, delimiter) {
    const lines = csvData.split("\n");
    const headers = lines[0].split(delimiter);
    const jsonData = { count: lines.length - 1, products: {} };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter);
      const product = {};
      for (let j = 0; j < headers.length; j++) {
        product[headers[j]] = values[j];
      }
      jsonData.products[i] = product;
    }

    return jsonData;
  }
});
