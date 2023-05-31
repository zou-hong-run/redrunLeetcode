<template>
  <div class="mdContainer" v-if="!isShowForm">
    <MdEditor ref="editorRef" class="mdEE" @onSave="onSave" v-model="text" />
    <div class="qBottom">
      <button @click="handlerSave">添加算法题目</button>
    </div>
  </div>
  <div class="addQM" v-else>
    <form action="#">
      <input v-model="questionItem.title" placeholder="请输入算法标题" type="text">
      <input v-model="questionItem.level" placeholder="请输入算法难度等级" type="text">
      <textarea v-model="questionItem.input" placeholder="请输入示例题目 例如[ [ ['456'],[] ],[ ['123'],[] ],[ ['111'],[] ]]" />
      <textarea v-model="questionItem.result" placeholder="请输入示例答案 例如：[false,false,true]" />
      <button @click="addQ">添加题目</button>
    </form>
  </div>
</template>
  
<script setup>
import { onMounted, reactive, ref, toRaw } from 'vue';
import { MdEditor } from 'md-editor-v3';
import { useRouter } from 'vue-router'
import 'md-editor-v3/lib/style.css';
import axios from 'axios';

import { getDataItem, setDataItem } from '../util/data';
const router = useRouter()

// 实例
const editorRef = ref(null);
// 内容
const text = ref(`# 123`);
// 文件名
const mdFileName = ref('');
// 问题细节
const questionItem = reactive({
  id: '',
  title: "",
  level: "",
  status: "",
  md: mdFileName.value,
  input: [],
  result: []
});
// 显示添加问题详情
const isShowForm = ref(false);

// 手动保存方法
const handlerSave = () => {
  editorRef.value?.triggerSave();
  isShowForm.value = true;//显示添加题目详情表单
}
// 添加题目
const addQ = (e) => {
  e.preventDefault();
  if (
    !questionItem.title ||
    !questionItem.level ||
    !questionItem.input ||
    !questionItem.result
  ) {
    alert("填入项不能为空");
    return
  }
  questionItem.md = mdFileName.value;
  questionItem.id = getDataItem().length + 1;
  let { id, title, level, status, md, input, result } = toRaw(questionItem);
  if (typeof input === 'string') {
    input = JSON.parse(input);
  }
  if (typeof result === 'string') {
    result = JSON.parse(result);
  }

  // console.log(id,title,level,status,md,input,result);
  let resultItem = { id, title, level, status, md, input, result };
  // 添加题目
  setDataItem(resultItem);
  router.push("/leetcode")
}
// mdeditor原生事件
const onSave = (v, h) => {
  let dataItems = getDataItem();
  // console.log(v);原内容 #ccc
  h.then((html) => {
    // console.log(html);html内容
    mdFileName.value = saveDataToLocalFile(v, dataItems.length + 1);
  });
};
// 保存文件到本地
const saveDataToLocalFile = (data, id) => {
  var a = document.createElement('a');
  var fileName = `question${id}.md`;
  var filePath = '/path/to/local/file/' + fileName;
  if (typeof data === 'string') {
    a.href = URL.createObjectURL(new Blob([data]));
  } else {
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  }
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  return fileName;
}

/*
function saveTextToFile(text, fileName) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
  }

  function saveText(data){
      var blob = new Blob([data], { type: 'text/plain' });

      // 创建一个 File 对象，并将 Blob 对象作为参数传入
      
      * // var file = new File([blob], 'data.md');

      // 使用 File 对象的 saveAs() 方法将数据保存到本地文件中
      // file.saveAs('data.md');
      
      // 生成一个临时的 URL
      var url = URL.createObjectURL(blob);

      // 在新窗口中打开文件并下载文件
      window.open(url);
  }

*/

</script>
<style lang="scss" scoped>
.mdContainer {
  width: 100%;
  height: 100%;

  .mdEE {
    width: 100%;
    height: 95%;
  }

  .qBottom {
    width: 100%;
    height: 5%;
    display: flex;
    justify-content: center;

    button {
      width: 200px;
      border-radius: 5px;
      background-color: rgb(252, 252, 252);
    }
  }
}
.addQM{
  width: 100%;
  height: 100%;
  padding: 80px;
  background-color: #b8cefc;
  input{
    padding: 5px;
    border: none;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 100%;
    height: 30px;
  }
  textarea{
    padding: 5px;
    border: none;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 100%;
    height: 200px;
  }
  button:hover{
    background-color: #f56f6f;
  }
  button{
    border: none;
    width: 200px;
    height: 40px;
    border-radius: 5px;
    background-color:aliceblue;
  }

}
</style>