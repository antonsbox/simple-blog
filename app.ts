import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component} from"@angular/core";
import  {FORM_DIRECTIVES} from  "@angular/common";

@Component({
    selector: 'simple-blog-edit',
    template: `
`
})
class SimpleBlogEdit {

}


@Component({
    selector: 'simple-blog',
    directives: [SimpleBlogEdit, FORM_DIRECTIVES],
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
       <td><div class="ui checkbox">
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
</div>

`
})
class SimpleBlog {
    selected: boolean = false;
    newPostPressed: boolean = false;

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
}

bootstrap(SimpleBlog);