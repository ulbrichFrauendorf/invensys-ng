import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IProgressSpinner } from './progress-spinner.component';

describe('IProgressSpinner', () => {
    let component: IProgressSpinner;
    let fixture: ComponentFixture<IProgressSpinner>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IProgressSpinner],
        }).compileComponents();

        fixture = TestBed.createComponent(IProgressSpinner);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default medium size', () => {
        expect(component.size).toBe('medium');
        expect(component.sizeClass).toBe('spinner-medium');
    });

    it('should apply small size class', () => {
        component.size = 'small';
        expect(component.sizeClass).toBe('spinner-small');
    });

    it('should apply large size class', () => {
        component.size = 'large';
        expect(component.sizeClass).toBe('spinner-large');
    });

    it('should have default stroke width of 4', () => {
        expect(component.strokeWidth).toBe(4);
    });

    it('should have default aria label', () => {
        expect(component.ariaLabel).toBe('Loading');
    });
});
