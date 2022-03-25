// class Project
enum ProjectStatus { Active, Finished };

class Project {
    constructor(public id: string, 
        public title: string, 
        public description: string, 
        public people: number,
        public status: ProjectStatus ) {

    }
}

// Project State management
type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        

    }
    static getInstance() {
        if(this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        )
        this.projects.push(newProject);
        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
            console.log(this.listeners)
        }
        
    }
}
const projectState = ProjectState.getInstance()


//  validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
function validate(object: Validatable) {
    let isValid = true;
    if(object.required) {
        isValid = isValid && object.value.toString().trim().length !== 0
    }
    if(object.minLength != null && typeof object.value === 'string') {
        isValid = isValid && object.value.length > object.minLength

    }
    if(object.maxLength != null && typeof object.value === 'string') {
        isValid = isValid && object.value.length < object.maxLength

    }
    if(object.min != null && typeof object.value === 'number') {
        isValid = isValid && object.value > object.min

    }
    if(object.max != null && typeof object.value === 'number') {
        isValid = isValid && object.value < object.max;

    }
    return isValid

}

// autobind

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    }
    return adjDescriptor;
}

// 
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = <HTMLFormElement>importedNode.firstElementChild;
        this.element.id = 'user-input';


        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
        this.descInputElement = <HTMLInputElement>this.element.querySelector('#description');
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');

        this.configure()
        this.attach()
    }
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

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserInput();

        if(Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            console.log(projectState)
            this.element.reset();
            this.titleInputElement.focus()
        }
        

    }   
     private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this) )
    }
}

// project list

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = <HTMLElement>importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        this.assignedProjects = []
        projectState.addListener((projects: Project[]) =>{
            const relevantProject = projects.filter(project => {
                if(this.type === 'active') {
                    return project.status  === ProjectStatus.Active
                } else {
                   return project.status  === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = relevantProject;
            this.renderProject();

        })
        this.attach();
        this.renderContent()
    }
    private renderProject() {
        const listEl = <HTMLUListElement>document.getElementById(`${this.type}-project-list`);
        listEl.innerHTML = ''
        for(const item of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = item.title;
            console.log(listItem)
            listEl.appendChild(listItem)
            
        }


    }
    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
    private renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'Projects';

    }
}

const printedInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');