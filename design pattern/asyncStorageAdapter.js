const localStorage = (() => {
    const store = new Map()
    return {
        getItem(key) {
            return store.has(key) ? store.get(key) : null
        },
        setItem(key, value) {
            store.set(key, String(value))
        },
        get Length() {
            return store.size
        },
        clear() {
            store.clear()
        }
    }
})()


class AsyncStorageAdapter {
    constructor(syncStorage) {
        this._storage = syncStorage
    }
    async getItem(key) {
        const raw = this._storage.getItem(key)
        try {
            return JSON.parse(raw)
        } catch (error) {
            return raw
        }
    }
    async setItem(key, val) {
        this._storage.setItem(key, val)
    }
    async clear() {
        this._storage.clear();
    }
    async Length(){
        return this._storage.size
    }

}

async function runAsyncStorageDemo() {
    const storage = new AsyncStorageAdapter(localStorage)

    await storage.setItem("user", "amrit")

    const length = await storage.Length()
    const user = await storage.getItem("user")

    await storage.clear()

    return {
        length,
        user
    }
}
async function main() {
    const result = await runAsyncStorageDemo()
    console.log(result)
}
main()