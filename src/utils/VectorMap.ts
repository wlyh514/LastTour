import Vector from "../mage-ascii-engine/Vector";
import LinkedNode from "./LinkedNode";

/**
 * A map object that supports vector as a key. 
 */
export default class VectorMap<T> {
    private hashmap: Map<number, Array<VectorValuePair<T>>>; 

    constructor() {
        this.hashmap = new Map(); 
    }
    
    set(vector: Vector, value: T) {
        const hashVal: number = this.hashFunc(vector); 
        const TList: Array<VectorValuePair<T>> = this.hashmap.get(hashVal); 
        const pair: VectorValuePair<T> = { vector: vector.clone(), value }; 
        if (TList === undefined) {
            this.hashmap.set(hashVal, [pair]); 
            return; 
        }

        for (const existingPair of TList) {
            if (existingPair.vector.equals(vector)) {
                existingPair.value = value; 
                return; 
            }
        }
        TList.push(pair); 

    }

    get(vector: Vector): T {
        const hashVal: number = this.hashFunc(vector); 
        const TList: Array<VectorValuePair<T>> = this.hashmap.get(hashVal); 
        if (TList === undefined) {
            return null; 
        }
        for (const existingPair of TList) {
            if (existingPair.vector.equals(vector)) {
                return existingPair.value; 
            }
        }
        return null; 
    }

    delete(vector: Vector) {
        const hashVal: number = this.hashFunc(vector); 
        const TList: Array<VectorValuePair<T>> = this.hashmap.get(hashVal); 
        if (TList === undefined) {
            return; 
        }
        for (let i = 0; i < TList.length; i++) {
            if (TList[i].vector.equals(vector)) {
                TList.splice(i, 1); 
                return; 
            }
        }
    }

    private hashFunc = (v: Vector): number => {
        return v.x + v.y * 1000; 
    }
}

interface VectorValuePair<T> {
    vector: Vector, 
    value: T
}