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
      size: 32,
      row: 0,
      col: 0,
      current: 0
    }

    this.img.onload = this.onImageLoad.bind(this);
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
      this.tiles.col = Math.floor(this.canvas.width / this.tiles.size);
      this.tiles.row = Math.floor(this.canvas.height / this.tiles.size);
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
      this.setCanvasSize(this.img.width * scale, this.img.width * scale);
      this.ctx.drawImage(this.img, 0,0, this.img.width * scale, this.img.width * scale);
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
      if(x < 0 || y < 0) return false;
      index = (x + y * this.imageData.width) * 4;
      r = this.imageData.data[index+0];
      g = this.imageData.data[index+1];
      b = this.imageData.data[index+2];
      a = this.imageData.data[index+3];

      return 'rgba('+r+','+g+','+b+','+a+')';
    },
    step: function(){
      var x, y, h, w, i, color, index;

      if(this.tiles.current <= this.tiles.row * this.tiles.col){

        y = this.tiles.current / this.tiles.col >> 0;

        for(i = 0; i < this.tiles.col; i++){

          x = (this.tiles.current - y * this.tiles.col);

          for(h = 0; h < 2; h++){
            for(w = 0; w < 2; w++){
              if(h + w == 0){

              }
              color = this.getPixel(((x * this.tiles.size) - (this.tiles.size / 2))+w * 8, ((y * this.tiles.size) - (this.tiles.size / 2))+h * 8);
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
                // this.ctx.fillRect(((x * this.tiles.size) - (this.tiles.size / 2))+w * 8, ((y * this.tiles.size) - (this.tiles.size / 2))+h * 8, 1, 1);

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
