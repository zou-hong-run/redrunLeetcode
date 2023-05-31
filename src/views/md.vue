<template>
  <div class="mdContainer">
    <MdEditor class="mdContainer" @onSave="onSave" v-model="text" />
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('Hello Editor!');

const onSave = (v, h) => {
  console.log(v);

  h.then((html) => {
    console.log(html);
    saveDataToLocalFile(html)
  });
};
function saveDataToLocalFile(data) {
  var a = document.createElement('a');
  var fileName = 'data.txt';
  var filePath = '/path/to/local/file/' + fileName;
  if (typeof data === 'string') {
    a.href = URL.createObjectURL(new Blob([data]));
  } else {
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  }
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
}
// function saveTextToFile(text, fileName) {
//   var element = document.createElement('a');
//   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
//   element.setAttribute('download', fileName);
//   element.style.display = 'none';

//   document.body.appendChild(element);
//   element.click();
// }
// function saveText(data){
//     var blob = new Blob([data], { type: 'text/plain' });

//     // 创建一个 File 对象，并将 Blob 对象作为参数传入
//     /**
//      * // var file = new File([blob], 'data.md');

//     // 使用 File 对象的 saveAs() 方法将数据保存到本地文件中
//     // file.saveAs('data.md');
//      */
//     // 生成一个临时的 URL
//     var url = URL.createObjectURL(blob);

//     // 在新窗口中打开文件并下载文件
//     window.open(url);
// }
</script>
<style lang="scss" scoped>
.mdContainer {
  width: 100%;
  height: 100%;
}
</style>