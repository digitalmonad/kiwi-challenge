/**
 * Author: Pavel Kocman
 * GitHub: https://github.com/digitalmonad/kiwi-challenge
 * License: MIT
 *
 * Just type "node kiwiChallenge.js" to run in terminal, no dependencies
 */

/**
 * What is the task?
 * You’ll start by converting the following string:
 * ------------------
 *   kiwi.com\u0000
 * ------------------
 * Into three colors which we will call E, M, O for their names.
 * Now solve the formula for color X:
 * ---------------------------------------------
 *   K = rotate(multiply(screen(E, M), O)) + X
 * ---------------------------------------------
 * Where
 * - K is the Kiwi.com brand color #00a991
 * - rotate() rotates Hue color by 120°
 * - multiply() and screen() are common color blending operations
 */

/**
 * kiwi.com\u0000 is the Null-terminated string => if "\u0000" stands for Null
 * => 6b 69 77 69 2e 63 6f 6d 00 in HEX
 *
 * If we split those 9 numbers to triplets, then:
 */
const K = hexToRgb("#00a991") // => Kiwi brand color

const E = hexToRgb("#6b6977") // => Ebony ?
const M = hexToRgb("#692e63") // => Magenta ?
const O = hexToRgb("#6f6d00") // => Olive ?

//Offhand convert the colors to RGB for future easier computation

/**
 * ------------------------
 *   The Formula
 * ------------------------
 *
 *   * Let’s start with modification of the abovementioned equation:
 * Given the fact that every function returns the same result for the same input,
 * we can consider function "rotate(multiply(screen(E, M), O))", for our purposes,
 * as a constant 'F'.
 *
 * Thus:
 *   K = F + X
 *   X = - F + K
 *   X = K - F
 */

const screen = genBlendFunc('screen');
const multiply = genBlendFunc('multiply');
const rotate120 = genRotateFunc(120);

const F = rotate120(multiply(screen(E, M), O))
const X = substractColors(K, F)

console.log(rgbToHex(X)) // Returns #00625a




// Below are less abstract functions used for computation

/**
 * ------------------------
 *   Conversion functions
 * ------------------------
 */

/**
 * Converts RGB color object into hexadecimal notation
 * @param  {Object} rgbColor  - Object containing r,g,b values
 * @return {String} hex color - Hex color string from 000000 to ffffff
 */
 function rgbToHex({ r, g, b }){

   hexRed = hexPadd(r.toString(16));
   hexGreen = hexPadd(g.toString(16));
   hexBlue = hexPadd(b.toString(16));

   return "#" + hexRed + hexGreen + hexBlue;

 }

 /**
  * Takes a hexadecimal string chanenel value and returns the same value
  * padded with 0 if the string is just one letter
  * @param {String} hexChannel  - Hex color channel string
  * @return {String} hexChannel - Hex color channel string
  */
 function hexPadd (hexChannel){

   return hexChannel.length == 2 ? hexChannel : "0".concat(hexChannel)

 }

/**
 * Converts color in hexadecimal notation to RGB color object
 * @param  {String} hexCode    - Hex color string
 * @return {Object} rgbColor   - Object containing r,g,b values
 */
function hexToRgb(hexCode) {

   const hexArr = hexCode.match(/[a-fA-F0-9]{2}/g)
   return {
     r: parseInt(hexArr[0],16),
     g: parseInt(hexArr[1],16),
     b: parseInt(hexArr[2],16)
   }
 }

/**
 * Converts RGB color object to HSL color object
 * @param  {Object} rgbColor - Object containing r,g,b values
 * @return {Object} hslColor - Object containing h,s,l values
 */
function rgbToHsl({r, g, b}) {
      r /= 255, g /= 255, b /= 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0;
      } else {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d ; break;
              case g: h = 2 + ( (b - r) / d); break;
              case b: h = 4 + ( (r - g) / d); break;
          }
          h*=60;
          if (h < 0) h +=360;
          s*=100;
          l*=100;
      }
     return {
       h: Math.round(h),
       s: Math.round(s),
       l: Math.round(l)
     };
  }


/**
 * Converts HSL color object to RGB color object
 * @param  {Object} hslColor   - Object containing h,s,l values
 * @return {Object} rgbColor - Object containing r,g,b values
 */
function hslToRgb({h,s,l}){
   hue = h
   saturation = s/100
   lightness = l/100

   if( hue == undefined ){
     return [0, 0, 0];
   }

   let chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
   let huePrime = hue / 60;
   let secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

   huePrime = Math.floor(huePrime);
   let red;
   let green;
   let blue;

   if ( huePrime === 0 ){
     red = chroma;
     green = secondComponent;
     blue = 0;
   } else if ( huePrime === 1 ){
     red = secondComponent;
     green = chroma;
     blue = 0;
   } else if ( huePrime === 2 ){
     red = 0;
     green = chroma;
     blue = secondComponent;
   } else if ( huePrime === 3 ){
     red = 0;
     green = secondComponent;
     blue = chroma;
   } else if ( huePrime === 4 ){
     red = secondComponent;
     green = 0;
     blue = chroma;
   } else if ( huePrime === 5 ){
     red = chroma;
     green = 0;
     blue = secondComponent;
   }

   let lightnessAdjustment = lightness - (chroma / 2);
   red += lightnessAdjustment;
   green += lightnessAdjustment;
   blue += lightnessAdjustment;

   return {
     r: Math.round(red * 255),
     g: Math.round(green * 255),
     b: Math.round(blue * 255)
   }

}

/**
* Takes HSL color object and degree value and transforms the Hue value.
* @param  {Object} hslObject - Object containing h,s,l values
* @param  {Int} deg          - degree value from 0 to 360
* @return {Object} hslObject - Object containing h,s,l values
*/
function rotate({ h,s,l }, deg){

  h = (h + deg) % 360;
  h = h < 0 ? 360 + h : h;

  return {
    h: h,
    s: s,
    l: l
  }

}


/**
 * Substracts colorB from colorA
 * @param  {Object} colorA - Object containing r,g,b values
 * @param  {Object} colorB - Object containing r,g,b values
 * @return {Object} color  - Object containing r,g,b values
 */
function substractColors(colorA, colorB){
  return (typeof colorA !== 'object' || typeof colorA !== 'object'
  ? 'Error: Input is not proper object.'
  : {
    r: colorA.r - colorB.r,
    g: colorA.g - colorB.g,
    b: colorA.b - colorB.b
  })
}

/**
 * ------------------------
 *   Generate functions
 * ------------------------
 */
/**
 * Generates blending function based on given string
 * @param  {String} mode - 'screen' or 'multiply'
 * @return {Function}
 */
 function genBlendFunc(mode) {
   /**
    * Takes two RGB Color objects and applies blending functions
    * based on string given in closure
    * @param  {Object} rgbObject - Object containing r,g,b values
    * @param  {Object} rgbObject - Object containing r,g,b values
    * @return {Object} rgbObject - Object containing r,g,b values
    */
   return function(backdrop, source){
     return blend(backdrop, source, mode)
   }
 }

 /**
  * Generates HSL rotate function based on given degree
  * @param  {Int} deg - number between 0 to 360
  * @return {Function}
  */
 function genRotateFunc(deg){
 /**
  * Takes RGB color object transforms its value to HSL,
  * transforms it based on degree given in its closure
  * and returns transforms it again to RGB color object
  * @param  {Object} color - Object containing r,g,b values
  * @return {Object} color - Object containing r,g,b values
  */
   return function(color){
     return hslToRgb(rotate(rgbToHsl(color), deg))
   }
 }

/**
 * ------------------------
 *   Restriction functions
 * ------------------------
 */

function restrictNumber (value, from, to) {
  return Math.min(Math.max(value, from), to)
}

function restrictColor(color) {
  return {
    r: restrictNumber(color.r, 0, 255),
    g: restrictNumber(color.g, 0, 255),
    b: restrictNumber(color.b, 0, 255)
  }
}

/**
 * ------------------------
 *   Blending functions
 * ------------------------
 */

/**
 * Takes two RGB color objects plus string which
 * determines what blendings mode will apply on them
 * @param  {Object} color - Object containing r,g,b values
 * @param  {Object} color - Object containing r,g,b values
 * @param  {String} mode  - string to determine blending mode
 * @return {Object} color - Object containing r,g,b values
 */
function blend (backdrop, source, mode) {
  backdrop = restrictColor(backdrop)
  source = restrictColor(source)

  blendingModes = {
    'screen': function (backdrop, source) {
      return backdrop + source - (backdrop * source)
    },
    'multiply': function (backdrop, source) {
      return backdrop * source
    }
  }
  return {
    r: Math.round(blendingModes[mode](backdrop.r / 255, source.r / 255) * 255),
    g: Math.round(blendingModes[mode](backdrop.g / 255, source.g / 255) * 255),
    b: Math.round(blendingModes[mode](backdrop.b / 255, source.b / 255) * 255)
  }

}
