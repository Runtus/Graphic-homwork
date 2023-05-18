<script setup lang="ts">
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { getNodesInfo, Link } from './graph'
import { onMounted, ref } from 'vue';


echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer]);

const isGraph = ref(true)

const render = (seq: Array<number>) => {
    const graphs = getNodesInfo(seq)
    console.log("seq", seq)
    console.log("graphs", graphs)
    
    if (!graphs) {
        isGraph.value = false
        return
    }

    isGraph.value = true

    setTimeout(() => {
        const chartDom = document.getElementById('graph') as HTMLElement;
        const myChart = echarts.init(chartDom);
        let option;


        option = {
            title: {
                text: 'The Graph'
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'circular',
                    symbolSize: 20,
                    roam: true,

                    label: {
                        show: true
                    },
                    edgeSymbol: ['circle'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 16
                    },
                    data: graphs.nodes.map(item => ({ name: item })),
                    // links: [],
                    links: graphs.links,
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            ]
        };

        // @ts-ignore
        myChart.setOption(option);
    }, 100)

}


defineExpose({
    render
})





</script>

<template>
    <div id="graph" v-if="isGraph">

    </div>
    <div id="no" v-else>
        序列不是图序列，不能生成简单图
    </div>
</template>

<style  scoped>
#graph, #no {
    width: 100%;
    height: 400px;
}

</style>