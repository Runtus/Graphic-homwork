import { computeGraphSeq } from "../../tools/graphic-sequic"

export type Link = {
    source: string,
    target: string
}


export const getNodesInfo = (seq: Array<number>) => {
    const results = computeGraphSeq(seq);
    console.log("newSeq",computeGraphSeq(seq))
    const links: Array<Link> = [];
    if (results === 0) {
        return null
    }
    const nodesMap = new Map<string, boolean>()
    results.forEach(item => { 
        const chars = item.split("-");
        const node1 = chars[0];
        const node2 = chars[1];
        links.push({
            source: node1,
            target: node2
        })
        if (!nodesMap.has(node1)) {
            nodesMap.set(node1, true)
        }

        if (!nodesMap.has(node2)) {
            nodesMap.set(node2, true)
        }
    })

    const nodes: Array<string> = [];
    nodesMap.forEach((_, key) => {
        nodes.push(key)
    })

    return {
        nodes,
        links
    }
}

