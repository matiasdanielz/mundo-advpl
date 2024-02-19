import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelGeneratorComponent } from './excel-generator.component';

describe('ExcelGeneratorComponent', () => {
  let component: ExcelGeneratorComponent;
  let fixture: ComponentFixture<ExcelGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
