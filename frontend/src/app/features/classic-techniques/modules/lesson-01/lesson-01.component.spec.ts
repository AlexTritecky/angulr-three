import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson01Component } from './lesson-01.component';

describe('Lesson01Component', () => {
  let component: Lesson01Component;
  let fixture: ComponentFixture<Lesson01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson01Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Lesson01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
