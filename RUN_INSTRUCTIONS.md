NetSpan – Running the Project Using GitHub Codespaces

This document provides step-by-step instructions to run the NetSpan web application using GitHub Codespaces.
No local environment setup is required beyond a GitHub account.

🚀 Quick Start Guide
Step 1: Open the Repository

Navigate to the NetSpan GitHub repository:
https://github.com/Neel-Asher/NetSpan

Step 2: Create a GitHub Codespace

Click the <> Code button on the repository page

Select the Codespaces tab

Click Create codespace on main

GitHub will automatically provision a cloud-based development environment.

Step 3: Install Dependencies and Run the Project

Once the Codespace is fully loaded, open the terminal and run the following commands in the given order:

npm i
nvm install 20
nvm use 20
npm run dev

Step 4: Access the Application

After the development server starts:

A localhost URL will appear in the terminal

Hold Ctrl and click the link

You will be redirected to the NetSpan application in your browser

✅ You’re Ready to Go

You can now:

Explore Random Simulation mode

Build custom networks using Custom Builder

Visualize Kruskal’s and Prim’s algorithms

Follow the in-app interactive tutorial

🛠️ Troubleshooting

If npm is not recognized, reload the Codespace

If the application fails to start, verify the Node version:

node -v


The recommended version is Node.js v20

📌 Notes

Recommended Node.js version: 20

Works best on modern Chromium-based browsers

Internet connection is required for GitHub Codespaces
