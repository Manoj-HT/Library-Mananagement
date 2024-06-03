import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'password-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
})
export class PasswordInputComponent {
  label = input('');
  controlName = input('');
  parentForm = input<FormGroup>();
  labelTransformation!: string;
  input = output<Event>();
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
export type PasswordInputType = {};
