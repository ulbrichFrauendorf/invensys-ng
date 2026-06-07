import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout.component';
import { AccordionsComponent } from './components/accordions/accordions.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { InputTextsComponent } from './components/input-texts/input-texts.component';
import { TextareasComponent } from './components/textareas/textareas.component';
import { CalendarsComponent } from './components/calendars/calendars.component';
import { CardsComponent } from './components/cards/cards.component';
import { DialogsComponent } from './components/dialogs/dialogs.component';
import { ConfirmationDialogsComponent } from './components/confirmation-dialogs/confirmation-dialogs.component';
import { TooltipsComponent } from './components/tooltips/tooltips.component';
import { MultiSelectsComponent } from './components/multi-selects/multi-selects.component';
import { SelectsComponent } from './components/selects/selects.component';
import { ChipsComponent } from './components/chips/chips.component';
import { TagsComponent } from './components/tags/tags.component';
import { ListboxesComponent } from './components/listboxes/listboxes.component';
import { MessagesComponent } from './components/messages/messages.component';
import { WhispersComponent } from './components/whispers/whispers.component';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { RadioButtonsComponent } from './components/radio-buttons/radio-buttons.component';
import { TreeViewsComponent } from './components/tree-views/tree-views.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { InstallationComponent } from './components/installation/installation.component';
import { ThemingComponent } from './components/theming/theming.component';
import { TablesComponent } from './components/tables/tables.component';
import { PanelsComponent } from './components/panels/panels.component';
import { PlaceholdersComponent } from './components/placeholders/placeholders.component';
import { ChartsComponent } from './components/charts/charts.component';
import { ComponentInteractionsComponent } from './components/component-interactions/component-interactions.component';
import { LayoutsComponent } from './components/layouts/layouts.component';
import { OverlayPanelsComponent } from './components/overlay-panels/overlay-panels.component';
import { ProgressSpinnersComponent } from './components/progress-spinners/progress-spinners.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { TogglesComponent } from './components/toggles/toggles.component';
import { DividersComponent } from './components/dividers/dividers.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'getting-started/installation',
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'getting-started',
        children: [
          { path: 'installation', component: InstallationComponent },
          { path: 'theming', component: ThemingComponent },
          { path: '', redirectTo: 'installation', pathMatch: 'full' },
        ],
      },
      {
        path: 'components',
        children: [
          { path: 'accordions', component: AccordionsComponent },
          { path: 'buttons', component: ButtonsComponent },
          { path: 'calendars', component: CalendarsComponent },
          { path: 'cards', component: CardsComponent },
          { path: 'charts', component: ChartsComponent },
          { path: 'checkboxes', component: CheckboxesComponent },
          { path: 'chips', component: ChipsComponent },
          { path: 'tags', component: TagsComponent },
          {
            path: 'confirmation-dialogs',
            component: ConfirmationDialogsComponent,
          },
          { path: 'dialogs', component: DialogsComponent },
          { path: 'dividers', component: DividersComponent },
          { path: 'input-texts', component: InputTextsComponent },
          { path: 'textareas', component: TextareasComponent },
          { path: 'layouts', component: LayoutsComponent },
          { path: 'listboxes', component: ListboxesComponent },
          { path: 'messages', component: MessagesComponent },
          { path: 'multi-selects', component: MultiSelectsComponent },
          { path: 'no-content', component: NoContentComponent },
          { path: 'overlay-panels', component: OverlayPanelsComponent },
          { path: 'panels', component: PanelsComponent },
          { path: 'placeholders', component: PlaceholdersComponent },
          { path: 'progress-spinners', component: ProgressSpinnersComponent },
          { path: 'radio-buttons', component: RadioButtonsComponent },
          { path: 'selects', component: SelectsComponent },
          { path: 'tables', component: TablesComponent },
          { path: 'tabs', component: TabsComponent },
          { path: 'tooltips', component: TooltipsComponent },
          { path: 'toggles', component: TogglesComponent },
          { path: 'tree-views', component: TreeViewsComponent },
          { path: 'whispers', component: WhispersComponent },
          {
            path: 'component-interactions',
            component: ComponentInteractionsComponent,
          },
          { path: '', redirectTo: 'installation', pathMatch: 'full' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'getting-started/installation' },
];