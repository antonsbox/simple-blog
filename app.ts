import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component, Input} from"@angular/core";
import  {FORM_DIRECTIVES} from  "@angular/common";


@Component({
    selector: 'CKEDITOR',
    template: `
     <textarea  name="targetId" id="targetId" rows="rows" cols="cols">
         Type here..
     </textarea>
  `
})
class CKEDITOR {
    public static editor: any;
    @Input() targetId;
    @Input() rows = 10;  //you can also give default values here
    @Input() cols;

    constructor() {
    }

    ngOnInit() {
        CKEDITOR.editor = window['CKEDITOR']['replace']('targetId');
    }


}


class SimpleBlogPost {
    id: number;
    title: string;
    content: string;
    creationTime: Date;

    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
        this.id = this.getRandomInt(1,10000); //TODO need getLastId from array
        this.creationTime = new Date();
    }

    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}


@Component({
    selector: 'simple-blog',
    directives: [FORM_DIRECTIVES, CKEDITOR],
    template: `
    <div class="ui raised text container segment">
        <div *ngIf="!newPostPressed">
            <div class="ui container">
                <div class=" ui clearing segment">
                    <h1 class="ui header">Simple Blog
                        <div *ngIf="selected"><button (click)="deletePost()" class="ui right floated primary button">Delete</button></div>
                        <button  (click)="newPost(true)" class="ui right floated primary button">Add New Post</button>
                    </h1>
                </div>
            </div>
            <table class="ui striped selectable celled table">
                <thead>
                    <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Created at</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                    <div class="ui checkbox">
                        <input  #checkblog type="checkbox" value="chbxid1" (change)="selectPost(checkblog.checked,checkblog.value)"><label></label>
                    </div>               
                    </td>
                    <td>Approved</td>
                    <td>Requires call</td>
                    <td><a href (click)="editPost()">Edit</a>
                    </td>
                    </tr>
                </tbody>
            </table>
         </div>
        <div *ngIf="newPostPressed">
            <div class="ui container">
                <div class=" ui clearing segment">
                    <h1 class="ui header">Simple Blog - Edit
                        <button (click)="savePost(first)" class="ui right floated primary button">Save</button>
                        <button (click)="deletePost()" class="ui right floated primary button">Delete</button>
                        <button  (click)="resetPost()" class="ui right floated primary button">Reset</button>
                    </h1>
                </div>                
                <form #editForm="ngForm" class="ui form" >
                    <div ngControlGroup="name" #name="ngForm">
                             <label><h3>Title</h3></label><input ngControl="title" #first="ngForm">       
                    </div>
                </form>
                <h3>Description</h3>
                <CKEDITOR></CKEDITOR>
                {{editForm.value | json }} {{first.value}}
            </div>
        </div>
</div>

`
})
class SimpleBlogApp {
    selected: boolean = false;
    newPostPressed: boolean = false;
    posts: SimpleBlogPost[];

    constructor() {
        this.posts = [];
    }

    editPost() {
        console.log(`editPost pressed`);
        return false;
    }

    newPost(newPostPressed: boolean) {
        this.newPostPressed = newPostPressed;
        console.log(`newPost pressed value ${this.newPostPressed}`);
        return false;
    }

    deletePost() {
        console.log(`deletePost pressed`);
        return false;
    }

    selectPost(selected: boolean, value: string) {
        this.selected = selected;
        console.log(`selectPost ${this.selected}, Id ${value}`);
        return false;
    }

    resetPost() {
        console.log(`resetPost pressed`);
        return false;
    }

    savePost(title: HTMLInputElement) {
        var data = CKEDITOR.editor.getData();
        this.newPostPressed = false;
        this.posts.push(new SimpleBlogPost(title.value, data));
        this.posts.forEach((i)=> {
            console.log(`ID ${i.id} Title ${i.title}, Content ${i.content}, ${i.creationTime}`)
        });
        // console.log(`Data ${data}`);
        return false;
    }
}

bootstrap(SimpleBlogApp);