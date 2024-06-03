import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'text-area',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss'
})
export class TextAreaComponent {
  label = input('');
  controlName = input('');
  parentForm = input<FormGroup>();
  labelTransformation!: string;
  input = output<Event>();
  rows = input(5)
  ngOnInit(): void {
    this.labelTransformation = this.label().split(' ').join('');
  }

  getInputValue(e: Event) {
    this.input.emit(e);
  }

  get control() {
    return this.parentForm()?.get(this.controlName()) as FormControl;
  }

}
