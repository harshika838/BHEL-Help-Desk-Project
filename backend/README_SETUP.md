# How to run this backend locally

1. Open this `backend` folder in VS Code.
2. Open a terminal in VS Code (Terminal > New Terminal).
3. Install dependencies:
   npm install

4. Copy the environment file:
   cp .env.example .env

5. Open .env and fill in your real MySQL password and database name.

6. Make sure MySQL is running on your machine (via MySQL Workbench, XAMPP, or the mysql command line).

7. Start the server in development mode (auto-restarts on changes):
   npm run dev

   Or for a normal start:
   npm start

8. Open your browser to http://localhost:5000
   You should see: {"message":"IT Asset & Help Desk API is running"}
   And in the terminal you should see: ✅ MySQL connected successfully
