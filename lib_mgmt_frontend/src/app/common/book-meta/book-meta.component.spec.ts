import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMetaComponent } from './book-meta.component';

describe('BookMetaComponent', () => {
  let component: BookMetaComponent;
  let fixture: ComponentFixture<BookMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookMetaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
