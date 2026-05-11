import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🪪</span>
        <span class="brand-name">MyPass</span>
        <span class="brand-tag">Access Management</span>
      </div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Dashboard & Search
        </a>
        <a routerLink="/register" routerLinkActive="active" class="nav-link nav-link--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          Register New
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 64px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 8px rgba(0,0,0,.06);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: .6rem;
    }
    .brand-icon { font-size: 1.6rem; }
    .brand-name {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -.5px;
    }
    .brand-tag {
      font-size: .7rem;
      color: var(--text-muted);
      background: var(--bg-secondary);
      padding: 2px 8px;
      border-radius: 20px;
      font-weight: 500;
      letter-spacing: .3px;
    }
    .nav-links { display: flex; gap: .5rem; }
    .nav-link {
      display: flex;
      align-items: center;
      gap: .4rem;
      padding: .5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: .875rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all .15s;
      svg { width: 16px; height: 16px; }
    }
    .nav-link:hover { background: var(--bg-secondary); color: var(--text-primary); }
    .nav-link.active { background: var(--primary-light); color: var(--primary); }
    .nav-link--primary {
      background: var(--primary);
      color: #fff !important;
    }
    .nav-link--primary:hover { background: var(--primary-dark); }
    .nav-link--primary.active { background: var(--primary-dark); }
  `]
})
export class NavbarComponent {}
