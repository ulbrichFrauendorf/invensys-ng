import { Component } from '@angular/core';
import { IDivider } from '@shared/components/divider/divider.component';
import { DemoPlaygroundComponent } from '../demo-playground/demo-playground.component';
import { DemoOptionDirective } from '../demo-playground/demo-option.directive';

@Component({
  selector: 'app-dividers',
  standalone: true,
  imports: [DemoPlaygroundComponent, DemoOptionDirective, IDivider],
  templateUrl: './dividers.component.html',
  styleUrl: './dividers.component.scss',
})
export class DividersComponent {
  codeExamples = {
    basic: `<i-divider />`,

    withContent: `<i-divider>Details</i-divider>
<i-divider align="start">Start</i-divider>
<i-divider align="center">Center</i-divider>
<i-divider align="end">End</i-divider>`,

    vertical: `<div class="vertical-example">
  <span>Left</span>
  <i-divider layout="vertical" />
  <span>Right</span>
</div>`,

    usage: `<section>
  <h3>Profile</h3>
  <p>Basic account information.</p>

  <i-divider>Permissions</i-divider>

  <p>Role and access settings.</p>
</section>`,
  };

}
