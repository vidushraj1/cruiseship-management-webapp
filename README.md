# Cruise Ship Management - Full-Stack Web Application

This project is a complete modernization of a procedural Java command-line application into a full-stack, cloud-native web application. It refactors a university coursework project into a modern, scalable, and interactive platform using React for the frontend, Spring Boot for the backend, and Google Cloud Platform for deployment.

## The Original Application: A Java CLI Tool

The initial project was a university coursework assignment designed to demonstrate fundamental data structures and object-oriented concepts in Java. It functioned as a simple command-line tool to manage passenger bookings for a cruise ship with 12 cabins.

**Original project repository:** [Cruise-Ship-Boarding-Managing-Program](https://github.com/vidushraj1/Cruise-Ship-Boarding-Managing-Program)

### Original Functionality

The application operated through a text-based menu, allowing a user to:
*   **Add Passengers (`A`):** Assign passengers to one of the 12 cabins.
*   **View Cabins (`V`, `E`):** List all cabins or only the empty ones.
*   **Delete Passengers (`D`):** Vacate a cabin, making it available again.
*   **Find Cabins (`F`):** Search for a passenger by name to find their cabin number.
*   **Manage Data (`S`, `L`):** Store the current ship state to a local `.txt` file and load it back.
*   **View Reports (`O`, `T`):** Display an alphabetized list of all passengers and calculate total expenses.
*   **Advanced Logic (Task 3):** Included a waiting list that would hold new customers when the ship was full.

### Original Technology Stack
*   **Language:** Java
*   **UI:** Standard library `System.out.println()` and `Scanner` (Command-Line Interface)
*   **Data Persistence:** Basic file I/O (writing to a `.txt` file).
*   **Structure:** Procedural style with reliance on static arrays to hold state.

## The Modernization: A Full-Stack Cloud Application

The goal of this refactoring was to re-engineer the original application as a professional, interactive, and scalable web service, addressing the limitations of the command-line interface.

**Live Web Application:** https://vidushraj1.github.io/cruise-ship-management-webapp/
*(Note: Replace with your actual GitHub Pages URL after deployment!)*

### New Features & Improvements

*   **Modern Interactive UI:** The clunky text-based menu has been replaced with a responsive, fast, and intuitive **React Single-Page Application (SPA)**. The dashboard provides a complete visual overview of the ship's status.
*   **Robust & Stateless Backend:** The core Java logic was refactored and encapsulated into an enterprise-grade **Spring Boot** backend, providing a clean and stateless REST API. The static arrays were replaced with more flexible Java Collections.
*   **Dynamic Data Visualization:** Instead of plain text lists, the cabin status is shown on animated, color-coded cards.
*   **Intuitive User Experience:** Adding passengers is now done by clicking directly on an empty cabin. All actions provide immediate visual feedback.
*   **Enhanced Search:** The simple name search has been upgraded to a powerful, real-time search that can find passengers by first name, surname, or booking name and can highlight multiple matching cabins.
*   **Intelligent Waiting List Flow:** The waiting list is now fully integrated with the UI. When a cabin is vacated, the application automatically opens a pre-filled booking form for the next person in the queue.
*   **Modern Data Management:** The file-saving feature has been modernized to allow users to **Export** the entire ship's state as a JSON file and **Import** it back, directly from the browser.
*   **Cloud-Native Deployment:** The entire application is deployed on a modern, serverless infrastructure for high availability and zero cost at low traffic.
    *   The **Spring Boot backend** is containerized with **Docker** and runs as a serverless service on **Google Cloud Run**.
    *   The **React frontend** is hosted as a static site on **GitHub Pages**, providing excellent performance and free hosting.

### Modern Technology Stack

*   **Frontend:**
    *   **Framework:** React (with TypeScript & Vite)
    *   **Component Library:** Mantine
    *   **Animations:** Framer Motion
    *   **API Communication:** Axios
    *   **Deployment:** GitHub Pages
*   **Backend:**
    *   **Framework:** Spring Boot
    *   **Language:** Java
    *   **Build Tool:** Maven
    *   **Deployment:** Docker, Google Cloud Run
*   **Cloud Infrastructure:**
    *   **Google Cloud Platform (GCP)**
    *   **Google Artifact Registry:** For storing Docker container images.
    *   **Google Cloud Run:** For serverless backend hosting.

## Project Structure & Local Setup

This full-stack application consists of a backend service and a frontend within this repository.

### Backend

The source code for the Spring Boot backend can be found in the `cruise-ship-backend` directory of this repository. It was developed by refactoring the business logic from the original [Java CLI project](https://github.com/vidushraj1/Cruise-Ship-Boarding-Managing-Program).

The backend is a Spring Boot application that exposes a REST API. During local development, it runs on `http://localhost:8080`.

**Key API endpoints provided by the backend:**
*   `GET /api/cabins`: Fetches the state of all cabins.
*   `POST /api/cabins/{id}/passengers`: Adds passengers to a cabin.
*   `DELETE /api/cabins/{id}/passengers`: Vacates a cabin.
*   `GET /api/passengers/find`: Searches for cabins by passenger name.
*   `POST /api/cabins/load`: Imports a full ship state from a file.
*   ...and several others for managing the waiting list and statistics.

### Frontend

The React frontend is located in the `cruise-ship-frontend` directory. To run it locally, follow these steps.

**Prerequisites:**
*   Node.js and npm
*   A running instance of the backend service.

**Running the Frontend:**
1.  Navigate to the `cruise-ship-frontend` directory.
2.  Create a `.env` file in the root of this directory.
3.  Inside the `.env` file, add the following line, pointing to the backend's base URL:
    ```
    VITE_API_BASE_URL=http://localhost:8080/api
    ```
    *(To test against the live version, replace the local URL with your actual Google Cloud Run service URL.)*
4.  Install dependencies:
    ```bash
    npm install
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```
6.  The frontend will be running on `http://localhost:5173` (or the next available port).