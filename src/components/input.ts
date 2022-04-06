import { Basic } from './basic';
import { Validatable, validate } from '../util/validation';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project';

  // Project Input
  export class ProjectInput extends Basic<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
        this.descInputElement = <HTMLInputElement>this.element.querySelector('#description');
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');
        this.configure();
  
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler )
    }
    renderContent() {}
    private getUserInput(): [string, string, number] | void  {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            min: 1,
            max: 5
        }

        if(
          !validate(titleValidatable) ||
          !validate(descriptionValidatable) || 
          !validate(peopleValidatable)

        ) {
            alert('invalid suka')
            return;
        } else {
            return [enteredTitle, enteredDesc, Number(enteredPeople)]
        }

    }
    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserInput();

        if(Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.element.reset();
            this.titleInputElement.focus()
        }
        

    }   
       
 
}