# Appwrite backend

### Used Services

- _Functions_ : The serverless code is deployed in the functions.
- _Database_ : The whole database is stored in the appwrite.

### Project Explanation

- All the api's are written in a single function api to reduce too much of function api's. Every api's are split using the _action_ key in the payload.
- Since the functions do not support passing param in header, the usertoken is passed through the body section.
