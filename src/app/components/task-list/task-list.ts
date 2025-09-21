import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit{
  showForm = false;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  };

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.taskService.loadTasks().subscribe();
  }

  addTask() {
    if (this.newTask.title) {
      this.taskService.createTask(this.newTask).subscribe(() => {
        this.newTask = { title: '', description: '', status: 'pending', priority: 'medium' };
        this.showForm = false;
      });
    }
  }

  completeTask(id: string) {
    this.taskService.completeTask(id).subscribe();
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe();
    }
  }

}
