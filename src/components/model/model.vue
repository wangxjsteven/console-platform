<template>
    <vodal measure="em" :show="show" :mask="mask" :animation="animation" :width="28.5" :height="17" :duration="301" className="my-dialog" @hide="hide">
        <div v-if='type==="free"'>
            <slot></slot>
        </div>
        <div v-else>
            <div class="header">{{title}}</div>
            <div class="body">{{message}}</div>
            <button class="vodal-confirm-btn" v-if='!autohide' @keyup.enter="hide('ok')" @click="hide('ok')">确定</button>
            <button class="vodal-cancel-btn" v-if='!autohide' @click="hide">取消</button>
        </div>
    </vodal>
</template>
<script>
import 'vodal/common.css';

import Vue from 'vue';
import Vodal from 'vodal';
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex';
let timer = null;

export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        mask: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: ''
        },
        autohide: {
            type: Boolean,
            default: false
        },
        hidetime: {
            type: Number,
            default: 1500
        },
        title: {
            type: String,
            default: '提醒'
        },
        html: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: '无提示消息'
        }
    },
    components: {
        Vodal
    },
    data() {
        return {
            animation: 'zoom',
            paddingTop: `paddingTop: ${(window.innerHeight - 440) / 2}px`,
            types: ['zoom', 'door']
        }
    },
    mounted: function() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (e.which === 13) {
                self.hide('ok')
            }
        })
    },
    watch: {
        autohide: function() {
            if (this.autohide) {
                this.autoHide();
            }
        }
    },
    methods: {
        ...mapActions([
            "showDialog",
            "hideDialog"
        ]),
        autoHide: function() {
            let self = this;
            clearTimeout(timer);
            timer = setTimeout(function() {
                self.hide();
            }, this.hidetime);
        },
        hide: function(type) {
            clearTimeout(timer);
            this.$emit('hide', type || 'cancel');
        }
    }
}
</script>
<style lang='sass'>
@import './style/zoom.css';
@import './style/door.css';


/* -- container -- */

.vodal.my-dialog {
    z-index: 5000;
    /*position: absolute;*/
    width: 100%;
    height: 100%;
}

.my-dialog {
    #app,
    .wrap {
        height: 100%;
    }
    .container {
        width: 100%;
    }
    .title,
    .intro {
        color: #fff;
        text-align: center;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .title {
        font-size: 70px;
        margin: 0;
    }
    .intro {
        font-size: 30px;
        margin: 15px 10px 20px;
    }
    .btn-area {
        width: 600px;
        margin: 0 auto;
    }
    /* -- scale animation -- */
    @keyframes scale {
        from {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
        }
        to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
        }
    }
    .scale {
        animation: scale both .4s cubic-bezier(0.4, 0, 0, 1.5);
    }
    /* -- btn -- */
    .btn {
        display: inline-block;
        color: #0a1855;
        width: 140px;
        padding: 0;
        font-size: 18px;
        background: #fff;
        margin: 20px 30px;
        line-height: 42px;
        user-select: none;
        text-align: center;
        border: none;
        border-radius: 4px;
    }
    .btn:hover {
        box-shadow: 0 0 50px rgba(255, 255, 255, .3);
    }
    .btn:active {
        box-shadow: 0 0 50px rgba(255, 255, 255, .3), inset 2px 2px 2px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0);
    }
    @media (max-width: 600px) {
        .container {
            padding-top: 30px!important;
        }
        .title {
            font-size: 40px;
        }
        .intro {
            font-size: 20px;
        }
        .btn {
            width: 35%;
            font-size: 16px;
            line-height: 34px;
            margin: 10px 0 10px 10%;
        }
        .btn-area {
            width: 100%;
        }
    }
    /* -- title -- */
    .header {
        font-weight: bold;
        font-size: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9e9e9;
    }
    /* -- body -- */
    .body {
        padding-top: 15px;
    }
    /* -- button -- */
    .vodal-cancel-btn,
    .vodal-confirm-btn {
        position: absolute;
        font: inherit;
        bottom: 16px;
        width: 70px;
        padding: 4px 15px;
        border-radius: 3px;
        transition: background .2s;
        border: 1px solid #03a9f4;
    }
    .vodal-confirm-btn {
        color: #fff;
        right: 102px;
        background: #03a9f4;
    }
    .vodal-confirm-btn:hover {
        background: #0098e3;
    }
    .vodal-cancel-btn {
        color: #03a9f4;
        right: 16px;
        background: #fff;
    }
    .vodal-cancel-btn:hover {
        background: #fafafa;
    }
    .vodal-cancel-btn:focus,
    .vodal-confirm-btn:focus {
        outline: none;
    }
    .vodal-confirm-btn:active {
        background: #0087d2;
    }
    .vodal-cancel-btn:active {
        background: #fafafa;
        box-shadow: inset 1px 1px 1px rgba(0, 0, 0, .2), 0 0 1px transparent;
    }
}
</style>