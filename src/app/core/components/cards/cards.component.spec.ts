import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../users/data-access-users/services/user.service';

import { CardsComponent } from './cards.component';
import { User } from '../../../users/data-access-users/models/user';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;
  let usersSubject: Subject<User[]>;
  let toastrService: { error: jest.Mock };

  beforeEach(async () => {
    usersSubject = new Subject<User[]>();
    toastrService = { error: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CardsComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { getFilteredUsers: () => usersSubject.asObservable() } },
        { provide: ToastrService, useValue: toastrService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading while users are being loaded', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.isLoading).toBe(true);
    expect(compiled.textContent).toContain('Carregando usuarios...');
  });

  it('should show empty state after loading users with no results', () => {
    usersSubject.next([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(component.isLoading).toBe(false);
    expect(compiled.textContent).toContain('Nenhum usuario encontrado.');
  });

  it('should show an error when users cannot be loaded', () => {
    jest.spyOn(console, 'error').mockImplementation();

    usersSubject.error(new Error('Firestore error'));
    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.usersError).toBe('Nao foi possivel carregar os usuarios.');
    expect(toastrService.error).toHaveBeenCalledWith('Nao foi possivel carregar os usuarios.');
  });
});
