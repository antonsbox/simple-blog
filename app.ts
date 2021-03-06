import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component, Input, EventEmitter, Output, enableProdMode, ViewChild} from"@angular/core";
import  {FORM_DIRECTIVES} from  "@angular/common";
import {Http, Response, HTTP_PROVIDERS, Headers, RequestOptions} from '@angular/http';
enableProdMode();
class Message {
    id: number;
    checked: boolean;

    constructor(id: number, checked?: boolean) {
        this.id = id;
        this.checked = checked || false;
    }
}
@Component({
    selector: '[blog-tr]',
    template: `<td>
    <div class="ui checkbox">
        <input  #checkblog type="checkbox" value="{{row.post_id}}"
                (change)="selectPost(checkblog.value,checkblog.checked)">
        <label></label>
    </div>
</td>
<td>{{row.title}}</td>
<td>{{row.created}}</td>
<td><button #edit (click)="editPost(edit.value)" value="{{row.post_id}}" class="ui basic button">
        <i class="icon edit"></i>Edit</button>
</td>
          `
})
class PostRow {
    @Output() select: EventEmitter<Message> = new EventEmitter<Message>();
    @Output() edit: EventEmitter<Message> = new EventEmitter<Message>();
    @Input('blog-tr') row;


    selectPost(value: number, checked: boolean) {
        var msg = new Message(value, checked);
        this.select.emit(msg);
        return false;
    }

    editPost(id: number) {
        var msg = new Message((id));
        this.edit.emit(msg);
    }

}

@Component({
    selector: 'CKEDITOR',
    template: `
     <textarea  name="targetId" id="targetId" rows="rows" cols="cols">
     </textarea>
  `
})
class CKEDITOR {
    public static editor: any;
    @Input() targetId;
    @Input() rows = 10;
    @Input() cols;
    @Output() editorReady: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
        CKEDITOR.editor = window['CKEDITOR']['replace']('targetId');

    }

    ngAfterViewInit() {
        CKEDITOR.editor.setData('type text here...');
        this.editorReady.emit(true);
    }


}
class SimpleBlogPost {
    post_id: number;
    title: string;
    content: string;
    created: string;

    constructor(title: string, content: string, id?: number, creationTime?: string) {
        if (id)this.post_id = id;
        else this.post_id = this.getRandomInt(1, 10000);
        this.title = title;
        this.content = content;
        if (creationTime)this.created = creationTime;
        else this.created = this.formatDate(new Date());

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

        return YY + '-' + MM + '-' + DD + ' ' + HH + ':' + MN + ":" + SS;
    }


}

@Component({
    selector: 'simple-blog',
    directives: [FORM_DIRECTIVES, CKEDITOR, PostRow],
    template: `<div class="ui container segment">
    <div *ngIf="!newPostPressed">
        <div class="ui container">
            <div class=" ui clearing segment">
                <h1 class="ui header">Simple Blog
                    <div *ngIf="selected">
                        <button (click)="deletePost()" class="ui right floated primary button">Delete</button>
                    </div>
                    <button (click)="newPost(true)" class="ui right floated primary button">Add New Post</button>
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
            <tr (select)="onSelect($event)" (edit)="editPost($event)" *ngFor="let post of posts" [blog-tr]="post"></tr>
        </table>
         <div *ngIf="isError">
         <h1>An error has occurred.</h1>
         <p>{{errorText}}</p>
         <h3>If you see an 403 error, please do:</h3>
         Go to magento configuration interface. Go to menu node System->Web Services->
         REST->Roles-Role API Resources->Guest and mark everything in Simple Blog REST.
         Then go to node System->Web Services->REST->REST Attributes->Guest 
         and also mark everything in Simple Blog REST. And, after reload this page.        
         </div>
    </div>
    <div *ngIf="newPostPressed">
        <div class="ui container">
            <div class=" ui clearing segment">
                <h1 class="ui header">Simple Blog - Edit
                    <button (click)="savePost(title)" class="ui right floated primary button">Save</button>
                    <button (click)="deletePost()" class="ui right floated primary button">Delete</button>
                    <button (click)="resetPost()" class="ui right floated primary button">Reset</button>
                    <button (click)="backToList()" class="ui right floated primary button">Back</button>
                </h1>
            </div>
            <form #editForm="ngForm" class="ui form">
                <div ngControlGroup="name" #name="ngForm">
                    <label><h3>Title*</h3></label><input ngControl="title" [(ngModel)]="selectedTitle" type="text"
                                                         #title="ngForm">
                </div>
            </form>
            <h3>Description*</h3>
            <div *ngIf="valueRequire">
                <h3>Please, fill the required fields </h3>
                <p></p>
            </div>
            <CKEDITOR (editorReady)="editPostPress($event)"></CKEDITOR>
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
    selectedId: number = -1;
    selectedIndex: number = -1;
    selectedTitle: string = '';
    tmpTite: string = '';
    isEditPost: boolean = false;
    isNewPost: boolean = false;
    data: any;
    http: Http;
    createData: string = '{';
    response: any;
    delimiter: string = '';
    isError: boolean = false;
    errorText: string = '';

    constructor(http: Http) {
        this.http = http;
        this.posts = [];
    }


    readRequest(): void {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;

        this.http.get(location.origin+'/api/rest/simpleblog/posts/multi', opts).subscribe((res: Response) => {
            this.data = res.json();
            //console.log(this.data);
            // this.outParsed = this.data.split('');
            this.posts.splice(0, this.posts.length);
            JSON.parse(this.data).forEach(items=> {
                this.posts.push(new SimpleBlogPost(decodeURI(items[0].title), decodeURI(items[0].content), items[0].post_id, decodeURI(items[0].created)));
            });
        }, (err: any)=> {
            this.errorText = err.toString();
            this.isError = true;

        });

    }

    createRequest(data: SimpleBlogPost): void {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;
        this.http.post(location.origin+'/api/rest/simpleblog/posts/multi', decodeURI(JSON.stringify(data)), opts)
            .subscribe(res => {
                    // this.response = res.json();
                    this.posts.push(data);
                    this.readRequest();
                },
                (err: any)=> {
                    this.errorText = err.toString();
                    this.isError = true;

                }
            );
    }

    updateRequest(data: SimpleBlogPost) {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;
        this.http.put(location.origin+'/api/rest/simpleblog/read', decodeURI(JSON.stringify(data)), opts)
            .subscribe(res => {
                    // this.response = res.json();
                },
                (err: any)=> {
                    this.errorText = err.toString();
                    this.isError = true;

                }
            );
    }

    deleteRequest(id: number) {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;
        this.http.delete(location.origin+'/api/rest/simpleblog/' + id.toString(), opts)
            .subscribe(res => {
                    // this.response = res.json();
                    this.readRequest();
                },
                (err: any)=> {
                    this.errorText = err.toString();
                    this.isError = true;

                }
            );

    }

    ngOnInit() {
        this.readRequest();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.selectedTitle = this.tmpTite;
        }, 1);
    }

    public editPostPress(editorReady: boolean) {
        if (editorReady == true) {
            if (this.posts.some((i)=> {
                    if (this.selectedId == i.post_id) {
                        this.selectedIndex = this.posts.indexOf(i);
                        return true;
                    } else {
                        return false;
                    }
                })) {
                if (this.selectedIndex > -1) {
                    CKEDITOR.editor.setData(decodeURI(this.posts[this.selectedIndex].content));
                    this.tmpTite = decodeURI(this.posts[this.selectedIndex].title);
                    setTimeout(() => {
                        this.selectedTitle = this.tmpTite;
                    }, 1);
                }
            }
        }
    }


    editPost(message: Message) {
        this.newPostPressed = true;
        this.isEditPost = true;
        this.selectedId = message.id;
        return false;
    }

    newPost(newPostPressed: boolean) {
        this.newPostPressed = newPostPressed;
        this.isNewPost = true;
        return false;
    }

    deletePost() {
        if (!this.isEditPost) {
            if (!this.isNewPost) {
            } else {
                this.backToList();
            }
            var index: number;

            this.selectedPosts.forEach((sp)=> {
                // console.log(sp);
                if (sp.checked == true) {
                    this.posts.forEach((p)=> {
                        if (sp.id == p.post_id) {
                            index = this.posts.indexOf(p);
                            this.posts.splice(index, index);
                            if (index == 0) this.posts.splice(index, 1);
                            // console.log('todelete ' + p.post_id);
                            this.deleteRequest(p.post_id);
                        }
                    });
                }
            });
            this.selectedPosts.splice(0, this.selectedPosts.length);
            // this.posts.forEach(function (p) {
            // });
        } else {
            this.deleteRequest(this.posts[this.selectedIndex].post_id);
            this.posts.splice(this.selectedIndex, 1);
            this.valueRequire = false;
            this.newPostPressed = false;
            this.selectedIndex = -1;
            this.selectedTitle = '';
            this.isEditPost = false;

        }
        return false;
    }

    selectPost(selected: boolean, value: string) {
        this.selected = selected;
        return false;
    }

    resetPost() {
        if (this.isEditPost) {
            this.editPostPress(true);
        } else {
            CKEDITOR.editor.setData('type text here..');
            this.selectedTitle = '';
        }
        return false;
    }


    onSelect(message: Message): void {
        var isNotExist: boolean = true;
        if (this.selectedPosts.length == 0) {
            this.selectedPosts.push(message);
        }
        else {
            isNotExist = this.selectedPosts.some((i)=> {
                if (message.id == i.id) {
                    i.checked = message.checked;
                    return true;
                } else {
                    return false;
                }
            });

            if (!isNotExist) {
                this.selectedPosts.push(message);
                isNotExist = true;
            }
        }
        this.selectedPosts.forEach(function (i) {
        });
        this.selected = this.selectedPosts.some((i)=> {
            if (i.checked == true)
                return true;
            else
                return false;
        });
    }

    savePost(title: HTMLInputElement) {
        if (!this.isEditPost) {
            var data = CKEDITOR.editor.getData();
            if ((data.length > 0) && !(title.value == null)) {
                this.valueRequire = false;
                this.newPostPressed = false;
                this.selectedIndex = -1;
                this.isNewPost = false;
                var post: SimpleBlogPost = new SimpleBlogPost(title.value, data);
                // this.posts.push(new SimpleBlogPost(title.value, data));
                this.createRequest(post);
                // this.posts.splice(0, this.posts.length);

            } else {
                this.valueRequire = true;
            }
        } else {
            var data = CKEDITOR.editor.getData();
            if ((data.length > 0) && !(title.value == null)) {
                this.posts[this.selectedIndex].title = title.value;
                this.posts[this.selectedIndex].content = data;
                this.updateRequest(this.posts[this.selectedIndex]);
                this.valueRequire = false;
                this.newPostPressed = false;
                this.selectedIndex = -1;
                this.selectedTitle = '';
                this.isEditPost = false;
            } else  this.valueRequire = true;
        }
        return false;
    }

    backToList() {
        this.valueRequire = false;
        this.newPostPressed = false;
        if (this.isEditPost) {
            this.valueRequire = false;
            this.newPostPressed = false;
            this.selectedIndex = -1;
            this.selectedTitle = '';
            this.isEditPost = false;
            this.isNewPost = false;
        }
    }

}

bootstrap(SimpleBlogApp, [HTTP_PROVIDERS]);