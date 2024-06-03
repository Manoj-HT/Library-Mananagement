import { Component, HostListener, Input, input, output, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'single-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './single-select.component.html',
  styleUrl: './single-select.component.scss',
})
export class SingleSelectComponent {
  label = input('');
  controlName = input('');
  parentForm = input<FormGroup>();
  change = output<any>()
  @Input() singleSelectOptions = signal<SingleSelectType>({
    keyToDisplay: '',
    dataArray: [],
  });
  idForDropdown!: string;
  idForSearch!: string;
  idForInput!: string;
  idForLabel!: string;
  isOpenDropdown = signal(false);
  isDropDownStyle = signal(false);
  ngOnInit() {
    this.idForDropdown = `select_${this.label().split(' ').join('')}-dropdown`;
    this.idForInput = `select_${this.label().split(' ').join('')}-input`;
    this.idForSearch = `select_${this.label()
      .split(' ')
      .join('')}-dropdownSearch`;
    this.dataArrayCopy = this.singleSelectOptions().dataArray;
  }

  dataArrayCopy!: any[];
  partialSearch(e: Event) {
    let value = (e.target as HTMLInputElement).value;
    this.singleSelectOptions().dataArray = JSON.parse(
      JSON.stringify(this.dataArrayCopy)
    );
    if (value != '') {
      let completeArray = this.singleSelectOptions().dataArray;
      completeArray = completeArray.filter((object) => {
        const displayValue = (
          object[this.singleSelectOptions().keyToDisplay] as string
        ).toLowerCase();
        return displayValue.includes(value);
      });
      this.singleSelectOptions.update((currentState) => {
        currentState = {
          ...currentState,
          dataArray: completeArray,
        };
        return currentState;
      });
    } else {
      this.singleSelectOptions.update((currentState) => {
        currentState = {
          ...currentState,
          dataArray: this.dataArrayCopy,
        };
        return currentState;
      });
    }
  }

  get control() {
    return this.parentForm()?.get(this.controlName()) as FormControl;
  }

  selectedOption(data: any) {
    this.parentForm()?.get(this.controlName())?.setValue(data);
    let input = document.getElementById(this.idForInput) as HTMLInputElement;
    input.value = data[this.singleSelectOptions().keyToDisplay];
    this.change.emit(data)
    this.toggleDropDown();
  }

  toggleDropDown() {
    this.isOpenDropdown.update((currentState) => {
      if (currentState) {
        this.isDropDownStyle.set(false);
        setTimeout(() => {
          this.isOpenDropdown.set(false);
        }, 499);
      } else {
        this.isOpenDropdown.set(true);
        this.isDropDownStyle.set(true);
      }
      return this.isOpenDropdown();
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isOpenDropdown()) {
      let element = event.target as HTMLElement;
      if (
        element.id != this.idForDropdown &&
        element.id != this.idForSearch &&
        element.id != this.idForInput
      ) {
        this.toggleDropDown();
      } else {
      }
    }
  }
}

export type SingleSelectType = {
  keyToDisplay: string;
  dataArray: any[];
};
