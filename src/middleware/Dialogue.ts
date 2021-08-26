export abstract class Dialogue {
    content: string; 
    constructor(content: string) {
        this.content = content; 
    }
}

export class Choice {
    prompt: string;
    callback: ()=>void; 
    constructor(prompt: string, callback: ()=>void) {
        this.prompt = prompt;
        this.callback = callback; 
    }
}

export class MultipleChoice extends Dialogue {
    // Contains a prompt message and several choices. 
    // A callback will be fired after a choice has been chosen. 
    choices: Array<Choice>; 
    static maxChoices: number = 3; 
    constructor(content: string) {
        super(content); 
        this.choices = new Array(); 
    }
    
    addChoice(choice: Choice) {
        if (this.choices.length >= MultipleChoice.maxChoices) {
            return; 
        }
        this.choices.push(choice); 
    }

    choose(indx: number) {
        if (indx < 0 || indx >= this.choices.length) {
            return; 
        }
        this.choices[indx].callback(); 
    }
}

export class Alert extends Dialogue {
    // Simply contains a prompt message
}