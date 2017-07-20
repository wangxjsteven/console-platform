<template>
    <vodal measure="em" :show="show" :mask="mask" :animation="animation" :width="28.5" :height="17" :duration="301" className="md-upload-dialog" @hide="operate">
        <div class="header">{{title}}</div>
        <slot></slot>
        <vue-clip :options='clipOptions' :on-sending="sending">
            <template slot="clip-uploader-action">
                <div>
                    <div class="dz-message">
                        <p> 点击或拖拽文件到此处上传 </p>
                    </div>
                </div>
            </template>
            <template slot="clip-uploader-body" scope="props">
            <div class="md-upload-files">
                <div v-for="file in props.files">
                    <img v-bind:src="file.dataUrl" /> {{ file.name }} {{ file.status }}
                </div>
                </div>
            </template>
        </vue-clip>
        <div class="md-upload-buttons">
            <button class="btn btn-primary" @click="operate('down')">下载模版</button>
            <button class="btn btn-default" v-if='modelUrl' @click="operate('cancel')">取消</button>
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
                    url: '',
                    paramName: 'file',
                    params: null
                }
            }
        },
        modelUrl: '',
        show: {
            type: Boolean,
            default: false
        },
        mask: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '上传'
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
        sending: function(file, xhr, formData) {
            // let params = this.clipOptions.params;
            // if (params) {
            //     for (let name in params) {
            //         formData.append(name, params[name])
            //     }
            // }
        },
        complete: function(file, xhr, formData) {
            // let params = this.clipOptions.params;
            // if (params) {
            //     for (let name in params) {
            //         formData.append(name, params[name])
            //     }
            // }
        },
        operate: function(type) {
            this.$emit('uploadEvent', type || '');
            switch (type) {
                case 'down':
                    window.open(this.modelUrl, '_blank');
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
.md-upload-dialog {

    /* -- title -- */
    .header {
        font-weight: bold;
        font-size: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9e9e9;
    }
    .dz-message {
        margin-top: 10px;
        background: #5d91e5;
        color: #fff;
        text-align: center;
        padding: 20px;
        width: 100%;
        cursor: pointer;
    }
    .md-upload-files {
        height: 70px;
        overflow: auto;
    }
    .md-upload-buttons {
        position: absolute;
        bottom: 16px;
        right: 15px;
    }
}
</style>