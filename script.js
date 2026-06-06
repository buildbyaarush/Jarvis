// Voice-Controlled To-Do List Application with Local Storage

class VoiceTodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoList';
        this.isListening = false;
        this.recognition = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.initVoiceRecognition();
        this.render();
    }

    initVoiceRecognition() {
        // Setup speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            alert('Speech Recognition not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceUI();
        };

        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            
            const voiceTranscript = document.getElementById('voiceTranscript');
            voiceTranscript.textContent = 'Listening: ' + transcript;

            if (event.results[event.results.length - 1].isFinal) {
                this.processVoiceCommand(transcript.toLowerCase());
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            const voiceTranscript = document.getElementById('voiceTranscript');
            voiceTranscript.textContent = 'Error: ' + event.error;
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceUI();
        };
    }

    setupEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const clearBtn = document.getElementById('clearBtn');
        const startVoiceBtn = document.getElementById('startVoiceBtn');
        const stopVoiceBtn = document.getElementById('stopVoiceBtn');

        // Add task on button click
        addBtn.addEventListener('click', () => this.addTodo());

        // Add task on Enter key
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter tasks
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Clear completed tasks
        clearBtn.addEventListener('click', () => this.clearCompleted());

        // Voice control
        startVoiceBtn.addEventListener('click', () => this.startListening());
        stopVoiceBtn.addEventListener('click', () => this.stopListening());
    }

    startListening() {
        if (!this.recognition) {
            alert('Speech Recognition not available');
            return;
        }
        this.recognition.start();
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    updateVoiceUI() {
        const startBtn = document.getElementById('startVoiceBtn');
        const stopBtn = document.getElementById('stopVoiceBtn');

        if (this.isListening) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'flex';
        } else {
            startBtn.style.display = 'flex';
            stopBtn.style.display = 'none';
        }
    }

    processVoiceCommand(command) {
        const voiceTranscript = document.getElementById('voiceTranscript');
        
        // Normalize command
        command = command.trim();

        // Add task commands
        if (command.includes('add task') || command.includes('create') || command.includes('add')) {
            let taskText = command
                .replace('add task', '')
                .replace('add', '')
                .replace('create', '')
                .trim();
            
            if (taskText) {
                this.addTodoFromVoice(taskText);
                voiceTranscript.textContent = `✅ Added: "${taskText}"`;
                return;
            }
        }

        // Complete task commands
        if (command.includes('complete') || command.includes('finish') || command.includes('done')) {
            const numberMatch = command.match(/\d+/);
            if (numberMatch) {
                const taskIndex = parseInt(numberMatch[0]) - 1;
                const filteredTodos = this.getFilteredTodos();
                if (taskIndex >= 0 && taskIndex < filteredTodos.length) {
                    this.toggleTodo(filteredTodos[taskIndex].id);
                    voiceTranscript.textContent = `✅ Task ${taskIndex + 1} marked as complete!`;
                    return;
                }
            }
        }

        // Delete task commands
        if (command.includes('delete') || command.includes('remove')) {
            const numberMatch = command.match(/\d+/);
            if (numberMatch) {
                const taskIndex = parseInt(numberMatch[0]) - 1;
                const filteredTodos = this.getFilteredTodos();
                if (taskIndex >= 0 && taskIndex < filteredTodos.length) {
                    this.deleteTodo(filteredTodos[taskIndex].id);
                    voiceTranscript.textContent = `🗑️ Task ${taskIndex + 1} deleted!`;
                    return;
                }
            }
        }

        // Filter commands
        if (command.includes('show all')) {
            this.currentFilter = 'all';
            this.updateFilterUI('all');
            voiceTranscript.textContent = '📋 Showing all tasks';
            this.render();
            return;
        }

        if (command.includes('show active')) {
            this.currentFilter = 'active';
            this.updateFilterUI('active');
            voiceTranscript.textContent = '📋 Showing active tasks';
            this.render();
            return;
        }

        if (command.includes('show completed')) {
            this.currentFilter = 'completed';
            this.updateFilterUI('completed');
            voiceTranscript.textContent = '✅ Showing completed tasks';
            this.render();
            return;
        }

        // Clear completed commands
        if (command.includes('clear completed') || command.includes('delete all completed')) {
            this.clearCompleted();
            voiceTranscript.textContent = '🧹 Completed tasks cleared!';
            return;
        }

        voiceTranscript.textContent = '❌ Command not recognized. Try: "Add task [name]", "Complete 1", etc.';
    }

    updateFilterUI(filterType) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterType) {
                btn.classList.add('active');
            }
        });
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        this.addTodoFromVoice(text);
        input.value = '';
        input.focus();
    }

    addTodoFromVoice(text) {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleDateString()
        };

        this.todos.push(todo);
        this.saveToStorage();
        this.render();
        this.speakText(`Added task: ${text}`);
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToStorage();
            this.render();
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        this.todos = stored ? JSON.parse(stored) : [];
    }

    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('completedCount').textContent = completed;
    }

    render() {
        this.updateStats();
        const todoList = document.getElementById('todoList');
        const emptyState = document.querySelector('.empty-state');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="todo-number">${index + 1}</span>
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                <span class="todo-date">${todo.createdAt}</span>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new VoiceTodoApp();
});
