from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import heapq
import json

app = Flask(__name__)
CORS(app)

class HeapOperations:
    def __init__(self):
        self.heap = []
        self.heap_type = 'min'
    
    def build_heap(self, elements, heap_type='min'):
        """Build heap from list of elements"""
        self.heap_type = heap_type
        self.heap = elements.copy()
        
        if heap_type == 'min':
            heapq.heapify(self.heap)
        else:
            # For max heap, we use negative values with heapq
            self.heap = [-x for x in self.heap]
            heapq.heapify(self.heap)
        
        return self.get_heap_array()
    
    def insert(self, value):
        """Insert element into heap"""
        if self.heap_type == 'min':
            heapq.heappush(self.heap, value)
        else:
            heapq.heappush(self.heap, -value)
        
        return self.get_heap_array()
    
    def extract_root(self):
        """Extract and return root element"""
        if not self.heap:
            return None, []
        
        if self.heap_type == 'min':
            root = heapq.heappop(self.heap)
        else:
            root = -heapq.heappop(self.heap)
        
        return root, self.get_heap_array()
    
    def peek_root(self):
        """Peek at root element without removing"""
        if not self.heap:
            return None
        
        if self.heap_type == 'min':
            return self.heap[0]
        else:
            return -self.heap[0]
    
    def get_heap_array(self):
        """Get current heap as array"""
        if self.heap_type == 'min':
            return self.heap.copy()
        else:
            return [-x for x in self.heap]
    
    def get_tree_structure(self):
        """Get heap structure for tree visualization"""
        if not self.heap:
            return []
        
        array = self.get_heap_array()
        tree = []
        
        for i, value in enumerate(array):
            left_child = 2 * i + 1
            right_child = 2 * i + 2
            
            node = {
                'value': value,
                'index': i,
                'left': array[left_child] if left_child < len(array) else None,
                'right': array[right_child] if right_child < len(array) else None,
                'parent': array[(i - 1) // 2] if i > 0 else None
            }
            tree.append(node)
        
        return tree

heap_ops = HeapOperations()

@app.route('/')
def index():
    """Serve the frontend"""
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """Serve static files"""
    return send_from_directory('../frontend', path)

@app.route('/api/build', methods=['POST'])
def build_heap():
    """Build heap from elements"""
    try:
        data = request.get_json()
        elements = data.get('elements', [])
        heap_type = data.get('heap_type', 'min')
        
        # Validate elements
        if not all(isinstance(x, (int, float)) for x in elements):
            return jsonify({'error': 'All elements must be numbers'}), 400
        
        heap_array = heap_ops.build_heap(elements, heap_type)
        tree_structure = heap_ops.get_tree_structure()
        
        return jsonify({
            'success': True,
            'heap_array': heap_array,
            'tree_structure': tree_structure,
            'heap_type': heap_type,
            'message': f'Heap built with {len(elements)} elements'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/insert', methods=['POST'])
def insert_element():
    """Insert element into heap"""
    try:
        data = request.get_json()
        value = data.get('value')
        
        if not isinstance(value, (int, float)):
            return jsonify({'error': 'Value must be a number'}), 400
        
        heap_array = heap_ops.insert(value)
        tree_structure = heap_ops.get_tree_structure()
        
        return jsonify({
            'success': True,
            'heap_array': heap_array,
            'tree_structure': tree_structure,
            'message': f'Inserted {value}'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/extract', methods=['POST'])
def extract_root():
    """Extract root element from heap"""
    try:
        root, heap_array = heap_ops.extract_root()
        tree_structure = heap_ops.get_tree_structure()
        
        if root is None:
            return jsonify({'error': 'Heap is empty'}), 400
        
        return jsonify({
            'success': True,
            'root': root,
            'heap_array': heap_array,
            'tree_structure': tree_structure,
            'message': f'Extracted root: {root}'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/peek', methods=['GET'])
def peek_root():
    """Peek at root element"""
    try:
        root = heap_ops.peek_root()
        
        if root is None:
            return jsonify({'error': 'Heap is empty'}), 400
        
        return jsonify({
            'success': True,
            'root': root,
            'message': f'Root element: {root}'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clear', methods=['POST'])
def clear_heap():
    """Clear the heap"""
    try:
        heap_ops.heap = []
        return jsonify({
            'success': True,
            'heap_array': [],
            'tree_structure': [],
            'message': 'Heap cleared'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current heap status"""
    try:
        heap_array = heap_ops.get_heap_array()
        tree_structure = heap_ops.get_tree_structure()
        
        return jsonify({
            'success': True,
            'heap_array': heap_array,
            'tree_structure': tree_structure,
            'heap_type': heap_ops.heap_type,
            'size': len(heap_array)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Heap Visualizer Backend...")
    print("Available endpoints:")
    print("  GET  /           - Frontend")
    print("  POST /api/build  - Build heap")
    print("  POST /api/insert - Insert element")
    print("  POST /api/extract - Extract root")
    print("  GET  /api/peek   - Peek root")
    print("  POST /api/clear  - Clear heap")
    print("  GET  /api/status - Get status")
    print("\nServer running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
