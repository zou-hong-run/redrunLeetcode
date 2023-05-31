<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue';
const htmlVal = ref("<button onclick='test()'>hello world</button>");
const cssVal = ref("h1{color:red;}");
const jsVal = ref("function test(){alert('12334');}");
const showHtmlRef = ref();
const showLog = ref("<br/>");
const countLine = ref(1);
watch([htmlVal, cssVal, jsVal], () => {
    run()
});
onMounted(() => {
    const console = window.console;
    console.log = (val) => {
        showLog.value = showLog.value + "<br/>" + countLine.value + ":              " + val;
    }
    run()
})
const run = () => {
    showHtmlRef.value.contentDocument.body.innerHTML = htmlVal.value + `<style>${cssVal.value}</style>`
    showHtmlRef.value.contentWindow.eval(jsVal.value);
    showHtmlRef.value.contentWindow.console.log = (val) => {
        showLog.value = showLog.value + "<br/>" + countLine.value + ":              " + val;
        countLine.value = countLine.value + 1;
    }
    
}
</script>

<template>
    <div class="contain">
        <div class="left">
            <div class="mHtml">
                <textarea v-model="htmlVal"></textarea>
            </div>
            <div class="mCss">
                <textarea v-model="cssVal"></textarea>
            </div>
            <div class="mJs">
                <textarea v-model="jsVal"></textarea>
            </div>
        </div>
        <div class="right">
            <div class="showHtml">
                <iframe ref="showHtmlRef"></iframe>
            </div>
            <div class="showLog" v-html="showLog"></div>
        </div>
    </div>
</template>


<style scoped lang='scss'>
.contain {
    width: 100%;
    height: 100%;
    display: flex;

    .left {

        min-width: 350px;
        width: 30%;
        height: 100%;
        background-color: white;
        padding-left: 20px;

        .mHtml {
            text-align: center;
            position: relative;
            width: 100%;
        }

        .mCss {
            position: relative;
            text-align: center;
            width: 100%;
        }

        .mJs {
            text-align: center;
            position: relative;
            width: 100%;
        }

        .mHtml::before {
            margin: 0 auto;
            display: block;
            content: "HTML";
            width: 200px;
            height: 30px;
            line-height: 30px;
            background-color: #50F1F1;
            opacity: 0.4;
        }

        .mCss::before {
            content: "CSS";
            margin: 0 auto;
            display: block;
            width: 200px;
            height: 30px;
            line-height: 30px;
            background-color: #50F1F1;
            opacity: 0.4;
        }

        .mJs::before {
            content: "JS";
            margin: 0 auto;
            display: block;
            width: 200px;
            height: 30px;
            line-height: 30px;
            background-color: #50F1F1;
            opacity: 0.4;
        }

        textarea {
            background-color: black;
            color: white;
            padding: 20px;
            max-width: calc(100% - 10px);
            width: calc(100% - 10px);
            height: calc(300px - 40px);
            font-size: 20px;
        }
    }

    .right {
        width: 70%;
        height: 100%;

        .showHtml {
            position: relative;
            width: 100%;
            height: calc(60%);
            background-color: white;
            padding: 0 40px;

            iframe {
                background-color: white;
                width: 100%;
                height: calc(100% - 30px);
                border-radius: 5px;
            }
        }

        .showHtml::before {
            content: "输出";
            color: black;
            margin: 0 auto;
            display: block;
            text-align: center;
            width: 200px;
            height: 30px;
            line-height: 30px;
            background-color: rgb(199, 221, 221);
            opacity: 0.4;
        }

        .showLog::before {
            color: white;
            white-space: pre-wrap;
            content: "控制台输出 : ";
        }

        .showLog {
            overflow: scroll;
            color: rgb(240, 240, 132);
            background-color: black;
            width: 100%;
            height: 40%;
            border: 40px solid white;
        }
    }
}
</style>