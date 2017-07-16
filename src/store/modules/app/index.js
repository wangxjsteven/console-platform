import * as types from '../../mutation-types'

const state = {
    dialog: {
        show: false,
        type: '',
        title: '提醒',
        message: '',
        ok: function() {
            state.dialog.show = false;
        },
        cancel: function() {
            state.dialog.show = false;
        }
    },
    effect: {
        translate3d: true
    },
    product: {
        status: ''
    }
}

const mutations = {
    [types.TOGGLE_DIALOG](state, opts) {
        if (typeof opts === 'string') {
            state.dialog = {
                show: true,
                type: '',
                title: '提醒',
                message: opts || '',
                ok: function() {
                    state.dialog.show = false;
                },
                cancel: function() {
                    state.dialog.show = false;
                }
            }
        } else {
            if (!opts.show && typeof opts.show !== 'undefined') {
                if (opts.button === 'ok') {
                    state.dialog.ok && state.dialog.ok();
                } else if (opts.button === 'cancel') {
                    state.dialog.cancel && state.dialog.cancel();
                }
            }
            state.dialog = {
                show: typeof opts.show === 'undefined' ? true : opts.show,
                type: opts.type || '',
                autohide: opts.autohide || false,
                hidetime: opts.hidetime || 1000,
                title: opts.title || '提醒',
                message: opts.message || '',
                ok: opts.ok || function() {
                    state.dialog.show = false;
                },
                cancel: opts.cancel || function() {
                    state.dialog.show = false;
                }
            }
        }
    },

    [types.STORE_PRODUCT](state, setProduct) {
        for (let name in setProduct) {
            state.product[name] = setProduct[name]
        }
    },

    [types.SWITCH_EFFECT](state, effectItem) {
        for (let name in effectItem) {
            state.effect[name] = effectItem[name]
        }
    }
}

export default {
    state,
    mutations
}