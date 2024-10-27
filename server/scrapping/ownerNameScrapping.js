const puppeteer = require("puppeteer");
const db = require("../models"); // Import models
const District = db.District;
const Block = db.Block;
const Village = db.Village;
const Survey = db.Survey;
const OwnerName = db.OwnerName;

const url = "http://tnagriculture.in/mannvalam/soils/en";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0); // Disable timeout for long operations
  await page.goto(url, { timeout: 0 });

  await page.waitForSelector('select[name="district"]'); // Wait for the district dropdown to load

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

      // Step 5: Fetch all villages for the current block
      const villages = await Village.findAll({
        where: { District_code: district.value, Block_code: block.value },
      });

      // Step 6: Iterate through each village for the current block
      for (const village of villages) {
        console.log(
          `Processing village: ${village.name} in block: ${block.name}, district: ${district.name}`
        );

        // Select the village in the dropdown
        await page.select('select[name="village"]', village.value);

        // Wait for the Survey Number dropdown to load
        await page.waitForSelector('select[name="Survey_no"]');

        await page.waitForFunction(() => {
          const survey_no_select = document.querySelector(
            'select[name="Survey_no"]'
          );
          return survey_no_select && survey_no_select.options.length > 0;
        });

        // Fetch surveys for the current district, block, and village
        const surveys = await Survey.findAll({
          where: {
            District_code: district.value,
            Block_code: block.value,
            Village_code: village.value,
          },
        });

        // Step 7: Iterate through each survey
        for (const survey of surveys) {
          await page.select(
            'select[name="Survey_no"]',
            survey.survey_no.toString()
          );

          // Wait for the ownerName dropdown to load
          await page.waitForFunction(() => {
            const ownerNameSelect = document.querySelector(
              'select[name="ownerName"]'
            );
            return ownerNameSelect && ownerNameSelect.options.length > 0;
          });

          // Step 8: Scrape the owner names from the dropdown
          const ownerNames = await page.evaluate(() => {
            const selectElement = document.querySelector(
              "select[name='ownerName']"
            );
            const options = Array.from(selectElement.options);
            return options
              .filter((option) => option.value.trim() !== "") // Exclude empty or invalid options
              .map((option) => ({
                value: option.value.trim(),
                name: option.textContent.trim(),
              }));
          });

          // Step 9: Filter out any invalid owner names (like headers or empty fields)
          const validOwnerNames = ownerNames.filter(
            (owner) =>
              owner.name !== "Land Owner Name - Subdivision No" &&
              owner.name.trim() !== ""
          );

          // Step 10: Prepare and upsert unique owner data
          for (const owner of validOwnerNames) {
            const ownerData = {
              OwnerName: owner.value,
              survey_id: survey.id,
              District_code: district.value,
              Block_code: block.value,
              Village_code: village.value,
            };

            // Upsert the entry: insert if new, or update if it exists
            await OwnerName.upsert(ownerData)
              .then(() => {
                console.log(`Upserted owner name: ${owner.value}`);
              })
              .catch((error) => {
                console.error(`Error upserting owner name: ${error.message}`);
              });
          }
        }
      }
    }

    console.log(
      `Blocks, villages, surveys, and owner names for district ${district.name} processed successfully!`
    );
  }

  await browser.close(); // Close the browser after completion
};

main();
