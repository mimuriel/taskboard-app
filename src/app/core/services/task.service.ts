import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '../../shared/models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly storageKey = 'taskboard_tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    const tasks = this.storageService.get<Task[]>(this.storageKey) ?? [];
    this.tasksSubject.next(tasks);
  }

  private saveTasks(tasks: Task[]): void {
    this.storageService.set(this.storageKey, tasks);
    this.tasksSubject.next(tasks);
  }

  addTask(title: string, categoryId?: string): void {
    const cleanTitle = title.trim();

    if (!cleanTitle) return;

    const newTask: Task = {
      id: uuidv4(),
      title: cleanTitle,
      completed: false,
      priority: 'medium',
      categoryId,
      createdAt: new Date().toISOString(),
    };

    this.saveTasks([newTask, ...this.tasksSubject.value]);
  }

  toggleTask(taskId: string): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            updatedAt: new Date().toISOString(),
          }
        : task,
    );

    this.saveTasks(updatedTasks);
  }

  deleteTask(taskId: string): void {
    const updatedTasks = this.tasksSubject.value.filter(
      (task) => task.id !== taskId,
    );
    this.saveTasks(updatedTasks);
  }

  removeCategoryFromTasks(categoryId: string): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.categoryId === categoryId
        ? {
            ...task,
            categoryId: undefined,
            updatedAt: new Date().toISOString(),
          }
        : task,
    );

    this.saveTasks(updatedTasks);
  }

  updateTaskTitle(taskId: string, title: string): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === taskId ? { ...task, title: title.trim() } : task,
    );

    this.tasksSubject.next(tasks);
    this.saveTasks(tasks);
  }

  updateTaskCategory(taskId: string, categoryId?: string): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === taskId ? { ...task, categoryId } : task,
    );

    this.tasksSubject.next(tasks);
    this.saveTasks(tasks);
  }

  updateTask(taskId: string, title: string, categoryId?: string): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === taskId
        ? {
            ...task,
            title: title.trim(),
            categoryId,
          }
        : task,
    );

    this.tasksSubject.next(tasks);
    this.saveTasks(tasks);
  }
}
