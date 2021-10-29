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
