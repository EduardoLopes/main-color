# Main Color
Kinda searches for the main color in a image!

## How it works

You can find the main color in a image using a color quantization algorithm to reduces the number of distinct colors in an image, then you can count how much times a color is repeated and detect the main color! This process takes more then one step, this can take some time!

What this lib does is find the main color as fast as possible to have a result in real time, but is not too accurate as using the color quantization method, so i'm calling Lazy Quantization!

To search the main color in a image size like 1600 X 1200, you need 1.920.000 iterations to check every single pixel of the image (depending on the algorithm)! With Lazy Quantization only needs 2500 iterations (because it's lazy), depending on the configuration! But as i said, it's not too accurated and it can show some odd results!

## Usage

```js

var options = {accuracy: 25}; //default accuracy

//Instantiate MainColor
var mainColor = new MainColor(options);

/**
Every time you call this method, it'll start to look for the main color!
You can pass to this method an url to the image (an string, including base64) or an image element!
*/
mainColor.setImage('img/example.png');

//this function is called what it starts to search the color!
mainColor.onSearchStart = function(){

};

//this function is called when the color is found!
//The parameter 'color' is a rgba color!
mainColor.onFindColor = function(color){
  document.body.style.background = color;
}

```

###Options
-------

#### accuracy

Type: `number`  
Default: `25`  
Min: `1`  
Max: `50`  

The bigger the better (and slow) accuracy!
