import cornerstoneTools from 'cornerstone-tools';
import { debounceTime, Subject } from 'rxjs';

import { ViewportToolMouseMoveEvent } from '../../interface/cornerstone-viewport-event';
import { applyMixins } from '../../utils/general';
import { SocketSyncEventSender } from './utils/SocketSyncEventSender';

const WwwcTool = cornerstoneTools.WwwcTool;

export default class WwwcToolSyncTool extends WwwcTool implements SocketSyncEventSender {
    private roomId: string | undefined;

    private notifySyncSubject$: Subject<CustomEvent<ViewportToolMouseMoveEvent>>;

    constructor(props = {}) {
        const defaultProps = {};
        super(props, defaultProps);
        this.notifySyncSubject$ = new Subject();
        this.notifySyncSubject$
            .asObservable()
            .pipe(debounceTime(200))
            .subscribe((evt: CustomEvent<ViewportToolMouseMoveEvent>) => {
                this.sync('Wwwc', this.roomId, evt.detail.image.imageId, JSON.stringify(evt.detail.viewport.voi));
            });
    }

    validate() {
        const pathnameSplitAry = window.location.pathname.split('/');

        const roomPath = pathnameSplitAry[6];
        const roomId = pathnameSplitAry[7];

        if (roomPath !== 'roomId' || !roomId) {
            console.error('Room id not found, cannot sync viewport');
            return false;
        }

        this.roomId = roomId;
        return true;
    }

    mouseDragCallback(evt: CustomEvent<ViewportToolMouseMoveEvent>) {
        if (!this.validate()) return;
        super.mouseDragCallback(evt);
        this.notifySyncSubject$.next(evt);
    }

    sync(eventName, roomId, imageId, jsonValue): void {}

    //just provide the empty implementation which will be replaced by the mixins helper function
}

applyMixins(WwwcToolSyncTool, [SocketSyncEventSender]);
