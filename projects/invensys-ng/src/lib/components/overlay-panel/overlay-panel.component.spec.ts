import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IOverlayPanel } from './overlay-panel.component';

describe('IOverlayPanel', () => {
    let component: IOverlayPanel;
    let fixture: ComponentFixture<IOverlayPanel>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IOverlayPanel],
        }).compileComponents();

        fixture = TestBed.createComponent(IOverlayPanel);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be hidden by default', () => {
        expect(component.visible).toBe(false);
    });

    it('should have default position as auto', () => {
        expect(component.position).toBe('auto');
    });

    it('should have dismissable as true by default', () => {
        expect(component.dismissable).toBe(true);
    });

    it('should have showCloseButton as false by default', () => {
        expect(component.showCloseButton).toBe(false);
    });

    it('should show panel when show() is called', () => {
        const mockEvent = new MouseEvent('click');
        spyOn(mockEvent, 'preventDefault');
        spyOn(mockEvent, 'stopPropagation');

        component.show(mockEvent);

        expect(component.visible).toBe(true);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should hide panel when hide() is called', () => {
        component.visible = true;
        component.hide();

        expect(component.visible).toBe(false);
    });

    it('should toggle panel visibility', () => {
        const mockEvent = new MouseEvent('click');
        spyOn(mockEvent, 'preventDefault');
        spyOn(mockEvent, 'stopPropagation');

        expect(component.visible).toBe(false);

        component.toggle(mockEvent);
        expect(component.visible).toBe(true);

        component.toggle(mockEvent);
        expect(component.visible).toBe(false);
    });

    it('should emit visibleChange when show is called', (done) => {
        const mockEvent = new MouseEvent('click');

        component.visibleChange.subscribe((visible: boolean) => {
            expect(visible).toBe(true);
            done();
        });

        component.show(mockEvent);
    });

    it('should emit visibleChange when hide is called', (done) => {
        component.visible = true;

        component.visibleChange.subscribe((visible: boolean) => {
            expect(visible).toBe(false);
            done();
        });

        component.hide();
    });

    it('should hide on escape key when dismissable', () => {
        component.visible = true;
        component.dismissable = true;

        const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        spyOn(mockEvent, 'preventDefault');

        component.onEscapeKey(mockEvent);

        expect(component.visible).toBe(false);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not hide on escape key when not dismissable', () => {
        component.visible = true;
        component.dismissable = false;

        const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        component.onEscapeKey(mockEvent);

        expect(component.visible).toBe(true);
    });
});
