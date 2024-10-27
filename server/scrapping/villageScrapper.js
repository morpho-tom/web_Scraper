const puppeteer = require("puppeteer");
const db = require("../models"); // Import models
const District = db.District; // Assuming you want to include districts again
const Block = db.Block;
const Village = db.Village;

const url = "http://tnagriculture.in/mannvalam/soils/en";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0); // Disable timeout for long operations
  await page.goto(url, { timeout: 0 });

  await page.waitForSelector('select[name="district"]'); // Wait for the district dropdown

  // Step 1: Fetch all districts from the database
  const districts = await District.findAll({});

  // Step 2: Iterate through each district
  for (const district of districts) {
    console.log(`Processing district: ${district.name}`);

    // Select the district in the dropdown
    await page.select('select[name="district"]', district.value);

    // Wait for the block dropdown to be populated after selecting a district
    await page.waitForFunction(() => {
      const blockSelect = document.querySelector('select[name="block"]');
      return blockSelect && blockSelect.options.length > 0;
    });

    // Step 3: Fetch blocks that are associated with the current district
    const blocks = await Block.findAll({
      where: { District_code: district.value }, // Get blocks for the current district
    });

    // Step 4: Iterate through each block for the current district
    for (const block of blocks) {
      console.log(
        `Processing block: ${block.name} for district: ${district.name}`
      );

      // Select the block in the dropdown
      await page.select('select[name="block"]', block.value);

      // Wait for the village dropdown to be populated after selecting a block
      await page.waitForFunction(() => {
        const villageSelect = document.querySelector('select[name="village"]');
        return villageSelect && villageSelect.options.length > 0;
      });

      // Step 5: Get all village options for the selected block
      const villageOptions = await page.evaluate(() => {
        const selectElement = document.querySelector('select[name="village"]');
        const options = Array.from(selectElement.options);

        return options
          .filter((option) => option.value && option.value !== "")
          .map((option) => ({
            value: option.value.trim(),
            name: option.textContent.trim(),
          }));
      });

      const validVillage = villageOptions.filter(
        (village) => village.value !== "Select Village"
      );

      // Step 6: Save the village options to the database
      for (const village of validVillage) {
        await Village.upsert({
          value: village.value, // Unique identifier for the record
          name: village.name,
          District_code: district.value, // Foreign key to District
          Block_code: block.value, // Foreign key to Block
        })
          .then(() => {
            console.log(`Upserted village with value: ${village.value}`);
          })
          .catch((error) => {
            console.log(
              `Error upserting village with value ${village.value}: ${error.message}`
            );
          });
      }

      console.log(`Villages for block: ${block.name} saved successfully!`);
    }

    console.log(
      `Blocks and villages for district ${district.name} saved successfully!`
    );
  }

  await browser.close(); // Close the browser after completion
};

main();
