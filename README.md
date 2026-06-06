# To-Do List Application

A beautiful, responsive to-do list application with local storage functionality. Built with vanilla HTML, CSS, and JavaScript.

## Features

✅ **Add Tasks** - Easily add new tasks to your list
✅ **Mark Complete** - Check off tasks as you complete them
✅ **Delete Tasks** - Remove tasks from your list
✅ **Filter Tasks** - View all, active, or completed tasks
✅ **Local Storage** - All tasks are automatically saved to your browser's local storage
✅ **Statistics** - Track total, active, and completed tasks
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
✅ **Keyboard Support** - Press Enter to add tasks quickly
✅ **Priority Tags** - Visual indicators for task priorities
✅ **Creation Dates** - Timestamps for when tasks were created

## How to Use

1. **Adding a Task**
   - Type your task in the input field
   - Click "Add Task" or press Enter
   - Your task will appear in the list

2. **Completing a Task**
   - Click the checkbox next to a task to mark it as completed
   - Completed tasks will appear with strikethrough text

3. **Deleting a Task**
   - Click the "Delete" button next to the task you want to remove

4. **Filtering Tasks**
   - Click "All" to see all tasks
   - Click "Active" to see only incomplete tasks
   - Click "Completed" to see only completed tasks

5. **Clearing Completed Tasks**
   - Click the "Clear Completed" button at the bottom
   - This will remove all completed tasks at once

## Local Storage

All your tasks are automatically saved to your browser's local storage. This means:
- Your tasks persist even after closing the browser
- No server or database required
- Your data stays on your device

To clear all data, you can:
- Delete individual tasks using the Delete button
- Clear all completed tasks using the "Clear Completed" button
- Manually clear browser data (Settings → Clear Browsing Data → Local Storage)

## Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and flexbox
- **JavaScript (ES6+)** - Dynamic functionality
- **Local Storage API** - Data persistence

### File Structure
```
├── index.html      # HTML structure
├── styles.css      # CSS styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support
- Internet Explorer: ❌ Not supported (uses ES6+)

## Key Code Features

### Class-Based Architecture
The application uses a `TodoApp` class to organize functionality:
- `constructor()` - Initializes the app
- `addTodo()` - Adds new tasks
- `deleteTodo()` - Removes tasks
- `toggleTodo()` - Marks tasks complete/incomplete
- `saveToStorage()` - Persists data to local storage
- `loadFromStorage()` - Retrieves data from local storage
- `render()` - Updates the UI
- `getFilteredTodos()` - Filters tasks based on current filter

### Data Structure
Each todo object contains:
```javascript
{
    id: timestamp,          // Unique identifier
    text: string,           // Task description
    completed: boolean,     // Completion status
    priority: string,       // 'high', 'medium', 'low'
    createdAt: string       // Creation date
}
```

## Future Enhancements

- [ ] Add due dates and reminders
- [ ] Add different priority levels with drag-and-drop
- [ ] Add categories/tags for organizing tasks
- [ ] Add search functionality
- [ ] Add dark mode
- [ ] Export/import tasks
- [ ] Add recurring tasks
- [ ] Add subtasks support
- [ ] Add notifications

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

Enjoy organizing your tasks with this simple yet powerful to-do list application! 🚀
