import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Router outlet for components -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Jaco Flight Search';
}
