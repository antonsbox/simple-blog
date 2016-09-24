import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component, Input, EventEmitter, Output, enableProdMode} from"@angular/core";
import  {FORM_DIRECTIVES} from  "@angular/common";
import {Http, Response, HTTP_PROVIDERS, Headers, RequestOptions} from '@angular/http';
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
    templateUrl: 'components/blog-tr.html'
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
    templateUrl: './components/simple-blog.html'
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
    outParsed: string[];
    createData: string = '{';
    response: any;
    delimiter: string = '';

    constructor(http: Http) {
        this.http = http;
        this.posts = [];
    }

    readRequest(): void {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;
        this.http.get('http://magento1.tst/api/rest/simpleblog/posts/multi', opts).subscribe((res: Response) => {
            this.data = res.json();
            // this.outParsed = this.data.split('');
            JSON.parse(this.data).forEach(items=> {
                this.posts.push(new SimpleBlogPost(decodeURI(items[0].title), decodeURI(items[0].content), items[0].post_id, decodeURI(items[0].created)));
            });
        });

    }

    createRequest(data: SimpleBlogPost): void {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;
        this.http.post('http://magento1.tst/api/rest/simpleblog/posts/multi', decodeURI(JSON.stringify(data)), opts)
            .subscribe(res => {
                // this.response = res.json();
            });
    }

    updateRequest(data: SimpleBlogPost) {
        let headers: Headers = new Headers();
        headers.append('accept', 'application/json');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;
        this.http.put('http://magento1.tst/api/rest/simpleblog/read', decodeURI(JSON.stringify(data)), opts)
            .subscribe(res => {
                // this.response = res.json();
            });
        // console.log(JSON.stringify(data))
    }

    deleteRequest() {

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
                if (sp.checked == true) {
                    this.posts.forEach((p)=> {
                        if (sp.id == p.post_id) {
                            index = this.posts.indexOf(p);
                            this.posts.splice(index, index);
                            if (index == 0) this.posts.splice(index, 1);
                        }
                    });
                }
            });
            this.selectedPosts.splice(0, this.selectedPosts.length);
            this.posts.forEach(function (p) {
            });
        } else {
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
                this.posts.push(new SimpleBlogPost(title.value, data));
                this.createRequest(this.posts[this.posts.length - 1]);
            } else {
                this.valueRequire = true;
            }
        } else {
            var data = CKEDITOR.editor.getData();
            if ((data.length > 0) && !(title.value == null)) {
                this.posts[this.selectedIndex].title = title.value;
                this.posts[this.selectedIndex].content = data;
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