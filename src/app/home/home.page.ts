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
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonButtons  
} from '@ionic/angular/standalone';
import { AsyncPipe, NgClass } from '@angular/common';
import { trashOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { TaskService } from '../core/services/task.service';
import { Task } from '../shared/models/task.model';
import { CategoryService } from '../core/services/category.service';

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
    IonBadge,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonButtons
  ],
})
export class HomePage {
  newTaskTitle = '';
  tasks$ = this.taskService.tasks$;
  categories$ = this.categoryService.categories$;
  selectedCategoryId: string | null = null;
  selectedNewTaskCategoryId: string | undefined;
  editingCategoryId: string | null = null;
  editingCategoryName = '';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
  ) {
    addIcons({ trashOutline, addOutline });
  }

  getCompletedCount(tasks: Task[]): number {
    return tasks.filter((task) => task.completed).length;
  }

  addTask(): void {
    this.taskService.addTask(this.newTaskTitle, this.selectedNewTaskCategoryId);
    this.newTaskTitle = '';
    this.selectedNewTaskCategoryId = undefined;
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

  addCategory(name: string) {
    this.categoryService.addCategory(name);
  }

  addCategoryFromInput(input: any): void {
    const value = input.value?.toString() ?? '';
    this.addCategory(value);
    input.value = '';
  }

  selectCategory(id: string | null) {
    this.selectedCategoryId = id;
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    if (!this.selectedCategoryId) return tasks;
    return tasks.filter((t) => t.categoryId === this.selectedCategoryId);
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';

    let categoryName = 'Sin categoría';

    this.categoryService.categories$
      .subscribe((categories) => {
        const category = categories.find((cat) => cat.id === categoryId);
        categoryName = category?.name ?? 'Sin categoría';
      })
      .unsubscribe();

    return categoryName;
  }

  startEditCategory(categoryId: string, currentName: string): void {
    this.editingCategoryId = categoryId;
    this.editingCategoryName = currentName;
  }

  saveEditCategory(): void {
    if (!this.editingCategoryId) return;

    this.categoryService.updateCategory(
      this.editingCategoryId,
      this.editingCategoryName,
    );

    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId);

    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = null;
    }

    if (this.selectedNewTaskCategoryId === categoryId) {
      this.selectedNewTaskCategoryId = undefined;
    }
  }
}
