import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson08Component } from './lesson-08.component';

describe('Lesson08Component', () => {
  let component: Lesson08Component;
  let fixture: ComponentFixture<Lesson08Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson08Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Lesson08Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
