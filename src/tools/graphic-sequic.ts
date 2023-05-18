// 核心算法

type nodeType = {
    value: number,
    node: string
}

const removeItemNumber = (array: Array<nodeType>, targer: number) => {
    let index = array.findIndex(item => item.value === targer);
    while (index !== -1) {
        array.splice(index, 1);
        index = array.findIndex(item => item.value === targer)
    }
}

/**
 * 注：在下面的注释中，“序数”或“数”的称呼在一定条件下就是度数，但是不是所有情况都为度数（例如非度序列的时候）所以下述描述都是以“数”或“序数”来进行描述每个数值。
 */
// 核心算法函数
export const computeGraphSeq = (seq: number[]) => {
    // 点线关系栈，格式为 (Node1-Node2)
    const results = []
    // 将输入的度序列值与结点号绑定
    const seqTemp: Array<nodeType> = seq.map((item, index) => ({
        value: item,
        node: `${index}`
    }))

    // 将seqTemp存储的值按照序列的值从大到小进行
    seqTemp.sort((a, b) => b.value - a.value);

    // 非负数以及握手定理进行判定，序列数之和不是偶数，则一定不是图序列
    if (seq.reduce((pre, cur) => pre + cur, 0) % 2 !== 0 || seq.find(item => item < 0)) {
        return 0;
    }


    // 开始进行算法递归，将最大的数分配给余下的几个数，并在每一轮的结束去掉度为0的点，一直循环，如果seqTemp空，说明所有点的每个度都找好了匹配点，且是唯一一条边（简单图），则退出循环
    while (seqTemp.length !== 0 ) {
        // 取第一个数，也是最大的数
        const max = seqTemp.shift() as nodeType;
        // processSeq.push(max);
        // 第一个度不足以分配，不是简单图，即序列不是图序列
        if (max.value > seqTemp.length) {
            return 0;
        }
        
        // 递归算法核心：把第一个序数拆成若干个1和后续的序数做匹配（也就是点与点的度匹配）
        for (let index = 0; index < max.value; index++) {
            seqTemp[index].value = seqTemp[index].value - 1;
            // 递归过程中，因为最大的那个数分配了一度给后面的数，所以这里可以记录两点之间的关系（即记录边关系）
            results.push(`${max.node}-${seqTemp[index].node}`)
        }

        
        // 因为在上面分配度数时已经记录了点信息，所以这里可以放心把序数为0的点给去掉
        removeItemNumber(seqTemp, 0);
        seqTemp.sort((a, b) => b.value - a.value);
    }

    return results;
}