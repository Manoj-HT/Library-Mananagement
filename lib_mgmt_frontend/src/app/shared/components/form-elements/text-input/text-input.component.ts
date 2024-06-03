import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'text-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  label = input('');
  controlName = input('')
  parentForm = input<FormGroup>()
  labelTransformation!: string;
  input = output<Event>()
  ngOnInit(): void {
    this.labelTransformation = this.label().split(' ').join('');
  }

  getInputValue(e : Event){
    this.input.emit(e)
  }

  get control(){
    let controlName = this.controlName()
    return this.parentForm()?.get(this.controlName()) as FormControl
  }
}
