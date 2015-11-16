(function (root, factory) {
    'use strict';
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(function () {
            return factory();
        });
    } else if (typeof define === 'function' && define.cmd) {
        // CMD
        define(function (require, exports, module) {
            module.exports = factory();
        });
    } else {
        // Global Variables
        root.sim = factory();
    }
})(this, function () {
    'use strict';

    /**
     * 缩放图片,输出canvas
     */
    function resize2Canvas(img, width, height) {
        if (!img || !width) {
            return img;
        }
        height = height || width;
        // 按原图缩放
        var detImg = img.width / img.height;
        if (width / height > detImg) {
            height = width / detImg;
        } else {
            width = height * detImg;
        }
        // 画到 canvas 中
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        return canvas;
    }

    /**
     * 将canvas处理成灰度图
     */
    function grayscaleCanvas(canvas) {
        var canvasContext = canvas.getContext('2d');
        var cWidth = canvas.width;
        var cHeight = canvas.height;
        var canvasData = canvasContext.getImageData(0, 0, cWidth, cHeight);
        var canvasDataWidth = canvasData.width;

        for (var x = 0; x < cWidth; x++) {
            for (var y = 0; y < cHeight; y++) {

                // Index of the pixel in the array
                var idx = (x + y * canvasDataWidth) * 4;
                var r = canvasData.data[idx + 0];
                var g = canvasData.data[idx + 1];
                var b = canvasData.data[idx + 2];

                // calculate gray scale value
                var gray = Math.ceil((0.299 * r + 0.587 * g + 0.114 * b) / 4);


                // assign gray scale value
                canvasData.data[idx + 0] = gray; // Red channel
                canvasData.data[idx + 1] = gray; // Green channel
                canvasData.data[idx + 2] = gray; // Blue channel
                canvasData.data[idx + 3] = 255; // Alpha channel
            }
        }
        canvasContext.putImageData(canvasData, 0, 0);
        return canvasData;
    }

    /**
     * 将16进制的图片hash转化为二进制
     */
    function hashToBinaryArray(h) {
        return parseInt(h, 16).toString(2);
    }

    /**
     * 计算图片的hash值
     */
    function hash(img) {
        var size = 8;
        var resizedCanvas = resize2Canvas(img, size, size, false);
        var canvasData = grayscaleCanvas(resizedCanvas);
        var cW = canvasData.width,
            cH = canvasData.height;
        var totalGray = 0,
            x, y, idx, grayValue;
        for (x = 0; x < cW; x++) {
            for (y = 0; y < cH; y++) {
                // Index of the pixel in the array
                idx = (x + y * cW) * 4;
                grayValue = canvasData.data[idx];
                totalGray += grayValue;
            }
        }
        var meanGray = totalGray / (size * size);
        var val;
        var array = [];
        for (x = 0; x < cW; x++) {
            for (y = 0; y < cH; y++) {
                // Index of the pixel in the array
                idx = (x + y * cW) * 4;
                grayValue = canvasData.data[idx];
                if (grayValue >= meanGray) {
                    val = 1;
                } else {
                    val = 0;
                }
                array.push(val);
            }
        }
        return parseInt(array.join(''), 2).toString(16);
    }

    function hamming(h1, h2) {
        var h1a = hashToBinaryArray(h1);
        var h2a = hashToBinaryArray(h2);
        var diff = 0;
        for (var i = 0; i < h1a.length; i++) {
            diff += h1a[i] ^ h2a[i];
        }
        return diff;
    }

    function isSimilar(img1, img2) {
        var h1 = hash(img1);
        var h2 = hash(img2);
        var threshHold = 10;
        var hammingDiff = hamming(h1, h2);
        console.log('汉明距离:' + hammingDiff);
        return hammingDiff < threshHold;
    }

    return {
        isSimilar: isSimilar
    };
});