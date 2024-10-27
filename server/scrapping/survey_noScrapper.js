const puppeteer = require("puppeteer");
const db = require("../models"); // Import models
const District = db.District;
const Block = db.Block;
const Village = db.Village;
const Survey = db.Survey; // Use the correct model name

const url = "http://tnagriculture.in/mannvalam/soils/en";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
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

        // Step 7: Scrape the survey numbers from the Survey_no dropdown
        const surveyNumbers = await page.evaluate(() => {
          const selectElement = document.querySelector(
            "select[name='Survey_no']"
          );
          const options = Array.from(selectElement.options);

          return options
            .filter((option) => option.value.trim() !== "") // Exclude empty or invalid options
            .map((option) => ({
              survey_no: option.value.trim(), // Use the correct field name
            }));
        });

        // Step 1: Filter out any invalid survey number rows (like headers or empty fields)
        const validSurveys = surveyNumbers
          .filter((survey) => survey.survey_no !== "Survey Number") // Skip header row
          .filter((survey) => survey.survey_no.trim() !== ""); // Skip empty survey numbers

        // Step 2: Prepare the survey data for saving
        for (const survey of validSurveys) {
          const surveyData = {
            survey_no: survey.survey_no,
            District_code: district.value,
            Block_code: block.value,
            Village_code: village.value,
          };

          // Step 3: Use upsert to insert or update the survey data
          await Survey.upsert(surveyData)
            .then(() => {
              console.log(`Upserted survey number: ${survey.survey_no}`);
            })
            .catch((error) => {
              console.error(`Error upserting survey number: ${error.message}`);
            });
        }
      }
    }

    console.log(
      `Blocks, villages, and survey numbers for district ${district.name} processed successfully!`
    );
  }

  await browser.close(); // Close the browser after completion
};

main();
