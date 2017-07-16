<template>
    <vodal measure="em" :show="show" :mask="mask" :animation="animation" :width="28.5" :height="17" :duration="301" className="md-upload-dialog" @hide="hide">
            <div class="header">{{title}}</div>
        <vue-clip :options='clipOptions'>
            <template slot="clip-uploader-action">
                <div>
                    <div class="dz-message">
                        <p> 点击或拖拽文件到此处上传 </p>
                    </div>
                </div>
            </template>
            <template slot="clip-uploader-body" scope="props">
                <div v-for="file in props.files">
                    <img v-bind:src="file.dataUrl" /> {{ file.name }} {{ file.status }}
                </div>
            </template>
        </vue-clip>
        <div class="md-upload-buttons">
            <button class="btn btn-primary" @click="operate('ok')">导入</button>
            <button class="btn btn-primary" @click="operate('downModel')">下载模版</button>
            <button class="btn btn-default" @click="operate">取消</button>
        </div>
    </vodal>
</template>
<script>
import 'vodal/common.css';

import Vue from 'vue';
import Vodal from 'vodal';
let timer = null;

export default {
    props: {
        clipOptions: {
            type: Object,
            default: function() {
                return {
                    url: '/upload',
                    paramName: 'file'
                }
            }
        },
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
    methods: {
        hide: function(type) {
        },
        operate: function(type) {
            clearTimeout(timer);
            this.$emit('uploadEvent', type || '');
            switch(type){
                case 'ok':
                    break;
                    case 'down':
                    break;
                    default:
            this.$emit('hide', type || 'cancel');

            }
        }
    }
}
</script>
<style lang='sass'>
@import '../model/style/zoom.css';
@import '../model/style/door.css';
.md-upload-dialog{

    /* -- title -- */
    .header {
        font-weight: bold;
        font-size: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9e9e9;
    }
    .dz-message{
        background: #5d91e5;
        color: #fff;
        text-align: center;
        padding:20px;
        width: 100%;
        cursor: pointer;
    }
    .md-upload-buttons{
        position: absolute;
        bottom: 16px;
    }
}
</style>