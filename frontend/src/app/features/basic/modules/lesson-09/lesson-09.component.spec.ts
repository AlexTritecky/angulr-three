import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson09Component } from './lesson-09.component';

describe('Lesson09Component', () => {
  let component: Lesson09Component;
  let fixture: ComponentFixture<Lesson09Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson09Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Lesson09Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
