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

    this.img.onload = this.onImageLoad.bind(this);
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
        this.setCanvasSize(image.width, image.height);
        this.ctx.drawImage(image, 0,0);
        this.imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
        this.step();
      }

      if(typeof image === 'string'){
        this.img.src = image;
      }

    },
    onImageLoad: function(event){
      this.setCanvasSize(this.img.width, this.img.height);
      this.ctx.drawImage(this.img, 0,0);
      this.imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
      this.step();
    },
    searchMainColor: function(){
      var max = 0, index;

      for(var i = 0; i < this.colorsScore.length; i++){

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
      if(x < 0 || y < 0) return false;
      var index = (x + y * this.imageData.width) * 4;
      var r = this.imageData.data[index+0];
      var g = this.imageData.data[index+1];
      var b = this.imageData.data[index+2];
      var a = this.imageData.data[index+3];

      return 'rgba('+r+','+g+','+b+','+a+')';
    },
    step: function(){
      if(this.tiles.current <= this.tiles.row * this.tiles.col){

        var y = this.tiles.current / this.tiles.col >> 0;

        for(var i = 0; i < this.tiles.col / 2; i++){

          var x = (this.tiles.current - y * this.tiles.col);

          for(var h = 0; h < 4; h++){
            for(var w = 0; w < 4; w++){
              var color = this.getPixel(((x * this.tiles.size) - (this.tiles.size / 2))+w, ((y * this.tiles.size) - (this.tiles.size / 2))+h);
              var index = this.colors.indexOf(color);

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