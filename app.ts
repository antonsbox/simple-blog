import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component} from"@angular/core";

@Component({
    selector:'simple-blog-edit',
    template:`
`
    })
class SimpleBlogEdit {

}


@Component({
    selector: 'simple-blog',
    directives:[SimpleBlogEdit],
    template: `
<div class="ui raised text container segment">
   <div class="ui container">
    <div class=" ui clearing segment">
      <h1 class="ui header">Simple Blog
        <button class="ui right floated primary button">Delete</button>
        <button class="ui right floated primary button">Add New Post</button>
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
                    <input type="checkbox" name="example"><label></label>
                </div>
      </td>
      <td>Approved</td>
      <td>Requires call</td>
      <td><a href="URL">Edit</a></td>
    </tr>
  </tbody>
</table>
</div>

`
})
class SimpleBlog {

}

bootstrap(SimpleBlog);