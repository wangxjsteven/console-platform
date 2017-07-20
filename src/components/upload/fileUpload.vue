<template>
    <input type="file" name="fileUpload" @change="onFileChange">
</template>
<script>
export default {
    name: 'fileupload',
    props: {
        target: {
            type: String
        },
        action: {
            type: String,
            default: 'POST'
        }
    },
    data() {
        return {
            file: null
        }
    },
    methods: {
        emitter(event, data) {
            this.$emit(event, data)
        },
        uploadProgress(oEvent) {
            let vm = this
            if (oEvent.lengthComputable) {
                let percentComplete = Math.round(oEvent.loaded * 100 / oEvent.total)
                vm.emitter('progress', percentComplete)
            } else {
                // Unable to compute progress information since the total size is unknown
                vm.emitter('progress', false)
            }
        },
        onFileChange(e) {
            let vm = this
            if (!this.target || this.target === '') {
                console.log('上传地址不能为空')
            } else if (this.action !== 'POST' && this.action !== 'PUT') {
                console.log('文件上传仅支持 POST 和 PUT 类型')
            } else {
                let files = e.target.files || e.dataTransfer.files
                if (!files.length) {
                    return
                };
                /*global FormData XMLHttpRequest:true*/
                /*eslint no-undef: "error"*/
                this.file = files[0]
                let formData = new FormData()
                formData.append('file', this.file)
                var xhr = new XMLHttpRequest()
                xhr.open(this.action, this.target)
                xhr.onloadstart = function(e) {
                    vm.emitter('start', e)
                }
                xhr.onloadend = function(e) {
                    vm.emitter('finish', e)
                }
                xhr.upload.onprogress = vm.uploadProgress
                xhr.send(formData)
            }
        }
    }
}
</script>