## NC News!

# Hosted-version
[nc-news](https://be-nc-news-2e46.onrender.com)

# Summary
This project is a **back-end** server built using *Node.js* and *Express.js* for a forum-based platform. 
It provides API endpoints, and makes use of a *PostgreSQL* database to store and retrieve data.

# Setup

**Clone**
*Clone* the repo
`git clone https://github.com/elliejaneeeeee/be-nc-news.git`

**Install Dependencies**
Navigate to the project directory and run:
`npm install`

**Seed Local Database**
Before seeding, create two files with the necessary database connections. [^1]

.env.development
: `PGDATABASE=nc_news`

.env.test
: `PGDATABASE=nc_news_test`

**Run Tests**
`npm test`

[^1]: Make sure the environment files are added to your .gitignore

# Minimum Versions
**Node.js**: v21.6.2 or later
**PostgreSQl**: v14.11 or later



In order to successfully connect to the databases locally, create two files (.env.test, .env.development) with the relevant database variables:
    PGDATABASE=nc_news
    PGDATABASE=nc_news_test
