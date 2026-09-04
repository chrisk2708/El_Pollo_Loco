export class MyAudio {
    file;
    isLoaded = false;

    constructor(_file, loop = false){
        this.file = new Audio(_file);
        this.file.loop = loop;
    }
}