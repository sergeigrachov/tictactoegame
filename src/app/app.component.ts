import { Component, NgModule } from '@angular/core';
import { StorageServiceModule } from 'ngx-webstorage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@NgModule({
    imports: [ StorageServiceModule ]
})
export class AppComponent {
    title = 'tictactoe';
}
