<script setup >
import { ref, reactive, onMounted, watch, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getDataItem } from '../util/data';
import JsonEditor from '../components/JsonEditor.vue';
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import markdownToText from 'markdown-to-text'
import axios from 'axios';
import JSConfetti from 'js-confetti'

// 恭喜
const confetti = new JSConfetti();

const route = useRoute();
const router = useRouter();
// 页面id
let id = ref(route.params.id);

// 跳转到其他页面的时候，也会触发这个监听
watch(() => route.params, () => {
    id.value = route.params.id;
    if (!id.value) {
        // router.push("/leetcode");
        // console.log("?????",id.value);
        return
    }
    getMd(id.value);
})
// 所有题目
const dataItems = reactive(getDataItem());
// 题目id
if (dataItems && id.value) {
    let result = dataItems.find(item => item.id == id.value)
    if (!result) {
        alert("查无此题");
        router.push("/leetcode")
    }
} else {
    alert("题库为空！！")
}

// 左边显示题目
const text = ref("");
// 右边显示答题区
const textFunc = ref(`
/*请在函数内部书写解题思路*/
function resolve(a,b){
    return a+b;
}
`)
// const textFunc = ref(`
// function resovle(nums, target) {
//     for(let i=0;i<nums.length;i++){
//         for(let j=nums.length-1;j>i;j--){
//                 if((nums[i]+nums[j])===target){
//                     console.log(i,j)
//                     console.log(nums[i],nums[j],target)
//                     return [i,j]
//                 }
//         }
//     }
// }
// `)
onMounted(() => {
    getMd(id.value);
})
// 得到题目
const getMd = async (page) => {
    try {
        let result = await axios.get(`/md/question${page}.md`);
        text.value = result.data
        newText.value = markdownToText(text.value)
    } catch (err) {
        alert("查无此题！！！");
        router.push("/leetcode");
        // console.log(err);
    }
};
// 提交答案
const submitCode = () => {
    // debugger
    try {
        checkFunc();
    } catch (error) {
        alert("代码格式有问题!!!!!请检查代码书写是否正确");
        return
    }
}
// 验证答案函数
const checkFunc = () => {
    let result = dataItems.find(item => {
        return item.id == id.value;
    });
    // 将 待验证的数据和答案一一对应上
    let index = 0;
    // 输入项数组 lg:[[1,2],[3,4]]
    let inputItem = result.input;
    // 结果数组 lg:[3,7]
    let resultItem = result.result;
    // 是否回答错误
    let isWrong = false;
    inputItem.forEach(iptVal => {
        debugger
        iptVal = toRaw(iptVal)
        let resolvedAnswer = computedResolve(iptVal[0], iptVal[1]);
        // 验证答案
        if (checkIsPass(resolvedAnswer, resultItem[index])) {
            index++;
        } else {
            isWrong = true;
        }
    });
    // // 全部回答正确
    if (!isWrong && index == resultItem.length) {
        alert("题解正确！！！！");
        for (let i = 1; i <= 10; i++) {
            setTimeout(()=>{
                confetti.addConfetti()
            },i*200);
        };
    }
    if (isWrong) {
        alert("题解错误！！！")
    }
}
// 检查是否通过
const checkIsPass = (input, result) => {
    if (Array.isArray(input)) {
        let index = 0;
        let isCheckd = false;
        input.forEach(item => {
            if (item == result[index]) {
                isCheckd = true;
            } else {
                return false;
            }
            index++;
        })
        if (isCheckd) {
            return true;
        } else {
            return false;
        }
    } else {// 答案不是数组直接比较结果
        return input == result
    }
}
// 计算结果
const computedResolve = (str, pattern) => {
    let newStr = str;
    let newPattern = pattern;
    if (Array.isArray(newStr)) {
        if(newStr.length <= 1){
            newStr = newStr[0]
        }
        newStr = JSON.stringify(newStr);
    }
    if (Array.isArray(newPattern)) {
        if(newPattern.length <= 1){
            newPattern = newPattern[0]
        }
        newPattern = JSON.stringify(newPattern);
    }
    // if (Array.isArray(newStr)) {
    //     newStr = `[${newStr}]`;
    // }
    // if (Array.isArray(newPattern)) {
    //     newPattern = `[${newPattern}]`;
    // }
    let result = eval(`(${textFunc.value})(${newStr},${newPattern})`);
    return result;
}

// 去上一题
const preQ = () => {
    if (id.value <= 1) {
        alert("这是第一题了！！！！！！");
        return
    }
    id.value--;
    router.push("/question/" + id.value);
}
const newText = ref("")
// 去下一题
const nextQ = () => {
    let allLength = dataItems.length;
    if (id.value >= allLength) {
        alert("已经是最后第一题了哦！！！！");
        return
    };
    id.value++;
    router.push("/question/" + id.value);
}

</script>

<template>
    <div class="lee">
        <div class="left">
            <div class="selectQuestion">
                <button @click="preQ">上一题</button>
                <span>{{ id }}/{{ dataItems.length }}</span>
                <button @click="nextQ">下一题</button>
            </div>
            <div class="showMd">
                <!-- <div v-html="newText"></div> -->
                <!-- 没有影响的报错 -->
                <MdPreview :modelValue="text" :showCodeRowNumber="true" />
                <!-- 不太好看 -->
                <!-- <MdPreview v-model="newText" /> -->
            </div>

            <div class="showTip">加油，马上就做出来了</div>
        </div>
        <div class="right">
            <div class="currentQ">当前是第<span style="color:rgb(92, 129, 250);">{{ id }}</span>题</div>
            <div class="writeCode">
                <JsonEditor v-model="textFunc" />
            </div>
            <div class="bottomItem">
                <button @click="submitCode">提交代码</button>
            </div>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.lee {
    width: 100%;
    height: 100%;
    display: flex;

    .left {
        width: 50%;
        height: 100%;
        padding: 2px;

        .selectQuestion {
            width: 100%;
            height: 5%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: aliceblue;

            button {
                height: 30px;
                border-radius: 5px;
                width: 150px;
                background-color: antiquewhite;
            }

            button:hover {
                background-color: beige;
            }

            span {
                height: 30px;
                line-height: 30px;
                text-align: center;
                width: 150px;
            }
        }

        .showMd {
            overflow-y: scroll;
            overflow-x: scroll;
            width: 100%;
            height: 90%;
        }

        .showTip {
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            background-color: aliceblue;
            width: 100%;
            height: 5%;
            line-height: 40px;
        }
    }

    .right {
        // background-color: red;
        // overflow: scroll;
        width: 50%;
        height: 100%;
        padding: 2px;

        .currentQ {
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            background-color: aliceblue;
            width: 100%;
            height: 5%;
            line-height: 40px;
        }

        .writeCode {
            width: 100%;
            height: 90%;
        }

        .bottomItem {
            background-color: aliceblue;
            width: 100%;
            height: 5%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            button {
                width: 200px;
                height: 30px;
                border-radius: 5px;
                background-color: white;
            }
        }
    }
}
</style>