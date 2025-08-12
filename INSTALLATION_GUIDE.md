# CraftQuote System - Comprehensive Installation Guide

**Version:** 2.0 (Consolidated)
**Date:** August 12, 2025

This guide provides the steps to perform a clean installation of the CraftQuote system. This process is designed to be run once.

---

### Step 1: Initial Project Setup

1.  **Create a New Google Apps Script Project:**
    *   Go to [script.google.com/create](https://script.google.com/create).
    *   Give your project a name, for example, "CraftQuote System".

2.  **Upload Project Files:**
    *   You will need the `clasp` command-line tool to upload the files. If you don't have it, you can install it via `npm install -g @google/clasp`.
    *   Log in to your Google account with `clasp login`.
    *   In your project directory on your computer, run `clasp clone <scriptId>`, replacing `<scriptId>` with the ID from your new Apps Script project's URL.
    *   Copy all the project files (`.gs` and `.html`) into the directory `clasp` created.
    *   Push all the files to your Apps Script project by running `clasp push -f`.

---

### Step 2: Run the Automated Installation

The entire setup process is now handled by a single function.

1.  **Open the Apps Script Editor:**
    *   If you have the project open, you're already there.

2.  **Select the `installCraftQuoteSystem` Function:**
    *   At the top of the editor, find the function selection dropdown menu.
    *   Choose the function named `installCraftQuoteSystem`.

3.  **Run the Script:**
    *   Click the **"Run"** button.

4.  **Authorize Permissions:**
    *   The script will ask for permission to access Google Drive and Google Sheets to create and manage the database.
    *   Click **"Review permissions"**.
    *   Choose your Google account.
    *   You may see a warning that "Google hasn't verified this app". This is normal for your own scripts. Click **"Advanced"** and then **"Go to (your project name) (unsafe)"**.
    *   Review the permissions and click **"Allow"**.

5.  **Check the Execution Log:**
    *   The script will now run and create a new Google Sheet named "CraftQuote System Database". It will also set up all the necessary tabs and triggers.
    *   You can view the progress in the Execution Log at the bottom of the Apps Script editor. It will print "✅ CraftQuote System Deployed Successfully!" when it is finished.

---

### Step 3: Verify the Installation

1.  **Open the Spreadsheet:**
    *   Go to your Google Drive and find the newly created spreadsheet: **"CraftQuote System Database"**.
    *   Open it.

2.  **Check for the Menu:**
    *   A new custom menu named **"🔧 CraftQuote"** should appear in the Google Sheets menu bar within a few seconds.
    *   If it doesn't appear immediately, try refreshing the page.

3.  **Explore the System:**
    *   Click the "🔧 CraftQuote" menu.
    *   Select "📝 Component Assembler" to open the main quoting interface.

---

### System Overview

*   **`Setup.gs`**: This is the main file containing all setup and menu logic. The primary function to run is `installCraftQuoteSystem()`.
*   **`HybridAssemblerBackend.gs`**: This file contains all the core logic for handling components, templates, and quotes.
*   **`*.html` files**: These files create the user interfaces (UIs) for the Component Assembler, Branding Editor, etc.
*   **`Product_Templates` Sheet**: This sheet in your new database now controls the product templates. You can edit component lists and default configurations directly in the spreadsheet.
*   **`Master Catalog` Sheet**: This sheet holds all your component data and pricing. The system reads from this sheet in real-time.

Your system is now installed and ready to use.
