export interface TagElement {
    tag: string;
    vr: string;
    vm: string;
    name: string;
}

export interface TagData {
    level: number;
    tag: string;
    tagName: string;
    tagValue: string;
    vr: string;
    vm: string;
    isPrivateTag: boolean;
    element: TagElement;
}

export interface DicomTagData {
    id: string;
    level: number;
    tag: string;
    group: number;
    element: number;
    name: string;
    vr: string;
    length: string;
    value: string;
    editable: boolean;
}
