import { Component, ChangeDetectionStrategy } from '@angular/core';
import { trashOutline, addOutline, createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { TaskService } from '../core/services/task.service';
import { Task } from '../shared/models/task.model';
import { CategoryService } from '../core/services/category.service';
import { FeatureFlagService } from '../core/services/feature-flag.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  newTaskTitle = '';
  tasks$ = this.taskService.tasks$;
  categories$ = this.categoryService.categories$;

  selectedCategoryId: string | null = null;
  selectedNewTaskCategoryId: string | undefined;
  isCategoriesEnabled: boolean | null = null;

  isCategoryModalOpen = false;
  categoryToEditId: string | null = null;
  categoryToEditName = '';

  isTaskModalOpen = false;
  taskToEditId: string | null = null;
  taskToEditTitle = '';
  taskToEditCategoryId: string | undefined;

  selectedFilter: 'all' | 'completed' | 'pending' = 'all';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private featureFlagService: FeatureFlagService,
    private alertController: AlertController,
  ) {
    addIcons({ trashOutline, addOutline, createOutline });
    this.loadFeatureFlags();
  }

  private async loadFeatureFlags(): Promise<void> {
    this.isCategoriesEnabled =
      await this.featureFlagService.isCategoriesEnabled();
  }

  async showErrorAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'No se puede eliminar',
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
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

  addCategory(name: string): void {
    this.categoryService.addCategory(name);
  }

  addCategoryFromInput(input: any): void {
    const value = input.value?.toString() ?? '';
    this.addCategory(value);
    input.value = '';
  }

  selectCategory(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.selectedFilter = 'all';
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    let result = tasks;

    if (this.selectedCategoryId) {
      result = result.filter(
        (task) => task.categoryId === this.selectedCategoryId,
      );
    }

    if (this.selectedFilter === 'completed') {
      result = result.filter((task) => task.completed);
    } else if (this.selectedFilter === 'pending') {
      result = result.filter((task) => !task.completed);
    }

    return result;
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

  async deleteCategory(categoryId: string): Promise<void> {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.categoryService.removeCategoryLocal(categoryId);

        this.taskService.removeCategoryFromTasks(categoryId);

        if (this.selectedCategoryId === categoryId) {
          this.selectedCategoryId = null;
        }

        if (this.selectedNewTaskCategoryId === categoryId) {
          this.selectedNewTaskCategoryId = undefined;
        }
      },
      error: (error) => {
        const message =
          error?.error?.message ||
          'No se puede eliminar la categoría porque tiene sucursales asociadas.';

        this.showErrorAlert(message);
      },
    });
  }

  openEditCategoryModal(categoryId: string, currentName: string): void {
    this.categoryToEditId = categoryId;
    this.categoryToEditName = currentName;
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
    this.categoryToEditId = null;
    this.categoryToEditName = '';
  }

  saveCategoryChanges(): void {
    if (!this.categoryToEditId) return;

    this.categoryService.updateCategory(
      this.categoryToEditId,
      this.categoryToEditName,
    );

    this.closeCategoryModal();
  }

  deleteCategoryFromModal(): void {
    if (!this.categoryToEditId) return;

    this.deleteCategory(this.categoryToEditId);
    this.closeCategoryModal();
  }

  selectFilter(filter: 'all' | 'completed' | 'pending'): void {
    this.selectedFilter = filter;

    if (filter === 'all') {
      this.selectedCategoryId = null;
    }
  }

  openEditTaskModal(task: Task): void {
    this.taskToEditId = task.id;
    this.taskToEditTitle = task.title;
    this.taskToEditCategoryId = task.categoryId;
    this.isTaskModalOpen = true;
  }

  closeTaskModal(): void {
    this.isTaskModalOpen = false;
    this.taskToEditId = null;
    this.taskToEditTitle = '';
    this.taskToEditCategoryId = undefined;
  }

  saveTaskChanges(): void {
    if (!this.taskToEditId) return;

    this.taskService.updateTask(
      this.taskToEditId,
      this.taskToEditTitle,
      this.taskToEditCategoryId,
    );

    this.closeTaskModal();
  }

  removeCategoryFromTask(): void {
    this.taskToEditCategoryId = undefined;
  }
}
