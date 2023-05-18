// export const computeSeq = (seq: number[]) => {
//     // const map = new Map<number, string>();
//     // for (let index = 0; index < seq.length; index++) {
//     //     map.set(index + 1, `Node${index + 1}`);
//     // }
//     // let iter = 0;

//     // 存储图中点线情况：格式为 1-2
//     const results = [];

//     const seqTemp = seq.map((item, index) => ({
//         value: item,
//         node: `${index}`
//     }))

//     const seqtemp = [...seq];
//     // 数组中间过程拷贝
//     const processSeq = [];
//     // 后续做处理
//     const length = seq.length;


//     seqtemp.sort((a, b) => b - a);
//     // 不满足简单图的基本性质：总度数为偶数，或者有负数项
//     if (seq.reduce((pre, cur) => pre + cur, 0) % 2 !== 0 || seq.find(item => item < 0)) {
//         console.log("合不为偶数")
//         return 0;
//     }

//     // 用于记录 正负的分界点
//     let cutOff = 0;

//     // 递归图序列中没有0出现时，继续迭代
//     while (seqtemp.findIndex(item => item === 0) === -1) {
       
//         // 取第一个数，也是最大的数
//         const max = seqtemp.shift() || 0;
//         processSeq.push(max);
//         // 第一个数超长度了，排除
//         if (max > seqtemp.length) {
//             break;
//         }
//         for (let index = 0; index < max; index++) {
//             seqtemp[index] = seqtemp[index] - 1;
//         }
//         // 每比较一轮，就要排一次序
//         seqtemp.sort((a, b) => b - a);
//     }
    

//     processSeq.push(...seqtemp)
//     // 如果刚好全部为0，则直接进入下一个环节
//     if (seqtemp.reduce((a, b) => a + b, 0) !== 0) {
//         // 判断迭代的最终度序列是否能形成简单图
//         for (let index = 0; index < seqtemp.length; index++) {
//             const sum = seqtemp.reduce((pre, cur, cIndex) => {
//                 if (cIndex <= index) {
//                     return pre + (-cur);
//                 } else {
//                     return pre + cur;
//                 }
//             }, 0)
//             if (sum === 0) {
//                 cutOff = index;
//                 break;
//             }
    
//             if (sum !== 0 && index === seqtemp.length - 1) {
             
//                 // 表示不是简单图，不是图序列
//                 return 0;
//             }
//         }
//     }
    

//     console.log("cutoff", cutOff)
//     // 迭代的次数即为
//     const iter = length - seqtemp.length;

//     // 对迭代后的简单图进行点线规划
//     const simpleIters = seqtemp.slice(0, cutOff + 1).reduce((pre, cur) => pre + cur, 0)
//     for (let index = 0; index < simpleIters; index++) {
//         let beforeIndex = 0;
//         let afterIndex = cutOff + 1;
//         while (seqtemp[beforeIndex] === 0) {
//             beforeIndex++;
//         }

//         while (seqtemp[afterIndex] === 0) {
//             afterIndex++;
//         }
//         seqtemp[beforeIndex]--;
//         seqtemp[afterIndex]--;

//         // Node从0开始计数
//         results.push(`${iter + beforeIndex}-${iter + afterIndex}`)
//     }
//     console.log(results)

//     for (let i = iter - 1; i >= 0; i--){
//         for (let index = 1; index <= processSeq[i]; index++) {
//             results.push(`${i}-${i+index}`)
//         }
//     }

//     return results;
// }


type nodeType = {
    value: number,
    node: string
}

// 核心算法
export const computeSeqGai = (seq: number[]) => {
    // 点线关系栈，格式为 (Node1 - Node2)
    const results = []
    // 将输入的度序列值与结点号绑定
    const seqTemp: Array<nodeType> = seq.map((item, index) => ({
        value: item,
        node: `${index}`
    }))

    // 将seqTemp存储的值按照度序列的值从大到小进行
    seqTemp.sort((a, b) => b.value - a.value);

    // 握手定理进行判定，序列数之和不是偶数，则一定不是图序列
    if (seq.reduce((pre, cur) => pre + cur, 0) % 2 !== 0 || seq.find(item => item < 0)) {
        return 0;
    }


    // 开始进行算法递归，如果判断序列中有数为0，则进行下一步操作
    while (seqTemp.findIndex(item => item.value === 0) === -1) {
        // 取第一个数，也是最大的数，并按依次分配给后续的序数
        const max = seqTemp.shift() as nodeType;
        // processSeq.push(max);
        // 第一个度不足以分配，不是简单图，即序列不是图序列
        if (max.value > seqTemp.length) {
            return 0;
        }
        
        // 递归算法核心
        for (let index = 0; index < max.value; index++) {
            seqTemp[index].value = seqTemp[index].value - 1;
            // 递归过程中，因为分配了一度，所以中途记录两点之间的关系（即记录边）
            results.push(`${max.node}-${seqTemp[index].node}`)
        }

        // 每比较一轮，就要排一次序
        seqTemp.sort((a, b) => b.value - a.value);
    }

    let cutOff = 0

    // 判断递归后的序列是否为0，如果为0，则表示该序列已经是图序列，直接返回点与边的关系
    // 否则，需要进一步判断是否为图序列
    if (seqTemp.reduce((preNumber, bValue) => preNumber + bValue.value, 0) !== 0) {
        // 判断迭代的最终度序列是否能形成简单图
        for (let index = 0; index < seqTemp.length; index++) {
            // 通过加减判断序列里面的度是否能够刚好一一匹配（即两点之间刚好没有重边）
            const sum = seqTemp.reduce((pre, cur, cIndex) => {
                if (cIndex <= index) {
                    return pre + (-cur.value);
                } else {
                    return pre + cur.value;
                }
            }, 0)

            // sum为0，说明刚好能一一匹配，则为图序列，直接进行下一步
            if (sum === 0) {
                cutOff = index;
                break;
            }
    
            // 判断了所有的匹配可能都没有出现刚好匹配的可能，则不是图序列
            if (sum !== 0 && index === seqTemp.length - 1) {
                console.log(114514)
                // 表示不是简单图，不是图序列
                return 0;
            }
        } 
    } else {
       // 该序列已经是图序列，直接返回点与边的关系
        return results;
    }

    // 提取递归后的简单图序列（走到这一步的情况都是图序列）的点线关系
    const simpleIters = seqTemp.slice(0, cutOff + 1).reduce((pre, cur) => pre + cur.value, 0)
    for (let index = 0; index < simpleIters; index++) {
        let beforeIndex = 0;
        let afterIndex = cutOff + 1;
        while (seqTemp[beforeIndex].value === 0) {
            beforeIndex++;
        }

        while (seqTemp[afterIndex].value === 0) {
            afterIndex++;
        }
        seqTemp[beforeIndex].value--;
        seqTemp[afterIndex].value--;

        // 收集点线关系
        results.push(`${seqTemp[beforeIndex].node}-${seqTemp[afterIndex].node}`)
    }

    return results;
}