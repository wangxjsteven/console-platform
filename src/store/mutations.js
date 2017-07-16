import * as types from './mutation-types'

export const toggleDialog = ({
    commit
}, opts) => commit(types.TOGGLE_DIALOG, opts)