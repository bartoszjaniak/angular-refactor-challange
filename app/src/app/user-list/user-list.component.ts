import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  ],
})
export class UserListComponent {

  private userService = inject(UserService);

  protected filter = new FormControl<string>('', { nonNullable: true });

  protected onSort$ = new BehaviorSubject<Sort | undefined>(undefined);

  protected usersDataSource$ = combineLatest([
    this.filter.valueChanges.pipe(startWith(''), debounceTime(300)),
    this.onSort$.pipe(
      map(sort => sort?.active ? sort.direction === 'asc' ? sort.active : `-${sort.active}` : undefined),
    )
  ]).pipe(
    switchMap(([filter, sort]) => this.userService.getUsers(filter,0,5, sort)),
    map((users) => new MatTableDataSource(users))
  );
}
