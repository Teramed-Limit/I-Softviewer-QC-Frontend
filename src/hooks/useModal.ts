import { useImperativeHandle, useRef, useState } from 'react';

import { Observable, Subject } from 'rxjs';

export type BaseModalHandle = {
    openModal: () => Observable<boolean>;
};

export const useModal = (ref) => {
    const modalActionSubject$ = useRef(new Subject<boolean>()).current;
    const [modalOpen, setModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal() {
            setModalOpen(true);
            return modalActionSubject$.asObservable();
        },
    }));

    return { modalOpen, setModalOpen, modalActionSubject$ };
};
