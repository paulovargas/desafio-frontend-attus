import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InputSearchComponent } from './input-search.component';
import { UserService } from '../../../users/data-access-users/services/user.service';

describe('InputSearchComponent', () => {
  let component: InputSearchComponent;
  let fixture: ComponentFixture<InputSearchComponent>;
  let userService: { setSearchTerm: jest.Mock };

  beforeEach(async () => {
    userService = { setSearchTerm: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [InputSearchComponent],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debounce search term changes', fakeAsync(() => {
    component['searchControl'].setValue('Maria');
    tick(299);

    expect(userService.setSearchTerm).not.toHaveBeenCalled();

    tick(1);

    expect(userService.setSearchTerm).toHaveBeenCalledWith('Maria');
  }));

  it('should ignore repeated search terms', fakeAsync(() => {
    component['searchControl'].setValue('Maria');
    tick(300);
    component['searchControl'].setValue('Maria');
    tick(300);

    expect(userService.setSearchTerm).toHaveBeenCalledTimes(1);
  }));
});
