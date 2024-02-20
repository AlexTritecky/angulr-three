import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicTechniquesComponent } from './classic-techniques.component';

describe('ClassicTechniquesComponent', () => {
  let component: ClassicTechniquesComponent;
  let fixture: ComponentFixture<ClassicTechniquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicTechniquesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassicTechniquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
