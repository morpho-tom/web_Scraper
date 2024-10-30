document.addEventListener("DOMContentLoaded", () => {
  const districtDropdown = document.getElementById("district");
  const blockDropdown = document.getElementById("block");
  const villageDropdown = document.getElementById("village");
  const surveyDropdown = document.getElementById("survey_no");
  const ownerDropdown = document.getElementById("owner_name");

  loadDistricts();

  districtDropdown.addEventListener("change", async function () {
    const districtCode = this.value;
    resetDropdowns([
      blockDropdown,
      villageDropdown,
      surveyDropdown,
      ownerDropdown,
    ]);
    if (districtCode) loadBlocks(districtCode);
  });

  blockDropdown.addEventListener("change", async function () {
    const blockCode = this.value;
    resetDropdowns([villageDropdown, surveyDropdown, ownerDropdown]);
    if (blockCode) loadVillages(blockCode);
  });

  villageDropdown.addEventListener("change", async function () {
    const villageCode = this.value;
    resetDropdowns([surveyDropdown, ownerDropdown]);
    if (villageCode) loadSurveys(villageCode);
  });

  surveyDropdown.addEventListener("change", async function () {
    const surveyId = this.value;
    resetDropdowns([ownerDropdown]);
    if (surveyId) loadOwners(surveyId);
  });

  async function loadDistricts() {
    try {
      const response = await fetch("/api/v1/districts");
      const data = await response.json();
      populateDropdown(districtDropdown, data.districts, "District");
    } catch (error) {
      console.error("Error fetching district data:", error);
    }
  }

  async function loadBlocks(districtCode) {
    try {
      const response = await fetch(
        `/api/v1/blocks?districtCode=${districtCode}`
      );
      const data = await response.json();
      populateDropdown(blockDropdown, data.blocks, "Block");
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  }

  async function loadVillages(blockCode) {
    try {
      const response = await fetch(`/api/v1/villages?blockCode=${blockCode}`);
      const data = await response.json();
      populateDropdown(villageDropdown, data.villages, "Village");
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  }

  async function loadSurveys(villageCode) {
    try {
      const response = await fetch(
        `/api/v1/surveyNo?villageCode=${villageCode}`
      );
      const data = await response.json();
      populateDropdown(surveyDropdown, data.survey_no, "Survey No");
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  }

  async function loadOwners(surveyId) {
    try {
      const response = await fetch(`/api/v1/ownerName?surveyId=${surveyId}`);
      const data = await response.json();
      populateDropdown(ownerDropdown, data.owners, "Owner Name");
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  }

  function resetDropdowns(dropdowns) {
    dropdowns.forEach(
      (dropdown) => (dropdown.innerHTML = `<option value="">Select</option>`)
    );
  }

  function populateDropdown(dropdown, items, placeholder) {
    dropdown.innerHTML = `<option value="">Select ${placeholder}</option>`;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value || item.id;
      option.textContent = item.name || item.survey_no || item.OwnerName;
      dropdown.appendChild(option);
    });
  }
});

// Define download functions globally to ensure onclick works
async function downloadDistrictData() {
  try {
    const response = await fetch("/api/v1/districts");
    const data = await response.json();
    if (data.status === "success")
      exportToExcel(data.districts, "DistrictData");
  } catch (error) {
    console.error("Error fetching districts for download:", error);
  }
}

async function downloadBlockData() {
  const districtCode = document.getElementById("district").value;
  if (!districtCode) {
    alert("Please select a district first.");
    return;
  }
  try {
    const response = await fetch(`/api/v1/blocks?districtCode=${districtCode}`);
    const data = await response.json();
    if (data.status === "success") exportToExcel(data.blocks, "BlockData");
  } catch (error) {
    console.error("Error fetching blocks for download:", error);
  }
}

// Export data to Excel
function exportToExcel(data, filename) {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      ID: item.value || item.id,
      Name: item.name,
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
