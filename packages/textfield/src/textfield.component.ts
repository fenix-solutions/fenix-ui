import {
    Component,
    Input,
    AfterViewInit,
    OnDestroy,
    Renderer2,
    ElementRef,
    ViewChild,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    forwardRef,
    Provider,
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from '@angular/forms';

import { MDCTextfieldFoundation } from '@material/textfield';

import { EventListenerMapService } from '../../common/event-listener-map.service';
import {
    IMDCTextfieldAdapter,
    IMDCTextfieldFoundation
} from './textfield.domain';

@Component({
    selector: 'mdc-textfield',
    templateUrl: './textfield.component.html',
    styleUrls: ['./textfield.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // Provider: Permite funcionalidad de ngModel. 
        // Se requiere implementar los métodos: writeValue, registerOnChange, registerOnTouched
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextfieldComponent),
            multi: true
        },
        EventListenerMapService
    ]
})
export class TextfieldComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

    @Input() label: string = '';
    @Input() validationMessage: string = '';

	/**
	 * Obtiene o establece el valor del campo de captura.
	 */
    @Input()
    get value(): string {
        return this._input.value;
    }
    set value(value: string) {
        if (value !== this.value) {
            this._input.value = value;
        }
    }

    private _disabled: boolean = false;
	/**
	 * Obtiene o establece si el control está deshabilitado.
	 */
    @Input()
    get disabled() {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = value !== false;
        this._foundation.setDisabled(value);
    }

    private _required: boolean = false;
	/**
	 * Obtiene o establece si el control es obligatorio
	 */
    @Input()
    get required() {
        return this._required;
    }
    set required(value: boolean) {
        this._required = value !== false;
    }

	/**
	 * Obtiene si el campo de captura del control está en un estado válido.
	 */
    private get _valid(): boolean {
        return (this.inputRef.nativeElement as HTMLInputElement).validity.valid;
    }

    @ViewChild('inputRoot') inputRootRef: ElementRef;
	/**
	 * Obtiene el elemento HTML nativo del contenedor del control.
	 */
    private get _inputRoot() {
        return this.inputRootRef.nativeElement;
    }

    @ViewChild('input') inputRef: ElementRef;
	/**
	 * Obtiene el elemento HTML nativo del campo de captura
	 */
    private get _input() {
        return this.inputRef.nativeElement;
    }

    @ViewChild('inputLabel') inputLabelRef: ElementRef;
	/**
	 * Obtiene el elemento HTML nativo de la etiqueta.
	 */
    private get _inputLabel() {
        return this.inputLabelRef.nativeElement;
    }

    @ViewChild('inputHelpText') inputHelpTextRef: ElementRef;
	/**
	 * Obtiene el elemento HTML nativo del texto de ayuda del control.
	 */
    private get _inputHelpText() {
        return this.inputHelpTextRef.nativeElement;
    }

	/**
	 * Clase adaptador para clase foundation.
	 */
    private _adapter: IMDCTextfieldAdapter;

	/**
	 * Clase con la lógica de mdc-textfield.
	 */
    private _foundation: IMDCTextfieldFoundation;

	/**
	 * Evento para indicarle a la vista un cambio de valor en el modelo.
	 */
    private _onChange = (value: any) => { };

	/**
	 * Evento para que el control ha obtenido el foco y posteriormente se le ha retirado.
	 */
    private _onTouched = () => { };

	/**
	 * Constructor de componente.
	 * @param _renderer 
	 * @param _root 
	 * @param _eventListenerMap 
	 */
    constructor(
        private _renderer: Renderer2,
        private _root: ElementRef,
        private _eventListenerMap: EventListenerMapService
    ) {

        // Adaptador para clase foundation de mdc-textfield.
        this._adapter = {
            addClass: (className: string) => {
                this._renderer.addClass(this._inputRoot, className);
            },
            removeClass: (className: string) => {
                this._renderer.removeClass(this._inputRoot, className);
            },
            addClassToLabel: (className: string) => {
                if (this.label && this.inputLabelRef) {
                    this._renderer.addClass(this._inputLabel, className);
                }
            },
            removeClassFromLabel: (className: string) => {
                if (this.label && this.inputLabelRef) {
                    this._renderer.removeClass(this._inputLabel, className);
                }
            },
            addClassToHelptext: (className: string) => {
                if (!this.inputHelpTextRef) {
                    return;
                }
                this._renderer.addClass(this._inputHelpText, className);
            },
            removeClassFromHelptext: (className: string) => {
                if (!this.inputHelpTextRef) {
                    return;
                }
                this._renderer.removeClass(this._inputHelpText, className);
            },
            registerInputFocusHandler: (handler: EventListener) => {
                this._eventListenerMap.listen(this._renderer, this._input, 'focus', handler);
            },
            deregisterInputFocusHandler: (handler: EventListener) => {
                this._eventListenerMap.unlisten('focus', handler);
            },
            registerInputBlurHandler: (handler: EventListener) => {
                this._eventListenerMap.listen(this._renderer, this._input, 'blur', handler);
            },
            deregisterInputBlurHandler: (handler: EventListener) => {
                this._eventListenerMap.unlisten('blur', handler);
            },
            registerInputInputHandler: (handler: EventListener) => {
                this._eventListenerMap.listen(this._renderer, this._input, 'input', handler);
            },
            deregisterInputInputHandler: (handler: EventListener) => {
                this._eventListenerMap.unlisten('input', handler);
            },
            registerInputKeydownHandler: (handler: EventListener) => {
                this._eventListenerMap.listen(this._renderer, this._input, 'keydown', handler);
            },
            deregisterInputKeydownHandler: (handler: EventListener) => {
                this._eventListenerMap.unlisten('keydown', handler);
            },
            setHelptextAttr: (name: string, value: string) => {
                if (!this.inputHelpTextRef) {
                    return;
                }
                this._renderer.setAttribute(this._inputHelpText, name, value);
            },
            removeHelptextAttr: (name: string) => {
                if (!this.inputHelpTextRef) {
                    return;
                }
                this._renderer.removeAttribute(this._inputHelpText, name);
            },
            helptextHasClass: (className: string) => {
                return this.inputHelpTextRef ? this._inputHelpText.classList.contains(className) : false;
            },
            getNativeInput: () => {
                return {
                    checkValidity: () => this._valid,
                    value: this.value,
                    disabled: this.disabled,
                    badInput: (this._input as HTMLInputElement).validity.badInput
                };
            }
        };

        // Clase foundation para implementar funcionalidad de mdc-textfield.
        this._foundation = new MDCTextfieldFoundation(this._adapter);
    }

    ngAfterViewInit() {
        this._foundation.init();
    }

    ngOnDestroy() {
        this._foundation.destroy();
    }

	/**
     * Evento de cambio de valor en campo input
     */
    onInput(evt: Event) {
        // Indica cambio de valor a funcionalidad ngModel.
        this._onChange((<any>evt.target).value);
    }

	/**
	 * Evento de foco fuera del input
	 */
    onBlur() {
        this._onTouched();
        this._setValid();
    }

	/*
	---------------------------------------------------------------------------------------
	Métodos para funcionalidad de ngModel. Métodos implementados de ControlValueAccessor
	---------------------------------------------------------------------------------------
	*/

    /**
     * TODO: ngModel
     */
    writeValue(value: string) {
        this.value = value == null ? '' : value;
        if (this.value.length > 0) {
            this._adapter.addClassToLabel('mdc-textfield__label--float-above');
            this._setValid();
        } else {
            this._adapter.removeClassFromLabel('mdc-textfield__label--float-above');
        }
        this._onChange(value);
    }

    /**
     * TODO: ngModel
     */
    registerOnChange(
        fn: (value: any) => any
    ): void {
        this._onChange = fn;
    }

    /**
     * TODO: ngModel
     */
    registerOnTouched(
        fn: () => any
    ): void {
        this._onTouched = fn;

    }

	/*
	---------------------------------------------------------------------------------------
	Métodos privados
	---------------------------------------------------------------------------------------
	*/

	/**
	 * Indica a la clase foundation que se apliquen las acciones o caracteristicas de input válido
	 */
    private _setValid() {
        this._foundation.setValid(this._valid);
    }
}