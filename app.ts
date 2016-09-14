import  {bootstrap} from "@angular/platform-browser-dynamic";
import  {Component} from"@angular/core";

@Component({
    selector: 'simple-blog',
    template: `
<div class="ui raised text container segment">
   <div class="ui container">
    <div class=" ui clearing segment">
      <h1 class="ui header">Simple Blog
        <button class="ui right floated primary button">Some Action1</button>
        <button class="ui right floated primary button">Some Action2</button>
       </h1>
    </div>
  </div>
  <p></p>
</div>

`
})
class SimpleBlog {

}

bootstrap(SimpleBlog);