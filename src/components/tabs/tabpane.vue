<style lang="sass">
.animated {
    animation-duration: .377s;
    animation-fill-mode: both;
}

@keyframes fadeIn {
    from {
        opacity: 0
    }
    to {
        opacity: 1
    }
}

.fadeIn {
    animation-name: fadeIn
}

@keyframes fadeOut {
    from {
        opacity: 1
    }
    to {
        opacity: 0
    }
}

.fadeOut {
    animation-name: fadeOut
}
.tabs .tabpane{
    padding-top: 10px;
}
</style>
<template>
    <transition :name="animation" mode="out-in" appear :appear-active-class="transition.enterClass" :enter-active-class="transition.enterClass" :leave-active-class="transition.leaveClass">
        <div role="tabpanel" v-show="tabClickIndex" :class="classObject" :aria-labelledby="label" :aria-hidden="hidden">
            <slot></slot>
        </div>
    </transition>
</template>
<script>
const TS = {
    'fade': {
        enterClass: 'fadeIn',
        leaveClass: 'fadeOut'
    }
}

export default {
    props: {
        icon: String,
        selected: Boolean,
        disabled: Boolean,
        label: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            default: 'out-in'
        }
    },

    data() {
        return {
            tabClickIndex: this.selected,
            transition: TS['fade']
        }
    },

    created() {
        this.$parent.tabPanes.push(this)
    },

    beforeDestroy() {
        this.$parent.tabPanes.splice(this.index, 1)
    },

    computed: {
        animation() {
            return this.$parent.animation
        },
        hidden() {
            return this.tabClickIndex ? 'false' : 'true'
        },
        classObject() {
            const {
                tabClickIndex
            } = this
            return {
                'tabpane': true,
                'animated': true,
                'is-active': tabClickIndex,
                'is-deactive': !tabClickIndex
            }
        },
        index() {
            return this.$parent.tabPanes.indexOf(this)
        }
    },

    watch: {
        '$parent.tabClickIndex' (index, prevIndex) {
            this.tabClickIndex = this.index === index
        }
    }
}
</script>
