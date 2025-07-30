import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  combineLatest,
  debounceTime,
  map,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { selectTotal, selectUsers } from '../store/users/users.selectors';
import { selectFavoriteUserIds } from '../store/favorites/favorites.selectors';
import { loadFavoritesFromStorage } from '../store/favorites/favorites.actions';
import { loadUsers, setFilter, setPagination, setSort } from '../store/users/users.actions';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class UserListComponent implements AfterViewInit, OnDestroy {

  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  ngAfterViewInit(): void {
    this.store.dispatch(loadUsers());

    this.filter.valueChanges.pipe(
      debounceTime(300),
      tap((value) => this.setFilter(value)),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  protected filter = new FormControl<string>('', { nonNullable: true });

  private store = inject(Store);

  protected users$ = combineLatest([
    this.store.select(selectUsers),
    this.store.select(selectFavoriteUserIds)
  ]).pipe(
    map(([users, favoriteIds]) => {
      const usersWithFavoriteFlag = users.map(user => ({
        ...user,
        isFavorite: favoriteIds.has(user.id)
      }));
      return new MatTableDataSource(usersWithFavoriteFlag);
    })
  );

  protected total$ = this.store.select(selectTotal);

  protected setSort(sort: Sort) {
    this.store.dispatch(
      setSort({
        sort: sort.active
          ? sort.direction === 'asc'
            ? sort.active
            : `-${sort.active}`
          : '',
      })
    );
  }

  protected setPagination(pagination: { pageIndex: number; pageSize: number }) {
    this.store.dispatch(setPagination(pagination));
  }

  protected setFilter(filter: string) {
    this.store.dispatch(setFilter({ filter }));
  }
}
