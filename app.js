const express = require('express');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Page = require('./models/page');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/internetTimeMachine', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Function to scrape website
const scrapeWebsite = async (url) => {
  try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Increase navigation timeout
      await page.setDefaultNavigationTimeout(60000);

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      const html = await page.content();
      const $ = cheerio.load(html);

      const pageRecord = new Page({ url, html });
      await pageRecord.save();

      console.log(`Page saved: ${url}`);
      await browser.close();
  } catch (error) {
      if (error.name === 'TimeoutError') {
          console.error(`Timeout error scraping ${url}, retrying...`);
          setTimeout(() => scrapeWebsite(url), 5000); 
      } else {
          console.error(`Error scraping ${url}:`, error);
      }
  }
};


app.get('/get',async(req,res)=>{
  res.json("Welcome");
})

// Route to trigger scraping
app.get('/scrape', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('Please provide a URL to scrape.');
    }

    await scrapeWebsite(url);
    res.send(`Scraping completed for ${url}`);
});

// Route to view stored pages
app.get('/pages', async (req, res) => {
    const pages = await Page.find().sort({ timestamp: -1 });
    res.json(pages);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
