

export default class LinkedNode<T> {
    cargo: T; 
    next: LinkedNode<T>; 
    constructor(cargo: T) {
        this.cargo = cargo; 
        this.next = null; 
    }
}