namespace App {
    // project list

export class ProjectList extends Basic<HTMLDivElement, HTMLElement> implements DragTarget  {

    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app',false, `${type}-project`)

        this.element.id = `${this.type}-projects`;
        this.assignedProjects = []
        this.configure();
        this.renderContent()
    }
    @autobind
    dragOverHandler(event: DragEvent) {
        if(event.dataTransfer && event.dataTransfer.types[0] == 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');

        }
        

    }
    @autobind
    dropHandler(event: DragEvent) {
        const id = event.dataTransfer!.getData('text/plain');
        projectState.switchStatus(id, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)

    }
    @autobind
    dragLeaveHandler(_: DragEvent) {

        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');


    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
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
    }
    renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'Projects';

    }
    private renderProject() {
        const listEl = <HTMLUListElement>document.getElementById(`${this.type}-project-list`);
        listEl.innerHTML = ''
        for(const item of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, item)
            
        }


    }
   
}
}