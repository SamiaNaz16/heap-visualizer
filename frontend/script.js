class HeapVisualizer {
    constructor() {
        this.heap = [];
        this.heapType = 'min';
        this.apiBase = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.bindEvents();
              this.clearVisualization();
        this.checkBackendStatus();
    }

    async checkBackendStatus() {
        try {
            const response = await fetch(`${this.apiBase}/status`);
            if (response.ok) {
                const data = await response.json();
                this.heap = data.heap_array || [];
                this.heapType = data.heap_type || 'min';
                this.visualize();
            }
        } catch (error) {
            console.log('Backend not available, using local operations');
        }
    }

    bindEvents() {
        document.getElementById('buildHeap').addEventListener('click', () => this.buildHeap());
                document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
            document.getElementById('insertBtn').addEventListener('click', () => this.insertElement());
        document.getElementById('extractBtn').addEventListener('click', () => this.extractRoot());
        document.getElementById('peekBtn').addEventListener('click', () => this.peekRoot());
        
        document.querySelectorAll('input[name="heapType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                        this.heapType = e.target.value;
                if (this.heap.length > 0) {
                    this.buildHeap();
                }
            });
        });
    }

    async buildHeap() {
                 const elementsInput = document.getElementById('elements').value.trim();
        if (!elementsInput) {
            this.showResult('Please enter elements', 'error');
            return;
        }

        const elements = elementsInput.split(',').map(el => {
            const num = parseInt(el.trim());
            return isNaN(num) ? null : num;
        }).filter(el => el !== null);

        if (elements.length === 0) {
            this.showResult('Please enter valid numbers', 'error');
            return;
        }

        try {
                    const response = await fetch(`${this.apiBase}/build`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    elements: elements,
                    heap_type: this.heapType
                })
            });

            const data = await response.json();
            
            if (data.success) {
                         this.heap = data.heap_array;
                this.visualize();
                this.showResult(data.message, 'success');
            } else {
                this.showResult(data.error || 'Failed to build heap', 'error');
            }
        } catch (error) {
            console.log('Using local heap operations');
            this.localBuildHeap(elements);
        }
    }

    localBuildHeap(elements) {
        this.heap = [...elements];
        this.heapify();
                 this.visualize();
        this.showResult(`Heap built with ${elements.length} elements`, 'success');
    }

    heapify() {
        const n = this.heap.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    heapifyDown(index) {
        const n = this.heap.length;
        while (true) {
            let smallest = index;
                 const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < n && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }

            if (rightChild < n && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest !== index) {
                this.swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    compare(a, b) {
        return this.heapType === 'min' ? a - b : b - a;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    async insertElement() {
        const input = document.getElementById('newElement');
        const value = parseInt(input.value.trim());
        
        if (isNaN(value)) {
            this.showResult('Please enter a valid number', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/insert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    value: value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.heap = data.heap_array;
                this.visualize();
                input.value = '';
                this.showResult(data.message, 'success');
            } else {
                this.showResult(data.error || 'Failed to insert element', 'error');
            }
        } catch (error) {
            console.log('Using local heap operations');
            this.localInsertElement(value);
            input.value = '';
        }
    }

    localInsertElement(value) {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
        this.visualize();
        this.showResult(`Inserted ${value}`, 'success');
    }

    async extractRoot() {
        try {
            const response = await fetch(`${this.apiBase}/extract`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.heap = data.heap_array;
                this.visualize();
                this.showResult(data.message, 'success');
            } else {
                this.showResult(data.error || 'Failed to extract root', 'error');
            }
        } catch (error) {
            console.log('Using local heap operations');
            this.localExtractRoot();
        }
    }

    localExtractRoot() {
        if (this.heap.length === 0) {
            this.showResult('Heap is empty', 'error');
            return;
        }

        const root = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapifyDown(0);
        }
        
        this.visualize();
        this.showResult(`Extracted root: ${root}`, 'success');
    }

    async peekRoot() {
        try {
            const response = await fetch(`${this.apiBase}/peek`);
            const data = await response.json();
            
            if (data.success) {
                this.showResult(data.message, 'success');
            } else {
                this.showResult(data.error || 'Failed to peek root', 'error');
            }
        } catch (error) {
            console.log('Using local heap operations');
            this.localPeekRoot();
        }
    }

    localPeekRoot() {
        if (this.heap.length === 0) {
            this.showResult('Heap is empty', 'error');
            return;
        }

        this.showResult(`Root element: ${this.heap[0]}`, 'success');
    }

    async clearAll() {
        try {
            const response = await fetch(`${this.apiBase}/clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.heap = [];
                document.getElementById('elements').value = '';
                document.getElementById('newElement').value = '';
                this.clearVisualization();
                this.showResult(data.message, 'success');
            } else {
                this.showResult(data.error || 'Failed to clear heap', 'error');
            }
        } catch (error) {
            console.log('Using local heap operations');
            this.localClearAll();
        }
    }

    localClearAll() {
        this.heap = [];
        document.getElementById('elements').value = '';
        document.getElementById('newElement').value = '';
        this.clearVisualization();
        this.showResult('Cleared all elements', 'success');
    }

    clearVisualization() {
        document.getElementById('treeSvg').innerHTML = '';
        document.getElementById('arrayDisplay').innerHTML = '<div style="color: #999;">No elements in heap</div>';
        document.getElementById('operationResult').innerHTML = '';
        document.getElementById('operationResult').className = 'operation-result';
    }

    visualize() {
        this.drawTree();
        this.drawArray();
    }

    drawTree() {
        const svg = document.getElementById('treeSvg');
        svg.innerHTML = '';

        if (this.heap.length === 0) {
            return;
        }

        const nodeRadius = 25;
        const levelHeight = 80;
        const baseWidth = 800;
        
        const levels = this.getLevels();
        const maxWidth = Math.pow(2, levels - 1) * (nodeRadius * 2 + 20);
        const svgWidth = Math.max(baseWidth, maxWidth);
        
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('height', levels * levelHeight + 50);

        const positions = this.calculateNodePositions(nodeRadius, levelHeight, svgWidth);

        // Draw edges
        positions.forEach((pos, index) => {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < positions.length) {
                this.drawEdge(svg, pos, positions[leftChild]);
            }
            if (rightChild < positions.length) {
                this.drawEdge(svg, pos, positions[rightChild]);
            }
        });

        // Draw nodes
        positions.forEach((pos, index) => {
            this.drawNode(svg, pos, this.heap[index], index);
        });
    }

    calculateNodePositions(nodeRadius, levelHeight, svgWidth) {
        const positions = [];
        const levels = this.getLevels();

        for (let i = 0; i < this.heap.length; i++) {
            const level = Math.floor(Math.log2(i + 1));
            const positionInLevel = i - Math.pow(2, level) + 1;
            const nodesInLevel = Math.pow(2, level);
            
            const x = svgWidth / (nodesInLevel + 1) * (positionInLevel + 1);
            const y = level * levelHeight + nodeRadius + 20;
            
            positions.push({ x, y });
        }

        return positions;
    }

    getLevels() {
        return Math.floor(Math.log2(this.heap.length)) + 1;
    }

    drawNode(svg, position, value, index) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', position.x);
        circle.setAttribute('cy', position.y);
        circle.setAttribute('r', 25);
        circle.setAttribute('class', 'node');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', position.x);
        text.setAttribute('y', position.y);
        text.setAttribute('class', 'node-text');
        text.textContent = value;
        
        group.appendChild(circle);
        group.appendChild(text);
        
        group.addEventListener('mouseenter', () => {
            this.highlightArrayItem(index);
        });
        
        group.addEventListener('mouseleave', () => {
            this.unhighlightArrayItems();
        });
        
        svg.appendChild(group);
    }

    drawEdge(svg, from, to) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute('class', 'edge');
        svg.appendChild(line);
    }

    drawArray() {
        const arrayDisplay = document.getElementById('arrayDisplay');
        
        if (this.heap.length === 0) {
            arrayDisplay.innerHTML = '<div style="color: #999;">No elements in heap</div>';
            return;
        }

        arrayDisplay.innerHTML = '';
        this.heap.forEach((value, index) => {
            const item = document.createElement('div');
            item.className = 'array-item';
            item.textContent = value;
            item.setAttribute('data-index', index);
            
            item.addEventListener('mouseenter', () => {
                this.highlightNode(index);
            });
            
            item.addEventListener('mouseleave', () => {
                this.unhighlightNodes();
            });
            
            arrayDisplay.appendChild(item);
        });
    }

    highlightArrayItem(index) {
        const items = document.querySelectorAll('.array-item');
        items.forEach(item => item.classList.remove('highlight'));
        
        const targetItem = document.querySelector(`.array-item[data-index="${index}"]`);
        if (targetItem) {
            targetItem.classList.add('highlight');
        }
    }

    unhighlightArrayItems() {
        document.querySelectorAll('.array-item').forEach(item => {
            item.classList.remove('highlight');
        });
    }

    highlightNode(index) {
        // This would require more complex SVG manipulation
        // For now, we'll just highlight the corresponding array item
        this.highlightArrayItem(index);
    }

    unhighlightNodes() {
        this.unhighlightArrayItems();
    }

    showResult(message, type = 'info') {
        const resultDiv = document.getElementById('operationResult');
        resultDiv.textContent = message;
        resultDiv.className = `operation-result ${type}`;
        
        setTimeout(() => {
            resultDiv.className = 'operation-result';
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new HeapVisualizer();
});
