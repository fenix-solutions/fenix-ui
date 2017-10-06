import {
    Injectable,
    Renderer2
} from '@angular/core';

@Injectable()
export class EventListenerMapService {

    constructor() { }

    private _listenersMap = new Map<string, WeakMap<EventListener, Function>>();

    /**
     * Agrega un escuchador a la colección de escuchadores de eventos. Para posteriormente permitir eliminar a éste evento
     * @param renderer Interprete o procesador
     * @param target Elemento DOM destino del evento
     * @param type Tipo de evento...focus, change
     * @param listener Escuchador de evento
     */
    listen(
        renderer: Renderer2,
        target: any,
        type: string,
        listener: EventListener
    ) {

        // Agrega el evento a la colección de escuchadores siempre y cuando no exista.
        // Se agrega vacío (sin listener ni unlistener).
        if (!this._listenersMap.has(type)) {
            this._listenersMap.set(type, new WeakMap<EventListener, Function>());
        }

        // Listener o escuchador de eventos.
        const unlistener = renderer.listen(target, type, listener);

        // Asigna los eventos listener y unlistener a la colección de escuchadores.
        this._listenersMap
            .get(type)
            .set(listener, unlistener);
    }

    /**
     * Elimina un escuchador de la colección de escuchadores
     * @param type Tipo de evento...focus, change
     * @param listener Escuchador a eliminar o dejar de escuchar
     */
    unlisten(
        type: string,
        listener: EventListener
    ) {

        // Verifica que el tipo de evento exista en la colección.
        if (!this._listenersMap.has(type)) {
            return;
        }

        // Obtiene los escuchadores que correspondan al tipo indicado.
        const listeners = this._listenersMap.get(type);
        if (!listeners.has(listener)) {
            return;
        }

        // Elimina de los escuchadores obtenidos, el escuchador específico enviado.
        listeners.get(listener)();
        listeners.delete(listener);
    }
}