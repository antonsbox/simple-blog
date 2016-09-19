import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component, Input, EventEmitter, Output, enableProdMode} from"@angular/core";
import  {FORM_DIRECTIVES} from  "@angular/common";
// enableProdMode();
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
        console.log('edit pressed');
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
    @Input() rows = 10;  //you can also give default values here
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
    firstRun: boolean = true;

    constructor() {
        this.posts = [];
    }

    ngOnInit() {
        var i: number;
        for (i = 0; i <= 3; i++) {
            this.posts.push(new SimpleBlogPost('test' + i.toString(), 'test data' + i.toString()));
        }
    }

    public  editPostPress(editorReady: boolean) {
        if (editorReady == true) {
            if (this.posts.some((i)=> {
                    if (this.selectedId == i.id) {
                        this.selectedIndex = this.posts.indexOf(i);
                        return true;
                    } else {
                        return false;
                    }
                })) {
                console.log(`true ${this.selectedIndex}`);
                if (this.selectedIndex > -1) {
                    CKEDITOR.editor.setData(this.posts[this.selectedIndex].content);
                    this.selectedTitle = this.posts[this.selectedIndex].title;
                }
            }

        }

        console.log(`editPostPress pressed ${editorReady}`);
    }


    editPost(message: Message) {
        this.newPostPressed = true;
        this.selectedId = message.id;
        console.log(`this.newPostPressed  ${this.newPostPressed } `);
        return false;
    }

    newPost(newPostPressed: boolean) {
        this.newPostPressed = newPostPressed;
        // if(!this.firstRun) CKEDITOR.editor.setData('Type text here...');
        // this.firstRun=false;
        return false;
    }

    deletePost() {
        var index: number;
        this.selectedPosts.forEach((sp)=> {
            console.log(`POSTS TO DELETE ${sp.id} ${sp.checked}`);
            console.log(`INDEX ${this.selectedPosts.indexOf(sp)}`);
            if (sp.checked == true) {
                console.log(`${sp.id}`);
                this.posts.forEach((p)=> {
                    if (sp.id == p.id) {
                        console.log(`${p.id}`);
                        index = this.posts.indexOf(p);
                        console.log(`${index}`);
                        this.posts.splice(index, index);
                        if (index == 0) this.posts.splice(index, 1);
                    }
                });
            }
        });
        this.selectedPosts.splice(0, this.selectedPosts.length);
        //
        // console.log(`deletePost pressed`);
        // this.selectedPosts.forEach(function (i) {
        //     console.log(`ID ${i.id} Title ${i.checked}`);
        // });

        this.posts.forEach(function (p) {
            console.log(`ID ${p.id} Title ${p.title}`);
        });
        console.log(`${this.posts.length}`);

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
        // this.selected = message.checked;
        var isNotExist: boolean = true;
        if (this.selectedPosts.length == 0) {
            // console.log('size 0 Push');
            this.selectedPosts.push(message);
        }
        else {
            isNotExist = this.selectedPosts.some((i)=> {
                if (message.id == i.id) {
                    // console.log(`true`);
                    // console.log(`ID MESS ${message.id}`);
                    // console.log(`id MESS ${i.id}`);
                    i.checked = message.checked;
                    return true;
                } else {
                    // console.log(`true`);
                    // console.log(`ID MESS ${message.id}`);
                    // console.log(`id MESS ${i.id}`);
                    return false;
                }
            });

            if (!isNotExist) {
                // console.log('isNewPush');
                this.selectedPosts.push(message);
                isNotExist = true;
            }
        }
        // console.log(`SIZE ${this.selectedPosts.length}`);
        this.selectedPosts.forEach(function (i) {
            // console.log(`ID ${i.id} Title ${i.checked}`);
        });
        this.selected = this.selectedPosts.some((i)=> {
            if (i.checked == true)
                return true;
            else
                return false;
        });
    }

    savePost(title: HTMLInputElement) {
        var data = CKEDITOR.editor.getData();
        if ((data.length > 0) && !(title.value == null)) {
            this.valueRequire = false;
            this.newPostPressed = false;
            this.selectedIndex = -1;
            this.selectedTitle = '';
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

    backToList() {
        this.valueRequire = false;
        this.newPostPressed = false;
    }

}

bootstrap(SimpleBlogApp);