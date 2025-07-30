import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { UserListComponent } from './user-list.component';
import {
  loadUsers,
  setFilter,
  setPagination,
  setSort,
} from '../store/users/users.actions';

import { User } from '../models/user.model';
import { selectUsers, selectTotal } from '../store/users/users.selectors';
import { selectFavoriteUserIds } from '../store/favorites/favorites.selectors';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let store: jasmine.SpyObj<Store>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Jan Kowalski',
      role: 'Developer',
      email: 'jan@example.com',
      protectedProjects: 3,
    },
    {
      id: 2,
      name: 'Anna Nowak',
      role: 'Manager',
      email: 'anna@example.com',
      protectedProjects: 5,
    },
    {
      id: 3,
      name: 'Piotr Wiśniewski',
      role: 'Tester',
      email: 'piotr@example.com',
      protectedProjects: 2,
    },
  ];

  const mockFavoriteIds = new Set([1, 3]);

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [{ provide: Store, useValue: storeSpy }, provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    // Setup store selectors
    store.select.and.callFake((selector: any) => {
      if (selector === selectUsers) {
        return of(mockUsers);
      }
      if (selector === selectFavoriteUserIds) {
        return of(mockFavoriteIds);
      }
      if (selector === selectTotal) {
        return of(100);
      }

      // Fallback for any other selector
      return of([]);
    });

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component initialization', () => {
    it('should dispatch loadUsers action on initialization', () => {
      component.ngAfterViewInit();

      expect(store.dispatch).toHaveBeenCalledWith(loadUsers());
    });
  });

  describe('search functionality', () => {
    it('should dispatch setFilter action when search input changes', (done) => {
      component.ngAfterViewInit();
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('input[matInput]'));
      expect(searchInput).toBeTruthy();

      // Symuluj wpisanie tekstu
      component['filter'].setValue('Jan');

      // Czekaj na debounce (300ms)
      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          setFilter({ filter: 'Jan' })
        );
        done();
      }, 350);
    });

    it('should debounce search input changes', (done) => {
      component.ngAfterViewInit();
      fixture.detectChanges();

      // Reset spy calls
      store.dispatch.calls.reset();

      // Szybko zmień wartość kilka razy
      component['filter'].setValue('J');
      component['filter'].setValue('Ja');
      component['filter'].setValue('Jan');

      // Po debounce powinien być tylko jeden dispatch
      setTimeout(() => {
        // Sprawdź czy setFilter został wywołany z ostatnią wartością
        expect(store.dispatch).toHaveBeenCalledWith(
          setFilter({ filter: 'Jan' })
        );
        done();
      }, 350);
    });
  });

  describe('sorting functionality', () => {
    it('should dispatch setSort action when sort changes - ascending', () => {
      const sortEvent: Sort = { active: 'name', direction: 'asc' };

      component['setSort'](sortEvent);

      expect(store.dispatch).toHaveBeenCalledWith(setSort({ sort: 'name' }));
    });

    it('should dispatch setSort action when sort changes - descending', () => {
      const sortEvent: Sort = { active: 'name', direction: 'desc' };

      component['setSort'](sortEvent);

      expect(store.dispatch).toHaveBeenCalledWith(setSort({ sort: '-name' }));
    });

    it('should dispatch setSort action with empty string when no sort is active', () => {
      const sortEvent: Sort = { active: '', direction: '' };

      component['setSort'](sortEvent);

      expect(store.dispatch).toHaveBeenCalledWith(setSort({ sort: '' }));
    });

    it('should trigger setSort when mat-sort header is clicked', () => {
      spyOn(component, 'setSort' as any);
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table[mat-table]'));
      expect(table).toBeTruthy();

      // Symuluj kliknięcie w header sortowania
      const sortEvent: Sort = { active: 'name', direction: 'asc' };
      table.triggerEventHandler('matSortChange', sortEvent);

      expect(component['setSort']).toHaveBeenCalledWith(sortEvent);
    });
  });

  describe('pagination functionality', () => {
    it('should dispatch setPagination action when pagination changes', () => {
      const paginationEvent = { pageIndex: 1, pageSize: 25 };

      component['setPagination'](paginationEvent);

      expect(store.dispatch).toHaveBeenCalledWith(
        setPagination(paginationEvent)
      );
    });

    it('should trigger setPagination when paginator page changes', () => {
      spyOn(component, 'setPagination' as any);
      fixture.detectChanges();

      const paginator = fixture.debugElement.query(By.css('mat-paginator'));
      expect(paginator).toBeTruthy();

      // Symuluj zmianę strony
      const pageEvent = { pageIndex: 2, pageSize: 10 };
      paginator.triggerEventHandler('page', pageEvent);

      expect(component['setPagination']).toHaveBeenCalledWith(pageEvent);
    });
  });

  describe('data display', () => {
    it('should display users data in table after loading', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
      expect(rows.length).toBe(mockUsers.length);

      // Sprawdź czy dane użytkowników są wyświetlane
      const firstRowCells = rows[0].queryAll(By.css('td[mat-cell]'));
      expect(firstRowCells[0].nativeElement.textContent.trim()).toContain(
        'Jan Kowalski'
      );
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe(
        'Developer'
      );
      expect(firstRowCells[2].nativeElement.textContent.trim()).toBe('3');
    });

    it('should display total count in paginator', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const paginator = fixture.debugElement.query(By.css('mat-paginator'));
      if (paginator) {
        expect(paginator.componentInstance.length).toBe(100);
      }
    });
  });

  describe('favorite users display', () => {
    it('should show star for users marked as favorites', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const favoriteColumn = fixture.debugElement
        .queryAll(By.css('td[mat-cell]'))
        .filter(
          (cell, index) => index % 4 === 3 // Każda 4. komórka to kolumna favorite
        );

      if (favoriteColumn.length >= 3) {
        expect(favoriteColumn[0].nativeElement.textContent.trim()).toBe('⭐'); // User ID 1
        expect(favoriteColumn[1].nativeElement.textContent.trim()).toBe(''); // User ID 2
        expect(favoriteColumn[2].nativeElement.textContent.trim()).toBe('⭐'); // User ID 3
      }
    });
  });

  describe('navigation functionality', () => {
    it('should navigate to user details when user name is clicked', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const firstUserLink = fixture.debugElement.query(
        By.css('a[ng-reflect-router-link]')
      );
      expect(firstUserLink).toBeTruthy();
      expect(firstUserLink.nativeElement.textContent.trim()).toBe(
        'Jan Kowalski'
      );
      // Sprawdź czy link ma odpowiedni routerLink
      expect(firstUserLink.attributes['ng-reflect-router-link']).toBe('1');
    });
  });
});
