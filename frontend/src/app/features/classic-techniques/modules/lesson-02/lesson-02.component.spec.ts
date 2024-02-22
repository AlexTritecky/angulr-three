import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson02Component } from './lesson-02.component';

describe('Lesson02Component', () => {
  let component: Lesson02Component;
  let fixture: ComponentFixture<Lesson02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson02Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Lesson02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
