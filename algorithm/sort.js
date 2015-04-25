var testArr = [5, 3, 2, 1, 4, 8, 7, 9, 6, 0, -1, -2];
function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

/** 冒泡排序 */
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr, j, j+1);
            }
        }
    }
    return arr;
}

//bubbleSort(testArr);


/** 选择排序 */

function selectionSort(arr) {
    var len = arr.length;
    var min, minIndex;
    for (var i = 0; i < len; i++) {
        min = arr[i];
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < min) {
                min = arr[j];
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swap(arr, i, minIndex);
        }
    }
    return arr;
}

//selectionSort(testArr);


/** 插入排序 */

function insertSort_v1(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (j = i + 1; j > 0; j--) {
            if (arr[j] < arr[j-1]) {
                swap(arr, j, j-1);
            }
        }
    }    
}

function insertSort_v2(arr) {
    var len = arr.length;
    var val;
    for (var i = 0; i < len - 1; i++) {
        val = arr[i + 1];
        for (var j = i; j > -1 && arr[j] > val; j--) {
            arr[j+1] = arr[j];
        }
        arr[j + 1] = val;
    }    
}

//insertSort_v2(testArr);
console.log(testArr);


/** 合并排序 */


function merge(leftArr, rightArr) {
    var result  = [],
        il      = 0,
        ir      = 0;

    while (il < leftArr.length && ir < rightArr.length) {
        result.push(leftArr[il] > rightArr[ir] ? rightArr[ir++] : leftArr[il++]);
    }
    return result.concat(leftArr.slice(il)).concat(rightArr.slice(ir));
}

function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    var middle = Math.floor(arr.length / 2),
        leftArr    = arr.slice(0, middle),
        rightArr   = arr.slice(middle);

    var param = merge(mergeSort(leftArr), mergeSort(rightArr));
    // 在返回的数组头部，添加两个元素，第一个是0，第二个是返回的数组长度
    param.unshift(0, arr.length);

    // splice用来替换数组元素，它接受多个参数，
    // 第一个是开始替换的位置，第二个是需要替换的个数，后面就是所有新加入的元素。
    // 因为splice不接受数组作为参数，所以采用apply的写法。
    // 这一句的意思就是原来的myArray数组替换成排序后的myArray
    arr.splice.apply(arr, param);
    return arr;
}


/** 快速排序 */

function partition (arr, left, right) {
    var pivot = arr[Math.floor((left + right) / 2)],
        i = left,
        j = right;
    while (i <= j) {
        while ( arr[i] < pivot) {
            i++;
        }

        while (pivot < arr[j]) {
            j--;
        }

        if (i <= j) {
            swap(arr, i, j);
            i++; //向后移动
            j--; //向前移动
        } 
    }
    
    return i;
}

function quickSort(arr, left, right) {
    if (arr.length < 2) {
        return arr;
    }
    if (typeof left !== 'number') {
        left = 0;
    }
    if (typeof right !== 'number') {
        right = arr.length - 1;
    }
    var index = partition(arr, left, right);
    if (left < index - 1) {
        quickSort(arr, left, index - 1);
    }
    if (index < right) {
        quickSort(arr, index, right);
    }
    return arr;
}


