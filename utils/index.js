export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

export async function promiseAllInBatches(task, items, batchSize) {
try {
    let position = 0;
    let results = [];
    while (position < items.length) {
        const itemsForBatch = items.slice(position, position + batchSize);
        results = [...results, ...await Promise.all(itemsForBatch.map(item => task(item)))];
        position += batchSize;
    }
    return results;
} catch (error) {
    console.log(error)
}
}
