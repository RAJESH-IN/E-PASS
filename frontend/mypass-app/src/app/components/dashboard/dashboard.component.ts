import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Employee, Equipment, Vehicle, SearchCategory, SearchResult } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- Hero Search Bar -->
      <div class="search-hero">
        <div class="search-hero__inner">
          <h1 class="search-hero__title">MyPass Search</h1>
          <p class="search-hero__sub">Search across employees, contractors, equipment and vehicles</p>

          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              class="search-input"
              type="text"
              placeholder="Search by name, badge, plate, serial number..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)"
            />
            <button *ngIf="searchTerm" class="search-clear" (click)="clearSearch()">✕</button>
          </div>

          <!-- Category Tabs -->
          <div class="category-tabs">
            @for (cat of categories; track cat) {
              <button
                class="cat-tab"
                [class.cat-tab--active]="activeCategory === cat"
                (click)="setCategory(cat)">
                <span class="cat-icon">{{ catIcon(cat) }}</span>
                {{ cat }}
                <span class="cat-count" *ngIf="getCatCount(cat) > 0">{{ getCatCount(cat) }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Results Area -->
      <div class="results-area">

        <!-- Loading -->
        <div *ngIf="loading" class="state-panel">
          <div class="spinner"></div>
          <p>Searching...</p>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading && totalResults === 0 && searchTerm" class="state-panel">
          <div class="state-icon">🔍</div>
          <h3>No results for "{{ searchTerm }}"</h3>
          <p>Try adjusting your search or <a routerLink="/register">register a new record</a></p>
        </div>

        <!-- Initial state -->
        <div *ngIf="!loading && !searchTerm && totalResults === 0" class="state-panel">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👤</div>
              <div class="stat-label">Employees</div>
              <div class="stat-hint">Active staff members</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🤝</div>
              <div class="stat-label">Contractors</div>
              <div class="stat-hint">External workforce</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔧</div>
              <div class="stat-label">Equipment</div>
              <div class="stat-hint">Assets & tools</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🚗</div>
              <div class="stat-label">Vehicles</div>
              <div class="stat-hint">Fleet management</div>
            </div>
          </div>
          <p class="hint-text">Type above to search all records, or select a category tab</p>
        </div>

        <!-- Employees Results -->
        @if (!loading && (activeCategory === 'All' || activeCategory === 'Employees' || activeCategory === 'Contractors')) {
          @if (filteredEmployees.length > 0) {
            <section class="result-section">
              <div class="section-header">
                <h2 class="section-title">
                  <span>👤</span>
                  {{ activeCategory === 'Contractors' ? 'Contractors' : activeCategory === 'Employees' ? 'Employees' : 'Employees & Contractors' }}
                  <span class="result-count">{{ filteredEmployees.length }}</span>
                </h2>
                <a routerLink="/register" [queryParams]="{type:'employee'}" class="add-btn">+ Add New</a>
              </div>
              <div class="card-grid">
                @for (emp of filteredEmployees; track emp.id) {
                  <div class="record-card record-card--person">
                    <div class="card-header">
                      <div class="avatar" [class]="'avatar--' + emp.personType.toLowerCase()">
                        {{ emp.firstName[0] }}{{ emp.lastName[0] }}
                      </div>
                      <div class="card-meta">
                        <h3 class="card-name">{{ emp.fullName }}</h3>
                        <span class="card-sub">{{ emp.jobTitle || '—' }}</span>
                      </div>
                      <div class="badges">
                        <span class="badge" [class]="'badge--type-' + emp.personType.toLowerCase()">
                          {{ emp.personType }}
                        </span>
                        <span class="badge" [class]="'badge--status-' + emp.status.toLowerCase()">
                          {{ emp.status }}
                        </span>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="info-row"><span>📧</span>{{ emp.email }}</div>
                      <div class="info-row" *ngIf="emp.phone"><span>📱</span>{{ emp.phone }}</div>
                      <div class="info-row" *ngIf="emp.department"><span>🏢</span>{{ emp.department }}</div>
                      <div class="info-row" *ngIf="emp.company"><span>🏛️</span>{{ emp.company }}</div>
                      <div class="info-row" *ngIf="emp.badgeNumber"><span>🪪</span>{{ emp.badgeNumber }}</div>
                      <div class="info-row" *ngIf="emp.expiryDate"><span>📅</span>Expires: {{ emp.expiryDate | date:'dd MMM yyyy' }}</div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        }

        <!-- Equipment Results -->
        @if (!loading && (activeCategory === 'All' || activeCategory === 'Equipment')) {
          @if (searchResult?.equipment?.length ?? 0 > 0) {
            <section class="result-section">
              <div class="section-header">
                <h2 class="section-title">
                  <span>🔧</span> Equipment
                  <span class="result-count">{{ searchResult?.equipment?.length }}</span>
                </h2>
                <a routerLink="/register" [queryParams]="{type:'equipment'}" class="add-btn">+ Add New</a>
              </div>
              <div class="card-grid">
                @for (eq of searchResult?.equipment ?? []; track eq.id) {
                  <div class="record-card record-card--equipment">
                    <div class="card-header">
                      <div class="avatar avatar--equipment">🔧</div>
                      <div class="card-meta">
                        <h3 class="card-name">{{ eq.name }}</h3>
                        <span class="card-sub">{{ eq.category }}</span>
                      </div>
                      <span class="badge" [class]="'badge--status-' + eq.status.toLowerCase().replace(' ','-')">
                        {{ eq.status }}
                      </span>
                    </div>
                    <div class="card-body">
                      <div class="info-row" *ngIf="eq.serialNumber"><span>🔢</span>S/N: {{ eq.serialNumber }}</div>
                      <div class="info-row" *ngIf="eq.assetTag"><span>🏷️</span>Tag: {{ eq.assetTag }}</div>
                      <div class="info-row" *ngIf="eq.manufacturer"><span>🏭</span>{{ eq.manufacturer }} {{ eq.model }}</div>
                      <div class="info-row" *ngIf="eq.location"><span>📍</span>{{ eq.location }}</div>
                      <div class="info-row" *ngIf="eq.assignedToName"><span>👤</span>{{ eq.assignedToName }}</div>
                      <div class="info-row" *ngIf="eq.warrantyExpiry"><span>🛡️</span>Warranty: {{ eq.warrantyExpiry | date:'dd MMM yyyy' }}</div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        }

        <!-- Vehicle Results -->
        @if (!loading && (activeCategory === 'All' || activeCategory === 'Vehicles')) {
          @if (searchResult?.vehicles?.length ?? 0 > 0) {
            <section class="result-section">
              <div class="section-header">
                <h2 class="section-title">
                  <span>🚗</span> Vehicles
                  <span class="result-count">{{ searchResult?.vehicles?.length }}</span>
                </h2>
                <a routerLink="/register" [queryParams]="{type:'vehicle'}" class="add-btn">+ Add New</a>
              </div>
              <div class="card-grid">
                @for (v of searchResult?.vehicles ?? []; track v.id) {
                  <div class="record-card record-card--vehicle">
                    <div class="card-header">
                      <div class="avatar avatar--vehicle">🚗</div>
                      <div class="card-meta">
                        <h3 class="card-name">{{ v.year }} {{ v.make }} {{ v.model }}</h3>
                        <span class="card-sub">{{ v.vehicleType }}</span>
                      </div>
                      <span class="badge" [class]="'badge--status-' + v.status.toLowerCase().replace(' ','-')">
                        {{ v.status }}
                      </span>
                    </div>
                    <div class="card-body">
                      <div class="info-row"><span>🔖</span>{{ v.licensePlate }}</div>
                      <div class="info-row" *ngIf="v.color"><span>🎨</span>{{ v.color }}</div>
                      <div class="info-row" *ngIf="v.fuelType"><span>⛽</span>{{ v.fuelType }}</div>
                      <div class="info-row" *ngIf="v.department"><span>🏢</span>{{ v.department }}</div>
                      <div class="info-row" *ngIf="v.assignedToName"><span>👤</span>{{ v.assignedToName }}</div>
                      <div class="info-row"><span>🛣️</span>{{ v.odometer | number }} km</div>
                      <div class="info-row" *ngIf="v.registrationExp"><span>📋</span>Rego: {{ v.registrationExp | date:'dd MMM yyyy' }}</div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        }

      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; }

    /* ── Hero ── */
    .search-hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 3rem 1rem 2rem;
    }
    .search-hero__inner { max-width: 860px; margin: 0 auto; }
    .search-hero__title {
      color: #fff;
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 .3rem;
      letter-spacing: -.5px;
    }
    .search-hero__sub { color: rgba(255,255,255,.75); margin: 0 0 1.5rem; font-size: .95rem; }

    /* ── Search Bar ── */
    .search-bar {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 12px;
      padding: .75rem 1rem;
      box-shadow: 0 4px 24px rgba(0,0,0,.15);
      gap: .75rem;
    }
    .search-icon { width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0; }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      color: var(--text-primary);
      background: transparent;
    }
    .search-input::placeholder { color: var(--text-muted); }
    .search-clear {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 1rem;
      padding: 0 .25rem;
    }

    /* ── Category Tabs ── */
    .category-tabs {
      display: flex;
      gap: .5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    .cat-tab {
      display: flex;
      align-items: center;
      gap: .4rem;
      padding: .45rem .9rem;
      border-radius: 20px;
      border: 1.5px solid rgba(255,255,255,.3);
      background: rgba(255,255,255,.1);
      color: rgba(255,255,255,.85);
      font-size: .82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all .15s;
    }
    .cat-tab:hover { background: rgba(255,255,255,.2); }
    .cat-tab--active { background: #fff !important; color: var(--primary) !important; border-color: #fff; font-weight: 700; }
    .cat-icon { font-size: .9rem; }
    .cat-count {
      background: var(--primary);
      color: #fff;
      border-radius: 10px;
      padding: 1px 6px;
      font-size: .7rem;
      font-weight: 700;
    }
    .cat-tab--active .cat-count { background: var(--primary); }

    /* ── Results Area ── */
    .results-area { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }

    /* ── States ── */
    .state-panel {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-secondary);
    }
    .state-icon { font-size: 3rem; margin-bottom: 1rem; }
    .state-panel h3 { margin: 0 0 .5rem; color: var(--text-primary); }
    .state-panel a { color: var(--primary); }

    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin .7s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      max-width: 700px;
      margin: 0 auto 2rem;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem 1rem;
    }
    .stat-icon { font-size: 2rem; margin-bottom: .5rem; }
    .stat-label { font-weight: 700; color: var(--text-primary); font-size: .95rem; }
    .stat-hint { font-size: .78rem; color: var(--text-muted); margin-top: .25rem; }
    .hint-text { color: var(--text-muted); font-size: .9rem; }

    /* ── Section ── */
    .result-section { margin-bottom: 2.5rem; }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: .5rem;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }
    .result-count {
      background: var(--primary-light);
      color: var(--primary);
      border-radius: 12px;
      padding: 2px 10px;
      font-size: .78rem;
      font-weight: 700;
    }
    .add-btn {
      padding: .4rem .9rem;
      background: var(--primary);
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-size: .8rem;
      font-weight: 600;
      transition: background .15s;
    }
    .add-btn:hover { background: var(--primary-dark); }

    /* ── Cards ── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    .record-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      transition: box-shadow .2s, transform .2s;
    }
    .record-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); transform: translateY(-1px); }
    .card-header {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .avatar {
      width: 44px; height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: .9rem;
      flex-shrink: 0;
    }
    .avatar--employee { background: #dbeafe; color: #1d4ed8; }
    .avatar--contractor { background: #fef3c7; color: #92400e; }
    .avatar--equipment { background: #d1fae5; color: #065f46; font-size: 1.3rem; }
    .avatar--vehicle { background: #ede9fe; color: #5b21b6; font-size: 1.3rem; }
    .card-meta { flex: 1; min-width: 0; }
    .card-name { margin: 0 0 2px; font-size: .95rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-sub { font-size: .78rem; color: var(--text-muted); }
    .badges { display: flex; flex-direction: column; gap: 3px; align-items: flex-end; }
    .card-body { padding: .75rem 1rem; display: flex; flex-direction: column; gap: .35rem; }
    .info-row {
      display: flex;
      align-items: center;
      gap: .5rem;
      font-size: .82rem;
      color: var(--text-secondary);
      span:first-child { font-size: .9rem; width: 16px; flex-shrink: 0; }
    }

    /* ── Badges ── */
    .badge {
      font-size: .68rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .badge--type-employee  { background: #dbeafe; color: #1e40af; }
    .badge--type-contractor{ background: #fef3c7; color: #92400e; }
    .badge--status-active  { background: #d1fae5; color: #065f46; }
    .badge--status-inactive{ background: #f3f4f6; color: #6b7280; }
    .badge--status-suspended{ background: #fee2e2; color: #991b1b; }
    .badge--status-available   { background: #d1fae5; color: #065f46; }
    .badge--status-in-use      { background: #dbeafe; color: #1e40af; }
    .badge--status-maintenance { background: #fef3c7; color: #92400e; }
    .badge--status-retired     { background: #f3f4f6; color: #6b7280; }
    .badge--status-out-of-service { background: #fee2e2; color: #991b1b; }
  `]
})
export class DashboardComponent implements OnInit {
  searchTerm = '';
  activeCategory: SearchCategory = 'All';
  loading = false;
  searchResult: SearchResult | null = null;

  categories: SearchCategory[] = ['All', 'Employees', 'Contractors', 'Equipment', 'Vehicles'];

  private searchSubject = new Subject<{ term: string; cat: SearchCategory }>();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged((a, b) => a.term === b.term && a.cat === b.cat),
      switchMap(({ term, cat }) => {
        this.loading = true;
        return this.api.search(term, cat);
      })
    ).subscribe({
      next: result => { this.searchResult = result; this.loading = false; },
      error: () => { this.loading = false; }
    });

    // Load all on init
    this.triggerSearch();
  }

  onSearchChange(term: string) {
    this.triggerSearch();
  }

  setCategory(cat: SearchCategory) {
    this.activeCategory = cat;
    this.triggerSearch();
  }

  clearSearch() {
    this.searchTerm = '';
    this.triggerSearch();
  }

  private triggerSearch() {
    this.searchSubject.next({ term: this.searchTerm, cat: this.activeCategory });
  }

  get filteredEmployees() {
    if (!this.searchResult) return [];
    if (this.activeCategory === 'Contractors')
      return this.searchResult.employees.filter(e => e.personType === 'Contractor');
    if (this.activeCategory === 'Employees')
      return this.searchResult.employees.filter(e => e.personType === 'Employee');
    return this.searchResult.employees;
  }

  get totalResults() {
    if (!this.searchResult) return 0;
    return this.filteredEmployees.length +
           (this.searchResult.equipment?.length ?? 0) +
           (this.searchResult.vehicles?.length ?? 0);
  }

  getCatCount(cat: SearchCategory): number {
    if (!this.searchResult) return 0;
    switch (cat) {
      case 'All':         return this.totalResults;
      case 'Employees':   return this.searchResult.employees.filter(e => e.personType === 'Employee').length;
      case 'Contractors': return this.searchResult.employees.filter(e => e.personType === 'Contractor').length;
      case 'Equipment':   return this.searchResult.equipment?.length ?? 0;
      case 'Vehicles':    return this.searchResult.vehicles?.length ?? 0;
    }
  }

  catIcon(cat: SearchCategory): string {
    const icons: Record<SearchCategory, string> = {
      All: '🔍', Employees: '👤', Contractors: '🤝', Equipment: '🔧', Vehicles: '🚗'
    };
    return icons[cat];
  }
}
