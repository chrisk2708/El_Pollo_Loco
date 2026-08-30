export class DrawableObject {
    rX; rY; rW; rH;
    x = 100;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2 ';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    drawCollideFrame(ctx) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            // console.log(this.rX, this.rY, this.rW, this.rH)
            ctx.rect(this.rX, this.rY, this.rW, this.rH);
            ctx.stroke();
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; //0,1,2,3,4,5,0,1,2,3...
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

}