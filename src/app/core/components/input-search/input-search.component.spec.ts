import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSerchComponent } from './input-search.component';

describe('InputSerchComponent', () => {
  let component: InputSerchComponent;
  let fixture: ComponentFixture<InputSerchComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [InputSerchComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSerchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
