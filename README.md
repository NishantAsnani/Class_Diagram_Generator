# Class Diagram Generator

A modern web application that automatically generates interactive UML class diagrams from GitHub repositories. Simply paste a repository URL and visualize the class structure of your codebase in seconds.


## ✨ Features

- **Multi-Language Support**: Parses JavaScript, Java, and C++ codebases
- **Interactive Diagrams**: Built with ReactFlow for smooth navigation and exploration
- **GitHub Integration**: Direct repository analysis via URL
- **Real-time Generation**: Fast processing with progress indicators
- **Modern UI**: Dark theme with gradient effects and responsive design
- **RESTful API**: Backend API for programmatic access

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **ReactFlow** - Interactive diagram library
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Babel Parser** - JavaScript AST parsing
- **Simple Git** - Git operations
- **Glob** - File pattern matching

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NishantAsnani/Class_Diagram_Generator.git
   cd Class_Diagram_Generator
   ```

2. **Install backend dependencies**
   ```bash
   cd be
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../fe
   npm install
   ```

4. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd be
   npm start
   ```
   Server will run on http://localhost:3000

   **Frontend** (Terminal 2):
   ```bash
   cd fe
   npm run dev
   ```
   App will be available at http://localhost:5173

## 📖 Usage

1. Open the application in your browser
2. Paste a GitHub repository URL in the input field
3. Click "Generate Diagram" or press Enter
4. Wait for the analysis to complete
5. Explore the interactive class diagram

### Supported Repository Formats
- `https://github.com/username/repository`
- `https://github.com/username/repository.git`

### Example URLs
- `https://github.com/microsoft/vscode`
- `https://github.com/facebook/react`

## 🔌 API

### POST `/api/repo/analyze`

Analyzes a GitHub repository and returns class diagram data.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/username/repository"
}
```

**Response:**
```json
{
  "classes": [
    {
      "name": "ClassName",
      "properties": ["property1", "property2"],
      "methods": ["method1()", "method2()"],
      "extends": "ParentClass",
      "implements": ["Interface1"]
    }
  ],
  "relationships": [
    {
      "from": "ClassA",
      "to": "ClassB",
      "type": "extends"
    }
  ]
}
```

## 🏗️ Architecture

```
Class_Diagram_Generator/
├── be/                          # Backend (Node.js/Express)
│   ├── controllers/
│   │   └── repoController.js    # Main analysis endpoint
│   ├── services/
│   │   ├── githubService.js     # Git operations
│   │   ├── parserService.js     # Code parsing orchestration
│   │   ├── classExtractorService.js
│   │   └── fileScannerService.js
│   ├── parsers/                 # Language-specific parsers
│   │   ├── jsParser.js
│   │   ├── javaParser.js
│   │   └── cppParser.js
│   └── utils/
│       └── languageDetector.js
├── fe/                          # Frontend (React/Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── RepoInput.jsx    # URL input interface
│   │   │   └── DiagramViewer.jsx # Interactive diagram
│   │   └── App.jsx
│   └── public/
└── tempRepos/                   # Temporary cloned repositories
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Adding Support for New Languages

1. Create a new parser in `be/parsers/`
2. Update `languageDetector.js` to recognize the language
3. Modify `parserService.js` to include the new parser
4. Test with sample repositories

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ReactFlow](https://reactflow.dev/) for the diagram visualization
- [Babel](https://babeljs.io/) for JavaScript parsing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/NishantAsnani/Class_Diagram_Generator/issues) page
2. Create a new issue with detailed information
3. Include the repository URL that caused the problem (if applicable)

---

**Made with ❤️ for developers who love clean architecture visualization**