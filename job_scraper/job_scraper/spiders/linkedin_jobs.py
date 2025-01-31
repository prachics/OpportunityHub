import scrapy
import datetime
from pymongo import MongoClient, errors

class LinkedInJobsSpider(scrapy.Spider):
    name = "linkedin_jobs"
    allowed_domains = ["linkedin.com"]
    start_urls = [
        "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer"
    ]

    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    def __init__(self):
        try:
            # Connect to MongoDB
            self.client = MongoClient("mongodb+srv://saibewarp:saibewarp@cluster0.t9nwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
            self.db = self.client["jobcruncher"]
            self.collection = self.db["jobs"]

              # Test connection
            self.client.server_info()
            print("✅ Successfully connected to MongoDB Atlas!")

        except errors.ServerSelectionTimeoutError as err:
            print("❌ MongoDB Connection Error:", err)
            self.client = None  # Prevent further DB operations

    def parse(self, response):
        if self.client is None:
            self.logger.error("Skipping DB insertion due to MongoDB connection failure.")
            return
        
        today = datetime.datetime.now().date()
        jobs = response.css("div.base-card")

        if not jobs:
            self.logger.warning("No job listings found. LinkedIn may be blocking requests.")

        for job in jobs:
            date_posted_text = job.css("time::attr(datetime)").get()
            job_date = None

            if date_posted_text:
                try:
                    job_date = datetime.datetime.strptime(date_posted_text, "%Y-%m-%d").date()
                except ValueError:
                    self.logger.warning(f"Could not parse date: {date_posted_text}")

            if job_date and job_date == today:
                job_data = {
                    "title": job.css("h3.base-search-card__title::text").get(default="").strip(),
                    "company": job.css("h4.base-search-card__subtitle::text").get(default="").strip(),
                    "location": job.css("span.job-search-card__location::text").get(default="").strip(),
                    "date_posted": job_date.isoformat(),
                    "link": job.css("a::attr(href)").get(),
                }

                print("✅ Job Found:", job_data)  # Debugging output

                try:
                    insert_result = self.collection.insert_one(job_data)
                    print(f"✅ Successfully inserted into MongoDB: {insert_result.inserted_id}")
                except errors.PyMongoError as e:
                    print(f"❌ MongoDB Insert Error: {e}")

                yield job_data

    def closed(self, reason):
        if self.client:
            self.client.close()  # Close MongoDB connection