# Kevin Boyle - Portfolio Website

This is the source code for Kevin Boyle's personal portfolio website, built with React and Vite.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: [Download and install Node.js](https://nodejs.org/) (Version 18 or higher is recommended).
- **Terminal**: You will need a command line interface (Terminal on Mac, PowerShell/CMD on Windows).

## Getting Started

Follow these steps to get the project running on your local machine:

1.  **Unzip/Navigation**: Open your terminal and navigate to this project folder.
    ```bash
    cd path/to/kevinboyle.com/web
    ```

2.  **Install Dependencies**: Run the following command to install all necessary libraries.
    ```bash
    npm install
    ```

3.  **Start the Development Server**: This will launch the site locally.
    ```bash
    npm run dev
    ```

4.  **Open in Browser**: The terminal will show a local URL (usually `http://localhost:5173/`). Command-click that link or copy-paste it into your browser to view the site.

## Customization

### Changing the Profile Image
To update the picture of Kevin:
1.  Have your new image ready (preferably a square JPG or PNG).
2.  Rename your image to `profile-kevin.png` (or `.jpg` and update the code).
3.  Replace the file located at:
    ```
    public/images/profile-kevin.png
    ```
4.  The site will automatically update.

### Updating Project Images
Project images are located in `public/images/`.
- `project-sottozero.jpg`
- `project-darkmode.jpg`
- `project-radius.jpg`
- `project-purchasepower.jpg`

Replace any of these files with a new image of the same name to update them on the site.

## Building for Production

When you are ready to publish the site to the web:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  This generates a `dist` folder containing the optimized files ready for deployment.

---

Built with [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [Framer Motion](https://www.framer.com/motion/).
