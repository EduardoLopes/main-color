(function(global){

  'use strict';

  function MainColor(){

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.img = document.createElement('img');
    this.imageData = null;
    this.colors = [];
    this.colorsScore = [];
    this.rafID = 0;
    this.mainColorScore = 0;
    this.tiles = {
      size: {x: 0, y: 0},
      row: 0,
      col: 0,
      current: 0
    }

    //this.img.onload = this.onImageLoad.bind(this);
  }

  MainColor.prototype = {
    version: '0.0.4',
    setCanvasSize: function(width, height){
      this.canvas.width = width;
      this.canvas.height = height;
      this.resetStep();
      this.updateTiles();
    },
    resetStep: function(){
      this.tiles.current = 0;
      this.colors.length = 0;
      this.colorsScore.length = 0;
      this.mainColorScore = 0;
    },
    updateTiles: function(){
      this.tiles.col = 20;
      this.tiles.row = 20;
      this.tiles.size.x = Math.floor(this.canvas.width / 20);
      this.tiles.size.y = Math.floor(this.canvas.height / 20);
    },
    setImage: function(image){

      if(typeof image === 'object'){
        this.img.src = image.src;
        this.onImageLoad();
      }

      if(typeof image === 'string'){
        this.img.src = image;
      }

    },
    onImageLoad: function(){
      var scale = 1;
      if(this.img.width > 600 || this.img.height > 600){
        scale = 0.5;
      }
      this.setCanvasSize(this.img.width * scale, this.img.height * scale);
      this.ctx.drawImage(this.img, 0,0, this.img.width * scale, this.img.height * scale);
      this.imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
      this.onSearchStart();
      this.step();
    },
    onSearchStart: function(){},
    onFindColor: function(color){},
    searchMainColor: function(){

      var index = this.colorsScore.indexOf(this.mainColorScore);
      this.onFindColor(this.colors[index]);

    },
    getPixel: function(x, y){
      var r, g, b, a, index;

      index = (x + y * this.imageData.width) * 4;
      r = this.imageData.data[index+0];
      g = this.imageData.data[index+1];
      b = this.imageData.data[index+2];
      a = this.imageData.data[index+3];

      if(!r || !g || !b || !a) return false;

      return 'rgba('+r+','+g+','+b+','+a+')';
    },
    step: function(){
      var x, y, h, w, i, color, index;

      if(this.tiles.current < this.tiles.row * this.tiles.col){

        y = this.tiles.current / this.tiles.col >> 0;

        for(i = 0; i < this.tiles.col; i++){

          x = (this.tiles.current - y * this.tiles.col);

          //debug
          // this.ctx.strokeStyle = 'rgba(24,24,24,0.02)';
          // this.ctx.rect(((x * this.tiles.size.x)), ((y * this.tiles.size.y)), this.tiles.size.x, this.tiles.size.y);
          // this.ctx.stroke();

          for(h = 0; h < 2; h++){
            for(w = 0; w < 2; w++){

              color = this.getPixel(((x * this.tiles.size.x) + (this.tiles.size.x / 3))+w * (this.tiles.size.x / 2) >> 0, ((y * this.tiles.size.y) + (this.tiles.size.y / 3))+h * (this.tiles.size.y / 3) >> 0);
              index = this.colors.indexOf(color);

              if(color){
                if(index == -1){
                  this.colors[this.colors.length - 1] = color;
                  this.colorsScore[this.colors.length - 1] = 1;
                } else {
                  this.colorsScore[index] += 1;
                  this.mainColorScore = Math.max(this.mainColorScore, this.colorsScore[index])
                }
                //debug
                // this.ctx.fillStyle = 'rgba(24,24,24,0.8)';
                // this.ctx.fillRect(((x * this.tiles.size.x) + (this.tiles.size.x / 3))+w * (this.tiles.size.x / 3) >> 0, ((y * this.tiles.size.y) + + (this.tiles.size.y / 3))+h * (this.tiles.size.y / 3) >> 0, 1, 1);
                //console.log(x, ((x * this.tiles.size))+w * 1, ((y * this.tiles.size))+h * 1);
              }
            }
          }

          this.tiles.current += 1;
        }

      } else {
        this.searchMainColor();
        cancelAnimationFrame(this.rafID);
        return false;
      }

      this.rafID = requestAnimationFrame(this.step.bind(this));
    }
  }

  window.MainColor = MainColor;

}(window))
