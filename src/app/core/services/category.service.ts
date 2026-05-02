import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Category } from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';
interface FranchiseResponse {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly API_URL = `${environment.apiUrl}/franchises`;

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.http.get<FranchiseResponse[]>(this.API_URL).subscribe({
      next: (franchises) => {
        const categories = franchises.map((franchise) =>
          this.mapFranchiseToCategory(franchise),
        );

        this.categoriesSubject.next(categories);
      },
      error: (error) => {
        console.error('Error cargando franquicias:', error);
      },
    });
  }

  addCategory(name: string): void {
    const cleanName = name.trim();
    if (!cleanName) return;

    this.http
      .post<FranchiseResponse>(this.API_URL, {
        name: cleanName,
      })
      .subscribe({
        next: (franchise) => {
          const newCategory = this.mapFranchiseToCategory(franchise);
          this.categoriesSubject.next([
            newCategory,
            ...this.categoriesSubject.value,
          ]);
        },
        error: (error) => {
          console.error('Error creando franquicia:', error);
        },
      });
  }

  updateCategory(id: string, name: string): void {
    const cleanName = name.trim();

    if (!cleanName) return;

    this.http
      .patch<FranchiseResponse>(`${this.API_URL}/${id}/name`, {
        name: cleanName,
      })
      .subscribe({
        next: (franchise) => {
          const updated = this.categoriesSubject.value.map((category) =>
            category.id === id
              ? { ...category, name: franchise.name }
              : category,
          );

          this.categoriesSubject.next(updated);
        },
        error: (error) => {
          console.error('Error actualizando franquicia:', error);
        },
      });
  }

  deleteCategory(id: string) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  removeCategoryLocal(id: string): void {
    const filtered = this.categoriesSubject.value.filter(
      category => category.id !== id
    );

    this.categoriesSubject.next(filtered);
  }

  private mapFranchiseToCategory(franchise: FranchiseResponse): Category {
    return {
      id: franchise.id,
      name: franchise.name,
      color: this.getRandomColor(),
      icon: 'pricetag',
      createdAt: new Date().toISOString(),
    };
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
