const app = state => state.app
const dialog = state => state.app.dialog
const product = state => state.app.product
const effect = state => state.app.effect
const menuitems = state => state.menu.items
const componententry = state => {
    return state.menu.items.filter(c => c.meta && c.meta.label === 'Components')[0]
}

export {
    app,
    dialog,
    product,
    effect,
    menuitems,
    componententry
}