import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson07Component } from './lesson-07.component';

describe('Lesson07Component', () => {
  let component: Lesson07Component;
  let fixture: ComponentFixture<Lesson07Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson07Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Lesson07Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
