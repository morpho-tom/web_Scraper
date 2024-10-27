const puppeteer = require("puppeteer");
const db = require("../models");
const District = db.District;
const Block = db.Block;

const url = "http://tnagriculture.in/mannvalam/soils/en";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('select[name="district"]');

  const districts = await District.findAll();

  // Step 2: Iterate through each district
  for (const district of districts) {
    console.log(`Processing district: ${district.name}`);
    // Select the district in the dropdown
    await page.select('select[name="district"]', district.value);

    // Wait for the block select to be populated
    await page.waitForFunction(() => {
      const blockSelect = document.querySelector('select[name="block"]');
      return blockSelect && blockSelect.options.length > 0;
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

    const validBlock = blockOptions.filter(
      (block) => block.value !== "Select Block"
    );

    console.log("find the valid @###@@#@#@##@", validBlock);
    // Step 4: Save the block options to the database
    for (const block of validBlock) {
      await Block.upsert({
        value: block.value, // Unique identifier for the record
        name: block.name,
        District_code: district.value,
      })
        .then(() => {
          console.log(`Upserted block with value: ${block.value}`);
        })
        .catch((error) => {
          console.log(
            `Error upserting block with value ${block.value}: ${error.message}`
          );
        });
    }

    console.log(`Blocks for district ${district.name} saved successfully!`);
  }

  await browser.close();
};

main();
