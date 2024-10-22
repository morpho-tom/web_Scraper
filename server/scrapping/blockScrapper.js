const puppeteer = require("puppeteer");
const db = require("../models"); // Import all models
const District = db.District; // Get the District model
const Block = db.Block; // Get the Block model

const url = "http://tnagriculture.in/mannvalam/soils/en";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('select[name="district"]');

  const districts = await District.findAll();

  // Step 2: Iterate through each district
  for (const district of districts) {
    // Select the district in the dropdown
    await page.select('select[name="district"]', district.value);

    // Wait for the block select to be populated
    await page.waitForFunction(() => {
      const blockSelect = document.querySelector('select[name="block"]');
      return blockSelect && blockSelect.options.length > 1;
    });

    // Step 3: Get all block options
    const blockOptions = await page.evaluate(() => {
      const selectElement = document.querySelector('select[name="block"]');
      const options = Array.from(selectElement.options);

      return options
        .filter((option) => option.value && option.value !== "")
        .map((option) => ({
          value: option.value.trim(),
          name: option.textContent.trim(),
        }));
    });

    // Step 4: Save the block options to the database
    for (const block of blockOptions) {
      await Block.findOrCreate({
        where: { value: block.value },
        defaults: { name: block.name, District_code: district.value },
      });
    }

    console.log(`Blocks for district ${district.name} saved successfully!`);
  }

  await browser.close();
};

main();
