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
    this.tiles = {
      size: 32,
      row: 0,
      col: 0,
      current: 0
    }

  }

  MainColor.prototype = {
    version: '0.0.1',
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
      this.setCanvasSize(this.img.width, this.img.height);
      this.ctx.drawImage(this.img, 0,0);
      this.imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
      this.onSearchStart();
      this.step();
    },
    onSearchStart: function(){

    },
    searchMainColor: function(){
      var max = 0, index, i;

      for(i = 0; i < this.colorsScore.length; i++){

        if(this.colorsScore[i] > max){
          max = this.colorsScore[i];
          index = i;
        }

      }

      if(typeof this.onFindColor == 'function'){
        this.onFindColor(this.colors[index]);
      }

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

        for(i = 0; i < this.tiles.col / 2; i++){

          x = (this.tiles.current - y * this.tiles.col);

          for(h = 0; h < 4; h++){
            for(w = 0; w < 4; w++){
              color = this.getPixel(((x * this.tiles.size) - (this.tiles.size / 2))+w, ((y * this.tiles.size) - (this.tiles.size / 2))+h);
              index = this.colors.indexOf(color);

              if(color){
                if(index == -1){
                  this.colors.push(color);
                  this.colorsScore.push(1);
                } else {
                  this.colorsScore[index] += 1;
                }

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
