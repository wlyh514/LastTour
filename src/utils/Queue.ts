import LinkedNode from "./LinkedNode";

export default class Queue<T> {
    private head: LinkedNode<T>; 
    private tail: LinkedNode<T>; 
    isEmpty: boolean; 

    constructor() {
        this.head = null; 
        this.tail = null; 
        this.isEmpty = true; 
    }

    enqueue(obj: T): void {
        const newNode: LinkedNode<T> = new LinkedNode(obj);
        if (this.head === null) {
            // obj is the first element
            this.head = newNode; 
            this.isEmpty = false; 
        }
        else {
            this.tail.next = newNode; 
        }
        this.tail = newNode; 
    }

    dequeue(): T {
        const head = this.head; 
        const next = head.next; 
        if (head !== null) {
            if (next === null) {
                this.isEmpty = true; 
                this.tail = null; 
            }
        }
        this.head = next; 
        return head.cargo; 
    }
}