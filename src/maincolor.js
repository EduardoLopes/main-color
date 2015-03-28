/**
* !@autor        Eduardo Lopes <EduardoLopesDS@gmail.com>
* !@copyright    2015 Eduardo Lopes
* !@license      {@link https://github.com/EduardoLopes/main-color/blob/master/LICENSE|MIT License}
*/

(function(global){

  'use strict';

  /**
  * Kinda searches for the main color in a image!
  * @constructor
  * @param {object} options - The options
  */
  function MainColor(options){
    var options = options || {};

    /**
    * @property {element} canvas - The canvas element where the image is draw and we check the pixels
    */
    this.canvas = document.createElement('canvas');

    /**
    * @property {object} ctx - Canvas context
    */
    this.ctx = this.canvas.getContext('2d');

    /**
    * @property {element} img - IMG element used to load and draw the image on the canvas
    */
    this.img = document.createElement('img');

    /**
    * @property {object} imageData - canvas image data
    */
    this.imageData = null;

    /**
    * The indexs of colors and colorsScores property are always the same.
    * Like, if this.colors[0] = 'rgba(255,255,255,1)' the score for this colors is
    * this.colorsScore[0]; The same index!
    */

    /**
    * @property {array} colors - The colors that the algorithm founds
    */
    this.colors = [];

    /**
    * @property {array} colorsScore - The scores of each colors (how much time a color is repeated)
    */
    this.colorsScore = [];

    /**
    * @property {number} rafID - requestiAnimationFrame ID
    */
    this.rafID = 0;

    /**
    * @property {number} mainColorScore - The score of the main color in run time
    */
    this.mainColorScore = 0;

    /**
    * @property {object} tiles - The tiles informations
    */
    this.tiles = {
      //size of the tile
      size: {
        //width size
        x: 0,
        //height size
        y: 0
      },
      //how many tiles for row
      row: 0,
      //how many tiles for columns
      col: 0,
      //The position of the tile that the algorithm is searching
      current: 0
    };

    this.setAccuracy(options.accuracy || 25);

    this.img.onload = this.onImageLoad.bind(this);
  }

  MainColor.prototype = {
    version: '0.0.9',

    /**
    * Set the size of the canvas
    *
    * @param {number} width - width of the canvas
    * @param {number} height - height of the canvas
    */
    setCanvasSize: function(width, height){
      this.canvas.width = width;
      this.canvas.height = height;
      this.updateTiles();
      this.resetStep();
    },

    /**
    * Set the accuracy of the algorithm;
    * Accuracy is based on the amount of tiles to check;
    * The minimun amout of tiles it can check is 1;
    * The maximun amout of tiles it can check is 50 by row and columns;
    *
    * @param {number} accuracy - set the amount of tiles per row and columns
    */
    setAccuracy: function(accuracy){
      this.tiles.row = Math.max(1, Math.min(accuracy, 50));
      this.tiles.col = Math.max(1, Math.min(accuracy, 50));
    },

    /**
    * Reset vars to start search a color in a new image
    */
    resetStep: function(){
      this.tiles.current = this.tiles.row * this.tiles.col;
      this.colors.length = 0;
      this.colorsScore.length = 0;
      this.mainColorScore = 0;
    },

    /**
    * Update tile size based on the size of the canvas
    */
    updateTiles: function(){
      this.tiles.size.x = Math.floor(this.canvas.width / this.tiles.col);
      this.tiles.size.y = Math.floor(this.canvas.height / this.tiles.row);
    },

    /**
    * Set the image to find a color
    *
    * @param {element} image - image element
    * @param {string} image - an url or base64 string
    */
    setImage: function(image){

      if(typeof image === 'object'){
        this.img.src = image.src;
      }

      if(typeof image === 'string'){
        this.img.src = image;
      }

    },

    /**
    * Callbacks when the image is loaded
    */
    onImageLoad: function(){
      var scale = 1;
      if(this.img.width > 600 || this.img.height > 800){
        scale = 0.5;
      }
      this.setCanvasSize(this.img.width * scale, this.img.height * scale);
      this.ctx.drawImage(this.img, 0,0, this.img.width * scale, this.img.height * scale);
      this.imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
      this.onSearchStart();
      this.step();
    },

    /**
    * Callbacks when starts to search an color
    */
    onSearchStart: false,

    /**
    * Callbacks when found a color
    * @param {string} color - rgba color
    */
    onFindColor: false,

    /**
    * Called at the end of the algorithm
    * @param {string} color - rgba color
    * @return {string} The color that was found
    */
    searchMainColor: function(){

      var index = this.colorsScore.indexOf(this.mainColorScore);
      this.onFindColor(this.colors[index]);

      return this.colors[index];
    },

    /**
    * Retorne the color of a pixel of the canvas
    * @param {number} x - x coordinate of the pixel
    * @param {number} y - y coordinate of the pixel
    */
    getPixel: function(x, y){
      var r, g, b, a, index;

      index = (x + y * this.imageData.width) * 4;
      r = this.imageData.data[index+0];
      g = this.imageData.data[index+1];
      b = this.imageData.data[index+2];
      a = this.imageData.data[index+3];

      if(r == null || g == null || b == null || a == null) return false;

      return 'rgba('+r+','+g+','+b+','+a+')';
    },

    /**
    * Called each frame of requesteAnimationFrame
    */
    step: function(){
      var x, //coordinate x of a tile
          y, //coordinate y of a tile
          //the algorithm checks 4 pixels per tile, h and w are use to loop throuh these pixels
          h,
          w,
          i, //used to loop through one columns per frame
          color, //color of a pixel
          index; //index of the color in the this.colors array

      //keep searching the there's still tiles to check
      if(this.tiles.current >= 0){

        y = this.tiles.current / this.tiles.col >> 0;

        //columns loop
        for(i = this.tiles.col; i >= 0; i--){

          x = (this.tiles.current - y * i);

          //debug
          // this.ctx.strokeStyle = 'rgba(24,24,24,0.02)';
          // this.ctx.rect(((x * this.tiles.size.x)), ((y * this.tiles.size.y)), this.tiles.size.x, this.tiles.size.y);
          // this.ctx.stroke();

          //loop on each tile (4 pixel per tile)
          for(h = 0; h < 2; h++){
            for(w = 0; w < 2; w++){

              color = this.getPixel(((x * this.tiles.size.x) + (this.tiles.size.x / 3))+w * (this.tiles.size.x / 2) >> 0, ((y * this.tiles.size.y) + (this.tiles.size.y / 3))+h * (this.tiles.size.y / 3) >> 0);
              index = this.colors.indexOf(color);

              if(color){
                if(index == -1){
                  this.colors[this.colors.length] = color;
                  this.colorsScore[this.colors.length] = 1;
                } else {
                  if(this.colorsScore[index] == null) this.colorsScore[index] = 0;
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

          //next tile to check, the algorithm starts form the bottrom left corner, so i'm decrement insted of increment
          this.tiles.current -= 1;
        }

      } else {
        //on the end of the search
        this.searchMainColor();
        cancelAnimationFrame(this.rafID);
        return false;
      }

      this.rafID = requestAnimationFrame(this.step.bind(this));
    }
  }

  window.MainColor = MainColor;

}(window))
