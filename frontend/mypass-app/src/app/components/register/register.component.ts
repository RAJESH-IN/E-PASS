import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

type RegType = 'employee' | 'equipment' | 'vehicle';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="register-container">

        <!-- Page Header -->
        <div class="page-header">
          <a routerLink="/" class="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to Search
          </a>
          <h1>Register New Record</h1>
          <p>Add a new employee, contractor, equipment or vehicle to MyPass</p>
        </div>

        <!-- Type Selector -->
        <div class="type-selector">
          <button class="type-btn" [class.type-btn--active]="regType==='employee'" (click)="setType('employee')">
            <span>👤</span>
            <div>
              <div class="type-btn__label">Employee / Contractor</div>
              <div class="type-btn__hint">Personnel access pass</div>
            </div>
          </button>
          <button class="type-btn" [class.type-btn--active]="regType==='equipment'" (click)="setType('equipment')">
            <span>🔧</span>
            <div>
              <div class="type-btn__label">Equipment</div>
              <div class="type-btn__hint">Assets & tools</div>
            </div>
          </button>
          <button class="type-btn" [class.type-btn--active]="regType==='vehicle'" (click)="setType('vehicle')">
            <span>🚗</span>
            <div>
              <div class="type-btn__label">Vehicle</div>
              <div class="type-btn__hint">Fleet & transport</div>
            </div>
          </button>
        </div>

        <!-- Alerts -->
        <div *ngIf="successMsg" class="alert alert--success">✅ {{ successMsg }}</div>
        <div *ngIf="errorMsg"   class="alert alert--error">❌ {{ errorMsg }}</div>

        <!-- ═══════════ EMPLOYEE FORM ═══════════ -->
        <form *ngIf="regType==='employee'" [formGroup]="employeeForm" (ngSubmit)="submitEmployee()" class="form-card">
          <div class="form-section">
            <h3 class="form-section__title">Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label>First Name <span class="req">*</span></label>
                <input formControlName="firstName" type="text" placeholder="Alice" [class.invalid]="isInvalid('employee','firstName')">
                <span class="field-error" *ngIf="isInvalid('employee','firstName')">Required</span>
              </div>
              <div class="form-group">
                <label>Last Name <span class="req">*</span></label>
                <input formControlName="lastName" type="text" placeholder="Johnson" [class.invalid]="isInvalid('employee','lastName')">
                <span class="field-error" *ngIf="isInvalid('employee','lastName')">Required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email <span class="req">*</span></label>
                <input formControlName="email" type="email" placeholder="alice@company.com" [class.invalid]="isInvalid('employee','email')">
                <span class="field-error" *ngIf="isInvalid('employee','email')">Valid email required</span>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input formControlName="phone" type="tel" placeholder="+61 400 000 000">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="form-section__title">Role & Organisation</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Type <span class="req">*</span></label>
                <select formControlName="personType">
                  <option value="Employee">Employee</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select formControlName="status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Company / Organisation</label>
                <input formControlName="company" type="text" placeholder="ACME Corp">
              </div>
              <div class="form-group">
                <label>Department</label>
                <input formControlName="department" type="text" placeholder="Engineering">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Job Title</label>
                <input formControlName="jobTitle" type="text" placeholder="Senior Engineer">
              </div>
              <div class="form-group">
                <label>Badge Number</label>
                <input formControlName="badgeNumber" type="text" placeholder="EMP-001">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="form-section__title">Access Dates</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input formControlName="startDate" type="date">
              </div>
              <div class="form-group">
                <label>Expiry Date <small>(contractors)</small></label>
                <input formControlName="expiryDate" type="date">
              </div>
            </div>
            <div class="form-group">
              <label>Photo URL</label>
              <input formControlName="photoUrl" type="url" placeholder="https://...">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn--ghost" (click)="resetForm()">Reset</button>
            <button type="submit" class="btn btn--primary" [disabled]="submitting">
              <span *ngIf="submitting" class="btn-spinner"></span>
              {{ submitting ? 'Registering...' : 'Register Employee / Contractor' }}
            </button>
          </div>
        </form>

        <!-- ═══════════ EQUIPMENT FORM ═══════════ -->
        <form *ngIf="regType==='equipment'" [formGroup]="equipmentForm" (ngSubmit)="submitEquipment()" class="form-card">
          <div class="form-section">
            <h3 class="form-section__title">Equipment Details</h3>
            <div class="form-row">
              <div class="form-group form-group--wide">
                <label>Equipment Name <span class="req">*</span></label>
                <input formControlName="name" type="text" placeholder="Laptop Pro 15" [class.invalid]="isInvalid('equipment','name')">
                <span class="field-error" *ngIf="isInvalid('equipment','name')">Required</span>
              </div>
              <div class="form-group">
                <label>Category <span class="req">*</span></label>
                <select formControlName="category" [class.invalid]="isInvalid('equipment','category')">
                  <option value="">Select...</option>
                  <option>Computing</option>
                  <option>Networking</option>
                  <option>Power Tools</option>
                  <option>Power</option>
                  <option>Inspection</option>
                  <option>Safety</option>
                  <option>Communication</option>
                  <option>Other</option>
                </select>
                <span class="field-error" *ngIf="isInvalid('equipment','category')">Required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Serial Number</label>
                <input formControlName="serialNumber" type="text" placeholder="SN-LT-001">
              </div>
              <div class="form-group">
                <label>Asset Tag</label>
                <input formControlName="assetTag" type="text" placeholder="AT-0001">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Manufacturer</label>
                <input formControlName="manufacturer" type="text" placeholder="Dell">
              </div>
              <div class="form-group">
                <label>Model</label>
                <input formControlName="model" type="text" placeholder="XPS 15 9530">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="form-section__title">Status & Location</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Status</label>
                <select formControlName="status">
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div class="form-group">
                <label>Location</label>
                <input formControlName="location" type="text" placeholder="Head Office">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Purchase Date</label>
                <input formControlName="purchaseDate" type="date">
              </div>
              <div class="form-group">
                <label>Warranty Expiry</label>
                <input formControlName="warrantyExpiry" type="date">
              </div>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea formControlName="notes" rows="3" placeholder="Additional details..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn--ghost" (click)="resetForm()">Reset</button>
            <button type="submit" class="btn btn--primary" [disabled]="submitting">
              <span *ngIf="submitting" class="btn-spinner"></span>
              {{ submitting ? 'Registering...' : 'Register Equipment' }}
            </button>
          </div>
        </form>

        <!-- ═══════════ VEHICLE FORM ═══════════ -->
        <form *ngIf="regType==='vehicle'" [formGroup]="vehicleForm" (ngSubmit)="submitVehicle()" class="form-card">
          <div class="form-section">
            <h3 class="form-section__title">Vehicle Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Make <span class="req">*</span></label>
                <input formControlName="make" type="text" placeholder="Toyota" [class.invalid]="isInvalid('vehicle','make')">
                <span class="field-error" *ngIf="isInvalid('vehicle','make')">Required</span>
              </div>
              <div class="form-group">
                <label>Model <span class="req">*</span></label>
                <input formControlName="model" type="text" placeholder="HiLux" [class.invalid]="isInvalid('vehicle','model')">
                <span class="field-error" *ngIf="isInvalid('vehicle','model')">Required</span>
              </div>
              <div class="form-group form-group--sm">
                <label>Year <span class="req">*</span></label>
                <input formControlName="year" type="number" placeholder="2024" [class.invalid]="isInvalid('vehicle','year')">
                <span class="field-error" *ngIf="isInvalid('vehicle','year')">Required</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>License Plate <span class="req">*</span></label>
                <input formControlName="licensePlate" type="text" placeholder="ACE-001" [class.invalid]="isInvalid('vehicle','licensePlate')">
                <span class="field-error" *ngIf="isInvalid('vehicle','licensePlate')">Required</span>
              </div>
              <div class="form-group">
                <label>VIN</label>
                <input formControlName="vin" type="text" placeholder="17-character VIN">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Vehicle Type <span class="req">*</span></label>
                <select formControlName="vehicleType">
                  <option value="Car">Car</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Heavy Equipment">Heavy Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Color</label>
                <input formControlName="color" type="text" placeholder="White">
              </div>
              <div class="form-group">
                <label>Fuel Type</label>
                <select formControlName="fuelType">
                  <option value="">Select...</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                  <option>CNG</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="form-section__title">Status & Assignment</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Status</label>
                <select formControlName="status">
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>
              <div class="form-group">
                <label>Department</label>
                <input formControlName="department" type="text" placeholder="Operations">
              </div>
              <div class="form-group">
                <label>Odometer (km)</label>
                <input formControlName="odometer" type="number" placeholder="0">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Insurance Expiry</label>
                <input formControlName="insuranceExpiry" type="date">
              </div>
              <div class="form-group">
                <label>Registration Expiry</label>
                <input formControlName="registrationExp" type="date">
              </div>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea formControlName="notes" rows="3" placeholder="Additional details..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn--ghost" (click)="resetForm()">Reset</button>
            <button type="submit" class="btn btn--primary" [disabled]="submitting">
              <span *ngIf="submitting" class="btn-spinner"></span>
              {{ submitting ? 'Registering...' : 'Register Vehicle' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 2rem 1rem;
    }
    .register-container { max-width: 820px; margin: 0 auto; }

    /* Header */
    .page-header { margin-bottom: 2rem; }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: .3rem;
      color: var(--primary);
      text-decoration: none;
      font-size: .875rem;
      font-weight: 500;
      margin-bottom: 1rem;
      svg { width: 16px; height: 16px; }
    }
    .page-header h1 { margin: 0 0 .25rem; font-size: 1.75rem; font-weight: 800; color: var(--text-primary); }
    .page-header p { color: var(--text-secondary); margin: 0; }

    /* Type Selector */
    .type-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .type-btn {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: 1rem;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 12px;
      cursor: pointer;
      text-align: left;
      transition: all .15s;
      font-size: 1.5rem;
    }
    .type-btn:hover { border-color: var(--primary); background: var(--primary-light); }
    .type-btn--active { border-color: var(--primary); background: var(--primary-light); }
    .type-btn__label { font-size: .875rem; font-weight: 700; color: var(--text-primary); }
    .type-btn__hint  { font-size: .75rem; color: var(--text-muted); margin-top: 2px; }

    /* Alerts */
    .alert {
      padding: .9rem 1.2rem;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      font-size: .9rem;
      font-weight: 500;
    }
    .alert--success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .alert--error   { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

    /* Form Card */
    .form-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
    }

    /* Form Sections */
    .form-section { padding: 1.5rem; border-bottom: 1px solid var(--border); }
    .form-section:last-of-type { border-bottom: none; }
    .form-section__title {
      margin: 0 0 1.25rem;
      font-size: .875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .5px;
      color: var(--text-muted);
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .form-group {
      flex: 1;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }
    .form-group--wide { flex: 2; }
    .form-group--sm   { flex: 0 0 100px; min-width: 100px; }

    label {
      font-size: .8rem;
      font-weight: 600;
      color: var(--text-secondary);
      small { font-weight: 400; color: var(--text-muted); }
    }
    .req { color: #ef4444; }

    input, select, textarea {
      padding: .55rem .75rem;
      border: 1.5px solid var(--border);
      border-radius: 8px;
      font-size: .9rem;
      color: var(--text-primary);
      background: var(--bg-primary);
      outline: none;
      transition: border-color .15s;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus { border-color: var(--primary); background: #fff; }
    input.invalid, select.invalid { border-color: #ef4444; }
    textarea { resize: vertical; }

    .field-error { font-size: .75rem; color: #ef4444; font-weight: 500; }

    /* Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: .75rem;
      padding: 1.25rem 1.5rem;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
    }
    .btn {
      padding: .6rem 1.4rem;
      border-radius: 9px;
      font-size: .9rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all .15s;
      display: flex;
      align-items: center;
      gap: .5rem;
    }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover:not(:disabled) { background: var(--primary-dark); }
    .btn--primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn--ghost { background: transparent; color: var(--text-secondary); border: 1.5px solid var(--border); }
    .btn--ghost:hover { background: var(--bg-primary); }
    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 600px) {
      .type-selector { grid-template-columns: 1fr; }
      .form-row { flex-direction: column; }
    }
  `]
})
export class RegisterComponent implements OnInit {
  regType: RegType = 'employee';
  submitting = false;
  successMsg = '';
  errorMsg = '';

  employeeForm!: FormGroup;
  equipmentForm!: FormGroup;
  vehicleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForms();
    this.route.queryParams.subscribe(p => {
      if (p['type'] === 'equipment') this.regType = 'equipment';
      else if (p['type'] === 'vehicle') this.regType = 'vehicle';
      else this.regType = 'employee';
    });
  }

  buildForms() {
    this.employeeForm = this.fb.group({
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      phone:       [''],
      personType:  ['Employee', Validators.required],
      company:     [''],
      department:  [''],
      jobTitle:    [''],
      badgeNumber: [''],
      status:      ['Active'],
      photoUrl:    [''],
      startDate:   [''],
      expiryDate:  ['']
    });

    this.equipmentForm = this.fb.group({
      name:          ['', Validators.required],
      category:      ['', Validators.required],
      serialNumber:  [''],
      assetTag:      [''],
      manufacturer:  [''],
      model:         [''],
      location:      [''],
      assignedToId:  [null],
      status:        ['Available'],
      purchaseDate:  [''],
      warrantyExpiry:[''],
      notes:         ['']
    });

    this.vehicleForm = this.fb.group({
      make:           ['', Validators.required],
      model:          ['', Validators.required],
      year:           [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      licensePlate:   ['', Validators.required],
      vin:            [''],
      color:          [''],
      vehicleType:    ['Car', Validators.required],
      department:     [''],
      assignedToId:   [null],
      status:         ['Available'],
      insuranceExpiry:[''],
      registrationExp:[''],
      odometer:       [0],
      fuelType:       [''],
      notes:          ['']
    });
  }

  setType(type: RegType) {
    this.regType = type;
    this.clearMessages();
  }

  isInvalid(formName: string, field: string): boolean {
    const form = formName === 'employee' ? this.employeeForm
               : formName === 'equipment' ? this.equipmentForm
               : this.vehicleForm;
    const ctrl = form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  resetForm() {
    if (this.regType === 'employee')  this.employeeForm.reset({ personType: 'Employee', status: 'Active' });
    if (this.regType === 'equipment') this.equipmentForm.reset({ status: 'Available' });
    if (this.regType === 'vehicle')   this.vehicleForm.reset({ vehicleType: 'Car', status: 'Available', year: new Date().getFullYear(), odometer: 0 });
    this.clearMessages();
  }

  submitEmployee() {
    if (this.employeeForm.invalid) { this.employeeForm.markAllAsTouched(); return; }
    this.submitting = true; this.clearMessages();
    const v = this.employeeForm.value;
    const dto = { ...v, startDate: v.startDate || undefined, expiryDate: v.expiryDate || undefined };
    this.api.createEmployee(dto).subscribe({
      next: emp => {
        this.successMsg = `✅ ${emp.fullName ?? `${emp.firstName} ${emp.lastName}`} has been registered successfully!`;
        this.employeeForm.reset({ personType: 'Employee', status: 'Active' });
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/']), 2500);
      },
      error: err => {
        this.errorMsg = err?.error?.message ?? 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  submitEquipment() {
    if (this.equipmentForm.invalid) { this.equipmentForm.markAllAsTouched(); return; }
    this.submitting = true; this.clearMessages();
    const v = this.equipmentForm.value;
    const dto = { ...v, purchaseDate: v.purchaseDate || undefined, warrantyExpiry: v.warrantyExpiry || undefined };
    this.api.createEquipment(dto).subscribe({
      next: eq => {
        this.successMsg = `✅ ${eq.name} has been registered successfully!`;
        this.equipmentForm.reset({ status: 'Available' });
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/']), 2500);
      },
      error: err => {
        this.errorMsg = err?.error?.message ?? 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  submitVehicle() {
    if (this.vehicleForm.invalid) { this.vehicleForm.markAllAsTouched(); return; }
    this.submitting = true; this.clearMessages();
    const v = this.vehicleForm.value;
    const dto = {
      ...v,
      insuranceExpiry: v.insuranceExpiry || undefined,
      registrationExp: v.registrationExp || undefined
    };
    this.api.createVehicle(dto).subscribe({
      next: veh => {
        this.successMsg = `✅ ${veh.year} ${veh.make} ${veh.model} (${veh.licensePlate}) registered successfully!`;
        this.vehicleForm.reset({ vehicleType: 'Car', status: 'Available', year: new Date().getFullYear(), odometer: 0 });
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/']), 2500);
      },
      error: err => {
        this.errorMsg = err?.error?.message ?? 'Registration failed. Please try again.';
        this.submitting = false;
      }
    });
  }

  private clearMessages() { this.successMsg = ''; this.errorMsg = ''; }
}
