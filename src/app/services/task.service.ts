import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { environment } from "@env/environment";
import { tap } from "rxjs";

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks';
  tasks = signal<Task[]>([]);

  constructor(private http: HttpClient) {}

  loadTasks() {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(tap(tasks => this.tasks.set(tasks)));
  }

  createTask(task: Partial<Task>) {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(tap(() => this.loadTasks().subscribe()));
  }

  updateTask(id: string, task: Partial<Task>) {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(tap(() => this.loadTasks().subscribe()));
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadTasks().subscribe()));
  }

  completeTask(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/complete`, {})
      .pipe(tap(() => this.loadTasks().subscribe()));
  }

  getStatistics() {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}
