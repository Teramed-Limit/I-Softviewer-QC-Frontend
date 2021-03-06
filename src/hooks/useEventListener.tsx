import { RefObject, useCallback, useEffect, useRef } from 'react';

interface UseEventListener {
    type: keyof WindowEventMap;
    listener: EventListener;
    element?: RefObject<Element> | Document | Window | null;
    options?: AddEventListenerOptions;
}

export const getRefElement = <T,>(element?: RefObject<Element> | T): Element | T | undefined | null => {
    if (element && 'current' in element) {
        return element.current;
    }

    return element;
};

export const useEventListener = ({ type, listener, element = window, options }: UseEventListener): void => {
    const savedListener = useRef<EventListener>();

    useEffect(() => {
        savedListener.current = listener;
    }, [listener]);

    const handleEventListener = useCallback((event: Event) => {
        savedListener.current?.(event);
    }, []);

    useEffect(() => {
        const target = getRefElement(element);
        target?.addEventListener(type, handleEventListener, options);
        return () => target?.removeEventListener(type, handleEventListener);
    }, [type, element, options, handleEventListener]);
};
