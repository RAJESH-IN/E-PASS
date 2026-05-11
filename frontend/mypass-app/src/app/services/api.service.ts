import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse, SearchResult, Employee, Equipment, Vehicle,
  CreateEmployee, CreateEquipment, CreateVehicle
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Relative path — Angular proxy forwards /api/* to the backend.
  // No CORS issues. No hardcoded port. See proxy.conf.json.
  private base = '/api';

  constructor(private http: HttpClient) {}

  // ── Global Search ─────────────────────────────────────────────────
  search(q: string, category: string): Observable<SearchResult> {
    const params = new HttpParams()
      .set('q', q)
      .set('category', category === 'All' ? '' : category);
    return this.http.get<ApiResponse<SearchResult>>(`${this.base}/search`, { params })
      .pipe(map(r => r.data!));
  }

  // ── Employees ─────────────────────────────────────────────────────
  getEmployees(search = '', personType = '', status = ''): Observable<Employee[]> {
    let params = new HttpParams();
    if (search)     params = params.set('search', search);
    if (personType) params = params.set('personType', personType);
    if (status)     params = params.set('status', status);
    return this.http.get<ApiResponse<Employee[]>>(`${this.base}/employees`, { params })
      .pipe(map(r => r.data ?? []));
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<ApiResponse<Employee>>(`${this.base}/employees/${id}`)
      .pipe(map(r => r.data!));
  }

  createEmployee(dto: CreateEmployee): Observable<Employee> {
    return this.http.post<ApiResponse<Employee>>(`${this.base}/employees`, dto)
      .pipe(map(r => r.data!));
  }

  updateEmployee(id: number, dto: CreateEmployee): Observable<Employee> {
    return this.http.put<ApiResponse<Employee>>(`${this.base}/employees/${id}`, dto)
      .pipe(map(r => r.data!));
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/employees/${id}`)
      .pipe(map(() => void 0));
  }

  // ── Equipment ─────────────────────────────────────────────────────
  getEquipment(search = '', category = '', status = ''): Observable<Equipment[]> {
    let params = new HttpParams();
    if (search)   params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (status)   params = params.set('status', status);
    return this.http.get<ApiResponse<Equipment[]>>(`${this.base}/equipment`, { params })
      .pipe(map(r => r.data ?? []));
  }

  getEquipmentById(id: number): Observable<Equipment> {
    return this.http.get<ApiResponse<Equipment>>(`${this.base}/equipment/${id}`)
      .pipe(map(r => r.data!));
  }

  createEquipment(dto: CreateEquipment): Observable<Equipment> {
    return this.http.post<ApiResponse<Equipment>>(`${this.base}/equipment`, dto)
      .pipe(map(r => r.data!));
  }

  updateEquipment(id: number, dto: CreateEquipment): Observable<Equipment> {
    return this.http.put<ApiResponse<Equipment>>(`${this.base}/equipment/${id}`, dto)
      .pipe(map(r => r.data!));
  }

  deleteEquipment(id: number): Observable<void> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/equipment/${id}`)
      .pipe(map(() => void 0));
  }

  // ── Vehicles ──────────────────────────────────────────────────────
  getVehicles(search = '', vehicleType = '', status = ''): Observable<Vehicle[]> {
    let params = new HttpParams();
    if (search)      params = params.set('search', search);
    if (vehicleType) params = params.set('vehicleType', vehicleType);
    if (status)      params = params.set('status', status);
    return this.http.get<ApiResponse<Vehicle[]>>(`${this.base}/vehicles`, { params })
      .pipe(map(r => r.data ?? []));
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<ApiResponse<Vehicle>>(`${this.base}/vehicles/${id}`)
      .pipe(map(r => r.data!));
  }

  createVehicle(dto: CreateVehicle): Observable<Vehicle> {
    return this.http.post<ApiResponse<Vehicle>>(`${this.base}/vehicles`, dto)
      .pipe(map(r => r.data!));
  }

  updateVehicle(id: number, dto: CreateVehicle): Observable<Vehicle> {
    return this.http.put<ApiResponse<Vehicle>>(`${this.base}/vehicles/${id}`, dto)
      .pipe(map(r => r.data!));
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/vehicles/${id}`)
      .pipe(map(() => void 0));
  }
}
