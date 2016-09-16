import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component, Input, EventEmitter, Output} from"@angular/core";
import  {FORM_DIRECTIVES} from  "@angular/common";


class Message {
    id: number;
    checked: boolean;

    constructor(id: number, checked: boolean) {
        this.id = id;
        this.checked = checked;
    }
}
@Component({
    selector: '[myTr]',
    template: `
                   <td>
                    <div class="ui checkbox">
                        <input  #checkblog type="checkbox" value="{{row.id}}" 
                            (change)="selectPost(checkblog.value,checkblog.checked)">
                            <label></label>
                    </div>               
                   </td>
                   <td>{{row.title}}</td>
                   <td>{{row.creationTime}}</td>
                   <td><a href (click)="editPost()">Edit</a>
                   </td>
                    
`
})
class PostRow {
    @Output() select: EventEmitter<Message> = new EventEmitter<Message>();
    @Input('myTr') row;


    selectPost(value: number, checked: boolean) {
        var msg = new Message(value, checked);
        this.select.emit(msg);
        // this.takenPosts.forEach((tp)=> { //TODO
        //     console.log(`POSTS TO DELETE ${tp}`)
        // })

        // console.log(`selectPost ${this.selected}, Id ${value}`);
        return false;
    }

}

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
    creationTime: string;

    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
        this.id = this.getRandomInt(1, 10000); //TODO need getLastId from array
        this.creationTime = this.formatDate(new Date());
    }

    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    formatDate(date: Date) {

        var dd: number = date.getDate();
        var DD: string = date.getDate().toString();
        if (dd < 10) DD = '0' + dd;

        var mm: number = date.getMonth() + 1;
        var MM: string = date.getMonth().toString();
        if (mm < 10) MM = '0' + mm;

        var yy: number = date.getFullYear() % 100;
        var YY: string = date.getFullYear().toString();
        if (yy < 10) YY = '0' + yy;

        var hh: number = date.getHours();
        var HH: string = date.getHours().toString();
        if (hh < 10) HH = '0' + hh;

        var mn: number = date.getMinutes();
        var MN: string = date.getMinutes().toString();
        if (mn < 10) MN = '0' + mn;

        var ss: number = date.getSeconds();
        var SS: string = date.getSeconds().toString();
        if (ss < 10) SS = '0' + ss;

        var ms: number = date.getMilliseconds();
        var MS: string = date.getMilliseconds().toString();
        if (ms < 10) MS = '0' + ms;

        return DD + '.' + MM + '.' + YY + '-' + HH + '.' + MN + "." + SS + '.' + MS;
    }


}


@Component({
    selector: 'simple-blog',
    directives: [FORM_DIRECTIVES, CKEDITOR, PostRow],
    template: `
    <div class="ui container segment">
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
                     <tr (select)="onSelect($event)" *ngFor="let post of posts" [myTr]="post" ></tr>
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
                             <label><h3>Title*</h3></label><input ngControl="title" #first="ngForm">       
                    </div>
                </form>
                <h3>Description*</h3>
                <div *ngIf="valueRequire">
                     <h3>Please, fill the required fields </h3> 
                     <p></p>
                 </div>
                <CKEDITOR></CKEDITOR>
                {{editForm.value | json }} {{first.value}} //TODO 
                
                 
            </div>
        </div>

</div>

`
})
class SimpleBlogApp {
    selected: boolean = false;
    newPostPressed: boolean = false;
    posts: SimpleBlogPost[];
    valueRequire: boolean = false;
    selectedPosts: Message[] = [];

    constructor() {
        this.posts = [];
    }

    ngOnInit() {
        this.posts.push(new SimpleBlogPost('test', 'test data'));
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
        this.selectedPosts.forEach((sp)=> {
            console.log(`POSTS TO DELETE ${sp.id} ${sp.checked}`)
            console.log(`INDEX ${this.selectedPosts.indexOf(sp)}`);
        })
        this.selectedPosts.splice(0,this.selectedPosts.length);

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

    onSelect(message: Message): void {
        this.selected = message.checked;
        this.selectedPosts.push(message);
    }

    savePost(title: HTMLInputElement) {
        var data = CKEDITOR.editor.getData();
        if ((data.length > 0) && !(title.value == null)) {
            this.valueRequire = false;
            this.newPostPressed = false;
            console.log(`${title.value}`);

            this.posts.push(new SimpleBlogPost(title.value, data));
            this.posts.forEach((i)=> {
                console.log(`ID ${i.id} Title ${i.title}, Content ${i.content}, ${i.creationTime}`)
            });
        } else {
            this.valueRequire = true;
        }
        return false;
    }

}

bootstrap(SimpleBlogApp);