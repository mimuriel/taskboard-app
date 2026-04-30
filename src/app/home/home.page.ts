import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
  IonCheckbox,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBadge
} from '@ionic/angular/standalone';
import { AsyncPipe, NgClass } from '@angular/common';
import { trashOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { TaskService } from '../core/services/task.service';
import { Task } from '../shared/models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    NgClass,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonCard,
    IonCardContent,
    IonBadge
  ]
})
export class HomePage {
  newTaskTitle = '';
  tasks$ = this.taskService.tasks$;

  constructor(private taskService: TaskService) {
    addIcons({ trashOutline, addOutline });
  }

  getCompletedCount(tasks: Task[]): number {
    return tasks.filter(task => task.completed).length;
  }

  addTask(): void {
    this.taskService.addTask(this.newTaskTitle);
    this.newTaskTitle = '';
  }

  toggleTask(taskId: string): void {
    this.taskService.toggleTask(taskId);
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}