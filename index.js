
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
const port = 5000;

const tasksData = fs.readFileSync('data/data.json');
const tasks = JSON.parse(tasksData);
app.get('/tasks', function (req, res) {
    const completedTasks = tasks.map((task) => {
       
        if (task.Status == true)
            return task;
    })
    console.log(completedTasks)
    res.json(completedTasks);
})

app.get('/tasks/:id', function (req, res) {
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === taskId);
    if (task)
        res.json(task)
    else
        res.status(404).json({ error: 'Task not found' })
    res.json(task);
});

app.get('/tasks/${id}', function (req, res) {
    res.send('GET request to homepage');
})

app.post('/tasks', function (req, res) {
    console.log(req.body);
  const { title, description, status } = req.body;

  // Validate input
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  // Generate a new ID for the task
  const newTaskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  // Create a new task object
  const newTask = { id: newTaskId, title, description, status };

  // Add the new task to the tasks array
    tasks.push(newTask);
    fs.writeFile('data/data.json', JSON.stringify(tasks, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save the task' });
    }
    res.status(201).json(newTask);
  });

});


app.put('/tasks/:id', function (req, res) {
    console.log(req.params)
    const { title, description, status } = req.body;
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
   
    if (taskIndex == -1)
        return res.status(404).json({ error: 'task not found' });
  tasks[taskIndex].title = title || tasks[taskIndex].title;
  tasks[taskIndex].description = description || tasks[taskIndex].description;
  tasks[taskIndex].status = status || tasks[taskIndex].status;

  // Save the updated tasks array to the data.json file
  fs.writeFile('data/data.json', JSON.stringify(tasks, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update the task' });
    }
    res.json(tasks[taskIndex]);
  });
})

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  // Find the index of the task to delete
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Remove the task from the tasks array
  const deletedTask = tasks.splice(taskIndex, 1)[0];

  // Save the updated tasks array to the data.json file
  fs.writeFile('data/data.json', JSON.stringify(tasks, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete the task' });
    }
    res.json(deletedTask);
  });
});

app.listen(port, () => {
    console.log(`Now listening`);
})
