# Heap Visualizer

A web application for visualizing min and max heap data structures with tree representation.

## Features

- **Build heaps** from comma-separated elements
- **Choose heap type**: Min Heap or Max Heap
- **Visualize heap** as an interactive tree structure
- **Array representation** display
- **Heap operations**:
  - Insert elements
  - Extract root element
  - Peek at root element
  - Clear heap
- **Interactive features**:
  - Hover over tree nodes to highlight corresponding array elements
  - Hover over array elements to highlight tree nodes
  - Real-time visualization updates

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern design
- **JavaScript (ES6+)** - Interactive functionality and heap algorithms

### Backend
- **Python** - Backend language
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing

## Project Structure

```
heap-visualizer/
  frontend/
    index.html      # Main HTML file
    style.css       # CSS styling
    script.js       # JavaScript functionality
  backend/
    app.py          # Flask application
    requirements.txt # Python dependencies
  README.md         # This file
```

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd heap-visualizer/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd heap-visualizer/frontend
```

2. Open `index.html` in a web browser, or use a simple HTTP server:
```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js
npx http-server
```

The frontend will be available at `http://localhost:8000`

## Usage

1. **Start the backend server** (required for API functionality)
2. **Open the frontend** in your browser
3. **Enter elements** in comma-separated format (e.g., "5,3,8,1,2,7")
4. **Select heap type** (Min Heap or Max Heap)
5. **Click "Build Heap"** to create the heap
6. **Perform operations**:
   - Insert new elements
   - Extract the root element
   - Peek at the root element
   - Clear the heap

## API Endpoints

### Backend API

- `POST /api/build` - Build heap from elements
- `POST /api/insert` - Insert element into heap
- `POST /api/extract` - Extract root element
- `GET /api/peek` - Peek at root element
- `POST /api/clear` - Clear heap
- `GET /api/status` - Get current heap status

### Request/Response Examples

#### Build Heap
```json
POST /api/build
{
    "elements": [5, 3, 8, 1, 2, 7],
    "heap_type": "min"
}
```

#### Response
```json
{
    "success": true,
    "heap_array": [1, 2, 5, 3, 8, 7],
    "tree_structure": [...],
    "heap_type": "min",
    "message": "Heap built with 6 elements"
}
```

## Features Details

### Tree Visualization
- Uses SVG for scalable tree rendering
- Automatic layout calculation based on heap size
- Interactive nodes with hover effects
- Color-coded for better visualization

### Array Representation
- Shows heap as a flat array
- Interactive elements that sync with tree view
- Highlight effects on hover

### Heap Operations
- **Insert**: Adds element and maintains heap property
- **Extract**: Removes and returns root element
- **Peek**: Returns root without removal
- **Clear**: Empties the heap

### Fallback Mode
The application includes local heap algorithms as a fallback when the backend is not available. This ensures the application works even without the Python backend.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Supports ES6+ JavaScript features
- Responsive design for mobile devices

This project was created as an academic project to demonstrate heap data structure visualization and interactive learning.

