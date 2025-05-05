<img src="assets/images/website/logo_white.png" alt="BonApp logo" width="400"/>

# 🍽️ Multilingual Recipe Manager: BonApp

A web application project (2024–2025) for managing and sharing cooking recipes in **French** and **English**, featuring user roles like **Cooks**, **Chefs**, **Translators**, and **Administrators**.

> Developed as part of the 2024-2025 Web Programming course.

---

## 🚀 Getting Started

### 📦 Requirements

- PHP >= 7.4
- A web server (e.g., Apache, Nginx, or use PHP's built-in server)
- A browser (Chrome, Firefox, etc.)
- Git (optional)

### 📁 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Raouf-Medj/bon-app.git
cd bon-app
```

2. **Start the development server (PHP built-in)**

```bash
php -S localhost:8000
```

3. **Visit the site**

Open your browser and go to:  
[http://localhost:8000](http://localhost:3000) (very important to use port 3000)

---

## 🌐 Website Features

### 👥 User Roles

- **Cooks**: Comment on recipes, upload photos, like recipes.
- **Chefs**: Submit and edit their own recipes.
- **Translators**: Translate recipe fields from French to English or vice versa, using a dual-column interface.
- **Administrator**:
  - Validate, edit, translate, or delete recipes
  - Promote "Cook" to "Chef" or "Translator"
  - Manage users
  - Mark recipes as "Validated" (Published)

### 📚 Recipes

- Stored in a structured JSON file
- Can contain fields like: title, ingredients, steps, language (fr/en), dietary tags (gluten-free, vegan, etc.), photos
- Recipes may initially be incomplete (`null` fields), and the system highlights missing info
- Support for both local and external image URLs

### 🔍 Search & Filter

- Filter by:
  - Keyword (title, ingredients, steps)
  - Completed or incomplete status
  - Tags (vegan, gluten-free, etc.)
- Like recipes with a "heart"
- View total cooking time from steps
- View user-submitted photos and comments

### 🌐 Language Toggle

- Easily switch between French and English versions of the site using a toggle button.

---

## 🧑‍🍳 User Workflow

1. **Sign Up**: Anyone can register as a "Cook"
2. **Request Role Upgrade**: Ask to become a Chef or Translator
3. **Administrator Validation**: Admins promote users
4. **Contribute**:
   - Cooks: Interact with recipes
   - Chefs: Submit/edit recipes
   - Translators: Fill missing translations only
   - Admins: Manage content and users

---

## 🛠️ Technologies Used

- HTML, CSS (modern layout with responsive design)
- JavaScript (jQuery + vanilla)
- PHP (backend logic and server-side handling)
- JSON (data storage for recipes and users)

---

## 👤 Author

- Abderraouf MEDJADJ – [@Raouf-Medj](https://github.com/Raouf-Medj)
- Danilo VULETIC – [@dane73](https://github.com/dane73)

---

## 📃 License

This project is for educational use only. All rights reserved © 2025.
