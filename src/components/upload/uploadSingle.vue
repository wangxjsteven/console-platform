<template>
    <vodal measure="em" :show="show" :mask="mask" :animation="animation" :width="28.5" :height="17" :duration="301" className="md-upload-dialog" @hide="operate">
        <div class="header">{{title}}</div>
        <form class="form-group md-upload">
            <slot></slot>
            <template v-for="(item,index) in clipOptions.inputAdd" data-for='itemValue(item)'>
                <label for="inputPassword" class="col-sm-4 control-label">{{item.title}}</label>
                <div class="col-sm-8 input-box">
                    <select v-if="item.type==='select'" class="form-input" :value="item.value" v-model="modelValue[item.id]">
                        <option v-for="op in item.option" :value="op.value">{{op.text||op.name}}</option>
                    </select>
                    <input v-if="item.type==='number'" type="number" class="input form-input" :value="item.value" v-model.number="modelValue[item.id]">
                    <input v-if="item.type==='text'" type="text" class="input form-input" :value="item.value" v-model="modelValue[item.id]">
                    <p v-if="item.type==='p'" class="form-control-static">{{item.value}}</p>
                </div>
            </template>
            <input class="col-md-12" type="file" v-on:change='fileChange'>
            <a class="help-block col-md-12 md-help-block" @click="operate('down')" target="_blank">点此下载模板</a>
            <p class="help-block col-md-12" v-if='progressText'>{{progressText}}</p>
            <div class="md-upload-buttons">
                <button class="btn btn-primary" @click.prevent='operate("submit")'>提交</button>
                <button class="btn btn-default" v-if='modelUrl' @click="operate('cancel')">取消</button>
            </div>
        </form>
    </vodal>
</template>
<script>
import 'vodal/common.css';

import Vue from 'vue';
import Vodal from 'vodal';
import fileUpload from './fileUpload.vue'
let timer = null;

export default {
    components: {
        Vodal,
        fileUpload
    },
    props: {
        clipOptions: {
            type: Object,
            default: function() {
                return {
                    url: '',
                    paramName: 'file',
                    params: null,
                    inputAdd: [{
                        type: '',
                        name: '',
                        value: '',
                        readOnly: false
                    }]
                }
            }
        },
        action: {
            type: String,
            default: 'POST'
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
    data() {
        return {
            files: [],
            file: null,
            progressText: '',
            animation: 'zoom',
            paddingTop: `paddingTop: ${(window.innerHeight - 440) / 2}px`,
            types: ['zoom', 'door'],
            modelValue: {}
        }
    },
    mounted() {

    },
    watch: {
        show() {
            this.progressText = '';
            this.modelValue={}
        }
    },
    methods: {
        itemsModel: function(item) {
            let id = item.id,
                value = item.value;
            if (id instanceof Array) {
                for (let i in id) {
                    this.modelValue[id[i]] = value instanceof Array ? value[i] : value
                }
            } else {
                this.modelValue[id] = value
            }
        },
        emitter(event, data) {
            this.$emit(event, data)
        },
        uploadProgress(oEvent) {
            let self = this
            if (oEvent.lengthComputable) {
                let percentComplete = Math.round(oEvent.loaded * 100 / oEvent.total)
                self.emitter('progress', percentComplete)
                this.progressText = '上传进度：' + Math.floor(percentComplete) + '%';
            } else {
                // Unable to compute progress information since the total size is unknown
                self.emitter('progress', false)
            }
        },
        fileChange(e) {
            this.files = e.target.files || e.dataTransfer.files;
        },
        submit() {
            let self = this
            if (!this.clipOptions.url || this.clipOptions.url === '') {
                self.$store.commit('TOGGLE_DIALOG', '上传地址不能为空')
            } else if (this.action !== 'POST' && this.action !== 'PUT') {
                self.$store.commit('TOGGLE_DIALOG', '文件上传仅支持 POST 和 PUT 类型')
            } else {
                let files = this.files;
                if (!files.length) {
                    self.$store.commit('TOGGLE_DIALOG', '上传文件未选择')
                    return
                };
                /*global FormData XMLHttpRequest:true*/
                /*eslint no-undef: "error"*/
                this.file = files[0]
                let formData = new FormData()
                for (let name in this.modelValue) {
                    formData.append(name, this.modelValue[name])
                }
                let params = this.clipOptions.params;
                for (let name in params) {
                    formData.append(name, params[name])
                }
                formData.append('file', this.file)
                var xhr = new XMLHttpRequest()
                xhr.open(this.action, this.clipOptions.url)
                xhr.onloadstart = function(e) {
                    self.emitter('uploadEvent', { type: 'start', error: e })
                    self.progressText = '正在上传...';
                }
                xhr.onloadend = function(e) {
                    // self.emitter('finish', e)
                }
                xhr.onreadystatechange = function(e) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var res = JSON.parse(xhr.response);
                            if (res.code != 0) {
                                self.progressText = '上传失败';
                                self.emitter('uploadEvent', { type: 'failed', error: e })
                                self.$store.commit('TOGGLE_DIALOG', {
                                    message: res.message
                                });
                            } else {
                                self.progressText = '上传成功';
                                setTimeout(function() {
                                    self.emitter('uploadEvent', { type: 'success' })
                                    self.operate();
                                }, 300)
                            }
                        }
                    }
                }
                xhr.upload.onprogress = self.uploadProgress
                xhr.send(formData)
            }
        },
        operate(type) {
            this.$emit('uploadEvent', type || '');
            switch (type) {
                case 'submit':
                    this.submit();
                    break;
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
        margin-bottom: 10px;
    }
    .md-upload {
        .input-box {
            margin: 2px 0;
        }
        .control-label {
            padding-right: 0;
        }
        input {
            /*padding: 0;*/
            height: 26px;
            line-height: 24px;
        }
    }
    .md-upload-files {
        height: 70px;
        overflow: auto;
    }
    .md-help-block {
        cursor: pointer;
    }
    .md-upload-buttons {
        position: absolute;
        bottom: 16px;
        right: 16px ;
        .btn {
            min-width: auto;
            margin-right: auto;
        }
    }
}
</style>