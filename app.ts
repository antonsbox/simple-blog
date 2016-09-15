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
        CKEDITOR.editor = window['CKEDITOR']['replace'](targetId);
    }


}

@Component({
    selector: 'simple-blog-edit',
    template: `
`
})
class SimpleBlogEdit {

}


@Component({
    selector: 'simple-blog',
    directives: [SimpleBlogEdit, FORM_DIRECTIVES, CKEDITOR],
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
                        <button (click)="savePost()" class="ui right floated primary button">Save</button>
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
                {{editForm.value | json }}
            </div>
        </div>
</div>

`
})
class SimpleBlog {
    selected: boolean = false;
    newPostPressed: boolean = false;
    ckeditorContent: string;

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

    savePost() {
        var data = CKEDITOR.editor.getData();
        console.log(`Data ${data}`);
        return false;
    }
}

bootstrap(SimpleBlog);