# CENTROID // NEON OVERDRIVE (v1.0)

![Project Banner](https://img.shields.io/badge/STATUS-OPERATIONAL-ccff00?style=for-the-badge&labelColor=000000) ![Version](https://img.shields.io/badge/VERSION-1.0-00ffaa?style=for-the-badge&labelColor=000000)

**CENTROID** is a high-velocity, browser-based color quantization engine designed for designers and developers. It uses **K-Means Clustering (Machine Learning)** to extract the dominant color palette from any image and analyzes it for WCAG accessibility compliance.

The interface is built with a **"Neon Overdrive"** aesthetic, inspired by Cyberpunk UI and Lando Norris branding.

## ⚡ Key Features

* **CORE ENGINE:** Extracts 2-10 dominant colors using Scikit-Learn K-Means.
* **INTELLIGENCE:** Automatically audits colors for WCAG 2.1 contrast compliance (Pass/Fail).
* **MATRIX BOOT:** Cinematic "Data Decryption" loading sequence.
* **CYBER UI:** 3D moving grids, side HUDs, and smooth physics animations.
* **EXPORTS:**
    * **Schematic PNG:** Generates a branded spec-sheet of your palette.
    * **Code Gen:** One-click copy for Tailwind/JS theme objects.
* **FORMATS:** Supports JPG, PNG, WEBP, and AVIF.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Advanced Animations), Vanilla JavaScript.
* **Backend:** Python, FastAPI, NumPy, Scikit-Learn, Pillow.
* **Deployment:** Render (Cloud Hosting).

## 🚀 Installation (Local)

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/centroid-project.git](https://github.com/your-username/centroid-project.git)
    cd centroid-project
    ```

2.  **Backend Setup**
    Navigate to the backend folder and install dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
    Start the API server:
    ```bash
    uvicorn main:app --reload
    ```
    *Server will run at: `http://127.0.0.1:8000`*

3.  **Frontend Setup**
    * Open `frontend/index.html` in your browser.
    * (Optional) Use "Live Server" extension in VS Code for hot-reloading.

## 📡 API Endpoints

* `POST /analyze`
    * **Input:** Image File, `num_colors` (int)
    * **Output:** JSON Object containing Hex codes and dominance percentages.

## 👤 Author

**S. Ganeshe**
* [GitHub](https://github.com/sganeshe)
* [LinkedIn](#)

---
*© 2026 CENTROID SYSTEMS // ALL RIGHTS RESERVED*
