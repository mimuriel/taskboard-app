import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Category } from '../../shared/models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly STORAGE_KEY = 'taskboard_categories';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadCategories();
  }

  private loadCategories(): void {
    const categories = this.storage.get<Category[]>(this.STORAGE_KEY) ?? [];
    this.categoriesSubject.next(categories);
  }

  private save(categories: Category[]): void {
    this.storage.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  addCategory(name: string): void {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      color: this.getRandomColor(),
      icon: 'pricetag',
      createdAt: new Date().toISOString(),
    };

    this.save([newCategory, ...this.categoriesSubject.value]);
  }

  deleteCategory(id: string): void {
    const filtered = this.categoriesSubject.value.filter((c) => c.id !== id);
    this.save(filtered);
  }

  updateCategory(id: string, name: string): void {
  const cleanName = name.trim();

  if (!cleanName) return;

  const updated = this.categoriesSubject.value.map(category =>
    category.id === id
      ? { ...category, name: cleanName }
      : category
  );

  this.save(updated);
}

  private getRandomColor(): string {
    const colors = [
      'primary',
      'secondary',
      'tertiary',
      'success',
      'warning',
      'danger',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
