import Game from "../game/Game";



export default class Controller {

    private game: Game; 
    private keyToOpNames: Map<string, string[]>; 
    private opNameToOp: Map<string, Operation>; 
    private panelToOpNames: Map<string, string[]>; 
    private panelGetter: ()=> string; 
    
    constructor(panelGetter: ()=> string, operations: Operation[], keyMapping: Record<string, string[]>) {
        this.opNameToOp = new Map(); 
        this.keyToOpNames = new Map(); 
        this.panelToOpNames = new Map(); 

        this.registerOperations(operations); 
        this.panelGetter = panelGetter; 
        if (keyMapping !== undefined) {
            this.registerKeyMapping(keyMapping); 
        }
    }

    setControls() {
        document.addEventListener('keydown', e => {
            const opTriggeredByKey: string[] = this.keyToOpNames.get(e.key); 
            if (opTriggeredByKey === undefined) {
                return; 
            }
            const panel: string = this.panelGetter(); 
            const opsInPanel: string[] = this.panelToOpNames.get(panel); 
            if (opsInPanel === undefined) {
                return; 
            }
            const triggeredOps = opTriggeredByKey.filter(opName => opsInPanel.indexOf(opName) !== -1); 
            // Get intersection of the two arrays.
            for (const opName of triggeredOps) {
                const operation: Operation = this.opNameToOp.get(opName); 
                if (operation === undefined) {
                    continue; 
                }
                operation.exec(); 
            }
        }); 
    }

    private registerOperations(operations: Operation[]) {
        for (const operation of operations) {
            if (this.opNameToOp.get(operation.name) !== undefined) {
                console.warn(`Duplicated operation names: ${operation.name}`);
            }
            this.opNameToOp.set(operation.name, operation); 

            const opsInPanel = this.panelToOpNames.get(operation.panel); 
            if (opsInPanel === undefined) {
                this.panelToOpNames.set(operation.panel, [operation.name]); 
            }
            else if (opsInPanel.indexOf(operation.name) === -1) {
                opsInPanel.push(operation.name); 
            }
        }
        console.log(this.opNameToOp); 
        console.log(this.panelToOpNames); 
    }

    private registerKeyMapping(keyConfig: Record<string, string[]>) {
        for (const operation in keyConfig) {
            const keys: string[] = keyConfig[operation]; 
            for (const key of keys) {
                const opNames: string[] = this.keyToOpNames.get(key); 
                if (opNames === undefined) {
                    this.keyToOpNames.set(key, [operation]); 
                }
                else if (opNames.indexOf(operation) === -1) {
                    opNames.push(operation); 
                }
            }
        }
        console.log(this.keyToOpNames); 
    }
}

export interface Operation {
    name: string; 
    panel: string; 
    description?: string; 
    exec: () => void; 
}
