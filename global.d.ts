import type NodeCache from 'node-cache'

declare global {
    // eslint-disable-next-line no-var
    var cacheConfigs: NodeCache
    // eslint-disable-next-line no-var
    var cacheUser: NodeCache
    //your cache names
}

export { }
