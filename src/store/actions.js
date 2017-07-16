import * as types from './mutation-types'

export const showDialog = ({
    commit
}, opts) => commit(types.TOGGLE_DIALOG, opts)

export const hideDialog = ({
    commit
}, opts) => commit(types.TOGGLE_DIALOG, {
    show: false,
    button: opts
})

export const switchEffect = ({
    commit
}, effectItem) => {
    if (effectItem) {
        commit(types.SWITCH_EFFECT, effectItem)
    }
}